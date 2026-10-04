"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, RagSource } from "@/lib/types";
import { ChatBubble } from "./ChatBubble";
import { Composer } from "./Composer";

/**
 * Sentinel separating the JSON provenance frame from the assistant text in
 * the /api/tutor/chat response. Must match app/api/tutor/chat/route.ts.
 */
const SOURCES_SENTINEL = "@@CORPUS_SOURCES@@";

const SUGGESTIONS = [
  "Trace blood from the vena cava to the aorta",
  "Why do femoral neck fractures risk avascular necrosis?",
  "Which brainstem division contains the cerebral aqueduct?",
  "What are the three diaphragmatic hiatuses?",
];

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function TutorPanel({ greeting }: { greeting?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, pending]);

  const send = useCallback(async (text: string) => {
    setError(null);
    setPending(true);

    const history = messages;
    const userMessage: ChatMessage = {
      id: uid(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const assistantId = uid();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", createdAt: Date.now() },
    ]);

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          history: history.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            createdAt: m.createdAt,
          })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Tutor request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sourcesParsed = false;
      let sources: RagSource[] | undefined;
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        if (!sourcesParsed) {
          const newline = buffer.indexOf("\n");
          if (newline === -1) continue;
          const first = buffer.slice(0, newline);
          if (first.startsWith(SOURCES_SENTINEL)) {
            try {
              sources = JSON.parse(first.slice(SOURCES_SENTINEL.length));
            } catch {
              sources = undefined;
            }
          }
          buffer = buffer.slice(newline + 1);
          sourcesParsed = true;
        }

        acc += buffer;
        buffer = "";

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc, sources } : m)),
        );
      }

      if (!sourcesParsed) {
        throw new Error("Malformed tutor response");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong asking the tutor.";
      setError(message);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  m.content ||
                  "I could not reach the tutor service. Check that OPENAI_API_KEY is set, or that the retrieval fallback is enabled.",
              }
            : m,
        ),
      );
    } finally {
      setPending(false);
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex-1 space-y-6 overflow-y-auto pe-1">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col justify-center gap-6 py-8">
            <div className="cx-bubble cx-bubble--tutor">
              <p>{greeting ?? "Ask me anything from the curriculum. I retrieve from the atlas and textbook first, then answer — and I will tell you when something is not in the corpus."}</p>
            </div>

            <div>
              <p className="cx-eyebrow">Try one of these</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => void send(s)}
                      className="rounded-full bg-[var(--cx-canvas-soft)] px-4 py-2.5 text-[var(--font-size-small)] text-[var(--cx-muted)] shadow-[inset_0_0_0_1px_var(--cx-line)] transition-[color,transform,box-shadow] duration-300 ease-[var(--ease-bounce)] hover:-translate-y-0.5 hover:text-[var(--cx-foreground)] hover:shadow-[inset_0_0_0_1px_var(--color-blush)]"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={
                message.role === "assistant" && pending && !message.content
                  ? { ...message, content: "Retrieving from the corpus…" }
                  : message
              }
            />
          ))
        )}
        <div ref={endRef} />
      </div>

      {error ? (
        <p className="cx-error" role="alert">
          {error}
        </p>
      ) : null}

      <Composer onSend={(text) => void send(text)} disabled={pending} />
    </div>
  );
}
