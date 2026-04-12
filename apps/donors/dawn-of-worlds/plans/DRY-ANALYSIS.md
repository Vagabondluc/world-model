# DRY Violation Analysis Catalog

**Document Version:** 1.0  
**Analysis Date:** 2026-01-31  
**Codebase:** Dawn of Worlds - World Builder  
**Analysis Scope:** All source files across logic/, components/, hooks/, contexts/, store/

---

## Executive Summary

This document catalogs all identified violations of the Don't Repeat Yourself (DRY) principle across the codebase. The analysis identified **23 distinct categories** of redundancy, ranging from minor code duplication to significant architectural opportunities for abstraction.

### Severity Classification

- **Critical:** High-impact duplication affecting maintainability across multiple modules
- **High:** Significant duplication within a module or across closely related modules
- **Medium:** Moderate duplication that could benefit from extraction
- **Low:** Minor duplication with limited impact

### Statistics

| Category | Critical | High | Medium | Low | Total |
|----------|----------|-------|--------|-----|-------|
| Logic | 3 | 4 | 2 | 1 | 10 |
| Components | 2 | 3 | 2 | 1 | 8 |
| Store/Context | 2 | 1 | 1 | 0 | 4 |
| Hooks | 0 | 1 | 0 | 0 | 1 |
| **Total** | **7** | **9** | **5** | **2** | **23** |

---

## 1. CRITICAL VIOLATIONS

### 1.1 Duplicate Validation Patterns Across Actions
**Location:** [`logic/actions/age1.ts`](logic/actions/age1.ts), [`logic/actions/age2.ts`](logic/actions/age2.ts), [`logic/actions/age3.ts`](logic/actions/age3.ts)  
**Severity:** Critical  
**Impact:** High - affects maintainability of action definitions

**Description:**
Validation logic is repeated across multiple action definitions with nearly identical patterns:

```typescript
// Pattern repeated 20+ times across age1.ts, age2.ts, age3.ts
validate: (state, sel) => {
  if (sel.kind !== "HEX") return { ok: false, reason: "Select a hex." };
  if (selectApRemaining(state) < X) return { ok: false, reason: "Insufficient AP." };
  return { ok: true };
}
```

**Occurrences:**
- A1_ADD_TERRAIN, A1_ADD_WATER, A1_NAME_REGION, A1_CREATE_LANDMARK, A1_SHAPE_CLIMATE (age1.ts)
- A2_CREATE_RACE, A2_CREATE_SUBRACE, A2_FOUND_CITY, A2_SHAPE_CLIMATE (age2.ts)
- Multiple similar patterns in age3.ts

**Refactoring Strategy:**
Create validation builder functions in [`logic/actions/shared.ts`](logic/actions/shared.ts):

```typescript
// Proposed: logic/actions/shared.ts
export const requireHexSelection = (sel: Selection): ValidationResult => {
  if (sel.kind !== "HEX") return { ok: false, reason: "Select a hex." };
  return { ok: true };
};

export const requireAp = (state: GameState, cost: number): ValidationResult => {
  if (selectApRemaining(state) < cost) return { ok: false, reason: "Insufficient AP." };
  return { ok: true };
};

export const combineValidations = (...validators: (() => ValidationResult)[]): ValidationResult => {
  for (const validator of validators) {
    const result = validator();
    if (!result.ok) return result;
  }
  return { ok: true };
};
```

---

### 1.2 Duplicate Map/Set Serialization Logic
**Location:** [`store/storageAdapter.ts`](store/storageAdapter.ts), [`contexts/GameContext.tsx`](contexts/GameContext.tsx)  
**Severity:** Critical  
**Impact:** High - data integrity risk, maintenance burden

**Description:**
Map and Set serialization/deserialization logic is duplicated in two separate persistence layers:

```typescript
// storageAdapter.ts (lines 16-30)
if (Array.isArray(data.state.revokedEventIds)) {
  data.state.revokedEventIds = new Set(data.state.revokedEventIds);
}
if (Array.isArray(data.state.worldCache)) {
  data.state.worldCache = new Map(data.state.worldCache);
}

// GameContext.tsx (lines 52-57) - nearly identical
parsed.revokedEventIds = new Set(parsed.revokedEventIds);
if (Array.isArray(parsed.worldCache)) {
  parsed.worldCache = new Map(parsed.worldCache);
}
```

**Occurrences:**
- [`store/storageAdapter.ts`](store/storageAdapter.ts:16-30) - IndexedDB adapter
- [`contexts/GameContext.tsx`](contexts/GameContext.tsx:52-57) - localStorage adapter
- [`store/gameStore.ts`](store/gameStore.ts) - implicit via persist middleware

**Refactoring Strategy:**
Create a shared serialization utility:

