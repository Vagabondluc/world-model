# Dawn of Worlds — Donor Specification

## Identity

| Field | Value |
|---|---|
| Donor Name | Dawn of Worlds |
| Internal ID | `dawn-of-worlds` |
| Class | **real app** |
| Adapter ID | `dawn-of-worlds` (pending) |
| Manifest | not yet created |
| Source Root | `to be merged/world-builder-ui/` |
| Source Kind | TypeScript — React 19, Three.js, OGL, Zustand, Zod, Tauri 2.x, Vite |
| Canonical Lane | world-object taxonomy / multiplayer session / Age-turn system |
| Phase 7 Methodology | behavioral capture |
| Adapter Status | **unregistered** |

---

## What It Is

Dawn of Worlds is a turn-based collaborative worldbuilding game (alpha v0.5) implemented as a browser-capable React app with an optional Tauri desktop wrapper. Players act as "World Architects" (deities) spending Action Points to shape a shared world across three historical Ages — from terrain formation through racial emergence to civilization.

The project is event-sourced: all game state is derived deterministically from an append-only event log, enabling full replay and turn-scoped undo.

**This is the most formally typed game engine among all donors.** Its Zod schema surface and event system are mature; its Age II/III content and multiplayer deployment are unfinished.

---

## Application Stack

| Layer | Technology |
|---|---|
| Framework | React 19, TypeScript, Vite 6 |
| 3D / Globe | Three.js 0.182 + OGL 1.0, open-simplex-noise |
| State | Zustand 5.x |
| Schema | Zod 3.x (all core types) |
| AI | @google/genai (WorldCounselor, AI narrative) |
| Persistence | idb-keyval (IndexedDB) |
| Desktop | Tauri 2.x (optional) |
| Sub-project | `standalone-globe-project/` — separate Vite/Vitest package |
| Tests | Vitest (`src/__tests__/`) |

---

## Canonical Contribution Surface

### 1. WorldKind — 22-Value Object Taxonomy

The most comprehensive world-object classification across all donors.

```
type WorldKind =
  | "TERRAIN" | "CLIMATE" | "WATER" | "REGION" | "LANDMARK"
  | "RACE"    | "SUBRACE" | "SETTLEMENT" | "CITY" | "CULTURE_TAG"
  | "NATION"  | "BORDER"  | "TREATY" | "WAR" | "PROJECT"
  | "AVATAR"  | "ORDER"   | "ARMY"   | "EVENT" | "CATASTROPHE" | "LABEL";
```

Semantic groupings:

| Group | Values |
|---|---|
| Physical terrain | TERRAIN, CLIMATE, WATER |
| Geographic/political zones | REGION, NATION, BORDER |
| Social structures | RACE, SUBRACE, CULTURE_TAG, ORDER |
| Settlements | SETTLEMENT, CITY |
| Narrative/event | EVENT, CATASTROPHE, LABEL, PROJECT |
| Agency | AVATAR, ARMY |
| Diplomatic | TREATY, WAR |
| Special | LANDMARK |

All WorldObjects carry: `id (uuid)`, `kind (WorldKind)`, `name?`, `hexes (HexCoordinate[])`, `attrs (Record<string,any>)`, `createdBy (PlayerId)`, `createdRound`, `createdTurn`, `createdAge`, `isNamed`.

### 2. WorldObject — typed entity within a world

`WorldObject` (from `WorldObjectSchema.ts`) is the Dawn of Worlds equivalent of an `EntityRecord`. Each object is:
- Attached to one or more hex cells
- Owned by a player (creator)
- Created in a specific age/round/turn
- Carry-forward across ages via event log

Canonical mapping: `WorldObject → EntityRecord` with `world_kind = WorldKind`, `location_attachment.hex_coordinate[]`.

### 3. Age System — Three Historical Eras

| Age | Focus |
|---|---|
| 1 | Physical world formation — Terrain, Water, Climate |
| 2 | Life and race — Race, Subrace, Avatar (unimplemented) |
| 3 | Civilization — Settlement, City, Nation, Order (unimplemented) |

`Age: 1 | 2 | 3` — a Zod literal union, not an enum.

**Note:** Dawn of Worlds Ages (sequential gameplay eras numbered 1/2/3) are distinct from Mappa Imperium Eras (named world-history epochs `geography` through `events`). They model different aspects of world history and must NOT be unified.

### 4. Event System (Event-Sourced Game Engine)

All game mutations are expressed as GameEvents. Confirmed event types:

| Type | Payload |
|---|---|
| `WORLD_CREATE` | `{ worldId, kind, name?, hexes?, attrs? }` |
| `WORLD_PATCH` | `{ worldId, ops: PatchOp[] }` |
| `WORLD_MOVE` | `{ worldId, hexes }` |
| `WORLD_DESTROY` | `{ worldId }` |
| `TURN_START` | `{ playerId, ap }` |
| `TURN_END` | `{ playerId }` |
| `ROUND_ADVANCE` | `{ newRound }` |
| `AGE_ADVANCE` | `{ newAge }` |
| `COMBAT_START / COMBAT_RESOLVE` | CombatSession payload |
| `QOL_SETTINGS_CHANGE` | QolSettings delta |
| `UNDO` | `{ targetEventId }` |

`BaseEvent` fields: `id (uuid)`, `ts (Timestamp)`, `playerId`, `age (Age)`, `round (number)`, `turn (number)`.

This event schema is the most explicit append-only event model among all donors and is the strongest confirmation of the Mythforge event-source thesis.

