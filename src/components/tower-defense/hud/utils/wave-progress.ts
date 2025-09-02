import type { GameType, GameState } from "@/engine/game/types";

export function getWaveProgressText(game: GameType, state: GameState): string {
  const currentWave = game.waves[state.currentWave - 1];
  if (!currentWave) return "";

  // Count total mobs that should spawn
  const totalMobsInWave = currentWave.entries.reduce(
    (sum, entry) => sum + entry.count,
    0
  );

  // Count how many have been spawned
  const totalSpawned = currentWave.entries.reduce((sum, entry) => {
    const entryKey = `${state.currentWave}_${entry.mobType}`;
    return sum + (state.spawnedMobs[entryKey] || 0);
  }, 0);

  // Count alive mobs from this wave
  const aliveFromWave = state.mobs.filter((mob) =>
    mob.id.includes(`wave${state.currentWave}`)
  ).length;

  if (totalSpawned < totalMobsInWave) {
    return `Spawning: ${totalSpawned}/${totalMobsInWave}`;
  } else {
    return `Remaining: ${aliveFromWave}`;
  }
}
