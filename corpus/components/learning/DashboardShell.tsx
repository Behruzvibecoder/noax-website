"use client";

import { useEffect, useState } from "react";
import { LESSONS } from "@/lib/learning/curriculum";
import { summariseBySystem } from "@/lib/learning/progress";
import { overallStats, readAll, toRecords } from "@/lib/learning/localProgress";
import type { ProgressRecord } from "@/lib/types";
import { LessonCard } from "./LessonCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Reveal } from "@/components/ui/Reveal";

const SYSTEM_NAMES: Record<string, string> = {
  skeletal: "Skeletal",
  muscular: "Muscular",
  nervous: "Nervous",
  cardiovascular: "Cardiovascular",
  respiratory: "Respiratory",
  digestive: "Digestive",
};

/**
 * Dashboard data shell.
 *
 * Reads progress from the client store on mount (and re-reads whenever the
 * `corpus:progress` event fires, so returning from a lesson updates live).
 * Replacing `readAll` with a Supabase query is the only change needed to move
 * this to server-fetched, per-user data.
 */
export function DashboardShell() {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [stats, setStats] = useState(() => ({
    lessonsTotal: LESSONS.length,
    completed: 0,
    inProgress: 0,
    mastery: 0,
    accuracy: null as number | null,
    answered: 0,
  }));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => {
      const store = readAll();
      setRecords(toRecords(store));
      setStats(overallStats(store));
      setHydrated(true);
    };

    sync();
    window.addEventListener("corpus:progress", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("corpus:progress", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const bySystem = summariseBySystem(records);

  return (
    <div className="px-5 py-8 md:px-8 md:py-12">
      <header className="max-w-3xl">
        <p className="cx-eyebrow">Your progress</p>
        <h1 className="mt-4 [font-size:var(--font-size-h3)] font-bold leading-[1.05]">
          {hydrated && stats.completed > 0
            ? `${stats.completed} lesson${stats.completed === 1 ? "" : "s"} mastered.`
            : "Pick up where you left off."}
        </h1>
        <p className="mt-4 text-[var(--font-size-body)] text-[var(--cx-muted)]">
          Mastery blends how much of a lesson you read with how many of its
          questions you answered correctly — scrolling alone never counts.
        </p>
      </header>

      <dl className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
        <Stat label="Overall mastery" ring={stats.mastery} />
        <Stat label="Lessons completed" value={`${stats.completed}/${stats.lessonsTotal}`} />
        <Stat
          label="Quiz accuracy"
          value={stats.accuracy === null ? "—" : `${Math.round(stats.accuracy * 100)}%`}
        />
        <Stat label="Questions answered" value={String(stats.answered)} />
      </dl>

      <section className="mt-[var(--spacing-fluid-lg)]">
        <h2 className="[font-size:var(--font-size-h4)] font-semibold">By system</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {bySystem.map((row, i) => (
            <Reveal as="li" key={row.system} index={i} stagger={50}>
              <div className="flex items-center gap-4 rounded-[var(--radius-md)] bg-[var(--cx-canvas-soft)] p-4 shadow-[inset_0_0_0_1px_var(--cx-line)]">
                <ProgressRing value={row.mastery} size={56} stroke={4} />
                <div className="min-w-0">
                  <p className="truncate font-[var(--font-display)] font-semibold">
                    {SYSTEM_NAMES[row.system] ?? row.system}
                  </p>
                  <p className="text-[var(--font-size-smaller)] text-[var(--cx-muted)]">
                    {row.completed}/{row.lessons} lessons complete
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="mt-[var(--spacing-fluid-lg)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="[font-size:var(--font-size-h4)] font-semibold">All lessons</h2>
          <p className="text-[var(--font-size-smaller)] text-[var(--cx-muted)]">
            {hydrated ? "Progress saved on this device" : "Loading progress…"}
          </p>
        </div>

        <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {LESSONS.map((lesson, i) => (
            <Reveal as="li" key={lesson.id} index={i} stagger={60}>
              <LessonCard
                lesson={lesson}
                progress={records.find((r) => r.lesson_id === lesson.id)}
              />
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  ring,
}: {
  label: string;
  value?: string;
  ring?: number;
}) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--cx-canvas-soft)] p-5 shadow-[inset_0_0_0_1px_var(--cx-line)]">
      <dt className="text-[var(--font-size-smaller)] font-bold uppercase tracking-[0.12em] text-[var(--cx-muted)]">
        {label}
      </dt>
      <dd className="mt-3 flex items-center gap-3">
        {ring !== undefined ? (
          <>
            <ProgressRing value={ring} size={52} stroke={4} />
            <span className="font-[var(--font-display)] text-[1.6rem] font-bold tabular-nums">
              {Math.round(ring * 100)}%
            </span>
          </>
        ) : (
          <span className="font-[var(--font-display)] text-[1.9rem] font-bold tabular-nums">
            {value}
          </span>
        )}
      </dd>
    </div>
  );
}
