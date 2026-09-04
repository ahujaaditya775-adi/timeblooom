"use client";

import { useFormState, useFormStatus } from "react-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPasswordAction, type AuthActionState } from "@/app/(auth)/actions";

const initialState: AuthActionState = {};

export default function ResetPasswordPage() {
  const [state, formAction] = useFormState(resetPasswordAction, initialState);

  return (
    <GlassCard className="p-8 sm:p-10">
      <h1 className="text-center font-display text-3xl text-moonlight-100">Choose a new password</h1>
      <p className="mt-2 text-center text-sm text-moonlight-300/70">
        This link is single-use, so this page only works if you just clicked it.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} />
        </div>

        {state?.error && (
          <p role="alert" className="rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
            {state.error}
          </p>
        )}

        <SubmitButton />
      </form>
    </GlassCard>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      {pending ? "Saving…" : "Save new password"}
    </Button>
  );
}
