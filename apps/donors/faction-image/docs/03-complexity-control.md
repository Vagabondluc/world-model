# Complexity Control

**Onboarding Panel Target:** `[data-onboard="complexity"]`

## Overview

The complexity slider controls the density and detail level of generated icons. It affects layer count, stroke weight, detail scale, and the number of ornamental elements. Higher complexity values produce more intricate, layered designs while lower values create simpler, cleaner icons.

## UI Component

- **Component:** [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx)
- **Location:** Left sidebar, Style section
- **Control:** Slider with 5 positions (1-5)
- **Labels:**
  - 1: Minimal
  - 2: Simple
  - 3: Standard
  - 4: Complex
  - 5: Ornate

## Data Structures

### Complexity Type

```typescript
// From types.ts
export type Complexity = 1 | 2 | 3 | 4 | 5;
```

### Complexity Configuration

```typescript
// From iconSpecBuilder.ts
const COMPLEXITY_CONFIG: Record<Complexity, {
  layerMul: number;      // Layer count multiplier
  swMul: number;         // Stroke width multiplier
  detailScale: number;   // Detail element scale
  extraRings: number;    // Additional ring layers
}> = {
  1: { layerMul: 0.4, swMul: 0.7, detailScale: 0.6, extraRings: 0 },
  2: { layerMul: 0.7, swMul: 0.85, detailScale: 0.8, extraRings: 0 },
  3: { layerMul: 1.0, swMul: 1.0, detailScale: 1.0, extraRings: 1 },
  4: { layerMul: 1.4, swMul: 1.15, detailScale: 1.2, extraRings: 2 },
  5: { layerMul: 1.8, swMul: 1.3, detailScale: 1.4, extraRings: 3 },
};
```

## Code Execution Path

### 1. Complexity Change Flow

```
User adjusts complexity slider (ConfigForm.tsx)
    ↓
onChange handler updates config.complexity
    ↓
Icon regenerated with new complexity settings
    ↓
buildIconSpec() reads COMPLEXITY_CONFIG[complexity]
    ↓
Layer count, stroke width, detail scale adjusted
```

### 2. Complexity Application in Generation

```
buildIconSpec() called with complexity value (iconSpecBuilder.ts:55-56)
    ↓
const compCfg = COMPLEXITY_CONFIG[complexity]
    ↓
Stroke width: sw = baseSW * compCfg.swMul
    ↓
Layer count: layerCount = rawLayerCount * compCfg.layerMul
    ↓
Detail scale: detailR = size * scale * compCfg.detailScale
    ↓
Extra rings: for (i = 0; i < compCfg.extraRings; i++)
```

## Key Functions

### Complexity Application in [`buildIconSpec()`](../src/icon-generator/iconSpecBuilder.ts:46)

The complexity value is applied at multiple points during icon generation:

**Stroke Width Adjustment (line 79-80):**
```typescript
const baseSW = config.strokeWidth ?? 2;
const sw = baseSW * compCfg.swMul;
```

**Layer Count Adjustment (line 81-82):**
```typescript
const rawLayerCount = config.layerCount ?? rng.nextInt(moodDef.minLayers, moodDef.maxLayers);
const layerCount = Math.max(1, Math.round(rawLayerCount * compCfg.layerMul));
```

**Detail Scale Adjustment (line 124-125):**
```typescript
const scale = (0.15 + rng.next() * 0.25) * compCfg.detailScale;
const detailR = size * scale;
```

**Extra Ornamental Rings (lines 142-150):**
```typescript
for (let i = 0; i < compCfg.extraRings; i++) {
  const ringR = size * (0.35 + i * 0.08);
  // ... create ring layer
}
```

## Complexity Effects Summary

| Level | Layer Mult | Stroke Mult | Detail Scale | Extra Rings |
|-------|------------|-------------|--------------|-------------|
| 1 (Minimal) | 0.4x | 0.7x | 0.6x | 0 |
| 2 (Simple) | 0.7x | 0.85x | 0.8x | 0 |
| 3 (Standard) | 1.0x | 1.0x | 1.0x | 1 |
| 4 (Complex) | 1.4x | 1.15x | 1.2x | 2 |
| 5 (Ornate) | 1.8x | 1.3x | 1.4x | 3 |

## State Management

### Complexity in IconConfig

```typescript
export type IconConfig = {
  complexity?: Complexity;
  // ... other config properties
};
```

### Default Value

```typescript
// In buildIconSpec()
const complexity: Complexity = config.complexity ?? 3;
```

## Visual Impact

### Low Complexity (1-2)
- Fewer layers (1-3 typical)
- Thinner strokes
- Smaller detail elements
- No extra ornamental rings
- Cleaner, more minimalist appearance

### Medium Complexity (3)
- Moderate layer count (3-5 typical)
- Standard stroke width
- Normal detail scale
- 1 extra ornamental ring
- Balanced appearance

### High Complexity (4-5)
- Many layers (5-8+ typical)
- Thicker strokes
- Larger detail elements
- 2-3 extra ornamental rings
- Intricate, ornate appearance

## Related Files

| File | Purpose |
|------|---------|
| [`iconSpecBuilder.ts`](../src/icon-generator/iconSpecBuilder.ts) | Complexity configuration and application |
| [`types.ts`](../src/icon-generator/types.ts) | Complexity type definition |
| [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx) | Complexity slider UI |
