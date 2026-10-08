import { useMemo, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CoverArt } from "@/components/library/cover-art";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLibrary } from "@/lib/library/store";
import { cn } from "@/lib/utils";

export function ListsDialog() {
  const open = useLibrary((s) => s.listsOpen);
  const setOpen = useLibrary((s) => s.setListsOpen);
  const games = useLibrary((s) => s.games);
  const lists = useLibrary((s) => s.lists);
  const createList = useLibrary((s) => s.createList);
  const deleteList = useLibrary((s) => s.deleteList);
  const toggleGameInList = useLibrary((s) => s.toggleGameInList);

  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");

  const selectedList = useMemo(
    () => lists.find((list) => list.id === selectedListId) ?? null,
    [lists, selectedListId],
  );

  const selectedIds = useMemo(
    () => new Set(selectedList?.gameIds ?? []),
    [selectedList],
  );

  function handleCreateList() {
    const name = newListName.trim();
    if (!name) {
      toast.error("Podaj nazwe listy.");
      return;
    }
    const id = createList(name);
    setNewListName("");
    setSelectedListId(id);
    toast.success("Utworzono liste.");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setNewListName("");
      }}
    >
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Listy</DialogTitle>
          <DialogDescription>
            Po lewej wybierz liste, po prawej klikaj okladki aby dodawac lub usuwac gry.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="grid min-h-[420px] gap-4 md:grid-cols-[240px_minmax(0,1fr)]">
            {/* LEWA KOLUMNA - LISTY */}
            <aside className="flex flex-col rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
              <p className="mb-2 px-1 text-xs font-medium tracking-wide text-muted uppercase">
                Twoje listy
              </p>

              <div className="mb-3 flex gap-2">
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Nowa lista..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateList();
                  }}
                />
                <Button type="button" size="icon" variant="secondary" onClick={handleCreateList}>
                  <Plus />
                </Button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto">
                {lists.length === 0 ? (
                  <p className="px-1 py-4 text-sm text-muted">Brak list. Utworz pierwsza.</p>
                ) : (
                  lists.map((list) => {
                    const active = list.id === selectedListId;
                    return (
                      <div
                        key={list.id}
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-2 py-2",
                          active ? "bg-primary text-primary-foreground" : "hover:bg-bg/60",
                        )}
                      >
                        <button
                          type="button"
                          className="min-w-0 flex-1 text-left"
                          onClick={() => setSelectedListId(list.id)}
                        >
                          <p className="truncate text-sm font-medium">{list.name}</p>
                          <p
                            className={cn(
                              "text-xs tabular-nums",
                              active ? "text-primary-foreground/80" : "text-muted",
                            )}
                          >
                            {list.gameIds.length} gier
                          </p>
                        </button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className={cn(
                            "size-8 shrink-0",
                            active && "text-primary-foreground hover:bg-primary-foreground/10",
                          )}
                          onClick={() => {
                            deleteList(list.id);
                            if (selectedListId === list.id) setSelectedListId(null);
                            toast.success("Usunieto liste.");
                          }}
                          aria-label="Usun liste"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </aside>

            {/* PRAWA KOLUMNA - OKLADKI */}
            <section className="rounded-xl bg-card p-3 shadow-[var(--shadow-border)]">
              {!selectedList ? (
                <div className="flex h-full min-h-[360px] items-center justify-center text-center">
                  <p className="max-w-xs text-sm text-muted">
                    Wybierz liste po lewej, a potem klikaj okladki gier aby je dodac lub usunac.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-end justify-between gap-2 px-1">
                    <div>
                      <h3 className="font-display text-lg">{selectedList.name}</h3>
                      <p className="text-sm text-muted">
                        Zaznaczone: {selectedList.gameIds.length}
                      </p>
                    </div>
                  </div>

                  <div className="grid max-h-[55vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
                    {games.map((game) => {
                      const inList = selectedIds.has(game.id);
                      return (
                        <button
                          key={game.id}
                          type="button"
                          onClick={() => toggleGameInList(selectedList.id, game.id)}
                          className={cn(
                            "group relative overflow-hidden rounded-lg text-left transition",
                            inList
                              ? "ring-2 ring-primary"
                              : "opacity-80 hover:opacity-100",
                          )}
                        >
                          <CoverArt game={game} showCrown={false} />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="line-clamp-2 text-xs font-medium text-white">
                              {game.title}
                            </p>
                          </div>
                          {inList ? (
                            <span className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                              <Check className="size-4" />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}