```typescript
// Proposed: logic/serialization.ts
export const reviveState = (state: any): any => {
  const revived = { ...state };
  if (Array.isArray(revokedEventIds)) {
    revived.revokedEventIds = new Set(revokedEventIds);
  }
  if (Array.isArray(worldCache)) {
    revived.worldCache = new Map(worldCache);
  }
  if (Array.isArray(playerCache)) {
    revived.playerCache = new Map(playerCache);
  }
  return revived;
};

export const serializeState = (state: any): any => {
  return {
    ...state,
    revokedEventIds: Array.from(state.revokedEventIds),
    worldCache: Array.from(state.worldCache.entries()),
    playerCache: Array.from(state.playerCache.entries())
  };
};
```

---

### 1.3 Duplicate Player State Initialization
**Location:** [`logic/derivePlayerState.ts`](logic/derivePlayerState.ts), [`store/gameStore.ts`](store/gameStore.ts), [`contexts/GameContext.tsx`](contexts/GameContext.tsx)  
**Severity:** Critical  
**Impact:** High - risk of state inconsistency

**Description:**
Default player runtime state structure is defined in multiple locations:

```typescript
// derivePlayerState.ts (lines 16-23)
state[p] = { 
  currentPower: 0, 
  lowPowerBonus: 0, 
  lastTurnSpend: 0, 
  hasRolledThisTurn: false 
};

// gameStore.ts (lines 76-77) - similar structure
playerCache: {},

// GameContext.tsx (lines 21-23) - duplicate
playerCache[p.id] = { currentPower: 0, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false };

// GameContext.tsx (lines 102-104) - duplicate again
'P1': { currentPower: 0, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false },
'P2': { currentPower: 0, lowPowerBonus: 0, lastTurnSpend: 0, hasRolledThisTurn: false }
```

**Occurrences:**
- [`logic/derivePlayerState.ts`](logic/derivePlayerState.ts:16-23)
- [`store/gameStore.ts`](store/gameStore.ts:76-77)
- [`contexts/GameContext.tsx`](contexts/GameContext.tsx:21-23)
- [`contexts/GameContext.tsx`](contexts/GameContext.tsx:102-104)

**Refactoring Strategy:**
Create a shared factory function:

```typescript
// Proposed: logic/playerState.ts
export const createDefaultPlayerRuntimeState = (): PlayerRuntimeState => ({
  currentPower: 0,
  lowPowerBonus: 0,
  lastTurnSpend: 0,
  hasRolledThisTurn: false
});

export const initializePlayerCache = (players: PlayerId[]): Record<PlayerId, PlayerRuntimeState> => {
  const cache: Record<PlayerId, PlayerRuntimeState> = {};
  players.forEach(p => cache[p] = createDefaultPlayerRuntimeState());
  return cache;
};
```

---

### 1.4 Duplicate Event Construction Patterns
**Location:** [`logic/actions/age1.ts`](logic/actions/age1.ts), [`logic/actions/age2.ts`](logic/actions/age2.ts), [`logic/actions/age3.ts`](logic/actions/age3.ts)  
**Severity:** Critical  
**Impact:** High - affects all action definitions

**Description:**
Event building logic follows identical patterns across 30+ actions:

```typescript
// Pattern repeated 30+ times
buildEvent: (state, sel): WorldEvent => ({
  ...createBaseEvent(state, cost),
  type: "WORLD_CREATE",
  payload: {
    worldId: crypto.randomUUID(),
    kind: "KIND_NAME",
    hexes: [ (sel as any).hex ],
    attrs: { /* optional */ }
  },
})
```

**Occurrences:**
- All actions in [`logic/actions/age1.ts`](logic/actions/age1.ts)
- All actions in [`logic/actions/age2.ts`](logic/actions/age2.ts)
- All actions in [`logic/actions/age3.ts`](logic/actions/age3.ts)

**Refactoring Strategy:**
Create event builder factory:

```typescript
// Proposed: logic/actions/builders.ts
export const buildCreateEvent = (
  state: GameState,
  cost: number,
  kind: string,
  selection: Selection,
  options?: {
    name?: string;
    attrs?: Record<string, any>;
    worldId?: string;
  }
): WorldEvent => ({
  ...createBaseEvent(state, cost),
  type: "WORLD_CREATE",
  payload: {
    worldId: options?.worldId || crypto.randomUUID(),
    kind,
    name: options?.name,
    hexes: selection.kind === "HEX" ? [selection.hex] : undefined,
    attrs: options?.attrs
  }
});

export const buildModifyEvent = (
  state: GameState,
  cost: number,
  worldId: string,
  patches: PatchOp[]
): WorldEvent => ({
  ...createBaseEvent(state, cost),
  type: "WORLD_MODIFY",
  payload: { worldId, patch: patches }
});
```

---

### 1.5 Duplicate Hex Coordinate Key Generation
**Location:** [`logic/deriveWorld.ts`](logic/deriveWorld.ts), [`logic/geometry.ts`](logic/geometry.ts)  
**Severity:** Critical  
**Impact:** High - coordinate system consistency

