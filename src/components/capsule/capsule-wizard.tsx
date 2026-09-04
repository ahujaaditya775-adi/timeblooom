"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/capsule/step-indicator";
import { StepBasics, type BasicsData } from "@/components/capsule/step-basics";
import { StepContent, type PendingMedia } from "@/components/capsule/step-content";
import { StepFuture, type FutureData } from "@/components/capsule/step-future";
import { StepPreview } from "@/components/capsule/step-preview";
import { createClient } from "@/lib/supabase/client";
import { createCapsule } from "@/app/capsule/actions";
import type { Mood } from "@/lib/types";

const defaultBasics: BasicsData = { title: "", description: "", mood: "nostalgic", coverTheme: "midnight" };
const defaultFuture: FutureData = {
  unlockDate: "",
  unlockTime: "09:00",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  privacy: "private",
  recipientEmail: "",
  recipientSubject: "",
};

export function CapsuleWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [basics, setBasics] = useState<BasicsData>(defaultBasics);
  const [memoryText, setMemoryText] = useState("");
  const [media, setMedia] = useState<PendingMedia[]>([]);
  const [future, setFuture] = useState<FutureData>(defaultFuture);
  const [sealing, setSealing] = useState(false);
  const [sealed, setSealed] = useState(false);

  const unlockAtIso = future.unlockDate ? new Date(`${future.unlockDate}T${future.unlockTime || "09:00"}`).toISOString() : "";

  function validateStep(current: number): boolean {
    if (current === 1 && !basics.title.trim()) {
      toast.error("Give your capsule a title before continuing.");
      return false;
    }
    if (current === 2 && !memoryText.trim()) {
      toast.error("Write at least a few words for future you.");
      return false;
    }
    if (current === 3) {
      if (!future.unlockDate) {
        toast.error("Choose an unlock date.");
        return false;
      }
      if (new Date(unlockAtIso).getTime() <= Date.now()) {
        toast.error("The unlock date needs to be in the future.");
        return false;
      }
      if (future.privacy === "recipient" && !future.recipientEmail.trim()) {
        toast.error("Add a recipient email, or choose a different privacy setting.");
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(4, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function handleSeal() {
    if (!validateStep(3)) return;
    setSealing(true);

    const { id, error } = await createCapsule({
      title: basics.title,
      description: basics.description,
      mood: basics.mood as Mood,
      coverTheme: basics.coverTheme,
      memoryText,
      unlockAt: unlockAtIso,
      timezone: future.timezone,
      privacy: future.privacy,
      recipientEmail: future.recipientEmail,
      recipientSubject: future.recipientSubject,
      coverImageUrl: "",
    });

    if (error || !id) {
      toast.error(error || "Something went wrong. Please try again.");
      setSealing(false);
      return;
    }

    if (media.length > 0) {
      await uploadMedia(id, media);
    }

    setSealing(false);
    setSealed(true);
    toast.success("Your capsule has been sealed.");
    setTimeout(() => router.push(`/capsule/${id}`), 2200);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <StepIndicator current={step} />

      <GlassCard className="mt-8 p-6 sm:p-8">
        {step === 1 && <StepBasics data={basics} onChange={(p) => setBasics((b) => ({ ...b, ...p }))} />}
        {step === 2 && (
          <StepContent
            memoryText={memoryText}
            onMemoryTextChange={setMemoryText}
            media={media}
            onMediaChange={setMedia}
          />
        )}
        {step === 3 && <StepFuture data={future} onChange={(p) => setFuture((f) => ({ ...f, ...p }))} />}
        {step === 4 && (
          <StepPreview
            title={basics.title}
            description={basics.description}
            mood={basics.mood}
            memoryText={memoryText}
            media={media}
            unlockAtIso={unlockAtIso || new Date(Date.now() + 86400000).toISOString()}
            timezone={future.timezone}
            sealing={sealing}
            sealed={sealed}
            onSeal={handleSeal}
          />
        )}

        {!sealed && (
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
            <Button type="button" variant="ghost" onClick={back} disabled={step === 1}>
              Back
            </Button>
            {step < 4 && (
              <Button type="button" onClick={next}>
                Continue
              </Button>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

async function uploadMedia(capsuleId: string, media: PendingMedia[]) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  let order = 0;
  for (const item of media) {
    const ext = item.file.name.split(".").pop() || "bin";
    const path = `${user.id}/${capsuleId}/${crypto.randomUUID()}.${ext}`;
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET || "capsule-media";

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, item.file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      toast.error(`Couldn't upload ${item.file.name}.`);
      continue;
    }

    const { data: signed } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 365);

    await supabase.from("capsule_media").insert({
      capsule_id: capsuleId,
      file_url: signed?.signedUrl || path,
      file_type: item.kind,
      file_name: item.file.name,
      display_order: order++,
    });
  }
}
