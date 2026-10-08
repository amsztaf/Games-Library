import { useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Dices, Disc3, LayoutGrid, List, Plus, Search, Settings2 } from "lucide-react";
import { GameFormDialog } from "@/components/library/game-form";
import { ListsDialog } from "@/components/library/lists-dialog";
import { RandomizerDialog } from "@/components/library/randomizer";
import { SettingsDialog } from "@/components/library/settings-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/input";
import { libraryStats } from "@/lib/library/helpers";
import { useLibrary } from "@/lib/library/store";
import { STATUS_LABEL, STATUSES, type SortKey, type Status } from "@/lib/library/types";
import { contrastFg, cn } from "@/lib/utils";

export function ThemeSync() {
  const appearance = useLibrary((s) => s.appearance);
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", appearance.accent);
    root.style.setProperty("--accent-fg", contrastFg(appearance.accent));
    root.style.setProperty("--bg-dim", String(appearance.backgroundDim));
    if (appearance.backgroundImage) {
      root.style.setProperty("--user-bg", `url("${appearance.backgroundImage}")`);
    } else {
      root.style.setProperty("--user-bg", "none");
    }
  }, [appearance]);
  return null;
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-bg min-h-dvh">
      <div className="grain" />
      <div className="app-content mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pb-16 sm:px-6">
        <Header />
        {children}
      </div>
      <GameFormDialog />
      <RandomizerDialog />
      <SettingsDialog />
      <ListsDialog />
    </div>
  );
}

function Header() {
  const query = useLibrary((s) => s.filters.query);
  const setFilters = useLibrary((s) => s.setFilters);
  const openCreate = useLibrary((s) => s.openCreate);
  const setRandomOpen = useLibrary((s) => s.setRandomOpen);
  const setSettingsOpen = useLibrary((s) => s.setSettingsOpen);
  const setListsOpen = useLibrary((s) => s.setListsOpen);
  const games = useLibrary((s) => s.games);
  const stats = libraryStats(games);

  return (
    <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-border bg-bg/80 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-3 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="min-w-0 shrink-0">
            <p className="font-display text-xl tracking-tight sm:text-2xl">Polka</p>
            <p className="hidden text-[11px] tracking-[0.18em] text-muted uppercase sm:block">
              biblioteka gier
            </p>
          </Link>

          <div className="relative hidden min-w-0 flex-1 sm:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(e) => setFilters({ query: e.target.value })}
              placeholder="Szukaj tytulu, roku, platformy..."
              className="pl-9"
              aria-label="Szukaj"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="sm:hidden"
              onClick={() => setListsOpen(true)}
              aria-label="Listy"
            >
              <List />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="sm:hidden"
              onClick={() => setRandomOpen(true)}
              aria-label="Losuj"
            >
              <Dices />
            </Button>
            <Button
              type="button"
              size="icon"
              className="sm:hidden"
              onClick={openCreate}
              aria-label="Dodaj gre"
            >
              <Plus />
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="hidden sm:inline-flex"
              onClick={() => setListsOpen(true)}
            >
              <List />
              Listy
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="hidden sm:inline-flex"
              onClick={() => setRandomOpen(true)}
            >
              <Dices />
              Losuj
            </Button>
            <Button type="button" className="hidden sm:inline-flex" onClick={openCreate}>
              <Plus />
              Dodaj
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              aria-label="Ustawienia"
            >
              <Settings2 />
            </Button>
          </div>
        </div>

        <div className="relative sm:hidden">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setFilters({ query: e.target.value })}
            placeholder="Szukaj tytulu, roku, platformy..."
            className="pl-9"
            aria-label="Szukaj"
          />
        </div>
      </div>

      <p className="pb-3 text-xs text-muted tabular-nums">
        {stats.total} gier · {stats.favorites} ulubionych · {stats.crowns} z korona
        {stats.avgRating != null ? ` · srednia ${stats.avgRating.toFixed(1)}` : ""}
      </p>
    </header>
  );
}

export function FilterBar() {
  const filters = useLibrary((s) => s.filters);
  const setFilters = useLibrary((s) => s.setFilters);
  const prefs = useLibrary((s) => s.prefs);
  const setPrefs = useLibrary((s) => s.setPrefs);

  const chips: { key: string; label: string; active: boolean; onClick: () => void }[] = [
    {
      key: "all",
      label: "Wszystkie",
      active:
        !filters.favoritesOnly &&
        !filters.completeOnly &&
        !filters.incompleteOnly &&
        filters.status === "all",
      onClick: () =>
        setFilters({
          favoritesOnly: false,
          completeOnly: false,
          incompleteOnly: false,
          status: "all",
        }),
    },
    {
      key: "fav",
      label: "Ulubione",
      active: filters.favoritesOnly,
      onClick: () => setFilters({ favoritesOnly: !filters.favoritesOnly }),
    },
    {
      key: "crown",
      label: "100%",
      active: filters.completeOnly,
      onClick: () =>
        setFilters({ completeOnly: !filters.completeOnly, incompleteOnly: false }),
    },
    ...STATUSES.map((status) => ({
      key: status,
      label: STATUS_LABEL[status],
      active: filters.status === status,
      onClick: () => setFilters({ status: filters.status === status ? "all" : (status as Status) }),
    })),
  ];

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={chip.onClick}
            className={cn(
              "h-11 shrink-0 rounded-full px-4 text-sm transition-colors",
              chip.active ? "bg-primary text-primary-foreground" : "bg-card text-muted hover:text-fg",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <NativeSelect
          value={prefs.sort}
          onChange={(e) => setPrefs({ sort: e.target.value as SortKey })}
          aria-label="Sortowanie"
          className="h-11 w-auto min-w-40"
        >
          <option value="added">Najnowsze</option>
          <option value="title">Tytul</option>
          <option value="year">Rok</option>
          <option value="rating">Ocena</option>
          <option value="played">Ostatnio otwarte</option>
        </NativeSelect>

        <Button
          type="button"
          variant={prefs.view === "covers" ? "secondary" : "ghost"}
          size="icon"
          aria-label="Widok okladek"
          onClick={() => setPrefs({ view: "covers" })}
        >
          <LayoutGrid />
        </Button>
        <Button
          type="button"
          variant={prefs.view === "discs" ? "secondary" : "ghost"}
          size="icon"
          aria-label="Widok plyt"
          onClick={() => setPrefs({ view: "discs" })}
        >
          <Disc3 />
        </Button>
      </div>
    </div>
  );
}