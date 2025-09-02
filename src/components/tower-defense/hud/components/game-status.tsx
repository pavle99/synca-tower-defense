import { Badge } from "@/components/ui/badge";
import { useGameStore } from "@/state/tower-defense-store";

export const GameStatus = () => {
  const { game } = useGameStore();
  const { state } = game;

  return (
    <div
      className="text-right"
      role="region"
      aria-label="Game Status"
      aria-live="polite"
    >
      {state.waveInProgress && (
        <Badge
          variant="secondary"
          className="text-orange-500 border-orange-500"
          role="status"
          aria-label={`Wave ${state.currentWave} in progress`}
        >
          Wave {state.currentWave} in progress...
        </Badge>
      )}

      {state.gameStatus === "won" && (
        <Badge
          className="bg-green-500 text-white"
          role="status"
          aria-label="Game won"
        >
          Victory!
        </Badge>
      )}

      {state.gameStatus === "lost" && (
        <Badge variant="destructive" role="status" aria-label="Game lost">
          Defeat!
        </Badge>
      )}
    </div>
  );
};
