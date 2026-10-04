import type { Lesson, ProgressRecord, SystemId } from "@/lib/types";
import { LESSONS } from "./curriculum";

/**
 * Learning-progress maths.
 * Pure and side-effect free so it can run in a Server Component, in an edge
 * route handler, or in a unit test without a database.
 */

/** How much of mastery comes from reading completion vs. quiz accuracy. */
export const COMPLETION_WEIGHT = 0.4;
export const ACCURACY_WEIGHT = 0.6;

export interface QuizAttempt {
  questionId: string;
  correct: boolean;
}

/**
 * Mastery is a weighted blend of lesson completion and quiz accuracy.
 * Rounding to three decimals keeps the value stable across writes.
 */
export function computeMastery(
  completedBlocks: number,
  totalBlocks: number,
  attempts: QuizAttempt[],
): number {
  const completion = totalBlocks > 0 ? completedBlocks / totalBlocks : 0;
  const accuracy =
    attempts.length > 0
      ? attempts.filter((a) => a.correct).length / attempts.length
      : 0;

  // No attempts yet: completion alone, scaled so an unattempted lesson can
  // never read as "mastered".
  if (attempts.length === 0) {
    return round3(completion * COMPLETION_WEIGHT);
  }

  return round3(completion * COMPLETION_WEIGHT + accuracy * ACCURACY_WEIGHT);
}

export function statusFor(
  mastery: number,
  completedBlocks: number,
): ProgressRecord["status"] {
  if (completedBlocks === 0) return "not_started";
  return mastery >= 0.9 ? "completed" : "in_progress";
}

export interface SystemProgress {
  system: SystemId;
  lessons: number;
  completed: number;
  /** 0..1 */
  mastery: number;
}

/** Roll per-lesson rows up into per-system progress for the dashboard. */
export function summariseBySystem(
  records: ProgressRecord[],
  lessons: Lesson[] = LESSONS,
): SystemProgress[] {
  const systems = new Set(lessons.map((l) => l.system));

  return [...systems].map((system) => {
    const systemLessons = lessons.filter((l) => l.system === system);
    const rows = records.filter((r) =>
      systemLessons.some((l) => l.id === r.lesson_id),
    );
    const completed = rows.filter((r) => r.status === "completed").length;
    const mastery =
      rows.length > 0
        ? round3(rows.reduce((sum, r) => sum + r.mastery, 0) / rows.length)
        : 0;

    return { system, lessons: systemLessons.length, completed, mastery };
  });
}

/** Consecutive-day streak from a list of activity timestamps (UTC dates). */
export function computeStreak(activityDates: string[], today = new Date()): number {
  if (activityDates.length === 0) return 0;

  const days = new Set(
    activityDates.map((d) => new Date(d).toISOString().slice(0, 10)),
  );

  let streak = 0;
  const cursor = new Date(today);

  // A streak stays alive if the learner has studied today or yesterday.
  if (!days.has(iso(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);

  while (days.has(iso(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function round3(n: number) {
  return Math.round(n * 1000) / 1000;
}
