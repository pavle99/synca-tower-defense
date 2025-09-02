import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGameStore } from "@/state/store";
import { DollarSign, Heart, Zap } from "lucide-react";
import { getWaveProgressText } from "../../utils/wave-progress";
import { HelpDialog } from "./components/help-dialog/help-dialog";

export const GameStats = () => {
  const { game, endlessMode } = useGameStore();
  const { state } = game;

  return (
    <>
      {/* Top row: Controls + Mobile Stats */}
      <div className="flex items-center justify-between w-full lg:w-auto">
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <HelpDialog />
        </div>

        {/* Mobile Stats - shown on small screens */}
        <div
          className="flex lg:hidden items-center space-x-3"
          role="region"
          aria-label="Game Statistics"
        >
          <div className="flex items-center space-x-1">
            <DollarSign
              className="h-4 w-4 text-yellow-500"
              aria-hidden="true"
            />
            <span className="font-bold text-yellow-500">${state.money}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4 text-red-500" aria-hidden="true" />
            <span className="font-bold text-red-500">{state.lives}</span>
          </div>
          {state.waveInProgress && (
            <Badge variant="secondary" className="text-xs">
              Wave {state.currentWave}
            </Badge>
          )}
        </div>
      </div>

      {/* Desktop Stats - hidden on small screens */}
      <div
        className="hidden lg:flex items-center space-x-6"
        role="region"
        aria-label="Game Statistics"
      >
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-yellow-500" aria-hidden="true" />
          <div className="text-center">
            <div className="text-sm text-muted-foreground" id="money-label">
              Money
            </div>
            <div
              className="text-lg font-bold text-yellow-500"
              aria-labelledby="money-label"
            >
              ${state.money}
            </div>
          </div>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center space-x-2">
          <Heart className="h-4 w-4 text-red-500" aria-hidden="true" />
          <div className="text-center">
            <div className="text-sm text-muted-foreground" id="lives-label">
              Lives
            </div>
            <div
              className="text-lg font-bold text-red-500"
              aria-labelledby="lives-label"
            >
              {state.lives}
            </div>
          </div>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex flex-col items-start gap-1 justify-start text-center">
          <div className="text-sm text-muted-foreground" id="wave-label">
            Wave
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-blue-500 border-blue-500"
              aria-labelledby="wave-label"
              aria-describedby={
                state.waveInProgress ? "wave-progress" : undefined
              }
            >
              {endlessMode ? `Wave ${state.currentWave}` : `${state.currentWave} / ${game.waves.length}`}
            </Badge>
            {endlessMode && (
              <Badge variant="default" className="text-xs bg-purple-500 hover:bg-purple-600">
                Endless
              </Badge>
            )}
            {state.waveInProgress && (
              <Badge variant="secondary" className="text-xs" id="wave-progress">
                {getWaveProgressText(game, state)}
              </Badge>
            )}
          </div>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4 text-green-500" aria-hidden="true" />
          <div className="text-center">
            <div className="text-sm text-muted-foreground" id="speed-label">
              Speed
            </div>
            <Badge
              variant={state.speed === 2 ? "default" : "outline"}
              aria-labelledby="speed-label"
            >
              {state.speed}x
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
};
