
# SPEC: Multi-Plane Layer Architecture (DEC-022)

## 1. Overview
This specification defines the architecture for a **Layer Editor** that transforms the application from a single-map generator into a **Multi-Plane World Builder**.

Instead of a single grid with one biome set, the system will support multiple **Parallel Layers** (e.g., Surface, Underdark, Feywild, Shadowfell) that share the same geometric hex grid but possess distinct:
*   Biome Assignments
*   Region Definitions
*   Visual Themes (Color Palettes & Pattern Sets)
*   Points of Interest

## 2. Goals
*   **Parallelism:** Allow users to toggle between "planes" of existence without losing their spatial context.
*   **Thematic Identity:** Each layer should visually feel unique (e.g., Neon/Dreamlike for Feywild, Greyscale/Ash for Shadowfell) via specialized SVG/Canvas patterns.
*   **Non-Destructive Editing:** Changes to the "Shadowfell" layer do not overwrite the "Material Plane" layer.
*   **Inheritance (Future):** Establish a data structure that allows layers to optionally "inherit" geography (e.g., a mountain on the Surface creates a mountain root in the Underdark).

## 3. Data Architecture

### 3.1. The Map Layer Schema
We will migrate from a flat `hexBiomes` object in `LocationStore` to a `layers` registry.

```typescript
export type LayerType = 'surface' | 'underdark' | 'feywild' | 'shadowfell' | 'elemental' | 'custom';

export interface LayerTheme {
    mode: LayerType;
    biomePalette: 'standard' | 'subterranean' | 'psychedelic' | 'necrotic';
    backgroundColor: string;
    patternSet: string; // ID of the pattern generator set
}

export interface MapLayer {
    id: string;
    name: string;
    type: LayerType;
    visible: boolean;
    opacity: number; // 0.0 to 1.0
    
    // The Data Content
    data: {
        hexBiomes: Record<string, BiomeType>; // { "q,r": "forest" }
        regions: string[]; // IDs of regions belonging to this layer
        locations: string[]; // IDs of locations belonging to this layer
    };
    
    theme: LayerTheme;
}
```

### 3.2. Store Updates (`LocationStore`)
The `LocationDataSlice` will be updated to hold:
*   `layers`: `Record<string, MapLayer>`
*   `activeLayerId`: `string`
*   `layerOrder`: `string[]` (for rendering stack)

**Migration Strategy:**
Existing `hexBiomes`, `regions`, and `locations` in the store will be migrated into a default "Surface" layer (ID: 'layer-surface-default') upon first load of V2.

## 4. Visual Architecture (Thematic Rendering)

The `HexGridRenderer` will be updated to support **Theme Injection**. Instead of hardcoded colors/patterns, it will request patterns from a `BiomePatternRegistry` based on the *Active Layer's Theme*.

### 4.1. Biome Sets
We will define specific visual mappings for biomes based on the layer type.

| Biome Key | Surface (Standard) | Feywild (Psychedelic) | Shadowfell (Necrotic) | Underdark (Subterranean) |
| :--- | :--- | :--- | :--- | :--- |
| **Forest** | Green/Tree Pattern | Neon Pink/Spiral Trees | Grey/Deadwood Spikes | Giant Mushrooms |
| **Mountain** | Grey/Peaks | Crystalline/Floating Rocks | Black/Obsidian Crags | Stalagmites |
| **Water** | Blue/Waves | Iridescent/Starry | Ink Black/Still | Sludge/Magma |
| **Grassland** | Green/Tufts | Gold/Flowering Fields | Ash/Dust Dunes | Rock Floor |

### 4.2. Rendering Pipeline
1.  **Clear Canvas** with `activeLayer.theme.backgroundColor`.
2.  **Iterate Layers** (from bottom to top order).
    *   If `layer.visible` is false, skip.
    *   Set `ctx.globalAlpha` to `layer.opacity`.
    *   **Draw Biomes:** For each hex, lookup `biome` -> `getThemedPattern(biome, layer.theme)`.
    *   **Draw Regions:** Draw borders specific to this layer.
    *   **Draw Locations:** Draw icons specific to this layer.
3.  **Draw Grid Overlay** (Shared geometry).

## 5. UI/UX: Layer Manager

A new panel in the `LocationSidebar` (or a floating drawer) will manage layers.

### 5.1. Controls
*   **Layer List:** Drag-and-drop list to reorder.
*   **Active Toggle:** Click to edit this layer (Visual highlight).
*   **Visibility Toggle:** Eye icon to show/hide.
*   **Add Layer:** Dropdown to select preset (Feywild, Shadowfell, etc.).
*   **Properties:** Rename, change opacity, change theme.

### 5.2. Interaction "Ghosting"
When placing a location or painting a biome, it *always* applies to the `activeLayerId`. To help orientation, users can toggle "Ghost Mode", which renders the Surface layer at 20% opacity underneath the current active layer (if different).

## 6. Implementation Phases

### Phase A: Data Structure & Store (Backend)
*   Define Zod schemas for `MapLayer` and `LayerTheme`.
*   Update `LocationStore` to support multi-layer state.
*   Implement migration logic for legacy saves.

### Phase B: Pattern Engine (Visuals)
*   Create `BiomePatternRegistry`.
*   Implement SVG/Canvas generation for 'Feywild', 'Shadowfell', and 'Underdark' aesthetics.
*   Update `HexGridRenderer` to accept a `theme` argument.

### Phase C: UI Integration (Frontend)
*   Create `LayerManager` component.
*   Integrate into `LocationSidebar`.
*   Add "Duplicate Layer" logic (useful for making "Ruined" versions of maps).

## 7. Example Use Case
A DM creates a town on the **Surface Layer**. They then add a **Shadowfell Layer**. They toggle "Ghost Mode" to see the surface town faint in the background. They paint "Ash Dunes" over the town's "Grasslands" and place a "Necropolis" location exactly where the town hall is on the surface, creating a perfect parallel dimension echo.

## Addendum: Multi-Step Pipeline Integration

- Pipeline: World Scaffold -> Per-Plane Biomes -> Plane Nodes (locations, NPCs, encounters) -> Cross-Plane Links -> GM Overview.
- Cross-plane links must be typed (portal, mirror, echo, influence) and stored using the Link Registry contract in `docs/specs/persistence.md`.
- Stitch step must resolve conflicts when multiple planes reference the same base entity.
