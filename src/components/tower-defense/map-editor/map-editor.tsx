import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGameStore } from "@/state/store";
import { MapIcon } from "lucide-react";
import { CopyMapButton } from "./components/copy-map-button";
import { MapJsonEditor } from "./components/map-json-editor";
import { ErrorDisplay } from "./components/error-display";
import {
  exportCurrentMap,
  parseMapData,
  copyMapToClipboard,
} from "./utils/map-json";
import { validateMapData } from "./utils/validation";

export function MapEditor() {
  const { game, loadMapFromJSON } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Pre-fill with current map when opening
      const currentMap = exportCurrentMap(game);
      setJsonInput(currentMap);
      setError(null);
    }
  };

  const handleCopyMap = async () => {
    const currentMap = exportCurrentMap(game);
    await copyMapToClipboard(currentMap);
  };

  const handleApplyMap = () => {
    try {
      const mapData = parseMapData(jsonInput);
      validateMapData(mapData);

      // Apply the map and restart the game with new map
      loadMapFromJSON(mapData);

      setError(null);
      setIsOpen(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid JSON format";
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MapIcon className="w-4 h-4 mr-2" />
          Map Editor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Map Editor</DialogTitle>
          <DialogDescription>
            Edit the current map by modifying the JSON configuration. The map
            contains three types of tiles: buildable (where towers can be
            placed), blocked (impassable), and path (where enemies walk).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <CopyMapButton onCopy={handleCopyMap} />

          <MapJsonEditor
            value={jsonInput}
            onChange={setJsonInput}
            onClearError={() => setError(null)}
          />

          {error && <ErrorDisplay error={error} />}

          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
            <strong>Tip:</strong> The JSON contains positions for buildable,
            blocked, and path tiles. Make sure your map has at least one path
            for enemies to walk on. After applying changes, the game will
            restart with the new map configuration.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApplyMap} disabled={!jsonInput.trim()}>
            Apply Map
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
