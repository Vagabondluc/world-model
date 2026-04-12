# 🔒 EDIT PROPAGATION POLICY v1.0 (FROZEN)

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/19-biome-stability.md`, `docs/23-voxel-projection.md`, `docs/58-state-authority-contract.md`, `docs/61-multi-axial-world-generation.md`]
- `Owns`: [`EditLifecycle`, `LocalEditDelta`, `EditPatchType`, `HeightPatchPayload`, `BiomePatchPayload`, `StratumPatchPayload`, `PlanePatchPayload`, `BudgetConstraints`, `LocalEditStore`, `AuthorityStore`, `EditAPI`, `EditQueryAPI`]
- `Writes`: `[]`

---

(Local-to-Authority Lifecycle • Edit States • Promotion Rules)

---

## 0️⃣ Purpose

Define the local-to-authority edit lifecycle and policy for managing changes across scales.

**Core Principles:**

* Changes below L5 do not propagate upward automatically
* Prevents simulation instability and keeps persistence manageable
* All edits below L5 must carry lifecycle state
* Promotion to authority is explicit and validated
* Projection edits (stratum/plane) remain non-authoritative overlays

---

## 1️⃣ Authority Hierarchy

### 1.1 LOD Authority Levels

| LOD | Name | Authority | Typical Size | Edit Policy |
|-----|--------|-----------|---------------|--------------|
| L0 | Planet | Yes | Earth/global | No local edits |
| L1 | Continent | Yes | Plate scale | No local edits |
| L2 | Region | Yes | Hundreds of km | No local edits |
| L3 | World Hex | Yes | ~40 km | No local edits |
| L4 | Regional Hex | Yes | ~10 km | No local edits |
| L5 | Local Hex | Yes | ~3 miles (~5 km) | **Local edits allowed** |
| L6 | Sub-Hex/Patch | No (Derived) | 100-500 m | Local edits only |
| L7 | Voxel Surface/Column | No (Derived) | 1-5 m | Local edits only |
| L8 | 5-ft Grid | No (Derived) | Combat projection | Local edits only |

### 1.2 Authority Rule

**Core Rule:** Changes below L5 do not propagate upward automatically.

**Rationale:**
- Prevents simulation instability
- Keeps persistence manageable
- Maintains clear separation of concerns
- Avoids circular dependencies

---

## 2️⃣ Edit Lifecycle States

### 2.1 Lifecycle Enum

```typescript
enum EditLifecycle {
  // Runtime only, discarded on unload
  EPHEMERAL = "ephemeral",
  
  // Saved as local overlay/delta, not authority
  PERSISTENT_LOCAL = "persistent_local",
  
  // Proposed for promotion to L5 authority
  CANDIDATE_AUTHORITY = "candidate_authority",
  
  // Merged into L5 inputs and rebaked
  ACCEPTED_AUTHORITY = "accepted_authority"
}
```

### 2.2 State Descriptions

| State | Persistence | Authority | Use Case | Promotion |
|-------|-------------|-----------|-----------|------------|
| **EPHEMERAL** | None | No | Temporary visual effects, combat damage, spell effects | Never promoted |
| **PERSISTENT_LOCAL** | Saved locally | No | Player structures, terrain modifications, custom markers | Can be promoted |
| **CANDIDATE_AUTHORITY** | Saved locally | No | Proposed changes awaiting validation | Can be promoted to authority |
| **ACCEPTED_AUTHORITY** | Saved globally | Yes | Merged into authority, affects simulation | Final state |

---

## 3️⃣ Edit Data Structure

### 3.1 Local Edit Delta

```typescript
interface LocalEditDelta {
  // Identification
  id: string;                  // Unique edit ID
  hexId: string;                // Parent hex ID
  timestampUtc: string;         // ISO 8601 timestamp
  
  // Lifecycle
  lifecycle: EditLifecycle;
  author: string;                // User or system ID
  
  // Edit type
  patchType: EditPatchType;
  
  // Edit payload
  payload: Record<string, unknown>;
  
  // Validation
  isValid: boolean;            // Has passed validation
  validationErrors: string[];    // Any validation failures
}
```

### 3.2 Edit Patch Types

```typescript
enum EditPatchType {
  // Terrain
  HEIGHT = "height",
  SOIL = "soil",
  WATER = "water",
  
