import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/layout/Icon";

export default function NotFound() {
  return (
    <section className="cx-container grid min-h-[70vh] place-items-center py-[var(--spacing-fluid-2xl)] text-center">
      <div>
        <p className="cx-eyebrow">404</p>
        <h1 className="mt-6 [font-size:var(--font-size-h2)] font-medium leading-[1.02]">
          This structure does not
          <br />
          <span className="text-[var(--color-blush)]">appear in the atlas</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[var(--font-size-body)] text-[var(--cx-muted)]">
          The page you asked for is not in the corpus. Try the dashboard, or ask
          the tutor to find it for you.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/dashboard" variant="accent" trailing={<ArrowRight size={17} />}>
            Go to dashboard
          </ButtonLink>
          <Link
            href="/tutor"
            className="inline-flex items-center text-[var(--font-size-body)] font-semibold text-[var(--cx-muted)] underline underline-offset-4 transition-colors hover:text-[var(--cx-foreground)]"
          >
            Ask the tutor
          </Link>
        </div>
      </div>
    </section>
  );
}
