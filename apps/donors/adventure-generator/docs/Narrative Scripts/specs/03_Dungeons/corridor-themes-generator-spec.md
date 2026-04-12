# Specification: Corridor Themes Generator (corridor-themes-generator)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Corridor Themes Generator is a procedural text tool designed to quickly populate dungeon hallways with sensory details, lore, and hazards. It ensures hallways are not just "empty space" but contribute to the atmosphere.

## 2. Component Architecture
### 2.1 Core Panels
- **Theme Input**:
    - Select/Search (e.g., "Abandoned Lab").
    - Seed Input (for reproducibility).
- **Control Bar**:
    - Toggles: Senses, Hazards, Lore.
- **Dynamic Result Card**:
    - Displays Base Description.
    - Sub-sections for Senses, Lore, Hazard.
    - "Sub-Reroll" buttons for individual blocks.

## 3. Interaction Logic
- **Weighted Selection**:
    - Generators use tagged tables (Theme 'Lava' excludes 'Ice' descriptors).
- **Seed Persistence**:
    - "Generate New" updates the seed.
    - "Sub-Reroll" keeps the global seed but modifies the local offset for that block.

## 4. Visual Design
- **Aesthetic**: Minimalist & Readable.
- **Feedback**: Toast notifications on Copy.

## 5. Data Model
```typescript
interface CorridorResult {
  theme: string;
  seed: number;
  base: string;
  senses: { sight: string; sound: string; smell: string; texture: string };
  lore: string;
  hazard: string;
}
```
