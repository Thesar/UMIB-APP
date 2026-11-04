import { getSupabase } from '@/lib/supabase';

const noteColumns = 'id,user_id,lesson_id,body,created_at';
let pendingSignIn: Promise<string> | null = null;

async function signInForNotes() {
  const client = getSupabase();
  const { data: existing, error: sessionError } = await client.auth.getSession();
  if (sessionError) throw sessionError;
  if (existing.session) return existing.session.user.id;

  const { data, error } = await client.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user) throw new Error('Could not start your study session.');
  return data.user.id;
}

function ensureStudyUser() {
  // Loading notes and saving a note must share the same first guest session.
  pendingSignIn ??= signInForNotes().finally(() => { pendingSignIn = null; });
  return pendingSignIn;
}

export async function listStudyNotes(lessonId: string, signal: AbortSignal) {
  const userId = await ensureStudyUser();
  const { data, error } = await getSupabase()
    .from('study_notes')
    .select(noteColumns)
    .eq('lesson_id', lessonId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
    .abortSignal(signal);

  if (error) throw error;
  return data;
}

export async function createStudyNote(lessonId: string, input: string) {
  const body = input.trim();
  if (!body || body.length > 1000) {
    throw new Error('Write a note between 1 and 1000 characters.');
  }

  const userId = await ensureStudyUser();
  const { data, error } = await getSupabase()
    .from('study_notes')
    .insert({ lesson_id: lessonId, user_id: userId, body })
    .select(noteColumns)
    .single();

  if (error) throw error;
  return data;
}
