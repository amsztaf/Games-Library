import { create } from "zustand";
import { loadPersistedLibrary, savePersistedLibrary } from "./idb";
import { SAMPLE_GAMES } from "./sample";
import {
  type Game,
  type GameList,
  type Appearance,
  type Prefs,
  type LibraryFilters,
  type RandomFilters,
  type PersistedLibrary,
  type Status,
  type CustomAchievement,
  DEFAULT_APPEARANCE,
  DEFAULT_PREFS,
  DEFAULT_FILTERS,
  DEFAULT_RANDOM_FILTERS,
} from "./types";

let hydrateStarted = false;
let mutated = false;

export function emptyDraft() {
  return {
    title: "",
    year: null as number | null,
    rating: null as number | null,
    description: "",
    youtubeUrl: "",
    coverImage: null as string | null,
    discImage: null as string | null,
    achievementsUnlocked: 0,
    achievementsTotal: 0,
    favorite: false,
    status: "backlog" as Status,
    platform: "PC",
    hoursPlayed: 0,
  };
}

type Draft = ReturnType<typeof emptyDraft>;

type LibraryState = {
  games: Game[];
  lists: GameList[];
  appearance: Appearance;
  prefs: Prefs;
  seeded: boolean;
  hydrated: boolean;

  filters: LibraryFilters;
  randomFilters: RandomFilters;

  formOpen: boolean;
  editingId: string | null;
  randomOpen: boolean;
  settingsOpen: boolean;
  listsOpen: boolean;

  hydrate: () => Promise<void>;
  persist: () => Promise<void>;

  setGames: (games: Game[]) => void;
  addGame: (draft: Draft) => void;
  updateGame: (id: string, draft: Partial<Draft>) => void;
  removeGame: (id: string) => void;
  touchOpened: (id: string) => void;
  toggleFavorite: (id: string) => void;

  bumpAchievement: (id: string, delta: number) => void;
  setAchievements: (id: string, unlocked: number, total: number) => void;
  markPlatinum: (id: string) => void;

  addCustomAchievement: (gameId: string, achievement: Omit<CustomAchievement, "id">) => void;
  updateCustomAchievement: (
    gameId: string,
    achievementId: string,
    patch: Partial<CustomAchievement>,
  ) => void;
  removeCustomAchievement: (gameId: string, achievementId: string) => void;

  createList: (name: string) => string;
  renameList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  addGameToList: (listId: string, gameId: string) => void;
  removeGameFromList: (listId: string, gameId: string) => void;
  toggleGameInList: (listId: string, gameId: string) => void;

  replaceLibrary: (data: {
    games: Game[];
    appearance?: Appearance;
    prefs?: Prefs;
    seeded?: boolean;
    lists?: GameList[];
  }) => void;
  mergeLibrary: (games: Game[]) => void;
  restoreSamples: () => void;
  clearGames: () => void;

  setAppearance: (appearance: Partial<Appearance>) => void;
  setPrefs: (prefs: Partial<Prefs>) => void;
  setFilters: (filters: Partial<LibraryFilters>) => void;
  setRandomFilters: (filters: Partial<RandomFilters>) => void;

  openCreate: () => void;
  openEdit: (id: string) => void;
  closeForm: () => void;
  setRandomOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setListsOpen: (open: boolean) => void;
};

function createId(prefix = "game") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function ensureCustomAchievements(game: Game): Game {
  return {
    ...game,
    customAchievements: Array.isArray(game.customAchievements)
      ? game.customAchievements
      : [],
  };
}

