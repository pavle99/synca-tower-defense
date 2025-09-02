import type { AnnouncementPriority } from "@/hooks/use-live-announcements";
import type { CanvasRenderer } from "@/renderers/canvas";
import { useGameStore } from "@/state/store";
import type { Vec2 } from "@/utils/vector";
import { useCallback, useState } from "react";

interface UseGameCanvasGridNavigationProps {
  keyboardMode: boolean;
  rendererRef: React.RefObject<CanvasRenderer | null>;
  announce: (message: string, priority?: AnnouncementPriority) => void;
  getTileInfo: (position: Vec2) => string;
  onAction: (position: Vec2) => void;
}

export function useGameCanvasGridNavigation({
  keyboardMode,
  rendererRef,
  announce,
  getTileInfo,
  onAction,
}: UseGameCanvasGridNavigationProps) {
  const { game } = useGameStore();

  const [position, setPosition] = useState<Vec2>({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  // Announce grid position for screen readers
  const announceGridPosition = useCallback(
    (position: Vec2) => {
      const tileInfo = getTileInfo(position);
      announce(
        `Grid position ${position.x + 1}, ${position.y + 1}. ${tileInfo}`,
        "polite"
      );
    },
    [announce, getTileInfo]
  );

  const movePosition = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      setPosition((current) => {
        let newX = current.x;
        let newY = current.y;

        switch (direction) {
          case "up":
            newY = Math.max(0, current.y - 1);
            break;
          case "down":
            newY = Math.min(game.grid.height - 1, current.y + 1);
            break;
          case "left":
            newX = Math.max(0, current.x - 1);
            break;
          case "right":
            newX = Math.min(game.grid.width - 1, current.x + 1);
            break;
        }

        const newPosition = { x: newX, y: newY };

        if (newX !== current.x || newY !== current.y) {
          if (rendererRef.current && keyboardMode) {
            rendererRef.current.setHighlightedTile(newPosition);
            announceGridPosition(newPosition);
          }
        }

        return newPosition;
      });
    },
    [
      game.grid.width,
      game.grid.height,
      rendererRef,
      keyboardMode,
      announceGridPosition,
    ]
  );

  const activatePosition = useCallback(() => {
    onAction(position);
  }, [position, onAction]);

  const setGridPosition = useCallback(
    (newPosition: Vec2) => {
      const clampedPosition = {
        x: Math.max(0, Math.min(game.grid.width - 1, newPosition.x)),
        y: Math.max(0, Math.min(game.grid.height - 1, newPosition.y)),
      };
      setPosition(clampedPosition);
      if (rendererRef.current && keyboardMode) {
        rendererRef.current.setHighlightedTile(clampedPosition);
        announceGridPosition(clampedPosition);
      }
    },
    [
      game.grid.width,
      game.grid.height,
      rendererRef,
      keyboardMode,
      announceGridPosition,
    ]
  );

  const gridNavigation = {
    position,
    isActive,
    setIsActive,
    movePosition,
    activatePosition,
    setGridPosition,
  };

  return {
    gridNavigation,
    announceGridPosition,
  };
}

export type GridNavigation = ReturnType<
  typeof useGameCanvasGridNavigation
>["gridNavigation"];
