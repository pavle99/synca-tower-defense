import { VectorUtils } from "@/utils/vector";
import { GameGrid } from "../grid/grid";
import { GameMobs } from "../mobs/mobs";
import { GameTargeting } from "../targeting";
import type { GameGridType, GameState, GameType } from "./types";
import type { Mob } from "../mobs/types";
import type { Projectile, Tower } from "../towers/types";
import { WAVE_COUNTDOWN_DURATION } from "./constants";
import { getWave } from "../waves/waves";

export function handleWaveCountdown(
  game: GameType,
  state: GameState,
  deltaTime: number
): void {
  // Only handle countdown when not in wave and countdown is active
  if (state.waveInProgress || state.waveCountdown === undefined) {
    return;
  }

  // Decrease countdown
  state.waveCountdown -= deltaTime;

  // Auto-start wave when countdown reaches zero
  if (state.waveCountdown <= 0) {
    state.waveCountdown = undefined;

    // Start next wave automatically
    // For endless mode, allow infinite waves. For normal mode, check wave limit
    if (state.endlessMode || state.currentWave < game.waves.length) {
      state.currentWave++;
      state.waveInProgress = true;
      state.waveStartTime = state.time;
    }
  }
}

export function handleWaveSpawning(game: GameType, state: GameState): void {
  if (!state.waveInProgress) {
    return; // waiting for wave to start
  }

  // Get current wave - for endless mode, generate it dynamically
  let currentWave;
  if (state.endlessMode) {
    currentWave = getWave(state.currentWave, true);
  } else {
    currentWave = game.waves[state.currentWave - 1];
  }
  
  if (!currentWave) return;

  const waveTime = state.time - (state.waveStartTime || 0);

  // Check if we need to spawn mobs from any wave entries
  for (const entry of currentWave.entries) {
    if (waveTime >= entry.delay) {
      // Calculate how many mobs should have been spawned by now
      const timeSinceEntryStart = waveTime - entry.delay;
      const mobsShouldSpawn = Math.min(
        Math.floor(timeSinceEntryStart / entry.spacing) + 1,
        entry.count
      );

      // Count mobs that have been spawned for this entry (not just alive ones)
      const entryKey = `${state.currentWave}_${entry.mobType}`;
      const mobsSpawnedForEntry = state.spawnedMobs[entryKey] || 0;

      const mobsToSpawn = Math.max(0, mobsShouldSpawn - mobsSpawnedForEntry);

      for (let i = 0; i < mobsToSpawn; i++) {
        const mobId = `wave${state.currentWave}_${entry.mobType}_${
          mobsSpawnedForEntry + i
        }`;

        // Randomly select a path for this mob
        const randomPathIndex = Math.floor(
          Math.random() * game.grid.paths.length
        );
        const selectedPath = game.grid.paths[randomPathIndex];

        const mob = GameMobs.createMob(
          entry.mobType,
          selectedPath.spawnPoint,
          mobId,
          false, // not stress test mode for now
          selectedPath.id,
          state.currentWave, // pass wave number for scaling
          state.endlessMode // pass endless mode flag
        );
        state.mobs.push(mob);
      }

      // Update spawn count
      state.spawnedMobs[entryKey] = mobsSpawnedForEntry + mobsToSpawn;
    }
  }

  // Check if all mobs for this wave have been spawned
  const allMobsSpawned = currentWave.entries.every((entry) => {
    const entryKey = `${state.currentWave}_${entry.mobType}`;
    const spawnedCount = state.spawnedMobs[entryKey] || 0;
    return spawnedCount >= entry.count;
  });

  // Check if all mobs from this wave are dead/gone
  const waveMobsRemaining = state.mobs.filter((mob) =>
    mob.id.includes(`wave${state.currentWave}`)
  ).length;

  if (allMobsSpawned && waveMobsRemaining === 0) {
    // Wave complete, no mobs left from this wave
    state.waveInProgress = false;

    // Start countdown for next wave
    // For endless mode, always start countdown. For normal mode, check wave limit
    if (state.endlessMode || state.currentWave < game.waves.length) {
      state.waveCountdown = WAVE_COUNTDOWN_DURATION;
    }
  }
}

export function updateMobs(
  mobs: Mob[],
  grid: GameGridType,
  deltaTime: number
): Mob[] {
  return mobs.map((mob) => {
    const newMob = { ...mob };

    // Apply slow effects
    let speedMultiplier = 1;
    if (mob.slowUntil && mob.slowUntil > 0) {
      speedMultiplier = mob.slowMultiplier || 0.5;
      newMob.slowUntil = Math.max(0, mob.slowUntil - deltaTime);
      if (newMob.slowUntil <= 0) {
        newMob.slowMultiplier = undefined;
      }
    }

    // Move along path using smooth path following
    const effectiveSpeed = mob.speed * speedMultiplier;
    newMob.pathProgress += effectiveSpeed * deltaTime;

    // Update position based on path progress for the mob's specific path
    const mobPath = grid.paths.find((path) => path.id === mob.pathId);
    if (mobPath) {
      GameMobs.updateMobPosition(newMob, mobPath.pathPoints);
    }

    return newMob;
  });
}

