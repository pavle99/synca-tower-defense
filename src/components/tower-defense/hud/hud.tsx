import { Card, CardContent } from "@/components/ui/card";
import { Controls } from "./components/controls";
import { GameStats } from "./components/game-stats/game-stats";
import { GameStatus } from "./components/game-status";

export function Hud() {
  return (
    <Card className="rounded-none border-x-0 border-t-0">
      <CardContent className="max-lg:px-6 max-lg:py-0 p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 lg:gap-0">
        <GameStats />

        <Controls />

        <GameStatus />
      </CardContent>
    </Card>
  );
}
