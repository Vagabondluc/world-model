# Specification: Era I - Phase 1.3 Map Creation

## 1. Overview
The "Map Creation" phase (Era I, Step 1.3) allows players to establish the geography of the world. This step occurs after "Geography" (Advice) and before "Resources". It serves as the point where the `mapData` is formally initialized in the game state.

## 2. Requirements

### 2.1 Mode Selection
Users must be able to choose between:
- **Random Generation**: Auto-generate a map based on parameters (or defaults).
- **Manual Creation**: Build the map using painting tools.

### 2.2 Random Generation
- **Function**: Trigger `generateHexMap` (or equivalent utility).
- **Feedback**: Show a loading indicator if necessary.
- **Result**: Display the generated map immediately in the preview area.
- **Retry**: Allow re-rolling the generation.

### 2.3 Manual Creation (Terraforming)
The user acts as a "World Shaper".
- **Tools Requirements**:
    - **Draw Continent**: Paints 'grassland' biome on clicked hexes.
    - **Place Island**: Paints 'coastal' biome on clicked hexes.
    - **Erase (Ocean)**: Removes biome data (reverts to ocean/null).
- **Controls**:
    - Pointer Interaction: Click to paint single hex, Drag to paint multiple hexes (via click-drag simulation).
    - Navigation: Pan/Zoom supported via `useZoomPan`.

### 2.4 Visualization
- Use `UnifiedMapRenderer` to display the map.
- Support Zoom/Pan behaviors.
- **State**: The map starts as all Ocean (or empty) for manual mode.

### 2.5 Persistence
- **Action**: "Confirm Map".
- **Effect**: Save the current hex grid state to `gameStore.mapData`.

## 3. Technical Design (As Built)

### 3.1 Components
- `MapCreationStep`: Main container handling both UI and Logic.
    - Integrates logic for Random vs Manual mode switching.
    - Manages local state `localMapData` before committing to store.
    - Implements direct interaction handling (MouseDown/Move/Up) to support map painting.

### 3.2 Services & Utilities
- `mapGenerator.ts`: Handles random map generation (Wilderness algorithm).
- `hexUtils.ts`: Used for `pixelToHex` conversion during manual interaction.
- `UnifiedMapRenderer`: Renders the map state.

### 3.3 State Management
- **Local State**: `localMapData` (holds `hexBiomes` during editing).
- **Global Store**: `gameplaySlice.setMapData` called on confirmation.

## 4. Test Plan (TDD)

### 4.1 Unit Tests (`MapCreationStep.test.tsx`)
- **Render**: Verify buttons for "Random" and "Manual" appear.
- **Random Flow**:
    - Mock `hexUtils`.
    - Click "Random" -> Assert `hexUtils.generate` is called.
    - Assert map preview updates.
- **Manual Flow**:
    - Select "Draw Continent".
    - Simulate click on Hex (0,0).
    - Assert Hex (0,0) becomes Land.
    - Assert `UnifiedMapRenderer` receives updated data.
- **Persistence**:
    - Click "Confirm".
    - Assert `updateElement` or `setMapData` (store action) is called with final data.

### 4.2 Integration Tests
- Verify stepping from 1.2 -> 1.3 -> 1.4 preserves the map data.
