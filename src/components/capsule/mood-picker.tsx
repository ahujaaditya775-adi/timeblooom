import { MOODS, type Mood } from "@/lib/types";
import { cn } from "@/lib/utils";

const swatch: Record<string, string> = {
  gold: "bg-gold-400",
  lavender: "bg-lavender-400",
  teal: "bg-teal-400",
  moonlight: "bg-moonlight-200",
  rose: "bg-rose-400",
};

export function MoodPicker({ value, onChange }: { value: Mood; onChange: (m: Mood) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Mood">
      {MOODS.map((m) => (
        <button
          key={m.value}
          type="button"
          role="radio"
          aria-checked={value === m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
            value === m.value
              ? "border-lavender-400/60 bg-lavender-400/10"
              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
          )}
        >
          <span className={cn("h-3 w-3 rounded-full", swatch[m.color])} />
          <span className="text-sm text-moonlight-100">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
