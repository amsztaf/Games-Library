import type { Game, GameList, LibraryFilters, RandomFilters, SortKey } from "./types";

export function isPlatinum(game: Game): boolean {
  return game.achievementsTotal > 0 && game.achievementsUnlocked >= game.achievementsTotal;
}

export function achievementRatio(game: Game): number {
  if (game.achievementsTotal <= 0) return 0;
  return Math.min(1, game.achievementsUnlocked / game.achievementsTotal);
}

export function clampAchievements(
  unlocked: number,
  total: number,
): { unlocked: number; total: number } {
  const safeTotal = Math.max(0, Math.floor(total));
  const safeUnlocked = Math.max(0, Math.floor(unlocked));
  if (safeTotal === 0) return { unlocked: safeUnlocked, total: 0 };
  return { unlocked: Math.min(safeUnlocked, safeTotal), total: safeTotal };
}

function matchesQuery(game: Game, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [game.title, game.description, game.platform, game.year ? String(game.year) : ""]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function applyLibraryFilters(games: Game[], filters: LibraryFilters): Game[] {
  return games.filter((game) => {
    if (!matchesQuery(game, filters.query)) return false;
    if (filters.favoritesOnly && !game.favorite) return false;
    if (filters.completeOnly && !isPlatinum(game)) return false;
    if (filters.incompleteOnly && isPlatinum(game)) return false;
    if (filters.status !== "all" && game.status !== filters.status) return false;
    return true;
  });
}

export function sortGames(games: Game[], sort: SortKey): Game[] {
  const list = [...games];
  switch (sort) {
    case "title":
      list.sort((a, b) => a.title.localeCompare(b.title, "pl"));
      break;
    case "year":
      list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      break;
    case "rating":
      list.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
      break;
    case "played":
      list.sort((a, b) => (b.lastOpenedAt ?? 0) - (a.lastOpenedAt ?? 0));
      break;
    default:
      list.sort((a, b) => b.createdAt - a.createdAt);
  }
  return list;
}

export function applyRandomFilters(
  games: Game[],
  filters: RandomFilters,
  lists: GameList[] = [],
): Game[] {
  const list = filters.listId
    ? lists.find((item) => item.id === filters.listId) ?? null
    : null;
  const allowedIds = list ? new Set(list.gameIds) : null;

  return games.filter((game) => {
    if (allowedIds && !allowedIds.has(game.id)) return false;
    if (filters.favoritesOnly && !game.favorite) return false;
    if (filters.hideComplete && isPlatinum(game)) return false;
    if (filters.completeOnly && !isPlatinum(game)) return false;
    if (filters.status !== "all" && game.status !== filters.status) return false;
    if (filters.minRating != null && (game.rating ?? 0) < filters.minRating) return false;
    if (filters.yearFrom != null && (game.year ?? 0) < filters.yearFrom) return false;
    if (filters.yearTo != null && (game.year ?? 9999) > filters.yearTo) return false;
    if (filters.platform && game.platform !== filters.platform) return false;
    return true;
  });
}

export function pickRandom<T>(items: T[], exclude?: T | null): T | null {
  if (items.length === 0) return null;
  if (items.length === 1) return items[0] ?? null;
  const pool = exclude ? items.filter((item) => item !== exclude) : items;
  const source = pool.length > 0 ? pool : items;
  const index = Math.floor(Math.random() * source.length);
  return source[index] ?? null;
}

export function libraryStats(games: Game[]) {
  const favorites = games.filter((g) => g.favorite).length;
  const crowns = games.filter(isPlatinum).length;
  const rated = games.filter((g) => g.rating != null);
  const avgRating =
    rated.length > 0
      ? rated.reduce((sum, g) => sum + (g.rating ?? 0), 0) / rated.length
      : null;
  const hours = games.reduce((sum, g) => sum + g.hoursPlayed, 0);
  const playing = games.filter((g) => g.status === "playing").length;
  return { total: games.length, favorites, crowns, avgRating, hours, playing };
}