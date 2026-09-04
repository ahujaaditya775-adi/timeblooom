import { Input, Label, Textarea } from "@/components/ui/input";
import { MoodPicker } from "@/components/capsule/mood-picker";
import { ThemePicker } from "@/components/capsule/theme-picker";
import type { Mood } from "@/lib/types";

export interface BasicsData {
  title: string;
  description: string;
  mood: Mood;
  coverTheme: string;
}

export function StepBasics({
  data,
  onChange,
}: {
  data: BasicsData;
  onChange: (patch: Partial<BasicsData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Capsule title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="A letter to myself, five years from now"
          maxLength={120}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Short description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="One or two lines about what this capsule holds — shown on your dashboard, never the memory itself."
          maxLength={300}
          className="min-h-[90px]"
        />
      </div>

      <div>
        <Label>Mood</Label>
        <MoodPicker value={data.mood} onChange={(mood) => onChange({ mood })} />
      </div>

      <div>
        <Label>Cover theme</Label>
        <ThemePicker value={data.coverTheme} onChange={(coverTheme) => onChange({ coverTheme })} />
      </div>
    </div>
  );
}
