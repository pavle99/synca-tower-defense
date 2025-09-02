import type { GameType } from "@/engine/game/types";
import type { TowerBlueprint } from "@/engine/towers/types";
import type { CanvasRenderer } from "@/renderers/canvas";
import { useGameStore } from "@/state/tower-defense-store";
import type { Vec2 } from "@/utils/vector";
import { useEffect, useRef } from "react";

interface UseGameLoopProps {
  rendererRef: React.RefObject<CanvasRenderer | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hoverPosition: Vec2 | null;
}

export function useGameLoop({
  rendererRef,
  canvasRef,
  hoverPosition,
}: UseGameLoopProps) {
  const { game, isRunning, tick, selectedTowerBlueprint } = useGameStore();
  const animationRef = useRef(0);
  const lastTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);
  const hoverPositionRef = useRef<Vec2 | null>(null);
  const selectedTowerBlueprintRef = useRef<TowerBlueprint | null>(null);
  const isRunningRef = useRef(isRunning);

  // Update game ref for rendering
  const gameRef = useRef<GameType>(game);
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  // Update refs when state changes
  useEffect(() => {
    hoverPositionRef.current = hoverPosition;
  }, [hoverPosition]);

  useEffect(() => {
    selectedTowerBlueprintRef.current = selectedTowerBlueprint;
  }, [selectedTowerBlueprint]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // Game loop - separate from game state to prevent restarts
  useEffect(() => {
    const TICK_INTERVAL = 1 / 30; // Fixed timestep: 33.33ms between game logic updates

    function gameLoop(currentTime: number) {
      const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = currentTime;

      // Cap deltaTime to prevent spiral of death
      const clampedDelta = Math.min(deltaTime, 1 / 60); // Cap at ~16.67ms max frame time

      // Accumulate time
      accumulatedTimeRef.current += clampedDelta;

      // Fixed timestep: only update game logic when enough time has accumulated
      while (accumulatedTimeRef.current >= TICK_INTERVAL) {
        // Update game state with fixed 33.33ms intervals when running
        if (isRunningRef.current) {
          tick(TICK_INTERVAL);
        }
        accumulatedTimeRef.current -= TICK_INTERVAL;
      }

      // Always render at browser refresh rate for smooth visuals
      if (rendererRef.current) {
        rendererRef.current.render(
          gameRef.current,
          hoverPositionRef.current || undefined,
          selectedTowerBlueprintRef.current || undefined
        );
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    }

    if (canvasRef.current) {
      lastTimeRef.current = performance.now();
      accumulatedTimeRef.current = 0; // Reset accumulator
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [tick, rendererRef, canvasRef]);

  // Force render when game is restarted or when game is not running
  // This ensures the canvas shows the current state even when paused
  useEffect(() => {
    if (!isRunning && rendererRef.current) {
      rendererRef.current.render(
        game,
        hoverPosition || undefined,
        selectedTowerBlueprint || undefined
      );
    }
  }, [game, isRunning, hoverPosition, selectedTowerBlueprint, rendererRef]);
}
