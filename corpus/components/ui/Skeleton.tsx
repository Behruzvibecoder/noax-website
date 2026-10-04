import { cn } from "@/lib/cn";

/** Neutral loading block. Keeps CLS flat while server data resolves. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-current/10",
        className,
      )}
      aria-hidden="true"
    />
  );
}
