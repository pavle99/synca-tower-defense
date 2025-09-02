import type { Mob } from "@/engine/mobs/types";
import { GameTargeting } from "@/engine/targeting";
import type { Tower } from "@/engine/towers/types";
import type { Vec2 } from "@/utils/vector";
import { describe, it, expect } from "vitest";

describe("Targeting System", () => {
  const createMockTower = (
    targeting: "first" | "last" | "nearest" | "strongest" | "weakest"
  ): Tower => ({
    id: "test-tower",
    tile: { x: 5, y: 5 },
    range: 3,
    rate: 1,
    damage: 10,
    lastFiredAt: 0,
    kind: "arrow",
    tier: 1,
    cost: 20,
    targeting,
  });

  const createMockMob = (
    id: string,
    pos: Vec2,
    hp: number,
    maxHp: number = hp
  ): Mob => ({
    id,
    pos,
    hp,
    maxHp,
    speed: 1,
    armor: 0,
    bounty: 10,
    type: "normal",
    slowUntil: 0,
    pathProgress: 0,
    targetPathIndex: 0,
    pathId: 0,
  });

  const towerPos: Vec2 = { x: 5, y: 5 }; // Tower position in grid coordinates

  it("should target first mob (earliest in path)", () => {
    const tower = createMockTower("first");
    const mobs: Mob[] = [
      createMockMob("mob1", { x: 4, y: 5 }, 100), // closer to spawn
      createMockMob("mob2", { x: 6, y: 5 }, 100), // further from spawn
      createMockMob("mob3", { x: 5, y: 4 }, 100), // to the side
    ];

    const target = GameTargeting.selectTarget(tower, mobs, towerPos);
    expect(target?.id).toBe("mob1");
  });

  it("should target last mob (furthest in path)", () => {
    const tower = createMockTower("last");
    const mobs: Mob[] = [
      createMockMob("mob1", { x: 4, y: 5 }, 100),
      createMockMob("mob2", { x: 6, y: 5 }, 100),
      createMockMob("mob3", { x: 5, y: 4 }, 100), // This will be last in array
    ];

    const target = GameTargeting.selectTarget(tower, mobs, towerPos);
    // The 'last' targeting simply returns the last mob in the array
    expect(target?.id).toBe("mob3");
  });

  it("should target nearest mob by distance", () => {
    const tower = createMockTower("nearest");
    const mobs: Mob[] = [
      createMockMob("mob1", { x: 4, y: 5 }, 100), // distance = 1 tile
      createMockMob("mob2", { x: 7, y: 5 }, 100), // distance = 2 tiles
      createMockMob("mob3", { x: 5, y: 5 }, 100), // distance = 0 tiles (same tile)
    ];

    const target = GameTargeting.selectTarget(tower, mobs, towerPos);
    expect(target?.id).toBe("mob3");
  });

  it("should target strongest mob (highest maxHP)", () => {
    const tower = createMockTower("strongest");
    const mobs: Mob[] = [
      createMockMob("mob1", { x: 4, y: 5 }, 50, 50),
      createMockMob("mob2", { x: 6, y: 5 }, 150, 150), // highest maxHP
      createMockMob("mob3", { x: 5, y: 4 }, 100, 100),
    ];

    const target = GameTargeting.selectTarget(tower, mobs, towerPos);
    expect(target?.id).toBe("mob2");
  });

  it("should target weakest mob (lowest HP)", () => {
    const tower = createMockTower("weakest");
    const mobs: Mob[] = [
      createMockMob("mob1", { x: 4, y: 5 }, 50), // lowest HP
      createMockMob("mob2", { x: 6, y: 5 }, 150),
      createMockMob("mob3", { x: 5, y: 4 }, 100),
    ];

    const target = GameTargeting.selectTarget(tower, mobs, towerPos);
    expect(target?.id).toBe("mob1");
  });

  it("should not target mobs outside range", () => {
    const tower = createMockTower("first");
    tower.range = 1; // Only 1 tile range
    const mobs: Mob[] = [
      createMockMob("mob1", { x: 2, y: 5 }, 100), // 3 tiles away, outside range
      createMockMob("mob2", { x: 8, y: 5 }, 100), // 3 tiles away, outside range
    ];

    const target = GameTargeting.selectTarget(tower, mobs, towerPos);
    expect(target).toBeNull();
  });

  it("should not target dead mobs", () => {
    const tower = createMockTower("first");
    const mobs: Mob[] = [
      createMockMob("mob1", { x: 4, y: 5 }, 0), // dead
      createMockMob("mob2", { x: 6, y: 5 }, -10), // also dead
    ];

    const target = GameTargeting.selectTarget(tower, mobs, towerPos);
    expect(target).toBeNull();
  });

  it("should return null when no mobs are available", () => {
    const tower = createMockTower("first");
    const mobs: Mob[] = [];

    const target = GameTargeting.selectTarget(tower, mobs, towerPos);
    expect(target).toBeNull();
  });
});
