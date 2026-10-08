import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dices, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CoverArt } from "@/components/library/cover-art";
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
import { Input, NativeSelect } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { applyRandomFilters, pickRandom } from "@/lib/library/helpers";
import { useLibrary } from "@/lib/library/store";
import {
  DEFAULT_RANDOM_FILTERS,
  PLATFORMS,
  STATUS_LABEL,
  STATUSES,
  type Game,
  type RandomFilters,
  type Status,
} from "@/lib/library/types";
import { cn } from "@/lib/utils";

export function RandomizerDialog() {
  const open = useLibrary((s) => s.randomOpen);
  const setOpen = useLibrary((s) => s.setRandomOpen);
  const games = useLibrary((s) => s.games);
  const lists = useLibrary((s) => s.lists);
  const createList = useLibrary((s) => s.createList);
  const deleteList = useLibrary((s) => s.deleteList);
  const navigate = useNavigate();

  const [filters, setFilters] = useState<RandomFilters>(DEFAULT_RANDOM_FILTERS);
  const [picked, setPicked] = useState<Game | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [preview, setPreview] = useState<Game | null>(null);
  const [reveal, setReveal] = useState(false);
  const [newListName, setNewListName] = useState("");

  const pool = useMemo(
    () => applyRandomFilters(games, filters, lists),
    [games, filters, lists],
  );

  useEffect(() => {
    if (!spinning || pool.length === 0) return;

    let ticks = 0;
    const maxTicks = 18;
    const timer = window.setInterval(() => {
      const next = pool[Math.floor(Math.random() * pool.length)] ?? null;
      setPreview(next);
      ticks += 1;
      if (ticks >= maxTicks) {
        window.clearInterval(timer);
      }
    }, 70);

    return () => window.clearInterval(timer);
  }, [spinning, pool]);

  function patch<K extends keyof RandomFilters>(key: K, value: RandomFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function roll() {
    if (pool.length === 0) {
      setPicked(null);
      setPreview(null);
      setReveal(false);
      return;
    }

    setSpinning(true);
    setReveal(false);
    setPicked(null);

    window.setTimeout(() => {
      const result = pickRandom(pool, picked);
      setPicked(result);
      setPreview(result);
      setSpinning(false);
      setReveal(true);
    }, 1400);
  }

  function handleCreateList() {
    const name = newListName.trim();
    if (!name) {
      toast.error("Podaj nazwe listy.");
      return;
    }
    const id = createList(name);
    setNewListName("");
    patch("listId", id);
    toast.success("Utworzono liste.");
  }

  const shown = spinning ? preview : picked;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setPicked(null);
          setPreview(null);
          setSpinning(false);
          setReveal(false);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Losowanie</DialogTitle>
          <DialogDescription>
            Ustaw filtry, a polka wybierze jedna pozycje z puli {pool.length}.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="grid gap-5 pb-2 sm:grid-cols-2">
            <div className="space-y-3">
              <ToggleRow
                label="Tylko ulubione"
                checked={filters.favoritesOnly}
                onChange={(favoritesOnly) => patch("favoritesOnly", favoritesOnly)}
              />
              <ToggleRow
                label="Ukryj 100%"
                checked={filters.hideComplete}
                onChange={(hideComplete) => patch("hideComplete", hideComplete)}
              />
              <ToggleRow
                label="Tylko z korona"
                checked={filters.completeOnly}
                onChange={(completeOnly) => patch("completeOnly", completeOnly)}
              />

              <div className="space-y-1.5">
                <Label>Lista</Label>
                <NativeSelect
                  value={filters.listId ?? ""}
                  onChange={(e) => patch("listId", e.target.value || null)}
                >
                  <option value="">Cala polka</option>
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list.gameIds.length})
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div className="flex gap-2">
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Nowa lista..."
                />
                <Button type="button" variant="secondary" size="icon" onClick={handleCreateList}>
                  <Plus />
                </Button>
              </div>

              {filters.listId ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 justify-start px-2 text-destructive"
                  onClick={() => {
                    deleteList(filters.listId!);
                    patch("listId", null);
                    toast.success("Usunieto liste.");
                  }}
                >
                  <Trash2 className="size-4" />
                  Usun wybrana liste
                </Button>
              ) : null}

              <div className="space-y-1.5">
                <Label>Status</Label>
                <NativeSelect
                  value={filters.status}
                  onChange={(e) => patch("status", e.target.value as Status | "all")}
                >
                  <option value="all">Dowolny</option>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABEL[status]}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div className="space-y-1.5">
                <Label>Platforma</Label>
                <NativeSelect
                  value={filters.platform ?? ""}
                  onChange={(e) => patch("platform", e.target.value || null)}
                >
                  <option value="">Dowolna</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <Label>Minimalna ocena</Label>
                  <span className="tabular-nums text-muted">
                    {filters.minRating == null ? "brak" : filters.minRating.toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  step={0.5}
                  value={[filters.minRating ?? 0]}
                  onValueChange={(value) => patch("minRating", value[0] ?? 0)}
                />
                <button
                  type="button"
                  className="mt-1 text-xs text-muted underline-offset-4 hover:underline"
                  onClick={() => patch("minRating", null)}
                >
                  Bez progu
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Rok od</Label>
                  <Input
                    type="number"
                    value={filters.yearFrom ?? ""}
                    onChange={(e) =>
                      patch("yearFrom", e.target.value === "" ? null : Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Rok do</Label>
                  <Input
                    type="number"
                    value={filters.yearTo ?? ""}
                    onChange={(e) =>
                      patch("yearTo", e.target.value === "" ? null : Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl bg-card p-4">
              {shown ? (
                <button
                  type="button"
                  disabled={spinning}
                  className={cn(
                    "w-full max-w-[220px] text-left transition-all duration-500",
                    spinning && "scale-95 opacity-80 blur-[1px]",
                    reveal && !spinning && "scale-100 opacity-100",
                  )}
                  onClick={() => {
                    if (spinning || !picked) return;
                    setOpen(false);
                    void navigate({ to: "/gra/$id", params: { id: picked.id } });
                  }}
                >
                  <div
                    className={cn(
                      "overflow-hidden rounded-lg shadow-[var(--shadow-border)] transition-transform duration-300",
                      spinning && "animate-pulse",
                    )}
                  >
                    <CoverArt game={shown} />
                  </div>
                  <p className="mt-3 font-display text-lg leading-snug">{shown.title}</p>
                  <p className="text-sm text-muted">
                    {shown.year ?? "-"} · {shown.platform}
                  </p>
                  {spinning ? (
                    <p className="mt-2 text-xs text-muted">Losuje...</p>
                  ) : null}
                </button>
              ) : (
                <div className="space-y-3 text-center">
                  <Dices
                    className={cn(
                      "mx-auto size-10 text-muted",
                      spinning && "animate-spin text-primary",
                    )}
                  />
                  <p className="text-sm text-muted">
                    {pool.length === 0
                      ? "Zadna gra nie pasuje do filtrow."
                      : "Nacisnij Losuj, gdy filtry sa gotowe."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setFilters(DEFAULT_RANDOM_FILTERS);
              setPicked(null);
              setPreview(null);
              setReveal(false);
            }}
          >
            Reset filtrow
          </Button>
          <Button type="button" onClick={roll} disabled={pool.length === 0 || spinning}>
            {picked ? "Losuj ponownie" : "Losuj"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex h-11 items-center justify-between gap-3 rounded-lg bg-card px-3">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}