# SPEC-017: Genesis Protocol Evolution (Procedural Controls)

**Feature:** Advanced World Generation Controls
**Version:** 1.0
**Priority:** Medium
**Status:** Approved

## 1. Executive Summary
The initial Genesis Protocol provides static world generation parameters (Water, Mountains, Forests). To improve user agency and variability, we are introducing **Seed-based Generation** and **Preview Navigation (Zoom)**.

## 2. Technical Requirements

### 2.1 Seeded Noise
Currently, `getBaseBiome` uses hardcoded sine-wave offsets. 
- **Requirement:** Add a `seed` property (number or string) to `WorldGenParams`.
- **Implementation:** The `seed` will act as a spatial offset in the noise function: `Math.sin(q * 0.2 + seed)`.

### 2.2 Preview Zoom
The `MapPreview` canvas is fixed at a 0.2 scale.
- **Requirement:** Allow the user to zoom into the preview to inspect local topography before committing.
- **Scale Range:** 0.1 (Overview) to 1.0 (Detail).

### 2.3 UI Controls
- **Refresh Button:** A "Dice" icon next to a seed input that generates a new random integer.
- **Zoom Slider:** A vertical or horizontal slider in the preview area.

## 3. Data Model Updates
Update `WorldGenSchema` in `logic/schema.ts`:
```typescript
{
  waterLevel: number;
  mountainDensity: number;
  forestDensity: number;
  seed: number; // New field
}
```

## 4. User Experience Goals
- **Variability:** Players can cycle through infinite layouts with the same density settings.
- **Clarity:** "Zoom" allows players to see exactly how a coastline or mountain range looks at 1:1 scale before the world is forged.
