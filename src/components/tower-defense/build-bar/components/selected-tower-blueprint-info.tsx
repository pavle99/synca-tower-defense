import type { TowerBlueprint } from "@/engine/towers/types";
import { cn } from "@/utils/style-utils";
import { Card, CardContent } from "../../../ui/card";
import { getTowerColor, getTowerIcon } from "../utils/tower";

interface SelectedTowerBlueprintInfoProps {
  selectedTowerBlueprint: TowerBlueprint;
  isMobile: boolean;
}

export const SelectedTowerBlueprintInfo = ({
  selectedTowerBlueprint,
  isMobile,
}: SelectedTowerBlueprintInfoProps) => {
  return (
    <Card
      className={cn(
        "border-dashed border-primary/50 bg-primary/5 hidden lg:block",
        isMobile && "flex lg:hidden"
      )}
      role="status"
      aria-live="polite"
      aria-label="Selected tower for placement"
    >
      <CardContent className="p-3 lg:p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div
            className={getTowerColor(selectedTowerBlueprint.kind)}
            aria-hidden="true"
          >
            {getTowerIcon(selectedTowerBlueprint.kind)}
          </div>
          <div>
            <h4 className="font-semibold">
              {selectedTowerBlueprint.name} Selected
            </h4>
            <p className="text-xs text-muted-foreground">
              {selectedTowerBlueprint.description}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Click on a buildable tile to place, or press Enter when navigating
          with keyboard
        </p>
      </CardContent>
    </Card>
  );
};
