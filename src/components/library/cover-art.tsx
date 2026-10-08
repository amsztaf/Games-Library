import { Crown, Star } from "lucide-react";
import { posterMotif, posterPalette, wrapTitle } from "@/lib/library/poster";
import type { Game } from "@/lib/library/types";
import { isPlatinum } from "@/lib/library/helpers";
import { cn } from "@/lib/utils";

/** Platformy z bardziej kwadratowym pudelkiem */
const SQUARE_PLATFORMS = new Set([
  "PS1",
  "Nintendo DS",
  "Nintendo 3DS",
]);

function isSquareBox(platform: string): boolean {
  return SQUARE_PLATFORMS.has(platform);
}

function MotifShapes({ seed, platform }: { seed: string; platform?: string }) {
  const palette = posterPalette(seed, platform);
  const motif = posterMotif(seed);
  switch (motif) {
    case "slash":
      return (
        <rect
          x="420"
          y="-80"
          width="70"
          height="980"
          transform="rotate(18 455 400)"
          fill={palette.band}
        />
      );
    case "bars":
      return (
        <g fill={palette.band}>
          <rect x="430" y="48" width="18" height="220" />
          <rect x="462" y="88" width="18" height="180" />
          <rect x="494" y="128" width="18" height="140" />
        </g>
      );
    case "plus":
      return (
        <g fill="none" stroke={palette.accent} strokeWidth="2" opacity="0.55">
          <line x1="430" y1="90" x2="560" y2="90" />
          <line x1="495" y1="25" x2="495" y2="155" />
        </g>
      );
    case "arc":
      return (
        <path
          d="M 80 80 Q 300 40 520 160"
          fill="none"
          stroke={palette.accent}
          strokeWidth="2"
          opacity="0.45"
        />
      );
    default:
      return (
        <circle
          cx="500"
          cy="120"
          r="88"
          fill="none"
          stroke={palette.fg}
          strokeWidth="1.5"
          opacity="0.28"
        />
      );
  }
}

export function TypographicPoster({
  title,
  year,
  seed,
  platform,
  className,
  square = false,
}: {
  title: string;
  year?: number | null;
  seed: string;
  platform?: string;
  className?: string;
  square?: boolean;
}) {
  const palette = posterPalette(seed, platform);
  const lines = wrapTitle(title.toLocaleUpperCase("pl"));
  const fontSize = lines.some((line) => line.length > 12) ? 46 : 56;
  const viewBox = square ? "0 0 600 600" : "0 0 600 800";
  const titleBaseY = square ? 460 : 620;
  const yearY = square ? 540 : 720;

  return (
    <svg
      viewBox={viewBox}
      className={cn("size-full", className)}
      role="img"
      aria-label={title}
    >
      <rect width="600" height={square ? 600 : 800} fill={palette.bg} />
      <rect width="600" height="10" fill={palette.accent} />
      <MotifShapes seed={seed} platform={platform} />
      <rect
        x="40"
        y="40"
        width="520"
        height={square ? 520 : 720}
        fill="none"
        stroke={palette.fg}
        strokeOpacity="0.12"
      />
      <text
        x="48"
        y={yearY}
        fill={palette.accent}
        fontSize="18"
        fontFamily="Figtree, ui-sans-serif, sans-serif"
        letterSpacing="0.18em"
      >
        {year ?? "POLKA"}
      </text>
      {lines.map((line, index) => (
        <text
          key={line + index}
          x="48"
          y={titleBaseY - (lines.length - 1 - index) * (fontSize + 6)}
          fill={palette.fg}
          fontSize={fontSize}
          fontFamily="Fraunces, Georgia, serif"
          fontWeight="500"
        >
          {line}
        </text>
      ))}
    </svg>
  );
}

function StatusBadge({ game }: { game: Game }) {
  const platinum = isPlatinum(game);

  if (platinum) {
    return (
      <span
        className="absolute top-2 right-2 z-10 inline-flex size-8 items-center justify-center rounded-full bg-bg/80 text-fg shadow-[var(--shadow-border)]"
        title="100% osiagniec"
        aria-label="100% osiagniec"
      >
        <Crown className="size-4 fill-fg text-fg" />
      </span>
    );
  }

  if (game.status === "done") {
    return (
      <span
        className="absolute top-2 right-2 z-10 inline-flex size-8 items-center justify-center rounded-full bg-bg/80 text-fg shadow-[var(--shadow-border)]"
        title="Ukonczona"
        aria-label="Ukonczona"
      >
        <Star className="size-4 fill-fg text-fg" />
      </span>
    );
  }

  return null;
}

export function CoverArt({
  game,
  className,
  showCrown = true,
}: {
  game: Game;
  className?: string;
  showCrown?: boolean;
}) {
  const square = isSquareBox(game.platform);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-card",
        square ? "aspect-square" : "aspect-[3/4]",
        className,
      )}
    >
      {game.coverImage ? (
        <img
          src={game.coverImage}
          alt=""
          className="size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
        />
      ) : (
        <TypographicPoster
          title={game.title}
          year={game.year}
          seed={game.id}
          platform={game.platform}
          square={square}
        />
      )}
      {showCrown ? <StatusBadge game={game} /> : null}
    </div>
  );
}

export function DiscArt({ game, className }: { game: Game; className?: string }) {
  const palette = posterPalette(game.id, game.platform);
  return (
    <div className={cn("relative aspect-square", className)}>
      {game.discImage ? (
        <img
          src={game.discImage}
          alt={"Plyta: " + game.title}
          className="size-full rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/15"
        />
      ) : (
        <svg viewBox="0 0 400 400" className="size-full" role="img" aria-label={"Plyta " + game.title}>
          <defs>
            <radialGradient id={"disc-" + game.id} cx="38%" cy="32%">
              <stop offset="0%" stopColor="#d8d4cc" />
              <stop offset="42%" stopColor="#8a8680" />
              <stop offset="100%" stopColor="#2a2927" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="196" fill={"url(#disc-" + game.id + ")"} />
          <circle cx="200" cy="200" r="188" fill="none" stroke={palette.fg} strokeOpacity="0.2" />
          <circle cx="200" cy="200" r="118" fill={palette.bg} />
          <circle cx="200" cy="200" r="118" fill="none" stroke={palette.accent} strokeOpacity="0.7" />
          <circle cx="200" cy="200" r="22" fill="#1a1917" />
          <circle cx="200" cy="200" r="10" fill="#0c0c0e" />
          <text
            x="200"
            y="196"
            textAnchor="middle"
            fill={palette.fg}
            fontSize="13"
            fontFamily="Figtree, ui-sans-serif, sans-serif"
            letterSpacing="0.12em"
          >
            {game.year ?? ""}
          </text>
          <text
            x="200"
            y="218"
            textAnchor="middle"
            fill={palette.accent}
            fontSize="11"
            fontFamily="Fraunces, Georgia, serif"
          >
            {game.title.length > 22 ? game.title.slice(0, 20) + "..." : game.title}
          </text>
        </svg>
      )}
      <StatusBadge game={game} />
    </div>
  );
}