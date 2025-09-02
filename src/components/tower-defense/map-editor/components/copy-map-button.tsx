import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyMapButtonProps {
  onCopy: () => Promise<void>;
}

export function CopyMapButton({ onCopy }: CopyMapButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        disabled={copied}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy Current Map
          </>
        )}
      </Button>
      <span className="text-sm text-muted-foreground">
        Copy the current map configuration to share or backup
      </span>
    </div>
  );
}
