import { z } from "zod";
import {
  DEFAULT_APPEARANCE,
  DEFAULT_PREFS,
  STATUSES,
  type Appearance,
  type Game,
  type PersistedLibrary,
  type Prefs,
  type Status,
} from "./types";

const StatusSchema = z.enum(STATUSES);

const GameSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  year: z.number().int().min(1970).max(2100).nullable().optional(),
  rating: z.number().min(0).max(10).nullable().optional(),
  description: z.string().optional(),
  youtubeUrl: z.string().optional(),
  coverImage: z.string().nullable().optional(),
  discImage: z.string().nullable().optional(),
  achievementsUnlocked: z.number().min(0).optional(),
  achievementsTotal: z.number().min(0).optional(),
  favorite: z.boolean().optional(),
  status: StatusSchema.optional(),
  platform: z.string().optional(),
  hoursPlayed: z.number().min(0).optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  lastOpenedAt: z.number().nullable().optional(),
});

const AppearanceSchema = z.object({
  accent: z.string().optional(),
  backgroundImage: z.string().nullable().optional(),
  backgroundDim: z.number().min(0).max(1).optional(),
});

const PrefsSchema = z.object({
  sort: z.enum(["added", "title", "year", "rating", "played"]).optional(),
  view: z.enum(["covers", "discs"]).optional(),
});

const FileSchema = z.object({
  version: z.literal(1).optional(),
  games: z.array(GameSchema),
  appearance: AppearanceSchema.optional(),
  prefs: PrefsSchema.optional(),
  seeded: z.boolean().optional(),
});

function asStatus(value: Status | undefined): Status {
  return value ?? "backlog";
}

function normalizeGame(raw: z.infer<typeof GameSchema>, index: number): Game {
  const now = Date.now() + index;
  return {
    id: raw.id,
    title: raw.title.trim(),
    year: raw.year ?? null,
    rating: raw.rating ?? null,
    description: raw.description ?? "",
    youtubeUrl: raw.youtubeUrl ?? "",
    coverImage: raw.coverImage ?? null,
    discImage: raw.discImage ?? null,
    achievementsUnlocked: Math.max(0, Math.floor(raw.achievementsUnlocked ?? 0)),
    achievementsTotal: Math.max(0, Math.floor(raw.achievementsTotal ?? 0)),
    favorite: raw.favorite ?? false,
    status: asStatus(raw.status),
    platform: raw.platform?.trim() || "PC",
    hoursPlayed: Math.max(0, raw.hoursPlayed ?? 0),
    createdAt: raw.createdAt ?? now,
    updatedAt: raw.updatedAt ?? now,
    lastOpenedAt: raw.lastOpenedAt ?? null,
  };
}

export function parseLibraryFile(json: unknown): {
  games: Game[];
  appearance: Appearance;
  prefs: Prefs;
} {
  const parsed = FileSchema.parse(json);
  const games = parsed.games.map((game, index) => normalizeGame(game, index));
  const appearance: Appearance = {
    accent: parsed.appearance?.accent ?? DEFAULT_APPEARANCE.accent,
    backgroundImage:
      parsed.appearance?.backgroundImage === undefined
        ? DEFAULT_APPEARANCE.backgroundImage
        : parsed.appearance.backgroundImage,
    backgroundDim: parsed.appearance?.backgroundDim ?? DEFAULT_APPEARANCE.backgroundDim,
  };
  const prefs: Prefs = {
    sort: parsed.prefs?.sort ?? DEFAULT_PREFS.sort,
    view: parsed.prefs?.view ?? DEFAULT_PREFS.view,
  };
  return { games, appearance, prefs };
}

export function serializeLibrary(data: PersistedLibrary): string {
  return JSON.stringify(
    {
      version: 1 as const,
      exportedAt: new Date().toISOString(),
      games: data.games,
      appearance: data.appearance,
      prefs: data.prefs,
      seeded: data.seeded,
    },
    null,
    2,
  );
}
