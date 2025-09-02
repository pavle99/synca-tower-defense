import { GameTowers } from "@/engine/towers/towers";
import type { TargetingStrategy, Tower } from "@/engine/towers/types";
import { useGameStore } from "@/state/tower-defense-store";
import { Target } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../../../ui/badge";
import { Separator } from "../../../../ui/separator";
import { CurrentStats } from "./components/current-stats";
import { Targeting } from "./components/targeting";
import { Upgrade } from "./components/upgrade";

interface TowerInfoProps {
  tower: Tower | null;
}

export function TowerInfo({ tower }: TowerInfoProps) {
  const { game, upgradeTower, setTowerTargeting, stressTestMode } =
    useGameStore();
  const [selectedTargeting, setSelectedTargeting] = useState<TargetingStrategy>(
    tower?.targeting || "first"
  );

  if (!tower) return null;

  const canUpgrade = GameTowers.canUpgradeTower(tower);
  const upgradeCost = GameTowers.getUpgradeCost(tower);
  const canAffordUpgrade = canUpgrade && game.state.money >= upgradeCost;

  const nextTierBlueprint = canUpgrade
    ? GameTowers.getTowerBlueprints(stressTestMode)[
        `${tower.kind}_${tower.tier + 1}`
      ]
    : null;

  const currentBlueprint =
    GameTowers.getTowerBlueprints(stressTestMode)[
      `${tower.kind}_${tower.tier}`
    ];

  const targetingOptions: { value: TargetingStrategy; label: string }[] = [
    { value: "first", label: "First" },
    { value: "last", label: "Last" },
    { value: "nearest", label: "Nearest" },
    { value: "strongest", label: "Strongest" },
    { value: "weakest", label: "Weakest" },
  ];

  const handleUpgrade = () => {
    if (canAffordUpgrade) {
      upgradeTower(tower.id);
    }
  };

  const handleTargetingChange = (targeting: TargetingStrategy) => {
    setSelectedTargeting(targeting);
    setTowerTargeting(tower.id, targeting);
  };

  return (
    <div className="space-y-6" role="dialog" aria-labelledby="tower-info-title">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5" aria-hidden="true" />
          <span className="text-lg font-semibold" id="tower-info-title">
            {currentBlueprint?.name || "Tower"}
          </span>
          <Badge variant="outline" aria-label={`Tier ${tower.tier}`}>
            Tier {tower.tier}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <CurrentStats tower={tower} />

        <Separator />

        <Targeting
          selectedTargeting={selectedTargeting}
          handleTargetingChange={handleTargetingChange}
          targetingOptions={targetingOptions}
        />

        <Separator />

        <Upgrade
          tower={tower}
          canUpgrade={canUpgrade}
          nextTierBlueprint={nextTierBlueprint}
          handleUpgrade={handleUpgrade}
          canAffordUpgrade={canAffordUpgrade}
          upgradeCost={upgradeCost}
        />
      </div>
    </div>
  );
}
