
# Core Implementation

This document describes the core implementation of the Dawn of Worlds engine, aligned with the **Authoritative Rules** (PDF Edition).

## Table of Contents

- [Data Models](#data-models)
- [The Economy (Power Points)](#the-economy-power-points)
- [Event Types](#event-types)
- [Reducer Logic](#reducer-logic)
- [World Derivation](#world-derivation)

## Data Models

### World Object Kinds
Updated to match the full Table of Powers.

```ts
export type WorldKind =
  | "TERRAIN"       // Age I: Geography
  | "CLIMATE"       // Age I: Weather/Biome
  | "RACE"          // Age II: Populations
  | "SUBRACE"       // Age II: Derivatives
  | "CITY"          // Age II: Settlements (replaces SETTLEMENT)
  | "NATION"        // Age III: Political Entities
  | "BORDER"        // Age III: Territory
  | "AVATAR"        // Age I/II/III: Great Heroes/Monsters
  | "ORDER"         // Age I/II/III: Secret Societies/Guilds
  | "ARMY"          // Age III: Military Units
  | "EVENT"         // Age I/II/III: Narrative markers
  | "CATASTROPHE";  // Age I/II/III: Destruction markers
```

### Player State (The Economy)
Dawn of Worlds uses a **cumulative** power system, not a turn-reset system.

```ts
export type PlayerState = {
  id: string;
  name: string;
  color: string;
  
  // Power Economy
  currentPower: number;      // Accumulates turn-over-turn
  cumulativeBonus: number;   // +1 (max 3) if previous turn spent <= 5
  lastTurnSpend: number;     // Tracked to calculate next bonus
};
```

### Game State

```ts
export type GameState = {
  // Meta
  config: GameSessionConfig;
  settings: QolSettings;
  
  // Time
  age: 1 | 2 | 3;
  round: number;
  turn: number;
  activePlayerId: string;
  
  // Data
  players: Record<string, PlayerState>; // Keyed by ID
  events: GameEvent[];
  revokedEventIds: Set<string>;
  
  // Cache
  worldCache: Map<string, WorldObject>;
};
```

## The Economy (Power Points)

According to **Rule III: Powers & Costs**, the power cycle is:

1.  **Turn Start:**
    *   Roll `2d6`.
    *   Add result to `player.currentPower`.
    *   Add `player.cumulativeBonus` to `player.currentPower`.
2.  **Action Phase:**
    *   Player spends points.
    *   `player.currentPower` decreases.
    *   `player.lastTurnSpend` increases.
3.  **Turn End:**
    *   If `lastTurnSpend <= 5`, increment `cumulativeBonus` (max 3).
    *   Else, reset `cumulativeBonus` to 0.
    *   Reset `lastTurnSpend` to 0.

## Event Types

### Power Events
We must record the dice rolls to maintain the audit log.

```ts
type PowerEvent = {
  type: "POWER_ROLL";
  playerId: string;
  roll: [number, number]; // e.g., [4, 2]
  bonusApplied: number;
  previousPool: number;
  newPool: number;
};
```

### Conflict Events
To support **Rule IV: Conflict Resolution**.

```ts
type CombatEvent = {
  type: "COMBAT_RESOLVE";
  attackerId: string; // Avatar/Army/Nation ID
  defenderId: string;
  rolls: {
    attacker: [number, number]; // 2d6
    defender: [number, number]; // 2d6
    modifiers: { attacker: number; defender: number };
  };
  outcome: "ATTACKER_WINS" | "DEFENDER_WINS" | "DRAW";
  consequence: string; // "Target Destroyed" or "Scattered"
};
```

## Reducer Logic

### Handling `TURN_BEGIN`
```ts
if (event.type === 'TURN_BEGIN') {
  // Logic moved to Controller usually, but the Event Log must show the result
  // The actual mutation happens when processing POWER_ROLL
}
```

### Handling `POWER_ROLL`
```ts
if (event.type === 'POWER_ROLL') {
  const p = state.players[event.playerId];
  const totalRoll = event.roll[0] + event.roll[1];
  p.currentPower = event.previousPool + totalRoll + event.bonusApplied;
}
```

### Handling `WORLD_CREATE` (Spending)
```ts
if (event.type === 'WORLD_CREATE') {
  const p = state.players[event.playerId];
  p.currentPower -= event.cost;
  p.lastTurnSpend += event.cost;
  // ... apply world derivation
}
```

## World Derivation (Layering)

The map must render entities in Z-index order based on type, not just creation time.

**Render Order (Bottom to Top):**
1.  `TERRAIN` / `CLIMATE` (Base Tile)
2.  `NATION` / `BORDER` (Vector Overlay)
3.  `CITY` / `LANDMARK` (Static Icons)
4.  `RACE` / `ORDER` (Population Indicators)
5.  `AVATAR` / `ARMY` (Mobile Units)
6.  `CATASTROPHE` (VFX Layer)

