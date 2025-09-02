import type { Wave } from "./types";

export const WAVES: Wave[] = [
  {
    id: 1,
    entries: [{ delay: 0, mobType: "normal", count: 5, spacing: 1.0 }],
  },
  {
    id: 2,
    entries: [{ delay: 0, mobType: "normal", count: 8, spacing: 0.8 }],
  },
  {
    id: 3,
    entries: [
      { delay: 0, mobType: "normal", count: 6, spacing: 0.8 },
      { delay: 3, mobType: "fast", count: 3, spacing: 0.5 },
    ],
  },
  {
    id: 4,
    entries: [
      { delay: 0, mobType: "normal", count: 10, spacing: 0.7 },
      { delay: 2, mobType: "tank", count: 1, spacing: 1.0 },
    ],
  },
  {
    id: 5,
    entries: [
      { delay: 0, mobType: "fast", count: 8, spacing: 0.6 },
      { delay: 1, mobType: "normal", count: 5, spacing: 0.8 },
    ],
  },
  {
    id: 6,
    entries: [
      { delay: 0, mobType: "normal", count: 12, spacing: 0.6 },
      { delay: 2, mobType: "tank", count: 2, spacing: 1.5 },
      { delay: 4, mobType: "flying", count: 3, spacing: 0.8 },
    ],
  },
  {
    id: 7,
    entries: [
      { delay: 0, mobType: "fast", count: 10, spacing: 0.5 },
      { delay: 1, mobType: "tank", count: 3, spacing: 1.0 },
      { delay: 3, mobType: "flying", count: 4, spacing: 0.7 },
    ],
  },
  {
    id: 8,
    entries: [
      { delay: 0, mobType: "normal", count: 15, spacing: 0.5 },
      { delay: 1, mobType: "fast", count: 8, spacing: 0.4 },
      { delay: 3, mobType: "tank", count: 4, spacing: 1.0 },
    ],
  },
  {
    id: 9,
    entries: [
      { delay: 0, mobType: "flying", count: 8, spacing: 0.6 },
      { delay: 2, mobType: "tank", count: 5, spacing: 0.8 },
      { delay: 4, mobType: "fast", count: 12, spacing: 0.3 },
    ],
  },
  {
    id: 10,
    entries: [
      { delay: 0, mobType: "normal", count: 20, spacing: 0.4 },
      { delay: 1, mobType: "fast", count: 15, spacing: 0.3 },
      { delay: 3, mobType: "tank", count: 8, spacing: 0.7 },
      { delay: 5, mobType: "flying", count: 10, spacing: 0.5 },
    ],
  },
];

// Endless mode scaling configuration
export const ENDLESS_CONFIG = {
  // Base scaling factors per wave (multiplicative)
  mobHpScale: 1.15, // 15% HP increase per wave
  mobArmorScale: 1.08, // 8% armor increase per wave
  mobCountScale: 1.12, // 12% mob count increase per wave
  bountyScale: 1.1, // 10% bounty increase per wave

  // Special waves every N waves introduce new mechanics
  eliteWaveInterval: 5, // Every 5th wave has elite variants
  bossWaveInterval: 10, // Every 10th wave has boss mob

  // Speed scaling (caps at 2x base speed)
  speedScaleMax: 2.0,
  speedScaleRate: 0.05, // 5% speed increase per wave until max

  // Armor scaling (starts adding after wave 15)
  armorStartWave: 15,
  armorMaxIncrease: 10, // Max +10 armor at very high waves
};

// Stress test waves - many mobs with tight spacing
export const STRESS_WAVES: Wave[] = [
  {
    id: 1,
    entries: [{ delay: 0, mobType: "normal", count: 30, spacing: 0.3 }],
  },
  {
    id: 2,
    entries: [
      { delay: 0, mobType: "normal", count: 25, spacing: 0.2 },
      { delay: 2, mobType: "fast", count: 20, spacing: 0.2 },
    ],
  },
  {
    id: 3,
    entries: [
      { delay: 0, mobType: "normal", count: 40, spacing: 0.15 },
      { delay: 1, mobType: "fast", count: 30, spacing: 0.15 },
      { delay: 3, mobType: "tank", count: 10, spacing: 0.5 },
    ],
  },
  {
    id: 4,
    entries: [
      { delay: 0, mobType: "normal", count: 50, spacing: 0.1 },
      { delay: 1, mobType: "fast", count: 40, spacing: 0.1 },
      { delay: 2, mobType: "tank", count: 15, spacing: 0.3 },
    ],
  },
  {
    id: 5,
    entries: [
      { delay: 0, mobType: "normal", count: 60, spacing: 0.08 },
      { delay: 0.5, mobType: "fast", count: 50, spacing: 0.08 },
      { delay: 1, mobType: "tank", count: 20, spacing: 0.2 },
    ],
  },
];
