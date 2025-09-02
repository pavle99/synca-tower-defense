import { type Vec2 } from "@/utils/vector";
import { GameGrid } from "../grid/grid";
import type { MapJSON } from "../grid/types";
import { GameMobs } from "../mobs/mobs";
import type { Mob } from "../mobs/types";
import { GameTowers } from "../towers/towers";
import type { TowerBlueprint } from "../towers/types";
import { WAVES } from "../waves/constants";
import {
  EARLY_START_BONUS_BASE,
  EARLY_START_BONUS_PER_SECOND,
} from "./constants";
import type { GameState, GameType } from "./types";
import {
  handleWaveCountdown,
  handleWaveSpawning,
  updateMobs,
  updateProjectilesAndDamage,
  updateTowers,
} from "./utils";

function createInitialGame(endlessMode: boolean = false): GameType {
  const config = {
    tickRate: 60,
    startingMoney: 100,
    startingLives: 20,
    tileSize: 32,
  };

  const grid = GameGrid.createGrid(20, 15);

  const state: GameState = {
    time: 0,
    mobs: [],
    towers: [],
    projectiles: [],
    money: config.startingMoney,
    lives: config.startingLives,
    currentWave: 0,
    waveInProgress: false,
    gameStatus: "playing",
    speed: 1,
    spawnedMobs: {},
    endlessMode,
  };

  return {
    state,
    grid,
    waves: endlessMode ? [] : WAVES, // Empty for endless mode since waves are generated dynamically
    config,
  };
}

function advanceTick(game: GameType, deltaTime: number): GameType {
  if (game.state.gameStatus !== "playing") {
    return game;
  }

  const dt = deltaTime * game.state.speed;
  const newState = { ...game.state };
  newState.time += dt;

  // Handle wave countdown
  handleWaveCountdown(game, newState, dt);

  // Handle wave spawning
  handleWaveSpawning(game, newState);

  // Update mobs
  newState.mobs = updateMobs(newState.mobs, game.grid, dt);

  // Update projectiles and apply damage
  const { projectiles, mobs } = updateProjectilesAndDamage(
    newState.projectiles,
    newState.mobs,
    dt
  );
  newState.projectiles = projectiles;
  newState.mobs = mobs;

  // Update towers (firing)
  updateTowers(
    newState.towers,
    newState.mobs,
    newState.projectiles,
    newState.time,
    game.config.tileSize
  );

  // Remove dead mobs and handle rewards/penalties
  const aliveMobs: Mob[] = [];
  let mobsReachedBase = 0;
  let bountyEarned = 0;

  for (const mob of newState.mobs) {
    if (mob.hp <= 0) {
      bountyEarned += mob.bounty;
    } else if (GameMobs.hasReachedBase(mob, game.grid)) {
      mobsReachedBase++;
    } else {
      aliveMobs.push(mob);
    }
  }

  newState.mobs = aliveMobs;
  newState.money += bountyEarned;
  newState.lives -= mobsReachedBase;

  // Check game over conditions
  if (newState.lives <= 0) {
    newState.gameStatus = "lost";
  } else if (
    !newState.endlessMode && // Only win in non-endless mode
    !newState.waveInProgress &&
    newState.currentWave >= game.waves.length &&
    newState.mobs.length === 0
  ) {
    newState.gameStatus = "won";
  }
  // In endless mode, the game continues indefinitely

  return { ...game, state: newState };
}

function calculateEarlyStartBonus(timeRemaining: number): number {
  if (timeRemaining <= 0) return 0;
  return (
    EARLY_START_BONUS_BASE +
    Math.floor(timeRemaining * EARLY_START_BONUS_PER_SECOND)
  );
}

function startNextWave(game: GameType): GameType {
  const newState = { ...game.state };

  if (newState.waveInProgress) {
    return game; // can't start next wave if one is in progress
  }

  // For endless mode, allow infinite waves. For normal mode, check wave limit
  if (!newState.endlessMode && newState.currentWave >= game.waves.length) {
    return game; // can't start next wave
  }

  // Calculate early start bonus if countdown is active
  if (newState.waveCountdown !== undefined && newState.waveCountdown > 0) {
    const bonusMoney =
      EARLY_START_BONUS_BASE +
      Math.floor(newState.waveCountdown * EARLY_START_BONUS_PER_SECOND);
    newState.money += bonusMoney;
  }

  // Clear countdown and start wave
  newState.waveCountdown = undefined;
  newState.currentWave++;
  newState.waveInProgress = true;
  newState.waveStartTime = newState.time;

  return { ...game, state: newState };
}

function placeTower(
  game: GameType,
  blueprint: TowerBlueprint,
  tile: Vec2
): GameType | null {
  if (
    !GameGrid.canBuildAt(game.grid, tile) ||
    game.state.money < blueprint.stats.cost
  ) {
    return null;
  }

  const towerId = `tower_${Date.now()}_${Math.random()}`;
  const newTower = GameTowers.createTower(blueprint, tile, towerId);

  const newState = { ...game.state };
  newState.towers = [...newState.towers, newTower];
  newState.money -= blueprint.stats.cost;

  return { ...game, state: newState };
}

function pauseGame(game: GameType): GameType {
  return { ...game, state: { ...game.state, gameStatus: "paused" } };
}

function resumeGame(game: GameType): GameType {
  return { ...game, state: { ...game.state, gameStatus: "playing" } };
}

function toggleSpeed(game: GameType): GameType {
  const newSpeed = game.state.speed === 1 ? 2 : 1;
  return { ...game, state: { ...game.state, speed: newSpeed } };
}

function createGameWithMap(
  mapData: MapJSON,
  endlessMode: boolean = false
): GameType {
  const config = {
    tickRate: 60,
    startingMoney: 100,
    startingLives: 20,
    tileSize: 32,
  };

  const grid = GameGrid.importMapFromJSON(mapData);

  const state: GameState = {
    time: 0,
    mobs: [],
    towers: [],
    projectiles: [],
    money: config.startingMoney,
    lives: config.startingLives,
    currentWave: 0,
    waveInProgress: false,
    gameStatus: "playing",
    speed: 1,
    spawnedMobs: {},
    endlessMode,
  };

  return {
    state,
    grid,
    waves: endlessMode ? [] : WAVES,
    config,
  };
}

export const Game = {
  createInitialGame,
  createGameWithMap,
  advanceTick,
  calculateEarlyStartBonus,
  startNextWave,
  placeTower,
  pauseGame,
  resumeGame,
  toggleSpeed,
};
