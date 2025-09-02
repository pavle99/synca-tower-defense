# ADR-001: Simulation Architecture

## Context

The tower defense game requires deterministic, performant simulation of game mechanics including mob movement, projectile physics, collision detection, and tower targeting. Key requirements include:

- 60 FPS performance target on mid-range devices
- Deterministic gameplay for consistent behavior
- Smooth visual interpolation despite fixed-timestep logic
- Scalable architecture supporting 200+ active entities

## Decision

### Tick Rate

**Choice:** Fixed timestep simulation with configurable logic update intervals

**Rationale:**

- Provides deterministic, reproducible gameplay independent of frame rate
- Separates logic updates from visual rendering for consistent behavior
- Allows accumulator pattern for frame-rate independent logic
- Prevents "spiral of death" with maximum deltatime capping
- Avoids re-render storms by limiting catch-up iterations

**Key Design Decisions:**

- **Logic Updates**: Fixed interval determines when game state advances (not tied to FPS)
- **Visual Rendering**: Runs at browser refresh rate (typically 60 FPS) with interpolation
- **Deltatime Capping**: Prevents spiral of death when browser tabs are backgrounded or performance drops
- **Accumulator Pattern**: Ensures consistent simulation regardless of frame timing variations

### Collision Detection

**Choice:** Distance-based circular collision with spatial optimization

**Rationale:**

- Simple and performant for 2D tower defense
- Sufficient accuracy for gameplay requirements
- Easily optimizable with spatial partitioning if needed

**Implementation:**

- **Projectile-Mob Collision:** Circular distance check using squared distance for performance
- **Range Checking:** Pre-filter targets by bounding box before distance calculation
- **Splash Damage:** Radius-based area of effect using the same distance formula

```typescript
function checkCollision(projectile: Projectile, mob: Mob): boolean {
  const dx = projectile.pos.x - mob.pos.x;
  const dy = projectile.pos.y - mob.pos.y;
  const distanceSquared = dx * dx + dy * dy;
  const collisionRadius = 8; // Half tile size
  return distanceSquared <= (collisionRadius * collisionRadius);
}
```

**Edge Cases Handled:**
- Projectiles don't double-hit the same target
- Fast-moving projectiles use swept collision detection
- Splash damage applies falloff based on distance from epicenter

### Targeting System

**Choice:** Pluggable targeting strategies with deterministic tie-breaking

**Available Strategies:**
1. **First:** Target mob closest to base (furthest along path)
2. **Last:** Target mob furthest from base (newest spawn)
3. **Nearest:** Target mob closest to tower (Euclidean distance)
4. **Strongest:** Target mob with highest current HP
5. **Weakest:** Target mob with lowest current HP

**Rationale:**
- Provides tactical depth and player choice
- Strategies are computationally efficient
- Deterministic ordering prevents random behavior
- Easy to extend with new strategies

**Implementation:**
```typescript
type TargetingStrategy = 'first' | 'last' | 'nearest' | 'strongest' | 'weakest';

function selectTarget(tower: Tower, mobs: Mob[], strategy: TargetingStrategy): Mob | null {
  const inRange = mobs.filter(mob => isInRange(tower, mob));
  if (inRange.length === 0) return null;
  
  switch (strategy) {
    case 'first':
      return inRange.reduce((best, mob) => 
        mob.pathProgress > best.pathProgress ? mob : best
      );
    case 'nearest':
      return inRange.reduce((best, mob) => 
        distance(tower.pos, mob.pos) < distance(tower.pos, best.pos) ? mob : best
      );
    // ... other strategies
  }
}
```

**Tie-Breaking Rules:**

- When multiple targets have identical priority values, prefer the mob with the lower ID (spawned first)
- This ensures consistent, reproducible targeting behavior across game sessions

## Consequences

### Positive

- **Deterministic Gameplay:** Same inputs always produce same outputs
- **Performance:** Fixed timestep allows for predictable performance characteristics
- **Scalability:** Architecture supports optimization with spatial data structures
- **Testability:** Pure functions with predictable behavior are easily unit tested

### Negative

- **Complexity:** Fixed timestep requires accumulator pattern and interpolation
- **Memory:** Immutable state updates create garbage collection pressure
- **Precision:** Floating-point arithmetic can introduce minor inconsistencies over time

### Mitigations

- Use object pooling for frequently created/destroyed entities
- Implement render interpolation for smooth visuals between ticks
- Consider deterministic fixed-point arithmetic for critical calculations if precision issues arise

## Alternatives Considered

### Variable Timestep

- **Pros:** Simpler implementation, automatically adapts to frame rate
- **Cons:** Non-deterministic behavior, difficult to balance, performance spikes cause gameplay issues
- **Rejected:** Determinism requirement makes this unsuitable

### Higher Tick Rates (120Hz+)

- **Pros:** More precise simulation, smoother movement
- **Cons:** Doubled CPU usage, diminishing returns for tower defense genre
- **Rejected:** 60Hz provides sufficient precision for gameplay requirements

### Component-Based Entity System

- **Pros:** More flexible for complex games, better data locality
- **Cons:** Over-engineered for current scope, adds complexity without clear benefits
- **Deferred:** Simple object-oriented approach sufficient for current requirements

## Monitoring

Success will be measured by:

- Consistent 60 FPS performance with 200+ active entities
- Zero gameplay determinism bugs in testing
- Smooth visual movement despite fixed timestep
- Player satisfaction with targeting behavior