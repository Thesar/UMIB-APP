import { getSupabase } from '@/lib/supabase';
import { ensureStudyUser } from './auth';

const noteColumns = 'id,user_id,lesson_id,body,created_at';

export async function listStudyNotes(lessonId: string, signal: AbortSignal, expectedOwnerId?: string) {
  const userId = await ensureStudyUser();
  if (expectedOwnerId && userId !== expectedOwnerId) throw new Error('Study account changed.');
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

export async function createStudyNote(lessonId: string, input: string, expectedOwnerId: string) {
  const body = input.trim();
  if (!body || body.length > 1000) {
    throw new Error('Write a note between 1 and 1000 characters.');
  }

  const userId = await ensureStudyUser();
  if (userId !== expectedOwnerId) throw new Error('Study account changed.');
  const { data, error } = await getSupabase()
    .from('study_notes')
    .insert({ lesson_id: lessonId, user_id: userId, body })
    .select(noteColumns)
    .single();

  if (error) throw error;
  return data;
}
