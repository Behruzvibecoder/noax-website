"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  /** 0..1 — how much of the element must be visible. */
  threshold?: number;
  rootMargin?: string;
  /** Keep the revealed state after leaving the viewport. */
  once?: boolean;
}

/**
 * IntersectionObserver-driven reveal. Adds `.is-visible`, which the CSS in
 * styles/motion.css animates. Honours prefers-reduced-motion by resolving
 * immediately — the element is visible either way, only the transition is
 * skipped.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  { threshold = 0.18, rootMargin = "0px 0px -8% 0px", once = true }: Options = {},
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible } as const;
}
