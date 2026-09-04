"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { deleteCapsule } from "@/app/capsule/actions";
import { deleteAccountAction, type SettingsActionState } from "@/app/settings/actions";

interface CapsuleSummary {
  id: string;
  title: string;
  created_at: string;
}

export function CapsuleManagement({ capsules }: { capsules: CapsuleSummary[] }) {
  const [items, setItems] = useState(capsules);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this capsule permanently? This can't be undone.")) return;
    setPendingId(id);
    const result = await deleteCapsule(id);
    setPendingId(null);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setItems((prev) => prev.filter((c) => c.id !== id));
    toast.success("Capsule deleted.");
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <h2 className="font-display text-2xl text-moonlight-100">Manage capsules</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-moonlight-300/60">You don't have any capsules yet.</p>
      ) : (
        <ul className="mt-5 divide-y divide-white/5">
          {items.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-moonlight-100">{c.title}</p>
                <p className="text-xs text-moonlight-300/50">Created {formatDate(c.created_at)}</p>
              </div>
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={pendingId === c.id}
                onClick={() => handleDelete(c.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

const initialState: SettingsActionState = {};

export function DeleteAccountSection() {
  const [state, formAction] = useFormState(deleteAccountAction, initialState);

  return (
    <GlassCard className="border-rose-500/20 bg-rose-500/[0.03] p-6 sm:p-8">
      <h2 className="font-display text-2xl text-rose-300">Delete account</h2>
      <p className="mt-2 max-w-lg text-sm text-moonlight-300/70">
        This permanently deletes your account and every capsule, photo, video, and reflection in it. There is no
        way to undo this.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="confirmation">
            Type <span className="font-mono text-rose-300">DELETE</span> to confirm
          </Label>
          <Input id="confirmation" name="confirmation" placeholder="DELETE" required className="max-w-xs" />
        </div>

        {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}

        <DeleteButton />
      </form>
    </GlassCard>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="danger" loading={pending}>
      {pending ? "Deleting…" : "Permanently delete my account"}
    </Button>
  );
}
