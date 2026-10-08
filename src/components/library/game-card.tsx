import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { CoverArt, DiscArt } from "@/components/library/cover-art";
import { Progress } from "@/components/ui/progress";
import { achievementRatio, isPlatinum } from "@/lib/library/helpers";
import { useLibrary } from "@/lib/library/store";
import type { Game, ViewMode } from "@/lib/library/types";
import { cn } from "@/lib/utils";

export function GameCard({ game, view }: { game: Game; view: ViewMode }) {
  const toggleFavorite = useLibrary((s) => s.toggleFavorite);
  const ratio = achievementRatio(game);
  const platinum = isPlatinum(game);

  return (
    <article className="group relative">
      <Link
        to="/gra/$id"
        params={{ id: game.id }}
        className="block rounded-xl p-1.5 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div className="overflow-hidden rounded-lg bg-card shadow-[var(--shadow-border)]">
          {view === "discs" ? (
            <div className="flex items-center justify-center bg-surface p-5">
              <DiscArt game={game} className="w-full max-w-[220px]" />
            </div>
          ) : (
            <CoverArt game={game} />
          )}
        </div>
        <div className="mt-3 space-y-1.5 px-1">
          <h2 className="line-clamp-2 font-display text-[15px] leading-snug font-medium tracking-tight text-fg">
            {game.title}
          </h2>
          <p className="flex items-center gap-2 text-xs text-muted tabular-nums">
            <span>{game.year ?? "—"}</span>
            <span className="text-subtle">·</span>
            <span>{game.rating != null ? game.rating.toFixed(1) : "brak oceny"}</span>
          </p>
          {game.achievementsTotal > 0 ? (
            <div className="pt-1">
              <Progress value={ratio * 100} />
              <p className="mt-1 text-[11px] text-subtle tabular-nums">
                {game.achievementsUnlocked}/{game.achievementsTotal}
                {platinum ? " · 100%" : ""}
              </p>
            </div>
          ) : null}
        </div>
      </Link>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleFavorite(game.id);
        }}
        className={cn(
          "absolute top-2.5 left-2.5 z-10 inline-flex size-8 items-center justify-center rounded-full bg-bg/70 text-fg/80 backdrop-blur-sm transition-colors after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2",
          game.favorite ? "text-primary" : "hover:text-fg",
        )}
        aria-label={game.favorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      >
        <Heart className={cn("size-4", game.favorite && "fill-primary text-primary")} />
      </button>
    </article>
  );
}
