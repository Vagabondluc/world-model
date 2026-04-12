# Layers Sidebar

**Onboarding Panel Target:** `[data-onboard="layers-sidebar"]`

## Overview

The Layers Sidebar is a collapsible panel that provides comprehensive layer management functionality. It contains the layer list, properties panel, transform controls, batch operations, and template access. The sidebar can be resized, collapsed, or set to auto-hide mode for maximum workspace flexibility.

## UI Component

- **Component:** [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx)
- **Location:** Right side of application
- **Features:**
  - Collapsible sections
  - Resizable width
  - Auto-hide capability
  - Layer list with virtualization

## Data Structures

### Layers State

```typescript
// From types.ts
export type LayersState = {
  layers: LayerItem[];
  selectedLayerId: LayerId | null;
  selectedLayerIds: LayerId[];
  sidebarOpen: boolean;
  sidebarWidth: number;
  sidebarAutoHide: boolean;
  pendingCommit: boolean;
  activeGesture: null | {
    id: string;
    kind: "opacity" | "rotation" | "scale" | "position";
  };
  renameTargetLayerId: LayerId | null;
  undoStack: LayerOperation[];
  redoStack: LayerOperation[];
};
```

### Sidebar Section Keys

```typescript
// From types.ts
export type SidebarSectionKey =
  | "generate"
  | "style"
  | "properties"
  | "transform"
  | "batchOps"
  | "templates";
```

### UI Preferences

```typescript
// From types.ts
export type UiPreferences = {
  sidebarSections: Record<SidebarSectionKey, boolean>; // true = collapsed
  scaleLinked: boolean;
  debugHooks: DebugHookSettings;
};
```

## Code Execution Path

### 1. Sidebar Toggle Flow

```
User clicks sidebar toggle button
    ↓
dispatch({ type: "toggle-sidebar" })
    ↓
sidebarOpen state toggled
    ↓
Sidebar animates open/closed
```

### 2. Sidebar Resize Flow

```
User drags resize handle
    ↓
onMouseDown handler attached
    ↓
mousemove updates sidebarWidth
    ↓
mouseup commits new width
    ↓
Width persisted to preferences
```

### 3. Auto-Hide Flow

```
sidebarAutoHide enabled
    ↓
Mouse leaves sidebar area
    ↓
Delay timer started
    ↓
If mouse doesn't return: sidebar collapses
    ↓
Mouse enters: sidebar expands
```

## Key Functions

### Sidebar Component Props

```typescript
// From LayersSidebar.tsx
type Props = {
  state: LayersState;
  dispatch: React.Dispatch<LayersAction>;
  onCopyTransform: (layerId: LayerId) => void;
  onPasteTransform: (layerId: LayerId) => void;
  onOpenDiscovery: () => void;
  debugHooks: DebugHookSettings;
  sectionCollapsed: {
    properties: boolean;
    transform: boolean;
    batchOps: boolean;
    templates: boolean;
  };
  onSectionCollapsedChange: (
    section: "properties" | "transform" | "batchOps" | "templates",
    collapsed: boolean
  ) => void;
  scaleLinked: boolean;
  onScaleLinkedChange: (value: boolean) => void;
  onOpenDebugSettings: () => void;
};
```

### Sidebar Sections

The sidebar contains these collapsible sections:

1. **Layer List** - Virtualized list of all layers
2. **Properties** - Name, visibility, opacity, blend mode
3. **Transform** - Rotation, scale, position controls
4. **Batch Operations** - Multi-select actions
5. **Templates** - Preset layer configurations

## State Management

### Sidebar State in LayersState

```typescript
// Managed by layersReducer
{
  sidebarOpen: boolean,      // Visibility state
  sidebarWidth: number,      // Pixel width
  sidebarAutoHide: boolean,  // Auto-hide mode
}
```

### Section Collapse State

```typescript
// Managed by UiPreferences
{
  properties: boolean,
  transform: boolean,
  batchOps: boolean,
  templates: boolean,
}
```

### Persistence

```typescript
// From uiPreferences.ts
export function loadUiPreferences(): UiPreferences;
export function persistSidebarSectionCollapsed(
  section: SidebarSectionKey,
  collapsed: boolean
): void;
```

## Auto-Hide Behavior

When auto-hide is enabled:

1. Sidebar collapses after mouse leaves
2. Typical delay: 500-1000ms
3. Hovering over toggle expands sidebar
4. Clicking toggle pins sidebar open

## Width Constraints

| Property | Value |
|----------|-------|
| Minimum Width | 240px |
| Maximum Width | 480px |
| Default Width | 320px |

## Related Files

| File | Purpose |
|------|---------|
| [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx) | Sidebar component |
| [`layersReducer.ts`](../src/icon-generator/layersReducer.ts) | Sidebar state management |
| [`uiPreferences.ts`](../src/icon-generator/uiPreferences.ts) | Persistence |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
