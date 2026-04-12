# Variant Grid

**Onboarding Panel Target:** `[data-onboard="variant-grid"]`

## Overview

The variant grid displays multiple generated icons using the same configuration but different seeds. This allows users to quickly browse alternative designs and select the one that best fits their needs. Variants are generated on-demand and cached for performance.

## UI Component

- **Component:** [`IconGenerator.tsx`](../src/icon-generator/IconGenerator.tsx)
- **Location:** Center panel, below main preview
- **Layout:** Grid of thumbnail previews
- **Interaction:** Click to select as main preview

## Data Structures

### Variant Generation

```typescript
// From IconGenerator.tsx
function buildVariantSpecs(config: IconConfig, count: number, rootSeed: string): IconSpec[] {
  return Array.from({ length: count }, (_, i) =>
    buildIconSpec({ ...config, seed: `${rootSeed}-v${i + 1}` })
  );
}
```

### Variant State

```typescript
// Variant state in IconGenerator
const [variants, setVariants] = useState<IconSpec[]>([]);
const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
```

## Code Execution Path

### 1. Variant Generation Flow

```
User clicks Generate
    ↓
Main spec generated with seed
    ↓
buildVariantSpecs() creates N variants
    ↓
Each variant uses seed: `${rootSeed}-v${i+1}`
    ↓
Variants stored in state array
    ↓
Grid renders variant thumbnails
```

### 2. Variant Selection Flow

```
User clicks variant thumbnail
    ↓
setSelectedVariantIndex(index) triggered
    ↓
Main preview updates to show selected variant
    ↓
Export actions use selected variant
```

### 3. Variant Caching

```
Variants generated
    ↓
Stored in React state (variants array)
    ↓
Re-render uses cached specs
    ↓
Cache cleared on new generation
```

## Key Functions

### [`buildVariantSpecs()`](../src/icon-generator/IconGenerator.tsx:54)

Creates multiple icon variants from a base configuration.

```typescript
function buildVariantSpecs(config: IconConfig, count: number, rootSeed: string): IconSpec[] {
  return Array.from({ length: count }, (_, i) =>
    buildIconSpec({ ...config, seed: `${rootSeed}-v${i + 1}` })
  );
}
```

### Variant Grid Rendering

```tsx
// Typical variant grid implementation
<div className="variant-grid">
  {variants.map((variant, index) => (
    <button
      key={variant.id}
      className={index === selectedVariantIndex ? "selected" : ""}
      onClick={() => setSelectedVariantIndex(index)}
    >
      <SVGRuntimeRenderer spec={variant} className="w-full h-full" />
    </button>
  ))}
</div>
```

## Variant Seed Strategy

Variants use deterministic seed derivation:

| Variant | Seed Pattern |
|---------|-------------|
| Main | `{rootSeed}` |
| Variant 1 | `{rootSeed}-v1` |
| Variant 2 | `{rootSeed}-v2` |
| Variant 3 | `{rootSeed}-v3` |
| ... | ... |

This ensures:
1. Same root seed always produces same variants
2. Variants are reproducible
3. Each variant is unique but related

## State Management

### Variant State

```typescript
// In IconGenerator component
const [variants, setVariants] = useState<IconSpec[]>([]);
const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);

// Current spec is either main or selected variant
const currentSpec = variants[selectedVariantIndex] || mainSpec;
```

### Generation Integration

```typescript
// When generating new icons
const handleGenerate = () => {
  const newSeed = getNextSeed();
  const mainSpec = buildIconSpec({ ...config, seed: newSeed });
  const newVariants = buildVariantSpecs(config, variantCount, newSeed);
  
  setSpec(mainSpec);
  setVariants(newVariants);
  setSelectedVariantIndex(0);
};
```

## Performance Considerations

- **Lazy Generation:** Variants generated only when needed
- **Memoization:** React.memo for variant thumbnails
- **Virtualization:** For large variant counts, consider react-window
- **Debouncing:** Rapid generation debounced

## Related Files

| File | Purpose |
|------|---------|
| [`IconGenerator.tsx`](../src/icon-generator/IconGenerator.tsx) | Variant generation and grid |
| [`iconSpecBuilder.ts`](../src/icon-generator/iconSpecBuilder.ts) | Individual spec creation |
| [`SVGRuntimeRenderer.tsx`](../src/icon-generator/SVGRuntimeRenderer.tsx) | Variant thumbnail rendering |
| [`types.ts`](../src/icon-generator/types.ts) | IconSpec type |
