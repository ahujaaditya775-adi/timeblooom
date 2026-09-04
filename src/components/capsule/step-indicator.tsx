import { cn } from "@/lib/utils";

const steps = ["Basics", "Memory", "Future", "Preview"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4" aria-label="Capsule creation steps">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const state = stepNum === current ? "current" : stepNum < current ? "done" : "upcoming";
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                  state === "current" && "border-gold-400 bg-gold-400/15 text-gold-300",
                  state === "done" && "border-teal-400/60 bg-teal-400/15 text-teal-300",
                  state === "upcoming" && "border-white/15 text-moonlight-300/50"
                )}
                aria-current={state === "current" ? "step" : undefined}
              >
                {state === "done" ? "✓" : stepNum}
              </span>
              <span
                className={cn(
                  "hidden text-sm sm:inline",
                  state === "upcoming" ? "text-moonlight-300/40" : "text-moonlight-100"
                )}
              >
                {label}
              </span>
            </div>
            {stepNum < steps.length && <span className="h-px w-6 bg-white/10 sm:w-10" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
