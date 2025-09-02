import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Tower, TowerBlueprint } from "@/engine/towers/types";
import { ArrowUp } from "lucide-react";

interface UpgradeProps {
  tower: Tower;
  canUpgrade: boolean;
  nextTierBlueprint: TowerBlueprint | null;
  handleUpgrade: () => void;
  canAffordUpgrade: boolean;
  upgradeCost: number;
}

export const Upgrade = ({
  tower,
  canUpgrade,
  nextTierBlueprint,
  handleUpgrade,
  canAffordUpgrade,
  upgradeCost,
}: UpgradeProps) => {
  if (!canUpgrade || !nextTierBlueprint) {
    return (
      <div className="text-center">
        <Badge
          variant="outline"
          className="text-muted-foreground"
          role="status"
          aria-label="Tower is at maximum tier"
        >
          Max tier reached
        </Badge>
      </div>
    );
  }

  return (
    <div>
      <h4
        className="font-semibold mb-3 flex items-center space-x-2"
        id="upgrade-title"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
        <span>Upgrade to Tier {tower.tier + 1}</span>
      </h4>

      <Card className="mb-4 border-dashed" aria-labelledby="upgrade-title">
        <CardContent className="p-3">
          <div className="text-sm mb-2">
            <div className="font-medium">{nextTierBlueprint.name}</div>
            <div className="text-xs text-muted-foreground">
              {nextTierBlueprint.description}
            </div>
          </div>

          {/* Upgrade Stats Comparison */}
          <div
            className="space-y-2 text-xs"
            role="table"
            aria-label="Upgrade comparison"
          >
            <div className="flex justify-between" role="cell">
              <span className="text-muted-foreground">Damage:</span>
              <span
                aria-label={`Damage upgrade: from ${tower.damage} to ${
                  nextTierBlueprint.stats.damage
                }, increase of ${
                  nextTierBlueprint.stats.damage - tower.damage
                }`}
              >
                {tower.damage} → {nextTierBlueprint.stats.damage}
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs"
                  aria-hidden="true"
                >
                  +{nextTierBlueprint.stats.damage - tower.damage}
                </Badge>
              </span>
            </div>
            <div className="flex justify-between" role="cell">
              <span className="text-muted-foreground">Range:</span>
              <span
                aria-label={`Range upgrade: from ${tower.range} to ${
                  nextTierBlueprint.stats.range
                } tiles, increase of ${
                  Math.round(
                    (nextTierBlueprint.stats.range - tower.range) * 10
                  ) / 10
                }`}
              >
                {tower.range} → {nextTierBlueprint.stats.range}
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs"
                  aria-hidden="true"
                >
                  +
                  {Math.round(
                    (nextTierBlueprint.stats.range - tower.range) * 10
                  ) / 10}
                </Badge>
              </span>
            </div>
            <div className="flex justify-between" role="cell">
              <span className="text-muted-foreground">Rate:</span>
              <span
                aria-label={`Rate upgrade: from ${tower.rate} to ${
                  nextTierBlueprint.stats.rate
                } shots per second, increase of ${
                  Math.round((nextTierBlueprint.stats.rate - tower.rate) * 10) /
                  10
                }`}
              >
                {tower.rate}/s → {nextTierBlueprint.stats.rate}/s
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs"
                  aria-hidden="true"
                >
                  +
                  {Math.round(
                    (nextTierBlueprint.stats.rate - tower.rate) * 10
                  ) / 10}
                </Badge>
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold" role="cell">
              <span>DPS:</span>
              <span
                aria-label={`DPS upgrade: from ${Math.round(
                  tower.damage * tower.rate
                )} to ${Math.round(
                  nextTierBlueprint.stats.damage * nextTierBlueprint.stats.rate
                )}, increase of ${Math.round(
                  nextTierBlueprint.stats.damage *
                    nextTierBlueprint.stats.rate -
                    tower.damage * tower.rate
                )}`}
              >
                {Math.round(tower.damage * tower.rate)} →{" "}
                {Math.round(
                  nextTierBlueprint.stats.damage * nextTierBlueprint.stats.rate
                )}
                <Badge className="ml-2 text-xs bg-green-500" aria-hidden="true">
                  +
                  {Math.round(
                    nextTierBlueprint.stats.damage *
                      nextTierBlueprint.stats.rate -
                      tower.damage * tower.rate
                  )}
                </Badge>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleUpgrade}
        disabled={!canAffordUpgrade}
        className="w-full"
        variant={canAffordUpgrade ? "default" : "outline"}
        aria-label={`Upgrade tower for $${upgradeCost}${
          !canAffordUpgrade ? " - Cannot afford" : ""
        }`}
        aria-describedby="upgrade-hint"
      >
        <ArrowUp className="h-4 w-4 mr-2" aria-hidden="true" />
        Upgrade (${upgradeCost})
        <span id="upgrade-hint" className="sr-only">
          Press U to upgrade with keyboard
        </span>
      </Button>
    </div>
  );
};
