import type { Lesson, QuizQuestion } from "@/lib/types";
import { getQuestion, getStructure } from "@/lib/learning/curriculum";
import { QuizHost } from "./QuizHost";
import { Chip } from "@/components/ui/Chip";
import Link from "next/link";
import { ArrowUpRight } from "@/components/layout/Icon";

/**
 * Renders a lesson's ordered blocks. Quiz blocks are delegated to a client
 * host so the rest of the lesson can stay a Server Component.
 */
export function LessonBlocks({
  lesson,
  quiz,
}: {
  lesson: Lesson;
  quiz: QuizQuestion[];
}) {
  return (
    <div className="max-w-[68ch]">
      {lesson.blocks.map((block, i) => {
        const body = renderBlock(block, i, quiz);
        if (!body) return null;
        return (
          <div key={i} data-block-index={i}>
            {body}
          </div>
        );
      })}
    </div>
  );
}

function renderBlock(
  block: Lesson["blocks"][number],
  i: number,
  quiz: QuizQuestion[],
) {
  {
        switch (block.kind) {
          case "text":
            return (
              <p
                key={i}
                className="my-6 text-[var(--font-size-body)] leading-[1.65] text-[var(--cx-muted)]"
              >
                {block.body}
              </p>
            );

          case "structure": {
            const structure = getStructure(block.structureId);
            if (!structure) return null;
            return (
              <figure
                key={i}
                className="my-8 rounded-[var(--radius-lg)] bg-[var(--cx-canvas-soft)] p-5 shadow-[inset_0_0_0_1px_var(--cx-line)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="cx-eyebrow">Structure</p>
                    <p className="mt-2 font-[var(--font-display)] text-[var(--font-size-h4)] font-semibold">
                      {structure.name}
                    </p>
                    <p className="text-[var(--font-size-smaller)] italic text-[var(--cx-muted)]">
                      {structure.latin}
                    </p>
                  </div>
                  <Chip tone="outline">{structure.system}</Chip>
                </div>
                <p className="mt-4 text-[var(--font-size-body)] text-[var(--cx-muted)]">
                  {block.caption}
                </p>
                <Link
                  href={`/anatomy/${structure.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-[var(--font-size-small)] font-semibold text-[var(--cx-accent)]"
                >
                  Open in atlas <ArrowUpRight size={15} />
                </Link>
              </figure>
            );
          }

          case "callout":
            return (
              <aside
                key={i}
                className="my-8 border-s-2 ps-5"
                style={{
                  borderColor:
                    block.tone === "clinical"
                      ? "var(--color-crimson)"
                      : "var(--color-blush)",
                }}
              >
                <p className="cx-eyebrow text-[var(--cx-muted)]">
                  {block.tone === "clinical" ? "Clinical note" : "Note"}
                </p>
                <p className="mt-2 text-[var(--font-size-body)] leading-[1.6] text-[var(--cx-foreground)]">
                  {block.body}
                </p>
              </aside>
            );

          case "quiz": {
            const question = getQuestion(block.questionId) ?? quiz.find((q) => q.id === block.questionId);
            if (!question) return null;
            return <QuizHost key={block.questionId} question={question} />;
          }

          default:
            return null;
        }
  }
}
