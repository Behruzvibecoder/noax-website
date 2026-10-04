"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { Menu, Close, ArrowRight } from "./Icon";
import { ACCOUNT_NAV, PRIMARY_NAV } from "./nav";
import { useMenuOverlay } from "@/hooks/useMenuOverlay";
import { MenuOverlay } from "./MenuOverlay";
import { cn } from "@/lib/cn";

/**
 * Marketing header. Noax's behaviour, reproduced:
 *   - fixed over the hero, gains a hairline + backdrop once you scroll
 *   - a 3px reading-progress bar pinned to its bottom edge
 *   - CTA wipes in from the left on page enter (cx-wipe)
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const menu = useMenuOverlay();
  const isHome = pathname === "/";

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);

        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <a
        href="#main"
        className="cx-sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:z-[var(--z-modal)] focus:-translate-x-1/2 focus:rounded-full focus:bg-[var(--color-blush)] focus:px-5 focus:py-2 focus:text-[var(--color-ink)]"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[var(--z-header)] transition-[background-color,backdrop-filter,box-shadow] duration-300 ease-[var(--ease)]",
          scrolled || !isHome
            ? "bg-[color-mix(in_oklab,var(--cx-canvas)_78%,transparent)] shadow-[inset_0_-1px_0_var(--cx-line)] backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <div className="cx-container flex h-[4.5rem] items-center justify-between gap-6 md:h-[5.5rem]">
          <Link
            href="/"
            aria-label="CORPUS home"
            className="text-[clamp(1.05rem,0.95rem+0.5vw,1.35rem)] text-[var(--cx-foreground)]"
          >
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {PRIMARY_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-[var(--font-size-small)] font-semibold tracking-[0.01em] transition-colors duration-300 ease-[var(--ease)]",
                    active
                      ? "text-[var(--cx-accent)]"
                      : "text-[var(--cx-foreground)] hover:text-[var(--cx-accent)]",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-[var(--cx-accent)] transition-transform duration-500 ease-[var(--ease)]",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Link
                href={ACCOUNT_NAV[0].href}
                className="text-[var(--font-size-small)] font-semibold text-[var(--cx-muted)] transition-colors duration-300 hover:text-[var(--cx-foreground)]"
              >
                {ACCOUNT_NAV[0].label}
              </Link>
            </div>

            <div className="cx-wipe" data-state={menu.open ? "hidden" : undefined}>
              <ButtonLink
                href="/signup"
                size="sm"
                variant="accent"
                trailing={<ArrowRight size={16} />}
              >
                {ACCOUNT_NAV[1].label}
              </ButtonLink>
            </div>

            <button
              type="button"
              onClick={menu.toggle}
              aria-expanded={menu.open}
              aria-controls="corpus-menu"
              aria-label={menu.open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full text-[var(--cx-foreground)] transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--cx-foreground)_10%,transparent)] lg:hidden"
            >
              {menu.open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>

        <div
          className="h-[2px] w-full origin-left bg-[var(--cx-accent)] transition-transform duration-150 ease-linear"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
      </header>

      <MenuOverlay open={menu.open} onClose={menu.close} pathname={pathname} />
    </>
  );
}
