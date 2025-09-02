import { Trophy, Skull } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameState {
  gameStatus: "playing" | "paused" | "won" | "lost";
  money: number;
  currentWave: number;
}

interface GameOverlaysProps {
  gameState: GameState;
}

export function GameOverlays({ gameState }: GameOverlaysProps) {
  if (gameState.gameStatus === "won") {
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
        <Card className="w-96 text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Victory!
            </CardTitle>
            <CardDescription>
              You successfully defended your base!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                Final Score:{" "}
                <Badge variant="secondary">{gameState.money}</Badge>
              </div>
              <div>
                Waves Completed:{" "}
                <Badge variant="secondary">{gameState.currentWave}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState.gameStatus === "lost") {
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
        <Card className="w-96 text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Skull className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-600">Defeat!</CardTitle>
            <CardDescription>
              Your base was overrun by enemies!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                Waves Survived:{" "}
                <Badge variant="destructive">
                  {gameState.currentWave - 1}
                </Badge>
              </div>
              <div>
                Final Money:{" "}
                <Badge variant="outline">{gameState.money}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState.gameStatus === "paused") {
    return (
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-muted-foreground">
              Game Paused
            </h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}