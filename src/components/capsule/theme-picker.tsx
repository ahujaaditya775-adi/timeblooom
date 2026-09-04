import { cn } from "@/lib/utils";

const themes = [
  { id: "midnight", label: "Midnight", classes: "from-midnight-800 to-midnight-950" },
  { id: "lavender", label: "Lavender dusk", classes: "from-lavender-500/40 to-midnight-900" },
  { id: "rose", label: "Dusty rose", classes: "from-rose-500/40 to-midnight-900" },
  { id: "gold", label: "Warm gold", classes: "from-gold-500/40 to-midnight-900" },
  { id: "teal", label: "Quiet teal", classes: "from-teal-500/40 to-midnight-900" },
];

export function ThemePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Cover theme">
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={value === t.id}
          aria-label={t.label}
          onClick={() => onChange(t.id)}
          className={cn(
            "h-12 w-12 rounded-full bg-gradient-to-br border-2 transition",
            t.classes,
            value === t.id ? "border-moonlight-100 scale-110" : "border-transparent opacity-70 hover:opacity-100"
          )}
        />
      ))}
    </div>
  );
}

export const COVER_THEMES = themes;
