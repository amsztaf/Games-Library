import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ImageField } from "@/components/library/image-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { emptyDraft, useLibrary } from "@/lib/library/store";
import { PLATFORMS, STATUS_LABEL, STATUSES, type Game, type Status } from "@/lib/library/types";

type Draft = ReturnType<typeof emptyDraft>;

function gameToDraft(game: Game): Draft {
  return {
    title: game.title,
    year: game.year,
    rating: game.rating,
    description: game.description,
    youtubeUrl: game.youtubeUrl,
    coverImage: game.coverImage,
    discImage: game.discImage,
    achievementsUnlocked: game.achievementsUnlocked,
    achievementsTotal: game.achievementsTotal,
    favorite: game.favorite,
    status: game.status,
    platform: game.platform,
    hoursPlayed: game.hoursPlayed,
  };
}

export function GameFormDialog() {
  const formOpen = useLibrary((s) => s.formOpen);
  const editingId = useLibrary((s) => s.editingId);
  const games = useLibrary((s) => s.games);
  const closeForm = useLibrary((s) => s.closeForm);
  const addGame = useLibrary((s) => s.addGame);
  const updateGame = useLibrary((s) => s.updateGame);

  const editing = useMemo(
    () => games.find((game) => game.id === editingId) ?? null,
    [games, editingId],
  );

  const [draft, setDraft] = useState<Draft>(emptyDraft());

  useEffect(() => {
    if (!formOpen) return;
    setDraft(editing ? gameToDraft(editing) : emptyDraft());
  }, [formOpen, editing]);

  function patch<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit() {
    const title = draft.title.trim();
    if (!title) {
      toast.error("Podaj nazwę gry.");
      return;
    }
    const payload = { ...draft, title };
    if (editing) {
      updateGame(editing.id, payload);
      toast.success("Zapisano zmiany.");
    } else {
      addGame(payload);
      toast.success("Dodano grę do półki.");
    }
    closeForm();
  }

  return (
    <Dialog open={formOpen} onOpenChange={(open) => (!open ? closeForm() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edytuj grę" : "Dodaj grę"}</DialogTitle>
          <DialogDescription>
            Okładka, płyta, osiągnięcia i trailer — wszystko zostaje na Twojej półce.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-5 pb-4 sm:grid-cols-[minmax(0,140px)_minmax(0,1fr)]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
              <ImageField
                label="Okładka"
                hint="Zdjęcie okładki"
                value={draft.coverImage}
                onChange={(coverImage) => patch("coverImage", coverImage)}
              />
              <ImageField
                label="Płyta"
                hint="Zdjęcie płyty"
                value={draft.discImage}
                onChange={(discImage) => patch("discImage", discImage)}
                round
              />
            </div>
            <div className="space-y-4">
              <Field label="Nazwa gry">
                <Input
                  value={draft.title}
                  onChange={(e) => patch("title", e.target.value)}
                  placeholder="np. Wiedźmin 3: Dziki Gon"
                  autoFocus
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rok">
                  <Input
                    type="number"
                    min={1970}
                    max={2100}
                    value={draft.year ?? ""}
                    onChange={(e) =>
                      patch("year", e.target.value === "" ? null : Number(e.target.value))
                    }
                  />
                </Field>
                <Field label="Platforma">
                  <NativeSelect
                    value={draft.platform}
                    onChange={(e) => patch("platform", e.target.value)}
                  >
                    {PLATFORMS.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
              </div>
              <Field label="Status">
                <NativeSelect
                  value={draft.status}
                  onChange={(e) => patch("status", e.target.value as Status)}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <Label>Ocena</Label>
                  <span className="text-xs tabular-nums text-muted">
                    {draft.rating == null ? "brak" : draft.rating.toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={0.1}
                  value={[draft.rating ?? 0]}
                  onValueChange={(value) => patch("rating", value[0] ?? 0)}
                />
                <button
                  type="button"
                  className="mt-1 text-xs text-muted underline-offset-4 hover:underline"
                  onClick={() => patch("rating", null)}
                >
                  Wyczyść ocenę
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Odblokowane osiągnięcia">
                  <Input
                    type="number"
                    min={0}
                    value={draft.achievementsUnlocked}
                    onChange={(e) =>
                      patch("achievementsUnlocked", Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                </Field>
                <Field label="Łączna liczba">
                  <Input
                    type="number"
                    min={0}
                    value={draft.achievementsTotal}
                    onChange={(e) =>
                      patch("achievementsTotal", Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                </Field>
              </div>
              <Field label="Godziny gry">
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={draft.hoursPlayed}
                  onChange={(e) => patch("hoursPlayed", Math.max(0, Number(e.target.value) || 0))}
                />
              </Field>
              <Field label="Link do YouTube">
                <Input
                  value={draft.youtubeUrl}
                  onChange={(e) => patch("youtubeUrl", e.target.value)}
                  placeholder="https://youtu.be/…"
                />
              </Field>
              <Field label="Opis">
                <Textarea
                  value={draft.description}
                  onChange={(e) => patch("description", e.target.value)}
                  placeholder="Kilka zdań o tym, dlaczego ta pozycja stoi na półce."
                />
              </Field>
              <label className="flex items-center justify-between gap-3 rounded-lg bg-card px-3 py-3">
                <span className="text-sm">Ulubiona</span>
                <Switch
                  checked={draft.favorite}
                  onCheckedChange={(favorite: boolean) => patch("favorite", favorite)}
                />
              </label>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={closeForm}>
            Anuluj
          </Button>
          <Button type="button" onClick={submit}>
            {editing ? "Zapisz" : "Dodaj na półkę"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
