import type { Mob, MobInWorld } from "./mobs/types";
import type { Tower } from "./towers/types";
import type { Vec2 } from "@/utils/vector";
import { VectorUtils } from "@/utils/vector";

/**
 * TARGETING POLICY DOCUMENTATION
 * 
 * This module implements deterministic targeting strategies for tower defense gameplay.
 * Each strategy provides tactical advantages and is designed for consistent, reproducible behavior.
 * 
 * Available Strategies:
 * - FIRST: Target mob closest to base (furthest along path) - good for preventing leaks
 * - LAST: Target newest spawn (furthest from base) - good for crowd control
 * - NEAREST: Target closest mob to tower - maximizes projectile speed/accuracy
 * - STRONGEST: Target mob with highest max HP - eliminates tough enemies first  
 * - WEAKEST: Target mob with lowest current HP - good for cleanup/efficiency
 * 
 * Tie-Breaking Rules:
 * When multiple mobs have identical priority values, the first mob in the array is selected.
 * Since mobs are ordered by spawn time, this ensures deterministic behavior across sessions.
 * 
 * Range Filtering:
 * All targeting strategies first filter mobs to those within the tower's range using
 * Euclidean distance calculation. Only living mobs (hp > 0) are considered valid targets.
 */
function selectTarget(tower: Tower, mobs: Mob[], towerPos: Vec2): Mob | null {
  const mobsInRange = mobs.filter((mob) => {
    const dist = VectorUtils.distance(towerPos, mob.pos);
    return dist <= tower.range && mob.hp > 0;
  });

  if (mobsInRange.length === 0) return null;

  switch (tower.targeting) {
    case "first":
      return getFirstMob(mobsInRange);
    case "last":
      return getLastMob(mobsInRange);
    case "nearest":
      return getNearestMob(mobsInRange, towerPos);
    case "strongest":
      return getStrongestMob(mobsInRange);
    case "weakest":
      return getWeakestMob(mobsInRange);
    default:
      return getFirstMob(mobsInRange);
  }
}

function getFirstMob(mobs: Mob[]): Mob {
  // Assumes mobs array is ordered by spawn time (first spawned = index 0)
  return mobs[0];
}

function getLastMob(mobs: Mob[]): Mob {
  return mobs[mobs.length - 1];
}

function getNearestMob(mobs: Mob[], towerPos: Vec2): Mob {
  return mobs.reduce((nearest, mob) => {
    const nearestDist = VectorUtils.distance(towerPos, nearest.pos);
    const mobDist = VectorUtils.distance(towerPos, mob.pos);
    return mobDist < nearestDist ? mob : nearest;
  });
}

function getStrongestMob(mobs: Mob[]): Mob {
  return mobs.reduce((strongest, mob) => {
    return mob.maxHp > strongest.maxHp ? mob : strongest;
  });
}

function getWeakestMob(mobs: Mob[]): Mob {
  return mobs.reduce((weakest, mob) => {
    return mob.hp < weakest.hp ? mob : weakest;
  });
}

function selectTargetInWorld(
  tower: Tower,
  mobs: MobInWorld[],
  towerPos: Vec2
): Mob | null {
  const mobsInRange = mobs.filter((mob) => {
    const dist = VectorUtils.distance(towerPos, mob.worldPos);
    return dist <= tower.range * 32 && mob.hp > 0; // convert range to world coordinates
  });

  if (mobsInRange.length === 0) return null;

  // Simple targeting: first in path (earliest spawned)
  return mobsInRange[0];
}

export const GameTargeting = {
  selectTarget,
  selectTargetInWorld,
};
