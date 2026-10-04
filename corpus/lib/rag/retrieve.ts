import "server-only";
import type { RagSource } from "@/lib/types";
import { LESSONS, QUIZ, STRUCTURES } from "@/lib/learning/curriculum";

/**
 * Retrieval layer for the AI tutor.
 *
 * Primary path: `match_documents` RPC in Supabase — a pgvector similarity
 * search over chunked textbook content. Fallback path: a deterministic
 * lexical index over the curriculum, so the tutor still returns grounded
 * answers when the vector store is not configured (fresh clones, CI, preview
 * deployments).
 */

export const TOP_K = 4;

const FALLBACK_INDEX: RagSource[] = [
  ...STRUCTURES.map<RagSource>((s) => ({
    id: `structure:${s.id}`,
    title: `${s.name} (${s.latin})`,
    section: `${s.system} system`,
    snippet: s.summary,
    score: 0,
  })),
  ...LESSONS.flatMap((l) =>
    l.blocks
      .filter((b) => b.kind === "text" || b.kind === "callout")
      .map<RagSource>((b) => ({
        id: `lesson:${l.id}`,
        title: l.title,
        section: "Lesson text",
        snippet: "body" in b ? b.body : "",
        score: 0,
      })),
  ),
  // Quiz explanations carry the highest-yield clinical facts in a lesson, so
  // they belong in the index alongside the prose.
  ...QUIZ.map<RagSource>((q) => ({
    id: `quiz:${q.id}`,
    title: q.prompt,
    section: "Quiz explanation",
    snippet: q.explanation,
    score: 0,
  })),
];

export async function retrieve(query: string, topK = TOP_K): Promise<RagSource[]> {
  const vector = await embedQuery(query);

  if (vector) {
    const hits = await vectorSearch(vector, topK);
    if (hits.length > 0) return hits;
  }

  return lexicalSearch(query, topK);
}

/**
 * Embed the query with an OpenAI-compatible endpoint.
 * Returns null when no key is configured — callers fall back to lexical search.
 */
async function embedQuery(query: string): Promise<number[] | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `${process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"}/embeddings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
          input: query,
        }),
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { embedding: number[] }[] };
    return json.data?.[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

async function vectorSearch(
  vector: number[],
  topK: number,
): Promise<RagSource[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];

  try {
    const res = await fetch(`${url}/rest/v1/rpc/match_documents`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query_embedding: vector, match_count: topK }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];

    const rows = (await res.json()) as {
      id: string;
      title: string;
      section: string;
      content: string;
      similarity: number;
    }[];

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      section: r.section,
      snippet: r.content.slice(0, 240),
      score: r.similarity,
    }));
  } catch {
    return [];
  }
}

/** Simple TF scoring — keeps the tutor grounded with zero infrastructure. */
function lexicalSearch(query: string, topK: number): RagSource[] {
  const terms = tokenise(query);
  if (terms.length === 0) return [];

  return FALLBACK_INDEX.map((doc) => {
    const hay = tokenise(`${doc.title} ${doc.section} ${doc.snippet}`);
    let hits = 0;
    for (const term of terms) {
      if (hay.includes(term)) hits += 1;
    }
    return { ...doc, score: hits / terms.length };
  })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

const STOP = new Set([
  "the", "a", "an", "is", "are", "was", "were", "of", "to", "in", "on", "and",
  "or", "for", "with", "what", "which", "how", "does", "do", "i", "me", "my",
  "it", "this", "that",
]);

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}
