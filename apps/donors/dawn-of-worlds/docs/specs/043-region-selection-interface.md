# SPEC-043: Region Selection Interface

**Epic:** Region Selection
**Status:** DRAFT
**Dependencies:** SPEC-042 (Pre-Runtime Globe)

## 1. Overview
After generating a planet, players must select a playable area. This interface allows them to survey the globe, view resource distributions, and lock in a specific region to start the game.

## 2. Core Features

### 2.1 The Survey View
A 3D interactive mode using the `SmoothSphere` renderer.

- **Navigation:** Rotate, Pan, Zoom.
- **Overlays:** Toggle "Biomes", "Temperature", "Elevation", "Magic Intensity".
- **Markers:** "Points of Interest" (POIs) generated during Genesis are highlighted (e.g., "The Obsidian Spire", "Grand Canyon").

### 2.2 The Selection Frame
A visual indicator of the playable area.

- **Shape:** Rectangular (lat/long bound) or Hexagonal (radius).
- **Constraints:** Must be within valid bounds (e.g., cannot cover both poles).
- **Preview:** A sidebar shows "Region Stats" (e.g., 40% Water, 20% Mountain, High Magic).

### 2.3 The "Landfall" Action
The transition from Pre-Game to Game.

1.  **Confirmation:** User clicks "Establish Realm".
2.  **Transition:** Camera zooms rapidly into the center of the selection.
3.  **Loading:** The `GameLoop` initializes, hydrating the `worldCache` with the selecting data.

## 3. UI/UX Design

- **Floating HUD:** Minimalist overlay floating above the planet.
- **Minimap:** 2D flattened projection of the whole globe for quick jumps.
- **Story Integration:** "The Gods survey the void and choose their canvas."

## 4. Implementation Details

```typescript
interface RegionSelection {
    center: { lat: number, long: number };
    radius: number; // In hex rings or km
}

function getRegionStats(globe: GlobeData, selection: RegionSelection) {
    // Scan all vertices/hexes within radius
    // Aggregate biome counts
    // Return stats object
}
```

## 5. Verification
- **Interaction Test:** Dragging the selection box updates the "Region Stats" in real-time.
- **Boundary Test:** Prevent selecting invalid areas or wrapping incorrectly.
- **Zoom Test:** Smooth transition from "Global View" to "Local Preview".
