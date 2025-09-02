import type { Vec2 } from "@/utils/vector";
import type { GameType } from "../engine/game/types";
import type { Projectile, Tower, TowerBlueprint } from "../engine/towers/types";
import { GameGrid } from "@/engine/grid/grid";
import type { Mob } from "@/engine/mobs/types";

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private highlightedTile: Vec2 | null = null;
  private pixelRatio: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D context");
    this.ctx = ctx;
  }

  render(
    game: GameType,
    hoverPos?: Vec2,
    selectedBlueprint?: TowerBlueprint
  ): void {
    const { ctx, canvas } = this;

    // Get the display dimensions (CSS size)
    const displayWidth = canvas.clientWidth;

    // Calculate tile size based on display dimensions to fill the entire visible area
    const tileSize = displayWidth / game.grid.width;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up coordinate system - scale to match the canvas internal resolution
    ctx.save();
    if (this.pixelRatio !== 1) {
      ctx.scale(this.pixelRatio, this.pixelRatio);
    }

    // Render grid
    this.renderGrid(game, tileSize);

    // Render blocked tiles
    this.renderBlockedTiles(game, tileSize);

    // Render path
    this.renderPath(game, tileSize);

    // Render towers
    for (const tower of game.state.towers) {
      this.renderTower(tower, tileSize);
    }

    // Render mobs
    for (const mob of game.state.mobs) {
      this.renderMob(mob, tileSize);
    }

    // Render projectiles
    for (const projectile of game.state.projectiles) {
      this.renderProjectile(projectile, tileSize);
    }

    // Render placement preview
    if (hoverPos && selectedBlueprint) {
      this.renderPlacementPreview(hoverPos, selectedBlueprint, game, tileSize);
    }

    // Render highlighted tile for keyboard navigation
    if (this.highlightedTile) {
      this.renderHighlightedTile(this.highlightedTile, tileSize);
    }

    ctx.restore();
  }

  private renderGrid(game: GameType, tileSize: number): void {
    const { ctx } = this;
    const { grid } = game;

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    // Draw grid lines
    for (let x = 0; x <= grid.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * tileSize, 0);
      ctx.lineTo(x * tileSize, grid.height * tileSize);
      ctx.stroke();
    }

    for (let y = 0; y <= grid.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * tileSize);
      ctx.lineTo(grid.width * tileSize, y * tileSize);
      ctx.stroke();
    }
  }

  private renderBlockedTiles(game: GameType, tileSize: number): void {
    const { ctx } = this;
    const { grid } = game;

    // Render blocked tiles as dark gray/rock-like
    ctx.fillStyle = "#4b5563"; // dark gray

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const tile = grid.tiles[y][x];
        if (tile.type === "blocked") {
          const worldX = x * tileSize;
          const worldY = y * tileSize;

          // Fill the tile
          ctx.fillRect(worldX, worldY, tileSize, tileSize);

          // Add a border for definition
          ctx.strokeStyle = "#374151"; // darker gray
          ctx.lineWidth = 2;
          ctx.strokeRect(worldX, worldY, tileSize, tileSize);

          // Add some texture pattern
          ctx.fillStyle = "#6b7280"; // lighter gray for texture
          ctx.fillRect(worldX + 4, worldY + 4, 4, 4);
          ctx.fillRect(worldX + tileSize - 8, worldY + 8, 4, 4);
          ctx.fillRect(worldX + 8, worldY + tileSize - 8, 4, 4);

          // Reset fill style
          ctx.fillStyle = "#4b5563";
        }
      }
    }
  }

  private renderPath(game: GameType, tileSize: number): void {
    const { ctx } = this;
    const { paths } = game.grid;

    // Render each path with different colors
    const pathColors = [
      "#fbbf24", // yellow/gold
      "#8b5cf6", // purple
      "#10b981", // green
      "#f59e0b", // orange
      "#ef4444", // red
    ];

    paths.forEach((path, index) => {
      if (path.pathPoints.length < 2) return;

      ctx.strokeStyle = pathColors[index % pathColors.length];
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const startWorld = GameGrid.gridToWorld(path.pathPoints[0], tileSize);
      ctx.moveTo(startWorld.x, startWorld.y);

      for (let i = 1; i < path.pathPoints.length; i++) {
        const pointWorld = GameGrid.gridToWorld(path.pathPoints[i], tileSize);
        ctx.lineTo(pointWorld.x, pointWorld.y);
      }

      ctx.stroke();

      // Render spawn and base points for each path
      this.renderSpawnBase(path.spawnPoint, "#10b981", tileSize); // green spawn
      this.renderSpawnBase(path.basePoint, "#ef4444", tileSize); // red base
    });
  }

  private renderSpawnBase(pos: Vec2, color: string, tileSize: number): void {
    const { ctx } = this;
    const worldPos = GameGrid.gridToWorld(pos, tileSize);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(worldPos.x, worldPos.y, tileSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderTower(tower: Tower, tileSize: number): void {
    const { ctx } = this;
    const worldPos = GameGrid.gridToWorld(tower.tile, tileSize);

    // Tower body
    const colors = {
      arrow: "#3b82f6", // blue
      cannon: "#f59e0b", // orange
      frost: "#06b6d4", // cyan
    };

    ctx.fillStyle = colors[tower.kind];
    ctx.beginPath();
    ctx.arc(worldPos.x, worldPos.y, tileSize * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Tower tier indicator
    ctx.fillStyle = "#ffffff";
    ctx.font = `${tileSize * 0.2}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tower.tier.toString(), worldPos.x, worldPos.y);

    // Range indicator (optional, can be toggled)
    if (tower.id === "selected") {
      // could be used for showing range on selected tower
      ctx.strokeStyle = colors[tower.kind] + "40"; // semi-transparent
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(worldPos.x, worldPos.y, tower.range * tileSize, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private renderMob(mob: Mob, tileSize: number): void {
    const { ctx } = this;

    // Convert mob position to world coordinates (mob.pos is in grid coordinates)
    const worldX = mob.pos.x * tileSize + tileSize / 2;
    const worldY = mob.pos.y * tileSize + tileSize / 2;

    // Mob body
    const colors = {
      normal: "#6b7280", // gray
      fast: "#10b981", // green
      tank: "#991b1b", // red
      flying: "#7c3aed", // purple
    };

    ctx.fillStyle = colors[mob.type];
    ctx.beginPath();
    ctx.arc(worldX, worldY, tileSize * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Health bar
    const barWidth = tileSize * 0.4;
    const barHeight = 4;
    const barX = worldX - barWidth / 2;
    const barY = worldY - tileSize * 0.3;

    // Background
    ctx.fillStyle = "#374151";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Health
    ctx.fillStyle = "#ef4444";
    const healthPercent = mob.hp / mob.maxHp;
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

    // Slow effect indicator
    if (mob.slowUntil && mob.slowUntil > 0) {
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(worldX, worldY, tileSize * 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private renderProjectile(projectile: Projectile, tileSize: number): void {
    const { ctx } = this;

    // Projectiles are created using the original 32px tile system
    // We need to scale them to match the current responsive tile size
    const scaleFactor = tileSize / 32; // 32 is the original fixed tile size
    const scaledX = projectile.pos.x * scaleFactor;
    const scaledY = projectile.pos.y * scaleFactor;

    ctx.fillStyle = "#fbbf24"; // yellow
    ctx.beginPath();
    ctx.arc(
      scaledX,
      scaledY,
      3 * scaleFactor, // Scale projectile size too
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  private renderPlacementPreview(
    hoverPos: Vec2,
    blueprint: TowerBlueprint,
    game: GameType,
    tileSize: number
  ): void {
    const { ctx } = this;
    const worldPos = GameGrid.gridToWorld(hoverPos, tileSize);

    // Check if placement is valid
    const hasMoney = game.state.money >= blueprint.stats.cost;
    const validPosition =
      hoverPos.x >= 0 &&
      hoverPos.x < game.grid.width &&
      hoverPos.y >= 0 &&
      hoverPos.y < game.grid.height;
    const buildableTile =
      validPosition && GameGrid.canBuildAt(game.grid, hoverPos);
    const noExistingTower = !game.state.towers.some(
      (tower) => tower.tile.x === hoverPos.x && tower.tile.y === hoverPos.y
    );

    const isValid = hasMoney && buildableTile && noExistingTower;

    // Render preview tower
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = isValid ? "#10b981" : "#ef4444"; // green if valid, red if not
    ctx.beginPath();
    ctx.arc(worldPos.x, worldPos.y, tileSize * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Render range preview
    ctx.strokeStyle = isValid ? "#10b98140" : "#ef444440"; // semi-transparent
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      worldPos.x,
      worldPos.y,
      blueprint.stats.range * tileSize,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  private renderHighlightedTile(pos: Vec2, tileSize: number): void {
    const { ctx } = this;
    const worldPos = GameGrid.gridToWorld(pos, tileSize);

    // Render highlight border
    ctx.strokeStyle = "#3b82f6"; // blue
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]); // dashed line
    ctx.strokeRect(
      worldPos.x - tileSize / 2,
      worldPos.y - tileSize / 2,
      tileSize,
      tileSize
    );
    ctx.setLineDash([]); // reset line dash

    // Optional: Add a subtle background highlight
    ctx.fillStyle = "#3b82f620"; // semi-transparent blue
    ctx.fillRect(
      worldPos.x - tileSize / 2,
      worldPos.y - tileSize / 2,
      tileSize,
      tileSize
    );
  }

  setHighlightedTile(pos: Vec2): void {
    this.highlightedTile = pos;
  }

  clearHighlightedTile(): void {
    this.highlightedTile = null;
  }

  setSize(width: number, height: number, pixelRatio: number = 1): void {
    this.pixelRatio = pixelRatio;

    // Set actual canvas size (internal resolution)
    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;

    // Set CSS size (display size)
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }
}
