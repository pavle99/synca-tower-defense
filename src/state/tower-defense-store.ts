import { Game } from "@/engine/game/game";
import type { GameType } from "@/engine/game/types";
import { GameTowers } from "@/engine/towers/towers";
import type { TargetingStrategy, TowerBlueprint } from "@/engine/towers/types";
import type { MapJSON } from "@/engine/grid/types";
import { create } from "zustand";

interface GameStore {
  // State
  game: GameType;
  isRunning: boolean;
  selectedTowerBlueprint: TowerBlueprint | null;
  stressTestMode: boolean;
  endlessMode: boolean;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  toggleSpeed: () => void;
  tick: (deltaTime: number) => void;
  startNextWave: () => void;
  selectTowerBlueprint: (blueprint: TowerBlueprint | null) => void;
  placeTower: (x: number, y: number) => boolean;
  upgradeTower: (towerId: string) => boolean;
  setTowerTargeting: (towerId: string, targeting: TargetingStrategy) => void;
  toggleStressTestMode: () => void;
  toggleEndlessMode: () => void;
  loadMapFromJSON: (mapData: MapJSON) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: Game.createInitialGame(),
  isRunning: false,
  selectedTowerBlueprint: null,
  stressTestMode: false,
  endlessMode: false,

  startGame: () =>
    set((state) => ({
      isRunning: true,
      game: Game.startNextWave(state.game),
    })),

  pauseGame: () =>
    set((state) => ({
      game: Game.pauseGame(state.game),
      isRunning: false,
    })),

  resumeGame: () =>
    set((state) => ({
      game: Game.resumeGame(state.game),
      isRunning: true,
    })),

  restartGame: () =>
    set((state) => ({
      game: Game.createInitialGame(state.endlessMode),
      isRunning: false,
      selectedTowerBlueprint: null,
    })),

  toggleSpeed: () =>
    set((state) => ({
      game: Game.toggleSpeed(state.game),
    })),

  tick: (deltaTime: number) => {
    const { game, isRunning } = get();
    if (!isRunning || game.state.gameStatus !== "playing") return;

    set({ game: Game.advanceTick(game, deltaTime) });
  },

  startNextWave: () =>
    set((state) => ({
      game: Game.startNextWave(state.game),
    })),

  selectTowerBlueprint: (blueprint: TowerBlueprint | null) =>
    set({ selectedTowerBlueprint: blueprint }),

  placeTower: (x: number, y: number) => {
    const { game, selectedTowerBlueprint } = get();
    if (!selectedTowerBlueprint) return false;

    const newGame = Game.placeTower(game, selectedTowerBlueprint, { x, y });
    if (newGame) {
      set({ game: newGame, selectedTowerBlueprint: null });
      return true;
    }
    return false;
  },

  upgradeTower: (towerId: string) => {
    const { game } = get();
    const tower = game.state.towers.find((t) => t.id === towerId);
    if (!tower) return false;

    const upgradeCost = GameTowers.getUpgradeCost(tower);
    if (game.state.money < upgradeCost) return false;

    const upgradedTower = GameTowers.upgradeTower(tower);
    if (!upgradedTower) return false;

    const newState = { ...game.state };
    newState.towers = newState.towers.map((t) =>
      t.id === towerId ? upgradedTower : t
    );
    newState.money -= upgradeCost;

    set({ game: { ...game, state: newState } });
    return true;
  },

  setTowerTargeting: (towerId: string, targeting: TargetingStrategy) => {
    const { game } = get();
    const newState = { ...game.state };
    newState.towers = newState.towers.map((tower) =>
      tower.id === towerId ? { ...tower, targeting } : tower
    );

    set({ game: { ...game, state: newState } });
  },

  toggleStressTestMode: () =>
    set((state) => ({
      stressTestMode: !state.stressTestMode,
    })),

  toggleEndlessMode: () =>
    set((state) => ({
      endlessMode: !state.endlessMode,
      game: Game.createInitialGame(!state.endlessMode), // Restart with new mode
      isRunning: false,
      selectedTowerBlueprint: null,
    })),

  loadMapFromJSON: (mapData: MapJSON) =>
    set((state) => ({
      game: Game.createGameWithMap(mapData, state.endlessMode),
      isRunning: false,
      selectedTowerBlueprint: null,
    })),
}));
