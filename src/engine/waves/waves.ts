import type { Wave } from "./types";
import { ENDLESS_CONFIG, STRESS_WAVES, WAVES } from "./constants";

// Generate endless wave based on wave number
export function generateEndlessWave(waveNumber: number): Wave {
  const baseWave =
    waveNumber <= WAVES.length
      ? WAVES[waveNumber - 1]
      : WAVES[WAVES.length - 1]; // Use final wave as template

  const scaleFactor = Math.pow(
    ENDLESS_CONFIG.mobCountScale,
    waveNumber - WAVES.length
  );
  const isEliteWave = waveNumber % ENDLESS_CONFIG.eliteWaveInterval === 0;
  const isBossWave = waveNumber % ENDLESS_CONFIG.bossWaveInterval === 0;

  const entries = baseWave.entries.map((entry) => ({
    ...entry,
    count: Math.floor(entry.count * scaleFactor),
    // Tighten spacing at higher waves
    spacing: Math.max(
      0.1,
      entry.spacing * Math.pow(0.95, waveNumber - WAVES.length)
    ),
  }));

  // Add elite/boss variants for special waves
  if (isBossWave) {
    entries.push({
      delay: 2,
      mobType: "tank", // Boss is just a super tank for now
      count: 10,
      spacing: 1.0,
    });
  } else if (isEliteWave && waveNumber > 15) {
    // Add some flying units for elite waves
    entries.push({
      delay: 1,
      mobType: "flying",
      count: Math.max(2, Math.floor(waveNumber / 10)),
      spacing: 0.7,
    });
  }

  return {
    id: waveNumber,
    entries,
  };
}

// Get waves based on mode
export function getWaves(
  stressTestMode: boolean,
  endlessMode: boolean = false
): Wave[] {
  if (stressTestMode) {
    return STRESS_WAVES;
  }
  if (endlessMode) {
    return []; // Endless mode generates waves dynamically
  }
  return WAVES;
}

// Get specific wave for endless mode or normal mode
export function getWave(
  waveNumber: number,
  endlessMode: boolean = false
): Wave | null {
  if (endlessMode) {
    return generateEndlessWave(waveNumber);
  }

  if (waveNumber <= 0 || waveNumber > WAVES.length) {
    return null;
  }

  return WAVES[waveNumber - 1];
}

export const GameWaves = {
  getWaves,
};
