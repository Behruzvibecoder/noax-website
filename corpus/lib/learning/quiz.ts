import type { QuizQuestion } from "@/lib/types";

/** Quiz scoring — pure helpers shared by the lesson screen and the API. */

export interface ScoredAnswer {
  question: QuizQuestion;
  selectedIndex: number;
}

export function isCorrect(question: QuizQuestion, selectedIndex: number) {
  return selectedIndex === question.correctIndex;
}

export function scoreAnswers(answers: ScoredAnswer[]) {
  const total = answers.length;
  const correct = answers.filter((a) => isCorrect(a.question, a.selectedIndex)).length;
  return {
    total,
    correct,
    accuracy: total === 0 ? 0 : Math.round((correct / total) * 100) / 100,
    passed: total > 0 && correct / total >= 0.7,
  };
}

/** Spaced-repetition delay in days for a review queue. */
export function nextReviewDelay(correctStreak: number) {
  return Math.min(30, Math.round(1 * 2.2 ** Math.max(0, correctStreak)));
}
