import { cn } from "@/lib/cn";

/**
 * Mastery ring. Uses the same stroke-dashoffset technique Noax animates on
 * its social links, driven here by a 0..1 value.
 */
export function ProgressRing({
  value,
  size = 72,
  stroke = 5,
  label,
  className,
}: {
  /** 0..1 */
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(1, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      role="img"
      aria-label={label ?? `${Math.round(clamped * 100)}% mastery`}
    >
      <svg
        className="cx-ring -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.18}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--cx-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute font-[var(--font-display)] text-sm font-semibold tabular-nums">
        {Math.round(clamped * 100)}
      </span>
    </div>
  );
}
