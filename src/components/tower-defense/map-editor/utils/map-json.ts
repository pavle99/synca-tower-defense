import { GameGrid } from "@/engine/grid/grid";
import type { MapJSON } from "@/engine/grid/types";
import type { GameType } from "@/engine/game/types";

export function exportCurrentMap(game: GameType): string {
  const mapData = GameGrid.exportMapToJSON(game.grid);
  return JSON.stringify(mapData, null, 2);
}

export function parseMapData(jsonString: string): MapJSON {
  try {
    return JSON.parse(jsonString);
  } catch {
    throw new Error("Invalid JSON format");
  }
}

export async function copyMapToClipboard(jsonString: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(jsonString);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    throw new Error("Failed to copy to clipboard");
  }
}
