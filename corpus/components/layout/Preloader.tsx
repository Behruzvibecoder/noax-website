"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Noax-style counter preloader. Runs to 100 on the first paint of a session
 * only (sessionStorage), then fades out on the slowest curve.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("corpus-preloaded") === "1") {
      setSkip(true);
      return;
    }

    if (reduced) {
      setValue(100);
      setDone(true);
      sessionStorage.setItem("corpus-preloaded", "1");
      return;
    }

    const start = performance.now();
    const duration = 1100;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo — front-loads the count, like Noax's counter
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem("corpus-preloaded", "1");
        setDone(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  if (skip) return null;

  return (
    <div className="cx-preloader" data-state={done ? "done" : "loading"} aria-hidden={done}>
      <span className="cx-preloader__counter">
        {String(value).padStart(3, "0")}
      </span>
    </div>
  );
}