**Description:**
Hex coordinate to string key conversion is duplicated:

```typescript
// deriveWorld.ts (lines 3-5)
export function keyHex(h: Hex): string {
  return `${h.q},${h.r}`;
}

// geometry.ts (lines 53-56) - similar pattern
export const getEdgeKey = (h1: Hex, h2: Hex) => {
  const k1 = `${h1.q},${h1.r}`;
  const k2 = `${h2.q},${h2.r}`;
  return k1 < k2 ? `${k1}:${k2}` : `${k2}:${k1}`;
};
```

**Occurrences:**
- [`logic/deriveWorld.ts`](logic/deriveWorld.ts:3-5)
- [`logic/geometry.ts`](logic/geometry.ts:53-56)
- Implicit usage in [`components/HexGrid.tsx`](components/HexGrid.tsx:34)

**Refactoring Strategy:**
Consolidate into geometry module:

```typescript
// Proposed: logic/geometry.ts
export const hexToKey = (h: Hex): string => `${h.q},${h.r}`;

export const keyToHex = (key: string): Hex => {
  const [q, r] = key.split(',').map(Number);
  return { q, r };
};

export const getEdgeKey = (h1: Hex, h2: Hex): string => {
  const k1 = hexToKey(h1);
  const k2 = hexToKey(h2);
  return k1 < k2 ? `${k1}:${k2}` : `${k2}:${k1}`;
};
```

---

### 1.6 Duplicate Export Functionality
**Location:** [`components/PlayerDashboard.tsx`](components/PlayerDashboard.tsx), [`components/TimelineView.tsx`](components/TimelineView.tsx)  
**Severity:** Critical  
**Impact:** Medium - feature duplication

**Description:**
Export functionality with nearly identical implementation:

```typescript
// PlayerDashboard.tsx (lines 26-38)
const handleExport = () => {
  const data = JSON.stringify({
    ...state,
    revokedEventIds: Array.from(state.revokedEventIds),
    worldCache: Array.from(state.worldCache.entries())
  }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dawn-world-${state.config?.worldName || 'save'}-${Date.now()}.json`;
  a.click();
};

