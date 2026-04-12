# Specification: Scene Architect (SceneDescriptor_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Scene Architect builds immersive scenes by transforming "Bullet Points" into "Vivid Prose." It separates Player Descriptions from GM Mechanics.

## 2. Component Architecture
### 2.1 Core Panels
- **Configuration**:
    - Genre (Horror), Location.
- **Elements Ledger**:
    - Entities (Gargoyle), Events (Awakening).
- **Sensory Palette**:
    - Sight, Sound, Smell.
- **Dual-View Output**:
    - Player Box (Prose).
    - GM Box (Mechanics/Keys).

## 3. Interaction Logic
- **Prose Generation**:
    - Weaves "Rain" + "Sound" into atmospheric text.
- **Mechanical Extraction**:
    - "Gargoyle (AC 18)" in input -> Moves "AC 18" to GM Notes, keeps "Stone Beast" in Player Prose.
- **Regeneration**:
    - "Regenerate Prose" keeps facts, changes tone.

## 4. Visual Design
- **Aesthetic**: Authorial / Book-like.
- **Color Coding**: Blue (Narrative) vs Amber (Mechanics).

## 5. Data Model
```typescript
interface SceneDescriptor {
  genre: string;
  elements: string[];
  sensory: { [sense: string]: string };
  outputProse: string;
  gmNotes: string;
}
```
