export type CustomAchievement = {
  id: string;
  title: string;
  description: string;
  image: string | null;
};

export type GameList = {
  id: string;
  name: string;
  gameIds: string[];
  createdAt: number;
};

export const PLATFORMS = [
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
  "Wii",
  "Wii U",
  "Switch",
  "Switch 2",
  "Game Boy",
  "Game Boy Color",
  "Game Boy Advance",
  "Nintendo DS",
  "Nintendo 3DS",
  "Sega Mega Drive",
  "Dreamcast",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const STATUSES = [
  "backlog",
  "playing",
  "on-hold",
  "abandoned",
  "done",
] as const;

export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  backlog: "Do zagrania",
  playing: "W trakcie",
  "on-hold": "Wstrzymana",
  abandoned: "Porzucona",
  done: "Ukończona",
};

export type Game = {
  id: string;
  title: string;
  year: number | null;
  rating: number | null;
  description: string;
  youtubeUrl: string;
  coverImage: string | null;
  discImage: string | null;
  achievementsUnlocked: number;
  achievementsTotal: number;
  favorite: boolean;
  status: Status;
  platform: string;
  hoursPlayed: number;
  createdAt: number;
  updatedAt: number;
  lastOpenedAt: number | null;
  customAchievements: CustomAchievement[];
};

export type Appearance = {
  accent: string;
  backgroundImage: string | null;
  backgroundDim: number;
};

export type SortKey = "added" | "title" | "year" | "rating" | "played";
export type ViewMode = "covers" | "discs";

export type Prefs = {
  sort: SortKey;
  view: ViewMode;
};

export type LibraryFilters = {
  query: string;
  favoritesOnly: boolean;
  completeOnly: boolean;
  incompleteOnly: boolean;
  status: Status | "all";
};

export type RandomFilters = {
  favoritesOnly: boolean;
  hideComplete: boolean;
  completeOnly: boolean;
  status: Status | "all";
  minRating: number | null;
  yearFrom: number | null;
  yearTo: number | null;
  platform: string | null;
  listId: string | null;
};

export type PersistedLibrary = {
  version: 1;
  games: Game[];
  appearance: Appearance;
  prefs: Prefs;
  seeded: boolean;
  lists: GameList[];
};

export const DEFAULT_APPEARANCE: Appearance = {
  accent: "#7d9a9a",
  backgroundImage: null,
  backgroundDim: 0.78,
};

export const DEFAULT_PREFS: Prefs = {
  sort: "added",
  view: "covers",
};

export const DEFAULT_FILTERS: LibraryFilters = {
  query: "",
  favoritesOnly: false,
  completeOnly: false,
  incompleteOnly: false,
  status: "all",
};

export const DEFAULT_RANDOM_FILTERS: RandomFilters = {
  favoritesOnly: false,
  hideComplete: false,
  completeOnly: false,
  status: "all",
  minRating: null,
  yearFrom: null,
  yearTo: null,
  platform: null,
  listId: null,
};

export const ACCENT_PRESETS = [
  "#7d9a9a",
  "#8aa0b4",
  "#b07864",
  "#a8b8b0",
  "#c4b49a",
  "#a86860",
  "#6e7f8a",
  "#8a7a6a",
] as const;