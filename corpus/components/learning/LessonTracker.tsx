"use client";

import { useEffect } from "react";
import { markBlockComplete, markOpened } from "@/lib/learning/localProgress";

/**
 * Records reading progress as blocks scroll into view.
 * Server-rendered lesson blocks carry data-block-index; this component only
 * observes them, so the lesson itself stays a Server Component.
 */
export function LessonTracker({
  lessonId,
  blockCount,
}: {
  lessonId: string;
  blockCount: number;
}) {
  useEffect(() => {
    markOpened(lessonId);

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-block-index]"),
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(
            (entry.target as HTMLElement).dataset.blockIndex ?? -1,
          );
          if (Number.isInteger(index) && index >= 0) {
            markBlockComplete(lessonId, index);
          }
        });
      },
      { threshold: 0.5 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [lessonId, blockCount]);

  return null;
}
