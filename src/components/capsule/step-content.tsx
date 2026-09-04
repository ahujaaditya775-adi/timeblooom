"use client";

import { useRef } from "react";
import Image from "next/image";
import { Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateMediaFile } from "@/lib/utils";
import { toast } from "sonner";

export interface PendingMedia {
  id: string;
  file: File;
  previewUrl: string;
  kind: "image" | "video" | "audio";
}

export function StepContent({
  memoryText,
  onMemoryTextChange,
  media,
  onMediaChange,
}: {
  memoryText: string;
  onMemoryTextChange: (v: string) => void;
  media: PendingMedia[];
  onMediaChange: (m: PendingMedia[]) => void;
}) {
  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const audioInput = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const additions: PendingMedia[] = [];

    for (const file of Array.from(files)) {
      const result = validateMediaFile(file);
      if (!result.ok) {
        toast.error(result.error);
        continue;
      }
      if (result.kind === "video" && media.some((m) => m.kind === "video")) {
        toast.error("Only one video per capsule.");
        continue;
      }
      additions.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        kind: result.kind,
      });
    }

    if (additions.length) onMediaChange([...media, ...additions]);
  }

  function removeMedia(id: string) {
    const target = media.find((m) => m.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onMediaChange(media.filter((m) => m.id !== id));
  }

  const photos = media.filter((m) => m.kind === "image");
  const video = media.find((m) => m.kind === "video");
  const audio = media.find((m) => m.kind === "audio");

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="memoryText">Your memory letter</Label>
        <Textarea
          id="memoryText"
          value={memoryText}
          onChange={(e) => onMemoryTextChange(e.target.value)}
          placeholder="Dear future me…"
          className="min-h-[220px] font-display text-lg leading-relaxed"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Photos</Label>
          <Button type="button" variant="secondary" size="sm" onClick={() => photoInput.current?.click()}>
            Add photos
          </Button>
          <input
            ref={photoInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
        {photos.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((p) => (
              <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10">
                <Image src={p.previewUrl} alt="" fill sizes="150px" className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removeMedia(p.id)}
                  aria-label="Remove photo"
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-midnight-950/80 text-xs text-moonlight-100 opacity-0 transition group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-moonlight-300/50">No photos added yet.</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Short video (optional)</Label>
          {!video && (
            <Button type="button" variant="secondary" size="sm" onClick={() => videoInput.current?.click()}>
              Add video
            </Button>
          )}
          <input
            ref={videoInput}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
        {video && (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="truncate text-sm text-moonlight-200">{video.file.name}</span>
            <button type="button" onClick={() => removeMedia(video.id)} className="text-sm text-rose-300 hover:underline">
              Remove
            </button>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label>Voice note (optional)</Label>
          {!audio && (
            <Button type="button" variant="secondary" size="sm" onClick={() => audioInput.current?.click()}>
              Add voice note
            </Button>
          )}
          <input
            ref={audioInput}
            type="file"
            accept="audio/mpeg,audio/wav,audio/webm,audio/mp4"
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
        {audio && (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="truncate text-sm text-moonlight-200">{audio.file.name}</span>
            <button type="button" onClick={() => removeMedia(audio.id)} className="text-sm text-rose-300 hover:underline">
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
