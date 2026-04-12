# UnifiedMapRenderer Component Specification

## Purpose

The [`UnifiedMapRenderer`](../../src/components/map/UnifiedMapRenderer.tsx:12) component renders a complete hexagonal map from biome data. It handles coordinate system conversion, viewport calculation, and renders all tiles using the [`HexTile`](./hex_tile_renderer_spec.md) component. Supports both SVG and tile-based rendering modes.

## Dependencies

### External Dependencies
- React (for component rendering)

### Internal Dependencies
- [`@/types`](../../src/types.ts:1) - [`HexCoordinate`](../../src/types.ts:33), [`BiomeType`](../../src/types.ts:39), [`MapRenderMode`](../../src/types.ts:47), [`TileTheme`](../../src/types.ts:48)
- [`@/components/map/HexTile`](../../src/components/map/HexTile.tsx:43) - Individual tile rendering

### Child Components
- [`HexTile`](./hex_tile_renderer_spec.md) - Renders individual hex tiles

## Props Interface

```typescript
interface UnifiedMapRendererProps {
    hexBiomes: Record<string, BiomeType>;  // Map of "q,r" keys to biome types
    mode: MapRenderMode;                    // 'svg' or 'tile'
    theme: TileTheme;                      // Visual theme
    size?: number;                         // Hex radius in pixels (default: 40)
}
```

## State Requirements

### Local State
- None (pure functional component)

### Store Dependencies
- None (props-driven)

## Rendering Logic

### Data Transformation

1. **Convert biome map to hex array**:
   ```typescript
   const hexes = Object.entries(hexBiomes).map(([key, biome]) => {
       const [q, r] = key.split(',').map(Number);
       return { q, r, s: -q - r, biome };
   });
   ```

2. **Calculate bounding box**:
   - Find min/max Q and R coordinates from all hexes
   - Used for viewport calculation

### Viewport Calculation

1. **Width calculation**:
   - Formula: `(maxQ - minQ + 2) * size * 1.5`
   - Includes padding for edge tiles

2. **Height calculation**:
   - Formula: `(maxR - minR + 2) * size * 1.7`
   - Accounts for hex row spacing

3. **Padding**:
   - `size * 2` pixels around the map
   - Ensures edge tiles are fully visible

4. **ViewBox attributes**:
   - X: `minQ * size * 1.5 - padding`
   - Y: `minR * size * 1.5 - padding`
   - Width: `width`
   - Height: `height`

### SVG Structure

```
<div class="overflow-container">
    <svg viewBox="..." class="map-svg">
        <g class="map-layer">
            <HexTile /> (for each hex)
        </g>
    </svg>
</div>
```

### Container Styling

- **Outer container**: `w-full h-full overflow-auto flex items-center justify-center bg-stone-900/10 rounded-xl p-4 shadow-inner`
- **SVG element**: `max-w-full max-h-screen drop-shadow-lg`
- **Filter based on mode**:
  - SVG mode: `drop-shadow(2px 4px 6px rgba(0,0,0,0.2))`
  - Tile mode: `none`

### Tile Rendering

For each hex in the map:
```typescript
<HexTile
    key={`${h.q},${h.r}`}
    hex={{ q: h.q, r: h.r, s: h.s }}
    biome={h.biome}
    mode={mode}
    theme={theme}
    size={size}
/>
```

## Event Handling

### User Interactions
- None (display-only component)

### Callbacks
- None (no event handlers)

## Accessibility

### ARIA Labels
- Consider adding `role="img"` and `aria-label` to SVG for screen readers
- Example: `aria-label="World map showing ${hexes.length} tiles"`

### Keyboard Navigation
- Not applicable (no interactive elements)

## Virtual Scrolling

### Implementation Overview

For maps exceeding 500 tiles, implement viewport-based virtual scrolling to render only visible tiles.

### Viewport Calculation

```typescript
interface ViewportState {
    offsetX: number;      // Pan offset in pixels
    offsetY: number;      // Pan offset in pixels
    scale: number;        // Zoom level (1.0 = 100%)
    centerX: number;      // Viewport center X
    centerY: number;      // Viewport center Y
}
```

### Visible Tile Detection

