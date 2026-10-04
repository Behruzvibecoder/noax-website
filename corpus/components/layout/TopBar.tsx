"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "./Icon";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  learn: "Lesson",
  anatomy: "Atlas",
  tutor: "AI Tutor",
};

/** Compact context bar above the working surface. */
export function TopBar({
  title,
  action,
}: {
  title?: string;
  action?: { href: string; label: string };
}) {
  const pathname = usePathname();
  const crumb = LABELS[pathname.split("/")[1] ?? ""] ?? "CORPUS";

  return (
    <div className="sticky top-0 z-[var(--z-sticky)] flex h-[4.5rem] shrink-0 items-center justify-between gap-4 border-b border-[var(--cx-line)] bg-[color-mix(in_oklab,var(--cx-canvas)_86%,transparent)] px-5 backdrop-blur-md md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-[var(--font-size-smaller)] font-bold uppercase tracking-[0.14em] text-[var(--cx-muted)]">
          {crumb}
        </span>
        {title ? (
          <>
            <span className="text-[var(--cx-line)]" aria-hidden="true">
              /
            </span>
            <span className="truncate font-[var(--font-display)] text-[var(--font-size-body)] font-semibold">
              {title}
            </span>
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {action ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-blush)] px-4 py-2 text-[var(--font-size-smaller)] font-bold uppercase tracking-[0.1em] text-[var(--color-ink)] transition-transform duration-300 ease-[var(--ease-bounce)] hover:rotate-[-2deg]"
          >
            {action.label} <ArrowRight size={14} />
          </Link>
        ) : null}

        <Link
          href="/"
          className="hidden text-[var(--font-size-smaller)] font-semibold text-[var(--cx-muted)] transition-colors duration-300 hover:text-[var(--cx-foreground)] sm:block"
        >
          Exit to site
        </Link>
      </div>
    </div>
  );
}
