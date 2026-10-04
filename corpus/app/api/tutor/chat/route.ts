import { NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/types";
import { askTutor } from "@/lib/ai/tutor";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Sentinel separating the provenance frame from streamed text.
 *  Must match components/tutor/TutorPanel.tsx. */
const SOURCES_SENTINEL = "@@CORPUS_SOURCES@@";

interface Body {
  question?: string;
  history?: ChatMessage[];
}

export async function POST(request: Request) {
  let body: Body;

  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const question = body.question?.trim();
  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }
  if (question.length > 4000) {
    return NextResponse.json({ error: "question too long" }, { status: 413 });
  }

  const history = (body.history ?? []).filter(
    (m) => m.role === "user" || m.role === "assistant",
  );

  const { stream, sources } = await askTutor(history, question);
  const encoder = new TextEncoder();
  const reader = stream.getReader();

  const body2 = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`${SOURCES_SENTINEL}${JSON.stringify(sources)}\n`),
      );

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
      } catch (err) {
        console.error("[tutor] stream error", err);
      } finally {
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(body2, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
