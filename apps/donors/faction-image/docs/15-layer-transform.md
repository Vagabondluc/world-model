# Layer Transform

**Onboarding Panel Target:** `[data-onboard="layer-transform"]`

## Overview

Transform controls allow manipulation of layer position, rotation, and scale within the icon composition. The transform origin determines the pivot point for rotation and scaling operations.

## UI Component

- **Component:** [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx)
- **Location:** Layers Sidebar, Transform section (collapsible)
- **Controls:**
  - Rotation slider (-180 to 180)
  - Scale X slider (0.1 to 3.0)
  - Scale Y slider (0.1 to 3.0)
  - X position slider
  - Y position slider
  - Transform origin dropdown
  - Link scales toggle

## Data Structures

### Transform Properties

```typescript
// From types.ts - LayerItem.transform
transform: {
  rotation: number;        // Degrees (-180 to 180)
  scaleX: number;          // Horizontal scale (0.1 to 3.0)
  scaleY: number;          // Vertical scale (0.1 to 3.0)
  x: number;               // X offset in pixels
  y: number;               // Y offset in pixels
  transformOrigin: TransformOrigin;
}
```

### Transform Origin Type

```typescript
// From types.ts
export type TransformOrigin =
  | "center"
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";
```

## Code Execution Path

### Transform Change Flow

```
User adjusts transform slider
    ↓
onChange captures new value
    ↓
if (scaleLinked && (scaleX || scaleY changed)) {
  both scaleX and scaleY updated
}
    ↓
dispatch({ type: "update-layer", layerId, updates: { transform } })
    ↓
Layer transform updated in state
    ↓
Preview re-renders with new transform
```

## Key Functions

### Transform to SVG String

```typescript
// From IconGenerator.tsx
const toTransform = (layer: LayerItem) => {
  const tx = layer.transform.x;
  const ty = layer.transform.y;
  const rot = layer.transform.rotation;
  const sx = layer.transform.scaleX;
  const sy = layer.transform.scaleY;
  const { x: ox, y: oy } = originPoint(layer.transform.transformOrigin, width, height);
  // Deterministic order: translate -> rotate -> scale
  return `translate(${tx} ${ty}) translate(${ox} ${oy}) rotate(${rot}) scale(${sx} ${sy}) translate(${-ox} ${-oy})`;
};
```

### Origin Point Calculation

```typescript
// From IconGenerator.tsx
function originPoint(
  origin: TransformOrigin,
  width: number,
  height: number
): { x: number; y: number } {
  const mapX = origin.includes("left") ? 0 : origin.includes("right") ? width : width / 2;
  const mapY = origin.includes("top") ? 0 : origin.includes("bottom") ? height : height / 2;
  return { x: mapX, y: mapY };
}
```

## Transform Origin Positions

| Origin | X Position | Y Position |
|--------|------------|------------|
| center | width/2 | height/2 |
| top-left | 0 | 0 |
| top | width/2 | 0 |
| top-right | width | 0 |
| left | 0 | height/2 |
| right | width | height/2 |
| bottom-left | 0 | height |
| bottom | width/2 | height |
| bottom-right | width | height |

## State Management

### Transform in LayerItem

```typescript
export type LayerItem = {
  transform: {
    rotation: number;
    scaleX: number;
    scaleY: number;
    x: number;
    y: number;
    transformOrigin: TransformOrigin;
  };
  // ...
};
```

### Scale Link Preference

```typescript
// From UiPreferences
{
  scaleLinked: boolean;  // True = X and Y scale together
}
```

## Related Files

| File | Purpose |
|------|---------|
| [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx) | Transform controls UI |
| [`IconGenerator.tsx`](../src/icon-generator/IconGenerator.tsx) | Transform to SVG conversion |
| [`layersReducer.ts`](../src/icon-generator/layersReducer.ts) | Transform update actions |
| [`types.ts`](../src/icon-generator/types.ts) | Transform type definitions |
