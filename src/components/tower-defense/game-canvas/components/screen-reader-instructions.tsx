export function ScreenReaderInstructions() {
  return (
    <div id="game-instructions" className="sr-only">
      Use arrow keys to navigate the grid. Press 1, 2, or 3 to select tower
      types. Press Enter to place towers or select existing towers. Press
      Space to pause/resume. Press S to toggle speed, R to restart, W to start
      next wave. Press Escape to clear selection. When a tower is selected:
      Press U to upgrade, I for info, F/L/N/T/E to change targeting
      (First/Last/Nearest/Strongest/Weakest). These shortcuts work both on the
      canvas and in the tower info dialog.
    </div>
  );
}