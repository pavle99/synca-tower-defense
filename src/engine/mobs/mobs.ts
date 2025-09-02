import type { Mob } from "./types";
import type { Vec2 } from "@/utils/vector";
import { STRESS_MOB_CONFIGS, MOB_CONFIGS } from "./constants";
import type { GameGridType } from "../game/types";

// Get mob configs based on stress test mode
function getMobConfigs(stressTestMode: boolean) {
  if (stressTestMode) {
    return STRESS_MOB_CONFIGS;
  }
  return MOB_CONFIGS;
}

// Generate scaled mob config for endless mode
export function getEndlessMobConfig(
  mobType: keyof typeof MOB_CONFIGS,
  waveNumber: number
) {
  const baseConfig = MOB_CONFIGS[mobType];

  if (waveNumber <= 10) {
    return baseConfig; // No scaling for first 10 waves
  }

  const waveScale = waveNumber - 10;
  const hpScale = Math.pow(1.15, waveScale); // 15% HP increase per wave after 10
  const armorIncrease =
    waveNumber >= 15 ? Math.min(10, Math.floor(waveScale / 3)) : 0; // Armor starts at wave 15
  const speedScale = Math.min(2.0, 1 + waveScale * 0.05); // Cap at 2x speed
  const bountyScale = Math.pow(1.1, waveScale); // 10% bounty increase per wave

  return {
    ...baseConfig,
    hp: Math.floor(baseConfig.hp * hpScale),
    speed: baseConfig.speed * speedScale,
    armor: baseConfig.armor + armorIncrease,
    bounty: Math.floor(baseConfig.bounty * bountyScale),
  };
}

function createMob(
  mobType: keyof typeof MOB_CONFIGS | keyof typeof STRESS_MOB_CONFIGS,
  spawnPos: Vec2,
  id: string,
  stressTestMode: boolean = false,
  pathId: number = 0,
  waveNumber?: number,
  endlessMode: boolean = false
): Mob {
  let config;

  if (endlessMode && waveNumber !== undefined) {
    // Use scaled stats for endless mode
    config = getEndlessMobConfig(
      mobType as keyof typeof MOB_CONFIGS,
      waveNumber
    );
  } else {
    // Use normal or stress test configs
    const configs = getMobConfigs(stressTestMode);
    config = configs[mobType as keyof typeof configs];
  }

  return {
    id,
    pos: { ...spawnPos },
    hp: config.hp,
    maxHp: config.hp,
    speed: config.speed,
    armor: config.armor,
    type: config.type,
    bounty: config.bounty,
    pathProgress: 0,
    targetPathIndex: 1,
    pathId,
  };
}

function updateMobPosition(mob: Mob, pathPoints: Vec2[]): void {
  if (pathPoints.length < 2) return;

  // Clamp progress to valid range
  const totalPathLength = pathPoints.length - 1;
  const clampedProgress = Math.max(
    0,
    Math.min(mob.pathProgress, totalPathLength)
  );

  // Find the current segment the mob is on
  const segmentIndex = Math.floor(clampedProgress);
  const segmentProgress = clampedProgress - segmentIndex;

  // Ensure we don't go beyond the path
  const currentSegmentIndex = Math.min(segmentIndex, pathPoints.length - 2);
  const nextSegmentIndex = currentSegmentIndex + 1;

  // Get the two points that define the current segment
  const currentPoint = pathPoints[currentSegmentIndex];
  const nextPoint = pathPoints[nextSegmentIndex];

  // Interpolate position between the two points
  mob.pos = {
    x: currentPoint.x + (nextPoint.x - currentPoint.x) * segmentProgress,
    y: currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress,
  };

  mob.targetPathIndex = Math.min(
    Math.ceil(clampedProgress),
    pathPoints.length - 1
  );
}

function hasReachedBase(mob: Mob, grid: GameGridType): boolean {
  const mobPath = grid.paths.find((path) => path.id === mob.pathId);
  if (!mobPath) return false;
  return mob.pathProgress >= mobPath.pathPoints.length - 1;
}

export const GameMobs = {
  getMobConfigs,
  createMob,
  updateMobPosition,
  hasReachedBase,
};
