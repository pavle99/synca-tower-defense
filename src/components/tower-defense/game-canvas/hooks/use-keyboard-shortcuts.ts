import { useKeyboard } from "@/hooks/use-keyboard";
import { useHelpDialog } from "@/hooks/use-help-dialog";
import { useGameStore } from "@/state/store";
import { GameTowers } from "@/engine/towers/towers";
import type { Tower } from "@/engine/towers/types";
import { Game } from "@/engine/game/game";
import type { GridNavigation } from "./use-grid-navigation";
import { KEYBOARD_SHORTCUTS } from "@/constants/keyboard-shortcuts";
import type { FocusedElement } from "@/type/focused-element";

interface KeyboardShortcut {
  key: string;
  handler: () => void;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsProps {
  focusedElement: FocusedElement | null;
  gridNavigation: GridNavigation;
  selectedTower: Tower | null;
  announceGameEvent: (event: string, details?: string) => void;
  announceUrgent: (message: string) => void;
}

// Global shortcuts hook
function useGlobalShortcuts(
  announceGameEvent: (event: string, details?: string) => void
) {
  const {
    game,
    isRunning,
    pauseGame,
    resumeGame,
    startGame,
    toggleSpeed,
    restartGame,
    startNextWave,
  } = useGameStore();

  const { openHelp } = useHelpDialog();

  const globalShortcuts: KeyboardShortcut[] = [
    {
      key: KEYBOARD_SHORTCUTS.HELP,
      handler: () => {
        openHelp();
        announceGameEvent("Help dialog opened");
      },
    },
    {
      key: KEYBOARD_SHORTCUTS.PAUSE,
      handler: () => {
        if (game.state.gameStatus === "paused") {
          resumeGame();
          announceGameEvent("Game resumed");
        } else if (game.state.gameStatus === "playing") {
          pauseGame();
          announceGameEvent("Game paused");
        } else if (!isRunning) {
          startGame();
          announceGameEvent("Game started");
        }
      },
    },
    {
      key: KEYBOARD_SHORTCUTS.SPEED_TOGGLE,
      handler: () => {
        if (isRunning) {
          toggleSpeed();
          announceGameEvent(
            "Speed changed",
            `${game.state.speed === 1 ? 2 : 1}x speed`
          );
        }
      },
    },
    {
      key: KEYBOARD_SHORTCUTS.RESTART,
      handler: () => {
        restartGame();
        announceGameEvent("Game restarted");
      },
    },
    {
      key: KEYBOARD_SHORTCUTS.START_WAVE,
      handler: () => {
        if (
          isRunning &&
          !game.state.waveInProgress &&
          game.state.currentWave < game.waves.length
        ) {
          const hasCountdown =
            game.state.waveCountdown !== undefined &&
            game.state.waveCountdown > 0;
          const bonus = hasCountdown
            ? Game.calculateEarlyStartBonus(game.state.waveCountdown || 0) || 0
            : 0;

          startNextWave();

          if (hasCountdown && bonus > 0) {
            announceGameEvent(
              "Wave started early",
              `Wave ${
                game.state.currentWave + 1
              } started early for ${bonus} bonus money`
            );
          } else {
            announceGameEvent(
              "Wave started",
              `Wave ${game.state.currentWave + 1}`
            );
          }
        }
      },
    },
  ];

  useKeyboard(globalShortcuts, true);
}

function useCanvasShortcuts({
  focusedElement,
  gridNavigation,
  announceGameEvent,
}: UseKeyboardShortcutsProps) {
  const { selectTowerBlueprint, stressTestMode } = useGameStore();

  const canvasShortcuts: KeyboardShortcut[] = [
    // Tower selection
    {
      key: KEYBOARD_SHORTCUTS.ARROW_TOWER,
      handler: () => {
        const blueprint = Object.values(
          GameTowers.getTowerBlueprints(stressTestMode)
        ).find((b) => b.kind === "arrow" && b.tier === 1);
        if (blueprint) {
          selectTowerBlueprint(blueprint);
          announceGameEvent("Tower selected", blueprint.name);
        }
      },
    },
    {
      key: KEYBOARD_SHORTCUTS.CANNON_TOWER,
      handler: () => {
        const blueprint = Object.values(
          GameTowers.getTowerBlueprints(stressTestMode)
        ).find((b) => b.kind === "cannon" && b.tier === 1);
        if (blueprint) {
          selectTowerBlueprint(blueprint);
          announceGameEvent("Tower selected", blueprint.name);
        }
      },
    },
    {
      key: KEYBOARD_SHORTCUTS.FROST_TOWER,
      handler: () => {
        const blueprint = Object.values(
          GameTowers.getTowerBlueprints(stressTestMode)
        ).find((b) => b.kind === "frost" && b.tier === 1);
        if (blueprint) {
          selectTowerBlueprint(blueprint);
          announceGameEvent("Tower selected", blueprint.name);
        }
      },
    },
    {
      key: KEYBOARD_SHORTCUTS.CLEAR_SELECTION,
      handler: () => {
        selectTowerBlueprint(null);
        announceGameEvent("Selection cleared");
      },
    },
    // Navigation
    {
      key: KEYBOARD_SHORTCUTS.MOVE_UP,
      handler: () => gridNavigation.movePosition("up"),
    },
    {
      key: KEYBOARD_SHORTCUTS.MOVE_DOWN,
      handler: () => gridNavigation.movePosition("down"),
    },
    {
      key: KEYBOARD_SHORTCUTS.MOVE_LEFT,
      handler: () => gridNavigation.movePosition("left"),
    },
    {
      key: KEYBOARD_SHORTCUTS.MOVE_RIGHT,
      handler: () => gridNavigation.movePosition("right"),
    },
    // Actions
    {
      key: KEYBOARD_SHORTCUTS.PLACE_TOWER,
      handler: () => gridNavigation.activatePosition(),
    },
  ];

  useKeyboard(canvasShortcuts, focusedElement === "canvas");
}

// Tower shortcuts hook
function useTowerShortcuts({
  selectedTower,
  focusedElement,
  announceGameEvent,
  announceUrgent,
}: UseKeyboardShortcutsProps) {
  const { upgradeTower, setTowerTargeting } = useGameStore();

  const towerShortcuts: KeyboardShortcut[] = [
    {
      key: KEYBOARD_SHORTCUTS.UPGRADE_TOWER,
      handler: () => {
        if (selectedTower) {
          const success = upgradeTower(selectedTower.id);
          if (success) {
            announceGameEvent(
              "Tower upgraded",
              `${selectedTower.kind} tower upgraded to tier ${
                selectedTower.tier + 1
              }`
            );
          } else {
            announceUrgent(
              "Cannot upgrade tower - insufficient funds or max tier reached"
            );
          }
        }
      },
      preventDefault: true,
    },
    {
      key: KEYBOARD_SHORTCUTS.OPEN_TOWER_INFO,
      handler: () => {
        if (selectedTower) {
          announceGameEvent("Tower information displayed");
        }
      },
      preventDefault: true,
    },
    // Targeting strategies
    {
      key: KEYBOARD_SHORTCUTS.TARGET_FIRST,
      handler: () => {
        if (selectedTower) {
          setTowerTargeting(selectedTower.id, "first");
          announceGameEvent("Targeting changed", "First enemy");
        }
      },
      preventDefault: true,
    },
    {
      key: KEYBOARD_SHORTCUTS.TARGET_LAST,
      handler: () => {
        if (selectedTower) {
          setTowerTargeting(selectedTower.id, "last");
          announceGameEvent("Targeting changed", "Last enemy");
        }
      },
      preventDefault: true,
    },
    {
      key: KEYBOARD_SHORTCUTS.TARGET_NEAREST,
      handler: () => {
        if (selectedTower) {
          setTowerTargeting(selectedTower.id, "nearest");
          announceGameEvent("Targeting changed", "Nearest enemy");
        }
      },
      preventDefault: true,
    },
    {
      key: KEYBOARD_SHORTCUTS.TARGET_STRONGEST,
      handler: () => {
        if (selectedTower) {
          setTowerTargeting(selectedTower.id, "strongest");
          announceGameEvent("Targeting changed", "Strongest enemy");
        }
      },
      preventDefault: true,
    },
    {
      key: KEYBOARD_SHORTCUTS.TARGET_WEAKEST,
      handler: () => {
        if (selectedTower) {
          setTowerTargeting(selectedTower.id, "weakest");
          announceGameEvent("Targeting changed", "Weakest enemy");
        }
      },
      preventDefault: true,
    },
  ];

  useKeyboard(towerShortcuts, focusedElement === "dialog");
}

// Main hook that uses all individual hooks
export function useKeyboardShortcuts({
  selectedTower,
  focusedElement,
  gridNavigation,
  announceGameEvent,
  announceUrgent,
}: UseKeyboardShortcutsProps) {
  useGlobalShortcuts(announceGameEvent);
  useCanvasShortcuts({
    focusedElement,
    gridNavigation,
    announceGameEvent,
    selectedTower,
    announceUrgent,
  });
  useTowerShortcuts({
    selectedTower,
    focusedElement,
    gridNavigation,
    announceGameEvent,
    announceUrgent,
  });
}
