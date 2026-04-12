# 🔒 97: Rogue Adventure Bridge (Hardened Contract)

SpecTier: Brainstorm Draft

## 1. Interface Definition
- **Inputs**:
    - `DomainId` ([`Spec 01`](../specs/00-core-foundation/01-time-clock-system.md)): Current simulation domain.
    - `VoxelState` ([`Spec 23`](../specs/60-projection-performance/23-voxel-projection.md)): 3D environmental data.
    - `ActiveActors`: List of `UnitInstanceV1` (Spec 89) within the tactical window.
- **Outputs**:
    - `LocalClockState`: High-resolution microsecond timer.
    - `VisibilityMap`: Player-facing fog-of-war data.
- **Parameters**:
    - `MAX_TACTICAL_WINDOW`: 600,000,000 us (10 Minutes OSR Turn).
    - `FOV_RADIUS`: 30 Voxels.

## 2. Mathematical Kernels

### 2.1 Octant-Based Recursive Shadowcasting
To calculate Field of View (FOV) in 3D without raycasting every voxel:
1.  Divide the volume around the actor into 8 octants.
2.  Recursively scan columns within each octant.
3.  If a `VoxelMaterial` is `Opaque`, prune the visibility cone behind it.
```text
IsVisible(V) = !Any(OpaqueVoxels between Actor and V)
```

### 2.2 Time Dilation & Sync
Turn-based actions take `DurationUs`. The bridge keeps the global sim in sync.
```text
ActorLocalTime = lastActTime + ActionDurationUs
GlobalSimAdvance = min(AllActorLocalTimes)
```
*Logic: The planetary simulation only steps once all tactical actors have reached the next 1-year boundary (EcoTick).*

### 2.3 AABB-Voxel Slide Collision
To prevent units from "tunneling" through walls at high tactical speeds:
1. **Continuous Collision Detection (CCD)**: Break `MovementVector` into sub-steps < 0.5 voxel width.
2. **Neighborhood Check**: Query 3x3x3 `VoxelState` around the actor's `AABB`.
3. **Sliding Response**: If a sub-step results in collision, calculate the **Minimum Translation Vector (MTV)**.
4. **Friction**: Apply `mulPPM(MTV, 800,000)` to the remaining movement to simulate surface friction.

## 3. Determinism & Flow
- **Evaluation Order**: Highest priority in `HighRes` mode.
- **Max Window Clause**: If a tactical encounter exceeds `MAX_TACTICAL_WINDOW`, the bridge must force-halt or escalate to a `RegimeTransition` (e.g., War Resolution).
- **Tie-Breaking**: ROT.js speed-based scheduler. Actors with identical `SpeedPPM` are sorted by `UnitId` (ascending).

## 4. Causal Attribution (The "WHY")
- **Trace Key**: `ADVENTURE_SYNC_TRACE`
- **Primary Drivers**:
    - `VISIBILITY_BLOCK`: Explains why a player cannot see a specific coordinate.
    - `TURN_DELAY`: Explains why time is paused (waiting for Actor X).

## 5. Failure Modes & Bounds
- **Saturated Result**: If more than 1,000 actors are active in one window, switch to `SwarmMode` (Aggregation by density) to preserve FPS.
- **Invalid Input**: If `DurationUs` is 0, emit `ERR_DIVIDE_BY_ZERO` (Reason 0x0003).

## Hardening Addendum (2026-02-12)
- `SpecTier`: `Brainstorm Draft`
- `Status`: `Promotion Candidate after canonical header rewrite`
- `CanonicalizationTarget`: `docs/specs/* (TBD)`
- `DeterminismNote`: `Use fixed-point/PPM conventions from runtime determinism canon before promotion.`

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm draft.

Expected:
- deterministic output for identical inputs and evaluation order.
- explicit tie-break and clamp behavior is documented before promotion.
