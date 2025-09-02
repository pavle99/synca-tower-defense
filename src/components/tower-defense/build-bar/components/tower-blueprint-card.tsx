import type { GameType } from "@/engine/game/types";
import type { TowerBlueprint } from "@/engine/towers/types";
import { DollarSign } from "lucide-react";
import { cn } from "../../../../utils/style-utils";
import { Badge } from "../../../ui/badge";
import { Card, CardContent } from "../../../ui/card";
import { getTowerColor, getTowerIcon } from "../utils/tower";

interface TowerBlueprintCardProps {
  index: number;
  game: GameType;
  blueprint: TowerBlueprint;
  selectedTowerBlueprint: TowerBlueprint | null;
  selectTowerBlueprint: (blueprint: TowerBlueprint | null) => void;
}

export const TowerBlueprintCard = ({
  index,
  game,
  blueprint,
  selectedTowerBlueprint,
  selectTowerBlueprint,
}: TowerBlueprintCardProps) => {
  const canAfford = game.state.money >= blueprint.stats.cost;
  const isSelected =
    selectedTowerBlueprint?.kind === blueprint.kind &&
    selectedTowerBlueprint?.tier === blueprint.tier;

  return (
    <Card
      key={`${blueprint.kind}_${blueprint.tier}`}
      className={cn(
        "cursor-pointer transition-all focus-within:ring-2 focus-within:ring-primary flex-shrink-0 w-44 lg:w-full",
        isSelected
          ? "ring-2 ring-primary bg-primary/5"
          : canAfford
          ? "hover:bg-accent"
          : "opacity-50 cursor-not-allowed"
      )}
      role="button"
      tabIndex={canAfford ? 0 : -1}
      aria-pressed={isSelected}
      aria-disabled={!canAfford}
      aria-describedby={`tower-${blueprint.kind}-desc`}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && canAfford) {
          e.preventDefault();
          selectTowerBlueprint(isSelected ? null : blueprint);
        }
      }}
    >
      <CardContent
        className="max-lg:py-0 max-lg:px-4 lg:p-4"
        onClick={() =>
          canAfford && selectTowerBlueprint(isSelected ? null : blueprint)
        }
      >
        {/* Mobile: 2 rows (icon+money, title+desc), Desktop: original layout */}
        <div className="mb-2">
          {/* Mobile: Row 1 - Icon and Money */}
          <div className="flex items-center justify-between mb-1 lg:hidden">
            <div className={getTowerColor(blueprint.kind)} aria-hidden="true">
              {getTowerIcon(blueprint.kind)}
            </div>
            <Badge
              variant={canAfford ? "secondary" : "outline"}
              className="flex items-center space-x-1"
              aria-label={`Cost: $${blueprint.stats.cost}${
                !canAfford ? " - Cannot afford" : ""
              }`}
            >
              <DollarSign className="h-3 w-3" aria-hidden="true" />
              <span>{blueprint.stats.cost}</span>
            </Badge>
          </div>

          {/* Mobile: Row 2 - Title and Description */}
          <div className="flex items-start justify-between lg:hidden">
            <h4 className="font-semibold text-sm">
              {blueprint.name}
              <span className="sr-only">
                Press {index + 1} to select quickly
              </span>
            </h4>
            <p
              className="text-xs text-muted-foreground text-right ml-2"
              id={`tower-${blueprint.kind}-desc`}
            >
              {blueprint.description}
            </p>
          </div>

          {/* Desktop: Original layout */}
          <div className="hidden lg:flex lg:items-center lg:justify-between">
            <div className="flex items-center space-x-2">
              <div className={getTowerColor(blueprint.kind)} aria-hidden="true">
                {getTowerIcon(blueprint.kind)}
              </div>
              <div>
                <h4 className="font-semibold text-sm">
                  {blueprint.name}
                  <span className="sr-only">
                    Press {index + 1} to select quickly
                  </span>
                </h4>
                <p
                  className="text-xs text-muted-foreground"
                  id={`tower-${blueprint.kind}-desc`}
                >
                  {blueprint.description}
                </p>
              </div>
            </div>
            <Badge
              variant={canAfford ? "secondary" : "outline"}
              className="flex items-center space-x-1"
              aria-label={`Cost: $${blueprint.stats.cost}${
                !canAfford ? " - Cannot afford" : ""
              }`}
            >
              <DollarSign className="h-3 w-3" aria-hidden="true" />
              <span>{blueprint.stats.cost}</span>
            </Badge>
          </div>
        </div>

        <div
          className="grid grid-cols-3 gap-2 text-xs"
          aria-label="Tower statistics"
        >
          <div className="text-center" aria-label="Damage">
            <div className="text-muted-foreground">Damage</div>
            <div
              className="font-semibold"
              aria-label={`Damage: ${blueprint.stats.damage}`}
            >
              {blueprint.stats.damage}
            </div>
          </div>
          <div className="text-center" aria-label="Rate">
            <div className="text-muted-foreground">Rate</div>
            <div
              className="font-semibold"
              aria-label={`Rate: ${blueprint.stats.rate} per second`}
            >
              {blueprint.stats.rate}/s
            </div>
          </div>
          <div className="text-center" aria-label="Range">
            <div className="text-muted-foreground">Range</div>
            <div
              className="font-semibold"
              aria-label={`Range: ${blueprint.stats.range} tiles`}
            >
              {blueprint.stats.range}
            </div>
          </div>
        </div>

        <div className="mt-2 text-center">
          <Badge
            variant="outline"
            className="text-xs"
            aria-label={`Damage per second: ${Math.round(
              blueprint.stats.damage * blueprint.stats.rate
            )}`}
          >
            DPS: {Math.round(blueprint.stats.damage * blueprint.stats.rate)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
