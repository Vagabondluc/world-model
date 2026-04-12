# Export

**Onboarding Panel Target:** `[data-onboard="export-actions"]`

## Overview
Export functionality allows users to save generated icons in multiple formats. SVG export produces a vector image that can be scaled for any resolution, JSON export serializes the complete IconSpec for including all configuration data for sharing and and reproduction.

## UI Component

- **Component:** [`IconGenerator.tsx`](../src/icon-generator/IconGenerator.tsx)
- **Location:** Header or toolbar
- **Buttons:**
  - Export SVG
  - Export PNG
  - Export JSON

## Data Structures

### Export Payload

```typescript
// From types.ts
export type ExportPayload = {
  schemaVersion: "1.0.0";
  generatorVersion: string;
  faction: {
    id: string;
    name: string;
    domain?: FactionDomain;
  };
  state: {
    seed: string;
    seedRevision: number;
    seedHistory: SeedHistoryEntry[];
    symmetry: SymmetryConfig;
    ownerByChannel: OwnerByChannel;
    colorPresetKey: ColorPresetKey | null;
    layersSidebar?: LayersStateExport;
    iconDiscovery?: {
      query: string;
      selectedAssetId: string | null;
      recolor: {
        targetColor: string;
        brightness: number;
        saturation: number;
        opacity: number;
        scope: "black-only" | "grayscale";
      };
    };
  };
  selection: {
    variantIndex: number;
    style?: string;
  };
  composition: CompositionConfig | null;
  artifacts: {
    svg: string;
    png: null;
  };
};
```

### Asset Record

```typescript
// From types.ts
export type AssetRecord = {
  key: string;
  factionId: string;
  seed: string;
  seedRevision: number;
  seedHistory: SeedHistoryEntry[];
  variantIndex: number;
  compositionRevisionId: string;
  payload: ExportPayload;
};
```

## Code Execution Path

### 1. SVG Export Flow

```
User clicks "Export SVG"
    ↓
toSVGString(spec) called
    ↓
SVG string created with proper attributes
    ↓
downloadSVG() triggered with file download
```

### 2. PNG Export Flow

```
User clicks "Export PNG"
    ↓
downloadPNG() called
    ↓
Canvas element created from SVG
    ↓
canvas.toBlob() creates image blob
    ↓
download triggered with file download
```

### 3. JSON Export Flow
```
User clicks "Export JSON"
    ↓
downloadExportPayloadJSON() called
    ↓
ExportPayload object serialized
    ↓
JSON file downloaded
```

## Key Functions

### [`toSVGString()`](../src/icon-generator/exportUtils.ts:5)

Converts IconSpec to SVG string.

```typescript
export function toSVGString(spec: IconSpec): string {
  const svgNs = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNs, "svg");
  svg.setAttribute("viewBox", spec.viewBox);
  svg.setAttribute("width", String(spec.width));
  svg.setAttribute("height", String(spec.height));
  svg.setAttribute("xmlns", svgNs);

  // Add title/desc if present
  if (spec.title) { /* ... */ }
  if (spec.desc) { /* ... */ }

  // Add filters if needed
  if (spec.filters?.length || needsBlendFallback) {
    const defs = document.createElementNS(svgNs, "defs");
    // ... add filter definitions
    svg.appendChild(defs);
  }

  // Add layers
  for (const layer of spec.layers) {
    const el = layerToElement(svgNs, layer);
    if (el) svg.appendChild(el);
  }

  return new XMLSerializer().serializeToString(svg);
}
```

### [`downloadSVG()`](../src/icon-generator/exportUtils.ts)

```typescript
export function downloadSVG(spec: IconSpec, filename?: string): void {
  const svgString = toSVGString(spec);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `icon-${spec.id}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### [`downloadPNG()`](../src/icon-generator/exportUtils.ts)

```typescript
export async function downloadPNG(
  spec: IconSpec,
  filename?: string,
  scale: number = 1
): Promise<void> {
  const svgString = toSVGString(spec);
  const img = new Image();
  img.src = "data:image/svg+xml;base64," + btoa(svgString);
  
  await new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = spec.width * scale;
      canvas.height = spec.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob!);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || `icon-${spec.id}.png`;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      });
    };
  });
}
```

### [`downloadExportPayloadJSON()`](../src/icon-generator/exportUtils.ts)

```typescript
export function downloadExportPayloadJSON(
  payload: ExportPayload,
  filename?: string
): void {
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `icon-${payload.faction.id}-export.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

## Export Formats

| Format | Use Case | File Extension |
|--------|---------|-----------------|
| SVG | Web, vector graphics | `.svg` |
| PNG | Raster images, social media | `.png` |
| JSON | Archiving, sharing, reproduction | `.json` |

## State Management

### Export State

```typescript
// In IconGenerator component
const [spec, setSpec] = useState<IconSpec | null>(null);

// Export payload built from current state
const exportPayload: ExportPayload = {
  schemaVersion: "1.0.0",
  generatorVersion: "1.0.0",
  faction: { id, name, domain },
  state: { seed, symmetry, colors, layers, ... },
  selection: { variantIndex },
  composition: compositionConfig,
  artifacts: { svg, png },
};
```

## Related Files

| File | Purpose |
|------|---------|
| [`exportUtils.ts`](../src/icon-generator/exportUtils.ts) | Export functions |
| [`IconGenerator.tsx`](../src/icon-generator/IconGenerator.tsx) | Export UI |
| [`types.ts`](../src/icon-generator/types.ts) | ExportPayload type |
| [`SVGRuntimeRenderer.tsx`](../src/icon-generator/SVGRuntimeRenderer.tsx) | SVG rendering |
