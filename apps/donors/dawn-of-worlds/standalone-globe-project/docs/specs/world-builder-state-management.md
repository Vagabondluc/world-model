# World Builder State Management Specification

## Document Information
- **Version**: 1.0.0
- **Date**: 2026-02-06
- **Status**: Technical Specification
- **Author**: World Builder Team

---

## 1. Architecture Overview

### 1.1 Core Principles

The World Builder state management system is built on the following principles:

1. **Event Sourcing**: All state changes are driven by discrete events that are stored in an immutable log
2. **Single Source of Truth**: State is derived from events, never mutated directly
3. **Type Safety**: Full TypeScript type coverage with Zod runtime validation
4. **Predictability**: State transitions are pure functions of current state and events
5. **Testability**: All components are unit testable with deterministic behavior

### 1.2 Technology Stack

- **State Management**: Zustand v4.x
- **Validation**: Zod v3.x (Fail-Fast Strategy)
- **Immutability**: Immer v10.x
- **Testing**: Vitest v4.x

### 1.3 Store Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Application                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Store Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  gameStore   │  │  worldStore  │  │   uiStore    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    ┌───────▼───────┐                         │
│                    │ Zod Middleware│                         │
│                    └───────┬───────┘                         │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Schema Layer                            │
│                    (Zod Validation)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Domain Model

### 2.1 Core Entities

#### Player
Represents a participant in the game session.

```typescript
interface Player {
  id: PlayerId;           // Unique identifier (e.g., "P1", "P2")
  name: string;           // Display name
  color: HexColor;        // Player color for UI
  isHuman: boolean;       // Human or AI controlled
  cultureId?: CultureId;  // Associated culture (optional)
}
```

#### GameSessionConfig
Configuration for a new game session.

```typescript
interface GameSessionConfig {
  players: PlayerConfig[];
  seed: number;
  worldSize: 'small' | 'medium' | 'large';
  startingAge: 1 | 2 | 3;
  enableAI: boolean;
}
```

#### Cell
A single hexagonal cell on the world grid.

```typescript
interface Cell {
  id: CellId;                    // Unique identifier
  q: number;                     // Axial coordinate q
  r: number;                     // Axial coordinate r
  elevation: number;             // 0-1, terrain height
  moisture: number;              // 0-1, water availability
  temperature: number;           // 0-1, climate temperature
  biome: BiomeType;              // Terrain type
  ownerId?: CivilizationId;      // Owning civilization
  cultureId?: CultureId;         // Dominant culture
  population: number;            // Population count
  development: number;           // Development level 0-1
}
```

#### Culture
A cultural group that can span multiple cells.

```typescript
interface Culture {
  id: CultureId;
  name: string;
  language: string;
  traits: string[];
  originCellId: CellId;
  color: HexColor;
  foundedYear: number;
}
```

#### Civilization
A political entity that controls territory.

```typescript
interface Civilization {
  id: CivilizationId;
  name: string;
  cultureId: CultureId;
  capitalCellId: CellId;
  controlledCells: Set<CellId>;
  foundedYear: number;
  color: HexColor;
}
```

### 2.2 State Containers

#### WorldState
The complete state of the world simulation.

```typescript
interface WorldState {
  cells: Map<CellId, Cell>;
  cultures: Map<CultureId, Culture>;
  civilizations: Map<CivilizationId, Civilization>;
  year: number;
  generationParams: WorldGenerationParams;
}
```

#### GameState
The complete state of the game session.

```typescript
interface GameState {
  config: GameSessionConfig | undefined;
  players: Player[];
  activePlayerId: PlayerId;
  age: 1 | 2 | 3;
  round: number;
  turn: number;
  events: GameEvent[];
  world: WorldState;
}
```

---

## 3. Event Types

### 3.1 Core Events

| Event Type | Purpose | Payload |
|------------|---------|---------|
| `GAME_START` | Initialize a new game session | `GameSessionConfig` |
| `TURN_END` | End current player's turn | `{ playerId: PlayerId }` |
| `AGE_ADVANCE` | Advance to next age | `{ fromAge: number, toAge: number }` |
| `POWER_ROLL` | Roll for action points | `{ playerId: PlayerId, result: number }` |
| `EVENT_REVOKE` | Revoke a previous event | `{ eventId: string, reason: string }` |

### 3.2 AI Events

| Event Type | Purpose | Payload |
|------------|---------|---------|
| `AI_DECISION` | Record AI decision | `{ aiId: PlayerId, decision: string, reasoning: string }` |
| `AI_ACTION` | Execute AI action | `{ aiId: PlayerId, actionType: string, targets: CellId[] }` |

### 3.3 World Events

