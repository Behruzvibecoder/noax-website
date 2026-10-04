import Link from "next/link";
import { SYSTEMS, lessonsForSystem } from "@/lib/learning/curriculum";
import { CardLink, CardBody } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Chip } from "@/components/ui/Chip";
import { ArrowUpRight } from "@/components/layout/Icon";

const SYSTEM_COLOR: Record<string, string> = {
  skeletal: "var(--color-cream-tint)",
  muscular: "var(--color-blush)",
  nervous: "var(--color-pill-stroke)",
  cardiovascular: "var(--color-crimson)",
  respiratory: "var(--color-ink-muted)",
  digestive: "var(--color-pill)",
};

/** Curriculum browser — one card per anatomical system. */
export function SystemGrid() {
  return (
    <ul className="mt-[var(--spacing-fluid-lg)] grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {SYSTEMS.map((system, i) => {
        const lessons = lessonsForSystem(system.id);
        const first = lessons[0];

        return (
          <Reveal as="li" key={system.id} index={i} stagger={60}>
            {first ? (
              <CardLink href={`/learn/${first.id}`} className="h-full">
                <CardBody className="gap-4 pt-6">
                  <span
                    className="inline-block size-2.5 rounded-full"
                    style={{ background: SYSTEM_COLOR[system.id] }}
                    aria-hidden="true"
                  />
                  <h3 className="[font-size:var(--font-size-h4)] font-semibold leading-[1.15]">
                    {system.name}
                  </h3>
                  <p className="text-[var(--font-size-smaller)] uppercase tracking-[0.12em] text-[var(--cx-muted)]">
                    {system.latin}
                  </p>
                  <p className="text-[var(--font-size-body)] text-[var(--cx-muted)]">
                    {first.title}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <Chip tone="outline">{lessons.length} lessons</Chip>
                    <span className="inline-flex items-center gap-1.5 text-[var(--font-size-smaller)] font-bold uppercase tracking-[0.1em] text-[var(--cx-accent)]">
                      Open <ArrowUpRight size={14} />
                    </span>
                  </div>
                </CardBody>
              </CardLink>
            ) : (
              <div className="cx-card h-full opacity-70">
                <CardBody className="gap-4 pt-6">
                  <span
                    className="inline-block size-2.5 rounded-full"
                    style={{ background: SYSTEM_COLOR[system.id] }}
                    aria-hidden="true"
                  />
                  <h3 className="[font-size:var(--font-size-h4)] font-semibold">
                    {system.name}
                  </h3>
                  <p className="text-[var(--font-size-smaller)] uppercase tracking-[0.12em] text-[var(--cx-muted)]">
                    {system.latin}
                  </p>
                  <Link href="/tutor" className="text-[var(--font-size-small)] text-[var(--cx-accent)]">
                    Coming soon — ask the tutor meanwhile
                  </Link>
                </CardBody>
              </div>
            )}
          </Reveal>
        );
      })}
    </ul>
  );
}
