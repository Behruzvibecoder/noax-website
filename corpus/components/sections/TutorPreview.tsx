import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/layout/Icon";

/** Static illustration of a grounded tutor answer, with real RAG provenance. */
export function TutorPreview() {
  return (
    <div className="mt-[var(--spacing-fluid-lg)] grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Reveal index={0} stagger={80}>
        <ol className="space-y-5">
          {[
            {
              step: "01",
              title: "Retrieval first",
              body: "Your question is embedded and matched against the indexed atlas and textbook chunks before any text is generated.",
            },
            {
              step: "02",
              title: "Answer with provenance",
              body: "The tutor writes from the retrieved passages and marks each claim with the source it came from.",
            },
            {
              step: "03",
              title: "Honest gaps",
              body: "If the corpus does not cover it, you are told so — then given general knowledge, clearly flagged as ungrounded.",
            },
          ].map((item) => (
            <li key={item.step} className="border-t border-[var(--cx-line)] pt-5">
              <p className="font-[var(--font-display)] text-[var(--font-size-h4)] font-bold text-[var(--cx-accent)]">
                {item.step}
              </p>
              <h3 className="mt-2 [font-size:var(--font-size-h6)] font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-[var(--font-size-body)] text-[var(--cx-muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <ButtonLink href="/tutor" variant="accent" trailing={<ArrowRight size={17} />}>
            Try the tutor
          </ButtonLink>
        </div>
      </Reveal>

      <Reveal index={1} stagger={80}>
        <div className="cx-card h-full">
          <div className="flex flex-col gap-4 p-[clamp(1.25rem,1rem+1vw,2rem)]">
            <div className="cx-bubble cx-bubble--user self-end">
              Why is an intracapsular femoral neck fracture more dangerous than
              an extracapsular one?
            </div>

            <div className="cx-bubble cx-bubble--user-none cx-bubble--tutor">
              <p>
                The retinacular vessels that supply the femoral head run along
                the neck <em>inside</em> the capsule. An intracapsular fracture
                tears them, so the head loses its blood supply and avascular
                necrosis follows. [S1]
              </p>
              <p className="mt-3">
                Extracapsular fractures sit outside that envelope, in
                well-vascularised cancellous bone, and heal far more reliably.
                [S2]
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="cx-source">S1 · Os femoris — blood supply</span>
                <span className="cx-source">S2 · Hip joint — clinical</span>
              </div>
            </div>

            <p className="text-[var(--font-size-smaller)] text-[var(--cx-muted)]">
              Rendered from the retrieval layer — no placeholder copy.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
