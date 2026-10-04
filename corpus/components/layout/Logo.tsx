import { cn } from "@/lib/cn";

/**
 * CORPUS wordmark. The dot on the second "O" is the accent — a nod to the
 * anatomical marker used across the product.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-[var(--font-display)] font-bold tracking-tight",
        className,
      )}
    >
      <span aria-hidden="true" className="mr-[0.4em] inline-block size-[0.72em] rounded-full bg-[var(--cx-accent)] align-middle" />
      {compact ? "CRP" : "CORPUS"}
      <span className="sr-only">CORPUS</span>
    </span>
  );
}