  // Biome
  BIOME = "biome",
  
  // Material
  MATERIAL = "material",
  
  // Structure
  STRUCTURE = "structure",
  
  // Multi-axial
  STRATUM = "stratum",
  PLANE = "plane"
}
```

### 3.3 Payload Schemas

**Height Patch:**
```typescript
interface HeightPatchPayload {
  elevationDeltaM: int32;      // Meters
  radiusM: uint32;             // Meters
  falloff: "linear" | "exponential" | "none";
}
```

**Biome Patch:**
```typescript
interface BiomePatchPayload {
  targetBiome: BiomeId;
  radiusM: uint32;             // Meters
  transitionWidthM: uint32;    // Meters
}
```

**Stratum Patch:**
```typescript
interface StratumPatchPayload {
  targetStratum: StratumId;
  radiusM: uint32;             // Meters
  preserveUnderlying: boolean; // Keep underlying terrain
}
```

**Plane Patch:**
```typescript
interface PlanePatchPayload {
  targetPlane: PlaneId;
  radiusM: uint32;             // Meters
  transitionWidthM: uint32;    // Meters
}
```

---

## 4️⃣ Promotion Policy

### 4.1 Promotion Process

```typescript
function promoteEditToAuthority(
  edit: LocalEditDelta,
  authoritySystem: AuthoritySystem
): PromotionResult {
  
  // Step 1: Record edit in local delta log
  const recorded = recordLocalEdit(edit);
  
  // Step 2: Validation checks
  const validation = validateEdit(edit, authoritySystem);
  
  if (!validation.isValid) {
    return {
      status: "rejected",
      errors: validation.errors,
      edit: edit
    };
  }
  
  // Step 3: Budget check
  const budgetCheck = checkBudget(edit, authoritySystem);
  
  if (!budgetCheck.withinBudget) {
    return {
      status: "over_budget",
      reason: budgetCheck.reason,
      edit: edit
    };
  }
  
  // Step 4: Produce authority patch
  const authorityPatch = produceAuthorityPatch(edit);
  
  // Step 5: Merge into L5 inputs
  const merged = mergeAuthorityPatch(authorityPatch);
  
  // Step 6: Rebake affected textures
  const rebaked = rebakeTextures(merged);
  
  return {
    status: "accepted",
    authorityPatch,
    rebakedTextures: rebaked,
    edit: edit
  };
}
```

### 4.2 Validation Rules

**Budget Constraints:**
```typescript
interface BudgetConstraints {
  maxElevationChangeM: int32;      // Meters per hex
  maxBiomeChangeAreaM2: uint32;    // Square meters
  maxStratumChangeAreaM2: uint32;  // Square meters
  maxPlaneChangeAreaM2: uint32;    // Square meters
  maxConcurrentEdits: uint16;      // Per player/session
}
```

**Validation Checks:**
1. **Physical Plausibility:**
   - Elevation changes don't create impossible slopes
   - Biome changes respect climate constraints
   - Stratum changes respect depth constraints

2. **Rule Compliance:**
   - No circular dependencies
   - No violation of conservation laws
   - No breaking of invariants

3. **Scale Appropriateness:**
   - Edit magnitude appropriate for scale
   - No micro-edits at planetary scale
   - No planetary edits at tactical scale

### 4.3 Merge Rules

**Conflict Resolution:**
```typescript
function mergeAuthorityPatch(
  existing: AuthorityPatch,
  proposed: AuthorityPatch
): AuthorityPatch {
  
  // Check for conflicts
  const conflicts = detectConflicts(existing, proposed);
  
  if (conflicts.length > 0) {
    // Apply conflict resolution strategy
    return resolveConflicts(existing, proposed, conflicts);
  }
  
  // No conflicts - merge directly
  return {
    ...existing,
    ...proposed
  };
}
```

**Conflict Resolution Strategies:**
1. **Last Write Wins:** Most recent edit takes precedence
2. **Highest Authority Wins:** Authority edits override local edits
3. **Blend:** Interpolate between conflicting values
4. **Reject:** Reject conflicting edit entirely

---

## 5️⃣ Texture Rebaking

### 5.1 Rebake Trigger Conditions

**When to Rebake:**
- Authority patch applied to hex
- Accepted local edit promoted to authority
- Climate change affecting hex
- Tectonic change affecting hex

**When NOT to Rebake:**
- Ephemeral edits (discarded on unload)
- Persistent local edits (not promoted)
- Derived views (L6-L8)

### 5.2 Rebake Process

```typescript
function rebakeTextures(
  hexId: string,
  authoritySystem: AuthoritySystem
): RebakeResult {
  
  // Step 1: Get updated authority data
  const authority = getHexAuthority(hexId);
  
  // Step 2: Generate new baked textures
  const newBundle = bakeTextureBundle({
    hexAuthority: authority,
    climate: getClimateForHex(hexId),
    stratum: authority.stratumId,
    plane: authority.planeId,
    rasterSize: 64,
    seed: authority.seed
  });
  
  // Step 3: Invalidate cached textures
  invalidateCachedTextures(hexId);
  
  // Step 4: Store new bundle
  storeTextureBundle(hexId, newBundle);
  
  return {
    status: "success",
    newBundle,
    invalidatedTextures: getInvalidatedTextures(hexId)
  };
}
```

### 5.3 Deterministic Rebaking

**Requirements:**
- Same authority inputs → identical byte-for-byte texture output
- Deterministic noise sampling
- Stable across multiple runs

---

## 6️⃣ Edit Storage

### 6.1 Local Edit Storage

**Storage Location:** IndexedDB or similar browser storage

**Schema:**
```typescript
interface LocalEditStore {
  // Edits indexed by hex ID
  editsByHex: Record<string, LocalEditDelta[]>;
  
