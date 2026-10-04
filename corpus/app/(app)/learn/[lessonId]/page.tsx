import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LESSONS,
  QUIZ,
  getLesson,
  lessonsForSystem,
} from "@/lib/learning/curriculum";
import { TopBar } from "@/components/layout/TopBar";
import { LessonBlocks } from "@/components/learning/LessonBlocks";
import { LessonTracker } from "@/components/learning/LessonTracker";
import { Chip } from "@/components/ui/Chip";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/layout/Icon";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ lessonId: lesson.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  return {
    title: lesson?.title ?? "Lesson",
    description: lesson?.summary,
  };
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();

  const quiz = QUIZ.filter((q) => q.lessonId === lesson.id);
  const siblings = lessonsForSystem(lesson.system).filter((l) => l.id !== lesson.id);
  const next = siblings[0];

  return (
    <>
      <TopBar title={lesson.title} action={{ href: "/tutor", label: "Ask the tutor" }} />
      <LessonTracker lessonId={lesson.id} blockCount={lesson.blocks.length} />

      <article className="px-5 py-8 md:px-8 md:py-12">
        <header className="max-w-[68ch]">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="accent">{lesson.system}</Chip>
            <Chip tone="outline">Level {lesson.level}</Chip>
            <Chip tone="outline">{lesson.minutes} min</Chip>
          </div>

          <h1 className="mt-6 [font-size:var(--font-size-h3)] font-bold leading-[1.05]">
            {lesson.title}
          </h1>
          <p className="mt-4 text-[var(--font-size-body)] text-[var(--cx-muted)]">
            {lesson.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink
              href={`/anatomy/${lesson.structures[0]}`}
              variant="ghost"
              size="sm"
              trailing={<ArrowRight size={15} />}
            >
              Open in atlas
            </ButtonLink>
            <ButtonLink href="/tutor" variant="ghost" size="sm">
              Ask about this lesson
            </ButtonLink>
          </div>

          <hr className="cx-rule mt-10" />
        </header>

        <div className="mt-8">
          <LessonBlocks lesson={lesson} quiz={quiz} />
        </div>

        <footer className="mt-16 max-w-[68ch]">
          <hr className="cx-rule mb-8" />
          <p className="cx-eyebrow">Keep going</p>
          {next ? (
            <Link
              href={`/learn/${next.id}`}
              className="mt-4 inline-flex items-center gap-3 font-[var(--font-display)] text-[var(--font-size-h4)] font-semibold transition-colors duration-300 hover:text-[var(--color-blush)]"
            >
              {next.title}
              <ArrowRight size={20} />
            </Link>
          ) : (
            <p className="mt-4 text-[var(--font-size-body)] text-[var(--cx-muted)]">
              That is the last lesson in this system so far. Head to the{" "}
              <Link href="/dashboard" className="text-[var(--color-blush)]">
                dashboard
              </Link>{" "}
              for the rest of the curriculum.
            </p>
          )}
        </footer>
      </article>
    </>
  );
}
