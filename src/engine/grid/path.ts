import type { GridTile } from "./types";
import type { GamePathType } from "../game/types";
import type { Vec2 } from "@/utils/vector";

function createMultiplePaths(
  width: number,
  height: number,
  tiles: GridTile[][]
): GamePathType[] {
  const paths: GamePathType[] = [];

  // Path 1: North route (top third of map)
  const northY = Math.floor(height * 0.25);
  const northPath = createSinglePath(
    0,
    { x: 0, y: northY },
    { x: width - 1, y: northY },
    tiles,
    "North Route"
  );
  paths.push(northPath);

  // Path 2: South route (bottom third of map)
  const southY = Math.floor(height * 0.75);
  const southPath = createSinglePath(
    1,
    { x: 0, y: southY },
    { x: width - 1, y: southY },
    tiles,
    "South Route"
  );
  paths.push(southPath);

  // Path 3: Center route with a bend
  const centerPath = createBendyPath(2, width, height, tiles, "Center Route");
  paths.push(centerPath);

  return paths;
}

function createSinglePath(
  id: number,
  start: Vec2,
  end: Vec2,
  tiles: GridTile[][],
  name: string
): GamePathType {
  // Mark path tiles for straight path
  for (let x = start.x; x <= end.x; x++) {
    if (tiles[start.y] && tiles[start.y][x]) {
      tiles[start.y][x] = {
        type: "path",
        pathDirection: { x: 1, y: 0 }, // moving right
      };
    }
  }

  const pathPoints = computePath(start, end, tiles);

  return {
    id,
    spawnPoint: start,
    basePoint: end,
    pathPoints,
    name,
  };
}

function createBendyPath(
  id: number,
  width: number,
  height: number,
  tiles: GridTile[][],
  name: string
): GamePathType {
  const start = { x: 0, y: Math.floor(height / 2) };
  const end = { x: width - 1, y: Math.floor(height / 2) };

  // Create a path that goes right, then up/down, then right again
  const midX = Math.floor(width / 2);
  const bendY = Math.floor(height * 0.6); // slight bend down

  const waypoints = [
    start,
    { x: midX, y: start.y },
    { x: midX, y: bendY },
    { x: end.x, y: bendY },
    end,
  ];

  // Mark all tiles along the waypoints
  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];

    if (from.x === to.x) {
      // Vertical segment
      const minY = Math.min(from.y, to.y);
      const maxY = Math.max(from.y, to.y);
      for (let y = minY; y <= maxY; y++) {
        if (tiles[y] && tiles[y][from.x]) {
          tiles[y][from.x] = {
            type: "path",
            pathDirection: { x: 0, y: to.y > from.y ? 1 : -1 },
          };
        }
      }
    } else {
      // Horizontal segment
      const minX = Math.min(from.x, to.x);
      const maxX = Math.max(from.x, to.x);
      for (let x = minX; x <= maxX; x++) {
        if (tiles[from.y] && tiles[from.y][x]) {
          tiles[from.y][x] = {
            type: "path",
            pathDirection: { x: to.x > from.x ? 1 : -1, y: 0 },
          };
        }
      }
    }
  }

  const pathPoints = computeWaypointPath(waypoints);

  return {
    id,
    spawnPoint: start,
    basePoint: end,
    pathPoints,
    name,
  };
}

function computeWaypointPath(waypoints: Vec2[]): Vec2[] {
  const fullPath: Vec2[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];

    if (from.x === to.x) {
      // Vertical segment
      const step = to.y > from.y ? 1 : -1;
      for (let y = from.y; y !== to.y + step; y += step) {
        if (
          fullPath.length === 0 ||
          fullPath[fullPath.length - 1].x !== from.x ||
          fullPath[fullPath.length - 1].y !== y
        ) {
          fullPath.push({ x: from.x, y });
        }
      }
    } else {
      // Horizontal segment
      const step = to.x > from.x ? 1 : -1;
      for (let x = from.x; x !== to.x + step; x += step) {
        if (
          fullPath.length === 0 ||
          fullPath[fullPath.length - 1].x !== x ||
          fullPath[fullPath.length - 1].y !== from.y
        ) {
          fullPath.push({ x, y: from.y });
        }
      }
    }
  }

  return fullPath;
}

function computePath(start: Vec2, end: Vec2, tiles: GridTile[][]): Vec2[] {
  return findPathAStar(start, end, tiles);
}

type AStarNode = {
  pos: Vec2;
  g: number; // cost from start
  h: number; // heuristic to end
  f: number; // g + h
  parent?: AStarNode;
};

function findPathAStar(start: Vec2, end: Vec2, tiles: GridTile[][]): Vec2[] {
  const openSet: AStarNode[] = [];
  const closedSet = new Set<string>();

  const startNode: AStarNode = {
    pos: start,
    g: 0,
    h: manhattanDistance(start, end),
    f: manhattanDistance(start, end),
  };

  openSet.push(startNode);

  while (openSet.length > 0) {
    // Find node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;

    if (current.pos.x === end.x && current.pos.y === end.y) {
      // Found path, reconstruct it
      return reconstructPath(current);
    }

    closedSet.add(`${current.pos.x},${current.pos.y}`);

    // Check neighbors
    const neighbors = getNeighbors(current.pos, tiles);
    for (const neighborPos of neighbors) {
      const key = `${neighborPos.x},${neighborPos.y}`;
      if (closedSet.has(key)) continue;

      const g = current.g + 1;
      const h = manhattanDistance(neighborPos, end);
      const f = g + h;

      const existingNode = openSet.find(
        (node) => node.pos.x === neighborPos.x && node.pos.y === neighborPos.y
      );

      if (!existingNode) {
        openSet.push({
          pos: neighborPos,
          g,
          h,
          f,
          parent: current,
        });
      } else if (g < existingNode.g) {
        existingNode.g = g;
        existingNode.f = f;
        existingNode.parent = current;
      }
    }
  }

  // No path found, return simple fallback
  return [start, end];
}

function getNeighbors(pos: Vec2, tiles: GridTile[][]): Vec2[] {
  const neighbors: Vec2[] = [];
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 }, // right
    { x: 0, y: 1 }, // down
    { x: -1, y: 0 }, // left
  ];

  for (const dir of directions) {
    const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
    if (
      isValidPosition({ width: tiles[0].length, height: tiles.length }, newPos)
    ) {
      const tile = tiles[newPos.y][newPos.x];
      if (tile.type === "path") {
        neighbors.push(newPos);
      }
    }
  }

  return neighbors;
}

function manhattanDistance(a: Vec2, b: Vec2): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(node: AStarNode): Vec2[] {
  const path: Vec2[] = [];
  let current: AStarNode | undefined = node;

  while (current) {
    path.unshift(current.pos);
    current = current.parent;
  }

  return path;
}

function isValidPosition(
  grid: { width: number; height: number },
  pos: Vec2
): boolean {
  return pos.x >= 0 && pos.x < grid.width && pos.y >= 0 && pos.y < grid.height;
}

export const GamePath = {
  createMultiplePaths,
  isValidPosition,
};
