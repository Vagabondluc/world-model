# 148 Multi-User Sync Contract (Real-Time)

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/135-typescript-simulation-architecture.md`, `docs/specs/30-runtime-determinism/58-state-authority-contract.md`]
- `Owns`: [`state replication protocol`, `conflict resolution logic`, `latency compensation`]
- `Writes`: [`network sync events`, `rollback commands`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/148-multi-user-sync-contract.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Purpose
Define a robust, low-latency synchronization system for multiplayer Orbis 2.0 sessions, ensuring identical simulation state across all clients using a hybrid Rollback/CRDT model.

## 1. Network Protocol: Hybrid WebRTC/WebSocket
- **Signaling**: WebSockets (via Supabase/Realtime) handle room discovery and initial handshake.
- **Data Plane**: **WebRTC DataChannels** (Unreliable/Unordered mode) transmit high-frequency sim-ticks.
- **Reliable Plane**: WebRTC Reliable mode for `Action` commitment and `RevisionId` updates.

## 2. Synchronization Strategy: Rollback & Prediction
To mask latency (target < 100ms RTT), Orbis uses **Optimistic Rollback**.

### 2.1 State Snapshots (The "Double Buffer" Link)
- The simulation maintains a 64-tick history of state snapshots in `SharedArrayBuffer` (`Buffer_A/B` from Spec 135).
- Each snapshot includes a `TickInt` and `WorldCRC32` checksum.

### 2.2 Prediction Model
- **Local Input**: Applied immediately to the local simulation.
- **Remote Prediction**: Dead-reckoning for unit movement; "Dormant" status for remote actions until verified.

### 2.3 Rollback Mechanism
- If a remote `Action` arrives with `Tick_Server < Tick_Local`:
  1. Restore the local state to `Tick_Server`.
  2. Inject the remote action.
  3. Re-simulate all local actions forward to the current head tick.
- **Limit**: Max rollback depth is 30 ticks (~500ms at 60Hz visuals).

## 3. Idempotency & Exactly-Once Delivery
- **RequestId**: Every user action must include a unique `ULID` or `UUID` RequestId.
- **Deduplication**: The Sim-Worker maintains a `Map<RequestId, TickInt>` of the last 1,000 processed requests.
- **Handling**: If a duplicate `RequestId` arrives, the worker returns the cached `ActionOutcome` without re-simulating the effect.

## 4. Conflict Resolution: CRDTs for Shared Metadata
For non-tactical, eventual-consistency data (Chat, Faction Names, Trade Listings), the system uses **LWW-Element-Set** (Last-Write-Wins) CRDTs.
- **State Diffing**: Only changed bit-ranges in the `SharedArrayBuffer` are transmitted (Delta-Compression).
- **Fixed-Point Deltas**: Metric updates are transmitted as `SignedPpmInt` deltas.

## 5. Integrity & Anti-Cheat
- **Host Authority**: One client is designated the "Sim-Authority."
- **Verification**: If `Local_CRC32 != Authority_CRC32` for 3 consecutive ticks, trigger `thr_network_desync` (Reason: `990101`).
- **Recovery**: Client enters "Desync State" and requests a full state compressed snapshot via Reliable DataChannel.

## 6. Compliance Vector (v1)
Input:
- `Tick_Local = 1050`
- `Local_Action_Queue = [{tick: 1048, id: "move_a"}]`
- `Remote_Action_Arrived = {tick: 1045, id: "attack_b", type: "Ranged"}`
- `Snapshot_1045_CRC32 = 0xDEADBEEF`

Expected Output:
- Simulation rolls back to `Tick 1045`.
- `attack_b` is applied first (Phase 2 of Tactical Combat, Spec 147).
- `move_a` is re-applied at `Tick 1048`.
- `Tick_Local` returns to `1050` with updated state.
- Audit log emits `REASON_ROLLBACK_SUCCESS (990102)`.

## 7. Performance Benchmarks
- **Sync Overhead**: < 2ms per tick for state diffing.
- **Bandwidth**: < 50KB/s during active combat (using binary protocol).
- **Latency Masking**: Responsive feel up to 250ms RTT.

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
