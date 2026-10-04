"use client";

import { type CSSProperties, type ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/cn";

interface RevealProps {
  children: ReactNode;
  /** Stagger index — feeds the --i CSS variable. */
  index?: number;
  /** Milliseconds between siblings. */
  stagger?: number;
  className?: string;
  as?: "div" | "span" | "section" | "li" | "article" | "header" | "figure";
  variant?: "rise" | "mask";
}

/** Scroll-triggered reveal wrapper. See styles/motion.css. */
export function Reveal({
  children,
  index = 0,
  stagger = 60,
  className,
  as: Tag = "div",
  variant = "rise",
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  const style = {
    "--i": index,
    "--stagger": `${stagger}ms`,
  } as CSSProperties;

  return (
    <Tag
      ref={ref as never}
      style={style}
      className={cn(variant === "mask" ? "cx-mask-line" : "cx-reveal", visible && "is-visible", className)}
    >
      {variant === "mask" ? <span>{children}</span> : children}
    </Tag>
  );
}
