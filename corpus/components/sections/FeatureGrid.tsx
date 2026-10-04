import { Card, CardBody } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Brain, Book, Heart, Spark } from "@/components/layout/Icon";

const FEATURES = [
  {
    icon: Book,
    title: "Structured curriculum",
    body: "Lessons are broken into blocks — prose, a structure to isolate, a clinical callout, then a question that checks it stuck.",
  },
  {
    icon: Heart,
    title: "Interactive atlas",
    body: "Isolate, hide and label any structure. Every lesson block deep-links straight into the viewer with the right view already set.",
  },
  {
    icon: Brain,
    title: "A tutor that cites",
    body: "Retrieval runs before generation, so answers come back with the textbook passage they were built from — or an honest 'not in the corpus'.",
  },
  {
    icon: Spark,
    title: "Mastery, not streaks",
    body: "Progress blends completion with quiz accuracy, rolled up per system, so a 90% ring means you can answer — not just that you scrolled.",
  },
];

export function FeatureGrid() {
  return (
    <ul className="mt-[var(--spacing-fluid-lg)] grid gap-5 sm:grid-cols-2">
      {FEATURES.map((feature, i) => {
        const Icon = feature.icon;
        return (
          <Reveal as="li" key={feature.title} index={i} stagger={70}>
            <Card className="h-full">
              <CardBody className="gap-5">
                <span className="inline-grid size-11 place-items-center rounded-full bg-[color-mix(in_oklab,var(--cx-accent)_16%,transparent)] text-[var(--cx-accent)]">
                  <Icon size={20} />
                </span>
                <h3 className="[font-size:var(--font-size-h4)] font-semibold leading-[1.15]">
                  {feature.title}
                </h3>
                <p className="text-[var(--font-size-body)] text-[var(--cx-muted)]">
                  {feature.body}
                </p>
              </CardBody>
            </Card>
          </Reveal>
        );
      })}
    </ul>
  );
}
