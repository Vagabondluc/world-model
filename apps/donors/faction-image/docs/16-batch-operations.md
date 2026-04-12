# Batch Operations

**Onboarding Panel Target:** `[data-onboard="batch-ops"]`

## Overview

Batch operations allow users to perform actions on multiple selected layers simultaneously. This includes changing visibility, opacity, blend mode, as well as duplicating and deleting layers in bulk. Multi-selection is achieved by Shift+click or Ctrl+click on the layer list.

## UI Component

- **Component:** [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx)
- **Location:** Layers Sidebar, Batch Operations section (collapsible)
- **Actions:**
  - Set Visibility (visible/hidden)
  - Set Opacity (0-100%)
  - Set Blend Mode
  - Duplicate Selected
  - Delete Selected

## Data Structures

### Multi-Selection State

```typescript
// From LayersState
{
  selectedLayerId: LayerId | null;      // Primary selection
  selectedLayerIds: LayerId[];          // Multi-selection array
}
```

### Batch Update Action

```typescript
// From layersReducer.ts
type LayersAction =
  | { type: "batch-set-visibility"; visible: boolean }
  | { type: "batch-set-opacity"; opacity: number }
  | { type: "batch-set-blend-mode"; blendMode: BlendMode }
  | { type: "batch-delete" }
  | { type: "batch-duplicate" };
```

## Code Execution Path

### 1. Multi-Selection Flow

```
User Shift+Click on layer
    ↓
onClick handler checks e.shiftKey
    ↓
dispatch({ type: "select-layer", layerId, additive: true })
    ↓
layerId added to selectedLayerIds
    ↓
UI indicates multi-select state
```

### 2. Batch Visibility Change

```
User clicks "Set Visible" in batch ops
    ↓
dispatch({ type: "batch-set-visibility", visible: true/false })
    ↓
All layers in selectedLayerIds updated
    ↓
Preview reflects visibility changes
```

### 3. Batch Delete Flow

```
User clicks "Delete Selected" in batch Ops
    ↓
dispatch({ type: "batch-delete" })
    ↓
All selected layers removed from layers array
    ↓
selectedLayerIds cleared
    ↓
Undo history records deletion
```

## Key Functions

### Batch Update Handler in [`layersReducer.ts`](../src/icon-generator/layersReducer.ts)

```typescript
case "batch-set-visibility": {
  const { visible } = action;
  const nextLayers = state.selectedLayerIds.reduce((acc, id) => {
    return updateById(acc, id, (layer) => ({ ...layer, visible }));
  }, state.layers);
  return withHistory(state, { ...state, layers: nextLayers }, "batch", state.selectedLayerIds);
}

case "batch-set-opacity": {
  const { opacity } = action;
  const nextLayers = state.selectedLayerIds.reduce((acc, id) => {
    return updateById(acc, id, (layer) => ({ ...layer, opacity }));
  }, state.layers);
  return withHistory(state, { ...state, layers: nextLayers }, "batch", state.selectedLayerIds);
}

case "batch-set-blend-mode": {
  const { blendMode } = action;
  const nextLayers = state.selectedLayerIds.reduce((acc, id) => {
    return updateById(acc, id, (layer) => ({ ...layer, blendMode }));
  }, state.layers);
  return withHistory(state, { ...state, layers: nextLayers }, "batch", state.selectedLayerIds);
}
```

### Batch Delete Handler

```typescript
case "batch-delete": {
  let nextLayers = [...state.layers];
  state.selectedLayerIds.forEach((id) => {
    nextLayers = removeById(nextLayers, id);
  });
  return withHistory(
    state,
    { ...state, layers: reindex(nextLayers), selectedLayerIds: [] },
    "batch",
    state.selectedLayerIds
  );
}
```

## Batch Operations UI

| Action | Effect |
|--------|-------|
| Set Visible | Toggle visibility for all selected |
| Set Opacity | Set opacity for all selected |
| Set Blend | Set blend mode for all selected |
| Duplicate | Create copies of all selected |
| Delete | Remove all selected layers |

## State Management

### Selection State

```typescript
// Single selection
selectedLayerId: LayerId | null;

// Multi-selection
selectedLayerIds: LayerId[];
```

### After Batch Operation

```typescript
// Following batch delete
{
  selectedLayerIds: [],  // Cleared
  layers: LayerItem[],  // Updated without deleted
}
```

## Related Files

| File | Purpose |
|------|---------|
| [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx) | Batch operations UI |
| [`layersReducer.ts`](../src/icon-generator/layersReducer.ts) | Batch action handlers |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