### 5. CombatSession — Structured Combat Resolution

```typescript
type CombatSession = {
  stage: 'SETUP' | 'TACTICS' | 'ROLLING' | 'RESOLUTION' | 'CHRONICLE';
  attackerId: string;
  defenderId: string;
  attackerModifiers: CombatModifier[];
  defenderModifiers: CombatModifier[];
  rolls?: { attacker: [number, number]; defender: [number, number] };
  winner?: 'ATTACKER' | 'DEFENDER' | 'DRAW';
  consequence?: 'SCATTER' | 'OBLITERATE' | 'REPEL';
};

type CombatModifier = {
  id: string;
  label: string;
  value: number;
  type: 'AUTO' | 'USER' | 'FATIGUE';
};
```

### 6. HexCoordinate — Offset Variant

Dawn of Worlds uses `{q: number, r: number}` (offset hex). The canonical model uses cube notation `{q, r, s}` where `s = -q - r`. Adapter must derive the third axis.

### 7. Multiplayer Room Protocol (WebSocket)

`protocolTypes.ts` defines the wire protocol for multiplayer room synchronization.

**Client-to-Server (C2S):**
- `HELLO` — join room with `{room, playerId, clientVersion}`
- `PULL` — request events since sequence number
- `PUSH_EVENT` — submit a GameEvent with optional previous hash

**Server-to-Client (S2C):**
- `WELCOME` — room join confirmation with server state
- `EVENT` — single event broadcast
- `BATCH` — catchup batch of events
- `ERROR` — typed error with `ErrorDetails`

**ErrorDetails** covers: `HEX_REQUIRED`, `HEX_DEPENDENCY_MISSING`, `WORLD_DEPENDENCY_MISSING`, `AGE_FORBIDDEN`, `PROTECTED_UNTIL_END_OF_ROUND`, `AP_INSUFFICIENT`, `TURN_OWNERSHIP`, `BAD_COORDS`.

This is the only donor contributing a formal multiplayer collaboration protocol.

### 8. World Generation Parameters

```typescript
type WorldGenParams = {
  waterLevel: number;    // 0–1
  mountainDensity: number; // 0–1
  forestDensity: number;   // 0–1
  seed: number;            // integer
};
type MapSize = "SMALL" | "STANDARD" | "GRAND";
```

Canonical normalization: lowercase `small | standard | grand`.

---

## Confirmed Components

| Component | Purpose |
|---|---|
| `HexGrid.tsx` | Hex-cell rendering and interaction |
| `Galaxy.tsx` / `GlobeTestPage.tsx` | 3D globe with Three.js/OGL |
| `TimelineView.tsx` | Visual event history |
| `ActionSidebar.tsx` | AP-constrained action palette |
| `InspectorSidebar.tsx` | WorldObject forensic inspector |
| `PlayerDashboard.tsx` | Per-player AP and state tracking |
| `ChroniclerView.tsx` | AI narrative chronicle (WorldCounselor) |
| `CombatSession` (TheArena.tsx) | Structured combat resolution UI |
| `SetupWizard.tsx` | New game world configuration |
| `WhisperingGallery.tsx` | Player-to-player and spectator messaging |
| `WarScribe.tsx` | War event documentation |
| `LobbyView.tsx` | Multiplayer room entry |
| `MainView.tsx` | Primary game loop surface |
| `standalone-globe-project/` | Separate deployable globe visualization |

---

## What Is NOT Implemented (Alpha Status)

| Missing Feature | Notes |
|---|---|
| Age II / III content | RACE, SUBRACE, AVATAR, SETTLEMENT, CITY, NATION, etc. are WorldKind values but have no gameplay actions implemented |
| Multiplayer server | Protocol is defined and typed; no server implementation in this folder |
| AI WorldCounselor | `WorldCounselor.tsx` component present; @google/genai wired up; integration completeness unknown |
| `standalone-globe-project/` deployment | Sub-project has its own `package.json` and Vite config; partial implementation |

---

## Canonical Mapping Summary

| DoW Type | Maps To | Notes |
|---|---|---|
| `WorldObject` | `EntityRecord` | with `world_kind` field, `hex_coordinate` in `LocationAttachment` |
| `GameEvent` | `EventEnvelope` | strongest event-source confirmation in donor set |
| `PlayerId` | `EntityRecord` (player entity) | players are entities in the world |
| `CombatSession` | `EventEnvelope` payload | not a separate record |
| `WorldGenParams` | `WorldRecord.world_gen_params` | candidate attachment |
| `HexCoordinate {q,r}` | `HexCoordinate {q,r,s}` | adapter derives s = -q - r |
| `MapSize` | `MapSize` (lowercase) | adapter normalizes casing |
| `Age (1\|2\|3)` | `WorldTurnAttachment.age` | NOT the same as MI EraName |

---

## Registration Steps Required

1. Create `world-model/adapters/dawn-of-worlds/manifest.yaml`
2. Copy source snapshot from `to be merged/world-builder-ui/`
3. Write `world-model/adapters/dawn-of-worlds/mappings/concept-map.yaml`
4. Add `DawnOfWorlds` variant to `SpecDonor` enum (Rust + JSON schema)
5. Add `DawnOfWorlds` variant to `SourceSystem` and `DonorSystem` Rust enums
6. Register spec source TOML at `spec-sources/dawn-of-worlds.toml`
7. Add Phase 7 route `/donor/dawn-of-worlds`
8. Expand `MODEL_COMPARISON_MATRIX.md` with Dawn of Worlds row (spatial and event-source dimensions)
