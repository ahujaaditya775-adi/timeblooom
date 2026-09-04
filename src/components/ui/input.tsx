"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-moonlight-100 " +
  "placeholder:text-moonlight-300/40 font-body outline-none transition-colors " +
  "focus:border-lavender-400/60 focus:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-lavender-400/40";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(fieldBase, error && "border-rose-500/60", className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-rose-400">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(fieldBase, "min-h-[140px] resize-y leading-relaxed", error && "border-rose-500/60", className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-rose-400">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

export function Label({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("mb-2 block font-body text-sm tracking-wide text-moonlight-300/80", className)}
    >
      {children}
    </label>
  );
}
