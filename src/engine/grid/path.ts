import type { GridTile } from "./types";
import type { GamePathType } from "../game/types";
import type { Vec2 } from "@/utils/vector";

function createMultiplePaths(
  width: number,
  height: number,
  tiles: GridTile[][]
): GamePathType[] {
  // Check if there are existing path tiles in the grid
  const existingPathTiles = findExistingPathTiles(tiles);

  if (existingPathTiles.length > 0) {
    // Use existing path tiles to create paths
    return createPathsFromExistingTiles(
      width,
      height,
      tiles,
      existingPathTiles
    );
  }

  // No existing path tiles, create default paths
  return createDefaultPaths(width, height, tiles);
}

function findExistingPathTiles(tiles: GridTile[][]): Vec2[] {
  const pathTiles: Vec2[] = [];
  for (let y = 0; y < tiles.length; y++) {
    for (let x = 0; x < tiles[y].length; x++) {
      if (tiles[y][x].type === "path") {
        pathTiles.push({ x, y });
      }
    }
  }
  return pathTiles;
}

function createPathsFromExistingTiles(
  width: number,
  height: number,
  tiles: GridTile[][],
  pathTiles: Vec2[]
): GamePathType[] {
  const paths: GamePathType[] = [];

  // Find connected path segments
  const pathGroups = findConnectedPathGroups(pathTiles, tiles);

  pathGroups.forEach((group, index) => {
    // Find start and end points for each path group
    const { start, end } = findPathEndpoints(group, width);

    if (start && end) {
      const pathPoints = computePath(start, end, tiles);

      paths.push({
        id: index,
        spawnPoint: start,
        basePoint: end,
        pathPoints,
        name: `Custom Path ${index + 1}`,
      });
    }
  });

  // If no valid paths were created from existing tiles, fall back to default
  if (paths.length === 0) {
    return createDefaultPaths(width, height, tiles);
  }

  return paths;
}

function findConnectedPathGroups(
  pathTiles: Vec2[],
  tiles: GridTile[][]
): Vec2[][] {
  const groups: Vec2[][] = [];
  const visited = new Set<string>();

  for (const tile of pathTiles) {
    const key = `${tile.x},${tile.y}`;
    if (visited.has(key)) continue;

    const group: Vec2[] = [];
    const queue = [tile];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentKey = `${current.x},${current.y}`;

      if (visited.has(currentKey)) continue;
      visited.add(currentKey);
      group.push(current);

      // Check neighbors
      const neighbors = [
        { x: current.x - 1, y: current.y },
        { x: current.x + 1, y: current.y },
        { x: current.x, y: current.y - 1 },
        { x: current.x, y: current.y + 1 },
      ];

      for (const neighbor of neighbors) {
        if (
          neighbor.x >= 0 &&
          neighbor.x < tiles[0].length &&
          neighbor.y >= 0 &&
          neighbor.y < tiles.length &&
          tiles[neighbor.y][neighbor.x].type === "path" &&
          !visited.has(`${neighbor.x},${neighbor.y}`)
        ) {
          queue.push(neighbor);
        }
      }
    }

    if (group.length > 0) {
      groups.push(group);
    }
  }

  return groups;
}

function findPathEndpoints(
  pathGroup: Vec2[],
  width: number
): { start: Vec2 | null; end: Vec2 | null } {
  let start: Vec2 | null = null;
  let end: Vec2 | null = null;

  // Look for tiles at the edges of the map
  for (const tile of pathGroup) {
    // Left edge (spawn point)
    if (tile.x === 0 && !start) {
      start = tile;
    }
    // Right edge (base point)
    if (tile.x === width - 1 && !end) {
      end = tile;
    }
  }

  // If no edge tiles found, use the leftmost and rightmost tiles
  if (!start || !end) {
    pathGroup.sort((a, b) => a.x - b.x);
    start = start || pathGroup[0];
    end = end || pathGroup[pathGroup.length - 1];
  }

  return { start, end };
}

function createDefaultPaths(
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
