import { GameTowers } from "@/engine/towers/towers";
import { useGameStore } from "../../../state/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { SelectedTowerBlueprintInfo } from "./components/selected-tower-blueprint-info";
import { TowerBlueprintCard } from "./components/tower-blueprint-card";

export function BuildBar() {
  const { game, selectedTowerBlueprint, selectTowerBlueprint, stressTestMode } =
    useGameStore();

  // Get tier 1 towers for the build bar based on stress test mode
  const availableBlueprints = GameTowers.getBuildBarBlueprints(stressTestMode);

  return (
    <Card
      className="h-full max-lg:gap-0 rounded-none border-y-0 border-r-0 overflow-hidden"
      role="region"
      aria-label="Tower Selection"
    >
      <CardHeader className="pb-1 lg:pb-2">
        <CardTitle className="text-sm lg:text-lg" id="tower-arsenal-title">
          Tower Arsenal
        </CardTitle>
        <CardDescription
          className="text-xs lg:text-sm hidden lg:block"
          id="tower-arsenal-description"
        >
          Select a tower to place on the battlefield. Use keys 1, 2, 3 to select
          towers quickly.
        </CardDescription>
      </CardHeader>
      <CardContent
        className="space-y-2 max-lg:pb-2 lg:space-y-3 overflow-x-auto lg:overflow-x-visible max-lg:overflow-y-hidden"
        aria-labelledby="tower-arsenal-title"
        aria-describedby="tower-arsenal-description"
      >
        {/* Mobile: Horizontal scroll, Desktop: Vertical stack */}
        <div className="flex max-lg:py-4 lg:flex-col gap-3 lg:space-y-0">
          {availableBlueprints.map((blueprint, index) => (
            <TowerBlueprintCard
              key={index}
              index={index}
              game={game}
              blueprint={blueprint}
              selectedTowerBlueprint={selectedTowerBlueprint}
              selectTowerBlueprint={selectTowerBlueprint}
            />
          ))}

          {/* Desktop: Show selected tower inline */}
          {selectedTowerBlueprint && (
            <SelectedTowerBlueprintInfo
              selectedTowerBlueprint={selectedTowerBlueprint}
              isMobile={false}
            />
          )}
        </div>

        {/* Mobile: Show selected tower below the scroll area */}
        {selectedTowerBlueprint && (
          <SelectedTowerBlueprintInfo
            selectedTowerBlueprint={selectedTowerBlueprint}
            isMobile={true}
          />
        )}
      </CardContent>
    </Card>
  );
}