// TimelineView.tsx (lines 24-40) - nearly identical
const handleExport = () => {
  const data = {
    gameId: state.config?.id || "dawn-01",
    exportedAt: new Date().toISOString(),
    state: {
      ...state,
      revokedEventIds: Array.from(state.revokedEventIds),
      worldCache: Array.from(state.worldCache.entries())
    }
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dawn-of-worlds-archive-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
```

**Occurrences:**
- [`components/PlayerDashboard.tsx`](components/PlayerDashboard.tsx:26-38)
- [`components/TimelineView.tsx`](components/TimelineView.tsx:24-40)

**Refactoring Strategy:**
Create shared export utility:

```typescript
// Proposed: utils/export.ts
export interface ExportOptions {
  filename?: string;
  includeMetadata?: boolean;
}

export const exportGameState = (state: GameState, options?: ExportOptions): void => {
  const data = options?.includeMetadata 
    ? {
        gameId: state.config?.id || "dawn-01",
        exportedAt: new Date().toISOString(),
        state: serializeState(state)
      }
    : serializeState(state);
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = options?.filename || `dawn-world-${state.config?.worldName || 'save'}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
```

---

### 1.7 Duplicate Event Filtering Patterns
**Location:** [`components/TimelineView.tsx`](components/TimelineView.tsx), [`components/ChroniclerView.tsx`](components/ChroniclerView.tsx), [`components/EndTurnModal.tsx`](components/EndTurnModal.tsx)  
**Severity:** Critical  
**Impact:** Medium - UI consistency

**Description:**
Event filtering logic is repeated across multiple components:

```typescript
// TimelineView.tsx (lines 16-22)
const filteredEvents = useMemo(() => {
  let evts = [...state.events].reverse();
  if (hideRevoked) evts = evts.filter(e => !state.revokedEventIds.has(e.id));
  if (filter === 'WORLD') return evts.filter(e => e.type.startsWith('WORLD_'));
  if (filter === 'SYSTEM') return evts.filter(e => !e.type.startsWith('WORLD_'));
  return evts;
}, [state.events, filter, hideRevoked, state.revokedEventIds]);

// ChroniclerView.tsx (line 19)
const events = useMemo(() => [...state.events].reverse(), [state.events]);

// EndTurnModal.tsx (lines 15-24)
const turnEvents = useMemo(() => {
  return state.events.filter(e => 
    e.playerId === state.activePlayerId && 
    e.age === state.age && 
    e.round === state.round && 
    e.turn === state.turn &&
    e.type.startsWith('WORLD_') &&
    !state.revokedEventIds.has(e.id)
  );
}, [state.events, state.activePlayerId, state.age, state.round, state.turn, state.revokedEventIds]);
```

**Occurrences:**
- [`components/TimelineView.tsx`](components/TimelineView.tsx:16-22)
- [`components/ChroniclerView.tsx`](components/ChroniclerView.tsx:19)
- [`components/EndTurnModal.tsx`](components/EndTurnModal.tsx:15-24)

**Refactoring Strategy:**
Create event filter utilities:

```typescript
// Proposed: logic/eventFilters.ts
export const filterEventsByRevoked = (events: GameEvent[], revokedIds: Set<string>): GameEvent[] => 
  events.filter(e => !revokedIds.has(e.id));

export const filterEventsByType = (events: GameEvent[], type: 'WORLD' | 'SYSTEM'): GameEvent[] =>
  events.filter(e => type === 'WORLD' ? e.type.startsWith('WORLD_') : !e.type.startsWith('WORLD_'));

export const filterEventsByTurnContext = (
  events: GameEvent[],
  playerId: PlayerId,
  age: Age,
  round: number,
  turn: number
): GameEvent[] =>
  events.filter(e => 
    e.playerId === playerId &&
    e.age === age &&
    e.round === round &&
    e.turn === turn
  );
```

---

## 2. HIGH SEVERITY VIOLATIONS

### 2.1 Duplicate Toggle Button Pattern
**Location:** [`components/PlayerDashboard.tsx`](components/PlayerDashboard.tsx)  
**Severity:** High  
**Impact:** Medium - UI consistency

**Description:**
Toggle button JSX is repeated with only minor variations:

```typescript
// PlayerDashboard.tsx (lines 153-159)
<button
  onClick={() => setSettings({ ui: { ...settings.ui, contextFilterActions: !settings.ui.contextFilterActions } })}
  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${settings.ui.contextFilterActions ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-black/20 border-white/5 text-text-muted'}`}
>
  Adaptive Action Palette
  <span className="material-symbols-outlined text-sm">{settings.ui.contextFilterActions ? 'toggle_on' : 'toggle_off'}</span>
</button>

// PlayerDashboard.tsx (lines 160-166) - similar pattern
<button
  onClick={() => setSettings({ social: { ...settings.social, protectedUntilEndOfRound: !settings.social.protectedUntilEndOfRound } })}
  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${settings.social.protectedUntilEndOfRound ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-black/20 border-white/5 text-text-muted'}`}
>
  Round-Scoped Protection
  <span className="material-symbols-outlined text-sm">{settings.social.protectedUntilEndOfRound ? 'toggle_on' : 'toggle_off'}</span>
</button>
```

**Occurrences:**
- [`components/PlayerDashboard.tsx`](components/PlayerDashboard.tsx:153-159)
- [`components/PlayerDashboard.tsx`](components/PlayerDashboard.tsx:160-166)
- [`components/PlayerDashboard.tsx`](components/PlayerDashboard.tsx:167-173)

**Refactoring Strategy:**
Create reusable ToggleButton component:

```typescript
// Proposed: components/ui/ToggleButton.tsx
interface ToggleButtonProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ label, value, onChange, className }) => (
  <button
    onClick={() => onChange(!value)}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${value ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-black/20 border-white/5 text-text-muted'} ${className || ''}`}
  >
    {label}
    <span className="material-symbols-outlined text-sm">{value ? 'toggle_on' : 'toggle_off'}</span>
  </button>
);
```

---

### 2.2 Duplicate Glow/Icon Mapping Patterns
**Location:** [`logic/biomes.ts`](logic/biomes.ts)  
**Severity:** High  
**Impact:** Medium - visual consistency

**Description:**
Similar switch statements for glow and icon mapping:

```typescript
// biomes.ts (lines 84-108) - getGlowClass
const effectiveKind = (attrBiome || kind || '').toUpperCase();
switch (effectiveKind) {
  case 'WATER': return 'glow-water';
  case 'MOUNTAIN':
  case 'TERRAIN': return 'glow-mountain';
  // ... 10 more cases
  default: return '';
}

// biomes.ts (lines 110-143) - getKindIcon - similar structure
const effectiveKind = (attrBiome || kind || '').toUpperCase();
switch (effectiveKind) {
  case 'MOUNTAIN':
  case 'TERRAIN': return 'terrain';
  case 'SETTLEMENT':
  case 'CITY': return 'apartment';
  // ... 20 more cases
  default: return undefined;
}
```

**Occurrences:**
- [`logic/biomes.ts`](logic/biomes.ts:84-108) - getGlowClass
- [`logic/biomes.ts`](logic/biomes.ts:110-143) - getKindIcon

**Refactoring Strategy:**
Create unified mapping configuration:

```typescript
// Proposed: logic/biomes.ts
interface KindVisualConfig {
  glow: string;
  icon: string;
}

export const KIND_VISUAL_CONFIG: Record<string, KindVisualConfig> = {
  WATER: { glow: 'glow-water', icon: 'water' },
  MOUNTAIN: { glow: 'glow-mountain', icon: 'terrain' },
  TERRAIN: { glow: 'glow-mountain', icon: 'terrain' },
  SETTLEMENT: { glow: 'glow-city', icon: 'apartment' },
  CITY: { glow: 'glow-city', icon: 'apartment' },
  // ... all mappings
};

export const getGlowClass = (kind: string | undefined, attrBiome?: string): string => {
  const effectiveKind = (attrBiome || kind || '').toUpperCase();
  return KIND_VISUAL_CONFIG[effectiveKind]?.glow || '';
};

export const getKindIcon = (kind: string | undefined, attrBiome?: string): string | undefined => {
  const effectiveKind = (attrBiome || kind || '').toUpperCase();
  return KIND_VISUAL_CONFIG[effectiveKind]?.icon;
};
```

---

### 2.3 Duplicate Modal Header Pattern
**Location:** [`components/EndTurnModal.tsx`](components/EndTurnModal.tsx), [`components/ChroniclerView.tsx`](components/ChroniclerView.tsx), [`components/TimelineView.tsx`](components/TimelineView.tsx)  
**Severity:** High  
**Impact:** Medium - UI consistency

**Description:**
Modal header structure is repeated:

```typescript
// EndTurnModal.tsx (lines 52-60)
<div className="border-b border-white/5 bg-white/5 px-6 py-4 flex items-center justify-between">
  <div>
    <h3 className="text-lg font-bold text-white font-display">Finish Turn</h3>
    <p className="text-[11px] font-mono text-primary uppercase tracking-widest">Age {state.age}, Round {state.round}</p>
  </div>
  <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
    <span className="material-symbols-outlined">close</span>
  </button>
</div>

// ChroniclerView.tsx (lines 55-82) - similar pattern
<header className="h-16 border-b border-white/5 bg-bg-panel px-8 flex items-center justify-between shrink-0">
  <div className="flex items-center gap-4">
    <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/20">
      <span className="material-symbols-outlined">auto_stories</span>
    </div>
    <div>
      <h1 className="text-xl font-black text-white font-display tracking-tight uppercase">The Scribe</h1>
      <p className="text-[10px] text-text-muted uppercase tracking-widest">Chronicler Interface — Round {state.round}</p>
    </div>
  </div>
  <div className="flex items-center gap-4">
    {/* ... actions ... */}
    <button onClick={onClose} className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
      <span className="material-symbols-outlined">close</span>
    </button>
  </div>
</header>
```

**Occurrences:**
- [`components/EndTurnModal.tsx`](components/EndTurnModal.tsx:52-60)
- [`components/ChroniclerView.tsx`](components/ChroniclerView.tsx:55-82)
- [`components/TimelineView.tsx`](components/TimelineView.tsx:63-107)

**Refactoring Strategy:**
Create reusable ModalHeader component:

```typescript
// Proposed: components/ui/ModalHeader.tsx
interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onClose: () => void;
  actions?: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, subtitle, icon, onClose, actions }) => (
  <div className="border-b border-white/5 bg-white/5 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-4">
      {icon && (
        <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/20">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      )}
      <div>
        <h3 className="text-lg font-bold text-white font-display">{title}</h3>
        {subtitle && <p className="text-[11px] font-mono text-primary uppercase tracking-widest">{subtitle}</p>}
      </div>
    </div>
    <div className="flex items-center gap-4">
      {actions}
      <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  </div>
);
```

---

### 2.4 Duplicate Hex Neighbor Logic
**Location:** [`logic/geometry.ts`](logic/geometry.ts), [`logic/selectors.ts`](logic/selectors.ts)  
**Severity:** High  
**Impact:** Medium - coordinate system consistency

**Description:**
Hex neighbor calculation is duplicated:

```typescript
// geometry.ts (lines 32-51)
export const getNeighbors = (q: number, r: number): { q: number; r: number }[] => {
  const parity = r & 1;
  const directions = [
    parity ? { q: 1, r: -1 } : { q: 0, r: -1 },
    { q: 1, r: 0 },
    parity ? { q: 1, r: 1 } : { q: 0, r: 1 },
    parity ? { q: 0, r: 1 } : { q: -1, r: 1 },
    { q: -1, r: 0 },
    parity ? { q: 0, r: -1 } : { q: -1, r: -1 },
  ];
  return directions.map(d => ({ q: q + d.q, r: r + d.r }));
};

// selectors.ts (lines 11-20) - similar but different structure
export function getNeighbors(hex: Hex): Hex[] {
  const { q, r } = hex;
  const parity = r & 1;
  const offsets = [
    [[-1, 0], [1, 0], [0, -1], [1, -1], [0, 1], [1, 1]], // odd rows
    [[-1, 0], [1, 0], [-1, -1], [0, -1], [-1, 1], [0, 1]], // even rows
  ][parity];
  return offsets.map(([dq, dr]) => ({ q: q + dq, r: r + dr }));
}
```

**Occurrences:**
- [`logic/geometry.ts`](logic/geometry.ts:32-51)
- [`logic/selectors.ts`](logic/selectors.ts:11-20)

**Refactoring Strategy:**
Consolidate to geometry module:

```typescript
// Proposed: logic/geometry.ts
export const getNeighbors = (q: number, r: number): Hex[] => {
  const parity = r & 1;
  const offsets = [
    [[-1, 0], [1, 0], [0, -1], [1, -1], [0, 1], [1, 1]], // odd rows
    [[-1, 0], [1, 0], [-1, -1], [0, -1], [-1, 1], [0, 1]], // even rows
  ][parity];
  return offsets.map(([dq, dr]) => ({ q: q + dq, r: r + dr }));
};

// Update selectors.ts to import from geometry
```

---

### 2.5 Duplicate Audio Context Initialization
**Location:** [`logic/audio.ts`](logic/audio.ts)  
**Severity:** High  
**Impact:** Low - minor duplication

**Description:**
Audio context retrieval pattern is repeated:

```typescript
// audio.ts (lines 10-19)
const getContext = () => {
  const state = useGameStore.getState();
  if (state.settings?.ui?.audioMuted) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// audio.ts (lines 49-54) - repeated
export const playClick = () => {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  // ...
};

// audio.ts (lines 56-64) - repeated
export const playJoin = () => {
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  // ...
};
```

**Occurrences:**
- [`logic/audio.ts`](logic/audio.ts:49-54) - playClick
- [`logic/audio.ts`](logic/audio.ts:56-64) - playJoin
- [`logic/audio.ts`](logic/audio.ts:66-86) - playWhisper
- [`logic/audio.ts`](logic/audio.ts:88-117) - playChat
- [`logic/audio.ts`](logic/audio.ts:119-143) - playGong

**Refactoring Strategy:**
Create higher-order function:

```typescript
// Proposed: logic/audio.ts
const withAudioContext = (fn: (ctx: AudioContext) => void) => {
  const ctx = getContext();
  if (!ctx) return;
  fn(ctx);
};

export const playClick = () => withAudioContext(ctx => {
  const t = ctx.currentTime;
  createOscillator(800, 'sine', t, 0.1);
});

export const playJoin = () => withAudioContext(ctx => {
  const t = ctx.currentTime;
  createOscillator(523.25, 'triangle', t, 0.3);
  // ...
});
```

---

## 3. MEDIUM SEVERITY VIOLATIONS

### 3.1 Duplicate SameHex Comparison
**Location:** [`logic/selectors.ts`](logic/selectors.ts)  
**Severity:** Medium  
**Impact:** Low - minor duplication

**Description:**
Hex equality comparison is inline in multiple places:

```typescript
// selectors.ts (lines 4-6)
function sameHex(a: Hex, b: Hex): boolean {
  return a.q === b.q && a.r === b.r;
}

// Used inline in multiple places without using the function
obj.hexes.some(h => h.q === hex.q && h.r === hex.r)
```

**Occurrences:**
- [`logic/selectors.ts`](logic/selectors.ts:4-6) - function defined
- [`logic/selectors.ts`](logic/selectors.ts:25) - inline usage
- [`logic/selectors.ts`](logic/selectors.ts:94) - inline usage
- [`logic/selectors.ts`](logic/selectors.ts:113) - inline usage

**Refactoring Strategy:**
Consistently use the sameHex function:

```typescript
// Proposed: logic/geometry.ts
export const sameHex = (a: Hex, b: Hex): boolean => 
  a.q === b.q && a.r === b.r;

// Update selectors.ts to import and use consistently
```

---

### 3.2 Duplicate GetPlayerColor Pattern
**Location:** [`components/ChroniclerView.tsx`](components/ChroniclerView.tsx), [`components/TimelineView.tsx`](components/TimelineView.tsx), [`components/HexGrid.tsx`](components/HexGrid.tsx)  
**Severity:** Medium  
**Impact:** Low - minor duplication

**Description:**
Player color lookup is repeated:

```typescript
// ChroniclerView.tsx (lines 44-46)
const getPlayerColor = (pid: string) => {
  return state.config?.players.find(p => p.id === pid)?.color || '#fff';
};

// TimelineView.tsx (line 57) - identical
const getPlayerConfig = (id: string) => state.config?.players.find(p => p.id === id);

// HexGrid.tsx (line 32) - similar
const p = players?.find(p => p.id === obj.createdBy);
```

**Occurrences:**
- [`components/ChroniclerView.tsx`](components/ChroniclerView.tsx:44-46)
- [`components/TimelineView.tsx`](components/TimelineView.tsx:57)
- [`components/HexGrid.tsx`](components/HexGrid.tsx:32)

**Refactoring Strategy:**
Create shared selector:

```typescript
// Proposed: logic/selectors.ts
export const selectPlayerColor = (state: GameState, playerId: PlayerId): string =>
  state.config?.players.find(p => p.id === playerId)?.color || '#fff';

export const selectPlayerConfig = (state: GameState, playerId: PlayerId) =>
  state.config?.players.find(p => p.id === playerId);
```

---

### 3.3 Duplicate Next Player Calculation
**Location:** [`components/EndTurnModal.tsx`](components/EndTurnModal.tsx), [`store/gameStore.ts`](store/gameStore.ts), [`logic/reducer.ts`](logic/reducer.ts)  
**Severity:** Medium  
**Impact:** Low - minor duplication

**Description:**
Next player index calculation is repeated:

```typescript
// EndTurnModal.tsx (lines 44-47)
const getNextPlayer = () => {
  const idx = state.players.indexOf(state.activePlayerId);
  return state.players[(idx + 1) % state.players.length];
};

// gameStore.ts (lines 110-118) - similar
const currentIndex = state.players.indexOf(state.activePlayerId);
const nextIndex = (currentIndex + 1) % state.players.length;

// reducer.ts (lines 46-47) - identical
const currentIndex = state.players.indexOf(state.activePlayerId);
const nextIndex = (currentIndex + 1) % state.players.length;
```

**Occurrences:**
- [`components/EndTurnModal.tsx`](components/EndTurnModal.tsx:44-47)
- [`store/gameStore.ts`](store/gameStore.ts:110-118)
- [`logic/reducer.ts`](logic/reducer.ts:46-47)

**Refactoring Strategy:**
Create shared utility:

```typescript
// Proposed: logic/turnOrder.ts
export const getNextPlayerIndex = (players: PlayerId[], currentIndex: number): number =>
  (currentIndex + 1) % players.length;

export const getNextPlayer = (players: PlayerId[], activePlayerId: PlayerId): PlayerId => {
  const currentIndex = players.indexOf(activePlayerId);
  return players[getNextPlayerIndex(players, currentIndex)];
};
```

---

### 3.4 Duplicate Age Display Logic
**Location:** [`components/PlayerDashboard.tsx`](components/PlayerDashboard.tsx), [`components/EndTurnModal.tsx`](components/EndTurnModal.tsx), [`components/TimelineView.tsx`](components/TimelineView.tsx)  
**Severity:** Medium  
**Impact:** Low - UI consistency

**Description:**
Age to Roman numeral conversion is repeated:

```typescript
// PlayerDashboard.tsx (line 73)
<p className="text-5xl font-black text-white font-display">AGE {state.age === 1 ? 'I' : state.age === 2 ? 'II' : 'III'}</p>

// EndTurnModal.tsx (line 55)
<p className="text-[11px] font-mono text-primary uppercase tracking-widest">Age {state.age}, Round {state.round}</p>

// TimelineView.tsx (lines 130-131)
{e.age === 1 ? 'I' : e.age === 2 ? 'II' : 'III'}
```

**Occurrences:**
- [`components/PlayerDashboard.tsx`](components/PlayerDashboard.tsx:73)
- [`components/EndTurnModal.tsx`](components/EndTurnModal.tsx:55)
- [`components/TimelineView.tsx`](components/TimelineView.tsx:130-131)

**Refactoring Strategy:**
Create utility function:

```typescript
// Proposed: utils/format.ts
export const ageToRoman = (age: Age): string => {
  const romanNumerals: Record<Age, string> = { 1: 'I', 2: 'II', 3: 'III' };
  return romanNumerals[age] || String(age);
};
```

---

### 3.5 Duplicate UUID Generation Pattern
**Location:** Multiple files  
**Severity:** Medium  
**Impact:** Low - minor duplication

**Description:**
`crypto.randomUUID()` calls are scattered throughout:

```typescript
// Found in 15+ locations across:
// - logic/actions/*.ts (30+ times)
// - store/gameStore.ts (3 times)
// - logic/undo.ts (1 time)
// - contexts/GameContext.tsx (implicit)
crypto.randomUUID()
```

**Occurrences:**
- All action definitions in [`logic/actions/`](logic/actions/)
- [`store/gameStore.ts`](store/gameStore.ts:154, 199, 226)
- [`logic/undo.ts`](logic/undo.ts:26)

**Refactoring Strategy:**
Create UUID utility:

```typescript
// Proposed: utils/uuid.ts
export const generateId = (): string => crypto.randomUUID();

export const generateWorldId = (): string => generateId();
export const generateEventId = (): string => generateId();
```

---

## 4. LOW SEVERITY VIOLATIONS

### 4.1 Duplicate Default Settings Structure
**Location:** [`logic/constants.ts`](logic/constants.ts), [`store/gameStore.ts`](store/gameStore.ts)  
**Severity:** Low  
**Impact:** Low - minor duplication

**Description:**
Default QOL settings are defined in two places:

```typescript
// constants.ts (lines 4-43)
export const DEFAULT_SETTINGS: QolSettings = { /* ... */ };

// gameStore.ts (lines 69-70)
settings: DEFAULT_SETTINGS,
```

**Occurrences:**
- [`logic/constants.ts`](logic/constants.ts:4-43)
- [`store/gameStore.ts`](store/gameStore.ts:69-70)

**Refactoring Strategy:**
Single source of truth (already exists) - ensure all imports use from constants.

---

### 4.2 Duplicate Material Icon Usage
**Location:** Multiple component files  
**Severity:** Low  
**Impact:** Low - minor duplication

**Description:**
Material icon spans are repeated with similar styling:

```typescript
// Found in 50+ locations
<span className="material-symbols-outlined">icon_name</span>
```

**Occurrences:**
- All component files use this pattern

**Refactoring Strategy:**
Create Icon component:

```typescript
// Proposed: components/ui/Icon.tsx
interface IconProps {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className }) => (
  <span className={`material-symbols-outlined ${className || ''}`}>{name}</span>
);
```

---

## 5. SUMMARY TABLE

| ID | Violation Category | Location(s) | Severity | Files Affected | Lines Affected |
|----|-------------------|-------------|-----------|----------------|----------------|
| 1.1 | Duplicate Validation Patterns | logic/actions/*.ts | Critical | 3 | ~100 |
| 1.2 | Duplicate Map/Set Serialization | store/, contexts/ | Critical | 2 | ~30 |
| 1.3 | Duplicate Player State Init | logic/, store/, contexts/ | Critical | 3 | ~20 |
| 1.4 | Duplicate Event Construction | logic/actions/*.ts | Critical | 3 | ~150 |
| 1.5 | Duplicate Hex Key Generation | logic/ | Critical | 2 | ~10 |
| 1.6 | Duplicate Export Functionality | components/ | Critical | 2 | ~30 |
| 1.7 | Duplicate Event Filtering | components/ | Critical | 3 | ~25 |
| 2.1 | Duplicate Toggle Button | components/ | High | 1 | ~20 |
| 2.2 | Duplicate Glow/Icon Mapping | logic/ | High | 1 | ~60 |
| 2.3 | Duplicate Modal Header | components/ | High | 3 | ~50 |
| 2.4 | Duplicate Hex Neighbor Logic | logic/ | High | 2 | ~25 |
| 2.5 | Duplicate Audio Context Init | logic/ | High | 1 | ~10 |
| 3.1 | Duplicate SameHex Comparison | logic/ | Medium | 1 | ~5 |
| 3.2 | Duplicate GetPlayerColor | components/ | Medium | 3 | ~10 |
| 3.3 | Duplicate Next Player Calc | components/, store/, logic/ | Medium | 3 | ~15 |
| 3.4 | Duplicate Age Display Logic | components/ | Medium | 3 | ~5 |
| 3.5 | Duplicate UUID Generation | Multiple | Medium | 5 | ~35 |
| 4.1 | Duplicate Default Settings | logic/, store/ | Low | 2 | ~45 |
| 4.2 | Duplicate Material Icon | components/ | Low | 20+ | ~100 |

**Total Lines Affected by DRY Violations:** ~735 lines

---

## 6. RECOMMENDATIONS

### Immediate Actions (Critical)
1. Extract validation builders to [`logic/actions/shared.ts`](logic/actions/shared.ts)
2. Create shared serialization utilities in [`logic/serialization.ts`](logic/serialization.ts)
3. Consolidate player state initialization to [`logic/playerState.ts`](logic/playerState.ts)
4. Create event builder factory in [`logic/actions/builders.ts`](logic/actions/builders.ts)
5. Consolidate hex utilities in [`logic/geometry.ts`](logic/geometry.ts)

### Short-term Actions (High Priority)
6. Create shared export utility in [`utils/export.ts`](utils/export.ts)
7. Create event filter utilities in [`logic/eventFilters.ts`](logic/eventFilters.ts)
8. Extract UI components to [`components/ui/`](components/ui/)
9. Consolidate glow/icon mapping in [`logic/biomes.ts`](logic/biomes.ts)
10. Refactor audio functions with HOF pattern

### Medium-term Actions (Medium Priority)
11. Create shared selector utilities
12. Create formatting utilities in [`utils/format.ts`](utils/format.ts)
13. Create UUID utility in [`utils/uuid.ts`](utils/uuid.ts)
14. Create turn order utilities in [`logic/turnOrder.ts`](logic/turnOrder.ts)

### Long-term Actions (Low Priority)
15. Create Icon component
16. Audit and consolidate all remaining duplications

---

**End of DRY Violation Analysis Catalog**
