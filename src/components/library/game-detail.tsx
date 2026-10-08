import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Heart, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AchievementControl } from "@/components/library/achievements";
import { CoverArt, DiscArt } from "@/components/library/cover-art";
import { AppShell } from "@/components/library/shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_LABEL } from "@/lib/library/types";
import { parseYouTubeId, youtubeEmbedUrl } from "@/lib/library/youtube";
import { useLibrary } from "@/lib/library/store";
import { cn, formatHours } from "@/lib/utils";

export function GameDetail({ id }: { id: string }) {
  const game = useLibrary((s) => s.games.find((item) => item.id === id));
  const touchOpened = useLibrary((s) => s.touchOpened);
  const toggleFavorite = useLibrary((s) => s.toggleFavorite);
  const openEdit = useLibrary((s) => s.openEdit);
  const removeGame = useLibrary((s) => s.removeGame);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (game) touchOpened(game.id);
  }, [game?.id, touchOpened]);

  if (!game) {
    return (
      <AppShell>
        <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-2xl">Nie ma tej gry na polce</p>
          <Button asChild className="mt-4">
            <Link to="/">Wroc do biblioteki</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const videoId = parseYouTubeId(game.youtubeUrl);

  return (
    <AppShell>
      <div className="mb-6 flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" aria-label="Wroc">
          <Link to="/">
            <ArrowLeft />
          </Link>
        </Button>
        <p className="text-sm text-muted">Biblioteka</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl shadow-[var(--shadow-border)]">
            <CoverArt game={game} />
          </div>
          <div className="mx-auto w-full max-w-[220px]">
            <DiscArt game={game} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                {game.title}
              </h1>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => toggleFavorite(game.id)}
                  aria-label="Ulubiona"
                >
                  <Heart className={cn("size-4", game.favorite && "fill-primary text-primary")} />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => openEdit(game.id)}
                >
                  <Pencil />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setConfirmDelete(true)}
                  aria-label="Usun"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {game.year ? <Badge>{game.year}</Badge> : null}
              <Badge>{game.platform}</Badge>
              <Badge>{STATUS_LABEL[game.status]}</Badge>
              {game.rating != null ? (
                <Badge className="tabular-nums">Ocena {game.rating.toFixed(1)}</Badge>
              ) : null}
              <Badge>{formatHours(game.hoursPlayed)}</Badge>
            </div>
          </div>

          <AchievementControl game={game} />

          {game.description ? (
            <section>
              <h2 className="mb-2 font-display text-lg">Opis</h2>
              <p className="max-w-prose text-sm leading-relaxed text-muted">
                {game.description}
              </p>
            </section>
          ) : null}

          {videoId ? (
            <section>
              <h2 className="mb-3 font-display text-lg">YouTube</h2>
              <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
                <iframe
                  title={"Trailer: " + game.title}
                  src={youtubeEmbedUrl(videoId)}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          ) : game.youtubeUrl ? (
            <a
              href={game.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Otworz link
            </a>
          ) : null}
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{"Usunac " + game.title + "?"}</AlertDialogTitle>
            <AlertDialogDescription>
              Zniknie z polki. Mozesz pozniej wczytac kopie, jesli zrobiles eksport.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={() => {
                removeGame(game.id);
                toast.success("Usunieto z polki.");
                void navigate({ to: "/" });
              }}
            >
              Usun
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}