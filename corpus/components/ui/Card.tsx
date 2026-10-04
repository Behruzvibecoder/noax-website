import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Content card with Noax's "peel" corner — a triangle of accent colour that
 * slides in on hover while the card tilts on the bounce curve.
 */
export function Card({
  children,
  className,
  peel = true,
}: {
  children: ReactNode;
  className?: string;
  peel?: boolean;
}) {
  return (
    <div className={cn("cx-card cx-peel", className)}>
      {peel ? <span className="cx-card__peel" aria-hidden="true" /> : null}
      {children}
    </div>
  );
}

export function CardLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "cx-card cx-peel group flex flex-col focus-visible:outline-offset-4",
        className,
      )}
    >
      <span className="cx-card__peel" aria-hidden="true" />
      {children}
    </Link>
  );
}

export function CardMedia({
  children,
  className,
  aspect = "4 / 3",
}: {
  children?: ReactNode;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={cn("cx-card__media grid place-items-center", className)}
      style={{ aspectRatio: aspect }}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("cx-card__body", className)}>{children}</div>;
}