1. **Calculate viewport bounds** in hex coordinate space:
   ```typescript
   const visibleBounds = {
       minQ: Math.floor(pixelToHex(viewportX, viewportY).q),
       maxQ: Math.ceil(pixelToHex(viewportX + viewportWidth, viewportY + viewportHeight).q),
       minR: Math.floor(pixelToHex(viewportX, viewportY).r),
       maxR: Math.ceil(pixelToHex(viewportX + viewportWidth, viewportY + viewportHeight).r)
   };
   ```

2. **Filter hexes** to only those within bounds:
   ```typescript
   const visibleHexes = hexes.filter(h =>
       h.q >= visibleBounds.minQ && h.q <= visibleBounds.maxQ &&
       h.r >= visibleBounds.minR && h.r <= visibleBounds.maxR
   );
   ```

3. **Buffer zone**: Add 1-2 hex padding around viewport for smooth scrolling

### Performance Benefits

| Map Size | Tiles Rendered (All) | Tiles Rendered (Virtual) | Reduction |
|----------|---------------------|-------------------------|-----------|
| 500 | 500 | ~150 | 70% |
| 1000 | 1000 | ~200 | 80% |
| 2000 | 2000 | ~250 | 87.5% |

### Virtual Scrolling Props

```typescript
interface VirtualScrollingProps {
    enableVirtualization: boolean;  // Enable/disable based on tile count
    bufferSize: number;             // Buffer tiles around viewport (default: 2)
    onViewportChange?: (bounds: ViewportBounds) => void;
}
```

## Zoom and Pan Gestures

### Pan Interaction

#### Mouse/Trackpad Pan

```typescript
interface PanState {
    isPanning: boolean;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
}
```

**Events:**
- `onMouseDown`: Start pan, record initial position
- `onMouseMove`: Update offset if panning
- `onMouseUp`: End pan
- `onMouseLeave`: End pan if active

**Cursor States:**
- Default: `grab`
- Panning: `grabbing`

#### Touch Pan (Mobile)

**Events:**
- `onTouchStart`: Record initial touch position
- `onTouchMove`: Calculate delta, update offset
- `onTouchEnd`: End pan

**Multi-touch Support:**
- Single finger: Pan
- Two fingers: Zoom (pinch gesture)

### Zoom Interaction

#### Mouse Wheel Zoom

```typescript
interface ZoomState {
    scale: number;           // Current zoom level
    minScale: number;        // Minimum zoom (default: 0.25)
    maxScale: number;        // Maximum zoom (default: 4.0)
    zoomCenter: { x: number; y: number };  // Zoom focus point
}
```

**Zoom Behavior:**
- Wheel up: Zoom in (multiply scale by 1.1)
- Wheel down: Zoom out (divide scale by 1.1)
- Zoom toward mouse pointer position
- Clamp to min/max scale limits

#### Pinch Zoom (Mobile)

**Implementation:**
```typescript
const handlePinchZoom = (touches: Touch[]) => {
    const distance = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
    );
    const newScale = (distance / initialDistance) * initialScale;
    // Clamp and apply
};
```

### Zoom/Pan Props

```typescript
interface ZoomPanProps {
    enableZoom: boolean;           // Enable zoom (default: true)
    enablePan: boolean;            // Enable pan (default: true)
    minZoom: number;               // Minimum zoom level (default: 0.25)
    maxZoom: number;               // Maximum zoom level (default: 4.0)
    zoomStep: number;              // Zoom increment (default: 0.1)
    onZoomChange?: (scale: number) => void;
    onPanChange?: (offset: { x: number; y: number }) => void;
    resetZoom?: () => void;        // Reset to default view
}
```

### Gesture Debouncing

- **Pan updates**: Use `requestAnimationFrame` for smooth rendering
- **Zoom updates**: Debounce to 16ms (60fps target)
- **Combined gestures**: Prioritize zoom over pan when both detected

## Z-Index Layering

### Layer Hierarchy

For multi-layer map rendering, define clear z-index stacking order:

| Layer | Z-Index | Purpose | Content |
|-------|---------|---------|---------|
| Background | 0 | Base terrain | Water, base land |
| Terrain | 10 | Primary terrain | Grassland, forest, desert |
| Features | 20 | Terrain features | Mountains, hills, rivers |
| Resources | 30 | Resource markers | Mines, farms, resources |
| Units | 40 | Game units | Player units, NPCs |
| Markers | 50 | UI markers | Selection, highlights |
| Overlays | 60 | Temporary overlays | Tooltips, popups |
| UI Layer | 100 | UI controls | Buttons, labels |

