"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/glass-card";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { updateProfileAction, type SettingsActionState } from "@/app/settings/actions";

const initialState: SettingsActionState = {};

export function ProfileForm({
  userId,
  initialFullName,
  initialAvatarUrl,
}: {
  userId: string;
  initialFullName: string;
  initialAvatarUrl: string | null;
}) {
  const [state, formAction] = useFormState(updateProfileAction, initialState);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET || "avatars";
    const path = `${userId}/${crypto.randomUUID()}.${file.name.split(".").pop() || "jpg"}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      toast.error("Couldn't upload that image.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <h2 className="font-display text-2xl text-moonlight-100">Profile</h2>

      <form action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="avatarUrl" value={avatarUrl ?? ""} />

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 text-xl text-moonlight-100 transition hover:border-lavender-400/50"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Your avatar" className="h-full w-full object-cover" />
            ) : (
              initialFullName.charAt(0).toUpperCase() || "?"
            )}
          </button>
          <div>
            <Button type="button" variant="secondary" size="sm" loading={uploading} onClick={() => fileInput.current?.click()}>
              Change photo
            </Button>
            <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
        </div>

        <div>
          <Label htmlFor="fullName">Name</Label>
          <Input id="fullName" name="fullName" defaultValue={initialFullName} required maxLength={100} />
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
      {pending ? "Saving…" : "Save changes"}
    </Button>
  );
}
