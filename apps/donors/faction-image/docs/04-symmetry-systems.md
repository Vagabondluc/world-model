# Symmetry Systems

**Onboarding Panel Target:** `[data-onboard="symmetry"]`

## Overview

The symmetry system provides 25+ symmetry modes for generating visually balanced icons. Symmetry is a core aesthetic property of sacred symbols and procedural sigils. The system supports multiple categories including mirror, rotational, radial, and hybrid symmetries, with domain-aware auto-suggestions and strict determinism contracts.

## UI Component

- **Component:** [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx:100-110)
- **Location:** Left sidebar, Frame section
- **Display:** Grouped dropdown by symmetry category
- **Indicators:** Domain suggestions highlighted with visual markers

## Data Structures

### Symmetry ID Type

```typescript
// From types.ts
export type SymmetryId =
  | "none"
  | "mirror-v"
  | "mirror-h"
  | "mirror-vh"
  | "rot-2"
  | "rot-3"
  | "rot-4"
  | "rot-6"
  | "rot-8"
  | "radial-4"
  | "radial-6"
  | "radial-8"
  | "radial-12"
  | "radial-16"
  | "hybrid-quad"
  | "hybrid-hex"
  | "hybrid-tri"
  | "hybrid-oct";

export type SymmetryCategory = "none" | "mirror" | "rotational" | "radial" | "hybrid";
export type SymmetrySelectedBy = "user" | "domain_suggest" | "preset";
```

### Symmetry Definition

```typescript
// From types.ts
export type SymmetryDefinition = {
  symmetryId: SymmetryId;
  displayName: string;
  description: string;
  category: SymmetryCategory;
  foldCount: number;    // Number of rotational copies
  mirrorCount: number;  // Number of mirror axes
  phase: 1 | 2 | 3;     // Availability phase
};
```

### Symmetry Config

```typescript
// From types.ts
export type SymmetryConfig = {
  symmetryId: SymmetryId;
  displayName: string;
  foldCount: number;
  mirrorCount: number;
  category: SymmetryCategory;
  selectedAt: string;
  selectedBy: SymmetrySelectedBy;
  revisionId: string;
  symmetryVersion: "1.0.0";
  regenerateReason?: "manual_symmetry_change" | "domain_change" | null;
};
```

## Symmetry Categories

### Category A: None (Asymmetric)

| ID | Display Name | Description |
|----|--------------|-------------|
| `none` | None (Asymmetric) | No symmetry transform |

### Category B: Mirror Symmetries

| ID | Display Name | Description | Folds | Mirrors |
|----|--------------|-------------|-------|---------|
| `mirror-v` | Mirror Vertical | Left-right reflection | 1 | 1 |
| `mirror-h` | Mirror Horizontal | Top-bottom reflection | 1 | 1 |
| `mirror-vh` | Mirror V+H | Four mirrored quadrants | 2 | 2 |

### Category C: Rotational Symmetries

| ID | Display Name | Description | Folds |
|----|--------------|-------------|-------|
| `rot-2` | 2-Fold Rotation | 180° rotational symmetry | 2 |
| `rot-3` | 3-Fold Rotation | 120° rotational symmetry | 3 |
| `rot-4` | 4-Fold Rotation | 90° rotational symmetry | 4 |
| `rot-6` | 6-Fold Rotation | 60° rotational symmetry | 6 |
| `rot-8` | 8-Fold Rotation | 45° rotational symmetry | 8 |

### Category D: Radial Symmetries

| ID | Display Name | Description | Folds |
|----|--------------|-------------|-------|
| `radial-4` | Radial 4-Way | Four-way radial arrangement | 4 |
| `radial-6` | Radial 6-Way | Six-way radial arrangement | 6 |
| `radial-8` | Radial 8-Way | Eight-way radial arrangement | 8 |
| `radial-12` | Radial 12-Way | Twelve-way radial arrangement | 12 |
| `radial-16` | Radial 16-Way | Sixteen-way radial arrangement | 16 |

### Category E: Hybrid Symmetries

| ID | Display Name | Description | Folds |
|----|--------------|-------------|-------|
| `hybrid-quad` | Hybrid Quad | Mirror + 4-fold rotation | 4 |
| `hybrid-hex` | Hybrid Hex | Mirror + 6-fold rotation | 6 |
| `hybrid-tri` | Hybrid Tri | Mirror + 3-fold rotation | 3 |
| `hybrid-oct` | Hybrid Oct | Mirror + 8-fold rotation | 8 |

## Code Execution Path

### 1. Symmetry Selection Flow

```
User selects symmetry from grouped dropdown
    ↓
onChange updates config.symmetry
    ↓
buildSymmetryConfig() creates SymmetryConfig object
    ↓
Icon regenerated with new symmetry
    ↓
applySymmetryToLayers() transforms core layers
```

### 2. Symmetry Application Flow

```
buildIconSpec() creates base layers
    ↓
Core layer IDs tracked in Set<string>
    ↓
applySymmetryToLayers() called with:
  - layers: Layer[]
  - symmetryId: SymmetryId
  - centerX, centerY: number
  - size: number
  - coreLayerIds: Set<string>
  - nextId: () => string
  - accentColor: string
  - strokeWidth: number
    ↓
Returns transformed layer array
```

## Key Functions

### [`applySymmetryToLayers()`](../src/icon-generator/symmetry.ts:64)

Main symmetry transformation function.

