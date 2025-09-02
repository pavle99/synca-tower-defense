import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const GameInstructions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MousePointer className="h-5 w-5" />
          How to Play
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-blue-600">Objective</h4>
          <p className="text-sm text-muted-foreground">
            Defend your base by strategically placing towers to stop waves of
            enemies. Survive all waves to win!
          </p>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-2 text-green-600">Tower Types</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              •{" "}
              <Badge variant="outline" className="mr-2">
                Arrow
              </Badge>{" "}
              Fast, single-target attacks
            </li>
            <li>
              •{" "}
              <Badge variant="outline" className="mr-2">
                Cannon
              </Badge>{" "}
              Slow, high-damage splash attacks
            </li>
            <li>
              •{" "}
              <Badge variant="outline" className="mr-2">
                Frost
              </Badge>{" "}
              Slows enemies with ice attacks
            </li>
          </ul>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-2 text-purple-600">Strategy Tips</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Upgrade towers to increase their effectiveness</li>
            <li>
              • Use different targeting strategies (first, last, nearest, etc.)
            </li>
            <li>• Combine tower types for maximum efficiency</li>
            <li>• Manage your money wisely - earn more by defeating enemies</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
