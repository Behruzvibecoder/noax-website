"use client";

import { useRef, useState, type FormEvent } from "react";
import { Send } from "@/components/layout/Icon";

export function Composer({
  onSend,
  disabled,
  placeholder = "Ask about a structure, a lesion, a nerve…",
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const areaRef = useRef<HTMLTextAreaElement>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    if (areaRef.current) areaRef.current.style.height = "auto";
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e as unknown as FormEvent);
    }
  }

  function autoGrow() {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-end gap-3 rounded-[var(--radius-lg)] bg-[var(--cx-canvas-soft)] p-3 shadow-[inset_0_0_0_1px_var(--cx-line)] transition-shadow duration-300 focus-within:shadow-[inset_0_0_0_1px_var(--color-blush)]"
    >
      <textarea
        ref={areaRef}
        rows={1}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          autoGrow();
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Message the tutor"
        className="max-h-[200px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[var(--font-size-body)] outline-none placeholder:text-[var(--cx-muted)]"
      />

      <button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        aria-label="Send message"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--color-blush)] text-[var(--color-ink)] transition-transform duration-300 ease-[var(--ease-bounce)] hover:-rotate-6 disabled:opacity-40 disabled:hover:rotate-0"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
