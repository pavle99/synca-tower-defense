import { useState, useEffect } from "react";
import { useGameStore } from "@/state/tower-defense-store";
import type { Tower } from "@/engine/towers/types";

export function useTowerSelection() {
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const { game } = useGameStore();

  // Update selected tower when game state changes (for upgrades)
  useEffect(() => {
    if (selectedTower) {
      const updatedTower = game.state.towers.find(
        (tower) => tower.id === selectedTower.id
      );
      if (updatedTower) {
        setSelectedTower(updatedTower);
      } else {
        // Tower was removed, clear selection
        setSelectedTower(null);
      }
    }
  }, [game.state.towers, selectedTower, selectedTower?.id]);

  return {
    selectedTower,
    setSelectedTower,
  };
}
