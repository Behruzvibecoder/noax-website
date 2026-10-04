import "server-only";
import type { ChatMessage, RagSource } from "@/lib/types";
import { buildSystemMessage } from "./prompt";
import { retrieve } from "@/lib/rag/retrieve";

/**
 * AI tutor transport.
 *
 * Streams from any OpenAI-compatible chat endpoint. When no API key is
 * configured it degrades to a deterministic, fully grounded reply assembled
 * from the retrieval layer — the product stays demonstrable end to end with
 * zero external dependencies.
 */

export interface TutorTurn {
  /** ReadableStream<Uint8Array> of assistant text chunks. */
  stream: ReadableStream<Uint8Array>;
  sources: RagSource[];
}

export async function askTutor(
  history: ChatMessage[],
  question: string,
): Promise<TutorTurn> {
  const sources = await retrieve(question);
  const encoder = new TextEncoder();

  if (!process.env.OPENAI_API_KEY) {
    return {
      stream: groundedFallback(question, sources, encoder),
      sources,
    };
  }

  const res = await fetch(
    `${process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini",
        stream: true,
        temperature: 0.4,
        messages: [
          { role: "system", content: buildSystemMessage(sources) },
          ...history
            .filter((m) => m.role !== "system")
            .slice(-12)
            .map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: question },
        ],
      }),
    },
  );

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    console.error("[tutor] upstream error", res.status, detail.slice(0, 300));
    return {
      stream: groundedFallback(question, sources, encoder, true),
      sources,
    };
  }

  return { stream: sseToText(res.body), sources };
}

/** Strip OpenAI SSE framing and re-emit plain text chunks. */
function sseToText(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader();

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;

          try {
            const json = JSON.parse(payload) as {
              choices?: { delta?: { content?: string } }[];
            };
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // Ignore keep-alive / partial frames.
          }
        }
      }

      controller.close();
    },
  });
}

/**
 * Grounded, non-generative reply used when no LLM key is present or the
 * upstream call fails. Still useful: it surfaces exactly what the RAG layer
 * found, with citations the UI can render as source chips.
 */
function groundedFallback(
  question: string,
  sources: RagSource[],
  encoder: TextEncoder,
  degraded = false,
): ReadableStream<Uint8Array> {
  const parts: string[] = [];

  if (degraded) {
    parts.push(
      "_The model endpoint is unreachable right now, so here is what the corpus returned._\n\n",
    );
  }

  if (sources.length === 0) {
    parts.push(
      `I could not find anything in the corpus about “${question}”. Try naming the structure directly — for example “sinoatrial node” or “linea aspera” — or ask me about a lesson in your current system.`,
    );
  } else {
    parts.push(`Here is what the corpus holds on that.\n\n`);
    sources.forEach((s, i) => {
      parts.push(`**${s.title}** — _${s.section}_ [S${i + 1}]\n${s.snippet}\n\n`);
    });
    parts.push(
      `Want me to go deeper on ${sources[0].title}, or set you a question on it?`,
    );
  }

  const text = parts.join("");

  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}
