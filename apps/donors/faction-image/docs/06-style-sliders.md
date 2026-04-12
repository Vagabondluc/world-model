# Style Sliders

**Onboarding Panel Target:** `[data-onboard="style-sliders"]`

## Overview

Style sliders provide fine-grained control over the visual properties of generated icons. The primary controls include layer count and stroke width, which directly affect the density and visual weight of the icon. These controls are located in the Style section of the configuration panel.

## UI Component

- **Component:** [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx)
- **Location:** Left sidebar, Style section (collapsible)
- **Controls:**
  - Layer Count slider
  - Stroke Width slider

## Data Structures

### Layer Count Configuration

```typescript
// Layer count is stored in IconConfig
export type IconConfig = {
  layerCount?: number;  // Number of detail layers
  // ...
};
```

### Stroke Width Configuration

```typescript
// Stroke width is stored in IconConfig
export type IconConfig = {
  strokeWidth?: number;  // Base stroke width in pixels
  // ...
};
```

### Mood-Based Layer Defaults

```typescript
// From iconSpecBuilder.ts
const MOOD_DEFAULTS: Record<Mood, {
  minLayers: number;
  maxLayers: number;
  preferStroke: boolean;
  sharpBias: number;
}> = {
  stark:   { minLayers: 1, maxLayers: 3, preferStroke: true, sharpBias: 0.3 },
  ornate:  { minLayers: 4, maxLayers: 8, preferStroke: false, sharpBias: 0.4 },
  warlike: { minLayers: 2, maxLayers: 5, preferStroke: true, sharpBias: 0.9 },
  mystic:  { minLayers: 3, maxLayers: 6, preferStroke: false, sharpBias: 0.1 },
  gentle:  { minLayers: 2, maxLayers: 4, preferStroke: false, sharpBias: 0.0 },
  corrupt: { minLayers: 3, maxLayers: 6, preferStroke: true, sharpBias: 0.7 },
};
```

## Code Execution Path

### 1. Layer Count Flow

```
User adjusts layer count slider
    ↓
onChange updates config.layerCount
    ↓
buildIconSpec() uses layerCount or mood-based default
    ↓
Complexity multiplier applied: layerCount * compCfg.layerMul
    ↓
Detail layers generated
```

### 2. Stroke Width Flow

```
User adjusts stroke width slider
    ↓
onChange updates config.strokeWidth
    ↓
buildIconSpec() reads strokeWidth (default: 2)
    ↓
Complexity multiplier applied: sw = baseSW * compCfg.swMul
    ↓
All stroke-based elements use adjusted width
```

## Key Functions

### Layer Count Application in [`buildIconSpec()`](../src/icon-generator/iconSpecBuilder.ts:78-82)

```typescript
// Complexity-adjusted stroke width and layer count
const baseSW = config.strokeWidth ?? 2;
const sw = baseSW * compCfg.swMul;
const rawLayerCount = config.layerCount ?? rng.nextInt(moodDef.minLayers, moodDef.maxLayers);
const layerCount = Math.max(1, Math.round(rawLayerCount * compCfg.layerMul));
```

### Detail Layer Generation in [`buildIconSpec()`](../src/icon-generator/iconSpecBuilder.ts:118-140)

```typescript
// Detail layers (complexity-adjusted count)
const detailCount = Math.max(0, layerCount - 1);
for (let i = 0; i < detailCount; i++) {
  const pool = rng.next() < moodDef.sharpBias ? SHARP_SHAPES : ROUND_SHAPES;
  const detailAvail = pool.filter((s) => DETAIL_SHAPES.includes(s));
  const shape = rng.pick(detailAvail.length ? detailAvail : DETAIL_SHAPES);
  const scale = (0.15 + rng.next() * 0.25) * compCfg.detailScale;
  const detailR = size * scale;
  const dcx = cx + (rng.next() - 0.5) * size * 0.3;
  const dcy = cy + (rng.next() - 0.5) * size * 0.3;

  const detailColor = rng.next() > 0.5 ? accent : secondary;
  const strokeC = shadow || primary;
  const layer = makeShapeLayer(
    nextId(), shape, dcx, dcy, detailR,
    detailColor, strokeC, sw * 0.7,
    moodDef.preferStroke,
    0.6 + rng.next() * 0.4
  );

  layers.push(layer);
  coreLayerIds.add(layer.id);
}
```

## Slider Ranges

### Layer Count
- **Range:** 1-10 (typical)
- **Default:** Determined by mood (1-8)
- **Effect:** More layers = denser, more complex icons

### Stroke Width
- **Range:** 0.5-6 (typical)
- **Default:** 2
- **Effect:** Thicker strokes = bolder, more prominent outlines

## Interaction with Complexity

Both layer count and stroke width are modified by the complexity setting:

| Complexity | Layer Mult | Stroke Mult |
|------------|------------|-------------|
| 1 | 0.4x | 0.7x |
| 2 | 0.7x | 0.85x |
| 3 | 1.0x | 1.0x |
| 4 | 1.4x | 1.15x |
| 5 | 1.8x | 1.3x |

**Example:**
- User sets layerCount = 4, strokeWidth = 2
- Complexity = 5 (Ornate)
- Effective layerCount = 4 × 1.8 = 7 layers
- Effective strokeWidth = 2 × 1.3 = 2.6px

## State Management

### Style Settings in IconConfig

```typescript
export type IconConfig = {
  layerCount?: number;
  strokeWidth?: number;
  mood?: Mood;
  complexity?: Complexity;
  // ...
};
```

## Related Files

| File | Purpose |
|------|---------|
| [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx) | Style slider UI |
| [`iconSpecBuilder.ts`](../src/icon-generator/iconSpecBuilder.ts) | Style parameter application |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
