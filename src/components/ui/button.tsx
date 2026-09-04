"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-gold-400 to-rose-400 text-midnight-950 shadow-glow-gold hover:brightness-110 focus-visible:ring-gold-300",
  secondary:
    "bg-white/5 text-moonlight-100 border border-white/15 hover:bg-white/10 focus-visible:ring-lavender-400",
  ghost:
    "bg-transparent text-moonlight-200 hover:bg-white/5 focus-visible:ring-lavender-400",
  danger:
    "bg-rose-600/20 text-rose-400 border border-rose-600/40 hover:bg-rose-600/30 focus-visible:ring-rose-400",
};

const sizes: Record<string, string> = {
  sm: "text-sm px-4 py-2 rounded-full",
  md: "text-base px-6 py-3 rounded-full",
  lg: "text-lg px-8 py-4 rounded-full",
};

/**
 * Returns the same visual classes as <Button/> for use on non-button
 * elements (e.g. Next.js <Link>) so links and buttons can share one look.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
} = {}) {
  return cn(
    "relative inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide",
    "transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-900",
    variants[variant!],
    sizes[size!],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-body font-medium tracking-wide",
          "transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-midnight-900",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
