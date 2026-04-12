# Layer Properties

**Onboarding Panel Target:** `[data-onboard="layer-properties"]`

## Overview

Layer Properties controls allow editing the basic attributes of selected layers. This includes the layer name, visibility toggle, opacity slider, and blend mode selection. These properties affect how the layer appears in the final composition and how it interacts with layers beneath it.

## UI Component

- **Component:** [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx)
- **Location:** Layers Sidebar, Properties section (collapsible)
- **Controls:**
  - Name text input
  - Visibility toggle (👁/🙈)
  - Opacity slider (0-100%)
  - Blend mode dropdown

## Data Structures

### Layer Properties

```typescript
// From types.ts - LayerItem
{
  name: string;           // Display name
  visible: boolean;       // Visibility flag
  locked: boolean;        // Edit lock flag
  opacity: number;        // 0-100
  blendMode: BlendMode;   // Compositing mode
}
```

### Blend Mode Type

```typescript
// From types.ts
export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "difference"
  | "exclusion"
  | "soft-light";
```

### Phase 1 vs Phase 2 Blend Modes

```typescript
// From LayersSidebar.tsx
const PHASE1_BLENDS: BlendMode[] = [
  "normal", "multiply", "screen", "overlay",
  "lighten", "darken"
];

const PHASE2_ADV_BLEND_MODES: BlendMode[] = [
  "color-dodge", "color-burn", "hard-light",
  "soft-light", "difference", "exclusion"
];
```

## Code Execution Path

### 1. Name Edit Flow

```
User edits name input
    ↓
onChange captures new value
    ↓
dispatch({ type: "rename-layer", layerId, name })
    ↓
Layer name updated in state
    ↓
modifiedAt timestamp updated
```

### 2. Visibility Toggle Flow

```
User clicks visibility button
    ↓
dispatch({ type: "toggle-visible", layerId })
    ↓
layer.visible = !layer.visible
    ↓
Preview updates to show/hide layer
```

### 3. Opacity Change Flow

```
User adjusts opacity slider
    ↓
onChange captures new value (0-100)
    ↓
dispatch({ type: "update-layer", layerId, updates: { opacity } })
    ↓
layer.opacity = value
    ↓
Preview updates with new opacity
```

### 4. Blend Mode Change Flow

```
User selects blend mode from dropdown
    ↓
onValueChange captures new mode
    ↓
dispatch({ type: "update-layer", layerId, updates: { blendMode } })
    ↓
layer.blendMode = mode
    ↓
Preview updates with new compositing
```

## Key Functions

### Property Update in [`layersReducer.ts`](../src/icon-generator/layersReducer.ts)

```typescript
// Update layer action
case "update-layer": {
  const { layerId, updates } = action;
  const nextLayers = updateById(state.layers, layerId, (layer) => ({
    ...touch(layer),
    ...updates,
  }));
  return withHistory(state, { ...state, layers: reindex(nextLayers) }, "update", [layerId]);
}

// Toggle visibility action
case "toggle-visible": {
  const { layerId } = action;
  const nextLayers = updateById(state.layers, layerId, (layer) => ({
    ...layer,
    visible: !layer.visible,
  }));
  return withHistory(state, { ...state, layers: nextLayers }, "update", [layerId]);
}

// Rename layer action
case "rename-layer": {
  const { layerId, name } = action;
  const nextLayers = updateById(state.layers, layerId, (layer) => ({
    ...touch(layer),
    name,
  }));
  return withHistory(state, { ...state, layers: nextLayers }, "rename", [layerId]);
}
```

## Blend Mode Effects

| Mode | Effect | Use Case |
|------|--------|----------|
| normal | No blending | Default |
| multiply | Darkens | Shadows, depth |
| screen | Lightens | Glows, highlights |
| overlay | Contrast | Texture overlay |
| darken | Keep darker | Shadow layers |
| lighten | Keep lighter | Highlight layers |
| color-dodge | Bright exposure | Intense glow |
| color-burn | Dark exposure | Deep shadows |
| hard-light | Strong overlay | Dramatic effects |
| soft-light | Subtle overlay | Gentle effects |
| difference | Invert difference | Artistic effects |
| exclusion | Softer difference | Subtle inversion |

## State Management

### Properties in LayerItem

```typescript
export type LayerItem = {
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  // ...
};
```

### Update Actions

```typescript
type LayersAction =
  | { type: "update-layer"; layerId: LayerId; updates: Partial<LayerItem> }
  | { type: "toggle-visible"; layerId: LayerId }
  | { type: "toggle-locked"; layerId: LayerId }
  | { type: "rename-layer"; layerId: LayerId; name: string }
  // ...
```

## Related Files

| File | Purpose |
|------|---------|
| [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx) | Properties UI |
| [`layersReducer.ts`](../src/icon-generator/layersReducer.ts) | Property update actions |
| [`types.ts`](../src/icon-generator/types.ts) | BlendMode, LayerItem types |
