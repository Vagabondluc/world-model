# Zustand Stores Integration Guide

This guide explains how to wire the new Zustand stores (`gameStore`, `worldStore`, `uiStore`) to the standalone-globe-project.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Integration Steps](#integration-steps)
4. [Code Examples](#code-examples)
5. [Event Dispatching](#event-dispatching)
6. [Selectors](#selectors)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The new Zustand stores provide centralized, type-safe state management with Zod validation:

### Store Summary

| Store | Purpose | Key State |
|-------|---------|-----------|
| [`gameStore`](../src/store/gameStore.ts) | Core game session state | Players, turns, rounds, ages, event log |
| [`worldStore`](../src/store/worldStore.ts) | World simulation state | Cells, cultures, civilizations, year |
| [`uiStore`](../src/store/uiStore.ts) | UI state | Selection, display modes, panel visibility, camera |

### Key Features

- **Event-sourced architecture**: State is derived from events via `dispatch()`
- **Zod validation middleware**: All state updates are validated at runtime
- **Immer integration**: Immutable updates with mutable syntax
- **Type-safe**: Full TypeScript support with exported types from [`schemas/index.ts`](../src/store/schemas/index.ts)

---

## Prerequisites

All required dependencies are already installed in [`package.json`](../package.json):

```json
{
  "dependencies": {
    "zustand": "^5.0.11",
    "zod": "^4.3.6",
    "immer": "^11.1.3",
    "uuid": "^13.0.0"
  }
}
```

No additional installation is required.

---

## Integration Steps

### Step 1: Import and Use Stores in Components

Import the store hooks at the top of your component files:

```tsx
// Import store hooks
import { useGameStore } from './store/gameStore';
import { useWorldStore } from './store/worldStore';
import { useUIStore } from './store/uiStore';

// Import types if needed
import type { GameEvent, GameSessionConfig } from './store/schemas';
```

### Step 2: Replace Existing State Management in App.tsx

The current [`App.tsx`](../src/App.tsx) uses React `useState` hooks. Replace them with store selectors and actions.

**Before:**
```tsx
// Old approach - scattered useState hooks
const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
const [displayMode, setDisplayMode] = useState<string>('BIOME');
const [showControlPanel, setShowControlPanel] = useState(true);
const [showInfoPanel, setShowInfoPanel] = useState(true);
```

**After:**
```tsx
// New approach - centralized store selectors
const selectedCellId = useUIStore(state => state.selection.selectedCellId);
const displayMode = useUIStore(state => state.displayMode);
const showControlPanel = useUIStore(state => state.panels.controlPanel);
const showInfoPanel = useUIStore(state => state.panels.cellInfo);
const showRegionStats = useUIStore(state => state.panels.regionStats);

// Actions from stores
const selectCell = useUIStore(state => state.selectCell);
const setDisplayMode = useUIStore(state => state.setDisplayMode);
const togglePanel = useUIStore(state => state.togglePanel);
```

### Step 3: Connect to GlobeRenderer

Update [`GlobeRenderer`](../src/components/globe/GlobeRenderer.tsx) to use store state for display mode and selection:

```tsx
import { useUIStore } from '../../store/uiStore';
import { useWorldStore } from '../../store/worldStore';

export const GlobeRenderer: React.FC<GlobeRendererProps> = (props) => {
    // Get display mode from store instead of prop
    const displayMode = useUIStore(state => state.displayMode);
    const selectedCellId = useUIStore(state => state.selection.selectedCellId);
    const hoveredCellId = useUIStore(state => state.selection.hoveredCellId);
    
    // Get world cells from store
    const worldCells = useWorldStore(state => state.cells);
    
    // Store actions
    const selectCell = useUIStore(state => state.selectCell);
    const hoverCell = useUIStore(state => state.hoverCell);
    
    // Remove these from props - now managed by store
    // const { displayMode, onCellSelect, onCellHover } = props;
    
    const handleCellSelect = (cellId: string | null, regionIds?: string[]) => {
        selectCell(cellId || undefined);
    };
    
    const handleCellHover = (cellId: string | null) => {
        hoverCell(cellId || undefined);
    };
    
    // ... rest of component
};
```

### Step 4: Connect to ControlPanel

Update [`ControlPanel`](../src/components/ControlPanel.tsx) to use store for display mode and panel visibility:

```tsx
import { useUIStore } from '../../store/uiStore';
import { useGameStore } from '../../store/gameStore';

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    // Get state from stores
    const displayMode = useUIStore(state => state.displayMode);
    const showControlPanel = useUIStore(state => state.panels.controlPanel);
    
    // Get game state
    const activePlayerId = useGameStore(state => state.activePlayerId);
    const activePlayer = useGameStore(state => 
        state.players.find(p => p.id === activePlayerId)
    );
    
    // Store actions
    const setDisplayMode = useUIStore(state => state.setDisplayMode);
    const cycleDisplayMode = useUIStore(state => state.cycleDisplayMode);
    const endTurn = useGameStore(state => state.endTurn);
    
    // Remove props - now managed by stores
    // const { displayMode, onSetDisplayMode } = props;
    
    const handleDisplayModeChange = (mode: string) => {
        setDisplayMode(mode as any); // Type assertion for display mode
    };
    
    const handleEndTurn = () => {
        endTurn();
    };
    
    // ... rest of component
};
```

### Step 5: Connect to CellInfoPanel and RegionStatsPanel

Update [`CellInfoPanel`](../src/components/globe/CellInfoPanel.tsx) to use store for selection:

```tsx
import { useUIStore } from '../../store/uiStore';
import { useWorldStore } from '../../store/worldStore';

export const CellInfoPanel: React.FC = () => {
    // Get selection from store
    const selectedCellId = useUIStore(state => state.selection.selectedCellId);
    const showPanel = useUIStore(state => state.panels.cellInfo);
    
    // Get cell data from world store
    const getCell = useWorldStore(state => state.getCell);
    const cellData = selectedCellId ? getCell(selectedCellId) : undefined;
    
    // Store actions
    const selectCell = useUIStore(state => state.selectCell);
    const hidePanel = useUIStore(state => () => {
        selectCell(undefined);
    });
    
    if (!showPanel || !selectedCellId) return null;
    
    return (
        <div className="cell-info-panel">
            <h3>Cell Info</h3>
            <InfoRow label="ID" value={selectedCellId} />
            <InfoRow label="Biome" value={cellData?.biome || 'Unknown'} />
            <InfoRow label="Elevation" value={cellData?.elevation || 0} />
            <InfoRow label="Moisture" value={cellData?.moisture || 0} />
            <InfoRow label="Temperature" value={cellData?.temperature || 0} />
            <button onClick={hidePanel}>Close</button>
        </div>
    );
};
```

Update [`RegionStatsPanel`](../src/components/globe/RegionStatsPanel.tsx):

```tsx
import { useUIStore } from '../../store/uiStore';
import { useWorldStore } from '../../store/worldStore';

export const RegionStatsPanel: React.FC = () => {
    // Get selection state from store
    const selectedCellId = useUIStore(state => state.selection.selectedCellId);
    const showPanel = useUIStore(state => state.panels.regionStats);
    
    // Get world data from store
    const cells = useWorldStore(state => Array.from(state.cells.values()));
    
    // For region selection, you'd need to track selected cell IDs
    // This could be added to uiStore if needed
    
    // Store actions
    const hidePanel = useUIStore(state => () => {
        state.setPanelVisibility('regionStats', false);
    });
    
    if (!showPanel || !selectedCellId) return null;
    
    const stats = useMemo(() => {
        return RegionSelector.getRegionStats([selectedCellId], cells);
    }, [selectedCellId, cells]);
    
    // ... rest of component
};
```

### Step 6: Connect to AIController

The [`AIController`](../src/components/ai/AIController.tsx) already uses `useGameStore`. Ensure it's properly integrated:

```tsx
import { useGameStore } from '../../store/gameStore';

export const AIController: React.FC<AIControllerProps> = (props) => {
    // Subscribe to store updates
    const activePlayerId = useGameStore(state => state.activePlayerId);
    const players = useGameStore(state => state.config?.players);
    const dispatch = useGameStore(state => state.dispatch);
    
    // Get full state without re-rendering
    const getStoreState = useGameStore.getState;
    
    // Check if it's AI's turn
    const isAiTurn = (() => {
        if (!players) return false;
        const activePlayer = players.find(p => p.id === activePlayerId);
        return activePlayer?.isHuman === false;
    })();
    
    // Dispatch events through the store
    const handleAIAction = (action: GameEvent) => {
        dispatch(action);
    };
    
    // ... rest of component
};
```

---

## Code Examples

### Example 1: Initializing the Game Store

```tsx
import { useGameStore } from './store/gameStore';

const App: React.FC = () => {
    const initialize = useGameStore(state => state.initialize);
    
    useEffect(() => {
        // Initialize game session
        initialize({
            players: [
                { id: 'P1', name: 'Player 1', color: '#FF0000', isHuman: true },
                { id: 'P2', name: 'Player 2', color: '#00FF00', isHuman: false },
            ],
            seed: 12345,
            worldSize: 'medium',
            startingAge: 1,
            enableAI: true,
        });
    }, [initialize]);
    
    // ... rest of component
};
```

### Example 2: Before/After - Display Mode Management

**Before (useState):**
```tsx
const [displayMode, setDisplayMode] = useState<string>('BIOME');

const handleModeChange = (mode: string) => {
    setDisplayMode(mode);
};
```

**After (useUIStore):**
```tsx
const displayMode = useUIStore(state => state.displayMode);
const setDisplayMode = useUIStore(state => state.setDisplayMode);

const handleModeChange = (mode: string) => {
    setDisplayMode(mode as any);
};
```

### Example 3: Before/After - Selection Management

**Before (useState):**
```tsx
const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);

const handleCellSelect = (cellId: string | null) => {
    setSelectedCellId(cellId);
};

const handleCellHover = (cellId: string | null) => {
    setHoveredCellId(cellId);
};
```

**After (useUIStore):**
```tsx
const selectedCellId = useUIStore(state => state.selection.selectedCellId);
const hoveredCellId = useUIStore(state => state.selection.hoveredCellId);
const selectCell = useUIStore(state => state.selectCell);
const hoverCell = useUIStore(state => state.hoverCell);

const handleCellSelect = (cellId: string | null) => {
    selectCell(cellId || undefined);
};

const handleCellHover = (cellId: string | null) => {
    hoverCell(cellId || undefined);
};
```

### Example 4: Before/After - Panel Visibility

**Before (useState):**
```tsx
const [showControlPanel, setShowControlPanel] = useState(true);
const [showInfoPanel, setShowInfoPanel] = useState(true);

const toggleControlPanel = () => {
    setShowControlPanel(prev => !prev);
};
```

**After (useUIStore):**
```tsx
const showControlPanel = useUIStore(state => state.panels.controlPanel);
const showInfoPanel = useUIStore(state => state.panels.cellInfo);
const togglePanel = useUIStore(state => state.togglePanel);

const toggleControlPanel = () => {
    togglePanel('controlPanel');
};
```

---

## Event Dispatching

Events are dispatched through the `gameStore.dispatch()` method. All events are validated by Zod schemas.

### Core Event Types

```tsx
import type { GameEvent } from './store/schemas';

// Game Start
const gameStartEvent: GameEvent = {
    id: crypto.randomUUID(),
    type: 'GAME_START',
    timestamp: new Date().toISOString(),
    payload: {
        players: [
            { id: 'P1', name: 'Player 1', color: '#FF0000', isHuman: true },
        ],
        seed: 12345,
        worldSize: 'medium',
        startingAge: 1,
        enableAI: true,
    },
};

// Turn End
const turnEndEvent: GameEvent = {
    id: crypto.randomUUID(),
    type: 'TURN_END',
    timestamp: new Date().toISOString(),
    payload: {
        playerId: 'P1',
    },
};

// Age Advance
const ageAdvanceEvent: GameEvent = {
    id: crypto.randomUUID(),
    type: 'AGE_ADVANCE',
    timestamp: new Date().toISOString(),
    payload: {
        toAge: 2,
    },
};

// Power Roll
const powerRollEvent: GameEvent = {
    id: crypto.randomUUID(),
    type: 'POWER_ROLL',
    timestamp: new Date().toISOString(),
    payload: {
        playerId: 'P1',
        result: 5,
    },
};

// Event Revoke
const revokeEvent: GameEvent = {
    id: crypto.randomUUID(),
    type: 'EVENT_REVOKE',
    timestamp: new Date().toISOString(),
    payload: {
        eventId: 'some-event-id',
        reason: 'Mistake in action',
    },
};
```

### Dispatching Events

```tsx
import { useGameStore } from './store/gameStore';

const MyComponent: React.FC = () => {
    const dispatch = useGameStore(state => state.dispatch);
    
    const handleEndTurn = () => {
        dispatch({
            id: crypto.randomUUID(),
            type: 'TURN_END',
            timestamp: new Date().toISOString(),
            payload: {
                playerId: 'P1',
            },
        });
    };
    
    return <button onClick={handleEndTurn}>End Turn</button>;
};
```

### Using Helper Actions

The store provides helper actions for common operations:

```tsx
import { useGameStore } from './store/gameStore';

const MyComponent: React.FC = () => {
    const endTurn = useGameStore(state => state.endTurn);
    const advanceRound = useGameStore(state => state.advanceRound);
    const advanceAge = useGameStore(state => state.advanceAge);
    
    return (
        <div>
            <button onClick={endTurn}>End Turn</button>
            <button onClick={advanceRound}>Advance Round</button>
            <button onClick={advanceAge}>Advance Age</button>
        </div>
    );
};
```

---

## Selectors

Zustand selectors allow you to subscribe to specific slices of state, preventing unnecessary re-renders.

### Basic Selectors

```tsx
// Subscribe to single value
const activePlayerId = useGameStore(state => state.activePlayerId);

// Subscribe to derived value
const activePlayer = useGameStore(state => 
    state.players.find(p => p.id === state.activePlayerId)
);

// Subscribe to multiple values (re-renders on any change)
const { activePlayerId, age, round } = useGameStore(state => ({
    activePlayerId: state.activePlayerId,
    age: state.age,
    round: state.round,
}));
```

### Using `getState` for Non-Subscribing Reads

For one-time reads or in event handlers where you don't want to subscribe:

```tsx
import { useGameStore } from './store/gameStore';

const MyComponent: React.FC = () => {
    const getStoreState = useGameStore.getState;
    
    const handleClick = () => {
        // Read state without subscribing
        const state = getStoreState();
        console.log('Current turn:', state.turn);
        console.log('Active player:', state.activePlayerId);
    };
    
    return <button onClick={handleClick}>Log State</button>;
};
```

### Shallow Comparison for Objects

When selecting objects, use shallow comparison to avoid re-renders:

```tsx
import { shallow } from 'zustand/shallow';

// Only re-renders if players array reference changes
const players = useGameStore(state => state.players, shallow);

// Only re-renders if any panel visibility changes
const panels = useUIStore(state => state.panels, shallow);
```

---

## Testing

### Running Test Suites

The stores have comprehensive test suites using Vitest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

### Test Files Location

- [`gameStore.test.ts`](../src/store/__tests__/gameStore.test.ts) - Game store tests
- [`worldStore.test.ts`](../src/store/__tests__/worldStore.test.ts) - World store tests
- [`uiStore.test.ts`](../src/store/__tests__/uiStore.test.ts) - UI store tests
- [`schemas.test.ts`](../src/store/__tests__/schemas.test.ts) - Schema validation tests

### Writing Integration Tests

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';
import { useUIStore } from '../uiStore';

describe('Component Integration', () => {
    beforeEach(() => {
        // Reset stores before each test
        useGameStore.getState().reset();
        useUIStore.getState().resetUI();
    });
    
    it('should update UI when cell is selected', () => {
        const selectCell = useUIStore.getState().selectCell;
        const selectedCellId = useUIStore.getState().selection.selectedCellId;
        
        expect(selectedCellId).toBeUndefined();
        
        selectCell('cell_123');
        
        const newSelectedId = useUIStore.getState().selection.selectedCellId;
        expect(newSelectedId).toBe('cell_123');
    });
    
    it('should dispatch events through game store', () => {
        const dispatch = useGameStore.getState().dispatch;
        const events = useGameStore.getState().events;
        
        expect(events.length).toBe(0);
        
        dispatch({
            id: crypto.randomUUID(),
            type: 'TURN_END',
            timestamp: new Date().toISOString(),
            payload: { playerId: 'P1' },
        });
        
        const newEvents = useGameStore.getState().events;
        expect(newEvents.length).toBe(1);
    });
});
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Store Not Updating

**Symptom:** State changes don't trigger re-renders.

**Solution:** Ensure you're using the store hook correctly:

```tsx
// ❌ Wrong - calling hook outside component
const state = useGameStore.getState();

// ✅ Correct - using hook inside component
const state = useGameStore(state => state.someValue);
```

#### Issue 2: Zod Validation Errors

**Symptom:** Console shows validation errors or app crashes with `ValidationError` when dispatching events.

**Note:** Stores are configured with `throwOnError: true` to catch invalid data immediately during development.

**Solution:** Ensure your event payloads match the schema:

```tsx
import { GameSessionConfigSchema } from './store/schemas';

// Validate before dispatching
const config = GameSessionConfigSchema.parse({
    players: [...],
    seed: 12345,
    worldSize: 'medium',
    startingAge: 1,
    enableAI: true,
});

dispatch({
    id: crypto.randomUUID(),
    type: 'GAME_START',
    timestamp: new Date().toISOString(),
    payload: config,
});
```

#### Issue 3: Unnecessary Re-renders

**Symptom:** Component re-renders when unrelated state changes.

**Solution:** Use specific selectors or shallow comparison:

```tsx
// ❌ Bad - subscribes to entire state
const state = useGameStore();

// ✅ Good - subscribes to specific values
const activePlayerId = useGameStore(state => state.activePlayerId);

// ✅ Better - uses shallow comparison for objects
const players = useGameStore(state => state.players, shallow);
```

#### Issue 4: Immer Mutability Errors

**Symptom:** "Cannot assign to read only property" errors.

**Solution:** The stores use Immer middleware, so you can mutate state directly in actions. Don't try to mutate state outside of store actions:

```tsx
// ❌ Wrong - mutating state outside store
const state = useGameStore.getState();
state.players.push({ ... }); // Error!

// ✅ Correct - using store action
const addPlayer = useGameStore(state => state.addPlayer);
addPlayer({ id: 'P4', ... });
```

#### Issue 5: Map/Set Not Persisting

**Symptom:** Maps and Sets lose data after updates.

**Solution:** Ensure Immer MapSet plugin is enabled (already done in store files):

```tsx
import { enableMapSet } from 'immer';
enableMapSet(); // This is already called in all store files
```

#### Issue 6: TypeScript Type Errors

**Symptom:** Type errors when accessing store state.

**Solution:** Import types from schemas:

```tsx
import type { GameEvent, GameSessionConfig, PlayerId } from './store/schemas';

const playerId: PlayerId = 'P1'; // Type-safe
```

### Debugging Tips

1. **Enable Zod Validation Logging:** The stores already have `logErrors: true` enabled. Check console for validation errors.

2. **Use React DevTools:** Install React DevTools to inspect component re-renders and state.

3. **Log State Changes:** Add console.log in store actions for debugging:

```tsx
// In store file
dispatch: (event) => {
    console.log('[gameStore] Dispatching:', event);
    set((state) => {
        const newState = gameReducer(state, event);
        console.log('[gameStore] New state:', newState);
        return newState;
    });
},
```

4. **Check Store State:** Use browser console to inspect store state:

```javascript
// In browser console
import { useGameStore } from './store/gameStore';
console.log(useGameStore.getState());
```

---

## Additional Resources

- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Immer Documentation](https://immerjs.github.io/immer/)
- [Zod Documentation](https://zod.dev/)
- [Project README](../README.md)
- [Store Schemas](../src/store/schemas/index.ts)

---

## Migration Checklist

Use this checklist to track your integration progress:

- [ ] Import store hooks in all components
- [ ] Replace `useState` with store selectors in `App.tsx`
- [ ] Update `GlobeRenderer` to use store state
- [ ] Update `ControlPanel` to use store state
- [ ] Update `CellInfoPanel` to use store state
- [ ] Update `RegionStatsPanel` to use store state
- [ ] Verify `AIController` store integration
- [ ] Remove unnecessary prop drilling
- [ ] Run test suites to verify integration
- [ ] Test all user interactions
- [ ] Verify no console errors or warnings
