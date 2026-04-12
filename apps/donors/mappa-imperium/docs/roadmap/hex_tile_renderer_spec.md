# HexTile Component Specification

## Purpose

The [`HexTile`](../../src/components/map/HexTile.tsx:43) component renders a single hexagonal tile on the map. It supports two rendering modes (SVG polygon and tile-based spritesheet) and handles biome-specific visual representation through color mapping or tile selection from sprite sheets.

## Dependencies

### External Dependencies
- React (for component rendering)

### Internal Dependencies
- [`@/types`](../../src/types.ts:1) - [`HexCoordinate`](../../src/types.ts:33), [`BiomeType`](../../src/types.ts:39), [`TileTheme`](../../src/types.ts:48)
- [`@/data/biomeData`](../../src/data/biomeData.ts:1) - [`BIOME_CONFIG`](../../src/data/biomeData.ts:11) for biome colors
- [`@/services/generators/hexUtils`](../../src/services/generators/hexUtils.ts:1) - [`hexToPixel()`](../../src/services/generators/hexUtils.ts:6) for coordinate conversion

### Child Components
- None (leaf component)

## Props Interface

```typescript
interface HexTileProps {
    hex: HexCoordinate;           // Axial coordinates (q, r, s) of the tile
    biome: BiomeType;             // Type of biome for the tile
    mode: 'svg' | 'tile';         // Rendering mode
    theme?: TileTheme;            // Visual theme (default: 'classic')
    size: number;                 // Hex radius in pixels
    owner?: number;               // Optional player color overlay
}
```

## State Requirements

### Local State
- None (pure functional component)

### Store Dependencies
- None (props-driven)

## Rendering Logic

### SVG Mode

1. Calculate pixel position using [`hexToPixel()`](../../src/services/generators/hexUtils.ts:6)
2. Generate hexagon points using pointy-topped hex formula:
   - Angle calculation: `(Math.PI / 180) * (60 * i + 30)`
   - Point formula: `x + size * Math.cos(angle), y + size * Math.sin(angle)`
3. Render `<polygon>` element with:
   - Fill: [`BIOME_CONFIG[biome].color`](../../src/data/biomeData.ts:14) (fallback: `#ccc`)
   - Stroke: `#000` with `strokeWidth="0.5"`
   - Opacity: `1`

### Tile Mode

1. Calculate pixel position using [`hexToPixel()`](../../src/services/generators/hexUtils.ts:6)
2. Determine tile position from [`BIOME_TILE_MAP`](../../src/components/map/HexTile.tsx:16):
   - Maps each biome to row/column in 3x4 sprite sheet
   - Sheet dimensions: 384x576 pixels (3 cols × 128px, 4 rows × 144px)
3. Calculate scale factor:
   - Formula: `(size * Math.sqrt(3) * 1.1) / tileWidth`
   - Accounts for pointy-topped hex geometry
4. Create clip path for hex shape:
   - Path: `M 0,-72 L 62,-36 L 62,36 L 0,72 L -62,36 L -62,-36 Z`
   - Unique ID per hex: `hex-clip-${hex.q}-${hex.r}`
5. Render `<image>` element with:
   - Source: [`THEME_PATHS[theme]`](../../src/components/map/HexTile.tsx:36)
   - Transformed position to show correct tile from sprite sheet
   - Clipped to hex shape

### Theme Path Mapping

| Theme | Asset Path |
|-------|------------|
| classic | `/assets/tilesets/classic/fantasyhextiles_v3.png` |
| vibrant | `/assets/tilesets/vibrant/Terrain 1 - Thick - No Outline - 128x144.png` |
| pastel | `/assets/tilesets/pastel/Terrain 1 - Flat - No Outline - 128x144.png` |
| sketchy | `/assets/tilesets/sketchy/fantasyhextiles_v3.png` |

### Biome to Tile Mapping

| Biome | Row | Col |
|-------|-----|-----|
| grassland | 0 | 0 |
| forest | 0 | 1 |
| mountain | 0 | 2 |
| desert | 1 | 0 |
| swamp | 1 | 1 |
| ocean/lake/coastal/underwater | 1 | 2 |
| arctic | 2 | 0 |
| hill | 2 | 1 |
| jungle | 2 | 2 |
| volcanic/underdark | 3 | 0 |
| wasteland/planar | 3 | 1 |
| urban | 3 | 2 |

## Event Handling

### User Interactions
- None (display-only component)

### Callbacks
- None (no event handlers)

## Error Handling

### Invalid Biome Types

When an invalid biome type is received:

1. **Validation Check**: Component should validate that `biome` prop is a valid [`BiomeType`](../../src/types.ts:39)
2. **Fallback Behavior**:
   - If biome is not found in [`BIOME_CONFIG`](../../src/data/biomeData.ts:11), use fallback color `#ccc`
   - Log warning to console: `Unknown biome type: ${biome}, using fallback`
3. **Error Boundary**: Consider wrapping in error boundary to catch rendering errors

### Invalid Terrain Types

For terrain variants or sub-types:

1. **Type Checking**: Verify terrain type exists in mapping tables
2. **Graceful Degradation**: Fall back to base biome type if variant not found
3. **User Feedback**: Display subtle visual indicator (e.g., question mark icon) when using fallback

### Asset Loading Errors

For tile mode sprite sheets:

