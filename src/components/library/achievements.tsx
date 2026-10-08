import { useState } from "react";
import { Minus, Plus, Trash2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { achievementRatio, isPlatinum } from "@/lib/library/helpers";
import { useLibrary } from "@/lib/library/store";
import type { Game } from "@/lib/library/types";

export function AchievementControl({ game }: { game: Game }) {
  const bumpAchievement = useLibrary((s) => s.bumpAchievement);
  const setAchievements = useLibrary((s) => s.setAchievements);
  const markPlatinum = useLibrary((s) => s.markPlatinum);
  const addCustomAchievement = useLibrary((s) => s.addCustomAchievement);
  const removeCustomAchievement = useLibrary((s) => s.removeCustomAchievement);

  const ratio = achievementRatio(game);
  const platinum = isPlatinum(game);
  const custom = game.customAchievements ?? [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleAdd() {
    if (!title.trim()) {
      toast.error("Podaj nazwę osiągnięcia.");
      return;
    }
    addCustomAchievement(game.id, {
      title: title.trim(),
      description: description.trim(),
      image,
    });
    setTitle("");
    setDescription("");
    setImage(null);
    toast.success("Dodano osiągnięcie.");
  }

  return (
    <div className="space-y-6">
      {/* Licznik klasycznych osiągnięć */}
      <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg">Osiągnięcia</h2>
            <p className="text-sm text-muted">
              Zmieniaj liczbę tutaj, bez wchodzenia w pełną edycję.
            </p>
          </div>
          <p className="font-display text-2xl tabular-nums">
            {game.achievementsUnlocked}
            <span className="text-base text-muted">
              /{game.achievementsTotal || "—"}
            </span>
          </p>
        </div>
        <Progress value={ratio * 100} className="h-2" />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => bumpAchievement(game.id, -1)}
            aria-label="Minus jedno osiągnięcie"
          >
            <Minus />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => bumpAchievement(game.id, 1)}
            aria-label="Plus jedno osiągnięcie"
          >
            <Plus />
          </Button>
          <Button
            type="button"
            variant={platinum ? "default" : "outline"}
            onClick={() => markPlatinum(game.id)}
          >
            Oznacz 100%
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Odblokowane</Label>
            <Input
              type="number"
              min={0}
              value={game.achievementsUnlocked}
              onChange={(e) =>
                setAchievements(game.id, Math.max(0, Number(e.target.value) || 0), game.achievementsTotal)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Łącznie</Label>
            <Input
              type="number"
              min={0}
              value={game.achievementsTotal}
              onChange={(e) =>
                setAchievements(
                  game.id,
                  game.achievementsUnlocked,
                  Math.max(0, Number(e.target.value) || 0),
                )
              }
            />
          </div>
        </div>
      </section>

      {/* Własne osiągnięcia */}
      <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)]">
        <h2 className="mb-1 font-display text-lg">Moje osiągnięcia</h2>
        <p className="mb-4 text-sm text-muted">
          Dodawaj własne osiągnięcia ze zdjęciem, tytułem i opisem.
        </p>

        {custom.length > 0 ? (
          <div className="mb-6 space-y-3">
            {custom.map((ach) => (
              <div
                key={ach.id}
                className="flex gap-3 rounded-lg border border-border/60 bg-bg/40 p-3"
              >
                {ach.image ? (
                  <img
                    src={ach.image}
                    alt=""
                    className="size-16 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-md bg-surface text-muted">
                    <ImagePlus className="size-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{ach.title}</p>
                  {ach.description ? (
                    <p className="mt-1 text-sm text-muted">{ach.description}</p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => {
                    removeCustomAchievement(game.id, ach.id);
                    toast.success("Usunięto osiągnięcie.");
                  }}
                  aria-label="Usuń osiągnięcie"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-6 text-sm text-muted">Brak własnych osiągnięć.</p>
        )}

        <div className="space-y-3 border-t border-border/60 pt-4">
          <div className="space-y-1.5">
            <Label>Tytuł osiągnięcia</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="np. Pokonałem ostatniego bossa"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Opis (opcjonalnie)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Krótki opis tego osiągnięcia..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Zdjęcie (opcjonalnie)</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {image ? (
              <img src={image} alt="" className="mt-2 max-h-32 rounded-md object-contain" />
            ) : null}
          </div>
          <Button type="button" onClick={handleAdd}>
            Dodaj osiągnięcie
          </Button>
        </div>
      </section>
    </div>
  );
}