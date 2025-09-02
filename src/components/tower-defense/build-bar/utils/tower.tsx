import { Crosshair, Target, Snowflake } from "lucide-react";

export const getTowerIcon = (kind: string) => {
  switch (kind) {
    case "arrow":
      return <Target className="h-6 w-6" />;
    case "cannon":
      return <Crosshair className="h-6 w-6" />;
    case "frost":
      return <Snowflake className="h-6 w-6" />;
    default:
      return <Target className="h-6 w-6" />;
  }
};

export const getTowerColor = (kind: string) => {
  switch (kind) {
    case "arrow":
      return "text-blue-500";
    case "cannon":
      return "text-orange-500";
    case "frost":
      return "text-cyan-500";
    default:
      return "text-gray-500";
  }
};
