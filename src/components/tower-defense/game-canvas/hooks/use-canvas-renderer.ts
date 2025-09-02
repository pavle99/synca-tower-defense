import { useEffect, useRef } from "react";
import { CanvasRenderer } from "@/renderers/canvas";

interface CanvasDimensions {
  width: number;
  height: number;
  scale: number;
}

export function useCanvasRenderer(canvasDimensions: CanvasDimensions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);

  // Initialize renderer
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new CanvasRenderer(canvasRef.current);
    }
  }, []);

  // Update renderer size when dimensions change
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setSize(
        canvasDimensions.width,
        canvasDimensions.height,
        canvasDimensions.scale
      );
    }
  }, [canvasDimensions]);

  return {
    canvasRef,
    rendererRef,
  };
}