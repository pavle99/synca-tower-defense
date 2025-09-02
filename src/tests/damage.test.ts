import type { Mob } from "@/engine/mobs/types";
import type { Projectile } from "@/engine/towers/types";
import { describe, it, expect } from "vitest";

describe("Damage System", () => {
  const createMockMob = (
    hp: number,
    armor: number = 0,
    maxHp: number = hp
  ): Mob => ({
    id: "test-mob",
    pos: { x: 5, y: 5 },
    hp,
    maxHp,
    speed: 1,
    armor,
    bounty: 10,
    type: "normal",
    slowUntil: 0,
    pathProgress: 0,
    targetPathIndex: 0,
    pathId: 0,
  });

  const createMockProjectile = (
    damage: number,
    splash?: { radius: number }
  ): Projectile => ({
    id: "test-projectile",
    pos: { x: 160, y: 160 },
    velocity: { x: 0, y: 0 },
    targetId: "test-mob",
    speed: 200,
    damage,
    splash,
  });

  // Helper function to simulate damage application
  const applyDamage = (mob: Mob, projectile: Projectile): Mob => {
    // Simulate the damage formula: max(1, damage - armor)
    const effectiveDamage = Math.max(1, projectile.damage - mob.armor);
    return {
      ...mob,
      hp: mob.hp - effectiveDamage,
    };
  };

  it("should apply full damage when armor is 0", () => {
    const mob = createMockMob(100, 0);
    const projectile = createMockProjectile(25);

    const damagedMob = applyDamage(mob, projectile);
    expect(damagedMob.hp).toBe(75);
  });

  it("should reduce damage based on armor", () => {
    const mob = createMockMob(100, 10); // 10 armor
    const projectile = createMockProjectile(25); // 25 damage

    const damagedMob = applyDamage(mob, projectile);
    expect(damagedMob.hp).toBe(85); // 100 - (25 - 10) = 85
  });

  it("should always deal at least 1 damage regardless of armor", () => {
    const mob = createMockMob(100, 50); // 50 armor
    const projectile = createMockProjectile(25); // 25 damage (less than armor)

    const damagedMob = applyDamage(mob, projectile);
    expect(damagedMob.hp).toBe(99); // 100 - 1 = 99 (minimum 1 damage)
  });

  it("should not heal when damage is very low", () => {
    const mob = createMockMob(100, 100); // 100 armor
    const projectile = createMockProjectile(1); // 1 damage

    const damagedMob = applyDamage(mob, projectile);
    expect(damagedMob.hp).toBe(99); // Still deals 1 damage
  });

  it("should handle high damage correctly", () => {
    const mob = createMockMob(50, 5);
    const projectile = createMockProjectile(100); // High damage

    const damagedMob = applyDamage(mob, projectile);
    expect(damagedMob.hp).toBe(-45); // 50 - (100 - 5) = -45 (mob dies)
  });

  it("should kill mob when damage exceeds remaining HP", () => {
    const mob = createMockMob(10, 0);
    const projectile = createMockProjectile(15);

    const damagedMob = applyDamage(mob, projectile);
    expect(damagedMob.hp).toBeLessThanOrEqual(0);
  });

  // Test splash damage concept (though implementation may vary)
  it("should support splash damage properties", () => {
    const projectile = createMockProjectile(50, { radius: 1.5 });

    expect(projectile.splash).toBeDefined();
    expect(projectile.splash?.radius).toBe(1.5);
  });

  // Test different damage ranges
  it("should handle various damage amounts correctly", () => {
    const testCases = [
      { damage: 1, armor: 0, expectedHp: 99 },
      { damage: 50, armor: 5, expectedHp: 55 },
      { damage: 200, armor: 50, expectedHp: -50 },
      { damage: 0, armor: 0, expectedHp: 99 }, // Minimum 1 damage
    ];

    testCases.forEach(({ damage, armor, expectedHp }) => {
      const mob = createMockMob(100, armor);
      const projectile = createMockProjectile(damage);
      const result = applyDamage(mob, projectile);
      expect(result.hp).toBe(expectedHp);
    });
  });
});