### Layer Composition API

```typescript
interface MapLayer {
    id: string;
    name: string;
    zIndex: number;
    visible: boolean;
    opacity: number;
    renderOrder: number;
}

interface LayerComposition {
    layers: MapLayer[];
    activeLayers: string[];
}
```

### Layer Visibility Toggle

```typescript
interface LayerToggleProps {
    layers: MapLayer[];
    onToggleLayer: (layerId: string, visible: boolean) => void;
    onSetLayerOpacity: (layerId: string, opacity: number) => void;
}
```

### Z-Index Consistency

Ensure consistent z-index values across components:
- Map tiles: 0-60 (as defined above)
- UI elements: 100+ (buttons, modals)
- Overlays: 200+ (tooltips, context menus)
- Modals: 300+ (dialogs, settings)

### Layer Rendering Order

```typescript
const sortedLayers = layers
    .filter(l => l.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

return sortedLayers.map(layer => (
    <g key={layer.id} style={{ zIndex: layer.zIndex, opacity: layer.opacity }}>
        {/* Layer content */}
    </g>
));
```

## Performance

### Optimization Strategies

1. **Virtualization**: For large maps, implement viewport-based rendering to only render visible tiles
2. **Memoization**: Wrap component in `React.memo()` to prevent re-renders when props unchanged
3. **HexTile memoization**: Ensure [`HexTile`](./hex_tile_renderer_spec.md) is memoized to prevent unnecessary re-renders
4. **Debounced viewport updates**: If implementing zoom/pan, debounce viewport calculations
5. **Layer caching**: Cache rendered layers when not changing
6. **Viewport intersection**: Use IntersectionObserver for viewport detection

### Rendering Considerations

- **SVG mode**: More performant for large maps (simple polygons)
- **Tile mode**: Heavier due to image clipping and transforms
- **Map size impact**: Linear performance impact based on number of tiles
- **Viewport optimization**: Current implementation renders all tiles regardless of visibility
- **Virtual scrolling**: Reduces rendered tiles by 70-87% for large maps
- **Layer composition**: Additional DOM elements for each active layer

### Coordinate System

Uses axial coordinates (q, r) with implicit s coordinate:
- Pointy-topped hexes
- Horizontal rows
- [`hexToPixel()`](../../src/services/generators/hexUtils.ts:6) conversion for rendering
- Key format: `"q,r"` string in hexBiomes map

### Layer Support

Currently supports single layer through `map-layer` class. Future enhancements:
- Background layer (terrain)
- Middle layer (features, resources)
- Top layer (units, markers, selection)

## Future Enhancements

1. **Viewport Management**:
   - Pan/zoom controls
   - Minimap
   - Coordinate display on hover

2. **Layer Composition**:
   - Multiple render layers for different map elements
   - Layer visibility toggles
   - Z-index management

3. **Interaction Support**:
   - Tile selection
   - Hover effects
   - Click handlers for tile interaction

4. **Performance Improvements**:
   - Virtual scrolling for large maps
   - WebGL rendering for tile mode
   - Sprite atlas optimization

5. **Animation Support**:
   - Smooth transitions for map changes
   - Animated tile reveals
   - Path visualization

6. **Accessibility Enhancements**:
    - Keyboard navigation between tiles
    - Screen reader support for tile information
    - High contrast mode support

## Related Documents

- [INDEX.md](./INDEX.md:1) - Documentation index and cross-reference matrix
- [hex_tile_renderer_spec.md](./hex_tile_renderer_spec.md:1) - Child component for rendering individual hex tiles
- [hex_utils_tdd_spec.md](./hex_utils_tdd_spec.md:1) - Test-driven documentation for hex utility functions
- [app_layout_spec.md](./app_layout_spec.md:1) - Parent layout component that uses UnifiedMapRenderer
- [map_generation_tdd_spec.md](./map_generation_tdd_spec.md:1) - Test-driven documentation for map generation
- [world_creation_wizard_spec.md](./world_creation_wizard_spec.md:1) - World creation wizard that uses UnifiedMapRenderer
- [wireframes/main_map_interface_wireframe.md](./wireframes/main_map_interface_wireframe.md:1) - Wireframe mockup for main map interface