  // Global edit log
  editLog: LocalEditDelta[];
  
  // Metadata
  lastSync: number;             // Unix timestamp
  version: string;               // Store version
}
```

### 6.2 Authority Storage

**Storage Location:** Server-side database or persistent world file

**Schema:**
```typescript
interface AuthorityStore {
  // Hex authority data
  hexAuthority: Record<string, HexAuthority>;
  
  // Authority patches
  authorityPatches: AuthorityPatch[];
  
  // Baked textures
  textureBundles: Record<string, BakedTextureBundle>;
  
  // Versioning
  version: string;
  lastModified: number;          // Unix timestamp
}
```

---

## 7️⃣ Integration with Existing Specs

### 7.1 State Authority Integration

**Input:** [`docs/58-state-authority-contract.md`](docs/58-state-authority-contract.md)

**Usage:**
```typescript
// L5 is the lowest authority level that accepts edits
const L5_AUTHORITY_LEVEL = 5;

// Edits below L5 are local only
if (edit.lodLevel < L5_AUTHORITY_LEVEL) {
  edit.lifecycle = EditLifecycle.PERSISTENT_LOCAL;
} else {
  // No edits allowed above L5
  throw new Error("Edits not allowed at this authority level");
}
```

### 7.2 Multi-Axial Integration

**Input:** [`docs/61-multi-axial-world-generation.md`](docs/61-multi-axial-world-generation.md)

**Usage:**
```typescript
// Stratum and plane edits are local only
if (edit.patchType === EditPatchType.STRATUM ||
    edit.patchType === EditPatchType.PLANE) {
  
  // Never promoted to authority
  edit.lifecycle = EditLifecycle.PERSISTENT_LOCAL;
  
  // Applied as local overlay
  applyStratumOverlay(edit.payload, hexId);
  applyPlaneOverlay(edit.payload, hexId);
}
```

### 7.3 Biome System Integration

**Input:** [`docs/19-biome-stability.md`](docs/19-biome-stability.md)

**Usage:**
```typescript
// Biome edits can be promoted to authority
if (edit.patchType === EditPatchType.BIOME) {
  
  // Validate against climate constraints
  const validation = validateBiomeEdit(
    edit.payload,
    getClimateForHex(edit.hexId)
  );
  
  if (validation.isValid) {
    edit.lifecycle = EditLifecycle.CANDIDATE_AUTHORITY;
  }
}
```

### 7.4 Voxel Projection Integration

**Input:** [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md)

**Usage:**
```typescript
// Height edits affect voxel generation
if (edit.patchType === EditPatchType.HEIGHT) {
  
  // Apply height delta to voxel column
  const voxelColumn = generateVoxelColumn(
    hexAuthority,
    edit.payload.elevationDeltaM
  );
  
  // Store as local view
  storeLocalVoxelView(edit.hexId, voxelColumn);
}
```

---

## 8️⃣ Determinism Requirements

### 8.1 Deterministic Edit Application

**Requirements:**
- Same edit → identical result
- No random number generation in edit application
- Stable across multiple applications

### 8.2 Deterministic Validation

**Requirements:**
- Same edit + same authority → identical validation result
- No external state in validation
- Pure function of inputs

### 8.3 Deterministic Rebaking

**Requirements:**
- Same authority → identical texture bundle
- Deterministic noise sampling
- Byte-for-byte reproducibility

---

## 9️⃣ API Contracts

### 9.1 Edit Operations

```typescript
interface EditAPI {
  // Create edit
  createEdit(
    hexId: string,
    patchType: EditPatchType,
    payload: Record<string, unknown>,
    lifecycle: EditLifecycle
  ): LocalEditDelta;
  
