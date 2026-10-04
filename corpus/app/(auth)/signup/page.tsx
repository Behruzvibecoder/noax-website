import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/ui/AuthForm";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <>
      <p className="cx-eyebrow text-[var(--color-crimson)]">Get started</p>
      <h1 className="mt-5 [font-size:var(--font-size-h3)] font-bold leading-[1.05]">
        Create your account
      </h1>
      <p className="mt-4 text-[var(--font-size-body)] text-[var(--cx-muted)]">
        Six systems, an interactive atlas, and a tutor that cites every answer.
      </p>

      <div className="mt-9">
        <AuthForm mode="signup" />
      </div>

      <p className="mt-8 text-[var(--font-size-small)] text-[var(--cx-muted)]">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--color-crimson)] underline decoration-[var(--color-crimson)]/40 underline-offset-4 transition-colors hover:decoration-[var(--color-crimson)]"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
