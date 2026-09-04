import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Privacy } from "@/lib/types";

export interface FutureData {
  unlockDate: string; // yyyy-mm-dd
  unlockTime: string; // HH:mm
  timezone: string;
  privacy: Privacy;
  recipientEmail: string;
  recipientSubject: string;
}

const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const privacyOptions: { value: Privacy; label: string; description: string }[] = [
  { value: "private", label: "Private", description: "Only you can ever open this capsule." },
  { value: "shareable", label: "Shareable link", description: "Anyone with the link can view it once unlocked." },
  { value: "recipient", label: "Future recipient", description: "We'll email someone else when it unlocks." },
];

export function StepFuture({ data, onChange }: { data: FutureData; onChange: (patch: Partial<FutureData>) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="unlockDate">Unlock date</Label>
          <Input
            id="unlockDate"
            type="date"
            value={data.unlockDate}
            onChange={(e) => onChange({ unlockDate: e.target.value })}
            min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
            required
          />
        </div>
        <div>
          <Label htmlFor="unlockTime">Unlock time</Label>
          <Input
            id="unlockTime"
            type="time"
            value={data.unlockTime}
            onChange={(e) => onChange({ unlockTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="timezone">Timezone</Label>
        <select
          id="timezone"
          value={data.timezone}
          onChange={(e) => onChange({ timezone: e.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-moonlight-100 outline-none focus-visible:ring-2 focus-visible:ring-lavender-400/40"
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Privacy</Label>
        <div className="space-y-3">
          {privacyOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ privacy: opt.value })}
              className={cn(
                "w-full rounded-2xl border px-4 py-3 text-left transition",
                data.privacy === opt.value
                  ? "border-lavender-400/60 bg-lavender-400/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              )}
            >
              <p className="text-sm font-medium text-moonlight-100">{opt.label}</p>
              <p className="mt-0.5 text-xs text-moonlight-300/60">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {data.privacy === "recipient" && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div>
            <Label htmlFor="recipientEmail">Recipient email</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={data.recipientEmail}
              onChange={(e) => onChange({ recipientEmail: e.target.value })}
              placeholder="someone@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="recipientSubject">Message subject (optional)</Label>
            <Input
              id="recipientSubject"
              type="text"
              value={data.recipientSubject}
              onChange={(e) => onChange({ recipientSubject: e.target.value })}
              placeholder="A memory, just for you"
              maxLength={150}
            />
          </div>
        </div>
      )}
    </div>
  );
}
