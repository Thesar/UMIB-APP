import { getSupabase } from '@/lib/supabase';

const lessonColumns = 'id,title,category,summary,formula,explanation,sort_order';

export async function listLessons(signal: AbortSignal) {
  const { data, error } = await getSupabase()
    .from('lessons')
    .select(lessonColumns)
    .order('sort_order')
    .abortSignal(signal);

  if (error) throw error;
  return data;
}

export async function getLesson(id: string, signal: AbortSignal) {
  const { data, error } = await getSupabase()
    .from('lessons')
    .select(lessonColumns)
    .eq('id', id)
    .abortSignal(signal)
    .maybeSingle();

  if (error) throw error;
  return data;
}
