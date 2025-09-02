import { GameCanvas } from "./components/tower-defense/game-canvas/game-canvas";
import { BuildBar } from "./components/tower-defense/build-bar/build-bar";
import { Hud } from "./components/tower-defense/hud/hud";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="synca-tower-defense-theme">
      <div className="min-h-svh w-full bg-background mobile-container">
        <div className="min-h-svh w-full flex flex-col">
          <header className="px-4 py-2 border-b bg-card">
            <h1 className="text-2xl font-bold text-center">
              Synca Tower Defense
            </h1>
          </header>
          <Hud />

          <div className="flex flex-col lg:flex-row flex-1 min-h-0 w-full">
            <div className="h-auto border-b order-1 lg:w-80 lg:border-l lg:border-b-0 lg:order-2 lg:overflow-y-auto">
              <BuildBar />
            </div>

            <div className="flex-1 flex items-center justify-center bg-muted/30 p-1 order-2 lg:p-6 lg:order-1 min-h-0 min-w-0">
              <GameCanvas />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
