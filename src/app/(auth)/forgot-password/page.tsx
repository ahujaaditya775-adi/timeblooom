"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordAction, type AuthActionState } from "@/app/(auth)/actions";

const initialState: AuthActionState = {};

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(forgotPasswordAction, initialState);

  return (
    <GlassCard className="p-8 sm:p-10">
      <h1 className="text-center font-display text-3xl text-moonlight-100">Reset your password</h1>
      <p className="mt-2 text-center text-sm text-moonlight-300/70">
        We'll send a link to get you back in.
      </p>

      {state?.success ? (
        <p className="mt-8 rounded-xl bg-teal-500/10 px-4 py-3 text-center text-sm text-teal-300">
          {state.success}
        </p>
      ) : (
        <form action={formAction} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          </div>
          {state?.error && (
            <p role="alert" className="rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
              {state.error}
            </p>
          )}
          <SubmitButton />
        </form>
      )}

      <p className="mt-6 text-center text-sm text-moonlight-300/70">
        <Link href="/login" className="text-lavender-300 hover:underline">
          Back to log in
        </Link>
      </p>
    </GlassCard>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      {pending ? "Sending…" : "Send reset link"}
    </Button>
  );
}
