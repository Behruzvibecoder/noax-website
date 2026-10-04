import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { SystemGrid } from "@/components/sections/SystemGrid";
import { TutorPreview } from "@/components/sections/TutorPreview";
import { CTASection } from "@/components/sections/CTASection";

const MARQUEE_TERMS = [
  "Cor",
  "Aorta",
  "Femur",
  "Cerebellum",
  "Diaphragma",
  "Pulmo",
  "Tibia",
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <Marquee items={MARQUEE_TERMS} />

      <section className="cx-section cx-container">
        <SectionHeading
          eyebrow="The method"
          title={
            <>
              Built for the way anatomy is actually{" "}
              <span className="text-[var(--color-blush)]">learned</span>.
            </>
          }
          lede="Read it, see it, isolate it, then get asked about it. Every lesson follows the same four-beat rhythm, so the material compounds instead of blurring."
        />
        <FeatureGrid />
      </section>

      <section className="cx-section cx-container">
        <SectionHeading
          eyebrow="Curriculum"
          title="Six systems, one atlas."
          lede="Each system opens into lessons that deep-link straight into the structures they teach — the viewer is never more than one click away."
        />
        <SystemGrid />
      </section>

      <section className="cx-section cx-container">
        <SectionHeading
          eyebrow="AI tutor"
          title="Answers that show their work."
          lede="Retrieval-augmented generation grounded in your own course material, with every claim traced back to the passage it came from."
        />
        <TutorPreview />
      </section>

      <CTASection />
    </>
  );
}
