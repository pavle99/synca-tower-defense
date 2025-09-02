import { Badge } from "@/components/ui/badge";
import type { Tower } from "@/engine/towers/types";

interface CurrentStatsProps {
  tower: Tower;
}

export const CurrentStats = ({ tower }: CurrentStatsProps) => {
  return (
    <div>
      <h4 className="font-semibold mb-3" id="current-stats-title">
        Stats
      </h4>
      <div
        className="text-sm"
        role="table"
        aria-labelledby="current-stats-title"
      >
        <div className="grid grid-cols-2 gap-3" role="row">
          <div className="flex justify-between" role="cell">
            <span className="text-muted-foreground">Damage:</span>
            <span
              className="font-semibold"
              aria-label={`Damage: ${tower.damage} points`}
            >
              {tower.damage}
            </span>
          </div>
          <div className="flex justify-between" role="cell">
            <span className="text-muted-foreground">Range:</span>
            <span
              className="font-semibold"
              aria-label={`Range: ${tower.range} tiles`}
            >
              {tower.range}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3" role="row">
          <div className="flex justify-between" role="cell">
            <span className="text-muted-foreground">Rate:</span>
            <span
              className="font-semibold"
              aria-label={`Rate: ${tower.rate} shots per second`}
            >
              {tower.rate}/s
            </span>
          </div>
          <div className="flex justify-between" role="cell">
            <span className="text-muted-foreground">DPS:</span>
            <Badge
              variant="secondary"
              className="text-xs"
              aria-label={`Damage per second: ${Math.round(
                tower.damage * tower.rate
              )} points`}
            >
              {Math.round(tower.damage * tower.rate)}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
