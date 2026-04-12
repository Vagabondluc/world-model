# Optimization & Hardening Brainstorm: Orbis Simulation

## 1. ECS Strategy: Dual-Engine Organization
**Insight:** Archetypes are fast for iteration, but Sparse Sets are cheap for modification.
**Proposal:**
- Use **Archetypes** for "Macro Pops" and "Terrain Data" (mostly static structure, frequent iteration).
- Use **Sparse Sets** for "Active Units" and "Elite Actors" (frequent component addition/removal like status effects).
- **Optimization:** Implement "Component Dirtying" bits in the `SharedArrayBuffer` to skip processing unchanged systems.

## 2. Pathfinding: Hybrid HPA* + Flow Fields
**Insight:** A* scales poorly for 10,000+ units. Flow Fields calculate one direction map for all units moving to a shared goal.
**Proposal:**
- **HPA* (Spec 136)**: Use for long-range strategic "Inter-Sector" travel.
- **Flow Fields**: Use for "Tactical Transit" where multiple units (armies, refugees) move toward a common target (city, battle).
- **Hardening**: Add a "Wait-Free" path request queue using `Atomics` to prevent the Sim-Worker from stalling on high-volume requests.

## 3. Memory & Threading: State Snapshots & Double Buffering
**Insight:** Reading from `SharedArrayBuffer` while it's being written can cause "Rendering Tearing" (visual artifacts).
**Proposal:**
- **Double Buffering**: Maintain `State_A` and `State_B` in the `SharedArrayBuffer`. The Sim-Worker writes to one while the UI thread reads from the other. Swap at tick boundaries.
- **Checksum Invariants**: Every 100 ticks, the Sim-Worker generates an Adler-32 or CRC32 checksum of the authoritative buffer state. If a client desyncs (multiplayer), the checksum mismatch triggers a "Re-Sync" from the host.

## 4. AI & Economic Stability: Throttling & Clamping
**Insight:** Uncapped feedback loops in Leontief matrices lead to economic explosions or collapses.
**Proposal:**
- **Decision Throttling**: Only update 10% of NPC agents per tick (round-robin) unless they are in a "Crisis" state.
- **Lyapunov Clamping**: Add a "Global Damping" factor to the I-O matrix (Spec 139) that increases as the economy approaches `900,000 PPM` complexity.

## 5. Security & Integrity: Cross-Origin Isolation
**Hardening**: Formally define the mandatory HTTP headers (`COOP`, `COEP`) in the architecture spec to ensure `SharedArrayBuffer` availability.
