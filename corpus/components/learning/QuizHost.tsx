"use client";

import { useEffect, useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { QuizCard } from "./QuizCard";
import { readAll, recordAnswer } from "@/lib/learning/localProgress";

/**
 * Client boundary around QuizCard.
 * Answers are persisted through lib/learning/localProgress, which mirrors the
 * shape of the Supabase `learning_progress` row so swapping the store is a
 * one-module change.
 */
export function QuizHost({ question }: { question: QuizQuestion }) {
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const existing = readAll()[question.lessonId]?.answers[question.id];
    if (existing !== undefined) setAnswered(true);
  }, [question.lessonId, question.id]);

  function onAnswer(correct: boolean) {
    setAnswered(true);
    recordAnswer(question.lessonId, question.id, correct);
  }

  return <QuizCard question={question} onAnswer={onAnswer} answered={answered} />;
}
