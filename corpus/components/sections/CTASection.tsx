import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/layout/Icon";

/** Closing statement block — Noax's large-type sign-off. */
export function CTASection() {
  return (
    <section className="cx-section relative overflow-hidden">
      <div className="cx-container">
        <Reveal as="span" variant="mask" index={0}>
          <p className="cx-eyebrow">Begin</p>
        </Reveal>
        <Reveal as="span" variant="mask" index={1} stagger={70}>
          <h2 className="mt-6 max-w-4xl [font-size:var(--font-size-h2)] font-medium leading-[1.02]">
            Your first lesson takes{" "}
            <span className="text-[var(--color-blush)]">eighteen minutes</span>.
          </h2>
        </Reveal>

        <Reveal index={2} stagger={80}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/signup" variant="accent" size="lg" trailing={<ArrowRight size={18} />}>
              Create your account
            </ButtonLink>
            <ButtonLink href="/learn/les-heart-chambers" variant="ghost" size="lg">
              Read a lesson first
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
