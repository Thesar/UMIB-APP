import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// This opt-in check creates two isolated guest accounts and two labelled notes.
// It uses only the app's publishable key; it never reads an existing user's notes.
if (!process.argv.includes('--live')) {
  console.error('Run with --live against the configured Supabase project. See CHECKOFF-J6.md.');
  process.exit(1);
}

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
assert.ok(url && key, 'Set the public Supabase URL and publishable key in .env.local.');
const client = () => createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: { fetch: (input, options) => fetch(input, { ...options, signal: AbortSignal.timeout(20000) }) },
});

function checked({ data, error }, operation) {
  if (error) {
    const code = String(error.code ?? error.status ?? 'request');
    throw new Error(`${operation} failed (${/^[\w]+$/.test(code) ? code : 'request'}).`);
  }
  return data;
}

const first = client();
const second = client();
const reopened = client();

try {
  const publicClient = client();
  const lesson = checked(await publicClient.from('lessons').select('id').eq('id', 's2').single(), 'Public lesson read');
  assert.ok(lesson.id === 's2', 'Amplitude must be available.');
  const publicRead = await publicClient.from('study_notes').select('id');
  assert.ok(publicRead.error?.code === '42501', 'Unauthenticated note reads must be denied.');
  console.log('PASS: public lessons work; private notes require authentication.');

  const accountA = checked(await first.auth.signInAnonymously(), 'Guest A sign-in');
  const accountB = checked(await second.auth.signInAnonymously(), 'Guest B sign-in');
  assert.ok(accountA.user.id !== accountB.user.id, 'The test must use different accounts.');
  const fixtures = [
    { id: randomUUID(), user_id: accountA.user.id, lesson_id: 's2', body: '[J6 API check] Account A: A changes wave height.' },
    { id: randomUUID(), user_id: accountB.user.id, lesson_id: 's2', body: '[J6 API check] Account B: amplitude does not change the period.' },
  ];
  checked(await first.from('study_notes').insert(fixtures[0]), 'Account A insert');
  checked(await second.from('study_notes').insert(fixtures[1]), 'Account B insert');
  console.log('PASS: both accounts can save their own note.');

  // Deliberately omit the app's user_id filter: RLS itself must hide other owners.
  for (const [own, other, api] of [
    [fixtures[0], fixtures[1], first],
    [fixtures[1], fixtures[0], second],
  ]) {
    const rows = checked(await api.from('study_notes').select('id,user_id'), 'Unfiltered note read');
    assert.ok(rows.length === 1 && rows[0].id === own.id && rows[0].user_id === own.user_id,
      'An unfiltered read must return only the isolated account\'s own note.');
    const hidden = checked(await api.from('study_notes').select('id').eq('id', other.id), 'Cross-account read');
    assert.ok(hidden.length === 0, 'The other account\'s row must remain hidden.');
    const forged = await api.from('study_notes').insert({
      user_id: other.user_id, lesson_id: 's2', body: '[J6 API check] This forged-owner insert must fail.',
    });
    assert.ok(forged.error?.code === '42501', 'An insert claiming the other owner must be rejected.');
  }
  console.log('PASS: unfiltered reads and direct row requests isolate both accounts.');
  console.log('PASS: both forged-owner inserts are denied by RLS.');

  checked(await reopened.auth.setSession({
    access_token: accountA.session.access_token,
    refresh_token: accountA.session.refresh_token,
  }), 'Session restoration');
  const saved = checked(await reopened.from('study_notes').select('id').eq('id', fixtures[0].id).single(), 'Restored owner read');
  assert.ok(saved.id === fixtures[0].id, 'The note must persist after restoring the session.');
  console.log('PASS: a restored session can read its saved note.');
  console.log('Live API checks passed. The two labelled fixtures stay in isolated test accounts.');
  console.log('This does not replace the two-phone test or the in-class check-off.');
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Privacy verification failed.');
  process.exitCode = 1;
} finally {
  await Promise.allSettled([first.auth.signOut(), second.auth.signOut(), reopened.auth.signOut()]);
}
