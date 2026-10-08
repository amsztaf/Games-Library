import { Toaster as Sonner } from "sonner";

function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "bg-surface text-fg border-border shadow-[var(--shadow-border-hover)] font-sans",
          description: "text-muted",
        },
      }}
    />
  );
}

export { Toaster };
