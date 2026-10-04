import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/ui/AuthForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <>
      <p className="cx-eyebrow text-[var(--color-crimson)]">Welcome back</p>
      <h1 className="mt-5 [font-size:var(--font-size-h3)] font-bold leading-[1.05]">
        Sign in to CORPUS
      </h1>
      <p className="mt-4 text-[var(--font-size-body)] text-[var(--cx-muted)]">
        Your progress, bookmarks and tutor history pick up exactly where you
        left them.
      </p>

      <div className="mt-9">
        <AuthForm mode="login" redirectTo={next} serverError={error} />
      </div>

      <p className="mt-8 text-[var(--font-size-small)] text-[var(--cx-muted)]">
        No account yet?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[var(--color-crimson)] underline decoration-[var(--color-crimson)]/40 underline-offset-4 transition-colors hover:decoration-[var(--color-crimson)]"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
