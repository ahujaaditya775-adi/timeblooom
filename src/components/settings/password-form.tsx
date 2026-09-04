"use client";

import { useFormState, useFormStatus } from "react-dom";
import { GlassCard } from "@/components/ui/glass-card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePasswordAction, type SettingsActionState } from "@/app/settings/actions";

const initialState: SettingsActionState = {};

export function PasswordForm() {
  const [state, formAction] = useFormState(changePasswordAction, initialState);

  return (
    <GlassCard className="p-6 sm:p-8">
      <h2 className="font-display text-2xl text-moonlight-100">Password</h2>
      <form action={formAction} className="mt-6 space-y-5">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} />
        </div>

        {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
        {state?.success && <p className="text-sm text-teal-300">{state.success}</p>}

        <SubmitButton />
      </form>
    </GlassCard>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} size="sm">
      {pending ? "Updating…" : "Update password"}
    </Button>
  );
}
