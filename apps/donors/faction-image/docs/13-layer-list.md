# Layer List

**Onboarding Panel Target:** `[data-onboard="layer-list"]`

## Overview

The Layer List displays all layers in the current icon composition in a virtualized, scrollable list. It supports single and multi-selection, drag-drop reordering, inline renaming, and quick actions for visibility, locking, and deletion. The list uses react-window for efficient rendering of large layer stacks.

## UI Component

- **Component:** [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx:90-200)
- **Location:** Layers Sidebar, top section
- **Library:** react-window for virtualization

## Data Structures

### Layer Item

```typescript
// From types.ts
export type LayerItem = {
  layerId: LayerId;
  name: string;
  content: LayerContent;
  semanticRole: SemanticRole;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  transform: {
    rotation: number;
    scaleX: number;
    scaleY: number;
    x: number;
    y: number;
    transformOrigin: "center" | "top-left" | "top" | ...;
  };
  createdAt: string;
  modifiedAt: string;
  zIndex: number;
  children?: LayerItem[];
};
```

### Flat Row Type

```typescript
// From LayersSidebar.tsx
type FlatRow = {
  layer: LayerItem;
  depth: number;
};
```

### Selection State

```typescript
// From LayersState
{
  selectedLayerId: LayerId | null;      // Single selection
  selectedLayerIds: LayerId[];          // Multi-selection
}
```

## Code Execution Path

### 1. Layer Selection Flow

```
User clicks layer row
    ↓
onClick handler triggered
    ↓
if (e.shiftKey) {
  // Additive selection
  dispatch({ type: "select-layer", layerId, additive: true })
} else {
  // Single selection
  dispatch({ type: "select-layer", layerId, additive: false })
}
    ↓
selectedLayerId / selectedLayerIds updated
    ↓
Properties panel shows selected layer(s)
```

### 2. Drag-Drop Reorder Flow

```
User starts dragging layer row
    ↓
onDragStart: e.dataTransfer.setData("text/layer-id", layerId)
    ↓
User drops on target row
    ↓
onDrop: position = e.clientY < mid ? "before" : "after"
    ↓
dispatch({ type: "reorder-layer", layerId, targetLayerId, position })
    ↓
Layer moved in layers array
    ↓
zIndex values recalculated
```

### 3. Inline Rename Flow

```
User double-clicks layer name
    ↓
setEditing(true) on row
    ↓
Input field appears with current name
    ↓
User types new name
    ↓
onBlur or Enter: dispatch({ type: "rename-layer", layerId, name })
    ↓
Layer name updated, modifiedAt timestamp set
```

## Key Functions

### [`flattenVisibleTree()`](../src/icon-generator/LayersSidebar.tsx:79)

Converts hierarchical layer structure to flat array for virtualized rendering.

```typescript
function flattenVisibleTree(
  layers: LayerItem[],
  collapsed: Set<LayerId>,
  depth = 0
): FlatRow[] {
  const out: FlatRow[] = [];
  for (const layer of layers) {
    out.push({ layer, depth });
    if (layer.children?.length && !collapsed.has(layer.layerId)) {
      out.push(...flattenVisibleTree(layer.children, collapsed, depth + 1));
    }
  }
  return out;
}
```

### [`filterTree()`](../src/icon-generator/LayersSidebar.tsx:58)

Filters layers by search query while preserving hierarchy.

```typescript
function filterTree(layers: LayerItem[], query: string): LayerItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return layers;
  const visit = (node: LayerItem): LayerItem | null => {
    const childMatches = (node.children || [])
      .map(visit)
      .filter((c): c is LayerItem => !!c);
    const selfText = `${node.name} ${descriptor}`.toLowerCase();
    const selfMatch = selfText.includes(q);
    if (selfMatch || childMatches.length) {
      return { ...node, children: childMatches.length ? childMatches : undefined };
    }
    return null;
  };
  return layers.map(visit).filter((n): n is LayerItem => !!n);
}
```

### Row Component

```tsx
// From LayersSidebar.tsx:90-200
function Row({
  layer,
  depth,
  selected,
  selectedMany,
  collapsed,
  onToggleGroup,
  dispatch,
  onRename,
  onCopyTransform,
  onPasteTransform,
  renameRequested,
  style,
}) {
  // ... rendering logic
}
```

## Layer Row Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Select | Click | Single selection |
| Multi-select | Shift+Click | Add to selection |
| Rename | Double-click name | Inline edit mode |
| Toggle visibility | 👁 button | visible toggle |
| Toggle lock | 🔒 button | locked toggle |
| Copy transform | ⎘ button | Copy to clipboard |
| Paste transform | ⎀ button | Apply copied transform |
| Duplicate | ⧉ button | Clone layer |
| Delete | ✕ button | Remove layer |
| Reorder | Drag & drop | Move layer position |

## Virtualization

The layer list uses react-window for performance:

```typescript
import { List } from "react-window";

<List
  height={listHeight}
  itemCount={flatRows.length}
  itemSize={44}  // Row height
  width="100%"
>
  {({ index, style }) => (
    <Row
      layer={flatRows[index].layer}
      depth={flatRows[index].depth}
      style={style}
      // ... other props
    />
  )}
</List>
```

## State Management

### Layer List State

```typescript
// In LayersState
{
  layers: LayerItem[],           // Layer hierarchy
  selectedLayerId: LayerId | null,
  selectedLayerIds: LayerId[],
}
```

### Reducer Actions

```typescript
type LayersAction =
  | { type: "select-layer"; layerId: LayerId; additive?: boolean }
  | { type: "reorder-layer"; layerId: LayerId; targetLayerId: LayerId; position: "before" | "after" }
  | { type: "rename-layer"; layerId: LayerId; name: string }
  | { type: "toggle-visible"; layerId: LayerId }
  | { type: "toggle-locked"; layerId: LayerId }
  | { type: "delete-layer"; layerId: LayerId }
  | { type: "duplicate-layer"; layerId: LayerId }
  // ... more actions
```

## Related Files

| File | Purpose |
|------|---------|
| [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx) | Layer list component |
| [`layersReducer.ts`](../src/icon-generator/layersReducer.ts) | Layer state management |
| [`types.ts`](../src/icon-generator/types.ts) | LayerItem type definitions |
