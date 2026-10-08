import { createFileRoute } from "@tanstack/react-router";
import { GameDetail } from "@/components/library/game-detail";

export const Route = createFileRoute("/gra/$id")({
  component: GameRoute,
});

function GameRoute() {
  const { id } = Route.useParams();
  return <GameDetail id={id} />;
}
