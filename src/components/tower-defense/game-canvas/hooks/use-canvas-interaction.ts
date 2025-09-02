import { useRef, useState } from "react";
import type { Vec2 } from "@/utils/vector";
import { getInteractionCoordinates } from "../utils/canvas-utils";
import { useGameStore } from "@/state/store";
import type { AnnouncementPriority } from "@/hooks/use-live-announcements";
import type { Tower } from "@/engine/towers/types";
import type { CanvasRenderer } from "@/renderers/canvas";
import type { FocusedElement } from "@/type/focused-element";

interface CanvasDimensions {
  width: number;
  height: number;
  scale: number;
}

interface UseCanvasInteractionProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasDimensions: CanvasDimensions;
  onGridAction: (position: Vec2) => void;
  onHoverPositionChange: (position: Vec2 | null) => void;
  announce: (message: string, priority?: AnnouncementPriority) => void;
  setFocusedElement: (el: FocusedElement | null) => void;
  selectedTower: Tower | null;
  rendererRef: React.RefObject<CanvasRenderer | null>;
}

export function useCanvasInteraction({
  canvasRef,
  canvasDimensions,
  onGridAction,
  onHoverPositionChange,
  announce,
  setFocusedElement,
  selectedTower,
  rendererRef,
}: UseCanvasInteractionProps) {
  const [keyboardMode, setKeyboardMode] = useState(false);

  const lastActionTimeRef = useRef<number>(0);

  const { game, selectedTowerBlueprint } = useGameStore();
  const gridWidth = game.grid.width;

  // Universal click/tap handler for both mouse and touch
  const handleCanvasInteraction = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!canvasRef.current) return;

    // Get coordinates from either mouse or touch event
    let clientX: number, clientY: number;

    if ("changedTouches" in event) {
      // Touch event (touchend)
      if (event.changedTouches.length === 0) return;
      const touch = event.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      event.preventDefault(); // Prevent default touch behaviors
    } else {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const coordinates = getInteractionCoordinates(
      clientX,
      clientY,
      canvasRef.current,
      canvasDimensions,
      gridWidth
    );

    // Handle the action with debouncing
    handleGridActionWithDebounce(coordinates.gridPos);
  };

  // Handle mouse movement for placement preview
  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!canvasRef.current || !selectedTowerBlueprint) {
      onHoverPositionChange(null);
      return;
    }

    const coordinates = getInteractionCoordinates(
      event.clientX,
      event.clientY,
      canvasRef.current,
      canvasDimensions,
      gridWidth
    );

    onHoverPositionChange(coordinates.gridPos);
  };

  // Handle mouse leave to clear hover position
  const handleCanvasMouseLeave = () => {
    onHoverPositionChange(null);
  };

  // Handle grid-based actions with debouncing
  const handleGridActionWithDebounce = (position: Vec2) => {
    const now = Date.now();

    // Prevent rapid double-taps (within 300ms)
    if (now - lastActionTimeRef.current < 300) {
      return;
    }
    lastActionTimeRef.current = now;

    onGridAction(position);
  };

  // Handle canvas focus for keyboard navigation
  const handleCanvasFocus = () => {
    setKeyboardMode(true);
    setFocusedElement("canvas");
    announce(
      "Game canvas focused. Use arrow keys to navigate, Enter to select or place towers, Escape to clear selection"
    );
  };

  const handleCanvasBlur = () => {
    setKeyboardMode(false);

    if (!selectedTower) {
      setFocusedElement(null);
    } else {
      setFocusedElement("dialog");
    }

    if (rendererRef.current) {
      rendererRef.current.clearHighlightedTile();
    }
  };

  return {
    keyboardMode,
    handleCanvasFocus,
    handleCanvasBlur,
    handleCanvasInteraction,
    handleCanvasMouseMove,
    handleCanvasMouseLeave,
  };
}
