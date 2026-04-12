# API Reference

This document provides complete type definitions, function signatures, and component props reference for Dawn of Worlds.

## Table of Contents

- [Type Definitions](#type-definitions)
- [Event Types](#event-types)
- [State Types](#state-types)
- [Component Props](#component-props)
- [Selectors](#selectors)
- [Controller Helpers](#controller-helpers)
- [Server Types](#server-types)

## Type Definitions

### Age

```ts
export type Age = 1 | 2 | 3;
```

### Player ID

```ts
export type PlayerId = string;
```

### Hex Coordinates

```ts
export type Hex = {
  q: number;  // Column coordinate
  r: number;  // Row coordinate
};
```

### World Kind

```ts
export type WorldKind =
  | "TERRAIN"
  | "WATER"
  | "REGION"
  | "LANDMARK"
  | "RACE"
  | "SETTLEMENT"
  | "CULTURE_TAG"
  | "NATION"
  | "BORDER"
  | "TREATY"
  | "WAR"
  | "PROJECT"
  | "LABEL";
```

### Validation Result

```ts
export type Validation = { ok: true } | { ok: false; reason: string };
```

### Soft Warning

```ts
export type SoftWarning = { warning: string };
```

## Event Types

### Base Event

```ts
export type BaseEvent = {
  id: string;              // Unique identifier (UUID)
  ts: number;             // Timestamp (ms since epoch)
  playerId: PlayerId;     // Who created this event
  age: 1 | 2 | 3;       // Which age
  round: number;          // Round within age
  turn: number;           // Turn within round
};
```

### World Event

```ts
export type WorldEvent =
  | (BaseEvent & {
      type: "WORLD_CREATE";
      cost: number;
      payload: {
        worldId: string;
        kind: WorldKind;
        name?: string;
        hexes?: Hex[];
        attrs?: Record<string, string | number | boolean>;
      };
    })
  | (BaseEvent & {
      type: "WORLD_MODIFY";
      cost: number;
      payload: {
        worldId: string;
        patch: Array<
          | { op: "set"; path: string; value: any }
          | { op: "unset"; path: string }
          | { op: "addHex"; hexes: Hex[] }
          | { op: "removeHex"; hexes: Hex[] }
        >;
      };
    })
  | (BaseEvent & {
      type: "WORLD_DELETE";
      cost: number;
      payload: { worldId: string };
    });
```

### Turn Event

```ts
export type TurnEvent =
  | (BaseEvent & { type: "TURN_BEGIN"; payload: { playerId: PlayerId } })
  | (BaseEvent & { type: "TURN_END"; payload: { playerId: PlayerId } })
  | (BaseEvent & { type: "ROUND_END"; payload: { round: number } })
  | (BaseEvent & {
      type: "AGE_ADVANCE";
      payload: { from: 1 | 2 | 3; to: 2 | 3 | 4 };
    });
```

### QoL Event

```ts
export type QolEvent =
  | (BaseEvent & {
      type: "EVENT_REVOKE";
      payload: { targetEventIds: string[]; reason?: string };
    })
  | (BaseEvent & {
      type: "DRAFT_ROLLBACK_USED";
      payload: { age: 1 | 2 | 3 };
    });
```

### Voting Event

```ts
export type VotingEvent =
  | (BaseEvent & {
      type: "AGE_ADVANCE_PROPOSE";
      payload: { to: 2 | 3 | 4 };
    })
  | (BaseEvent & {
      type: "AGE_ADVANCE_VOTE";
      payload: { proposalId: string; vote: "YES" | "NO" };
    });
```

### Game Event Union

```ts
export type GameEvent = WorldEvent | TurnEvent | QolEvent | VotingEvent;
```

## State Types

### World Object

```ts
export type WorldObject = {
  id: string;
  kind: WorldKind;
  name?: string;
  hexes: Hex[];
  attrs: Record<string, any>;

  // Attribution (SOFT only)
  createdBy?: PlayerId;
  createdRound?: number;
  createdTurn?: number;
  createdAge?: Age;

  // Used for protections
  isNamed: boolean;
};
```

### Game State

```ts
export type GameState = {
  settings: QolSettings;

  age: 1 | 2 | 3;
  round: number;
  turn: number;
  activePlayerId: PlayerId;

  // Event store (source of truth)
  events: GameEvent[];

  // Derived caches (optional but helpful)
  revokedEventIds: Set<string>;

  // One-time flags (draft rollback)
  draftRollbackUsedByAge: Partial<Record<Age, boolean>>;
};
```

### QoL Settings

```ts
export type QolSettings = {
  version: "qol.v1";

  // Turn / rules scaffolding
  turn: {
    apByAge: Record<Age, number>;
    minRoundsByAge: Record<Age, number>;
    requireAllPlayersActedToAdvance: boolean;
  };

  // Preview / validation UX (pure UI, no gameplay)
  ui: {
    contextFilterActions: boolean;
    showDisabledWithReasons: boolean;
    actionPreviewGhost: boolean;
    mapJumpFromTimeline: boolean;
    searchEnabled: boolean;
    showPlayerColorOverlay: boolean;
  };

  // Ownership / social guardrails (gameplay-affecting)
  social: {
    ownershipTags: "OFF" | "SOFT";
    protectedUntilEndOfRound: boolean;
    alterationCost: {
      enabled: boolean;
      modifyOthersBasePlus: number;
      modifyOthersNamedPlus: number;
      namedKinds: Array<WorldKind>;
    };
    warnings: {
      warnOnModifyingOthers: boolean;
      warnOnDeletingNamed: boolean;
    };
  };

  // Undo / draft mode (gameplay-affecting)
  safety: {
    undo: {
      mode: "OFF" | "TURN_SCOPED";
    };
    draftMode: {
      enabled: boolean;
      draftRoundCountAtAgeStart: number;
      allowOneGlobalRollbackDuringDraft: boolean;
    };
  };

  // Teaching / onboarding (UI-only)
  onboarding: {
    guidedFirstAge: boolean;
    lockComplexActionsDuringGuide: boolean;
  };

  // Export
  export: {
    includeEventLog: boolean;
    includeDerivedSnapshot: boolean;
    includeAttribution: boolean;
  };
};
```

## Component Props

### Selection Type

```ts
export type Selection =
  | { kind: "NONE" }
  | { kind: "HEX"; hex: Hex }
  | { kind: "WORLD"; worldId: string };
```

### Action Definition

```ts
export type ActionDef = {
  type: string;
  label: string;
  age: 1 | 2 | 3;
  baseCost: number;
  target: "NONE" | "HEX" | "WORLD";

  validate: (
    state: GameState,
    selection: Selection
  ) => { ok: true } | { ok: false; reason: string };

  buildEvent: (
    state: GameState,
    selection: Selection
  ) => WorldEvent;
};
```

### Action Preview

```ts
export type ActionPreview = {
  affectedHexes: Hex[];
  worldObjectsCreated?: WorldKind[];
  cost: number;
  warnings?: string[];
};
```

### Inspector Target

```ts
export type InspectorTarget =
  | { kind: "HEX"; hex: Hex }
  | { kind: "WORLD"; worldId: string }
  | { kind: "EVENT"; eventId: string };
```

### Inspector Props

```ts
export type InspectorProps = {
  state: GameState;
  target: InspectorTarget | null;

  onFocusHex(hex: Hex): void;
  onFocusWorld(worldId: string): void;
  onFocusEvent(eventId: string): void;
};
```

### World Inspector Props

```ts
export type WorldInspectorProps = {
  state: GameState;
  worldId: string;

  onFocusHex(hex: { q: number; r: number }): void;
  onFocusEvent(eventId: string): void;
};
```

### Action Palette Props

```ts
export type ActionPaletteProps = {
  legalActions: {
    action: ActionDef;
    enabled: boolean;
    reason?: string;
  }[];

  apRemaining: number;

  onPreview(actionId: string): void;
  onConfirm(actionId: string): void;
};
```

### Timeline Filter

```ts
export type TimelineFilter = {
  players?: string[];
  types?: string[];
  hideRevoked: boolean;
};
```

### Timeline Props

```ts
export type TimelineProps = {
  state: GameState;

  filters?: TimelineFilter;
  onSetFilters(filters: TimelineFilter): void;

  onFocusEvent(eventId: string): void;
  onFocusWorld(worldId: string): void;
};
```

## Selectors

### selectLegalActions

```ts
export function selectLegalActions(
  state: GameState,
  selection: Selection,
  actionRegistry: ActionDef[]
): {
  action: ActionDef;
  enabled: boolean;
  reason?: string;
}[];
```

### selectApSpentThisTurn

```ts
export function selectApSpentThisTurn(state: GameState): number;
```

### selectApRemaining

```ts
export function selectApRemaining(state: GameState): number;
```

### selectEventsAffectingWorldId

```ts
export function selectEventsAffectingWorldId(
  state: GameState,
  worldId: string
): GameEvent[];
```

### selectEventsAffectingHex

```ts
export function selectEventsAffectingHex(
  state: GameState,
  hex: Hex
): GameEvent[];
```

### selectWorldObjectsAtHex

```ts
export function selectWorldObjectsAtHex(
  state: GameState,
  hex: Hex
): WorldObject[];
```

### selectHasPlayerActedThisRound

```ts
export function selectHasPlayerActedThisRound(
  state: GameState,
  playerId: string
): boolean;
```

### selectCanAdvanceAge

```ts
export function selectCanAdvanceAge(
  state: GameState,
  players: PlayerId[]
): boolean;
```

## Controller Helpers

### proposeWorldModifyEvent

```ts
export function proposeWorldModifyEvent(
  state: GameState,
  baseCost: number,
  worldId: string,
  patch: WorldEvent["payload"]["patch"]
): {
  event?: WorldEvent;
  hard?: string;
  softWarnings?: string[];
  finalCost?: number;
};
```

### proposeTurnScopedUndo

```ts
export function proposeTurnScopedUndo(
  state: GameState
): GameEvent | undefined;
```

### proposeDraftGlobalRollback

```ts
export function proposeDraftGlobalRollback(
  state: GameState
): GameEvent | { hard: string };
```

### validateProtection

```ts
export function validateProtection(
  state: GameState,
  target: WorldObject | undefined,
  actorId: string
): Validation;
```

### costModifierForOtherPlayers

```ts
export function costModifierForOtherPlayers(
  state: GameState,
  target: WorldObject | undefined,
  actorId: string
): number;
```

### softWarnings

```ts
export function softWarnings(
  state: GameState,
  target: WorldObject | undefined,
  actorId: string
): SoftWarning[];
```

### isDraftRound

```ts
export function isDraftRound(state: GameState): boolean;
```

### isEventRevoked

```ts
export function isEventRevoked(state: GameState, evtId: string): boolean;
```

### computeIsNamed

```ts
export function computeIsNamed(kind: WorldKind, name?: string): boolean;
```

## Server Types

### Room State

```ts
export type RoomState = {
  seq: number;
  hash: string;
  log: Array<{ seq: number; event: GameEvent; hash: string }>;
  clients: Set<WebSocket>;

  players: PlayerId[];
  activeIndex: number;

  age: 1 | 2 | 3;
  round: number;
  turn: number;

  revoked: Set<string>;
  settings: QolSettings;

  worldIndex: Map<string, {
    kind: WorldKind;
    createdBy: PlayerId;
    createdAge: number;
    createdRound: number;
    isNamed: boolean;
    hexes: Set<string>;
    attrs: Record<string, any>;
  }>;

  hexIndex: Map<string, Set<string>>;

  ageVote: {
    proposals: Map<string, {
      to: 2 | 3 | 4;
      fromAge: number;
      round: number;
      votes: Map<PlayerId, "YES" | "NO">;
      open: boolean;
    }>;
  };
};
```

### C2S Messages

```ts
export type C2S =
  | { t: "HELLO"; room: string; playerId: string; clientVersion: string }
  | { t: "PULL"; room: string; sinceSeq: number }
  | { t: "PUSH_EVENT"; room: string; event: GameEvent; prevHash?: string };
```

### S2C Messages

```ts
export type S2C =
  | { t: "WELCOME"; room: string; serverTime: number; seq: number; hash: string; age?: number; round?: number; turn?: number; activePlayerId?: string; apRemaining?: number }
  | { t: "EVENT"; room: string; seq: number; event: GameEvent; hash: string }
  | { t: "BATCH"; room: string; fromSeq: number; toSeq: number; events: Array<{ seq: number; event: GameEvent; hash: string }> }
  | { t: "ERROR"; code: string; message: string; details?: ErrorDetails };
```

### Error Details

```ts
export type ErrorDetails =
  | {
      kind: "HEX_REQUIRED";
      expected: number;
      actual: number;
    }
  | {
      kind: "HEX_DEPENDENCY_MISSING";
      requiredKind: WorldKind;
      hex: { q: number; r: number };
    }
  | {
      kind: "WORLD_DEPENDENCY_MISSING";
      requiredKind: WorldKind;
      worldId?: string;
    }
  | {
      kind: "AGE_FORBIDDEN";
      age: number;
      kindAttempted: WorldKind;
    }
  | {
      kind: "PROTECTED_UNTIL_END_OF_ROUND";
      worldId: string;
      createdBy: string;
      createdRound: number;
    }
  | {
      kind: "AP_INSUFFICIENT";
      remaining: number;
      required: number;
    }
  | {
      kind: "TURN_OWNERSHIP";
      activePlayerId: string;
    }
  | {
      kind: "BAD_COORDS";
      expected: { age: number; round: number; turn: number };
      received: { age: number; round: number; turn: number };
    };
```

### WsSync Type

```ts
export type WsSync = {
  connect(): void;
  disconnect(): void;
  pushEvent(event: GameEvent): void;
  getStatus(): "DISCONNECTED" | "CONNECTING" | "CONNECTED";
};
```

### makeWsSync Options

```ts
export function makeWsSync(opts: {
  url: string;           // ws://localhost:8787
  room: string;
  playerId: string;
  dispatch: Dispatch;
  getState: () => GameState;
}): WsSync;
```

## Reducer

### Reducer Function

```ts
export function reducer(
  state: GameState,
  action: { type: "DISPATCH_EVENT"; event: GameEvent }
): GameState;
```

### Dispatch Action

```ts
export type DispatchAction = {
  type: "DISPATCH_EVENT";
  event: GameEvent;
};
```

## World Derivation

### deriveWorld

```ts
export function deriveWorld(state: GameState): Map<string, WorldObject>;
```

## See Also

- [CORE_IMPLEMENTATION.md](CORE_IMPLEMENTATION.md) — Implementation details
- [PROTOCOL_SPEC.md](PROTOCOL_SPEC.md) — Wire protocol
- [UI_COMPONENTS.md](UI_COMPONENTS.md) — Component contracts
