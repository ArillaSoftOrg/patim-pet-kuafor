"use client";

import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/admin/forms/FormError";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/LocaleProvider";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dictionary } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Derived fresh from searchParams on every render (not seeded into state
  // once) so it's always correct for the query param proxy.ts redirects
  // here with after signing out a non-admin — a one-time useState
  // initializer would miss this if Next.js reuses the already-mounted
  // /admin/login page instance for the redirect landing rather than a true
  // fresh mount, which can happen since the user was just on this same
  // route immediately before submitting.
  const authorizationError =
    searchParams.get("error") === "not_authorized" ? dictionary.admin.login.notAuthorized : null;
  const error = submitError ?? authorizationError;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setSubmitError(signInError.message);
        return;
      }
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-[380px] rounded-lg border border-border bg-surface p-8">
        <Heading level="h3">{dictionary.admin.login.heading}</Heading>
        <p className="mt-2 text-[14px] text-muted-foreground">{dictionary.admin.login.subheading}</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[14px] font-medium text-foreground">
              {dictionary.admin.login.emailLabel}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[14px] font-medium text-foreground">
              {dictionary.admin.login.passwordLabel}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={Boolean(error)}
              required
            />
          </div>

          <FormError message={error} />

          <Button type="submit" disabled={loading}>
            {loading ? dictionary.admin.login.signingIn : dictionary.admin.login.signIn}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
