# Quality of Life Features

This document describes quality-of-life features designed to make Dawn of Worlds playable online with minimal friction.

## Table of Contents

- [Cognitive Load Reduction](#cognitive-load-reduction)
- [Mistake Prevention](#mistake-prevention)
- [Social Friction Management](#social-friction-management)
- [State Clarity](#state-clarity)
- [Pacing](#pacing)
- [Structural Clarity](#structural-clarity)
- [Recovery](#recovery)
- [Export](#export)
- [Onboarding](#onboarding)

## Cognitive Load Reduction

### Context-Sensitive Action Filtering

**Problem:** Players shouldn't need to scan the rulebook mid-turn.

**Solution:** Action palette auto-filters to only legal actions based on current selection.

**Behavior:**

- Click a hex / region / faction → Action palette shows only legal actions
- Illegal actions are hidden (not just disabled) when `contextFilterActions = true`
- When `contextFilterActions = false`, illegal actions appear disabled with reason tooltip

**Implementation:**

```ts
export function selectLegalActions(
  state: GameState,
  selection: Selection,
  actionRegistry: ActionDef[]
): {
  action: ActionDef;
  enabled: boolean;
  reason?: string;
}[] {
  return actionRegistry
    .filter(a => a.age === state.age)
    .map(action => {
      const res = action.validate(state, selection);

      if (res.ok) {
        return { action, enabled: true };
      }

      // QoL behavior toggle
      if (state.settings.ui.contextFilterActions) {
        return null;
      }

      return {
        action,
        enabled: false,
        reason: state.settings.ui.showDisabledWithReasons
          ? res.reason
          : undefined,
      };
    })
    .filter(Boolean) as any;
}
```

### Inline Rule Justification

**Problem:** Rules should be feedback, not memory tests.

**Solution:** Hover over disabled action shows tooltip explaining why it's illegal.

**Example:**

> ❌ Cannot add city
> Reason: No race present in region (Age II rule)

**Implementation:**

```tsx
<li
  className={enabled ? "enabled" : "disabled"}
  title={reason}
>
  {action.label} ({action.baseCost} AP)
</li>
```

## Mistake Prevention

### Action Preview (Ghost Mode)

**Problem:** Players need to see what will happen before committing.

**Solution:** Before confirming, show ghost preview of affected hexes and changes.

**Behavior:**

- Highlight affected hexes in semi-transparent overlay
- Show borders / rivers / ownership changes
- Preview labels in grey
- Nothing commits until "Confirm" is clicked

**Preview Contract:**

```ts
export type ActionPreview = {
  affectedHexes: Hex[];
  worldObjectsCreated?: WorldKind[];
  cost: number;
  warnings?: string[];
};
```

**Implementation:**

Ghost rendering is visual only. The actual event is created on confirm.

### Soft Validation vs Hard Validation

**Problem:** Some rules are strict (cannot break), others are social warnings.

**Solution:** Two layers of validation:

- **Hard rules** → Cannot confirm (block action)
- **Soft warnings** → Show warning but allow action

**Examples:**

| Rule | Type | Effect |
|-------|--------|---------|
| Protected until end of round | Hard | Cannot modify target |
| Modifying another player's creation | Soft | Show warning, +1 AP cost |
| Not enough AP | Hard | Cannot confirm |

## Social Friction Management

### Ownership Tags (Non-Authoritative)

**Problem:** Dawn of Worlds allows modifying others' creations, which can cause disputes.

**Solution:** Track who created what for social signals only.

**Behavior:**

- Every creation has `createdBy: playerId`
- Used only for:
  - Cost modifiers (+1/+2 AP)
  - Warnings in UI
  - Filters
- **No hard ownership** — players can still modify

**Implementation:**

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

When `ownershipTags = "OFF"`, `createdBy` is not stored.

### Protected Until End of Round

**Problem:** Instant griefing of new creations.

**Solution:** Newly created features cannot be modified until round ends.

**Behavior:**

- Optional table rule
- Blocks modifications/deletes of objects created this round by another player
- Prevents instant griefing without banning interaction

**Validation:**

```ts
export function validateProtection(
  state: GameState,
  target: WorldObject | undefined,
  actorId: string
): Validation {
  if (!state.settings.social.protectedUntilEndOfRound) {
    return { ok: true };
  }
  if (!target?.createdBy) return { ok: true };
  if (target.createdBy === actorId) return { ok: true };

  const createdThisRound =
    target.createdAge === state.age &&
    target.createdRound === state.round;

  if (!createdThisRound) return { ok: true };

  return { ok: false, reason: "Protected until end of round." };
}
```

### Alteration Cost Scaling

**Problem:** Modifying others' creations should have social weight.

**Solution:** +1 AP to modify another player's creation, +2 AP if named.

**Behavior:**

- Optional table rule
- Base cost +1 for modifying others
- Additional +2 if target is named AND kind is in `namedKinds`
- Mirrors social weight mechanically

**Implementation:**

```ts
export function costModifierForOtherPlayers(
  state: GameState,
  target: WorldObject | undefined,
  actorId: string
): number {
  const alter = state.settings.social.alterationCost;
  if (!alter.enabled) return 0;
  if (!target?.createdBy) return 0;
  if (target.createdBy === actorId) return 0;

  const base = alter.modifyOthersBasePlus;
  const named =
    target.isNamed && alter.namedKinds.includes(target.kind)
      ? alter.modifyOthersNamedPlus
      : 0;

  return base + named;
}
```

**Named Kinds Configuration:**

```ts
namedKinds: ["LANDMARK", "SETTLEMENT", "NATION"]
```

## State Clarity

### Immutable Timeline (Event Log)

**Problem:** Players need to understand what happened and resolve disputes.

**Solution:** Every action is logged as an immutable event.

**Timeline Entry Format:**

```
Age II — Player Red
Founded the City of Ashkel in Ember Plains (−3 AP)
```

**Behavior:**

- Clickable → highlights affected map elements
- Chronological order
- Cannot be modified (immutable)
- Shows all events affecting a hex or object

**Selectors:**

```ts
export function selectEventsAffectingHex(
  state: GameState,
  hex: Hex
): GameEvent[] {
  return state.events
    .filter(e => {
      if (state.revokedEventIds.has(e.id)) return false;

      // Include events that touched this hex
      // ... (see CORE_IMPLEMENTATION.md)
    })
    .sort((a, b) => a.ts - b.ts);
}

export function selectEventsAffectingWorldId(
  state: GameState,
  worldId: string
): GameEvent[] {
  return state.events
    .filter(e => {
      if (state.revokedEventIds.has(e.id)) return false;

      if (e.type === "WORLD_CREATE") {
        return e.payload.worldId === worldId;
      }
      if (e.type === "WORLD_MODIFY") {
        return e.payload.worldId === worldId;
      }
      if (e.type === "WORLD_DELETE") {
        return e.payload.worldId === worldId;
      }
      return false;
    })
    .sort((a, b) => a.ts - b.ts);
}
```

### World Inspector

**Problem:** Need to see complete history of any world object.

**Solution:** Click any hex / faction / city to see all events that touched it.

**Inspector Shows:**

- Object name, kind, and ownership
- Location (hex coordinates)
- Attributes (key-value pairs)
- Timeline of all events affecting it (chronological, attributed)

**Entry Points:**

- Click a hex → shows objects at that hex
- Click a world object → shows object details
- Click a timeline event → focuses on that event

## Pacing

### AP Meter with Live Breakdown

**Problem:** Players need to understand AP spending clearly.

**Solution:** Show detailed breakdown instead of just "you have 5 AP".

**Display:**

```
AP: 5
−2 Add Mountains
−1 Name Region
−1 Modify Other Player (rule)
Remaining: 1
```

**Implementation:**

```ts
export function selectApSpentThisTurn(state: GameState): number {
  let spent = 0;

  for (const e of state.events) {
    if (state.revokedEventIds.has(e.id)) continue;
    if (e.age !== state.age) continue;
    if (e.round !== state.round) continue;
    if (e.turn !== state.turn) continue;

    if ("cost" in e && typeof e.cost === "number") {
      spent += e.cost;
    }
  }

  return spent;
}

export function selectApRemaining(state: GameState): number {
  const apTotal = state.settings.turn.apByAge[state.age];
  const spent = selectApSpentThisTurn(state);
  return Math.max(0, apTotal - spent);
}
```

### Suggested Actions (Non-AI, Deterministic)

**Problem:** Players may not know what's possible.

**Solution:** System suggests legal, high-impact actions based on rules.

**Examples:**

- "You could found a city here"
- "This region qualifies for a race"

**Implementation:**

No AI. No narrative. Just rules math.

```ts
export function selectSuggestedActions(
  state: GameState,
  hex: Hex
): ActionDef[] {
  const suggestions: ActionDef[] = [];

  // Example: if no race at hex, suggest creating one
  if (!existsKindAtHex(state, hex, "RACE") {
    suggestions.push(actionRegistry.A2_CREATE_RACE);
  }

  return suggestions;
}
```

## Structural Clarity

### Age Banner + Locked Actions

**Problem:** Players may forget which Age they're in.

**Solution:** Top UI bar shows current Age and locked actions.

**Display:**

```
AGE II — RACES & CULTURES
Allowed: Create Race, Found City, Define Trait
Locked: Wars, Nations
```

**Implementation:**

```tsx
<div className="age-banner">
  <h2>AGE {state.age} — {getAgeTitle(state.age)}</h2>
  <p>Allowed: {getAllowedActions(state.age).join(", ")}</p>
  <p>Locked: {getLockedActions(state.age).join(", ")}</p>
</div>
```

### Age Transition Checklist

**Problem:** Prevent premature age advancement.

**Solution:** Before advancing, verify conditions.

**Checklist:**

- Minimum rounds reached?
- Every player has acted? (if enabled)
- Table confirms?

**Selector:**

```ts
export function selectCanAdvanceAge(
  state: GameState,
  players: PlayerId[]
): boolean {
  const minRounds = state.settings.turn.minRoundsByAge[state.age];
  if (state.round < minRounds) return false;

  if (state.settings.turn.requireAllPlayersActedToAdvance) {
    return players.every(p => selectHasPlayerActedThisRound(state, p));
  }

  return true;
}
```

## Recovery

### Turn-Scoped Undo

**Problem:** Players make mistakes and want to revert.

**Solution:** Undo allowed only during your turn, before turn ends.

**Behavior:**

- Finds last non-revoked event by active player in current turn
- Creates `EVENT_REVOKE` tombstone for that event
- Cannot undo after turn ends
- Cannot undo structural events (TURN_BEGIN, TURN_END, etc.)

**Implementation:**

```ts
export function proposeTurnScopedUndo(
  state: GameState
): GameEvent | undefined {
  if (state.settings.safety.undo.mode !== "TURN_SCOPED") return;

  const actor = state.activePlayerId;

  for (let i = state.events.length - 1; i >= 0; i--) {
    const e = state.events[i];
    if (state.revokedEventIds.has(e.id)) continue;
    if (e.playerId !== actor) continue;
    if (e.age !== state.age || e.round !== state.round || e.turn !== state.turn) {
      continue;
    }

    // Don't allow revoking structural events
    if (
      e.type === "TURN_BEGIN" ||
      e.type === "TURN_END" ||
      e.type === "ROUND_END" ||
      e.type === "AGE_ADVANCE"
    ) {
      continue;
    }
    if (e.type === "EVENT_REVOKE") continue;

    return {
      id: crypto.randomUUID(),
      ts: Date.now(),
      playerId: actor,
      age: state.age,
      round: state.round,
      turn: state.turn,
      type: "EVENT_REVOKE",
      payload: { targetEventIds: [e.id], reason: "Turn-scoped undo" },
    };
  }
}
```

### Draft Mode (Optional)

**Problem:** New players need onboarding flexibility.

**Solution:** First round of each Age is "draft" with one global rollback.

**Behavior:**

- First N rounds of each Age are draft rounds
- Events marked provisional
- One global rollback allowed per Age
- Great for onboarding new players

**Settings:**

```ts
draftMode: {
  enabled: boolean;
  draftRoundCountAtAgeStart: number;  // e.g., 1
  allowOneGlobalRollbackDuringDraft: boolean;
}
```

**Implementation:**

```ts
export function isDraftRound(state: GameState): boolean {
  const s = state.settings.safety.draftMode;
  if (!s.enabled) return false;
  return state.round <= s.draftRoundCountAtAgeStart;
}

export function proposeDraftGlobalRollback(
  state: GameState
): GameEvent | { hard: string } {
  const s = state.settings.safety.draftMode;
  if (!s.enabled) return { hard: "Draft mode disabled." };
  if (!s.allowOneGlobalRollbackDuringDraft) {
    return { hard: "Draft rollback disabled." };
  }
  if (!isDraftRound(state)) return { hard: "Not in draft rounds." };
  if (state.draftRollbackUsedByAge[state.age]) {
    return { hard: "Draft rollback already used for this age." };
  }

  // Revoke all events in current age+round
  const ids: string[] = [];
  for (const e of state.events) {
    if (state.revokedEventIds.has(e.id)) continue;
    if (e.age !== state.age) continue;
    if (e.round !== state.round) continue;
    // Skip structural events
    if (
      e.type === "TURN_BEGIN" ||
      e.type === "TURN_END" ||
      e.type === "ROUND_END" ||
      e.type === "AGE_ADVANCE"
    ) {
      continue;
    }
    if (e.type === "EVENT_REVOKE" || e.type === "DRAFT_ROLLBACK_USED") {
      continue;
    }
    ids.push(e.id);
  }

  const actor = state.activePlayerId;

  return {
    id: crypto.randomUUID(),
    ts: Date.now(),
    playerId: actor,
    age: state.age,
    round: state.round,
    turn: state.turn,
    type: "EVENT_REVOKE",
    payload: { targetEventIds: ids, reason: "Draft global rollback" },
  };
}
```

## Export

### Structured Export

**Problem:** Need to export game state for downstream applications.

**Solution:** One click export of complete game data.

**Export Includes:**

- JSON event log
- Derived world snapshot
- Faction registry
- Map geometry

**Settings:**

```ts
export: {
  includeEventLog: boolean;
  includeDerivedSnapshot: boolean;
  includeAttribution: boolean;  // createdBy, etc.
}
```

**Implementation:**

```ts
export function exportGame(state: GameState): string {
  const data: any = {};

  if (state.settings.export.includeEventLog) {
    data.eventLog = state.events;
  }

  if (state.settings.export.includeDerivedSnapshot) {
    data.worldSnapshot = Array.from(deriveWorld(state).values());
  }

  if (state.settings.export.includeAttribution) {
    data.includeAttribution = true;
  }

  return JSON.stringify(data, null, 2);
}
```

## Onboarding

### Guided First Age

**Problem:** New players need guidance learning the game.

**Solution:** Optional guided mode for first Age.

**Behavior:**

- UI highlights where to click
- Locks complex actions until prerequisites met
- Tooltips explain why things unlock
- Disables automatically after Age I

**Settings:**

```ts
onboarding: {
  guidedFirstAge: boolean;
  lockComplexActionsDuringGuide: boolean;
}
```

## Small but Deadly QoL Wins

These features matter more than people think:

| Feature | Description |
|----------|-------------|
| **Search** | Search regions, factions, landmarks by name |
| **Map Jump** | Jump from timeline entry to map location |
| **Auto-name Suggestions** | Seeded, non-AI name suggestions |
| **Player Color Overlay** | Soft, transparent color showing ownership |
| **Pin Important Events** | Mark events as "this war matters later" |

## Net Effect

With this QoL layer:

- Dawn of Worlds becomes **playable online**
- Social tension becomes **structured**
- Rules arguments vanish
- Export → downstream games becomes trivial
- Mythology becomes **emergent data**, not narrative authority

## See Also

- [CORE_IMPLEMENTATION.md](CORE_IMPLEMENTATION.md) — Implementation details
- [UI_COMPONENTS.md](UI_COMPONENTS.md) — UI components
- [SERVER_IMPLEMENTATION.md](SERVER_IMPLEMENTATION.md) — Server-side validation
