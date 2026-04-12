# Debugging Dashboard Specification

**Project:** World Builder (Game)  
**Feature:** AI-Optimized Debugging Dashboard  
**Audience:** AI Agents (Antigravity Browser Control) & Developers  
**Goal:** Minimize "Time to Verification" by exposing direct state read/write capabilities to the DOM.

## 1. Architecture & Security

### 1.1. Context Isolation
The Dashboard **MUST** be implemented as a separate module lazily loaded only when:
- `process.env.NODE_ENV === 'development'` OR
- `window.location.search.includes('debug=true')`
- **Prod Safety:** The bundle must not be included in the production build `main.js`. Use `React.lazy` and dynamic `import()` wrapped in a conditional check.

### 1.2. DOM Footprint
The dashboard lives in a Shadow DOM or a high z-index overlay to avoid CSS collisions.
- **Root ID:** `#antigravity-debug-overlay`
- **Visibility:** Toggled via `Ctrl+Backtick` (`) or `window.toggleDebug()`.

## 2. Interface Definitions (The Contract)

### 2.1. State Inspection (Read Layer)
The dashboard renders a hidden `<script type="application/json">` or `<pre>` tag that contains the *current* critical game state. This allows the AI to parse the DOM to understand the world state without visual processing.

- **Element ID:** `ag-debug-state-dump`
- **Update Frequency:** Reactive (updates on Redux store change) OR On-Demand (click "Refresh State"). *Decision: Reactive, throttled to 500ms to allow "wait for state" logic.*

**JSON Schema:**
```typescript
interface DebugGameState {
  resources: {
    gold: number;
    science: number;
    culture: number;
  };
  era: {
    index: number; // 0-based index
    name: string;  // "Era I", "Era II"
    progress: number; // 0-100
  };
  world: {
    seed: string;
    width: number;
    height: number;
    revealedPercent: number;
  };
  units: Array<{
    id: string;
    type: string;
    position: { q: number, r: number };
  }>;
}
```

### 2.2. Action Runner (Write Layer)
Buttons must dispatch Redux actions directly or call Game Engine services. All buttons must have stable `data-testid` attributes.

**Naming Convention:** `debug-action-[category]-[action]`

| Category | Action | Test ID | Parameters (Implicit or Prompt) |
| :--- | :--- | :--- | :--- |
| **Resources** | Add 1000 Gold | `debug-action-res-add-gold` | `dispatch(addResource('gold', 1000))` |
| **Resources** | Add 1000 Science | `debug-action-res-add-science` | `dispatch(addResource('science', 1000))` |
| **Resources** | Infinite Mode | `debug-action-res-infinite` | Toggles "God Mode" flag |
| **Era** | Advance Era | `debug-action-era-next` | Forces completion of current era requirements |
| **Era** | Complete Tech | `debug-action-era-unlock-tech` | Unlocks all nodes in current graph |
| **Map** | Reveal All | `debug-action-map-reveal` | Clears Fog of War |
| **Map** | Spawn Unit | `debug-action-map-spawn` | Opens modal/prompt for Unit Type |

### 2.3. Event Logger (History Layer)
A scrolling list of recent game events to verify logic flow (e.g. "Did the battle actually happen?").

- **Container ID:** `ag-debug-event-log`
- **Item Class:** `.debug-log-entry`
- **Content:** timestamp + event type + payload summary.

## 3. Implementation Steps

### Step 1: Slice Exposure
Create a selector `selectDebugState` in `src/store/selectors/debugSelectors.ts` that aggregates the Schema defined in 2.1.

### Step 2: The Action Hook
Create `useDebugActions()` hook that maps the buttons in 2.2 to the actual:
- `dispatch(actions.game.addGold(1000))`
- `dispatch(actions.era.forceAdvance())`
- `dispatch(actions.map.revealAll())`

### Step 3: UI Component
Build `DebugDashboard.tsx` using a simple, non-styled HTML/CSS approach (inline styles) to prevent dependency on app theme.

### Step 4: Integration
Add `<DebugDashboard />` to `App.tsx` wrapped in:
```tsx
{ process.env.NODE_ENV === 'development' && <Suspense><LazyDebugDashboard /></Suspense> }
```

## 4. Verification
- **Automated Check:** The AI will open the app, ensure `#antigravity-debug-overlay` is present.
- **Functional Check:** Click `debug-action-res-add-gold`, parse `#ag-debug-state-dump`, verify `gold` increased by 1000.