**Mirror Vertical (lines 98-102):**
```typescript
if (symmetryId === "mirror-v") {
  out.push(layer);
  out.push(withTransform(layer, nextId,
    `translate(${centerX},0) scale(-1,1) translate(${-centerX},0)`));
  continue;
}
```

**Mirror Horizontal (lines 104-108):**
```typescript
if (symmetryId === "mirror-h") {
  out.push(layer);
  out.push(withTransform(layer, nextId,
    `translate(0,${centerY}) scale(1,-1) translate(0,${-centerY})`));
  continue;
}
```

**Mirror VH (lines 110-116):**
```typescript
if (symmetryId === "mirror-vh") {
  out.push(layer);
  out.push(withTransform(layer, nextId, `translate(${centerX},0) scale(-1,1) translate(${-centerX},0)`));
  out.push(withTransform(layer, nextId, `translate(0,${centerY}) scale(1,-1) translate(0,${-centerY})`));
  out.push(withTransform(layer, nextId, `translate(${centerX},${centerY}) scale(-1,-1) translate(${-centerX},${-centerY})`));
  continue;
}
```

**Rotational (lines 118-130):**
```typescript
if (definition.category === "rotational") {
  const foldCount = definition.foldCount;
  const angleIncrement = 360 / foldCount;
  out.push(layer);
  for (let i = 1; i < foldCount; i++) {
    out.push(withTransform(layer, nextId,
      `translate(${centerX} ${centerY}) rotate(${i * angleIncrement}) translate(${-centerX} ${-centerY})`));
  }
  continue;
}
```

**Radial with Sun Rays (lines 132-158):**
```typescript
if (definition.category === "radial") {
  // Add sun ray background
  if (!radialRaysAdded) {
    out.push({
      id: nextId(),
      type: "rays",
      d: sunRaysPath(centerX, centerY, size * rayInnerMul, size * rayOuterMul, definition.foldCount),
      fill: "none",
      stroke: accentColor,
      strokeWidth: Math.max(0.75, strokeWidth * 0.6),
      opacity: 0.35,
    });
    radialRaysAdded = true;
  }
  // Create rotated copies with radial offset
  const foldCount = definition.foldCount;
  const angleIncrement = 360 / foldCount;
  const radialOffset = size * (foldCount >= 12 ? 0.16 : 0.12);
  for (let i = 0; i < foldCount; i++) {
    out.push(withTransform(layer, nextId,
      `translate(${centerX} ${centerY}) rotate(${i * angleIncrement}) translate(0 ${-radialOffset}) translate(${-centerX} ${-centerY})`));
  }
  continue;
}
```

**Hybrid (lines 160-186):**
```typescript
if (definition.category === "hybrid") {
  if (symmetryId === "hybrid-quad") {
    // Special case: quad mirror + rotation
    out.push(layer);
    out.push(withTransform(layer, nextId, `translate(${centerX},0) scale(-1,1) translate(${-centerX},0)`));
    out.push(withTransform(layer, nextId, `translate(0,${centerY}) scale(1,-1) translate(0,${-centerY})`));
    out.push(withTransform(layer, nextId, `translate(${centerX} ${centerY}) rotate(180) translate(${-centerX} ${-centerY})`));
    continue;
  }
  // Other hybrids: rotation + mirror
  const foldCount = symmetryId === "hybrid-oct" ? 4 : 3;
  const angleIncrement = 360 / foldCount;
  for (let i = 0; i < foldCount; i++) {
    const angle = i * angleIncrement;
    const rotated = withTransform(layer, nextId,
      `translate(${centerX} ${centerY}) rotate(${angle}) translate(${-centerX} ${-centerY})`);
    out.push(rotated);
    const mirrored = {
      ...rotated,
      id: nextId(),
      transform: composeTransform(`translate(${centerX},0) scale(-1,1) translate(${-centerX},0)`, rotated.transform),
    };
    out.push(mirrored);
  }
  continue;
}
```

### [`buildSymmetryConfig()`](../src/icon-generator/symmetry.ts:23)

Creates a SymmetryConfig object with metadata.

```typescript
export function buildSymmetryConfig(input: {
  symmetryId: SymmetryId;
  seed: string;
  domain?: string;
  generatorVersion: string;
  selectedBy?: SymmetrySelectedBy;
  selectedAt?: string;
  regenerateReason?: "manual_symmetry_change" | "domain_change" | null;
}): SymmetryConfig
```

### [`getSymmetryDefinition()`](../src/icon-generator/symmetryDefinitions.ts)

Retrieves the definition for a symmetry ID from `SYMMETRY_DEFINITIONS`.

## State Management

### Symmetry in IconConfig

```typescript
export type IconConfig = {
  symmetry?: SymmetryId;
  // ...
};
```

### Symmetry Config in Export

```typescript
export type ExportPayload = {
  state: {
    symmetry: SymmetryConfig;
    // ...
  };
  // ...
};
```

## Related Files

| File | Purpose |
|------|---------|
| [`symmetry.ts`](../src/icon-generator/symmetry.ts) | Core symmetry algorithms |
| [`symmetryDefinitions.ts`](../src/icon-generator/symmetryDefinitions.ts) | Symmetry type definitions |
| [`domainSymmetryAffinities.ts`](../src/icon-generator/domainSymmetryAffinities.ts) | Domain-symmetry mappings |
| [`SPEC-SYMMETRY.md`](../SPEC-SYMMETRY.md) | Full symmetry specification |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
