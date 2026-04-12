# Generate Actions

**Onboarding Panel Target:** `[data-onboard="generate-actions"]`

## Overview

Generate actions control the icon generation workflow. The three primary actions are Generate, Regenerate, and Lock. Generate creates a new icon with a fresh seed, Regenerate recreates the current icon with the same seed, and Lock prevents the seed from changing during generation.

## UI Component

- **Component:** [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx)
- **Location:** Left sidebar, Frame section
- **Buttons:**
  - **Generate** - Creates new icon with new seed
  - **Regenerate** - Recreates with same seed
  - **Lock toggle** - Prevents seed changes

## Data Structures

### Seed Action Type

```typescript
// From seedManager.ts
export type SeedAction = "generate" | "regenerate-same" | "randomize";
```

### Lock State

```typescript
// Lock is a boolean state in IconGenerator
const [locked, setLocked] = useState(false);
```

### Generation State

```typescript
// Tracked in IconGenerator component
const [hasGenerated, setHasGenerated] = useState(false);
const [seed, setSeed] = useState<string>("");
const [seedHistory, setSeedHistory] = useState<SeedHistoryEntry[]>([]);
```

## Code Execution Path

### 1. Generate Flow

```
User clicks Generate button
    ↓
onGenerate() callback triggered
    ↓
nextSeedState({
  currentSeed,
  hasGenerated,
  locked,
  action: "generate",
  seedHistory
})
    ↓
If not locked: new random seed generated
If locked: same seed preserved
    ↓
buildIconSpec(config) creates new IconSpec
    ↓
State updated: spec, seed, history
    ↓
Preview renders new icon
```

### 2. Regenerate Flow

```
User clicks Regenerate button
    ↓
onRegenerateSame() callback triggered
    ↓
nextSeedState({
  action: "regenerate-same",
  ...
})
    ↓
Same seed preserved
reason = "regenerate-same"
    ↓
buildIconSpec(config) creates identical IconSpec
    ↓
Preview renders same icon
```

### 3. Lock Toggle Flow

```
User clicks Lock toggle
    ↓
onToggleLock(!locked) callback triggered
    ↓
locked state updated
    ↓
UI updates lock indicator (🔒/🔓)
    ↓
Future Generate actions preserve seed
```

## Key Functions

### [`nextSeedState()`](../src/icon-generator/seedManager.ts:21)

Determines the next seed value based on action and state.

```typescript
export function nextSeedState(args: {
  currentSeed?: string;
  hasGenerated: boolean;
  locked: boolean;
  action: SeedAction;
  seedHistory: SeedHistoryEntry[];
}): { seed: string; history: SeedHistoryEntry[] } {
  const now = new Date().toISOString();
  const currentSeed = args.currentSeed || randomSeed();
  let nextSeed = currentSeed;
  let reason: SeedHistoryReason = "regenerate-same";

  if (!args.hasGenerated) {
    nextSeed = currentSeed;
    reason = "initial";
  } else if (args.action === "randomize") {
    nextSeed = randomSeed();
    reason = "randomize";
  } else if (args.action === "generate" && !args.locked) {
    nextSeed = randomSeed();
    reason = "generate-next";
  } else {
    reason = "regenerate-same";
  }

  const revision = args.seedHistory.length
    ? args.seedHistory[args.seedHistory.length - 1].revision + 1
    : 1;
  const entry: SeedHistoryEntry = {
    revision,
    seed: nextSeed,
    reason,
    timestamp: now
  };
  return { seed: nextSeed, history: [...args.seedHistory, entry] };
}
```

### [`buildIconSpec()`](../src/icon-generator/iconSpecBuilder.ts:46)

Creates the complete IconSpec from configuration.

```typescript
export function buildIconSpec(config: IconConfig): IconSpec {
  const seed = config.seed || Math.random().toString(36).slice(2);
  const rng = createRNG(seed);
  // ... build all layers
  return {
    id: generateId(),
    viewBox: "0 0 128 128",
    width: config.size || 128,
    height: config.size || 128,
    layers: [...],
  };
}
```

## Action Behaviors

| Action | Lock State | Seed Behavior | History Reason |
|--------|------------|---------------|----------------|
| Generate | Unlocked | New random seed | "generate-next" |
| Generate | Locked | Same seed | "regenerate-same" |
| Regenerate | Any | Same seed | "regenerate-same" |
| Randomize | Any | New random seed | "randomize" |
| First Gen | Any | Keeps current | "initial" |

## State Management

### Generation State in IconGenerator

```typescript
// Core generation state
const [config, setConfig] = useState<IconConfig>({});
const [spec, setSpec] = useState<IconSpec | null>(null);
const [locked, setLocked] = useState(false);
const [hasGenerated, setHasGenerated] = useState(false);
const [seed, setSeed] = useState<string>("");
const [seedHistory, setSeedHistory] = useState<SeedHistoryEntry[]>([]);
```

### Config Updates

```typescript
// When config changes that affect generation
useEffect(() => {
  if (hasGenerated) {
    regenerateSpec();
  }
}, [config.symmetry, config.domain, config.complexity]);
```

## Related Files

| File | Purpose |
|------|---------|
| [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx) | Generate/Regenerate/Lock UI |
| [`IconGenerator.tsx`](../src/icon-generator/IconGenerator.tsx) | Generation state management |
| [`seedManager.ts`](../src/icon-generator/seedManager.ts) | Seed state transitions |
| [`iconSpecBuilder.ts`](../src/icon-generator/iconSpecBuilder.ts) | IconSpec creation |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
