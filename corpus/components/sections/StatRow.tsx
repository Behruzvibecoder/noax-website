"use client";

import { useCountUp } from "@/hooks/useCountUp";

const STATS = [
  { value: 206, suffix: "", label: "Named bones" },
  { value: 600, suffix: "+", label: "Skeletal muscles" },
  { value: 86, suffix: "", label: "Cranial & spinal nerves" },
  { value: 12, suffix: "k", label: "Indexed textbook passages" },
];

/** Counters that run when they scroll into view — Noax's counter rhythm. */
export function StatRow() {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {STATS.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </dl>
  );
}

function StatItem({ value, suffix, label }: (typeof STATS)[number]) {
  const { ref, value: current } = useCountUp(value, 1400);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="border-t border-[var(--cx-line)] pt-5">
      <dt className="sr-only">{label}</dt>
      <dd className="font-[var(--font-display)] text-[clamp(2.25rem,1.5rem+2.6vw,4rem)] font-bold leading-none tabular-nums">
        {current}
        <span className="text-[var(--color-blush)]">{suffix}</span>
      </dd>
      <dd className="mt-2 text-[var(--font-size-small)] text-[var(--cx-muted)]">{label}</dd>
    </div>
  );
}
