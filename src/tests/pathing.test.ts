import { describe, it, expect, beforeEach } from "vitest";
import type { Vec2 } from "@/utils/vector";
import type { GameGridType } from "@/engine/game/types";
import { GameGrid } from "@/engine/grid/grid";
import { GamePath } from "@/engine/grid/path";

describe("Pathing System", () => {
  let grid: GameGridType;

  beforeEach(() => {
    // Create a test grid
    grid = GameGrid.createGrid(10, 8);
  });

  it("should create a valid grid with correct dimensions", () => {
    expect(grid.width).toBe(10);
    expect(grid.height).toBe(8);
    expect(grid.tiles).toHaveLength(8); // 8 rows
    expect(grid.tiles[0]).toHaveLength(10); // 10 columns
  });

  it("should have valid spawn and base points", () => {
    expect(grid.paths).toBeDefined();
    expect(grid.paths.length).toBeGreaterThan(0);

    // Check that each path has valid spawn and base points
    grid.paths.forEach((path) => {
      expect(path.spawnPoint).toBeDefined();
      expect(path.basePoint).toBeDefined();

      // Spawn should be on the left, base on the right
      expect(path.spawnPoint.x).toBe(0);
      expect(path.basePoint.x).toBe(9);
    });
  });

  it("should create a valid path from spawn to base", () => {
    expect(grid.paths).toBeDefined();
    expect(grid.paths.length).toBeGreaterThan(0);

    // Check each path
    grid.paths.forEach((path) => {
      expect(path.pathPoints).toBeDefined();
      expect(path.pathPoints.length).toBeGreaterThan(1);

      // First point should be spawn
      expect(path.pathPoints[0]).toEqual(path.spawnPoint);

      // Last point should be base
      expect(path.pathPoints[path.pathPoints.length - 1]).toEqual(
        path.basePoint
      );
    });
  });

  it("should mark path tiles correctly", () => {
    // Check each path
    grid.paths.forEach((path) => {
      // Check that spawn and base tiles are marked as path
      const spawnTile = GameGrid.getTileAt(grid, path.spawnPoint);
      const baseTile = GameGrid.getTileAt(grid, path.basePoint);

      expect(spawnTile?.type).toBe("path");
      expect(baseTile?.type).toBe("path");

      // Check path continuity - all tiles along the path should be marked as path
      for (const pathPoint of path.pathPoints) {
        const tile = GameGrid.getTileAt(grid, pathPoint);
        expect(tile?.type).toBe("path");
      }
    });
  });

  it("should validate positions correctly", () => {
    // Valid positions
    expect(GamePath.isValidPosition(grid, { x: 0, y: 0 })).toBe(true);
    expect(GamePath.isValidPosition(grid, { x: 9, y: 7 })).toBe(true);
    expect(GamePath.isValidPosition(grid, { x: 5, y: 4 })).toBe(true);

    // Invalid positions
    expect(GamePath.isValidPosition(grid, { x: -1, y: 0 })).toBe(false);
    expect(GamePath.isValidPosition(grid, { x: 0, y: -1 })).toBe(false);
    expect(GamePath.isValidPosition(grid, { x: 10, y: 0 })).toBe(false);
    expect(GamePath.isValidPosition(grid, { x: 0, y: 8 })).toBe(false);
  });

  it("should prevent building on path tiles", () => {
    // Check each path
    grid.paths.forEach((path) => {
      // Cannot build on spawn
      expect(GameGrid.canBuildAt(grid, path.spawnPoint)).toBe(false);

      // Cannot build on base
      expect(GameGrid.canBuildAt(grid, path.basePoint)).toBe(false);

      // Cannot build on any path tile
      for (const pathPoint of path.pathPoints) {
        expect(GameGrid.canBuildAt(grid, pathPoint)).toBe(false);
      }
    });
  });

  it("should allow building on buildable tiles", () => {
    // Find a non-path tile
    let buildableTile: Vec2 | null = null;

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const pos = { x, y };
        const tile = GameGrid.getTileAt(grid, pos);
        if (tile?.type === "buildable") {
          buildableTile = pos;
          break;
        }
      }
      if (buildableTile) break;
    }

    expect(buildableTile).not.toBeNull();
    if (buildableTile) {
      expect(GameGrid.canBuildAt(grid, buildableTile)).toBe(true);
    }
  });

  it("should have path with correct direction vectors", () => {
    // Check each path
    grid.paths.forEach((path) => {
      // Check that path tiles have direction information
      for (const pathPoint of path.pathPoints) {
        const tile = GameGrid.getTileAt(grid, pathPoint);
        if (tile && tile.type === "path") {
          expect(tile.pathDirection).toBeDefined();

          // Direction should be a unit vector (length <= 1)
          if (tile.pathDirection) {
            const length = Math.sqrt(
              tile.pathDirection.x * tile.pathDirection.x +
                tile.pathDirection.y * tile.pathDirection.y
            );
            expect(length).toBeLessThanOrEqual(1.1); // Allow for floating point precision
          }
        }
      }
    });
  });

  it("should create continuous path segments", () => {
    // Check each path
    grid.paths.forEach((path) => {
      // Verify path points are connected (adjacent tiles)
      for (let i = 1; i < path.pathPoints.length; i++) {
        const prev = path.pathPoints[i - 1];
        const curr = path.pathPoints[i];

        const dx = Math.abs(curr.x - prev.x);
        const dy = Math.abs(curr.y - prev.y);

        // Should be adjacent (Manhattan distance = 1)
        expect(dx + dy).toBe(1);
      }
    });
  });

  it("should handle edge cases for path validation", () => {
    // Test with invalid positions
    expect(GameGrid.getTileAt(grid, { x: -1, y: 0 })).toBeNull();
    expect(GameGrid.getTileAt(grid, { x: 0, y: -1 })).toBeNull();
    expect(GameGrid.getTileAt(grid, { x: 10, y: 0 })).toBeNull();
    expect(GameGrid.getTileAt(grid, { x: 0, y: 8 })).toBeNull();

    // Test building on invalid positions
    expect(GameGrid.canBuildAt(grid, { x: -1, y: 0 })).toBe(false);
    expect(GameGrid.canBuildAt(grid, { x: 10, y: 8 })).toBe(false);
  });

  it("should maintain consistent path length", () => {
    // Check each path
    grid.paths.forEach((path) => {
      // Path should span the entire width at minimum
      const pathLength = path.pathPoints.length;
      expect(pathLength).toBeGreaterThanOrEqual(grid.width);

      // Should not be excessively long (heuristic check)
      expect(pathLength).toBeLessThan((grid.width * grid.height) / 2);
    });
  });

  // Test mob movement simulation along path
  it("should support mob movement along path", () => {
    // Test the first path (they should all work similarly)
    const testPath = grid.paths[0];
    expect(testPath).toBeDefined();

    const simulateMobMovement = (progress: number): Vec2 => {
      // progress from 0 to 1 along the entire path
      const totalSegments = testPath.pathPoints.length - 1;
      const segmentIndex = Math.floor(progress * totalSegments);
      const segmentProgress = progress * totalSegments - segmentIndex;

      if (segmentIndex >= totalSegments) {
        return testPath.pathPoints[testPath.pathPoints.length - 1];
      }

      const start = testPath.pathPoints[segmentIndex];
      const end = testPath.pathPoints[segmentIndex + 1];

      return {
        x: start.x + (end.x - start.x) * segmentProgress,
        y: start.y + (end.y - start.y) * segmentProgress,
      };
    };

    // Test movement from start to end
    const startPos = simulateMobMovement(0);
    const midPos = simulateMobMovement(0.5);
    const endPos = simulateMobMovement(1);

    expect(startPos).toEqual(testPath.spawnPoint);
    expect(endPos).toEqual(testPath.basePoint);

    // Mid position should be somewhere along the path
    expect(midPos.x).toBeGreaterThanOrEqual(0);
    expect(midPos.x).toBeLessThanOrEqual(grid.width - 1);
    expect(midPos.y).toBeGreaterThanOrEqual(0);
    expect(midPos.y).toBeLessThanOrEqual(grid.height - 1);
  });
});
