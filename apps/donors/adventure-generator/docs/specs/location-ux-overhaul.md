
# SPEC: Location Manager UX Overhaul (Phase 6)

## 1. Overview
The current `LocationManager` UI is becoming cluttered with disparate buttons for different creation modes (Locations, Regions, Biome Painting). This phase aims to unify these interactions into a standard "Tool" model, similar to graphic editing software.

## 2. Goals
- **Unified Interface**: Replace scattered header buttons with a centralized Toolbar.
- **Contextual Actions**: Show only relevant sub-controls (e.g., biome palette, region finish/cancel) when the corresponding tool is active.
- **Scalability**: Easier to add new tools (e.g., Road drawing, measurement) in the future.
- **Clearer State**: Explicit `InteractionMode` in the store prevents conflicting states (e.g., trying to paint biomes while placing a location).

## 3. Data Architecture Changes

### New Types (`types/adventure.ts`)
```typescript
export type InteractionMode = 
  | 'inspect'        // Default: Select/View hexes and entities
  | 'biome_paint'    // Click/Drag to apply selected biome
  | 'region_draft'   // Click to toggle hex selection for new region
  | 'location_place'; // Next click opens LocationForm at hex
```

### Location Store Updates (`stores/locationStore.ts`)
Add to `LocationStoreState`:
- `interactionMode: InteractionMode` (default: `'inspect'`)
- `selectedPaintBiome: BiomeType` (moved from local state)
- `draftRegionHexes: HexCoordinate[]` (moved from local `paintedHexes` state)

Add Actions:
- `setInteractionMode(mode: InteractionMode)`
- `setSelectedPaintBiome(biome: BiomeType)`
- `toggleDraftHex(hex: HexCoordinate)`
- `clearDraftHexes()`

## 4. Component Architecture

### A. `LocationToolbar` (New Component)
- **Responsibility**: persistent strip of tool buttons.
- **State Access**: Reads `interactionMode`, calls `setInteractionMode`.
- **Layout**: Top of the map canvas.

### B. `LocationContextMenu` (New Component)
- **Responsibility**: Dynamic sub-bar showing options for the *active* tool.
- **Behavior**:
  - If `mode === 'inspect'`: Show view toggles (Grid, Labels - currently in a dropdown).
  - If `mode === 'biome_paint'`: Show Biome Palette selector.
  - If `mode === 'region_draft'`: Show "Finish" (creates region from `draftRegionHexes`) and "Cancel" buttons.
  - If `mode === 'location_place'`: Show instructional text ("Click hex to place...").

### C. `LocationManager` (Refactor)
- Remove local state for `isCreatingLocation`, `isPaintingRegion`, `isPaintingBiome`, `paintedHexes`.
- Remove legacy header buttons.
- Render `LocationToolbar` and `LocationContextMenu` above `HexGrid`.

### D. `HexGrid` (Refactor)
- **Props Update**: Remove individual mode booleans. Accept `interactionMode` and `draftHexes`.
- **Event Handling**: standard `onHexClick` / `onHexDrag` handlers in `LocationManager` will now switch logic based on `useLocationStore.getState().interactionMode`.
  - *Inspect*: Select location/region.
  - *Biome*: Call `paintHexBiome`.
  - *Region*: Call `toggleDraftHex`.
  - *Location*: Open modal, then auto-revert mode to 'inspect'.

## 5. Interaction Flows

**Painting a Biome:**
1. User clicks "Brush" icon in Toolbar -> `setInteractionMode('biome_paint')`.
2. Context Menu appears with Biome Select.
3. User selects "Swamp".
4. User drags on `HexGrid`. `LocationManager` handles drag events -> calls `paintHexBiome(hex, 'swamp')`.

**Creating a Region:**
1. User clicks "Region" icon in Toolbar -> `setInteractionMode('region_draft')`.
2. Context menu shows "0 Hexes selected" and "Finish"/"Cancel" buttons.
3. User clicks hexes. `HexGrid` visually highlights them (read from `draftRegionHexes` store).
4. User clicks "Finish" in Context Menu.
5. `LocationManager` calculates bounding box from `draftRegionHexes`, opens `RegionPanel`, clears draft.

## Addendum: Multi-Step Pipeline Integration

- Add a stepper that maps to modes: Inspect -> Biome Paint -> Region Draft -> Location Place -> Bind Dependencies.
- Bind Dependencies step must surface NPC, encounter, and faction slots with link chips, persisted via the Link Registry contract in `docs/specs/persistence.md`.
- Each step emits progress updates so parent pipelines can show global status.
