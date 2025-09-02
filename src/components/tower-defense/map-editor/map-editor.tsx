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
import { useGameStore } from "@/state/tower-defense-store";
import { MapIcon, WandSparkles } from "lucide-react";
import { useState } from "react";
import { CopyMapButton } from "./components/copy-map-button";
import { ErrorDisplay } from "./components/error-display";
import { MapJsonEditor } from "./components/map-json-editor";
import {
  copyMapToClipboard,
  exportCurrentMap,
  parseMapData,
} from "./utils/map-json";
import { validateMapData } from "./utils/validation";
import { usePortalStore } from "@/state/portal-store";

export function MapEditor() {
  const { game, loadMapFromJSON, isRunning } = useGameStore();

  const { openPortal, setOpenPortal } = usePortalStore();

  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    setOpenPortal(open ? "map-editor" : null);
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
      setOpenPortal(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid JSON format";
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={openPortal === "map-editor"} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={isRunning}>
        <Button variant="outline" size="sm">
          <MapIcon className="w-4 h-4 mr-2" />
          Map Editor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Map Editor</DialogTitle>
          <DialogDescription>
            Edit the current map by modifying the JSON configuration. You can
            define blocked tiles (impassable) and path tiles (where enemies
            walk). All remaining tiles will automatically be buildable (where
            towers can be placed). Custom path tiles will be used to create
            enemy routes.
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
            <div className="flex items-start gap-2">
              <WandSparkles className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <strong>Smart Map Processing:</strong> The JSON contains
                positions for blocked and path tiles only. Buildable tiles are
                automatically computed as all remaining space. Custom path tiles
                will create connected routes for enemies. If you create
                disconnected paths, they'll be automatically connected. If you
                place blocked tiles on paths, they'll be automatically removed
                to keep routes clear. If no path tiles are provided, default
                paths will be generated. After applying changes, the game will
                restart with the new map configuration.
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenPortal(null)}>
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
