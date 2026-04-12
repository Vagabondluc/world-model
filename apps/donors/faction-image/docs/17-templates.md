# Templates

**Onboarding Panel Target:** `[data-onboard="templates"]`

## Overview

Templates are pre-configured layer stacks that can be quickly applied to the icon composition. They provide starting points for common icon styles, such as emblems, badges, seals, or decorative frames. Templates can be customized after application.

## UI Component

- **Component:** [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx)
- **Location:** Layers Sidebar, Templates section (collapsible)
- **Features:**
  - Template preview thumbnails
  - Apply template button
  - Template categories

## Data Structures

### Template Definition

```typescript
// Template structure (conceptual)
type LayerTemplate = {
  id: string;
  name: string;
  category: "emblem" | "badge" | "seal" | "frame" | "decorative";
  description: string;
  layers: Partial<LayerItem>[];
  thumbnail?: string;
};
```

### Template Application

```typescript
// When template applied
dispatch({ type: "apply-template", templateId: string })
    ↓
Existing layers cleared or preserved based on options
    ↓
Template layers inserted
    ↓
Layer properties applied
```

## Code Execution Path

### 1. Template Selection Flow

```
User browses template gallery
    ↓
Template preview displayed
    ↓
User clicks "Apply" button
    ↓
onApplyTemplate(templateId) callback triggered
    ↓
Template layers loaded into state
    ↓
Layers list updated with template layers
```

### 2. Template Application Options

```
Template selected
    ↓
User chooses application mode:
  - Replace: Clear existing layers
  - Append: Add to existing layers
  - Merge: Combine with existing
    ↓
Layers updated accordingly
```

## Template Categories

### Emblem Templates
- Simple, centered symbols
- Single main symbol layer
- Minimal decoration

### Badge Templates
- Shield or badge shapes
- Multiple layer composition
- Border elements

### Seal Templates
- Circular designs
- Ring layers
- Stamp-like appearance

### Frame Templates
- Decorative borders
- Corner ornaments
- Edge details

### Decorative Templates
- Complex multi-layer designs
- Ornamental elements
- High detail level

## State Management

### Template Storage

Templates are stored as predefined configurations:

```typescript
const LAYER_TEMPLATES: Record<string, LayerTemplate> = {
  "simple-emblem": {
    id: "simple-emblem",
    name: "Simple Emblem",
    category: "emblem",
    layers: [
      { type: "symbol", symbol: "star", scale: 0.8 }
    ]
  },
  // ... more templates
};
```

### Template in LayersState

```typescript
// Currently no explicit template state in LayersState
// Templates are applied directly to layers
```

## Related Files

| File | Purpose |
|------|---------|
| [`LayersSidebar.tsx`](../src/icon-generator/LayersSidebar.tsx) | Template UI |
| [`layersReducer.ts`](../src/icon-generator/layersReducer.ts) | Template application |
| [`types.ts`](../src/icon-generator/types.ts) | LayerItem type |
