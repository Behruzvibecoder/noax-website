"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number up to `to` once the element scrolls into view.
 * Mirrors Noax's preloader counter rhythm; falls back to the final value
 * under reduced motion.
 */
export function useCountUp(to: number, duration = 1200) {
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // easeOutQuint — Noax --ease-out-quint
          const eased = 1 - Math.pow(1 - t, 5);
          setValue(Math.round(to * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration]);

  return { ref, value } as const;
}