  // Apply edit locally
  applyEdit(
    edit: LocalEditDelta,
    targetLod: number
  ): ApplyResult;
  
  // Promote edit to authority
  promoteEdit(
    editId: string
  ): PromotionResult;
  
  // Revert edit
  revertEdit(
    editId: string
  ): RevertResult;
  
  // List edits for hex
  listEdits(hexId: string): LocalEditDelta[];
}
```

### 9.2 Query Operations

```typescript
interface EditQueryAPI {
  // Get edit by ID
  getEdit(editId: string): LocalEditDelta | null;
  
  // Get edits for hex
  getEditsForHex(hexId: string): LocalEditDelta[];
  
  // Get edits by lifecycle
  getEditsByLifecycle(
    lifecycle: EditLifecycle
  ): LocalEditDelta[];
  
  // Get pending promotions
  getPendingPromotions(): LocalEditDelta[];
}
```

---

## 🔟 Acceptance Criteria

### 10.1 Must-Have

- [x] **AC-1201**: Edits below L5 do not propagate upward automatically
- [x] **AC-1202**: All edits carry lifecycle state
- [x] **AC-1203**: Promotion process includes validation and budget checks
- [x] **AC-1204**: Authority patches are merged with conflict resolution
- [x] **AC-1205**: Texture rebaking is triggered on authority changes
- [x] **AC-1206**: Local edits are stored separately from authority
- [x] **AC-1207**: Multi-axial edits (stratum/plane) are local only

### 10.2 Should-Have

- [ ] **AC-1211**: Edit history and undo/redo functionality
- [ ] **AC-1212**: Edit conflict detection and resolution UI
- [ ] **AC-1213**: Edit validation provides clear error messages
- [ ] **AC-1214**: Budget system is configurable per world type

### 10.3 Could-Have

- [ ] **AC-1221**: Collaborative editing with conflict resolution
- [ ] **AC-1222**: Edit templates and presets
- [ ] **AC-1223**: Edit batching for performance
- [ ] **AC-1224**: Edit export/import for sharing

---

## 1️⃣1️⃣ Cross-Doc Dependencies

- [`docs/58-state-authority-contract.md`](docs/58-state-authority-contract.md) - Authority hierarchy
- [`docs/61-multi-axial-world-generation.md`](docs/61-multi-axial-world-generation.md) - Stratum and plane edits
- [`docs/19-biome-stability.md`](docs/19-biome-stability.md) - Biome validation
- [`docs/23-voxel-projection.md`](docs/23-voxel-projection.md) - Voxel generation

---

## 1️⃣2️⃣ Version History

| Version | Date | Changes |
|---------|--------|---------|
| 1.0 | 2026-02-12 | Initial frozen spec - Edit propagation policy and lifecycle |

---

**Document Version:** 1.0  
**Status:** 🔒 FROZEN  
**Generated:** 2026-02-12

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
