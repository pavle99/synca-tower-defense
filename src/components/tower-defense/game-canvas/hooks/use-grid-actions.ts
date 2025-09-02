import { useGameStore } from "@/state/store";
import type { Vec2 } from "@/utils/vector";
import type { Tower } from "@/engine/towers/types";

interface UseGridActionsProps {
  setSelectedTower: (tower: Tower | null) => void;
  announceGameEvent: (event: string, details?: string) => void;
  announceUrgent: (message: string) => void;
}

export function useGridActions({ 
  setSelectedTower,
  announceGameEvent,
  announceUrgent,
}: UseGridActionsProps) {
  const {
    game,
    placeTower,
    selectedTowerBlueprint,
    selectTowerBlueprint,
    pauseGame,
  } = useGameStore();

  const handleGridAction = (position: Vec2) => {
    if (selectedTowerBlueprint) {
      if (placeTower(position.x, position.y)) {
        announceGameEvent(
          "Tower placed",
          `${selectedTowerBlueprint.name} at position ${position.x + 1}, ${
            position.y + 1
          }`
        );
        // Clear tower blueprint selection after successful placement
        selectTowerBlueprint(null);
        setSelectedTower(null);
      } else {
        announceUrgent("Cannot place tower here");
      }
    } else {
      const tower = game.state.towers.find(
        (t) => t.tile.x === position.x && t.tile.y === position.y
      );
      if (tower) {
        setSelectedTower(tower);
        announceGameEvent(
          "Tower selected",
          `${tower.kind} tower, tier ${tower.tier}`
        );
        if (game.state.gameStatus === "playing") {
          pauseGame();
        }
      }
    }
  };

  return {
    handleGridAction,
  };
}