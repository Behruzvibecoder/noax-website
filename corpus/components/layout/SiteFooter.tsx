import Link from "next/link";
import { Logo } from "./Logo";
import { PRIMARY_NAV } from "./nav";

const LEGAL = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/disclaimer", label: "Clinical disclaimer" },
];

export function SiteFooter() {
  return (
    <footer className="surface-cream mt-[var(--spacing-fluid-2xl)] bg-[var(--cx-canvas)] text-[var(--cx-foreground)]">
      <div className="cx-container py-[var(--spacing-fluid-xl)]">
        <div className="grid gap-[var(--spacing-fluid-lg)] md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-md">
            <Logo className="text-[clamp(1.5rem,1.2rem+1vw,2.25rem)]" />
            <p className="mt-5 text-[var(--font-size-body)] text-[var(--cx-muted)]">
              Learn anatomy the way it is taught at the bedside — structure by
              structure, with an AI tutor that cites its sources.
            </p>
          </div>

          <nav aria-label="Product">
            <h2 className="cx-eyebrow text-[var(--color-crimson)]">Product</h2>
            <ul className="mt-5 space-y-3">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--font-size-body)] transition-colors duration-300 hover:text-[var(--color-crimson)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className="cx-eyebrow text-[var(--color-crimson)]">Legal</h2>
            <ul className="mt-5 space-y-3">
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--font-size-body)] transition-colors duration-300 hover:text-[var(--color-crimson)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="cx-rule my-10" />

        <div className="flex flex-wrap items-center justify-between gap-4 text-[var(--font-size-smaller)] text-[var(--cx-muted)]">
          <span>© {new Date().getFullYear()} CORPUS. Educational use only.</span>
          <span>
            Not a substitute for clinical judgement or institutional teaching.
          </span>
        </div>
      </div>
    </footer>
  );
}
