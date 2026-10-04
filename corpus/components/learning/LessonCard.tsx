import Link from "next/link";
import type { Lesson, ProgressRecord } from "@/lib/types";
import { CardLink, CardBody } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";

/** Lesson tile for the dashboard grid. */
export function LessonCard({
  lesson,
  progress,
}: {
  lesson: Lesson;
  progress?: ProgressRecord;
}) {
  const mastery = progress?.mastery ?? 0;
  const status = progress?.status ?? "not_started";

  return (
    <CardLink href={`/learn/${lesson.id}`} className="h-full">
      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <Chip tone={status === "completed" ? "accent" : "outline"}>
            Level {lesson.level}
          </Chip>
          <span className="text-[var(--font-size-smaller)] text-[var(--cx-muted)]">
            {lesson.minutes} min
          </span>
        </div>

        <h3 className="[font-size:var(--font-size-h4)] font-semibold leading-[1.15]">
          {lesson.title}
        </h3>
        <p className="text-[var(--font-size-body)] text-[var(--cx-muted)]">
          {lesson.summary}
        </p>

        <div className="mt-auto space-y-2 pt-4">
          <div className="flex items-center justify-between text-[var(--font-size-smaller)] text-[var(--cx-muted)]">
            <span>
              {status === "not_started"
                ? "Not started"
                : status === "in_progress"
                  ? "In progress"
                  : "Completed"}
            </span>
            <span className="tabular-nums">{Math.round(mastery * 100)}% mastery</span>
          </div>
          <ProgressBar value={mastery} label={`${lesson.title} mastery`} />
          <Link
            href={`/anatomy/${lesson.structures[0]}`}
            className="inline-block pt-1 text-[var(--font-size-smaller)] font-semibold text-[var(--cx-accent)]"
            onClick={(e) => e.stopPropagation()}
          >
            {lesson.structures.length} structures in atlas
          </Link>
        </div>
      </CardBody>
    </CardLink>
  );
}
