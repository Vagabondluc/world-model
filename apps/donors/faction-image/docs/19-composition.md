# Composition

**Onboarding Panel Target:** `[data-onboard="composition"]`

## Overview

Composition effects add visual polish and atmosphere to generated icons. The composition includes rings, halos, and dust particles that create depth and visual interest around the main icon. These effects are applied as layers over the main icon content.

## UI Component

- **Component:** [`IconGenerator.tsx`](../src/icon-generator/IconGenerator.tsx)
- **Location:** Left sidebar, Composition section
- **Controls:**
  - Rings toggle
  - Halo toggle
  - Dust toggle
  - Blend mode selector
  - Filter preset selector
  - Filter intensity slider

## Data Structures

### Composition Mode

```typescript
// From types.ts
export type CompositionMode =
  | "overlay-center"
  | "impalement-horizontal"
  | "quartered";
```

### Composition Config

```typescript
// From types.ts
export type CompositionConfig = {
  id: string;
  compositionVersion: number;
  mode: CompositionMode;
  revisionId: string;
  appliedToVariants: string[] | "all";
  updatedAt: string;
  layers?: LayerItem[];
};
```

### Filter Preset

```typescript
// From types.ts
export type FilterPreset = "none" | "glow" | "etch" | "mist";

export type FilterDef = {
  id: string;
  preset: Exclude<FilterPreset, "none">;
  intensity: number;
};
```

## Code Execution Path

### 1. Composition Toggle Flow

```
User toggles composition effect (rings/halo/dust)
    ↓
State updated: composeRings = composeHalo, composeDust
    ↓
applyComposition() called
    ↓
Composition layers added to spec
    ↓
Preview updates
```

### 2. Filter Application Flow

```
User selects filter preset
    ↓
State updated: filterPreset, filterIntensity
    ↓
applyComposition() called
    ↓
Filter definition added to spec.filters
    ↓
SVG filter element applied to layers
```

## Key Functions

### [`makeCompositionLayers()`](../src/icon-generator/IconGenerator.tsx:98)

Creates composition effect layers.

```typescript
function makeCompositionLayers(
  size: number,
  blendMode: BlendMode,
  intensity: number,
  withRings: boolean,
  withHalo: boolean,
  withDust: boolean
): Layer[] {
  const cx = size / 2;
  const cy = size / 2;
  const layers: Layer[] = [];

  if (withRings) {
    layers.push({
      id: `comp-rings-${size}`,
      type: "ring",
      cx, cy,
      r: size * 0.46,
      fill: "none",
      stroke: "#ffffff",
      strokeWidth: 0.8 + intensity * 1.4,
      opacity: 0.12 + intensity * 0.24,
      blendMode,
    });
  }

  if (withHalo) {
    layers.push({
      id: `comp-halo-${size}`,
      type: "circle",
      cx, cy,
      r: size * 0.42,
      fill: "#ffffff",
      stroke: "none",
      opacity: 0.04 + intensity * 0.12,
      blendMode: blendMode === "normal" ? "screen" : blendMode,
    });
  }

  if (withDust) {
    const dustPath = Array.from({ length: 12 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 12;
      const r = size * (0.3 + (i % 3) * 0.07);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      const dotR = 0.8 + (i % 4) * 0.5;
      return `M${x},${y}m-${dotR},0a${dotR},${dotR} 0 1,0 ${dotR * 2},0a${dotR},${dotR} 0 1,0 -${dotR * 2},0`;
    }).join("");

    layers.push({
      id: `comp-dust-${size}`,
      type: "dots",
      d: dustPath,
      fill: "#ffffff",
      stroke: "none",
      opacity: 0.2 + intensity * 0.3,
      blendMode,
    });
  }

  return layers;
}
```

### [`applyComposition()`](../src/icon-generator/IconGenerator.tsx:151)

Applies composition effects and filter to an IconSpec.

```typescript
function applyComposition(
  spec: IconSpec,
  blendMode: BlendMode,
  filterPreset: FilterPreset,
  filterIntensity: number,
  withRings: boolean,
  withHalo: boolean,
  withDust: boolean
): IconSpec {
  const filterId = filterPreset === "none" ? undefined : "fx-main";
  const filters: FilterDef[] | undefined = filterPreset === "none"
    ? undefined
    : [{ id: "fx-main", preset: filterPreset, intensity: filterIntensity }];

  const baseLayers = spec.layers.map((layer) => ({
    ...layer,
    blendMode,
    filterId
  }));

  const compLayers = makeCompositionLayers(
    spec.width, blendMode, filterIntensity, withRings, withHalo, withDust
  ).map((layer) => ({ ...layer, filterId }));

  return {
    ...spec,
    layers: [...baseLayers, ...compLayers],
    filters
  };
}
```

### [`buildCompositionConfig()`](../src/icon-generator/composition.ts:16)

Creates composition configuration for export.

```typescript
export function buildCompositionConfig(input: {
  id?: string;
  mode?: CompositionMode;
  compositionVersion?: number;
  appliedToVariants?: string[] | "all";
  updatedAt?: string;
  normalizedInput: unknown;
}): CompositionConfig {
  return {
    id: input.id || "composition-main",
    compositionVersion: input.compositionVersion ?? 1,
    mode: input.mode || "overlay-center",
    revisionId: compositionRevisionId(input.normalizedInput),
    appliedToVariants: input.appliedToVariants || "all",
    updatedAt: input.updatedAt || new Date().toISOString(),
  };
}
```

## Composition Effects

### Rings
- Concentric circles around the icon
- Radius: 46% of icon size
- Stroke-based, semi-transparent
- Adds framing effect

### Halo
- Soft glow behind the icon
- Radius: 42% of icon size
- Fill-based, very low opacity
- Uses screen blend mode

### Dust
- Small dots scattered around the icon
- 12 particles in circular arrangement
- Varying sizes and distances
- Adds particle effect

## Filter Presets

| Preset | Effect | Use Case |
|--------|--------|---------|
| none | No filter | Default |
| glow | Soft blur + merge | Ethereal glow |
| etch | Color matrix contrast | Sharp, etched look |
| mist | Light blur | Soft, dreamy effect |

## State Management

### Composition State

```typescript
// In IconGenerator component
const [composeRings, setComposeRings] = useState(true);
const [composeHalo, setComposeHalo] = useState(false);
const [composeDust, setComposeDust] = useState(false);
const [composeBlendMode, setComposeBlendMode] = useState<BlendMode>("screen");
const [filterPreset, setFilterPreset] = useState<FilterPreset>("none");
const [filterIntensity, setFilterIntensity] = useState(0.5);
```

### In Export Payload

```typescript
export type ExportPayload = {
  composition: CompositionConfig | null;
  // ...
};
```

## Related Files

| File | Purpose |
|------|---------|
| [`IconGenerator.tsx`](../src/icon-generator/IconGenerator.tsx) | Composition UI and application |
| [`composition.ts`](../src/icon-generator/composition.ts) | Composition config builder |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
| [`SVGRuntimeRenderer.tsx`](../src/icon-generator/SVGRuntimeRenderer.tsx) | Filter rendering |
