# Seed and Randomness

**Onboarding Panel Target:** `[data-onboard="seed"]`

## Overview

The seed system is the foundation of reproducible icon generation in the Faction Image generator. A seed value initializes a deterministic pseudo-random number generator (RNG) that controls all randomized decisions during icon creation. Using the same seed with the same parameters will always produce identical output, enabling reproducibility and sharing of generated icons.

## UI Component

- **Component:** [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx:129) - Seed input field with randomize button
- **Location:** Left sidebar, Frame section
- **Elements:**
  - Text input for manual seed entry
  - Dice button (🎲) for random seed generation

## Data Structures

### RNG Interface

```typescript
// From rng.ts
export interface RNG {
  next(): number;           // Returns value in [0, 1)
  nextInt(min: number, max: number): number;  // Integer in [min, max]
  pick<T>(arr: T[]): T;     // Random element from array
  shuffle<T>(arr: T[]): T[]; // Shuffled copy of array
}
```

### Seed History Entry

```typescript
// From types.ts
export type SeedHistoryReason =
  | "initial"
  | "generate-next"
  | "randomize"
  | "manual-edit"
  | "regenerate-same"
  | "imported-legacy"
  | "imported-derived";

export type SeedHistoryEntry = {
  revision: number;
  seed: string;
  reason: SeedHistoryReason;
  timestamp: string;
};
```

## Code Execution Path

### 1. Seed Input Flow

```
User Input (ConfigForm.tsx:129-141)
    ↓
onChange handler updates config.seed
    ↓
buildIconSpec() called with seed
    ↓
createRNG(seed) creates deterministic RNG
    ↓
RNG drives all random decisions
```

### 2. Randomize Button Flow

```
User clicks 🎲 button (ConfigForm.tsx:138-140)
    ↓
onRandomize() callback triggered
    ↓
randomSeed() generates new 8-char seed
    ↓
State updated with new seed
    ↓
Generation triggered
```

### 3. Seed State Management

```
nextSeedState() determines next seed based on:
    - currentSeed: existing seed value
    - hasGenerated: whether icon was generated
    - locked: whether seed is locked
    - action: "generate" | "regenerate-same" | "randomize"
    - seedHistory: array of past seeds
    ↓
Returns: { seed: string, history: SeedHistoryEntry[] }
```

## Key Functions

### [`createRNG()`](../src/icon-generator/rng.ts:8)

Creates a seeded pseudo-random number generator using xorshift32 algorithm.

**Algorithm:**
1. Hash seed string to 32-bit integer using polynomial rolling hash
2. Initialize xorshift32 state (ensuring non-zero)
3. Return RNG object with next(), nextInt(), pick(), shuffle() methods

```typescript
// Hash computation (lines 9-12)
let h = 0;
for (let i = 0; i < seed.length; i++) {
  h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
}

// xorshift32 transform (lines 16-20)
s ^= s << 13;
s ^= s >> 17;
s ^= s << 5;
return (s >>> 0) / 4294967296;
```

### [`randomSeed()`](../src/icon-generator/seedManager.ts:5)

Generates a random 8-character seed string.

```typescript
export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
```

### [`nextSeedState()`](../src/icon-generator/seedManager.ts:21)

Manages seed transitions and history tracking.

**Logic:**
- First generation: keeps current seed, reason = "initial"
- Randomize action: generates new seed, reason = "randomize"
- Generate action (unlocked): generates new seed, reason = "generate-next"
- Regenerate action: keeps same seed, reason = "regenerate-same"

### [`normalizeSeedSource()`](../src/icon-generator/seedManager.ts:9)

Cleans user input for consistent seed formatting.

```typescript
export function normalizeSeedSource(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s-]/g, "");
}
```

## State Management

### Seed in IconConfig

The seed is stored as part of the `IconConfig` object:

```typescript
export type IconConfig = {
  seed?: string;
  // ... other config properties
};
```

### Seed History Tracking

The system maintains a complete history of seed changes:

```typescript
// Each entry tracks:
{
  revision: number;      // Incremental version number
  seed: string;          // The seed value
  reason: SeedHistoryReason; // Why it changed
  timestamp: string;     // ISO timestamp
}
```

### Export Payload

Seed information is preserved in exports:

```typescript
export type ExportPayload = {
  state: {
    seed: string;
    seedRevision: number;
    seedHistory: SeedHistoryEntry[];
    // ...
  };
  // ...
};
```

## Determinism Contract

The system guarantees that:

1. **Same seed + same parameters = identical output**
2. **Seed changes are tracked in history**
3. **Seed persists through export/import**
4. **Regenerate with same seed produces same icon**

## Related Files

| File | Purpose |
|------|---------|
| [`rng.ts`](../src/icon-generator/rng.ts) | Seeded RNG implementation |
| [`seedManager.ts`](../src/icon-generator/seedManager.ts) | Seed state management |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
| [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx) | UI for seed input |
| [`iconSpecBuilder.ts`](../src/icon-generator/iconSpecBuilder.ts) | Uses RNG for generation |
