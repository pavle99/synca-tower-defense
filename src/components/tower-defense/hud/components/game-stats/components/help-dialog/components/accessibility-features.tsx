import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { accessibilitySections } from "../constants/sections";
import { Separator } from "@/components/ui/separator";

export const AccessibilityFeatures = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Accessibility Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {accessibilitySections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {sectionIndex > 0 && <Separator />}
            <div>
              <h4 className={`font-semibold my-4 ${section.colorClass}`}>
                {section.title}
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {section.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
