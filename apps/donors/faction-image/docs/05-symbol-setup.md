# Symbol Setup

**Onboarding Panel Target:** `[data-onboard="symbol-setup"]`

## Overview

The symbol setup allows users to select the main hero symbol and background shape for the generated icon. The main symbol is the central visual element that defines the icon's identity, while the background shape provides the containing frame. Both elements work together to create the foundational structure of the faction icon.

## UI Components

### Main Symbol Picker

- **Component:** [`SymbolPicker.tsx`](../src/icon-generator/SymbolPicker.tsx)
- **Location:** Left sidebar, dedicated symbol section
- **Features:**
  - Search input with debounced queries
  - 6-column grid layout
  - Scrollable results (18 visible by default)
  - Color, opacity, blend mode controls
  - Outline settings (width, color, position)

### Background Shape Selector

- **Component:** [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx)
- **Location:** Left sidebar, Frame section
- **Options:** circle, square, shield, diamond

## Data Structures

### Main Symbol Type

```typescript
// From types.ts
export type MainSymbolType =
  | "eye"
  | "hammer"
  | "shield"
  | "mandala"
  | "rune"
  | "beast"
  | "star"
  | "crown"
  | "none";
```

### Background Shape Type

```typescript
// From types.ts
export type BackgroundShape = "circle" | "square" | "shield" | "diamond";
```

### Symbol Content in Layer

```typescript
// From types.ts
export type LayerContent =
  | { type: "blank" }
  | { type: "symbol"; symbol: Exclude<MainSymbolType, "none">; color: string; scale: number }
  | { type: "asset-symbol"; assetId: string; assetPath: string; recolor: {...}; ... }
  | { type: "group" };
```

### Symbol Picker Props

```typescript
// From SymbolPicker.tsx
type Props = {
  onSymbolSelect: (symbol: {
    assetId: string;
    assetPath: string;
    sourceHash: string;
    color: string;
    opacity: number;
    blendMode: BlendMode;
    outlineWidth: number;
    outlineColor: string;
    outlinePosition: "inside" | "center" | "outside";
  }) => void;
  currentSymbol?: IconKeywordRecord | null;
};
```

## Code Execution Path

### 1. Built-in Symbol Selection Flow

```
User selects from MAIN_SYMBOLS dropdown (ConfigForm.tsx:32)
    ↓
onChange updates config.mainSymbol
    ↓
buildIconSpec() creates symbol layer
    ↓
SYMBOL_PATHS[symbol] retrieves SVG path data
    ↓
Layer added with fill, stroke, transform
```

### 2. Asset Symbol Selection Flow

```
User searches in SymbolPicker (SymbolPicker.tsx:76-84)
    ↓
setQuery triggers discovery search (debounced 300ms)
    ↓
Results displayed in grid
    ↓
User clicks icon to select
    ↓
handleAddSymbol() calls onSymbolSelect callback
    ↓
New layer created with asset-symbol content
```

### 3. Background Shape Flow

```
User selects shape from BG_SHAPES (ConfigForm.tsx:31)
    ↓
onChange updates config.backgroundShape
    ↓
buildIconSpec() creates background layer
    ↓
buildBackgroundLayer() generates shape-specific SVG
```

## Key Functions

### Symbol Layer Creation in [`buildIconSpec()`](../src/icon-generator/iconSpecBuilder.ts:94-110)

```typescript
// Main symbol layer (if set)
if (config.mainSymbol && config.mainSymbol !== "none") {
  const symbolPath = SYMBOL_PATHS[config.mainSymbol];
  const symbolScale = size / 128;
  const layer: Layer = {
    id: nextId(),
    type: config.mainSymbol as LayerType,
    d: symbolPath,
    fill: primary,
    stroke: accent,
    strokeWidth: sw,
    opacity: 1,
    transform: symbolScale !== 1 ? `scale(${symbolScale})` : undefined,
  };
  layers.push(layer);
  coreLayerIds.add(layer.id);
}
```

### Symbol Search in [`SymbolPicker.tsx`](../src/icon-generator/SymbolPicker.tsx:41-47)

```typescript
useEffect(() => {
  // Debounce search query
  const timer = setTimeout(() => {
    setQuery(query);
  }, 300);
  return () => clearTimeout(timer);
}, [query, setQuery]);
```

### Symbol Addition Handler in [`SymbolPicker.tsx`](../src/icon-generator/SymbolPicker.tsx:53-66)

```typescript
const handleAddSymbol = () => {
  if (!selectedIcon) return;
  onSymbolSelect({
    assetId: selectedIcon.id,
    assetPath: selectedIcon.assetPath,
    sourceHash: selectedIcon.id,
    color: fillColor,
    opacity,
    blendMode,
    outlineWidth,
    outlineColor,
    outlinePosition,
  });
};
```

## Symbol Paths

Built-in symbols are defined in [`symbolPaths.ts`](../src/icon-generator/symbolPaths.ts):

```typescript
export const SYMBOL_PATHS: Record<string, string> = {
  eye: "M64 32c-20 0-38 12-48 32c10 20 28 32 48 32c20 0 38-12 48-32c-10-20-28-32-48-32z...",
  hammer: "M58 20h12v60h-12v-60zM52 80h24v16h-24v-16z...",
  shield: "M64 16l40 16v32c0 24-16 40-40 48c-24-8-40-24-40-48v-32l40-16z...",
  // ... more symbols
};
```

## State Management

### Symbol in IconConfig

```typescript
export type IconConfig = {
  mainSymbol?: MainSymbolType;
  backgroundShape?: BackgroundShape;
  // ...
};
```

### Symbol Layer in IconSpec

```typescript
export type IconSpec = {
  layers: Layer[];
  // ...
};

// Symbol stored as a Layer
{
  id: string;
  type: LayerType;  // The symbol type
  d: string;        // SVG path data
  fill: string;
  stroke: string;
  strokeWidth: number;
  // ...
}
```

## Related Files

| File | Purpose |
|------|---------|
| [`SymbolPicker.tsx`](../src/icon-generator/SymbolPicker.tsx) | Symbol search and selection UI |
| [`symbolPaths.ts`](../src/icon-generator/symbolPaths.ts) | Built-in symbol SVG paths |
| [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx) | Background shape selector |
| [`iconSpecBuilder.ts`](../src/icon-generator/iconSpecBuilder.ts) | Symbol layer creation |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
