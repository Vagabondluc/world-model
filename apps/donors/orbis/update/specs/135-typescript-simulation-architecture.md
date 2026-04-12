# 135 TypeScript Simulation Architecture (ECS & Workers)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/112-core-architecture-integration-map.md`, `docs/brainstorm/113-canonical-key-registry.md`]
- `Owns`: [`core simulation execution model`, `memory management strategy`]
- `Writes`: [`simulation execution contracts`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/135-typescript-simulation-architecture.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define the high-performance execution model for Orbis 2.0 using TypeScript, leveraging Entity Component System (ECS) patterns and Web Workers for massive scale.

## 1. Execution Model: Background Simulation
The simulation loop must be completely decoupled from the rendering thread.

### 1.1 Web Worker Isolation
- **Sim-Worker**: Conducts the core tick logic (Pressures, Propagation, AI, Pathfinding).
- **UI-Thread**: Handles rendering (WebGL/Canvas), input processing, and audio.
- **Communication**: Uses `SharedArrayBuffer` for zero-copy state sharing.
- **Synchronization**: Uses `Atomics.wait` and `Atomics.notify` to coordinate tick boundaries.
- **Double Buffering**: State is stored in a ping-pong buffer (`Buffer_A` and `Buffer_B`) to prevent UI tearing during Sim-Worker writes.

### 1.2 Integrity & Replay Parity
- **State Checksum**: The Sim-Worker generates a 32-bit checksum (CRC32) of the authoritative `SharedArrayBuffer` every 100 ticks.
- **Verification**: UI/Multiplayer clients compare local checksums to ensure zero drift. Mismatches trigger a full state re-sync.
- **Cross-Origin Isolation**: Deployment must enforce `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers to enable `SharedArrayBuffer`.

## 2. Memory Management: Data-Oriented Design
To support >10,000 entities (units, pops, buildings), the simulation avoids heavy Object-Oriented instances.

### 2.1 ECS Structure (bitECS Pattern)
- **Entities**: Simple numeric IDs.
- **Components**: Stored in `TypedArrays` (e.g., `Float32Array`, `Int32Array`).
- **Systems**: Pure functions that iterate over components in contiguous memory.

### 2.2 Shared State Layout
- All canonical metrics from `113` are stored in a global `SharedArrayBuffer`.
- Component data is packed to maximize CPU cache hits.

## 3. Determinism & Integrity (Hardened)
- **Temporal Tiers**: Authoritative ticks follow the **Temporal Hierarchy** (Spec 158).
- **Interleaved Execution**: Heavy T2/T3 systems (Ecological/Geological) are smeared across T0 ticks to maintain steady frame times.
- **Fixed-Point Arithmetic**: To prevent floating-point drift across browser engines, all authoritative math uses `PpmInt` (fixed-point 1,000,000 scaling).
- **Seeded PRNG**: The simulation worker uses a global seed + tick counter for all stochastic outcomes.

## 4. Performance Targets
- **Entity Limit**: Support 50,000 concurrent entities at 10Hz simulation rate.
- **Memory Footprint**: < 256MB for base simulation state.
- **Serialization Overhead**: < 1ms per tick (achieved via `SharedArrayBuffer`).

## 5. Integration Constraints
- All systems must register their component requirements in the `112` integration map.
- UI writes must be queued as `Actions` and processed at the start of the next simulation tick.

## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
