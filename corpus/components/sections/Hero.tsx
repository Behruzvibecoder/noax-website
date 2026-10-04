import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Play } from "@/components/layout/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { StatRow } from "./StatRow";

/**
 * Landing hero. Noax's treatment adapted: a masked, oversized wordmark that
 * rises on page enter, an accent marker, then a dark anatomical "stage" panel
 * with a scan line where the 3D viewer mounts.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[8rem] md:pt-[11rem]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-70"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 0%, color-mix(in oklab, var(--color-blush) 22%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="cx-container relative">
        <Reveal variant="mask" index={0} stagger={70}>
          <p className="cx-eyebrow">AI-grounded anatomy</p>
        </Reveal>

        <h1 className="mt-6 font-[var(--font-display)] font-bold leading-[0.92] tracking-[-0.01em]">
          <Reveal as="span" variant="mask" index={1} stagger={70} className="[font-size:var(--font-size-h1)]">
            Learn the body
          </Reveal>
          <Reveal as="span" variant="mask" index={2} stagger={70} className="[font-size:var(--font-size-h1)]">
            <span className="text-[var(--color-blush)]">structure</span> by
          </Reveal>
          <Reveal as="span" variant="mask" index={3} stagger={70} className="[font-size:var(--font-size-h1)]">
            structure.
          </Reveal>
        </h1>

        <div className="mt-[var(--spacing-fluid-md)] grid gap-[var(--spacing-fluid-md)] lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-end">
          <Reveal index={4} stagger={80}>
            <p className="cx-prose text-[var(--font-size-body)]">
              CORPUS pairs a structured curriculum with an interactive atlas and
              a tutor that retrieves from your textbook before it answers — and
              shows you exactly where each claim came from.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/signup" variant="accent" size="lg" trailing={<ArrowRight size={18} />}>
                Start learning
              </ButtonLink>
              <ButtonLink href="/learn/les-heart-chambers" variant="ghost" trailing={<Play size={16} />}>
                Open a lesson
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal index={5} stagger={80}>
            <div className="cx-stage cx-scanline grid aspect-[16/10] place-items-center p-6">
              <div className="relative z-[1] text-center">
                <p className="cx-eyebrow">Atlas</p>
                <p className="mt-3 font-[var(--font-display)] text-[clamp(1.75rem,1.2rem+2vw,3rem)] font-bold leading-none">
                  Cor
                </p>
                <p className="mt-2 text-[var(--font-size-small)] text-[var(--cx-muted)]">
                  Four chambers · two circuits · one rhythm
                </p>
                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--cx-foreground)_8%,transparent)] px-4 py-2 text-[var(--font-size-smaller)] font-semibold text-[var(--cx-muted)]">
                  <span className="relative inline-flex size-2">
                    <span className="absolute inset-0 rounded-full bg-[var(--color-blush)]" />
                    <span className="cx-pulse-ring absolute inset-0 rounded-full" />
                  </span>
                  3D viewer mounts here
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-[var(--spacing-fluid-xl)]">
          <StatRow />
        </div>
      </div>
    </section>
  );
}
