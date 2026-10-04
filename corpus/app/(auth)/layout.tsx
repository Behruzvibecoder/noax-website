import type { ReactNode } from "react";

/**
 * Auth surfaces run on the cream "paper" palette — Noax's inverted treatment —
 * and get their own vertical rhythm so the form sits comfortably on mobile.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="surface-cream flex min-h-screen flex-col justify-center bg-[var(--cx-canvas)] px-[var(--grid-margin)] pt-[9rem] pb-[var(--spacing-fluid-2xl)] text-[var(--cx-foreground)]">
      <div className="mx-auto w-full max-w-[30rem]">{children}</div>
    </div>
  );
}
