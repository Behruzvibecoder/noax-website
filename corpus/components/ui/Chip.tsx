import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "accent" | "outline" | "crimson";

const TONE: Record<Tone, string> = {
  default: "",
  accent: "cx-chip--accent",
  outline: "cx-chip--outline",
  crimson: "cx-chip--crimson",
};

export function Chip({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return <span className={cn("cx-chip", TONE[tone], className)}>{children}</span>;
}
