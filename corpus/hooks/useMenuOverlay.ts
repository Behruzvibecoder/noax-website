"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Full-screen menu overlay state.
 * Locks body scroll while open (Noax adds a class to <html>) and closes on
 * Escape or route change.
 */
export function useMenuOverlay() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    const root = document.documentElement;

    if (open) {
      root.classList.add("has-modal-menu-open");
      root.style.overflow = "hidden";
    } else {
      root.classList.remove("has-modal-menu-open");
      root.style.overflow = "";
    }

    return () => {
      root.classList.remove("has-modal-menu-open");
      root.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return { open, setOpen, close, toggle } as const;
}
