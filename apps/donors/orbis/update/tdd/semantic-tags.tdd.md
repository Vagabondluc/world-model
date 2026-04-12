# 🧪 TDD Specification: Semantic Resolver & Tag Registry

**Target**: Orbis 2.0 Unified Tag System
**Reference**: Orbis 1.0 `semanticResolver.ts`, `types.ts` (VoxelSemantic)

## 1. Legacy Conversion (VoxelSemantic -> TagSet)
- [ ] **SEM-01: Field Mapping**
  - `Input (1.0)`: `VoxelSemantic { realm: 'MUNDANE', cover: 'HALF' }`
  - `Expected (2.0)`: `TagSet` containing `REALM_MUNDANE` and `COVER_HALF` uint32 IDs.
- [ ] **SEM-02: Namespace Integrity**
  - `Verification`: `HELLMOUTH` tag must have ID in range `0x00000000 - 0x0000FFFF` (Core Simulation).
  - `Verification`: `PLAYER_MARKER` tag must have ID in range `0x00020000 - 0x0002FFFF` (Control/Diagnostic).

## 2. Layer Precedence & Merging
- [ ] **LAYER-01: Priority Resolution**
  - `Setup`: `GEOLOGY` layer sets `material: STONE`. `REALM` layer sets `material: OBSIDIAN`.
  - `Expected`: Final tag/material must be `OBSIDIAN` due to higher precedence.
- [ ] **LAYER-02: Multi-Tag Merge**
  - `Action`: Merge `['Hell-mouth']` from 1.0 inherent regions with `['Sanctuary']` from player edits.
  - `Expected`: `TagSet` must be sorted and contain both unique IDs.

## 3. Dynamic Tactical Derivation
- [ ] **TAC-01: Movement Cost Interaction**
  - `Setup`: Cell with `SNOW` (Intensity 800k) and `STEEP_SLOPE` (Intensity 600k).
  - `Action`: Calculate `movementCostPPM`.
  - `Expected`: Result must exceed `2.0x` baseline multiplier according to `TagInteractionMatrix`.
- [ ] **TAC-02: Cover System Stability**
  - `Input`: `FOREST` tag.
  - `Expected`: `COVER_PPM` set to `500,000` (HALF) unless overridden by explicit building tag.

## 4. Deterministic Tie-Breaking
- [ ] **TIE-01: Utility Conflict**
  - `Setup`: Two behaviors (`Hunt`, `Gather`) with identical score.
  - `Action`: Selection.
  - `Expected`: Lower `TagId` chosen every time.
- [ ] **TIE-02: Hash Fallback**
  - `Setup`: Identical score and identical TagId (should be impossible, but test robustness).
  - `Action`: Selection.
  - `Expected`: `hash64(seed, entityId, tick)` result determines choice.
 Riverside.
