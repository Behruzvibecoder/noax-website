import { cn } from "@/lib/cn";

/** Thin accent progress bar — Noax's .progress_bar, generalised. */
export function ProgressBar({
  value,
  className,
  label,
}: {
  /** 0..1 */
  value: number;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(1, value));

  return (
    <div
      className={cn("cx-progress", className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      style={{ ["--value" as string]: clamped }}
    >
      <span className="cx-progress__fill" />
    </div>
  );
}
