import { useState, useEffect } from "react";
import { useGameStore } from "../../../state/tower-defense-store";
import { useLiveAnnouncements } from "../../../hooks/use-live-announcements";
import type { Vec2 } from "@/utils/vector";

import { useCanvasDimensions } from "./hooks/use-canvas-dimensions";
import { useCanvasRenderer } from "./hooks/use-canvas-renderer";
import { useGameLoop } from "./hooks/use-game-loop";
import { useCanvasInteraction } from "./hooks/use-canvas-interaction";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { useTowerSelection } from "./hooks/use-tower-selection";
import { useGridActions } from "./hooks/use-grid-actions";
import { useGameCanvasGridNavigation } from "./hooks/use-grid-navigation";
import { useTowerDialog } from "./hooks/use-tower-dialog";

import { GameOverlays } from "./components/game-overlays";
import { ScreenReaderInstructions } from "./components/screen-reader-instructions";
import { TowerDialog } from "./components/tower-dialog";
import { useGameAnnouncements } from "./hooks/use-game-announcements";
import type { FocusedElement } from "@/type/focused-element";

export function GameCanvas() {
  const [focusedElement, setFocusedElement] = useState<FocusedElement | null>(
    null
  );
  const [hoverPosition, setHoverPosition] = useState<Vec2 | null>(null);

  const { selectedTowerBlueprint, game } = useGameStore();

  const { announce, announceGameEvent, announceUrgent, createLiveRegions } =
    useLiveAnnouncements();
  const { containerRef, canvasDimensions } = useCanvasDimensions();
  const { canvasRef, rendererRef } = useCanvasRenderer(canvasDimensions);
  const { selectedTower, setSelectedTower } = useTowerSelection();
  const { handleGridAction } = useGridActions({
    setSelectedTower,
    announceGameEvent,
    announceUrgent,
  });
  const { getTileInfo } = useGameAnnouncements({
    announceUrgent,
  });
  const {
    handleCanvasInteraction,
    handleCanvasMouseMove,
    handleCanvasMouseLeave,
    handleCanvasBlur,
    handleCanvasFocus,
    keyboardMode,
  } = useCanvasInteraction({
    canvasRef,
    canvasDimensions,
    onGridAction: handleGridAction,
    onHoverPositionChange: setHoverPosition,
    announce,
    setFocusedElement,
    rendererRef,
    selectedTower,
  });

  const { gridNavigation } = useGameCanvasGridNavigation({
    keyboardMode,
    rendererRef,
    announce,
    getTileInfo,
    onAction: handleGridAction,
  });

  const { handleTowerDialogClose } = useTowerDialog({
    setFocusedElement,
    setSelectedTower,
  });

  useGameLoop({
    rendererRef,
    canvasRef,
    hoverPosition,
  });

  useKeyboardShortcuts({
    selectedTower,
    focusedElement,
    gridNavigation,
    announceGameEvent,
    announceUrgent,
  });

  // Clear hover position when no tower blueprint is selected
  useEffect(() => {
    if (!selectedTowerBlueprint) {
      setHoverPosition(null);
    }
  }, [selectedTowerBlueprint]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center min-h-0 min-w-0 max-lg:my-10"
    >
      <div>{createLiveRegions()}</div>

      <canvas
        ref={canvasRef}
        className="border border-gray-300 cursor-crosshair focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 object-contain"
        onClick={handleCanvasInteraction}
        onTouchEnd={handleCanvasInteraction}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
        onFocus={handleCanvasFocus}
        onBlur={handleCanvasBlur}
        tabIndex={0}
        role="application"
        aria-label="Tower Defense Game Board"
        aria-describedby="game-instructions"
      />

      <ScreenReaderInstructions />

      <GameOverlays gameState={game.state} />

      <TowerDialog
        selectedTower={selectedTower}
        onOpenChange={handleTowerDialogClose}
      />
    </div>
  );
}
