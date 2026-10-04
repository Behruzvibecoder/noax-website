import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className="flex flex-col gap-2">
      <p
        className={cn(
          "cx-eyebrow",
          isUser ? "self-end text-[var(--cx-muted)]" : "text-[var(--cx-accent)]",
        )}
      >
        {isUser ? "You" : "CORPUS tutor"}
      </p>

      <div className={cn("cx-bubble", isUser ? "cx-bubble--user" : "cx-bubble--tutor")}>
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.sources && message.sources.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--cx-line)] pt-3">
            {message.sources.map((source, i) => (
              <span key={source.id} className="cx-source" title={source.snippet}>
                S{i + 1} · {source.title}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
