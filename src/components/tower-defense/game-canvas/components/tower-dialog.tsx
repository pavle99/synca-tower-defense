import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Tower } from "@/engine/towers/types";
import { TowerInfo } from "./tower-info/tower-info";

interface TowerDialogProps {
  selectedTower: Tower | null;
  onOpenChange: (open: boolean) => void;
}

export function TowerDialog({ selectedTower, onOpenChange }: TowerDialogProps) {
  return (
    <Dialog
      open={!!selectedTower}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Tower Information</DialogTitle>
        </DialogHeader>
        {selectedTower && <TowerInfo tower={selectedTower} />}
      </DialogContent>
    </Dialog>
  );
}