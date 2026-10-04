"use client";

import Link from "next/link";
import { PRIMARY_NAV } from "./nav";
import { Logo } from "./Logo";

/**
 * Full-screen overlay. Unfolds with clip-path: inset() over 0.9s on Noax's
 * signature curve; each item's underline sweeps out on a 120ms stagger.
 */
export function MenuOverlay({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <div
      id="corpus-menu"
      className="cx-menu"
      data-state={open ? "open" : "closed"}
      aria-hidden={!open}
    >
      <div className="cx-container flex h-[4.5rem] items-center justify-between md:h-[5.5rem]">
        <Logo className="text-[1.15rem] text-[var(--color-cream)]" />
        <button
          type="button"
          onClick={onClose}
          className="text-[var(--font-size-pill)] font-bold uppercase tracking-[0.14em] text-[var(--color-cream)] transition-colors duration-300 hover:text-[var(--color-blush)]"
          tabIndex={open ? 0 : -1}
        >
          Close
        </button>
      </div>

      <nav
        aria-label="Overlay"
        className="cx-container flex flex-1 flex-col justify-center gap-[clamp(0.5rem,1vw,1.25rem)] pb-[var(--spacing-fluid-xl)]"
      >
        {PRIMARY_NAV.map((item, i) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <div key={item.href} className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <Link
                href={item.href}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
                aria-current={active ? "page" : undefined}
                className="cx-menu__item inline-block pb-1"
                style={{ ["--i" as string]: i }}
              >
                {item.label}
              </Link>
              {item.blurb ? (
                <span className="text-[var(--font-size-small)] text-[var(--color-ink-muted)]">
                  {item.blurb}
                </span>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="cx-container flex flex-wrap items-center justify-between gap-4 pb-10 text-[var(--font-size-smaller)] text-[var(--color-ink-muted)]">
        <span>Grounded anatomy tutoring</span>
        <span>hello@corpus.study</span>
      </div>
    </div>
  );
}
