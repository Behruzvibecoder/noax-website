import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { TutorPanel } from "@/components/tutor/TutorPanel";

export const metadata: Metadata = {
  title: "AI Tutor",
  description:
    "Retrieval-augmented anatomy tutoring. Answers are grounded in the indexed atlas and textbook, and every claim is cited.",
};

export default function TutorPage() {
  return (
    <>
      <TopBar title="Grounded answers" />
      <div className="flex min-h-0 flex-1 flex-col px-5 py-6 md:px-8 md:py-8">
        <div className="mb-6 max-w-3xl">
          <p className="cx-eyebrow">AI Tutor</p>
          <h1 className="mt-4 [font-size:var(--font-size-h3)] font-bold leading-[1.05]">
            Ask anything. Every answer shows its sources.
          </h1>
        </div>

        <div className="min-h-[28rem] flex-1">
          <TutorPanel />
        </div>
      </div>
    </>
  );
}
