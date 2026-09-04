import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-white/[0.06]", className)} />;
}

export function CapsuleCardSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="mt-4 h-5 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/3" />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: { label: string; href: string };
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
      {icon}
      <h3 className="mt-4 font-display text-2xl text-moonlight-100">{title}</h3>
      <p className="mt-2 max-w-sm text-moonlight-300/70">{description}</p>
      {action && (
        <Button className="mt-6" onClick={() => (window.location.href = action.href)}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 px-6 py-8 text-center">
      <p className="text-rose-300">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 text-sm underline text-rose-200 hover:text-rose-100">
          Try again
        </button>
      )}
    </div>
  );
}
