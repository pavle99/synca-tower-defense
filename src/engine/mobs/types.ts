import type { Vec2 } from "@/utils/vector";

export type Mob = {
  id: string;
  pos: Vec2;
  hp: number;
  maxHp: number;
  speed: number; // tiles/sec
  armor: number; // flat reduction
  type: "normal" | "fast" | "tank" | "flying";
  bounty: number;
  slowUntil?: number; // simulation time when slow expires
  slowMultiplier?: number; // current speed multiplier from slow effects
  pathProgress: number; // 0-1, how far along the path (for smooth movement)
  targetPathIndex: number; // index of next path point to move toward
  pathId: number; // which path this mob is following
};

export type MobInWorld = Mob & {
  worldPos: Vec2;
};
