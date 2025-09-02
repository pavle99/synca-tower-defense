import type { TowerBlueprint } from "./types";
import type { Tower } from "./types";
import type { Vec2 } from "@/utils/vector";
import type { TargetingStrategy } from "./types";
import { STRESS_TOWER_BLUEPRINTS, TOWER_BLUEPRINTS } from "./constants";

function createTower(
  blueprint: TowerBlueprint,
  tile: Vec2,
  id: string,
  targeting: TargetingStrategy = "first"
): Tower {
  return {
    id,
    tile: { ...tile },
    range: blueprint.stats.range,
    rate: blueprint.stats.rate,
    damage: blueprint.stats.damage,
    projectileSpeed: blueprint.stats.projectileSpeed,
    lastFiredAt: 0,
    kind: blueprint.kind,
    tier: blueprint.tier,
    cost: blueprint.stats.cost,
    targeting,
  };
}

function getUpgradeCost(tower: Tower): number {
  const nextTier = (tower.tier + 1) as 1 | 2 | 3;
  if (nextTier > 3) return 0; // max tier

  const blueprintKey = `${tower.kind}_${nextTier}`;
  const blueprint = TOWER_BLUEPRINTS[blueprintKey];
  return blueprint ? blueprint.stats.cost : 0;
}

function canUpgradeTower(tower: Tower): boolean {
  return tower.tier < 3;
}

function upgradeTower(tower: Tower): Tower | null {
  if (!canUpgradeTower(tower)) return null;

  const nextTier = (tower.tier + 1) as 1 | 2 | 3;
  const blueprintKey = `${tower.kind}_${nextTier}`;
  const blueprint = TOWER_BLUEPRINTS[blueprintKey];

  if (!blueprint) return null;

  return {
    ...tower,
    tier: nextTier,
    range: blueprint.stats.range,
    rate: blueprint.stats.rate,
    damage: blueprint.stats.damage,
    projectileSpeed: blueprint.stats.projectileSpeed,
    cost: blueprint.stats.cost,
  };
}

// Get tower blueprints based on stress test mode
function getTowerBlueprints(
  stressTestMode: boolean
): Record<string, TowerBlueprint> {
  if (stressTestMode) {
    return STRESS_TOWER_BLUEPRINTS;
  }
  return TOWER_BLUEPRINTS;
}

// Get the appropriate blueprints for the build bar (just the tier 1 towers)
function getBuildBarBlueprints(stressTestMode: boolean): TowerBlueprint[] {
  const blueprints = getTowerBlueprints(stressTestMode);
  return [blueprints.arrow_1, blueprints.cannon_1, blueprints.frost_1];
}

export const GameTowers = {
  createTower,
  getUpgradeCost,
  canUpgradeTower,
  upgradeTower,
  getTowerBlueprints,
  getBuildBarBlueprints,
};
