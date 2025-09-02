import { Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TargetingStrategy } from "@/engine/towers/types";

interface TargetingProps {
  selectedTargeting: TargetingStrategy;
  handleTargetingChange: (targeting: TargetingStrategy) => void;
  targetingOptions: { value: TargetingStrategy; label: string }[];
}

export const Targeting = ({
  selectedTargeting,
  handleTargetingChange,
  targetingOptions,
}: TargetingProps) => {
  return (
    <div>
      <h4
        className="font-semibold mb-2 flex items-center space-x-2"
        id="targeting-title"
      >
        <Target className="h-4 w-4" aria-hidden="true" />
        <span>Targeting</span>
      </h4>
      <Select value={selectedTargeting} onValueChange={handleTargetingChange}>
        <SelectTrigger
          className="w-full"
          aria-labelledby="targeting-title"
          aria-describedby="targeting-description"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {targetingOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              aria-describedby={`targeting-${option.value}-desc`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div id="targeting-description" className="sr-only">
        Choose which enemies this tower should target first
      </div>
    </div>
  );
};
