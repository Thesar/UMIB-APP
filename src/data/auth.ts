import { getSupabase } from '@/lib/supabase';

class AccountInputError extends Error {}

// Serialize guest creation, sign-in, and sign-out so an old guest request cannot
// replace a newly signed-in account. Note queries use the resulting user ID.
let authQueue: Promise<unknown> = Promise.resolve();

function authAction<T>(action: () => Promise<T>) {
  const result = authQueue.then(action, action);
  authQueue = result.then(() => undefined, () => undefined);
  return result;
}

async function currentSession() {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw error;
  return data.session;
}

async function studyUser() {
  const existing = await currentSession();
  if (existing) return existing.user.id;
  const { data, error } = await getSupabase().auth.signInAnonymously();
  if (error) throw error;
  if (!data.user) throw new Error('Could not start a study session.');
  return data.user.id;
}

export function ensureStudyUser() {
  return authAction(studyUser);
}

function cleanEmail(input: string) {
  const email = input.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    throw new AccountInputError('Enter a valid email address.');
  }
  return email;
}

function checkCode(input: string) {
  const token = input.trim();
  if (!/^\d{6,8}$/.test(token)) {
    throw new AccountInputError('Enter the verification code from your email.');
  }
  return token;
}

export function requestAccountEmail(input: string) {
  return authAction(async () => {
    const email = cleanEmail(input);
    await studyUser();
    const session = await currentSession();
    if (session && !session.user.is_anonymous) {
      throw new AccountInputError('You are already signed in.');
    }
    // Linking the email keeps the guest user ID and all owner-protected notes.
    const { error } = await getSupabase().auth.updateUser({
      email,
      data: { screamulus_setup: 'password_pending' },
    });
    if (error) throw error;
    return email;
  });
}

export function verifyAccountEmail(email: string, input: string) {
  return authAction(async () => {
    const { error } = await getSupabase().auth.verifyOtp({
      email: cleanEmail(email), token: checkCode(input), type: 'email_change',
    });
    if (error) throw error;
  });
}

export function resendAccountEmail(email: string) {
  return authAction(async () => {
    const { error } = await getSupabase().auth.resend({
      type: 'email_change', email: cleanEmail(email),
    });
    if (error) throw error;
  });
}

export function saveAccountPassword(password: string, confirmation: string) {
  return authAction(async () => {
    if (password.length < 8) throw new AccountInputError('Use at least 8 characters for your password.');
    if (password !== confirmation) throw new AccountInputError('The passwords do not match.');
    const { data, error: userError } = await getSupabase().auth.getUser();
    if (userError) throw userError;
    if (data.user.is_anonymous || !data.user.email_confirmed_at) {
      throw new AccountInputError('Verify your email before setting a password.');
    }
    const { error } = await getSupabase().auth.updateUser({
      password, data: { screamulus_setup: 'complete' },
    });
    if (error) throw error;
  });
}

export function signInAccount(input: string, password: string) {
  return authAction(async () => {
    if (!password) throw new AccountInputError('Enter your password.');
    const { error } = await getSupabase().auth.signInWithPassword({
      email: cleanEmail(input), password,
    });
    if (error) throw error;
  });
}

export function signOutAccount() {
  return authAction(async () => {
    const { error } = await getSupabase().auth.signOut({ scope: 'local' });
    if (error) throw error;
  });
}

export function requestPasswordReset(input: string) {
  return authAction(async () => {
    const email = cleanEmail(input);
    const { error } = await getSupabase().auth.resetPasswordForEmail(email);
    if (error) throw error;
    return email;
  });
}

export function verifyPasswordReset(email: string, input: string) {
  return authAction(async () => {
    const { error } = await getSupabase().auth.verifyOtp({
      email: cleanEmail(email), token: checkCode(input), type: 'recovery',
    });
    if (error) throw error;
  });
}

export function guestNoteCount() {
  return authAction(async () => {
    const session = await currentSession();
    if (!session?.user.is_anonymous) return 0;
    const { count, error } = await getSupabase().from('study_notes')
      .select('id', { count: 'exact', head: true }).eq('user_id', session.user.id);
    if (error) throw error;
    return count ?? 0;
  });
}

export function accountError(error: unknown) {
  if (error instanceof AccountInputError) return error.message;
  const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
  switch (code) {
    case 'invalid_credentials': return 'The email or password is incorrect.';
    case 'email_not_confirmed': return 'Verify your email before signing in.';
    case 'otp_expired': return 'The code is invalid or expired. Request a new code and try again.';
    case 'email_exists':
    case 'user_already_exists': return 'Try signing in if you already have an account with this email.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit': return 'Please wait a moment before requesting another code.';
    case 'weak_password': return 'Choose a stronger password with at least 8 characters.';
    case 'same_password': return 'Choose a password different from your previous one.';
    case 'email_address_not_authorized': return 'Email sign-up is being set up. You can continue as a guest.';
    case 'unexpected_failure': return 'The account service could not complete this request. Please try again shortly, or continue as a guest.';
    default: return 'We could not finish this right now. Check your connection and try again.';
  }
}
