"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpAction, type AuthActionState } from "@/app/(auth)/actions";

const initialState: AuthActionState = {};

export default function SignupPage() {
  const [state, formAction] = useFormState(signUpAction, initialState);

  if (state?.success) {
    return (
      <GlassCard className="p-8 text-center sm:p-10">
        <h1 className="font-display text-3xl text-moonlight-100">Almost there</h1>
        <p className="mt-4 leading-relaxed text-moonlight-300/80">{state.success}</p>
        <Link href="/login" className="mt-6 inline-block text-sm text-lavender-300 hover:underline">
          Back to log in
        </Link>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8 sm:p-10">
      <h1 className="text-center font-display text-3xl text-moonlight-100">Begin your archive</h1>
      <p className="mt-2 text-center text-sm text-moonlight-300/70">
        A private place to keep what matters until it's time.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="fullName">Name</Label>
          <Input id="fullName" name="fullName" type="text" autoComplete="name" required placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
        </div>

        {state?.error && (
          <p role="alert" className="rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-moonlight-300/70">
        Already have an account?{" "}
        <Link href="/login" className="text-lavender-300 hover:underline">
          Log in
        </Link>
      </p>
    </GlassCard>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      {pending ? "Creating account…" : "Create account"}
    </Button>
  );
}
