import { useGameStore } from "@/state/store";
import { HelpCircle } from "lucide-react";
import { useHelpDialog } from "../../../../../../../hooks/use-help-dialog";
import { Button } from "../../../../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../../ui/dialog";
import { AccessibilityFeatures } from "./components/accessibility-features";
import { GameInstructions } from "./components/game-instructions";
import { KeyboardShortcuts } from "./components/keyboard-shortcuts";
import { QuickReference } from "./components/quick-reference";

export function HelpDialog() {
  const { isRunning } = useGameStore();
  const { isOpen, toggleHelp, closeHelp } = useHelpDialog();

  return (
    <Dialog open={isOpen} onOpenChange={toggleHelp}>
      {/* Portals need to be disabled when the game is running to prevent canvas flickering */}
      <DialogTrigger asChild disabled={isRunning}>
        <Button
          variant="outline"
          size="sm"
          aria-label="Open help and keyboard shortcuts (F1)"
          className="flex items-center gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[80vh] overflow-y-auto"
        aria-labelledby="help-dialog-title"
      >
        <DialogHeader>
          <DialogTitle id="help-dialog-title" className="text-xl font-bold">
            Game Help & Accessibility Guide
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Keyboard Shortcuts Section */}
          <KeyboardShortcuts />

          <AccessibilityFeatures />

          <GameInstructions />

          <QuickReference />
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={closeHelp}>Got it!</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
