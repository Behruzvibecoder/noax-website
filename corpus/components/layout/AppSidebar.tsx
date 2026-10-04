"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Book, Brain, Heart, Spark, ArrowUpRight } from "./Icon";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Spark },
  { href: "/learn/les-heart-chambers", label: "Lessons", icon: Book, prefix: "/learn" },
  { href: "/anatomy/st-heart", label: "Atlas", icon: Heart, prefix: "/anatomy" },
  { href: "/tutor", label: "AI Tutor", icon: Brain },
];

/**
 * Persistent learning rail. Collapses to an icon strip under lg, and to a
 * horizontal scroller on mobile so the lesson content keeps the full width.
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="surface-stage flex shrink-0 flex-col border-e border-[var(--cx-line)] bg-[var(--cx-canvas)] lg:w-[16.5rem]">
      <Link
        href="/"
        className="flex h-[4.5rem] items-center gap-3 px-6 text-[1.05rem] text-[var(--cx-foreground)]"
      >
        <Logo />
      </Link>

      <nav aria-label="Learning" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-4">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.prefix ? pathname.startsWith(item.prefix) : false);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex shrink-0 items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-[var(--font-size-small)] font-semibold transition-[background-color,color] duration-300 ease-[var(--ease)]",
                active
                  ? "bg-[color-mix(in_oklab,var(--color-blush)_14%,transparent)] text-[var(--color-blush)]"
                  : "text-[var(--cx-muted)] hover:bg-[color-mix(in_oklab,var(--cx-foreground)_6%,transparent)] hover:text-[var(--cx-foreground)]",
              )}
            >
              <Icon size={18} />
              <span className="whitespace-nowrap">{item.label}</span>
              {active ? (
                <span
                  className="absolute inset-y-2 -left-4 hidden w-[3px] rounded-full bg-[var(--color-blush)] lg:block"
                  aria-hidden="true"
                />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden p-4 lg:block">
        <div className="rounded-[var(--radius-md)] bg-[var(--cx-canvas-soft)] p-4">
          <p className="cx-eyebrow">Corpus</p>
          <p className="mt-3 text-[var(--font-size-small)] text-[var(--cx-muted)]">
            206 bones · 600 muscles · 86 named nerves. Every answer the tutor
            gives is cited back to the atlas.
          </p>
          <Link
            href="/tutor"
            className="mt-4 inline-flex items-center gap-1.5 text-[var(--font-size-small)] font-semibold text-[var(--color-blush)] transition-transform duration-300 ease-[var(--ease-bounce)] group-hover:translate-x-0.5"
          >
            Ask a question <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