1. **Image Error Handling**: Add `onError` handler to `<image>` element
2. **Fallback to SVG**: If sprite sheet fails to load, automatically switch to SVG mode
3. **Retry Mechanism**: Implement retry logic with exponential backoff
4. **User Notification**: Show toast notification when asset loading fails

### Error State Display

```typescript
interface HexTileErrorState {
    type: 'invalid-biome' | 'invalid-terrain' | 'asset-load-failed';
    message: string;
    fallbackMode?: 'svg' | 'placeholder';
}
```

## Accessibility

### ARIA Labels
- None required (purely visual component)

### Keyboard Navigation
- Not applicable (no interactive elements)

### Colorblind Accessibility

#### Colorblind-Friendly Design Principles

1. **Dual Coding**: Use both color AND pattern/texture for biome differentiation
2. **High Contrast**: Ensure adjacent biomes have sufficient contrast ratio (WCAG AA: 4.5:1)
3. **Avoid Problematic Colors**: Minimize reliance on red/green distinctions (protanopia/deuteranopia)

#### Colorblind Mode Support

When colorblind mode is enabled:

| Biome | Standard Color | Pattern/Texture | Alternative Palette |
|-------|---------------|----------------|-------------------|
| grassland | `#4CAF50` | None | `#2E7D32` |
| forest | `#2E7D32` | Tree pattern | `#1B5E20` |
| mountain | `#795548` | Rock texture | `#4E342E` |
| desert | `#F4A460` | Sand pattern | `#D2691E` |
| swamp | `#556B2F` | Mud texture | `#3D5221` |
| ocean/lake/coastal/underwater | `#1E88E5` | Wave pattern | `#0D47A1` |
| arctic | `#E0F7FA` | Snowflake pattern | `#B2EBF2` |
| hill | `#A1887F` | Hill contour | `#8D6E63` |
| jungle | `#1B5E20` | Leaf pattern | `#004D40` |
| volcanic/underdark | `#424242` | Magma pattern | `#212121` |
| wasteland/planar | `#9E9E9E` | Cracked pattern | `#616161` |
| urban | `#607D8B` | Building pattern | `#455A64` |

#### Pattern Implementation

For SVG mode, use SVG patterns:
```typescript
const PATTERNS = {
    forest: <pattern id="forest-pattern">...</pattern>,
    water: <pattern id="water-pattern">...</pattern>,
    // etc.
};
```

For tile mode, ensure sprite sheets include patterned variants.

#### ARIA Live Regions

When colorblind mode is toggled:
- Announce mode change to screen readers
- Example: `aria-live="polite"` message: "Colorblind mode enabled"

## Performance

### Optimization Strategies

1. **Memoization**: Consider wrapping in `React.memo()` to prevent re-renders when props unchanged
2. **Clip Path Reuse**: Unique clip paths per hex could be optimized by sharing when possible
3. **Image Loading**: Consider preloading sprite sheet images
4. **Coordinate Calculation**: [`hexToPixel()`](../../src/services/generators/hexUtils.ts:6) is called on every render - could be memoized at parent level

### Performance Benchmarks

#### Rendering Targets

| Map Size | Tile Count | Target FPS | Mode |
|----------|------------|------------|------|
| Small | 50-100 | 60 | SVG, Tile |
| Standard | 200-300 | 60 | SVG, 45+ Tile |
| Large | 500-800 | 45+ SVG, 30+ Tile |
| Massive | 1000+ | 30+ SVG, 15+ Tile |

#### Performance Metrics

1. **Initial Render Time**: < 500ms for 500 tiles (SVG mode)
2. **Re-render Time**: < 100ms for 500 tiles when only biome changes
3. **Memory Usage**: < 50MB for 1000 tiles (SVG mode)
4. **Sprite Sheet Load**: < 200ms for 384x576px image

#### Optimization Techniques for Large Maps

1. **Virtual Scrolling**: Only render tiles visible in viewport
2. **Canvas Rendering**: For 500+ tiles in tile mode, consider Canvas API
3. **WebGL**: For 1000+ tiles, WebGL rendering provides best performance
4. **LOD (Level of Detail)**: Use simpler rendering for distant tiles
5. **Tile Pooling**: Reuse DOM elements for tiles that scroll out of view

### Rendering Considerations

- SVG mode is lighter for large maps (no image assets)
- Tile mode provides richer visuals but requires sprite sheet loading
- Clip paths create additional DOM elements - consider SVG patterns for alternative approach

## Future Enhancements

1. **Owner Overlay**: Implement `owner` prop to show player territory
2. **Selection State**: Add selected/hover states for interactive maps
3. **Layer Composition**: Support for multiple overlay layers (resources, units, etc.)
4. **Animation**: Add transition effects for biome changes or selection
5. **Custom Outlines**: Support for different outline styles (thick, thin, texture, color)

## Related Documents

- [INDEX.md](./INDEX.md:1) - Documentation index and cross-reference matrix
- [unified_map_renderer_spec.md](./unified_map_renderer_spec.md:1) - Parent map renderer that uses HexTile
- [hex_utils_tdd_spec.md](./hex_utils_tdd_spec.md:1) - Test-driven documentation for hex utility functions
- [component_tdd_spec.md](./component_tdd_spec.md:1) - Test-driven documentation for component patterns
