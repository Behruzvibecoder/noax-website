"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Check } from "@/components/layout/Icon";

/**
 * Single-question card. Selection is local; the result is pushed up so the
 * lesson screen can fold it into mastery via computeMastery().
 */
export function QuizCard({
  question,
  onAnswer,
  answered,
}: {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
  answered?: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correct = selected === question.correctIndex;

  function submit() {
    if (selected === null || revealed) return;
    setRevealed(true);
    onAnswer(correct);
  }

  return (
    <Card peel={false} className="my-8">
      <CardBody className="gap-5">
        <p className="cx-eyebrow">Check yourself</p>
        <h3 className="[font-size:var(--font-size-h4)] font-semibold leading-[1.2]">
          {question.prompt}
        </h3>

        <ul className="grid gap-2.5">
          {question.options.map((option, i) => {
            const isPicked = selected === i;
            const isAnswer = i === question.correctIndex;

            return (
              <li key={option}>
                <button
                  type="button"
                  disabled={revealed || answered}
                  onClick={() => setSelected(i)}
                  aria-pressed={isPicked}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-[var(--radius-md)] px-4 py-3.5 text-left text-[var(--font-size-body)] transition-[background-color,box-shadow,transform] duration-300 ease-[var(--ease-bounce)]",
                    "bg-[color-mix(in_oklab,var(--cx-foreground)_5%,transparent)]",
                    !revealed && "hover:-translate-y-0.5 hover:bg-[color-mix(in_oklab,var(--cx-foreground)_10%,transparent)]",
                    isPicked && !revealed && "bg-[color-mix(in_oklab,var(--color-blush)_20%,transparent)] shadow-[inset_0_0_0_1px_var(--color-blush)]",
                    revealed && isAnswer && "bg-[color-mix(in_oklab,var(--color-blush)_22%,transparent)] shadow-[inset_0_0_0_1px_var(--color-blush)]",
                    revealed && isPicked && !isAnswer && "opacity-55",
                    (revealed || answered) && "cursor-default",
                  )}
                >
                  <span>{option}</span>
                  {revealed && isAnswer ? (
                    <Check size={18} className="shrink-0 text-[var(--color-blush)]" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>

        {!revealed && !answered ? (
          <Button variant="accent" onClick={submit} disabled={selected === null}>
            Check answer
          </Button>
        ) : (
          <div className="rounded-[var(--radius-md)] bg-[color-mix(in_oklab,var(--cx-foreground)_6%,transparent)] p-4">
            <p className="cx-eyebrow text-[var(--cx-muted)]">
              {correct ? "Correct" : "Not quite"}
            </p>
            <p className="mt-2 text-[var(--font-size-body)] text-[var(--cx-muted)]">
              {question.explanation}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
