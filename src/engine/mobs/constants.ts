export const MOB_CONFIGS = {
  normal: {
    hp: 50,
    speed: 1.0,
    armor: 0,
    bounty: 10,
    type: "normal" as const,
  },
  fast: {
    hp: 30,
    speed: 2.0,
    armor: 0,
    bounty: 15,
    type: "fast" as const,
  },
  tank: {
    hp: 200,
    speed: 0.5,
    armor: 2,
    bounty: 25,
    type: "tank" as const,
  },
  flying: {
    hp: 80,
    speed: 1.5,
    armor: 0,
    bounty: 20,
    type: "flying" as const,
  },
};

// Stress test mob configs - higher HP so they survive longer
export const STRESS_MOB_CONFIGS = {
  normal: {
    hp: 300, // 6x normal HP
    speed: 0.8, // Slightly slower so more mobs bunch up
    armor: 0,
    bounty: 10,
    type: "normal" as const,
  },
  fast: {
    hp: 200, // Higher HP
    speed: 1.5, // Still fast but not too fast
    armor: 0,
    bounty: 15,
    type: "fast" as const,
  },
  tank: {
    hp: 800, // Very high HP
    speed: 0.3, // Very slow
    armor: 1, // Some armor
    bounty: 25,
    type: "tank" as const,
  },
};
