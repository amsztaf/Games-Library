import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-card px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted shadow-[var(--shadow-border)]",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
