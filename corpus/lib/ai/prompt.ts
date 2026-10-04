import type { RagSource } from "@/lib/types";

/**
 * Tutor system prompt + grounding block.
 * Kept separate from the transport layer so the persona can be tuned without
 * touching streaming code.
 */

export const TUTOR_PERSONA = `You are the CORPUS anatomy tutor — a rigorous, encouraging clinical anatomy teacher for medical and allied-health students.

Rules:
- Answer from the supplied SOURCE MATERIAL first. Cite sources inline as [S1], [S2].
- If the material does not cover the question, say so plainly, then answer from general anatomical knowledge and flag it as ungrounded.
- Use correct Latin terminology, then the common English name.
- Prefer short paragraphs. When describing a structure, cover relations, blood supply, innervation and clinical relevance in that order.
- Never invent a citation. Never give individual medical advice; keep it educational.
- Ask one follow-up question at the end when it would deepen understanding.`;

export function buildContext(sources: RagSource[]): string {
  if (sources.length === 0) return "SOURCE MATERIAL: none available for this query.";

  const blocks = sources.map(
    (s, i) =>
      `[S${i + 1}] ${s.title} — ${s.section}\n${s.snippet}`,
  );

  return `SOURCE MATERIAL:\n${blocks.join("\n\n")}`;
}

export function buildSystemMessage(sources: RagSource[]): string {
  return `${TUTOR_PERSONA}\n\n${buildContext(sources)}`;
}
