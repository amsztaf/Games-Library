import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { fileToBackgroundDataUrl } from "@/lib/library/image";
import { parseLibraryFile, serializeLibrary } from "@/lib/library/schema";
import { useLibrary } from "@/lib/library/store";
import { ACCENT_PRESETS, DEFAULT_APPEARANCE } from "@/lib/library/types";
import { cn } from "@/lib/utils";

export function SettingsDialog() {
  const open = useLibrary((s) => s.settingsOpen);
  const setOpen = useLibrary((s) => s.setSettingsOpen);
  const appearance = useLibrary((s) => s.appearance);
  const setAppearance = useLibrary((s) => s.setAppearance);
  const games = useLibrary((s) => s.games);
  const lists = useLibrary((s) => s.lists);
  const prefs = useLibrary((s) => s.prefs);
  const seeded = useLibrary((s) => s.seeded);
  const replaceLibrary = useLibrary((s) => s.replaceLibrary);
  const mergeLibrary = useLibrary((s) => s.mergeLibrary);
  const restoreSamples = useLibrary((s) => s.restoreSamples);
  const clearGames = useLibrary((s) => s.clearGames);

  const fileRef = useRef<HTMLInputElement>(null);
  const bgRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<"replace" | "merge">("merge");

  async function onBackground(file: File | undefined) {
    if (!file) return;
    try {
      const data = await fileToBackgroundDataUrl(file);
      setAppearance({ backgroundImage: data });
      toast.success("Ustawiono tlo.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nie udalo sie wczytac tla.");
    }
  }

  function exportLibrary() {
    const payload = {
      version: 1 as const,
      games,
      appearance,
      prefs,
      seeded,
      lists,
    };

    let json: string;
    try {
      json = serializeLibrary(payload as Parameters<typeof serializeLibrary>[0]);
    } catch {
      json = JSON.stringify(payload, null, 2);
    }

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `polka-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Zapisano plik biblioteki.");
  }

  async function onImport(file: File | undefined) {
    if (!file) return;
    try {
      const text = await file.text();
      const raw = JSON.parse(text) as {
        games?: unknown;
        lists?: unknown;
        appearance?: unknown;
        prefs?: unknown;
        seeded?: unknown;
      };

      let parsed: {
        games: typeof games;
        lists?: typeof lists;
        appearance?: typeof appearance;
        prefs?: typeof prefs;
        seeded?: boolean;
      };

      try {
        parsed = parseLibraryFile(raw as unknown) as typeof parsed;
      } catch {
        if (!Array.isArray(raw.games)) throw new Error("bad file");
        parsed = {
          games: raw.games as typeof games,
          lists: Array.isArray(raw.lists) ? (raw.lists as typeof lists) : [],
          appearance: (raw.appearance as typeof appearance) ?? appearance,
          prefs: (raw.prefs as typeof prefs) ?? prefs,
          seeded: Boolean(raw.seeded),
        };
      }

      if (importMode === "replace") {
        replaceLibrary({
          games: parsed.games,
          appearance: parsed.appearance,
          prefs: parsed.prefs,
          seeded: parsed.seeded,
          lists: parsed.lists ?? [],
        });
        toast.success(`Wczytano ${parsed.games.length} gier.`);
      } else {
        mergeLibrary(parsed.games);
        toast.success(`Dodano ${parsed.games.length} gier.`);
      }
    } catch {
      toast.error("Ten plik nie wyglada na eksport Polki.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wyglad i kopia</DialogTitle>
          <DialogDescription>
            Kolor, tlo oraz import i eksport calej polki.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <section className="space-y-3 pb-6">
            <h3 className="font-display text-base">Kolor akcentu</h3>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Kolor ${color}`}
                  onClick={() => setAppearance({ accent: color })}
                  className={cn(
                    "size-11 rounded-full border border-border",
                    appearance.accent === color && "ring-2 ring-fg ring-offset-2 ring-offset-bg",
                  )}
                  style={{ background: color }}
                />
              ))}
              <label className="relative size-11 overflow-hidden rounded-full border border-border">
                <span className="sr-only">Wlasny kolor</span>
                <input
                  type="color"
                  value={appearance.accent}
                  onChange={(e) => setAppearance({ accent: e.target.value })}
                  className="absolute inset-0 size-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                />
              </label>
            </div>
          </section>

          <section className="space-y-3 pb-6">
            <h3 className="font-display text-base">Tlo</h3>
            <p className="text-sm text-muted">
              Wlasne zdjecie za siatka okladek. Przyciemnienie zostawia tekst czytelnym.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => bgRef.current?.click()}>
                Wybierz zdjecie
              </Button>
              {appearance.backgroundImage ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAppearance({ backgroundImage: null })}
                >
                  Usun tlo
                </Button>
              ) : null}
            </div>
            <input
              ref={bgRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                void onBackground(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <div>
              <div className="mb-1 flex justify-between">
                <Label>Przyciemnienie</Label>
                <span className="text-xs tabular-nums text-muted">
                  {Math.round(appearance.backgroundDim * 100)}%
                </span>
              </div>
              <Slider
                min={0.35}
                max={0.92}
                step={0.01}
                value={[appearance.backgroundDim]}
                onValueChange={(value) =>
                  setAppearance({ backgroundDim: value[0] ?? DEFAULT_APPEARANCE.backgroundDim })
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setAppearance(DEFAULT_APPEARANCE)}
            >
              Przywroc domyslny wyglad
            </Button>
          </section>

          <section className="space-y-3 pb-6">
            <h3 className="font-display text-base">Import i eksport</h3>
            <p className="text-sm text-muted">
              Zapiszesz polke do pliku JSON - okladki, plyty i listy jada razem z danymi.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={exportLibrary}>
                Eksportuj biblioteke
              </Button>
              <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
                Importuj plik
              </Button>
            </div>
            <div className="flex gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="import-mode"
                  checked={importMode === "merge"}
                  onChange={() => setImportMode("merge")}
                />
                Dodaj do istniejacych
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="import-mode"
                  checked={importMode === "replace"}
                  onChange={() => setImportMode("replace")}
                />
                Zastap cala polke
              </label>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => {
                void onImport(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </section>

          <section className="space-y-3 pb-4">
            <h3 className="font-display text-base">Kolekcja</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  restoreSamples();
                  toast.success("Dodano przykladowe gry.");
                }}
              >
                Wczytaj przyklady
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (window.confirm("Usunac wszystkie gry z polki?")) {
                    clearGames();
                    toast.success("Polka jest pusta.");
                  }
                }}
              >
                Wyczysc polke
              </Button>
            </div>
          </section>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}