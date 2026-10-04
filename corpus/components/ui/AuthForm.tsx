"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field } from "./Field";
import { Button } from "./Button";

const ERROR_COPY: Record<string, string> = {
  "invalid-login-credentials": "That email and password do not match our records.",
  "email-not-confirmed": "Check your inbox — the confirmation link is still pending.",
  auth: "The sign-in link expired or was already used. Try again.",
};

/**
 * Email + password auth against Supabase.
 * When the Supabase env vars are not configured the form reports a clear
 * configuration message instead of throwing, so the surface stays reviewable.
 */
export function AuthForm({
  mode,
  redirectTo,
  serverError,
}: {
  mode: "login" | "signup";
  redirectTo?: string;
  serverError?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    serverError ? (ERROR_COPY[serverError] ?? "Sign-in failed. Please try again.") : null,
  );
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setBusy(false);
      setError(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
      );
      return;
    }

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name || null },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              redirectTo ?? "/dashboard",
            )}`,
          },
        });

        if (signUpError) throw signUpError;

        setNotice(
          "Account created. If email confirmation is enabled, check your inbox to finish.",
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        router.push(redirectTo ?? "/dashboard");
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate={false}>
      {mode === "signup" ? (
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      ) : null}

      <Field
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@university.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Field
        label="Password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        hint={mode === "signup" ? "At least 8 characters." : undefined}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error ? (
        <p className="cx-error" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="cx-hint" role="status">
          {notice}
        </p>
      ) : null}

      <Button type="submit" variant="accent" block disabled={busy}>
        {busy
          ? "Working…"
          : mode === "signup"
            ? "Create account"
            : "Sign in"}
      </Button>
    </form>
  );
}
