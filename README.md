# synca-tower-defense

The deployed version on the web can be found at this URL: [https://synca-tower-defense.vercel.app/](https://synca-tower-defense.vercel.app/)

## 🚀 Installation

1. Clone the repository: `git clone https://github.com/pavle99/synca-tower-defense`
2. Open the project folder with VSCode (or your preferred editor) and open the integrated terminal
3. Install (or update) Node and NPM:
   - On windows, download and install the latest version of Node from [this link](https://nodejs.org/en/download/).
   - On linux, run the following commands:
     - Install curl: `sudo apt install curl`
     - Install nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`
     - Install node: `nvm install node`
     - Install npm: `nvm install-latest-npm`
4. Install **pnpm**: `npm i -g pnpm`
5. Install dependencies: `pnpm i`

## Run the project

To run the project, run the following command: `pnpm dev`
This will start the development server at `http://localhost:3000`

## Architecture

### Project Structure

The project follows a clean separation between game engine logic and UI components. Inside `engine/` you will find the core game logic indepedent of React, with each folder representing it's own module containing constants, utils, types and core logic to that module. Inside `components/tower-defense` you will find the components that consume the engine state and render the game to the screen and each folder contains a component for that part of the UI which is colocated with it's own utils, hooks, sub-components etc...

### Core Architecture Principles

#### 1. Engine/UI Separation

- **Game Engine** (`src/engine/`): Pure TypeScript with no React dependencies
- **UI Layer** (`src/components/tower-defense`): React components that consume engine state
- **Renderer** (`src/renderers/`): Imperative canvas rendering separate from React

#### 2. Fixed-Timestep Simulation

- Game logic runs at fixed intervals (configurable tick rate)
- Rendering runs at browser's refresh rate via `requestAnimationFrame`
- Smooth visual interpolation between simulation steps

#### 3. Immutable State Management

- All game state updates create new objects
- Zustand store manages React integration
- No direct mutation of game state

### Key Systems

#### Game Loop

The game uses a fixed-timestep simulation with render interpolation:

- **Simulation**: Fixed tick rate
- **Rendering**: Browser's refresh rate visual updates with smooth interpolation
- **Input**: Immediate response for UI interactions

#### Coordinate Systems

- **Grid Coordinates**: Integer tile positions (0,0 to gridWidth-1, gridHeight-1)
- **World Coordinates**: Pixel positions for rendering
- **Conversion**: Grid center = world position for smooth movement

#### Tower System

- **Blueprints**: Static configurations for each tower type/tier
- **Targeting**: Pluggable targeting strategies (first, last, nearest, etc.)
- **Upgrades**: Multi-tier system with stat scaling and cost progression

#### Combat Mechanics

- **Deterministic Targeting**: Consistent target selection rules
- **Projectile System**: Homing projectiles with collision detection
- **Damage Calculation**: `effectiveDamage = max(1, baseDamage - armor)`
- **Effects**: Status effects like slow with duration tracking

#### Wave Management

- **Spawn Control**: Timed enemy spawning with configurable delays
- **Difficulty Scaling**: Progressive stat increases across waves
- **Mob Types**: Multiple enemy archetypes (normal, fast, tank, flying)

### Performance Considerations

#### Rendering Optimization

- Canvas-based game field rendering (not DOM)
- React used only for UI/HUD components
- Efficient dirty checking to minimize re-renders

#### Memory Management

- Object pooling for frequently created/destroyed entities
- Immutable updates prevent reference leaks
- Proper cleanup of intervals and event listeners

#### Data Structures

- Typed arrays for performance-critical collections
- Spatial partitioning for collision detection
- Efficient pathfinding with A* algorithm

### Accessibility Features

- Keyboard navigation support
- Screen reader compatibility
- Focus management for interactive elements
- Reduced motion support
- High contrast visual indicators

### Testing Strategy

- Unit tests for core game mechanics
- E2E tests for a simple one-wave game flow

## 📊 Performance Analysis

All performance testing was conducted on a **4.4x weaker CPU setting** to simulate lower-end devices and ensure the game runs smoothly across various hardware configurations.

### Memory Usage Analysis

Memory usage remains stable throughout extended gameplay sessions, demonstrating effective memory management:

- **Baseline (Start)**: Initial memory footprint
- **5-minute Mark**: Memory usage during active gameplay with multiple waves
- **10-minute Mark**: Long-term memory stability verification

*Screenshots: Memory snapshots at start, 5min, and 10min marks*

### Runtime Performance

The game maintains smooth performance during intensive gameplay scenarios:

- **30-second Performance Profile**: Detailed analysis of frame timing, JavaScript execution, and rendering performance during active combat with multiple towers, enemies, and projectiles
- **Target**: 60 FPS with <50ms main thread tasks
- **Result**: Stable performance even under CPU throttling

*Screenshot: Chrome DevTools Performance tab showing 30-second gameplay profile*

### Lighthouse Audit

Comprehensive web performance audit results:

- **Performance Score**: Optimized for smooth gameplay
- **Accessibility**: Full keyboard navigation and screen reader support
- **Best Practices**: Modern web development standards
- **SEO**: Proper meta tags and structure

*Screenshot: Lighthouse audit results*

### Performance Optimizations Implemented

- Canvas-based rendering for game field (avoiding DOM manipulation)
- Fixed-timestep simulation with render interpolation
- Immutable state updates preventing memory leaks
- Efficient collision detection and pathfinding algorithms
- Object pooling for frequently created/destroyed entities