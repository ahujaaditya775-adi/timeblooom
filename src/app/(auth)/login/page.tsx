"use client";

import { Suspense } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInAction, type AuthActionState } from "@/app/(auth)/actions";

const initialState: AuthActionState = {};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <GlassCard className="p-8 sm:p-10">
          <p className="text-center text-moonlight-300">Loading...</p>
        </GlassCard>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [state, formAction] = useFormState(signInAction, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  return (
    <GlassCard className="p-8 sm:p-10">
      <h1 className="text-center font-display text-3xl text-moonlight-100">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-moonlight-300/70">
        Your capsules have been waiting quietly.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="mb-2 text-xs text-lavender-300 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
        </div>

        {state?.error && (
          <p role="alert" className="rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-moonlight-300/70">
        New to TimeBloom?{" "}
        <Link href="/signup" className="text-lavender-300 hover:underline">
          Create an account
        </Link>
      </p>
    </GlassCard>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      {pending ? "Signing in…" : "Log in"}
    </Button>
  );
}
