import { Badge } from "@/components/ui/badge";

interface ShortcutProps {
  keys: string;
  description: string;
}

export function Shortcut({ keys, description }: ShortcutProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{description}</span>
      <Badge variant="outline" className="font-mono">
        {keys}
      </Badge>
    </div>
  );
}
