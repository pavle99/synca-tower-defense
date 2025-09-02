import type { TowerBlueprint } from "./types";

export const TOWER_BLUEPRINTS: Record<string, TowerBlueprint> = {
  // Arrow Tower - single target, fast attack, low damage
  arrow_1: {
    kind: "arrow",
    tier: 1,
    name: "Arrow Tower",
    description: "Fast single-target tower",
    stats: {
      cost: 20,
      range: 3,
      damage: 15,
      rate: 2, // shots per second
      projectileSpeed: 300,
    },
  },
  arrow_2: {
    kind: "arrow",
    tier: 2,
    name: "Ranger Tower",
    description: "Improved arrow tower with better range and damage",
    stats: {
      cost: 40,
      range: 4,
      damage: 25,
      rate: 2.5,
      projectileSpeed: 350,
    },
  },
  arrow_3: {
    kind: "arrow",
    tier: 3,
    name: "Sniper Tower",
    description: "Elite arrow tower with exceptional range and damage",
    stats: {
      cost: 80,
      range: 6,
      damage: 50,
      rate: 3,
      projectileSpeed: 400,
    },
  },

  // Cannon Tower - AoE splash, slow attack, high damage
  cannon_1: {
    kind: "cannon",
    tier: 1,
    name: "Cannon",
    description: "Slow but powerful splash damage tower",
    stats: {
      cost: 40,
      range: 2.5,
      damage: 40,
      rate: 0.8,
      projectileSpeed: 150,
    },
  },
  cannon_2: {
    kind: "cannon",
    tier: 2,
    name: "Heavy Cannon",
    description: "Improved cannon with larger splash radius",
    stats: {
      cost: 80,
      range: 3,
      damage: 70,
      rate: 1,
      projectileSpeed: 180,
    },
  },
  cannon_3: {
    kind: "cannon",
    tier: 3,
    name: "Artillery",
    description: "Devastating area-of-effect cannon",
    stats: {
      cost: 160,
      range: 4,
      damage: 120,
      rate: 1.2,
      projectileSpeed: 200,
    },
  },

  // Frost Tower - slow debuff
  frost_1: {
    kind: "frost",
    tier: 1,
    name: "Frost Tower",
    description: "Slows enemies with icy projectiles",
    stats: {
      cost: 30,
      range: 2.5,
      damage: 10,
      rate: 1.5,
      projectileSpeed: 250,
      effects: [{ type: "slow", duration: 3, slowMultiplier: 0.6 }],
    },
  },
  frost_2: {
    kind: "frost",
    tier: 2,
    name: "Ice Tower",
    description: "Enhanced frost tower with stronger slow effect",
    stats: {
      cost: 60,
      range: 3,
      damage: 20,
      rate: 1.8,
      projectileSpeed: 280,
      effects: [{ type: "slow", duration: 4, slowMultiplier: 0.4 }],
    },
  },
  frost_3: {
    kind: "frost",
    tier: 3,
    name: "Blizzard Tower",
    description: "Ultimate frost tower that nearly freezes enemies",
    stats: {
      cost: 120,
      range: 4,
      damage: 35,
      rate: 2,
      projectileSpeed: 320,
      effects: [{ type: "slow", duration: 5, slowMultiplier: 0.25 }],
    },
  },
};

// Stress test tower configs - faster firing rates
export const STRESS_TOWER_BLUEPRINTS: Record<string, TowerBlueprint> = {
  arrow_1: {
    kind: "arrow" as const,
    tier: 1 as const,
    name: "Rapid Arrow Tower",
    description: "Ultra-fast firing arrow tower for stress testing",
    stats: {
      cost: 10, // Cheaper so you can place more
      range: 4, // Better range
      damage: 20, // Higher damage to eventually kill high-HP mobs
      rate: 8, // 8 shots per second (4x normal)
      projectileSpeed: 200, // Slower projectiles = more in flight
    },
  },
  cannon_1: {
    kind: "cannon" as const,
    tier: 1 as const,
    name: "Rapid Cannon",
    description: "Fast-firing cannon for stress testing",
    stats: {
      cost: 20,
      range: 3,
      damage: 50,
      rate: 4, // 4 shots per second (5x normal)
      projectileSpeed: 100, // Very slow projectiles
    },
  },
  frost_1: {
    kind: "frost" as const,
    tier: 1 as const,
    name: "Rapid Frost Tower",
    description: "Fast-firing frost tower for stress testing",
    stats: {
      cost: 15,
      range: 3,
      damage: 15,
      rate: 6, // 6 shots per second (4x normal)
      projectileSpeed: 150,
      effects: [{ type: "slow" as const, duration: 3, slowMultiplier: 0.6 }],
    },
  },
};
