import { useGameStore } from "@/state/store";
import type { Tower } from "@/engine/towers/types";
import type { FocusedElement } from "@/type/focused-element";

interface UseTowerDialogProps {
  setFocusedElement: (element: FocusedElement | null) => void;
  setSelectedTower: (tower: Tower | null) => void;
}

export function useTowerDialog({
  setFocusedElement,
  setSelectedTower,
}: UseTowerDialogProps) {
  const { game, resumeGame } = useGameStore();

  const handleTowerDialogClose = (open: boolean) => {
    if (!open) {
      setFocusedElement(null);
      setSelectedTower(null);
      // Resume game when closing dialog if it was paused for tower info
      // Add small delay to prevent flickering from modal close animation
      if (game.state.gameStatus === "paused") {
        setTimeout(() => {
          resumeGame();
        }, 150); // 150ms delay to allow modal close animation to complete
      }
    }
  };

  return {
    handleTowerDialogClose,
  };
}
