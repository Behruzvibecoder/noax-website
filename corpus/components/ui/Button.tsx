import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "solid" | "accent" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  /** Trailing glyph, e.g. an arrow. Rotates on hover. */
  trailing?: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  solid: "",
  accent: "cx-button--accent",
  ghost: "cx-button--ghost",
};

const SIZE: Record<Size, string> = {
  sm: "cx-button--sm",
  md: "",
  lg: "cx-button--lg",
};

type StyleProps = Pick<BaseProps, "variant" | "size" | "block" | "className">;

function classes({ variant = "solid", size = "md", block, className }: StyleProps) {
  return cn("cx-button", VARIANT[variant], SIZE[size], block && "cx-button--block", className);
}

/**
 * The CORPUS button — Noax's pill with an inner layer that rotates -5deg and
 * scales 1.02 on hover, on the bounce curve.
 */
export function Button({
  children,
  variant,
  size,
  block,
  className,
  trailing,
  ...rest
}: BaseProps & Omit<ComponentPropsWithoutRef<"button">, "className">) {
  return (
    <button className={classes({ variant, size, block, className })} {...rest}>
      <span className="cx-button__pill" aria-hidden="true" />
      <span className="cx-button__label">{children}</span>
      {trailing ? (
        <span
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          aria-hidden="true"
        >
          {trailing}
        </span>
      ) : null}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant,
  size,
  block,
  className,
  trailing,
  ...rest
}: BaseProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "className" | "href"
  >) {
  return (
    <Link
      href={href}
      className={cn("group", classes({ variant, size, block, className }))}
      {...rest}
    >
      <span className="cx-button__pill" aria-hidden="true" />
      <span className="cx-button__label">{children}</span>
      {trailing ? (
        <span
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          aria-hidden="true"
        >
          {trailing}
        </span>
      ) : null}
    </Link>
  );
}
