/**
 * CORPUS domain model.
 * These types describe the Supabase tables the product reads and writes.
 * They are UI-agnostic: renaming a table only means updating the queries in
 * lib/, never a component.
 */

export type Plan = "free" | "pro" | "institutional";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "student" | "educator";
  institution: string | null;
  plan: Plan;
  created_at: string;
}

/** Anatomical system — the top level of the curriculum tree. */
export type SystemId =
  | "skeletal"
  | "muscular"
  | "nervous"
  | "cardiovascular"
  | "respiratory"
  | "digestive";

export interface Structure {
  id: string;
  system: SystemId;
  /** Canonical Latin name, e.g. "Cor". */
  latin: string;
  name: string;
  summary: string;
  /** Model asset key handed to the 3D viewer. */
  model?: string;
  related: string[];
}

export interface Lesson {
  id: string;
  system: SystemId;
  title: string;
  summary: string;
  /** Reading time in minutes. */
  minutes: number;
  level: 1 | 2 | 3;
  structures: string[];
  /** Ordered content blocks. */
  blocks: LessonBlock[];
}

export type LessonBlock =
  | { kind: "text"; body: string }
  | { kind: "structure"; structureId: string; caption: string }
  | { kind: "callout"; tone: "note" | "clinical"; body: string }
  | { kind: "quiz"; questionId: string };

export interface QuizQuestion {
  id: string;
  lessonId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** Row in `learning_progress`. */
export interface ProgressRecord {
  id: string;
  user_id: string;
  lesson_id: string;
  status: "not_started" | "in_progress" | "completed";
  /** 0..1 — weighted blend of completion and quiz accuracy. */
  mastery: number;
  updated_at: string;
}

/* ------------------------------------------------------------------ tutor */

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  /** RAG provenance attached by the tutor, if any. */
  sources?: RagSource[];
}

export interface RagSource {
  id: string;
  title: string;
  /** Textbook / atlas section the chunk came from. */
  section: string;
  snippet: string;
  score: number;
}
