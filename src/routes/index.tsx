import { createFileRoute } from "@tanstack/react-router";
import { GameCard } from "@/components/library/game-card";
import { AppShell, FilterBar } from "@/components/library/shell";
import { Button } from "@/components/ui/button";
import { applyLibraryFilters, sortGames } from "@/lib/library/helpers";
import { useLibrary } from "@/lib/library/store";
import type { Game } from "@/lib/library/types";

export const Route = createFileRoute("/")({ component: Home });

/** Mapuje platformę gry na nazwę kategorii */
function getPlatformCategory(platform: string): string {
  const p = platform.trim();

  // Grupy specjalne
  if (p === "Switch" || p === "Switch 2") return "Nintendo Switch";
  if (p === "Wii" || p === "Wii U") return "Wii / Wii U";

  // Reszta 1:1
  return p || "Inne";
}

/** Kolejność wyświetlania kategorii */
const CATEGORY_ORDER = [
  "PC",
  "Steam",
  "PlayStation",
  "PS1",
  "PS2",
  "PS3",
  "PS4",
  "PS5",
  "PSP",
  "PS Vita",
  "Xbox",
  "Xbox Classic",
  "Xbox 360",
  "Xbox One",
  "Xbox Series",
  "NES",
  "SNES",
  "Nintendo 64",
  "GameCube",
  "Wii / Wii U",
  "Nintendo Switch",
  "Game Boy",
  "Game Boy Color",
  "Game Boy Advance",
  "Nintendo DS",
  "Nintendo 3DS",
  "Sega Mega Drive",
  "Dreamcast",
];

function groupByCategory(games: Game[]): { category: string; games: Game[] }[] {
  const map = new Map<string, Game[]>();

  for (const game of games) {
    const cat = getPlatformCategory(game.platform);
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(game);
  }

  // Sortuj kategorie według ustalonej kolejności
  const sorted = [...map.entries()].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a[0]);
    const bi = CATEGORY_ORDER.indexOf(b[0]);
    const aOrder = ai === -1 ? 999 : ai;
    const bOrder = bi === -1 ? 999 : bi;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a[0].localeCompare(b[0], "pl");
  });

  return sorted.map(([category, games]) => ({ category, games }));
}

function Home() {
  const games = useLibrary((s) => s.games);
  const filters = useLibrary((s) => s.filters);
  const prefs = useLibrary((s) => s.prefs);
  const openCreate = useLibrary((s) => s.openCreate);

  const visible = sortGames(applyLibraryFilters(games, filters), prefs.sort);
  const groups = groupByCategory(visible);

  return (
    <AppShell>
      <FilterBar />

      {visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-20 text-center">
          <p className="font-display text-2xl">Półka jest pusta</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            {games.length === 0
              ? "Dodaj pierwszą grę albo wczytaj przykładową kolekcję."
              : "Żadna gra nie pasuje do wyszukiwania i filtrów."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button type="button" onClick={openCreate}>
              Dodaj grę
            </Button>
            {games.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  useLibrary.getState().setFilters({
                    query: "",
                    favoritesOnly: false,
                    completeOnly: false,
                    incompleteOnly: false,
                    status: "all",
                  })
                }
              >
                Wyczyść filtry
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {groups.map(({ category, games: categoryGames }) => (
            <section key={category}>
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="font-display text-xl tracking-tight sm:text-2xl">
                  {category}
                </h2>
                <span className="text-sm text-muted tabular-nums">
                  {categoryGames.length}{" "}
                  {categoryGames.length === 1
                    ? "gra"
                    : categoryGames.length >= 2 && categoryGames.length <= 4
                      ? "gry"
                      : "gier"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {categoryGames.map((game) => (
                  <GameCard key={game.id} game={game} view={prefs.view} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </AppShell>
  );
}