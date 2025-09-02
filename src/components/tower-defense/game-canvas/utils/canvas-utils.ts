import { GameGrid } from "@/engine/grid/grid";
import type { Vec2 } from "@/utils/vector";

interface CanvasDimensions {
  width: number;
  height: number;
  scale: number;
}

export interface InteractionCoordinates {
  canvasX: number;
  canvasY: number;
  gridPos: Vec2;
}

export function getInteractionCoordinates(
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement,
  canvasDimensions: CanvasDimensions,
  gridWidth: number
): InteractionCoordinates {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvasDimensions.width / rect.width;
  const scaleY = canvasDimensions.height / rect.height;

  const canvasX = (clientX - rect.left) * scaleX;
  const canvasY = (clientY - rect.top) * scaleY;

  // Convert to grid coordinates using responsive tile size
  const tileSize = canvasDimensions.width / gridWidth;
  const gridPos = GameGrid.worldToGrid({ x: canvasX, y: canvasY }, tileSize);

  return {
    canvasX,
    canvasY,
    gridPos,
  };
}