export const useLibrary = create<LibraryState>((set, get) => ({
  games: [],
  lists: [],
  appearance: DEFAULT_APPEARANCE,
  prefs: DEFAULT_PREFS,
  seeded: false,
  hydrated: false,

  filters: { ...DEFAULT_FILTERS },
  randomFilters: { ...DEFAULT_RANDOM_FILTERS },

  formOpen: false,
  editingId: null,
  randomOpen: false,
  settingsOpen: false,
  listsOpen: false,

  hydrate: async () => {
    if (hydrateStarted) return;
    hydrateStarted = true;
    try {
      const saved = await loadPersistedLibrary();
      if (mutated) return;
      if (saved && Array.isArray(saved.games)) {
        set({
          games: saved.games.map(ensureCustomAchievements),
          lists: Array.isArray(saved.lists) ? saved.lists : [],
          appearance: { ...DEFAULT_APPEARANCE, ...saved.appearance },
          prefs: { ...DEFAULT_PREFS, ...saved.prefs },
          seeded: saved.seeded ?? true,
          hydrated: true,
        });
        return;
      }
      set({
        games: SAMPLE_GAMES.map(ensureCustomAchievements),
        lists: [],
        appearance: DEFAULT_APPEARANCE,
        prefs: DEFAULT_PREFS,
        seeded: true,
        hydrated: true,
      });
      get().persist();
    } catch {
      set({
        games: SAMPLE_GAMES.map(ensureCustomAchievements),
        lists: [],
        appearance: DEFAULT_APPEARANCE,
        prefs: DEFAULT_PREFS,
        seeded: true,
        hydrated: true,
      });
    }
  },

  persist: async () => {
    const state = get();
    const data: PersistedLibrary = {
      version: 1,
      games: state.games,
      appearance: state.appearance,
      prefs: state.prefs,
      seeded: state.seeded,
      lists: state.lists,
    };
    await savePersistedLibrary(data);
  },

  setGames: (games) => {
    mutated = true;
    set({ games: games.map(ensureCustomAchievements) });
    get().persist();
  },

  addGame: (draft) => {
    mutated = true;
    const now = Date.now();
    const game: Game = {
      id: createId(),
      title: draft.title.trim(),
      year: draft.year,
      rating: draft.rating,
      description: draft.description,
      youtubeUrl: draft.youtubeUrl,
      coverImage: draft.coverImage,
      discImage: draft.discImage,
      achievementsUnlocked: draft.achievementsUnlocked,
      achievementsTotal: draft.achievementsTotal,
      favorite: draft.favorite,
      status: draft.status,
      platform: draft.platform,
      hoursPlayed: draft.hoursPlayed,
      createdAt: now,
      updatedAt: now,
      lastOpenedAt: null,
      customAchievements: [],
    };
    set((state) => ({ games: [game, ...state.games] }));
    get().persist();
  },

  updateGame: (id, draft) => {
    mutated = true;
    set((state) => ({
      games: state.games.map((g) =>
        g.id === id
          ? {
              ...g,
              ...draft,
              title: draft.title !== undefined ? draft.title.trim() : g.title,
              updatedAt: Date.now(),
            }
          : g,
      ),
    }));
    get().persist();
  },

  removeGame: (id) => {
    mutated = true;
    set((state) => ({
      games: state.games.filter((g) => g.id !== id),
      lists: state.lists.map((list) => ({
        ...list,
        gameIds: list.gameIds.filter((gameId) => gameId !== id),
      })),
    }));
    get().persist();
  },

  touchOpened: (id) => {
    mutated = true;
    set((state) => ({
      games: state.games.map((g) =>
        g.id === id ? { ...g, lastOpenedAt: Date.now() } : g,
      ),
    }));
    get().persist();
  },

  toggleFavorite: (id) => {
    mutated = true;
    set((state) => ({
      games: state.games.map((g) =>
        g.id === id ? { ...g, favorite: !g.favorite, updatedAt: Date.now() } : g,
      ),
    }));
    get().persist();
  },

  bumpAchievement: (id, delta) => {
    mutated = true;
    set((state) => ({
      games: state.games.map((g) => {
        if (g.id !== id) return g;
        const total = Math.max(0, g.achievementsTotal);
        const unlocked = Math.min(total, Math.max(0, g.achievementsUnlocked + delta));
        return { ...g, achievementsUnlocked: unlocked, updatedAt: Date.now() };
      }),
    }));
    get().persist();
  },

  setAchievements: (id, unlocked, total) => {
    mutated = true;
    const safeTotal = Math.max(0, total);
    const safeUnlocked = Math.min(safeTotal, Math.max(0, unlocked));
    set((state) => ({
      games: state.games.map((g) =>
        g.id === id
          ? {
              ...g,
              achievementsUnlocked: safeUnlocked,
              achievementsTotal: safeTotal,
              updatedAt: Date.now(),
            }
          : g,
      ),
    }));
    get().persist();
  },

  markPlatinum: (id) => {
    mutated = true;
    set((state) => ({
      games: state.games.map((g) => {
        if (g.id !== id) return g;
        const total = Math.max(g.achievementsTotal, 1);
        return {
          ...g,
          achievementsUnlocked: total,
          achievementsTotal: total,
          updatedAt: Date.now(),
        };
      }),
    }));
    get().persist();
  },

  addCustomAchievement: (gameId, achievement) => {
    mutated = true;
    const newAchievement: CustomAchievement = {
      id: createId("ach"),
      title: achievement.title.trim(),
      description: achievement.description.trim(),
      image: achievement.image,
    };
    set((state) => ({
      games: state.games.map((g) =>
        g.id === gameId
          ? {
              ...g,
              customAchievements: [...(g.customAchievements ?? []), newAchievement],
              updatedAt: Date.now(),
            }
          : g,
      ),
    }));
    get().persist();
  },

  updateCustomAchievement: (gameId, achievementId, patch) => {
    mutated = true;
    set((state) => ({
      games: state.games.map((g) =>
        g.id === gameId
          ? {
              ...g,
              customAchievements: (g.customAchievements ?? []).map((a) =>
                a.id === achievementId ? { ...a, ...patch } : a,
              ),
              updatedAt: Date.now(),
            }
          : g,
      ),
    }));
    get().persist();
  },

  removeCustomAchievement: (gameId, achievementId) => {
    mutated = true;
    set((state) => ({
      games: state.games.map((g) =>
        g.id === gameId
          ? {
              ...g,
              customAchievements: (g.customAchievements ?? []).filter(
                (a) => a.id !== achievementId,
              ),
              updatedAt: Date.now(),
            }
          : g,
      ),
    }));
    get().persist();
  },

  createList: (name) => {
    mutated = true;
    const id = createId("list");
    const list: GameList = {
      id,
      name: name.trim() || "Nowa lista",
      gameIds: [],
      createdAt: Date.now(),
    };
    set((state) => ({ lists: [...state.lists, list] }));
    get().persist();
    return id;
  },

  renameList: (id, name) => {
    mutated = true;
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === id ? { ...list, name: name.trim() || list.name } : list,
      ),
    }));
    get().persist();
  },

  deleteList: (id) => {
    mutated = true;
    set((state) => ({
      lists: state.lists.filter((list) => list.id !== id),
    }));
    get().persist();
  },

  addGameToList: (listId, gameId) => {
    mutated = true;
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId && !list.gameIds.includes(gameId)
          ? { ...list, gameIds: [...list.gameIds, gameId] }
          : list,
      ),
    }));
    get().persist();
  },

  removeGameFromList: (listId, gameId) => {
    mutated = true;
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId
          ? { ...list, gameIds: list.gameIds.filter((id) => id !== gameId) }
          : list,
      ),
    }));
    get().persist();
  },

  toggleGameInList: (listId, gameId) => {
    const list = get().lists.find((item) => item.id === listId);
    if (!list) return;
    if (list.gameIds.includes(gameId)) {
      get().removeGameFromList(listId, gameId);
    } else {
      get().addGameToList(listId, gameId);
    }
  },

  replaceLibrary: (data) => {
    mutated = true;
    set({
      games: data.games.map(ensureCustomAchievements),
      lists: Array.isArray(data.lists) ? data.lists : [],
      appearance: { ...DEFAULT_APPEARANCE, ...(data.appearance ?? {}) },
      prefs: { ...DEFAULT_PREFS, ...(data.prefs ?? {}) },
      seeded: data.seeded ?? true,
      hydrated: true,
    });
    get().persist();
  },

  mergeLibrary: (incoming) => {
    mutated = true;
    set((state) => {
      const existingIds = new Set(state.games.map((g) => g.id));
      const toAdd = incoming
        .map(ensureCustomAchievements)
        .filter((g) => !existingIds.has(g.id));
      return {
        games: [...toAdd, ...state.games],
        seeded: true,
        hydrated: true,
      };
    });
    get().persist();
  },

  restoreSamples: () => {
    mutated = true;
    set((state) => {
      const existingIds = new Set(state.games.map((g) => g.id));
      const toAdd = SAMPLE_GAMES.map(ensureCustomAchievements).filter(
        (g) => !existingIds.has(g.id),
      );
      return {
        games: [...toAdd, ...state.games],
        seeded: true,
      };
    });
    get().persist();
  },

  clearGames: () => {
    mutated = true;
    set({
      games: [],
      lists: [],
      seeded: true,
    });
    get().persist();
  },

  setAppearance: (appearance) => {
    mutated = true;
    set((state) => ({
      appearance: { ...state.appearance, ...appearance },
    }));
    get().persist();
  },

  setPrefs: (prefs) => {
    mutated = true;
    set((state) => ({
      prefs: { ...state.prefs, ...prefs },
    }));
    get().persist();
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  setRandomFilters: (filters) => {
    set((state) => ({
      randomFilters: { ...state.randomFilters, ...filters },
    }));
  },

  openCreate: () => set({ formOpen: true, editingId: null }),
  openEdit: (id) => set({ formOpen: true, editingId: id }),
  closeForm: () => set({ formOpen: false, editingId: null }),
  setRandomOpen: (open) => set({ randomOpen: open }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
  setListsOpen: (open) => set({ listsOpen: open }),
}));