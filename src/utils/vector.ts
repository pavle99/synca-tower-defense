export type Vec2 = { x: number; y: number };

function distance(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function normalize(v: Vec2): Vec2 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

function subtract(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

function multiply(v: Vec2, scalar: number): Vec2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

export const VectorUtils = {
  distance,
  normalize,
  add,
  subtract,
  multiply,
};
