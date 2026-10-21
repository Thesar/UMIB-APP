
export type Lesson = {
  id: string;
  title: string;
  category: string;
  summary: string;
  formula: string;
  explanation: string;
};

export const lessons: Lesson[] = [
  {
    id: "s1",
    title: "The Sine Wave",
    category: "Trigonometry",
    summary: "Discover how angles create waves.",
    formula: "y = sin(x)",
    explanation:
      "Sine describes periodic motion. In Screamulus, tilting your phone can change a sine-based signal.",
  },
  {
    id: "s2",
    title: "Amplitude",
    category: "Trigonometry",
    summary: "How tall can your wave become?",
    formula: "y = A sin(x)",
    explanation:
      "Amplitude controls the height of a wave. We can use your microphone's loudness measurement to control A.",
  },
  {
    id: "s3",
    title: "Derivatives",
    category: "Calculus",
    summary: "Find out how quickly a graph changes.",
    formula: "f(x) = x²    f'(x) = 2x",
    explanation:
      "A derivative measures the instantaneous rate of change. A rapidly changing voice signal creates steep slopes.",
  },
  {
    id: "s4",
    title: "Turning Points",
    category: "Calculus",
    summary: "Find where a graph changes direction.",
    formula: "f'(x) = 0",
    explanation:
      "Smooth local maxima and minima often occur where the derivative is zero. But not every zero derivative is a turning point.",
  },
  {
    id: "s5",
    title: "Integrals",
    category: "Calculus",
    summary: "Explore the area under your graph.",
    formula: "∫₀¹ x dx = 1/2",
    explanation:
      "A definite integral calculates signed area. Positive and negative parts can cancel each other.",
  },
  {
    id: "s6",
    title: "Reverse Scream",
    category: "Experiment",
    summary: "Turn a photographed drawing into math.",
    formula: "f(t) = A(t) sin(θ(t))",
    explanation:
      "Our future camera feature will approximate a hand-drawn graph and generate one possible sound and phone-motion performance.",
  },
];

export function getLesson(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}
