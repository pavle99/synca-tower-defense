import { useGameStore } from "@/state/tower-defense-store";
import type { Vec2 } from "@/utils/vector";
import { useCallback, useEffect } from "react";

interface UseGameAnnouncementsProps {
  announceUrgent: (message: string) => void;
}

export function useGameAnnouncements({
  announceUrgent,
}: UseGameAnnouncementsProps) {
  const { game } = useGameStore();

  // Announce game state changes
  useEffect(() => {
    switch (game.state.gameStatus) {
      case "won":
        announceUrgent(
          `Victory! You completed all waves with ${game.state.money} money remaining.`
        );
        break;
      case "lost":
        announceUrgent(
          `Defeat! You survived ${game.state.currentWave - 1} waves.`
        );
        break;
    }
  }, [
    game.state.gameStatus,
    game.state.money,
    game.state.currentWave,
    announceUrgent,
  ]);

  // Get information about a tile for screen readers
  const getTileInfo = useCallback(
    (position: Vec2): string => {
      const tower = game.state.towers.find(
        (t) => t.tile.x === position.x && t.tile.y === position.y
      );
      if (tower) {
        return `${tower.kind} tower, tier ${tower.tier}`;
      }

      return "Buildable tile";
    },
    [game.state.towers]
  );

  return {
    getTileInfo,
  };
}
