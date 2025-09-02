import type { Vec2 } from "@/utils/vector";
import type { GridTile } from "../grid/types";
import type { Mob } from "../mobs/types";
import type { Tower } from "../towers/types";
import type { Projectile } from "../towers/types";
import type { Wave } from "../waves/types";

export type GamePathType = {
  id: number;
  spawnPoint: Vec2;
  basePoint: Vec2;
  pathPoints: Vec2[]; // precomputed path from spawn to base
  name: string; // e.g., "North Route", "South Route"
};

export type GameGridType = {
  width: number;
  height: number;
  tiles: GridTile[][];
  paths: GamePathType[]; // multiple paths through the map
};

export type GameState = {
  time: number; // simulation time in seconds
  mobs: Mob[];
  towers: Tower[];
  projectiles: Projectile[];
  money: number;
  lives: number;
  currentWave: number;
  waveInProgress: boolean;
  waveStartTime?: number;
  waveCountdown?: number; // Time remaining before auto-start (in seconds)
  gameStatus: "playing" | "paused" | "won" | "lost";
  speed: 1 | 2; // game speed multiplier
  spawnedMobs: Record<string, number>; // track how many mobs spawned per wave/type
  endlessMode: boolean; // whether game is in endless mode
};

export type GameType = {
  state: GameState;
  grid: GameGridType;
  waves: Wave[];
  config: GameConfig;
};

export type GameConfig = {
  tickRate: number; // Hz (e.g., 60)
  startingMoney: number;
  startingLives: number;
  tileSize: number; // pixels
};