| Event Type | Purpose | Payload |
|------------|---------|---------|
| `CELL_UPDATE` | Update cell properties | `{ cellId: CellId, changes: Partial<Cell> }` |
| `CULTURE_FOUND` | Found new culture | `{ cultureId: CultureId, cellId: CellId, name: string }` |
| `CIVILIZATION_FOUND` | Found new civilization | `{ civId: CivilizationId, cultureId: CultureId, capitalId: CellId }` |
| `TERRITORY_CHANGE` | Change territory ownership | `{ cellId: CellId, fromId?: CivilizationId, toId: CivilizationId }` |

---

## 4. State Management Architecture

### 4.1 Store Design Pattern

Each store follows the same pattern:

```typescript
interface StoreState {
  // State properties
  state: T;
  
  // Actions
  actions: {
    dispatch: (event: GameEvent) => void;
    initialize: (config: Config) => void;
    // ... other actions
  };
  
  // Selectors
  selectors: {
    getState: () => T;
    // ... other selectors
  };
}
```

### 4.2 Event Dispatch Flow

```
User Action
    │
    ▼
Component calls dispatch(event)
    │
    ▼
Zod Middleware validates event
    │
    ├─ Valid → Continue
    │
    └─ Invalid → Log error, throw Validation Error (Fail-Fast)
              │
              ▼
         Reducer processes event
              │
              ▼
         New state computed
              │
              ▼
         Store updated
              │
              ▼
         Subscribers notified
```

### 4.3 State Derivation

State is derived from events using pure reducer functions:

```typescript
const reducer = (state: GameState, event: GameEvent): GameState => {
  switch (event.type) {
    case 'GAME_START':
      return handleGameStart(state, event);
    case 'TURN_END':
      return handleTurnEnd(state, event);
    // ... other cases
    default:
      return state;
  }
};
```

---

## 5. Zod Schema Strategy

### 5.1 Schema Organization

Schemas are organized by domain:

```
src/store/schemas/
├── index.ts           # Main export
├── utils.ts           # Utility schemas (HexColor, PlayerId, etc.)
├── entities.ts        # Core entity schemas
├── events.ts          # Event payload schemas
└── ui.ts              # UI state schemas
```

### 5.2 Schema Design Principles

1. **Coercion**: Use `.coerce()` for numeric fields to handle string inputs
2. **Defaults**: Use `.default()` for optional fields with sensible defaults
3. **Refinement**: Use `.refine()` for business logic validation
4. **Transform**: Use `.transform()` for data normalization

### 5.3 Type Inference

Types are inferred from schemas using `z.infer<>`:

```typescript
const PlayerSchema = z.object({
  id: PlayerIdSchema,
  name: z.string(),
  color: HexColorSchema,
  isHuman: z.boolean(),
});

type Player = z.infer<typeof PlayerSchema>;
```

---

## 6. Testing Strategy

### 6.1 Schema Tests

- Test valid data passes validation
- Test invalid data fails with correct error messages
- Test type inference matches expected types
- Test edge cases (boundary values, null/undefined)

### 6.2 Store Tests

- Test initial state
- Test dispatch with valid events
- Test dispatch with invalid events (should reject)
- Test state transitions
- Test selectors return correct values
- Test middleware behavior

### 6.3 Integration Tests

- Test store interactions
- Test event flow through multiple stores
- Test state persistence (if applicable)

---

## 7. Performance Considerations

### 7.1 Event Log Management

- Event log grows unbounded by default
- Implement compaction after N events (e.g., 500)
- Compact by deriving state from events and keeping only recent events

### 7.2 Selector Optimization

- Use memoization for expensive selectors
- Cache derived state when possible
- Avoid unnecessary recalculations

### 7.3 Batch Updates

- Use `immer` for efficient immutable updates
- Batch related updates when possible
- Consider debouncing rapid successive updates

---

## 8. Error Handling

### 8.1 Validation Errors

When validation fails:

1. Log the error with full context
2. Include the invalid data in the log
3. Include the Zod error path and message
4. Reject the state update
5. Throw a `ValidationError` to interrupt execution (Fail-Fast)
5. Optionally notify user (if applicable)

### 8.2 Runtime Errors

When runtime errors occur:

1. Catch and log with stack trace
2. Maintain application stability
3. Provide fallback behavior where possible
4. Report to error tracking (if configured)

---

## 9. Migration Strategy

### 9.1 Schema Versioning

- Include version field in state
- Maintain migration functions for each version
- Apply migrations on state load

### 9.2 Event Schema Evolution

- Never modify existing event types
- Add new event types for new functionality
- Maintain backward compatibility

---

## 10. Appendices

### Appendix A: Complete Type Definitions

See `src/types.ts` for complete type definitions.

### Appendix B: Event Reference

See `src/store/schemas/events.ts` for complete event schemas.

### Appendix C: Hex Coordinate System

The world uses axial coordinates (q, r) for hex grid cells.

Conversion functions are in `src/logic/geometry.ts`.

### Appendix D: Age System

The game has three ages with different mechanics:

- **Age 1**: Basic exploration and settlement
- **Age 2**: Expansion and conflict
- **Age 3**: Advanced civilization building

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-06 | Initial specification |
