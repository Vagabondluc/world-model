
# SPEC-014-TYPES: Event Catalog

This document details every valid `GameEvent` type supported by the Dawn of Worlds engine.

## 1. Structural Events (Simulation Control)

| Type | Description | Payload Key |
| :--- | :--- | :--- |
| `TURN_BEGIN` | Signals the start of an Architect's authority. | `{ playerId: string }` |
| `TURN_END` | Signals completion of actions; triggers turn rotation. | `{ playerId: string }` |
| `ROUND_END` | Appended when the final player in a roster ends their turn. | `{ round: number }` |
| `AGE_ADVANCE` | Shifts the world's ruleset to the next era. | `{ from: Age, to: Age }` |
| `POWER_ROLL` | Records the 2d6 result used to generate AP. | `{ roll: number, bonus: number }` |

## 2. World Events (Spatial Interaction)

### `WORLD_CREATE`
Used for any new entity added to the map.
* **Payload:** 
  ```typescript
  {
    worldId: string;
    kind: WorldKind; // "RACE", "CITY", "TERRAIN", etc.
    name?: string;
    hexes: Hex[];
    attrs: Record<string, any>;
  }
  ```

### `WORLD_MODIFY`
Used to update existing entities (Expansion, Naming, Attribute shifts).
* **Payload:**
  ```typescript
  {
    worldId: string;
    patch: Array<{
      op: "set" | "unset" | "addHex" | "removeHex";
      path: string;
      value?: any;
    }>;
  }
  ```

### `WORLD_DELETE`
Used for catastrophes or the complete erasure of a feature.
* **Payload:** `{ worldId: string, reason?: string }`

## 3. QoL & Meta Events (Engine Operations)

### `EVENT_REVOKE` (The "Undo" Tombstone)
Instead of deleting an event, we revoke it.
* **Payload:** 
  ```typescript
  {
    targetEventIds: string[]; // List of IDs to ignore during derivation
    reason: string;           // e.g., "User Undo", "Conflict Resolution"
  }
  ```

### `WORLD_SNAPSHOT` (Compaction)
Used to prune the history for performance.
* **Payload:**
  ```typescript
  {
    cacheSnapshot: Map<string, WorldObject>;
    apState: Record<string, number>;
    lastEventId: string;
  }
  ```

### `DRAFT_ROLLBACK_USED`
Specific flag for House Rule compliance.
* **Payload:** `{ age: Age, timestamp: number }`

## 4. Social & Diplomacy Events

| Type | Description | Payload Key |
| :--- | :--- | :--- |
| `CHAT_MESSAGE` | A public or private diplomatic scroll. | `{ content: string, targetId?: string }` |
| `TYPING_STATUS` | Transient UI signal. | `{ isTyping: boolean }` |
| `VOTE_PROPOSAL` | Proposing an Age advance early. | `{ proposalType: string, votesRequired: number }` |
| `VOTE_CAST` | An Architect's stance on a proposal. | `{ proposalId: string, stance: "YES" | "NO" }` |
