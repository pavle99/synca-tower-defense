import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Game } from "@/engine/game/game";
import { useGameStore } from "@/state/tower-defense-store";
import {
  FastForward,
  Pause,
  Play,
  RotateCcw,
  Zap,
  Infinity as InfinityIcon,
} from "lucide-react";
import { MapEditor } from "../../map-editor/map-editor";

export const Controls = () => {
  const {
    game,
    isRunning,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    toggleSpeed,
    startNextWave,
    stressTestMode,
    toggleStressTestMode,
    endlessMode,
    toggleEndlessMode,
  } = useGameStore();
  const { state } = game;

  const canStartWave =
    isRunning &&
    !state.waveInProgress &&
    (endlessMode || state.currentWave < game.waves.length);
  const hasCountdown =
    state.waveCountdown !== undefined && state.waveCountdown > 0;

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="region"
      aria-label="Game Controls"
    >
      {state.gameStatus === "paused" ? (
        <Button
          onClick={resumeGame}
          variant="default"
          size="sm"
          aria-label="Resume game"
        >
          <Play className="h-4 w-4 mr-2" />
          Resume
        </Button>
      ) : !isRunning ? (
        <Button
          onClick={startGame}
          variant="default"
          size="sm"
          aria-label="Start game"
        >
          <Play className="h-4 w-4 mr-2" />
          Start
        </Button>
      ) : state.gameStatus === "playing" ? (
        <Button
          onClick={pauseGame}
          variant="secondary"
          size="sm"
          aria-label="Pause game"
        >
          <Pause className="h-4 w-4 mr-2" />
          Pause
        </Button>
      ) : null}

      {isRunning && state.gameStatus === "playing" && (
        <Button
          onClick={toggleSpeed}
          variant={state.speed === 2 ? "default" : "outline"}
          size="sm"
          aria-label={`Toggle speed (currently ${state.speed}x)`}
          data-testid="speed-toggle"
        >
          <FastForward className="h-4 w-4 mr-2" />
          {state.speed}x
        </Button>
      )}

      <Button
        onClick={toggleStressTestMode}
        variant={stressTestMode ? "destructive" : "outline"}
        size="sm"
        aria-label={`${stressTestMode ? "Disable" : "Enable"} stress test mode`}
        title="Enables high projectile count for performance testing"
      >
        <Zap className="h-4 w-4 mr-2" />
        {stressTestMode ? "Stress ON" : "Stress OFF"}
      </Button>

      <Button
        onClick={toggleEndlessMode}
        variant={endlessMode ? "default" : "outline"}
        size="sm"
        aria-label={`${endlessMode ? "Disable" : "Enable"} endless mode`}
        title="Endless mode with scaling difficulty"
        disabled={isRunning}
      >
        <InfinityIcon className="h-4 w-4 mr-2" />
        {endlessMode ? "Endless ON" : "Endless OFF"}
      </Button>

      <MapEditor />

      {isRunning && (
        <Button
          onClick={restartGame}
          variant="destructive"
          size="sm"
          aria-label="Restart game"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart
        </Button>
      )}

      {canStartWave && (
        <div className="flex items-center space-x-2">
          {hasCountdown && (
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Auto-start in</div>
              <Badge
                variant="outline"
                className="text-orange-500 border-orange-500"
              >
                {Math.ceil(state.waveCountdown || 0)}s
              </Badge>
            </div>
          )}
          <Button
            onClick={startNextWave}
            className={`${
              hasCountdown
                ? "bg-green-500 hover:bg-green-600"
                : "bg-orange-500 hover:bg-orange-600"
            } text-white font-bold`}
            size="sm"
            aria-label={`${
              hasCountdown ? "Start early for bonus: " : "Start "
            }wave ${state.currentWave + 1}`}
            aria-describedby="start-wave-hint"
          >
            {hasCountdown ? (
              <>
                Start Early (+$
                {Game.calculateEarlyStartBonus(state.waveCountdown || 0)})
              </>
            ) : (
              <>Start Wave {state.currentWave + 1}</>
            )}
            <span id="start-wave-hint" className="sr-only">
              Press W to start wave with keyboard
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};
