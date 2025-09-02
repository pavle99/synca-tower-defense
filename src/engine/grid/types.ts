import type { Vec2 } from "@/utils/vector";

export type TileType = "path" | "buildable" | "blocked";

export type GridTile = {
  type: TileType;
  pathDirection?: Vec2; // for path tiles, normalized direction
};

export type MapJSON = {
  width: number;
  height: number;
  tiles: {
    blocked: Vec2[];
    path: Vec2[];
  };
};
