import type { Mob } from "@/engine/mobs/types";
import { describe, it, expect } from "vitest";

describe("Slow Effects System", () => {
  const createMockMob = (speed: number, slowUntil: number = 0): Mob => ({
    id: "test-mob",
    pos: { x: 5, y: 5 },
    hp: 100,
    maxHp: 100,
    speed,
    armor: 0,
    bounty: 10,
    type: "normal",
    slowUntil,
    pathProgress: 0,
    targetPathIndex: 0,
    pathId: 0,
  });

  // Helper function to calculate effective speed with slow effects
  const calculateEffectiveSpeed = (
    mob: Mob,
    currentTime: number,
    slowMultiplier: number = 0.5
  ): number => {
    const baseSpeed = mob.speed;

    // Check if slow effect is active
    if (mob.slowUntil && currentTime < mob.slowUntil) {
      // Apply slow multiplier with minimum speed cap (40% of base)
      const slowedSpeed = baseSpeed * slowMultiplier;
      const minimumSpeed = baseSpeed * 0.4; // 40% minimum as per requirements
      return Math.max(slowedSpeed, minimumSpeed);
    }

    return baseSpeed;
  };

  // Helper function to apply slow effect
  const applySlow = (mob: Mob, duration: number, currentTime: number): Mob => ({
    ...mob,
    slowUntil: currentTime + duration,
  });

  it("should apply slow effect correctly", () => {
    const mob = createMockMob(2.0); // 2.0 speed
    const currentTime = 10;
    const slowDuration = 3;

    const slowedMob = applySlow(mob, slowDuration, currentTime);
    expect(slowedMob.slowUntil).toBe(13); // 10 + 3
  });

  it("should reduce speed when slow effect is active", () => {
    const mob = createMockMob(2.0, 15); // Slow until time 15
    const currentTime = 10; // Before slow expires

    const effectiveSpeed = calculateEffectiveSpeed(mob, currentTime, 0.5);
    expect(effectiveSpeed).toBe(1.0); // 2.0 * 0.5 = 1.0
  });

  it("should return normal speed when slow effect expires", () => {
    const mob = createMockMob(2.0, 15); // Slow until time 15
    const currentTime = 20; // After slow expires

    const effectiveSpeed = calculateEffectiveSpeed(mob, currentTime);
    expect(effectiveSpeed).toBe(2.0); // Normal speed
  });

  it("should enforce minimum speed cap (40% of base)", () => {
    const mob = createMockMob(2.0, 15);
    const currentTime = 10;
    const extremeSlowMultiplier = 0.1; // Would be 20% of base speed

    const effectiveSpeed = calculateEffectiveSpeed(
      mob,
      currentTime,
      extremeSlowMultiplier
    );
    expect(effectiveSpeed).toBe(0.8); // 40% of 2.0 = 0.8 (minimum cap)
  });

  it("should allow moderate slows above minimum cap", () => {
    const mob = createMockMob(2.0, 15);
    const currentTime = 10;
    const moderateSlowMultiplier = 0.6; // 60% of base speed

    const effectiveSpeed = calculateEffectiveSpeed(
      mob,
      currentTime,
      moderateSlowMultiplier
    );
    expect(effectiveSpeed).toBe(1.2); // 2.0 * 0.6 = 1.2
  });

  it("should handle multiple slow applications (stacking rules)", () => {
    // Test different stacking approaches
    const mob = createMockMob(3.0);
    const currentTime = 10;

    // First slow application
    const firstSlow = applySlow(mob, 5, currentTime); // Until time 15

    // Second slow application (should extend or refresh)
    const secondSlow = applySlow(firstSlow, 3, currentTime + 2); // Until time 15 (10+2+3)

    expect(secondSlow.slowUntil).toBe(15); // Latest slow effect
  });

  it("should work with different mob speeds", () => {
    const testCases = [
      { baseSpeed: 1.0, slowMultiplier: 0.5, expected: 0.5 },
      { baseSpeed: 1.0, slowMultiplier: 0.2, expected: 0.4 }, // Minimum cap
      { baseSpeed: 3.0, slowMultiplier: 0.3, expected: 1.2 }, // Minimum cap (40% of 3.0)
      { baseSpeed: 0.5, slowMultiplier: 0.5, expected: 0.25 }, // 50% of 0.5 (above minimum cap)
    ];

    testCases.forEach(({ baseSpeed, slowMultiplier, expected }) => {
      const mob = createMockMob(baseSpeed, 15); // Slow active
      const effectiveSpeed = calculateEffectiveSpeed(mob, 10, slowMultiplier);
      expect(effectiveSpeed).toBeCloseTo(expected, 2);
    });
  });

  it("should handle edge cases", () => {
    // No slow effect
    const normalMob = createMockMob(2.0, 0);
    expect(calculateEffectiveSpeed(normalMob, 10)).toBe(2.0);

    // Slow expired exactly at current time
    const expiredSlowMob = createMockMob(2.0, 10);
    expect(calculateEffectiveSpeed(expiredSlowMob, 10)).toBe(2.0);

    // Zero speed (edge case)
    const zeroSpeedMob = createMockMob(0, 15);
    expect(calculateEffectiveSpeed(zeroSpeedMob, 10)).toBe(0);
  });

  it("should work with frost tower effects", () => {
    // Simulate frost tower slow (3 second duration, 50% slow)
    const mob = createMockMob(1.5);
    const currentTime = 5;
    const frostSlow = applySlow(mob, 3, currentTime); // Frost effect

    expect(frostSlow.slowUntil).toBe(8); // 5 + 3

    // Check speed during effect
    const speedDuringEffect = calculateEffectiveSpeed(frostSlow, 6, 0.5);
    expect(speedDuringEffect).toBe(0.75); // 1.5 * 0.5

    // Check speed after effect expires
    const speedAfterEffect = calculateEffectiveSpeed(frostSlow, 10, 0.5);
    expect(speedAfterEffect).toBe(1.5); // Back to normal
  });
});
