import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
      <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
      <div className="text-sm text-destructive">
        <strong>Error:</strong> {error}
      </div>
    </div>
  );
}
