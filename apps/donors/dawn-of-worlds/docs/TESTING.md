# Testing

This document describes the testing strategy and test suite for Dawn of Worlds.

## Table of Contents

- [Test Setup](#test-setup)
- [Selector Tests](#selector-tests)
- [Component Tests](#component-tests)
- [Test Coverage Goals](#test-coverage-goals)
- [Testing Strategy](#testing-strategy)

## Test Setup

### Dependencies

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Test Helpers

```ts
// tests/helpers.ts
import type { GameState } from "../state";
import type { QolSettings } from "../QoLSettings";

export const baseSettings: QolSettings = {
  version: "qol.v1",
  turn: {
    apByAge: { 1: 5, 2: 5, 3: 5 },
    minRoundsByAge: { 1: 1, 2: 1, 3: 1 },
    requireAllPlayersActedToAdvance: false,
  },
  ui: {
    contextFilterActions: true,
    showDisabledWithReasons: true,
    actionPreviewGhost: true,
    mapJumpFromTimeline: true,
    searchEnabled: true,
    showPlayerColorOverlay: true,
  },
  social: {
    ownershipTags: "SOFT",
    protectedUntilEndOfRound: false,
    alterationCost: {
      enabled: false,
      modifyOthersBasePlus: 1,
      modifyOthersNamedPlus: 2,
      namedKinds: [],
    },
    warnings: {
      warnOnModifyingOthers: true,
      warnOnDeletingNamed: true,
    },
  },
  safety: {
    undo: { mode: "TURN_SCOPED" },
    draftMode: {
      enabled: false,
      draftRoundCountAtAgeStart: 0,
      allowOneGlobalRollbackDuringDraft: false,
    },
  },
  onboarding: {
    guidedFirstAge: false,
    lockComplexActionsDuringGuide: false,
  },
  export: {
    includeEventLog: true,
    includeDerivedSnapshot: true,
    includeAttribution: true,
  },
};

export function makeEmptyState(): GameState {
  return {
    settings: baseSettings,
    age: 1,
    round: 1,
    turn: 1,
    activePlayerId: "P1",
    events: [],
    revokedEventIds: new Set(),
    draftRollbackUsedByAge: {},
  };
}
```

## Selector Tests

### selectWorldObjectsAtHex

```ts
// tests/selectWorldObjectsAtHex.test.ts
import { describe, it, expect } from "vitest";
import { selectWorldObjectsAtHex } from "../selectors/worldAtHex";
import { makeEmptyState } from "./helpers";

describe("selectWorldObjectsAtHex", () => {
  it("returns objects whose hexes include the target hex", () => {
    const state = makeEmptyState();

    state.events.push({
      id: "e1",
      ts: 1,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 2,
      payload: {
        worldId: "terrain1",
        kind: "TERRAIN",
        hexes: [{ q: 0, r: 0 }],
      },
    });

    const objects = selectWorldObjectsAtHex(state, { q: 0, r: 0 });

    expect(objects).toHaveLength(1);
    expect(objects[0].id).toBe("terrain1");
  });

  it("returns empty array if nothing occupies the hex", () => {
    const state = makeEmptyState();
    const objects = selectWorldObjectsAtHex(state, { q: 5, r: 5 });
    expect(objects).toEqual([]);
  });

  it("returns objects in stable kind order", () => {
    const state = makeEmptyState();

    state.events.push({
      id: "e1",
      ts: 1,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 2,
      payload: {
        worldId: "terrain1",
        kind: "TERRAIN",
        hexes: [{ q: 0, r: 0 }],
      },
    });

    state.events.push({
      id: "e2",
      ts: 2,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 3,
      payload: {
        worldId: "landmark1",
        kind: "LANDMARK",
        name: "Obelisk",
        hexes: [{ q: 0, r: 0 }],
      },
    });

    const objects = selectWorldObjectsAtHex(state, { q: 0, r: 0 });

    expect(objects).toHaveLength(2);
    expect(objects[0].kind).toBe("TERRAIN");  // TERRAIN order 1
    expect(objects[1].kind).toBe("LANDMARK"); // LANDMARK order 4
  });
});
```

### selectEventsAffectingHex

```ts
// tests/selectEventsAffectingHex.test.ts
import { describe, it, expect } from "vitest";
import { selectEventsAffectingHex } from "../selectors/eventsAffectingHex";
import { makeEmptyState } from "./helpers";

describe("selectEventsAffectingHex", () => {
  it("includes WORLD_CREATE events touching the hex", () => {
    const state = makeEmptyState();

    state.events.push({
      id: "e1",
      ts: 1,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 2,
      payload: {
        worldId: "obj1",
        kind: "LANDMARK",
        hexes: [{ q: 1, r: -1 }],
      },
    });

    const events = selectEventsAffectingHex(state, { q: 1, r: -1 });

    expect(events.map(e => e.id)).toEqual(["e1"]);
  });

  it("ignores revoked events", () => {
    const state = makeEmptyState();

    state.events.push({
      id: "e1",
      ts: 1,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 2,
      payload: {
        worldId: "obj1",
        kind: "LANDMARK",
        hexes: [{ q: 0, r: 0 }],
      },
    });

    state.revokedEventIds.add("e1");

    const events = selectEventsAffectingHex(state, { q: 0, r: 0 });
    expect(events).toHaveLength(0);
  });

  it("includes WORLD_MODIFY events for objects at that hex", () => {
    const state = makeEmptyState();

    // Create object first
    state.events.push({
      id: "e1",
      ts: 1,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 2,
      payload: {
        worldId: "obj1",
        kind: "LANDMARK",
        hexes: [{ q: 0, r: 0 }],
      },
    });

    // Modify it
    state.events.push({
      id: "e2",
      ts: 2,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_MODIFY",
      cost: 1,
      payload: {
        worldId: "obj1",
        patch: [{ op: "set", path: "name", value: "Renamed" }],
      },
    });

    const events = selectEventsAffectingHex(state, { q: 0, r: 0 });

    expect(events.map(e => e.id)).toEqual(["e1", "e2"]);
  });
});
```

### AP Selectors

```ts
// tests/apSelectors.test.ts
import { describe, it, expect } from "vitest";
import { selectApSpentThisTurn, selectApRemaining } from "../selectors/ap";
import { makeEmptyState } from "./helpers";

describe("AP selectors", () => {
  it("sums AP spent in current turn only", () => {
    const state = makeEmptyState();

    state.events.push({
      id: "e1",
      ts: 1,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 2,
      payload: { worldId: "x", kind: "TERRAIN", hexes: [] },
    });

    state.events.push({
      id: "e2",
      ts: 2,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 2, // different turn
      type: "WORLD_CREATE",
      cost: 2,
      payload: { worldId: "y", kind: "TERRAIN", hexes: [] },
    });

    expect(selectApSpentThisTurn(state)).toBe(2);
    expect(selectApRemaining(state)).toBe(3);  // 5 - 2 = 3
  });

  it("ignores revoked events", () => {
    const state = makeEmptyState();

    state.events.push({
      id: "e1",
      ts: 1,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 3,
      payload: { worldId: "x", kind: "TERRAIN", hexes: [] },
    });

    state.revokedEventIds.add("e1");

    expect(selectApSpentThisTurn(state)).toBe(0);
    expect(selectApRemaining(state)).toBe(5);
  });
});
```

## Component Tests

### Inspector Component Tests

```ts
// tests/Inspector.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Inspector } from "../components/Inspector";
import { makeEmptyState } from "./helpers";

describe("Inspector (HEX)", () => {
  it("renders world objects and timeline for a hex", () => {
    const state = makeEmptyState();

    state.events.push({
      id: "e1",
      ts: 1,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 2,
      payload: {
        worldId: "obj1",
        kind: "LANDMARK",
        name: "Obelisk",
        hexes: [{ q: 0, r: 0 }],
      },
    });

    render(
      <Inspector
        state={state}
        target={{ kind: "HEX", hex: { q: 0, r: 0 } }}
        onFocusHex={vi.fn()}
        onFocusWorld={vi.fn()}
        onFocusEvent={vi.fn()}
      />
    );

    expect(screen.getByText("Hex (0, 0)")).toBeInTheDocument();
    expect(screen.getByText("LANDMARK")).toBeInTheDocument();
    expect(screen.getByText("Obelisk")).toBeInTheDocument();
    expect(screen.getByText(/Created/i)).toBeInTheDocument();
  });

  it("clicking a world object triggers onFocusWorld", () => {
    const state = makeEmptyState();

    state.events.push({
      id: "e1",
      ts: 1,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 2,
      payload: {
        worldId: "obj1",
        kind: "LANDMARK",
        name: "Spire",
        hexes: [{ q: 1, r: 1 }],
      },
    });

    const onFocusWorld = vi.fn();

    render(
      <Inspector
        state={state}
        target={{ kind: "HEX", hex: { q: 1, r: 1 } }}
        onFocusHex={vi.fn()}
        onFocusWorld={onFocusWorld}
        onFocusEvent={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("Spire"));
    expect(onFocusWorld).toHaveBeenCalledWith("obj1");
  });

  it("clicking a timeline entry triggers onFocusEvent", () => {
    const state = makeEmptyState();

    state.events.push({
      id: "evt1",
      ts: 1,
      playerId: "P1",
      age: 1,
      round: 1,
      turn: 1,
      type: "WORLD_CREATE",
      cost: 2,
      payload: {
        worldId: "obj1",
        kind: "LANDMARK",
        hexes: [{ q: 0, r: 0 }],
      },
    });

    const onFocusEvent = vi.fn();

    render(
      <Inspector
        state={state}
        target={{ kind: "HEX", hex: { q: 0, r: 0 } }}
        onFocusHex={vi.fn()}
        onFocusWorld={vi.fn()}
        onFocusEvent={onFocusEvent}
      />
    );

    fireEvent.click(screen.getByText(/Created/i));
    expect(onFocusEvent).toHaveBeenCalledWith("evt1");
  });
});
```

## Test Coverage Goals

### Target Coverage

| Module | Target Coverage |
|--------|----------------|
| Selectors | 90%+ |
| Reducer | 80%+ |
| Components | 75%+ |
| Server Validation | 85%+ |

### Critical Paths

Ensure these critical paths are tested:

1. **Event submission flow**
   - Client validates locally
   - Server validates
   - Event broadcast
   - Client receives and applies

2. **Undo/revocation flow**
   - Turn-scoped undo
   - Draft rollback
   - Revoked events ignored

3. **Multiplayer sync**
   - Gap detection
   - Resync via PULL
   - Deduplication

4. **Action legality**
   - Age gates
   - Dependency rules
   - Protection rules

## Testing Strategy

### Unit Tests

- **Selectors**: Pure functions, easy to test
- **Reducer**: State transitions, event handling
- **Validation helpers**: Rule logic, edge cases

### Integration Tests

- **Event flow**: From submission to broadcast
- **World derivation**: Event log → world state
- **AP calculation**: Including revocations

### Component Tests

- **Behavioral**: Test interactions, not snapshots
- **Accessibility**: ARIA roles, keyboard navigation
- **Edge cases**: Empty states, revoked events

### Fuzz Testing

For multiplayer safety, consider fuzz testing:

- Malicious event payloads
- Out-of-order events
- Invalid coordinates
- Overspent AP attempts

### Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test selectWorldObjectsAtHex
```

### Coverage Report

After running tests with coverage:

```bash
npm test -- --coverage
```

View the report in `coverage/` directory.

## Test Organization

```
tests/
├── helpers.ts              # Shared test utilities
├── selectors/
│   ├── selectWorldObjectsAtHex.test.ts
│   ├── selectEventsAffectingHex.test.ts
│   └── apSelectors.test.ts
├── reducer.test.ts
├── components/
│   └── Inspector.test.tsx
└── server/
    └── validation.test.ts
```

## Best Practices

### Test Naming

- Use `describe` for test suites
- Use `it` for individual tests
- Name tests descriptively: what they test, not how

```ts
// Good
it("returns empty array if nothing occupies the hex", () => {});

// Bad
it("returns [] when no objects", () => {});
```

### Test Isolation

- Each test should be independent
- Use `makeEmptyState()` for fresh state
- Clean up mocks in `afterEach`

```ts
describe("selectApSpentThisTurn", () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it("sums AP spent in current turn only", () => {
    // Test
  });
});
```

### Avoid Snapshot Testing

Prefer behavioral assertions over snapshot tests:

```ts
// Good
expect(screen.getByText("Hex (0, 0)")).toBeInTheDocument();

// Avoid
expect(screen).toMatchSnapshot();
```

Snapshots:
- Break silently on UI changes
- Don't test behavior
- Create maintenance burden

## See Also

- [CORE_IMPLEMENTATION.md](CORE_IMPLEMENTATION.md) — Implementation details
- [UI_COMPONENTS.md](UI_COMPONENTS.md) — Component contracts
- [SERVER_IMPLEMENTATION.md](SERVER_IMPLEMENTATION.md) — Server validation
