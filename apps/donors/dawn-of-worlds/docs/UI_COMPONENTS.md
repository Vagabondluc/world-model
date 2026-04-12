# UI Components

This document describes the UI components for Dawn of Worlds, including their contracts, props, and behavior.

## Table of Contents

- [Inspector](#inspector)
- [Action Registry](#action-registry)
- [Action Palette](#action-palette)
- [Timeline](#timeline)
- [World Inspector](#world-inspector)

## Inspector

The Inspector is a read-only forensic tool that shows what exists at a location and how it got that way.

### Purpose

The Inspector answers one question only:

> "What exists *here*, and how did it get that way?"

### Entry Points

The Inspector opens when the user clicks:

- A **hex**
- A **world object** (city, landmark, nation, etc.)
- A **timeline event**

### Target Type

```ts
type InspectorTarget =
  | { kind: "HEX"; hex: Hex }
  | { kind: "WORLD"; worldId: string }
  | { kind: "EVENT"; eventId: string };
```

### Component Props

```ts
export type InspectorProps = {
  state: GameState;
  target: InspectorTarget | null;

  onFocusHex(hex: Hex): void;
  onFocusWorld(worldId: string): void;
  onFocusEvent(eventId: string): void;
};
```

### Layout

```
┌──────────────────────────────────┐
│ Inspector Header                 │
│  • Hex (q,r) or Object Name      │
│  • Kind / Age / Ownership        │
├──────────────────────────────────┤
│ World Objects Present            │
│  • Terrain                       │
│  • Sites / Cities                │
│  • Borders / Nations             │
├──────────────────────────────────┤
│ Timeline (Immutable)             │
│  • chronological                 │
│  • clickable                     │
│  • highlights map on hover       │
└──────────────────────────────────┘
```

### Inspector Header

For hex target:

```
Hex (q=2, r=-1)
Terrain: Mountains
Age First Modified: I
```

For world object:

```
City of Ashkel
Kind: SETTLEMENT
Created by: Player Red (Age II, Round 2)
```

### World Objects List

Selector: `selectWorldObjectsAtHex(state, hex)`

Rendered as a flat list, grouped by kind order:

1. Terrain / Water
2. Landmarks
3. Settlements
4. Nations / Borders
5. Projects / Wars

Each entry shows:
- name (if any)
- kind badge
- createdBy color dot (if SOFT ownership)

Clicking an entry switches Inspector target to `{ kind: "WORLD" }`.

### Timeline

Selector: `selectEventsAffectingHex(state, hex)` or `selectEventsAffectingWorldId(state, worldId)`

Timeline row format:

```
[Age II · R2 · P.Red]
Founded City of Ashkel (−3 AP)
```

Behavior:
- **Immutable** (no undo here)
- Hover → highlight affected hexes
- Click → inspector focuses on that event

Optional QoL toggles:
- Hide revoked events (default on)
- Filter by player
- Filter by action type

### Implementation

```tsx
export function Inspector({
  state,
  target,
  onFocusHex,
  onFocusWorld,
  onFocusEvent,
}: InspectorProps) {
  if (!target) {
    return (
      <div className="inspector empty">
        <em>Select a hex or world object</em>
      </div>
    );
  }

  const world = deriveWorld(state);

  // Resolve target
  let header: React.ReactNode = null;
  let objects: any[] = [];
  let events = [];

  if (target.kind === "HEX") {
    const { hex } = target;
    objects = selectWorldObjectsAtHex(state, hex);
    events = selectEventsAffectingHex(state, hex);

    header = (
      <>
        <h3>Hex ({hex.q}, {hex.r})</h3>
        <div className="meta">Age {state.age}</div>
      </>
    );
  }

  if (target.kind === "WORLD") {
    const obj = world.get(target.worldId);
    if (!obj) return null;

    events = selectEventsAffectingWorldId(state, obj.id);

    header = (
      <>
        <h3>{obj.name ?? "(Unnamed)"}</h3>
        <div className="meta">
          {obj.kind}
          {obj.createdBy && ` · created by ${obj.createdBy}`}
        </div>
      </>
    );

    objects = [obj];
  }

  if (target.kind === "EVENT") {
    const evt = state.events.find(e => e.id === target.eventId);
    if (!evt) return null;

    header = (
      <>
        <h3>Event</h3>
        <div className="meta">
          Age {evt.age} · Round {evt.round} · {evt.playerId}
        </div>
      </>
    );

    events = [evt];
  }

  return (
    <div className="inspector">
      <InspectorHeader>{header}</InspectorHeader>

      {objects.length > 0 && (
        <InspectorObjects
          objects={objects}
          onFocusWorld={onFocusWorld}
        />
      )}

      <InspectorTimeline
        events={events}
        onFocusEvent={onFocusEvent}
        onFocusWorld={onFocusWorld}
      />
    </div>
  );
}
```

## Action Registry

The Action Registry defines all available actions in the game.

### Action Definition

```ts
export type ActionDef = {
  id: string;
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

### Age I — The World (Physical)

| ID | Action | Cost | Target |
|-----|---------|-------|--------|
| A1_ADD_TERRAIN | Add Terrain | 2 | HEX |
| A1_ADD_WATER | Add River / Sea | 2 | HEX |
| A1_NAME_REGION | Name Region | 1 | HEX |
| A1_CREATE_LANDMARK | Create Landmark | 3 | HEX |

### Age II — Peoples & Cultures

| ID | Action | Cost | Target |
|-----|---------|-------|--------|
| A2_CREATE_RACE | Create Race | 2 | HEX |
| A2_FOUND_CITY | Found City | 3 | HEX |
| A2_DEFINE_CULTURE | Define Culture Trait | 1 | WORLD |

### Age III — Politics & Conflict

| ID | Action | Cost | Target |
|-----|---------|-------|--------|
| A3_FOUND_NATION | Found Nation | 3 | HEX |
| A3_CLAIM_BORDER | Claim Border | 2 | HEX |
| A3_DECLARE_WAR | Declare War | 2 | WORLD |
| A3_SIGN_TREATY | Sign Treaty | 1 | WORLD |
| A3_GREAT_PROJECT | Great Project | 3 | WORLD |

### Example: Add Terrain

```ts
{
  id: "A1_ADD_TERRAIN",
  label: "Add Terrain",
  age: 1,
  baseCost: 2,
  target: "HEX",
  validate: (state, sel) =>
    sel.kind === "HEX" ? { ok: true } : { ok: false, reason: "Select a hex." },
  buildEvent: (state, sel) => ({
    id: crypto.randomUUID(),
    ts: Date.now(),
    playerId: state.activePlayerId,
    age: state.age,
    round: state.round,
    turn: state.turn,
    type: "WORLD_CREATE",
    cost: 2,
    payload: {
      worldId: crypto.randomUUID(),
      kind: "TERRAIN",
      hexes: [sel.hex],
    },
  }),
}
```

## Action Palette

The Action Palette is the only place players act.

### Purpose

Display available actions for the current selection and allow players to execute them.

### Component Props

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

### Layout

```
┌────────────────────────────┐
│ Actions (AP: 2 remaining) │
├────────────────────────────┤
│ Add Terrain        (2 AP)  │
│ Found City         (3 AP)  │ ❌ not enough AP
│ Name Region        (1 AP)  │
└────────────────────────────┘
```

### Behavior Rules

- Disabled actions **cannot be clicked**
- Hover shows `reason`
- Clicking enabled action:
  1. Triggers preview ghost
  2. Shows Confirm / Cancel
- Confirm dispatches event
- Palette re-renders immediately

### Preview Contract

Preview data is **derived**, never guessed:

```ts
export type ActionPreview = {
  affectedHexes: Hex[];
  worldObjectsCreated?: WorldKind[];
  cost: number;
  warnings?: string[];
};
```

Ghost rendering is **visual only**.

### Implementation

```tsx
export function ActionPalette({
  legalActions,
  apRemaining,
  onPreview,
  onConfirm,
}: ActionPaletteProps) {
  const [previewAction, setPreviewAction] = useState<string | null>(null);

  return (
    <div className="action-palette">
      <div className="header">
        Actions (AP: {apRemaining} remaining)
      </div>

      <ul role="listbox">
        {legalActions.map(({ action, enabled, reason }) => (
          <li
            key={action.id}
            role="option"
            aria-selected={previewAction === action.id}
            className={enabled ? "enabled" : "disabled"}
            onClick={() => enabled && setPreviewAction(action.id)}
            onMouseEnter={() => enabled && onPreview(action.id)}
            title={reason}
          >
            {action.label} ({action.baseCost} AP)
          </li>
        ))}
      </ul>

      {previewAction && (
        <ConfirmDialog
          action={legalActions.find(a => a.action.id === previewAction)?.action}
          onConfirm={() => {
            onConfirm(previewAction);
            setPreviewAction(null);
          }}
          onCancel={() => setPreviewAction(null)}
        />
      )}
    </div>
  );
}
```

## Timeline

The Timeline displays the immutable event log for the entire game.

### Purpose

Show chronological history of all game events for audit and review.

### Component Props

```ts
export type TimelineProps = {
  state: GameState;

  filters?: TimelineFilter;
  onSetFilters(filters: TimelineFilter): void;

  onFocusEvent(eventId: string): void;
  onFocusWorld(worldId: string): void;
};
```

### Filter Type

```ts
export type TimelineFilter = {
  players?: string[];
  types?: string[];
  hideRevoked: boolean;
};
```

### Timeline Row Format

```
[Age II · R2 · P.Red]
Founded City of Ashkel (−3 AP)
```

### Behavior

- **Immutable** (no modification)
- Hover → highlight affected hexes
- Click → inspector focuses on that event
- Filter controls to reduce noise

### Implementation

```tsx
export function Timeline({
  state,
  filters,
  onSetFilters,
  onFocusEvent,
  onFocusWorld,
}: TimelineProps) {
  const events = useMemo(() => {
    let filtered = state.events;

    if (filters?.hideRevoked) {
      filtered = filtered.filter(e => !state.revokedEventIds.has(e.id));
    }

    if (filters?.players) {
      filtered = filtered.filter(e => filters.players.includes(e.playerId));
    }

    if (filters?.types) {
      filtered = filtered.filter(e => filters.types.includes(e.type));
    }

    return filtered.sort((a, b) => a.ts - b.ts);
  }, [state.events, filters]);

  return (
    <div className="timeline">
      <TimelineFilters filters={filters} onChange={onSetFilters} />

      <ul>
        {events.map(e => (
          <li
            key={e.id}
            className="timeline-row"
            onClick={() => onFocusEvent(e.id)}
            onMouseEnter={() => highlightAffectedHexes(e)}
          >
            <div className="when">
              Age {e.age} · R{e.round} · {e.playerId}
            </div>
            <div className="what">
              {describeEvent(e, onFocusWorld)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## World Inspector

The World Inspector shows detailed information about a specific world object.

### Purpose

Display comprehensive information about a world object and its complete history.

### Component Props

```ts
export type WorldInspectorProps = {
  state: GameState;
  worldId: string;

  onFocusHex(hex: { q: number; r: number }): void;
  onFocusEvent(eventId: string): void;
};
```

### Layout

```
┌──────────────────────────────────┐
│ City of Ashkel                    │
│ SETTLEMENT · Created by Red      │
├──────────────────────────────────┤
│ Location                          │
│  • Hex (2, -1)                 │
├──────────────────────────────────┤
│ Attributes                        │
│  • settlementType: CITY           │
│  • population: 5000              │
├──────────────────────────────────┤
│ Timeline                          │
│  [Age II · R2 · P.Red]           │
│    Founded City of Ashkel (−3 AP)  │
└──────────────────────────────────┘
```

### Implementation

```tsx
export function WorldInspector({
  state,
  worldId,
  onFocusHex,
  onFocusEvent,
}: WorldInspectorProps) {
  const world = deriveWorld(state);
  const obj = world.get(worldId);

  if (!obj) {
    return (
      <div className="inspector">
        <em>World object not found.</em>
      </div>
    );
  }

  const events = selectEventsAffectingWorldId(state, worldId);

  return (
    <div className="inspector world-inspector">
      <Header obj={obj} />
      <Geometry obj={obj} onFocusHex={onFocusHex} />
      <Attributes obj={obj} />
      <Timeline events={events} onFocusEvent={onFocusEvent} />
    </div>
  );
}
```

## CSS Contract

Minimal CSS contract for components:

```css
.inspector {
  padding: 8px;
  border-left: 1px solid #444;
  overflow-y: auto;
}

.inspector-header {
  border-bottom: 1px solid #333;
  margin-bottom: 6px;
}

.inspector-objects ul,
.inspector-timeline ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.clickable {
  cursor: pointer;
}

.timeline-row {
  padding: 4px 0;
  border-bottom: 1px solid #222;
}

.action-palette {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-palette .enabled {
  cursor: pointer;
}

.action-palette .disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## See Also

- [CORE_IMPLEMENTATION.md](CORE_IMPLEMENTATION.md) — Selectors and state management
- [ARCHITECTURE.md](ARCHITECTURE.md) — Component hierarchy
- [QOL_FEATURES.md](QOL_FEATURES.md) — Quality-of-life features
