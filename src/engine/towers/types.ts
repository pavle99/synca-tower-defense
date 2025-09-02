import type { Vec2 } from "@/utils/vector";

export type TargetingStrategy =
  | "first"
  | "last"
  | "nearest"
  | "strongest"
  | "weakest";

export type Tower = {
  id: string;
  tile: Vec2; // grid coordinate
  range: number; // tiles
  rate: number; // shots/sec
  damage: number;
  projectileSpeed?: number; // tiles/sec
  lastFiredAt: number; // simulation time
  kind: "arrow" | "cannon" | "frost";
  tier: 1 | 2 | 3;
  cost: number;
  targeting: TargetingStrategy;
};

export type TowerStats = {
  cost: number;
  range: number;
  damage: number;
  rate: number; // shots per second
  projectileSpeed?: number;
  effects?: ProjectileEffect[];
};

export type TowerBlueprint = {
  kind: Tower["kind"];
  tier: Tower["tier"];
  stats: TowerStats;
  name: string;
  description: string;
};

export type Projectile = {
  id: string;
  pos: Vec2;
  velocity: Vec2;
  targetId: string;
  speed: number;
  damage: number;
  splash?: { radius: number };
  effects?: ProjectileEffect[];
};

export type ProjectileEffect = {
  type: "slow";
  duration: number; // seconds
  slowMultiplier: number; // 0.5 = 50% speed
};
