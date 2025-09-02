import type { MapJSON } from "@/engine/grid/types";
import type { Vec2 } from "@/utils/vector";

export function validateMapStructure(mapData: MapJSON): void {
  if (!mapData.width || !mapData.height || !mapData.tiles) {
    throw new Error("Invalid map structure: missing width, height, or tiles");
  }

  if (
    !mapData.tiles.buildable ||
    !mapData.tiles.blocked ||
    !mapData.tiles.path
  ) {
    throw new Error("Invalid map structure: missing tile arrays");
  }
}

export function validatePositions(
  positions: Vec2[],
  type: string,
  mapData: MapJSON
): void {
  positions.forEach((pos, index) => {
    if (typeof pos.x !== "number" || typeof pos.y !== "number") {
      throw new Error(
        `Invalid ${type} tile at index ${index}: x and y must be numbers`
      );
    }
    if (
      pos.x < 0 ||
      pos.x >= mapData.width ||
      pos.y < 0 ||
      pos.y >= mapData.height
    ) {
      throw new Error(
        `Invalid ${type} tile at index ${index}: position out of bounds`
      );
    }
  });
}

export function validatePathExists(mapData: MapJSON): void {
  if (mapData.tiles.path.length === 0) {
    throw new Error("Map must have at least one path tile");
  }
}

export function validateMapData(mapData: MapJSON): void {
  validateMapStructure(mapData);
  validatePositions(mapData.tiles.buildable, "buildable", mapData);
  validatePositions(mapData.tiles.blocked, "blocked", mapData);
  validatePositions(mapData.tiles.path, "path", mapData);
  validatePathExists(mapData);
}
