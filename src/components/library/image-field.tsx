import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fileToCompressedDataUrl } from "@/lib/library/image";
import { cn } from "@/lib/utils";

export function ImageField({
  label,
  hint,
  value,
  onChange,
  round,
}: {
  label: string;
  hint?: string;
  value: string | null;
  onChange: (next: string | null) => void;
  round?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const data = await fileToCompressedDataUrl(file);
      onChange(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wczytać zdjęcia.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={cn(
          "relative overflow-hidden border border-dashed border-border bg-card",
          round ? "aspect-square rounded-full" : "aspect-[3/4] rounded-lg",
        )}
      >
        {value ? (
          <img
            src={value}
            alt=""
            className={cn("size-full object-cover", round && "rounded-full")}
          />
        ) : (
          <button
            type="button"
            className="flex size-full min-h-28 flex-col items-center justify-center gap-2 px-3 text-center text-xs text-muted"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <ImagePlus className="size-5" />
            {busy ? "Przetwarzanie…" : hint ?? "Dodaj zdjęcie"}
          </button>
        )}
        {value ? (
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="absolute top-2 right-2"
            onClick={() => onChange(null)}
            aria-label="Usuń zdjęcie"
          >
            <X className="size-3.5" />
          </Button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          void onFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {value ? (
        <button
          type="button"
          className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
          onClick={() => inputRef.current?.click()}
        >
          Zmień zdjęcie
        </button>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
