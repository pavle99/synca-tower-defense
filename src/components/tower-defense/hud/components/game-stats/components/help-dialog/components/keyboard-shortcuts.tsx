import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Keyboard } from "lucide-react";
import { controlSections } from "../constants/sections";
import { Separator } from "@/components/ui/separator";
import { Shortcut } from "./shortcut";

export const KeyboardShortcuts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Keyboard className="h-5 w-5" />
          Keyboard Shortcuts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {controlSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {sectionIndex > 0 && <Separator />}
            <div>
              <h4 className={`font-semibold my-4 ${section.colorClass}`}>
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.controls.map((shortcut, index) => (
                  <Shortcut key={index} {...shortcut} />
                ))}
              </div>
              {section.note && (
                <p className="text-xs text-muted-foreground mt-2">
                  {section.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
