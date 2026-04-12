
# SPEC-014: Authoritative Event Engine

**Feature:** Core Logic / Networking
**Dependencies:** SPEC-009 (Architecture Hardening), SPEC-014-TYPES (Catalog)
**Status:** Approved for Implementation

## 1. Executive Summary
Dawn of Worlds is a deterministic simulation based on an immutable sequence of **Events**. This spec defines the lifecycle, the "Event Envelope" protocol, and the performance-critical derivation logic.

## 2. Performance: Incremental Derivation
Running a full reduction on the entire log on every frame is prohibited.
1. **Incremental Patching:** The `deriveWorld()` function must keep track of the `lastProcessedId`. When a new event arrives, only that event is reduced into the existing `worldCache` Map.
2. **Invalidation:** A full re-reduction (O(N)) is only triggered if an `EVENT_REVOKE` targets an event in the historical past, or upon initial hydration.

## 3. Log Compaction (Snapshots)
To prevent memory bloat and keep startup times fast:
* **Trigger:** Every 500 events.
* **Snapshot Event:** A special `WORLD_SNAPSHOT` event is appended to the log.
* **Payload:** The entire serialized `worldCache` and AP levels.
* **Compaction:** Events prior to the snapshot are moved to "Cold Storage" (IndexedDB) and removed from the active runtime log.

## 4. The Event Envelope
Every message entering the engine must be wrapped in a standard envelope.

```typescript
interface EventEnvelope<T = any> {
  id: string;           // UUID v4
  ts: number;           // Timestamp
  playerId: string;     // Responsible Architect
  age: 1 | 2 | 3;       // Age Context
  round: number;        // Round Context
  type: string;         // Discriminator
  payload: T;           // Event data
}
```

## 5. Event Catalog
For a complete list of valid message types, see [SPEC-014-TYPES: Event Catalog](./014-event-types.md).
