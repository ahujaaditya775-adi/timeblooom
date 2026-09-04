import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string, timeZone?: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string, timeZone?: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone,
  }).format(new Date(iso));
}

export interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function getTimeRemaining(targetIso: string): TimeRemaining {
  const totalMs = new Date(targetIso).getTime() - Date.now();
  const isPast = totalMs <= 0;
  const abs = Math.abs(totalMs);

  return {
    totalMs,
    isPast,
    days: Math.floor(abs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((abs / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((abs / (1000 * 60)) % 60),
    seconds: Math.floor((abs / 1000) % 60),
  };
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let value = seconds;
  for (const [size, name] of units) {
    if (value < size) {
      const n = Math.max(1, Math.floor(value));
      return `${n} ${name}${n === 1 ? "" : "s"} ago`;
    }
    value /= size;
  }
  return "just now";
}

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024; // 200MB
export const MAX_AUDIO_BYTES = 25 * 1024 * 1024; // 25MB

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/webm", "audio/mp4"];

export function validateMediaFile(
  file: File
): { ok: true; kind: "image" | "video" | "audio" } | { ok: false; error: string } {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return file.size <= MAX_IMAGE_BYTES
      ? { ok: true, kind: "image" }
      : { ok: false, error: "Images must be under 15MB." };
  }
  if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return file.size <= MAX_VIDEO_BYTES
      ? { ok: true, kind: "video" }
      : { ok: false, error: "Videos must be under 200MB." };
  }
  if (ALLOWED_AUDIO_TYPES.includes(file.type)) {
    return file.size <= MAX_AUDIO_BYTES
      ? { ok: true, kind: "audio" }
      : { ok: false, error: "Voice notes must be under 25MB." };
  }
  return { ok: false, error: "Unsupported file type." };
}
