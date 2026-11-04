begin;

create table public.study_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index study_notes_owner_lesson_date
on public.study_notes (user_id, lesson_id, created_at desc);

alter table public.study_notes enable row level security;
revoke all on public.study_notes from anon, authenticated;
grant select, insert on public.study_notes to authenticated;

create policy "Students read their own notes"
on public.study_notes for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Students add their own notes"
on public.study_notes for insert to authenticated
with check ((select auth.uid()) = user_id);

commit;
