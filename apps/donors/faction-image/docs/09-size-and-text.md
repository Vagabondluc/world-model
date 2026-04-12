# Size and Text

**Onboarding Panel Target:** `[data-onboard="size-text"]`

## Overview

The size and text controls configure the output dimensions of the generated icon and optional text overlay. Size determines the pixel dimensions of the exported image, while the text feature allows adding a single character or short text overlay to the icon.

## UI Component

- **Component:** [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx)
- **Location:** Left sidebar, Style section
- **Controls:**
  - Output size selector (128, 256, 512, 1024)
  - Include text toggle
  - Text character input

## Data Structures

### Size Configuration

```typescript
// From types.ts - IconConfig
export type IconConfig = {
  size?: number;        // Output dimensions in pixels
  includeText?: boolean; // Whether to add text layer
  textChar?: string;     // Character(s) to display
  // ...
};
```

### IconSpec Dimensions

```typescript
// From types.ts
export type IconSpec = {
  id: string;
  viewBox: string;    // SVG viewBox (typically "0 0 128 128")
  width: number;     // Pixel width
  height: number;    // Pixel height
  layers: Layer[];
  // ...
};
```

### Text Layer

```typescript
// From types.ts
export type Layer = {
  type: "text" | ...;
  text?: string;       // Text content
  fontSize?: number;   // Font size in pixels
  cx?: number;         // Center X
  cy?: number;         // Center Y
  // ...
};
```

## Code Execution Path

### 1. Size Configuration Flow

```
User selects size from dropdown
    ↓
onChange updates config.size
    ↓
buildIconSpec() uses size for:
  - width/height properties
  - viewBox calculation
  - Layer scaling
    ↓
SVGRuntimeRenderer renders at specified size
```

### 2. Text Overlay Flow

```
User enables "Include text" toggle
    ↓
config.includeText = true
    ↓
User enters text character
    ↓
config.textChar = value
    ↓
buildIconSpec() creates text layer:
  - type: "text"
  - text: config.textChar
  - fontSize: size * 0.3
  - cx, cy: center point
    ↓
Text layer added to layers array
```

## Key Functions

### Size Application in [`buildIconSpec()`](../src/icon-generator/iconSpecBuilder.ts:46-51)

```typescript
export function buildIconSpec(config: IconConfig): IconSpec {
  const seed = config.seed || Math.random().toString(36).slice(2);
  const rng = createRNG(seed);
  const size = config.size || 128;
  const cx = size / 2;
  const cy = size / 2;
  // ...
}
```

### ViewBox Construction

```typescript
// IconSpec viewBox is typically fixed at 128x128
// Scaling handled by width/height attributes
{
  viewBox: "0 0 128 128",
  width: size,   // User-specified size
  height: size,  // User-specified size
}
```

### Text Layer Creation

```typescript
// In buildIconSpec() - text layer generation
if (config.includeText && config.textChar) {
  layers.push({
    id: nextId(),
    type: "text",
    text: config.textChar,
    cx: cx,
    cy: cy,
    fontSize: size * 0.3,
    fill: accent,
    // ...
  });
}
```

## SVG Rendering

### [`SVGRuntimeRenderer.tsx`](../src/icon-generator/SVGRuntimeRenderer.tsx:12-18)

```tsx
<svg
  viewBox={spec.viewBox}
  width={spec.width}
  height={spec.height}
  className={className}
  xmlns="http://www.w3.org/2000/svg"
  aria-labelledby={`${spec.id}-title`}
>
```

### Text Layer Rendering in [`SVGRuntimeRenderer.tsx`](../src/icon-generator/SVGRuntimeRenderer.tsx:133-143)

```tsx
case "text": {
  el = document.createElementNS(ns, "text");
  el.setAttribute("x", String(layer.cx ?? 64));
  el.setAttribute("y", String(layer.cy ?? 64));
  el.setAttribute("text-anchor", "middle");
  el.setAttribute("dominant-baseline", "central");
  el.setAttribute("font-size", String(layer.fontSize ?? 24));
  el.setAttribute("font-family", "serif");
  el.textContent = layer.text || "";
  break;
}
```

## Size Options

| Size | Use Case | Export Quality |
|------|----------|----------------|
| 128px | Preview, thumbnails | Low resolution |
| 256px | Web icons, small UI | Medium resolution |
| 512px | Standard export | High resolution |
| 1024px | Print, large display | Maximum resolution |

## ViewBox vs. Output Size

The system uses a fixed 128x128 coordinate system internally:

- **viewBox:** Always "0 0 128 128" (internal coordinate system)
- **width/height:** User-specified output size
- **Scaling:** SVG scales content from 128px to target size

This approach ensures:
1. Consistent layer positioning regardless of output size
2. Sharp rendering at any resolution
3. Simplified geometry calculations

## State Management

### Size in IconConfig

```typescript
export type IconConfig = {
  size?: number;
  includeText?: boolean;
  textChar?: string;
  // ...
};
```

### Default Values

```typescript
const size = config.size || 128;
const includeText = config.includeText ?? false;
const textChar = config.textChar || "";
```

## Related Files

| File | Purpose |
|------|---------|
| [`ConfigForm.tsx`](../src/icon-generator/ConfigForm.tsx) | Size and text UI controls |
| [`iconSpecBuilder.ts`](../src/icon-generator/iconSpecBuilder.ts) | Size application, text layer creation |
| [`SVGRuntimeRenderer.tsx`](../src/icon-generator/SVGRuntimeRenderer.tsx) | SVG dimension rendering |
| [`exportUtils.ts`](../src/icon-generator/exportUtils.ts) | Export size handling |
| [`types.ts`](../src/icon-generator/types.ts) | Type definitions |
