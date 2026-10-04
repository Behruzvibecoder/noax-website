import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

/** Eyebrow + statement + optional lede — the recurring Noax section rhythm. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-4xl"
      }
    >
      <Reveal as="span" variant="mask" index={0}>
        <p className="cx-eyebrow">{eyebrow}</p>
      </Reveal>
      <Reveal as="span" variant="mask" index={1} stagger={70}>
        <h2 className="mt-5 [font-size:var(--font-size-h3)] font-bold leading-[1.05]">
          {title}
        </h2>
      </Reveal>
      {lede ? (
        <Reveal index={2} stagger={80}>
          <p className="cx-prose mt-6 text-[var(--font-size-body)]">{lede}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
