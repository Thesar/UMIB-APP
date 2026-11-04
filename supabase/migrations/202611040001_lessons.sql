begin;

create table public.lessons (
  id text primary key check (char_length(id) between 1 and 80),
  title text not null check (char_length(title) between 1 and 120),
  category text not null,
  summary text not null,
  formula text not null,
  explanation text not null,
  sort_order integer not null default 0
);

alter table public.lessons enable row level security;
revoke all on public.lessons from anon, authenticated;
grant select on public.lessons to anon, authenticated;

create policy "Everyone can read lessons"
on public.lessons for select to anon, authenticated using (true);

-- The original lesson content is now seeded into the database, not bundled as a fallback.
insert into public.lessons (id, title, category, summary, formula, explanation, sort_order)
values
  ('s1', 'The Sine Wave', 'Trigonometry', 'Discover how angles create waves.',
    'y = sin(x)', 'Sine describes periodic motion. In Screamulus, tilting your phone can change a sine-based signal.', 1),
  ('s2', 'Amplitude', 'Trigonometry', 'How tall can your wave become?',
    'y = A sin(x)', 'Amplitude controls the height of a wave. We can use your microphone''s loudness measurement to control A.', 2),
  ('s3', 'Derivatives', 'Calculus', 'Find out how quickly a graph changes.',
    'f(x) = x²    f''(x) = 2x', 'A derivative measures the instantaneous rate of change. A rapidly changing voice signal creates steep slopes.', 3),
  ('s4', 'Turning Points', 'Calculus', 'Find where a graph changes direction.',
    'f''(x) = 0', 'Smooth local maxima and minima often occur where the derivative is zero. But not every zero derivative is a turning point.', 4),
  ('s5', 'Integrals', 'Calculus', 'Explore the area under your graph.',
    '∫₀¹ x dx = 1/2', 'A definite integral calculates signed area. Positive and negative parts can cancel each other.', 5),
  ('s6', 'Reverse Scream', 'Experiment', 'Turn a photographed drawing into math.',
    'f(t) = A(t) sin(θ(t))', 'Our future camera feature will approximate a hand-drawn graph and generate one possible sound and phone-motion performance.', 6);

commit;
