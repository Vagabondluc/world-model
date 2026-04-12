
# SPEC-009: Architecture Hardening (Zod & Zustand)

**Feature:** State Management & Runtime Validation
**Dependencies:** SPEC-007 (Meta-Game)
**Status:** Approved
**Priority:** High (Pre-v1.0)

---

## 1. Executive Summary
The current architecture relies on `React.Context` + `useReducer` and manual TypeScript interfaces. While functional, this approach has limitations:
1.  **Runtime Unsafety:** Loading JSON from storage or (future) WebSockets has zero validation. `JSON.parse` is trusted blindly.
2.  **Render Performance:** The Context API triggers re-renders on all consumers whenever *any* part of the state changes. As the Event Log grows, this will cause frame drops in the UI.
3.  **Boilerplate:** The reducer pattern is verbose for simple UI states.

We will migrate to **Zod** for runtime schema validation and **Zustand** for atomic state management.

---

## 2. Zod: The Source of Truth

We will replace manual `interface` definitions in `types.ts` with Zod schemas. TypeScript types will be inferred from these schemas (`z.infer<typeof T>`).

### 2.1 Core Schemas
All game data must be validate-able.

```typescript
import { z } from 'zod';

// primitives
export const HexSchema = z.object({
  q: z.number().int(),
  r: z.number().int(),
});

// Domain Entities
export const WorldKindSchema = z.enum([
  "TERRAIN", "WATER", "REGION", "LANDMARK", 
  "RACE", "SETTLEMENT", "CULTURE_TAG", 
  "NATION", "BORDER", "TREATY", "WAR", "PROJECT", "LABEL"
]);

export const WorldObjectSchema = z.object({
  id: z.string().uuid(),
  kind: WorldKindSchema,
  name: z.string().optional(),
  hexes: z.array(HexSchema),
  attrs: z.record(z.any()),
  createdBy: z.string().optional(), // PlayerId
  createdRound: z.number().int().optional(),
  isNamed: z.boolean(),
});
```

### 2.2 Event Schemas
The Event Log is the most critical data structure. It requires strict validation to prevent corrupted save states.

```typescript
const BaseEventSchema = z.object({
  id: z.string().uuid(),
  ts: z.number(),
  playerId: z.string(),
  age: z.number().min(1).max(3),
  round: z.number().int().min(1),
  turn: z.number().int().min(1),
});

export const GameEventSchema = z.discriminatedUnion("type", [
  // World Events
  BaseEventSchema.extend({
    type: z.literal("WORLD_CREATE"),
    cost: z.number(),
    payload: z.object({
      worldId: z.string(),
      kind: WorldKindSchema,
      hexes: z.array(HexSchema).optional(),
      attrs: z.record(z.any()).optional(),
    }),
  }),
  // ... WORLD_MODIFY, WORLD_DELETE
  // ... TURN_BEGIN, TURN_END, ROUND_END, AGE_ADVANCE
  // ... EVENT_REVOKE
]);
```

### 2.3 Session Schema
Validating storage data before hydrating the store.

```typescript
export const GameSessionSchema = z.object({
  version: z.literal("0.5.0"),
  events: z.array(GameEventSchema),
  // ... config, players, etc.
});
```

---

## 3. Zustand: The State Engine

We will replace `GameContext` with a Zustand store. This allows components to subscribe only to the slices they need.

### 3.1 Store Architecture
We will use a single store with slice pattern.

```typescript
interface GameStoreState {
  // --- Data ---
  config: GameSessionConfig;
  events: GameEvent[];
  revokedEventIds: Set<string>;
  
  // --- Computed Cache ---
  // To avoid O(N) derivation on every render, we cache the derived world.
  // This is updated by the 'dispatch' action.
  worldCache: Map<string, WorldObject>; 
  
  // --- UI State ---
  activeSelection: Selection;
  previewEvent: WorldEvent | null;
  uiMode: 'DESKTOP' | 'MOBILE';
}

interface GameStoreActions {
  dispatch: (event: GameEvent) => void;
  setSelection: (sel: Selection) => void;
  setPreview: (event: WorldEvent | null) => void;
  loadSession: (json: unknown) => { success: boolean; error?: string };
}
```

### 3.2 Performance & Selectors
**Critical Rule:** `deriveWorld` is O(N) where N is the event log size. We must NOT run this inside a raw selector or component render loop.

**Strategy: Computed Store Property**
The `dispatch` action is responsible for updating the `worldCache` whenever an event is added.
1.  Push event to `events[]`.
2.  Apply incremental update to `worldCache` (faster) OR re-run `deriveWorld` (safer/easier) and update the store property.
3.  Components simply read `state.worldCache` (O(1)).

### 3.3 Middleware & Persistence
**Requirement:** We must adhere to SPEC-007 persistence rules.

1.  **Storage Engine:** Do **NOT** use the default `localStorage`. Implement a custom `StateStorage` adapter using `idb-keyval` to handle large event logs (>5MB).
2.  **Serialization:** `Map` and `Set` (used in `revokedEventIds` and `worldCache`) do not auto-serialize to JSON.
    *   Use `storage: createJSONStorage(() => idbStorage, { ... })`.
    *   Implement a `replacer/reviver` or use `partialize` to convert `Set<string>` -> `string[]` and `Map` -> `Array<[key, val]>` during save/load.
3.  **DevTools:** Enable Redux DevTools for time-travel debugging.

---

## 4. Implementation Strategy

### Phase 1: Parallel Type Migration
To avoid breaking the build immediately:
1.  Create `src/logic/schema.ts` containing Zod definitions.
2.  Update `src/types.ts` to import `z.infer` from `schema.ts` and re-export them.
    *   *Old:* `export interface Hex { q: number ... }`
    *   *New:* `export type Hex = z.infer<typeof HexSchema>;`
3.  This keeps imports in the rest of the app working (`import { Hex } from '../types'`) while switching the source of truth.

### Phase 2: Store Creation
1.  Install `zustand` and `idb-keyval`.
2.  Create `src/store/storageAdapter.ts` (IndexedDB wrapper + Map/Set serialization).
3.  Create `src/store/gameStore.ts`.
4.  Implement `dispatch` to update `worldCache` alongside `events`.

### Phase 3: Component Migration
Refactor components to use hooks instead of Context.
*   *Old:* `const { state } = useGame();`
*   *New:* `const ap = useGameStore(selectApRemaining);`

### Phase 4: Persistence Hardening
1.  Update `StartScreen` to use `GameSessionSchema.safeParse` when checking for existing saves.
2.  If save is corrupt (schema mismatch), show "Corrupted Save" dialog.

## 5. Benefits
*   **Safety:** Impossible to load an invalid save file (crashing the app).
*   **Speed:** Map interactions won't re-render the Sidebar.
*   **Scalability:** IndexedDB supports saving massive worlds that would crash LocalStorage.
