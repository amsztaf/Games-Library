import { hashString } from "@/lib/utils";

export type PosterPalette = {
  bg: string;
  fg: string;
  accent: string;
  band: string;
};

// Kolory według rodziny platform
const PLATFORM_PALETTES: Record<string, PosterPalette> = {
  // PlayStation – niebieski
  playstation: { bg: "#0b1a2e", fg: "#e8f0ff", accent: "#3a7bd5", band: "#163a5f" },
  // Xbox – zielony
  xbox: { bg: "#0d1f12", fg: "#e6f5ea", accent: "#3eb34f", band: "#1a3d24" },
  // Switch – czerwony
  switch: { bg: "#2a0f12", fg: "#ffe8ea", accent: "#e60012", band: "#4a1a1f" },
  // Wii / Wii U – jasny niebieski
  wii: { bg: "#0f1e2a", fg: "#e8f4ff", accent: "#6bb3e0", band: "#1c3a4f" },
  // Klasyczne Nintendo (NES, SNES, N64, GameCube, handheldy)
  nintendo: { bg: "#1a1210", fg: "#f0e6e0", accent: "#c23b22", band: "#3a2420" },
  // Steam / PC
  pc: { bg: "#12141a", fg: "#e6eaf0", accent: "#1b9de0", band: "#1e2430" },
  // Sega
  sega: { bg: "#1a1408", fg: "#fff3d6", accent: "#f0a030", band: "#3a2c12" },
};

// Fallback (gdy nie rozpoznamy platformy)
const FALLBACK_PALETTES: PosterPalette[] = [
  { bg: "#1b1713", fg: "#efe6d8", accent: "#8fa38a", band: "#3a332b" },
  { bg: "#12161b", fg: "#e4e8ee", accent: "#7d93a6", band: "#242c34" },
  { bg: "#1a1210", fg: "#eadfd4", accent: "#b07a64", band: "#32241f" },
  { bg: "#101412", fg: "#dce6df", accent: "#7d9a8c", band: "#1d2622" },
];

function detectFamily(platform: string): string {
  const p = platform.toLowerCase();

  if (
    p.includes("playstation") ||
    p.startsWith("ps") ||
    p === "psp" ||
    p.includes("vita")
  ) {
    return "playstation";
  }
  if (p.includes("xbox")) return "xbox";
  if (p.includes("switch")) return "switch";
  if (p.includes("wii")) return "wii";
  if (
    p.includes("nintendo") ||
    p === "nes" ||
    p === "snes" ||
    p.includes("game boy") ||
    p.includes("gamecube") ||
    p.includes("64") ||
    p.includes("ds") ||
    p.includes("3ds")
  ) {
    return "nintendo";
  }
  if (p === "pc" || p === "steam") return "pc";
  if (p.includes("sega") || p.includes("dreamcast") || p.includes("mega drive")) {
    return "sega";
  }
  return "fallback";
}

export function posterPalette(seed: string, platform?: string): PosterPalette {
  if (platform) {
    const family = detectFamily(platform);
    if (family !== "fallback" && PLATFORM_PALETTES[family]) {
      return PLATFORM_PALETTES[family];
    }
  }
  // fallback do starego zachowania (losowy na podstawie seed)
  return FALLBACK_PALETTES[hashString(seed) % FALLBACK_PALETTES.length] ?? FALLBACK_PALETTES[0]!;
}

export function wrapTitle(title: string, max = 14): string[] {
  const words = title.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 4);
}

export type Motif = "circle" | "slash" | "bars" | "plus" | "arc";

export function posterMotif(seed: string): Motif {
  const motifs: Motif[] = ["circle", "slash", "bars", "plus", "arc"];
  return motifs[hashString(`${seed}-motif`) % motifs.length] ?? "circle";
}