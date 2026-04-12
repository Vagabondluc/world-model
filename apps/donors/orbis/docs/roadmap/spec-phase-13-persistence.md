
# Spec: Persistence & Project Management (Phase 13)

## 1. Objective
Enable users to persist their generated worlds, including terraforming changes, and switch between different "Projects" (Saves). Additionally, provide a curated "Earth" preset.

## 2. Data Model: The Save File
We cannot simply `JSON.stringify` the entire `hexes` array because:
1. It contains derived geometry (vertices, neighbors) which is heavy and static.
2. It would exceed LocalStorage limits (5MB) quickly.

**Strategy**: Hybrid Serialization.
1. **Procedural Base**: Save `seed` and `TerrainConfig`.
2. **Delta Layer**: Save only the hexes that have been modified by the user (Terraforming) or Simulation (Settlements).

### 2.1 Schema Definition
```typescript
interface ProjectSave {
  meta: {
    id: string;             // UUID
    name: string;           // User defined e.g., "My Mars"
    createdAt: number;      // Timestamp
    updatedAt: number;      // Timestamp
    thumbnail?: string;     // Base64 (Optional, Low Res)
    version: string;        // "1.0.0" for migration safety
  };
  world: {
    seed: number;
    config: TerrainConfig;  // The Zod schema
  };
  // The Delta Layer: Only ID and modified props
  deltas: Record<string, {
    h?: number; // Height (shortened keys for space)
    t?: number; // Temp
    m?: number; // Moisture
    s?: SettlementType; // Settlement
  }>;
}
```

## 3. Storage Engine
**Driver**: `localStorage` (Browser Native).
**Key Prefix**: `orbis_proj_{id}`.
**Index Key**: `orbis_index` (List of {id, name, date}).

### 3.1 Operations
- **Save**:
  1. Generate Delta: Compare current `hexes` against a clean generation of `seed`.
  2. Serialize `ProjectSave` object.
  3. Validate size < 4MB (Safety margin).
  4. Write to `localStorage`.
- **Load**:
  1. Retrieve JSON.
  2. Regenerate World using `seed` + `config`.
  3. Apply `deltas` to the generated hexes.
  4. Trigger `useWorldStore` update.

## 4. Feature: The "Earth" Preset
A read-only Project config designed to mimic Earth.

**Parameters**:
- `seaLevel`: `0.1` (Slightly higher to create distinct continents)
- `tempOffset`: `0`
- `moistureOffset`: `0.1` (Lush)
- `plateCount`: `12` (Earth-like tectonics)
- `sculpting`: Pre-defined deltas (optional phase) or just a "Lucky Seed" that looks like Earth.
  - *Candidate Seed*: `80085` or `1993` (Needs visual verification).

## 5. UI Changes
### 5.1 Settings Sidebar
- **New Section**: "Project Management".
- **Actions**:
  - `[Save]` (Current state).
  - `[Load]` (Opens Modal).
  - `[Reset]` (New Random Seed).

### 5.2 Load Modal
- List of saved projects sorted by `updatedAt`.
- Tab for "Presets" (Earth, Mars, Iceball).
- Delete button for custom saves.

## 6. Security & Validation
- Use `zod` to validate loaded JSON to prevent state corruption from malformed saves.
- Handle `QuotaExceededError` gracefully (Alert user).

## 7. Migration Strategy
- If `ProjectSave.meta.version` mismatch, attempt upgrade or warn user.
