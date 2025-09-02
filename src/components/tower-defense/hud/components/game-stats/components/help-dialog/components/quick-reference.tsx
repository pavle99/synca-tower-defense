import { Card, CardContent } from "@/components/ui/card";

export const QuickReference = () => {
  return (
    <Card className="border-dashed border-primary/50 bg-primary/5">
      <CardContent className="p-4">
        <h4 className="font-semibold mb-2 text-center">Quick Reference</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Focus game:</span> Click canvas or Tab
            to it
          </div>
          <div>
            <span className="font-medium">Get help:</span> Press F1 or click
            Help button
          </div>
          <div>
            <span className="font-medium">Emergency pause:</span> Press Space
          </div>
          <div>
            <span className="font-medium">Quick tower select:</span> Press 1, 2,
            or 3
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
