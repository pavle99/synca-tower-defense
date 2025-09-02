import { Textarea } from "@/components/ui/textarea";

interface MapJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClearError?: () => void;
}

export function MapJsonEditor({
  value,
  onChange,
  onClearError,
}: MapJsonEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    onClearError?.();
  };

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">
        Map JSON Configuration
      </label>
      <Textarea
        value={value}
        onChange={handleChange}
        className="w-full h-64 font-mono"
        placeholder="Paste map JSON here..."
      />
    </div>
  );
}