export function updateProjectilesAndDamage(
  projectiles: Projectile[],
  mobs: Mob[],
  deltaTime: number
): { projectiles: Projectile[]; mobs: Mob[] } {
  // Create deep copies of mobs to avoid mutation issues
  const updatedMobs = mobs.map((mob) => ({ ...mob }));

  const activeProjectiles = projectiles
    .map((projectile) => {
      const target = updatedMobs.find((mob) => mob.id === projectile.targetId);
      if (!target) return null; // target died, remove projectile

      // Move projectile toward target (use current display tileSize)
      // Note: This will be passed from the game tick
      const tileSize = 32; // Fallback - should be passed via export function parameter
      const targetWorldPos = {
        x: target.pos.x * tileSize + tileSize / 2, // convert to world coordinates (centered)
        y: target.pos.y * tileSize + tileSize / 2,
      };
      const direction = VectorUtils.normalize(
        VectorUtils.subtract(targetWorldPos, projectile.pos)
      );
      const moveDistance = projectile.speed * deltaTime;
      const newProjectilePos = VectorUtils.add(
        projectile.pos,
        VectorUtils.multiply(direction, moveDistance)
      );

      // Create updated projectile instead of mutating
      const updatedProjectile = { ...projectile, pos: newProjectilePos };

      // Check if projectile hit target
      const distToTarget = VectorUtils.distance(
        newProjectilePos,
        targetWorldPos
      );
      if (distToTarget <= tileSize / 2) {
        // hit threshold in world coordinates
        
        /**
         * ARMOR FORMULA DOCUMENTATION
         * 
         * Damage calculation uses flat armor reduction with minimum damage guarantee:
         * 
         * Formula: effectiveDamage = Math.max(1, baseDamage - armor)
         * 
         * Design Principles:
         * 1. FLAT REDUCTION: Armor reduces damage by a flat amount, not percentage
         * 2. MINIMUM DAMAGE: Every attack deals at least 1 damage regardless of armor
         * 3. LINEAR SCALING: High armor provides consistent protection against all damage levels
         * 4. NO IMMUNITY: No mob can become completely immune to damage
         * 
         * Examples:
         * - 50 damage vs 10 armor = 40 effective damage  
         * - 25 damage vs 30 armor = 1 effective damage (minimum)
         * - 100 damage vs 5 armor = 95 effective damage
         * 
         * Splash Damage: Uses 50% of base damage before armor calculation
         * - Primary target: full damage - armor
         * - Splash targets: (damage * 0.5) - armor, minimum 1
         */
        target.hp -= Math.max(1, projectile.damage - target.armor);

        // Apply effects
        if (projectile.effects) {
          for (const effect of projectile.effects) {
            if (effect.type === "slow") {
              target.slowUntil = Math.max(
                target.slowUntil || 0,
                effect.duration
              );
              target.slowMultiplier = effect.slowMultiplier;
            }
          }
        }

        // Handle splash damage
        if (projectile.splash) {
          for (const mob of updatedMobs) {
            if (mob.id !== target.id) {
              const mobWorldPos = {
                x: mob.pos.x * tileSize + tileSize / 2,
                y: mob.pos.y * tileSize + tileSize / 2,
              };
              if (
                VectorUtils.distance(mobWorldPos, targetWorldPos) <=
                projectile.splash.radius * tileSize
              ) {
                mob.hp -= Math.max(
                  1,
                  Math.floor(projectile.damage * 0.5) - mob.armor
                );
              }
            }
          }
        }

        return null; // remove projectile
      }

      return updatedProjectile; // keep projectile with updated position
    })
    .filter((projectile) => projectile !== null);

  return { projectiles: activeProjectiles, mobs: updatedMobs };
}

export function updateTowers(
  towers: Tower[],
  mobs: Mob[],
  projectiles: Projectile[],
  currentTime: number,
  tileSize: number
): void {
  for (const tower of towers) {
    const timeSinceLastShot = currentTime - tower.lastFiredAt;
    const canFire = timeSinceLastShot >= 1 / tower.rate;

    if (!canFire) continue;

    const towerWorldPos = GameGrid.gridToWorld(tower.tile, tileSize);

    // Convert mob positions to world coordinates for targeting
    const mobsInWorld = mobs.map((mob) => ({
      ...mob,
      worldPos: {
        x: mob.pos.x * tileSize + tileSize / 2,
        y: mob.pos.y * tileSize + tileSize / 2,
      },
    }));

    const target = GameTargeting.selectTargetInWorld(
      tower,
      mobsInWorld,
      towerWorldPos
    );

    if (target) {
      // Create projectile
      const projectile: Projectile = {
        id: `proj_${Date.now()}_${Math.random()}`,
        pos: { ...towerWorldPos },
        velocity: { x: 0, y: 0 }, // will be calculated in updateProjectiles
        targetId: target.id,
        speed: tower.projectileSpeed || 200, // pixels/sec
        damage: tower.damage,
        splash: tower.kind === "cannon" ? { radius: 1.5 } : undefined,
        effects:
          tower.kind === "frost"
            ? [{ type: "slow", duration: 3, slowMultiplier: 0.5 }]
            : undefined,
      };

      projectiles.push(projectile);
      tower.lastFiredAt = currentTime;
    }
  }
}
