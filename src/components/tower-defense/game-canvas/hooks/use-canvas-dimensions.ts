import { useCallback, useEffect, useRef, useState } from "react";
import { useGameStore } from "@/state/tower-defense-store";

interface CanvasDimensions {
  width: number;
  height: number;
  scale: number;
}

export function useCanvasDimensions() {
  const { game } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>({
    width: 640,
    height: 480,
    scale: 1,
  });

  const calculateCanvasDimensionsWithGame =
    useCallback((): CanvasDimensions => {
      if (!containerRef.current || !game) {
        return { width: 640, height: 480, scale: 1 };
      }

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;

      // Available space with more conservative padding
      const padding = 8; // 4px padding on each side
      const availableWidth = containerRect.width - padding;
      const availableHeight = containerRect.height - padding;

      // Grid dimensions: 20x15 tiles
      const gridWidth = game.grid.width;
      const gridHeight = game.grid.height;
      const aspectRatio = gridWidth / gridHeight; // 20/15 = 1.333...

      // Mobile detection
      const isMobile = window.innerWidth < 768;

      let canvasWidth: number;
      let canvasHeight: number;

      if (isMobile) {
        // On mobile, use container dimensions directly but be more conservative
        const maxWidth = Math.min(availableWidth, containerRect.width - 20);
        const maxHeight = Math.min(availableHeight, containerRect.height - 20);

        // Calculate which constraint is more limiting
        const widthConstrainedHeight = maxWidth / aspectRatio;
        const heightConstrainedWidth = maxHeight * aspectRatio;

        if (widthConstrainedHeight <= maxHeight) {
          // Width is the limiting factor
          canvasWidth = maxWidth;
          canvasHeight = widthConstrainedHeight;
        } else {
          // Height is the limiting factor
          canvasWidth = heightConstrainedWidth;
          canvasHeight = maxHeight;
        }

        // Ensure minimum viable size
        const minSize = 335;
        if (canvasWidth < minSize) {
          canvasWidth = minSize;
          canvasHeight = minSize / aspectRatio;
        }
      } else {
        // Desktop: prefer a comfortable size, max 800x600
        const preferredWidth = Math.min(1000, availableWidth);
        const preferredHeight = Math.min(750, availableHeight);

        // Maintain aspect ratio
        const widthConstrainedHeight = preferredWidth / aspectRatio;
        const heightConstrainedWidth = preferredHeight * aspectRatio;

        if (widthConstrainedHeight <= preferredHeight) {
          canvasWidth = preferredWidth;
          canvasHeight = widthConstrainedHeight;
        } else {
          canvasWidth = heightConstrainedWidth;
          canvasHeight = preferredHeight;
        }
      }

      return {
        width: Math.floor(canvasWidth),
        height: Math.floor(canvasHeight),
        scale: pixelRatio,
      };
    }, [game]);

  // Handle window resize
  const handleResize = useCallback(() => {
    const newDimensions = calculateCanvasDimensionsWithGame();
    setCanvasDimensions(newDimensions);
  }, [calculateCanvasDimensionsWithGame]);

  // Set up resize listener
  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Initial size calculation
    handleResize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [handleResize]);

  return {
    containerRef,
    canvasDimensions,
  };
}
