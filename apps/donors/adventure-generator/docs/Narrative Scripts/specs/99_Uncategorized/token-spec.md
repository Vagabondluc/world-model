# Specification: Token Studio (token)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Token Studio generates "Top-Down Aerial" assets for VTTs. It includes a "Prompt Preview," "Batch Settings" (Frame shape), and a Gallery.

## 2. Component Architecture
### 2.1 Core Panels
- **Description Input**:
    - Subject (e.g. Grizzled Dwarf).
- **Prompt Preview**:
    - Shows constructed prompt (with "Top-down" keywords).
- **Batch Settings**:
    - Round vs Square Frame.
- **Gallery**:
    - Saved Tokens.

## 3. Interaction Logic
- **Prompt Construction**:
    - Auto-injects "Transparent background, 2D game art".
- **Frame Selection**:
    - Modifies generation parameters (or post-processing) for frame shape.

## 4. Visual Design
- **Aesthetic**: Asset Manager.
- **Preview**: Top-down mockup visual.

## 5. Data Model
```typescript
interface TokenStudio {
  description: string;
  settings: { frame: 'Round' | 'Square'; perspective: 'Top-Down' };
  gallery: string[]; // Image URLs
}
```
