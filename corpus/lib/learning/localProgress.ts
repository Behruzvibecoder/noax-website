"use client";

import type { ProgressRecord } from "@/lib/types";
import { LESSONS } from "./curriculum";
import { computeMastery, statusFor, type QuizAttempt } from "./progress";

/**
 * Client-side progress store.
 *
 * The same shape is written to Supabase `learning_progress` once the table is
 * wired — only `readAll` / `write` change. Everything downstream
 * (computeMastery, summariseBySystem) is shared with the server path.
 */

export interface LocalProgress {
  lessonId: string;
  opened: boolean;
  completedBlocks: number;
  /** questionId -> correct */
  answers: Record<string, boolean>;
  updatedAt: number;
}

const KEY = "corpus:progress:v1";

export function readAll(): Record<string, LocalProgress> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, LocalProgress>) : {};
  } catch {
    return {};
  }
}

function writeAll(next: Record<string, LocalProgress>) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("corpus:progress", { detail: next }));
  } catch {
    // Private mode / quota — progress stays in memory for this session.
  }
}

function blank(lessonId: string): LocalProgress {
  return { lessonId, opened: false, completedBlocks: 0, answers: {}, updatedAt: Date.now() };
}

export function markOpened(lessonId: string) {
  const all = readAll();
  const entry = all[lessonId] ?? blank(lessonId);
  if (entry.opened) return;
  entry.opened = true;
  entry.updatedAt = Date.now();
  all[lessonId] = entry;
  writeAll(all);
}

export function markBlockComplete(lessonId: string, index: number) {
  const all = readAll();
  const entry = all[lessonId] ?? blank(lessonId);

  const seen = new Set(Object.keys(entry.answers));
  // completedBlocks is a high-water mark so re-reading never decreases it.
  const next = Math.max(entry.completedBlocks, index + 1);
  if (next === entry.completedBlocks && seen.size === 0) return;

  entry.completedBlocks = next;
  entry.updatedAt = Date.now();
  all[lessonId] = entry;
  writeAll(all);
}

export function recordAnswer(lessonId: string, questionId: string, correct: boolean) {
  const all = readAll();
  const entry = all[lessonId] ?? blank(lessonId);
  entry.answers[questionId] = correct;
  entry.updatedAt = Date.now();
  all[lessonId] = entry;
  writeAll(all);
}

/** Flatten the local store into the same rows the database would return. */
export function toRecords(
  store: Record<string, LocalProgress> = readAll(),
): ProgressRecord[] {
  return LESSONS.flatMap((lesson) => {
    const entry = store[lesson.id];
    if (!entry) return [];

    const attempts: QuizAttempt[] = Object.entries(entry.answers).map(
      ([questionId, correct]) => ({ questionId, correct }),
    );

    // Opening a lesson counts as the first block; quiz answers count too.
    const completedBlocks = Math.max(
      entry.opened ? 1 : 0,
      entry.completedBlocks,
    );

    const mastery = computeMastery(completedBlocks, lesson.blocks.length, attempts);

    return [
      {
        id: `${lesson.id}`,
        user_id: "local",
        lesson_id: lesson.id,
        status: statusFor(mastery, completedBlocks),
        mastery,
        updated_at: new Date(entry.updatedAt).toISOString(),
      } satisfies ProgressRecord,
    ];
  });
}

/** Aggregate numbers for the dashboard stat strip. */
export function overallStats(store: Record<string, LocalProgress> = readAll()) {
  const records = toRecords(store);
  const completed = records.filter((r) => r.status === "completed").length;
  const inProgress = records.filter((r) => r.status === "in_progress").length;
  const totalQuestions = Object.values(store).reduce(
    (sum, entry) => sum + Object.keys(entry.answers).length,
    0,
  );
  const correctAnswers = Object.values(store).reduce(
    (sum, entry) => sum + Object.values(entry.answers).filter(Boolean).length,
    0,
  );

  return {
    lessonsTotal: LESSONS.length,
    completed,
    inProgress,
    mastery:
      records.length > 0
        ? Math.round(
            (records.reduce((sum, r) => sum + r.mastery, 0) / records.length) * 100,
          ) / 100
        : 0,
    accuracy:
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : null,
    answered: totalQuestions,
  };
}
