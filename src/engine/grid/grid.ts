import type { GameGridType } from "../game/types";
import type { GridTile, MapJSON } from "./types";
import type { GamePathType } from "../game/types";
import type { Vec2 } from "@/utils/vector";
import { GamePath } from "./path";

function createGrid(width: number, height: number): GameGridType {
  const tiles: GridTile[][] = [];

  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      tiles[y][x] = { type: "buildable" };
    }
  }

  // Create multiple paths
  const paths = GamePath.createMultiplePaths(width, height, tiles);

  // Add blocked tiles for strategic gameplay
  addBlockedTiles(width, height, tiles, paths);

  return {
    width,
    height,
    tiles,
    paths,
  };
}

function addBlockedTiles(
  width: number,
  height: number,
  tiles: GridTile[][],
  paths: GamePathType[]
): void {
  // Create some strategic blocked areas that don't interfere with paths

  // Add some mountain/rock clusters
  const blockedAreas = [
    // Left side barriers
    { x: 3, y: 2, size: 2 },
    { x: 4, y: 8, size: 2 },
    { x: 5, y: 11, size: 1 },

    // Central obstacles
    { x: 9, y: 3, size: 1 },
    { x: 11, y: 7, size: 2 },
    { x: 10, y: 10, size: 1 },

    // Right side barriers
    { x: 15, y: 1, size: 1 },
    { x: 16, y: 5, size: 2 },
    { x: 14, y: 9, size: 1 },
    { x: 17, y: 12, size: 1 },
  ];

  // Get all path tiles to avoid blocking them
  const pathTiles = new Set<string>();
  paths.forEach((path) => {
    path.pathPoints.forEach((point) => {
      pathTiles.add(`${point.x},${point.y}`);
    });
  });

  // Place blocked tiles
  blockedAreas.forEach((area) => {
    for (let dy = 0; dy < area.size; dy++) {
      for (let dx = 0; dx < area.size; dx++) {
        const x = area.x + dx;
        const y = area.y + dy;

        // Check bounds and ensure we don't block paths
        if (x >= 0 && x < width && y >= 0 && y < height) {
          const key = `${x},${y}`;
          if (!pathTiles.has(key)) {
            tiles[y][x] = { type: "blocked" };
          }
        }
      }
    }
  });

  // Add some scattered individual blocked tiles for variety
  const scatteredBlocked = [
    { x: 2, y: 5 },
    { x: 6, y: 1 },
    { x: 8, y: 12 },
    { x: 12, y: 2 },
    { x: 13, y: 13 },
    { x: 18, y: 7 },
  ];

  scatteredBlocked.forEach((pos) => {
    if (pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height) {
      const key = `${pos.x},${pos.y}`;
      if (!pathTiles.has(key)) {
        tiles[pos.y][pos.x] = { type: "blocked" };
      }
    }
  });
}

function getTileAt(grid: GameGridType, pos: Vec2): GridTile | null {
  if (!GamePath.isValidPosition(grid, pos)) return null;
  return grid.tiles[pos.y][pos.x];
}

function canBuildAt(grid: GameGridType, pos: Vec2): boolean {
  const tile = getTileAt(grid, pos);
  return tile?.type === "buildable";
}

function worldToGrid(worldPos: Vec2, tileSize: number): Vec2 {
  return {
    x: Math.floor(worldPos.x / tileSize),
    y: Math.floor(worldPos.y / tileSize),
  };
}

function gridToWorld(gridPos: Vec2, tileSize: number): Vec2 {
  return {
    x: gridPos.x * tileSize + tileSize / 2,
    y: gridPos.y * tileSize + tileSize / 2,
  };
}

function exportMapToJSON(grid: GameGridType): MapJSON {
  const mapData: MapJSON = {
    width: grid.width,
    height: grid.height,
    tiles: {
      buildable: [],
      blocked: [],
      path: [],
    },
  };

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const tile = grid.tiles[y][x];
      const pos = { x, y };

      if (tile.type === "buildable") {
        mapData.tiles.buildable.push(pos);
      } else if (tile.type === "blocked") {
        mapData.tiles.blocked.push(pos);
      } else if (tile.type === "path") {
        mapData.tiles.path.push(pos);
      }
    }
  }

  return mapData;
}

function importMapFromJSON(mapData: MapJSON): GameGridType {
  const tiles: GridTile[][] = [];

  // Initialize all tiles as buildable
  for (let y = 0; y < mapData.height; y++) {
    tiles[y] = [];
    for (let x = 0; x < mapData.width; x++) {
      tiles[y][x] = { type: "buildable" };
    }
  }

  // Set blocked tiles
  mapData.tiles.blocked.forEach((pos) => {
    if (
      pos.x >= 0 &&
      pos.x < mapData.width &&
      pos.y >= 0 &&
      pos.y < mapData.height
    ) {
      tiles[pos.y][pos.x] = { type: "blocked" };
    }
  });

  // Set path tiles
  mapData.tiles.path.forEach((pos) => {
    if (
      pos.x >= 0 &&
      pos.x < mapData.width &&
      pos.y >= 0 &&
      pos.y < mapData.height
    ) {
      tiles[pos.y][pos.x] = { type: "path" };
    }
  });

  // Create paths from the path tiles (simplified - using existing path logic)
  const paths = GamePath.createMultiplePaths(
    mapData.width,
    mapData.height,
    tiles
  );

  return {
    width: mapData.width,
    height: mapData.height,
    tiles,
    paths,
  };
}

export const GameGrid = {
  createGrid,
  addBlockedTiles,
  getTileAt,
  canBuildAt,
  worldToGrid,
  gridToWorld,
  exportMapToJSON,
  importMapFromJSON,
};
