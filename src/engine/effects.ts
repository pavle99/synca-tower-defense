import type { Mob } from "./mobs/types";
import type { ProjectileEffect } from "./towers/types";

/**
 * SLOW STACKING POLICY DOCUMENTATION
 * 
 * This module implements the effect system for tower defense gameplay.
 * Currently supports slow effects with the following stacking rules:
 * 
 * Slow Effect Stacking Rules:
 * 1. STRONGEST WINS: Only the strongest slow effect (lowest multiplier) is active at any time
 * 2. DURATION EXTENSION: Applying a new slow extends the duration if it would last longer
 * 3. NO MULTIPLICATIVE STACKING: Multiple slows don't multiply together for balance reasons
 * 4. MINIMUM SPEED CAP: Slows are limited by mob's base speed (no negative speed)
 * 
 * Example Scenarios:
 * - Mob has 50% slow (0.5x multiplier) for 2s remaining
 * - Apply 30% slow (0.7x multiplier) for 4s
 * - Result: Keep 50% slow but extend duration to 4s (stronger effect wins)
 * 
 * - Mob has 30% slow (0.7x multiplier) for 1s remaining  
 * - Apply 60% slow (0.4x multiplier) for 3s
 * - Result: Replace with 60% slow for 3s (new effect is stronger)
 * 
 * This prevents slow stacking exploits while still allowing tactical layering of effects.
 */
function applyEffects(mob: Mob, effects: ProjectileEffect[]): void {
  for (const effect of effects) {
    switch (effect.type) {
      case "slow":
        applySlowEffect(mob, effect.duration, effect.slowMultiplier);
        break;
    }
  }
}

function applySlowEffect(
  mob: Mob,
  duration: number,
  slowMultiplier: number
): void {
  // Stack slows by taking the strongest effect and extending duration
  const currentMultiplier = mob.slowMultiplier || 1;
  const currentDuration = mob.slowUntil || 0;

  if (slowMultiplier < currentMultiplier) {
    // New slow is stronger, replace it
    mob.slowMultiplier = slowMultiplier;
    mob.slowUntil = Math.max(currentDuration, duration);
  } else {
    // Current slow is stronger or equal, just extend duration if new one lasts longer
    mob.slowUntil = Math.max(currentDuration, duration);
  }
}

function updateMobEffects(mob: Mob, deltaTime: number): void {
  if (mob.slowUntil && mob.slowUntil > 0) {
    mob.slowUntil -= deltaTime;
    if (mob.slowUntil <= 0) {
      mob.slowUntil = undefined;
      mob.slowMultiplier = undefined;
    }
  }
}

function getMobEffectiveSpeed(mob: Mob): number {
  const slowMultiplier =
    mob.slowUntil && mob.slowUntil > 0 ? mob.slowMultiplier || 1 : 1;
  return mob.speed * slowMultiplier;
}

export const GameEffects = {
  applyEffects,
  applySlowEffect,
  updateMobEffects,
  getMobEffectiveSpeed,
};
