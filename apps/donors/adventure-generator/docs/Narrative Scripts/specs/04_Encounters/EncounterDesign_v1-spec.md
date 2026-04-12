# Specification: Encounter Card Builder: v1 (EncounterDesign_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Encounter Card Builder v1 is a compact, tabletop-focused tool. It condenses the older design into a "Cheat Sheet" format optimized for small screens and quick reference during play.

## 2. Component Architecture
### 2.1 Core Panels
- **Compact Header**:
    - Title + Goal (Single line).
    - "AI Fast-Fill" button.
- **Tiled Data Blocks**:
    - **Environment**: Modifiers (-10ft speed).
    - **Challenge**: Numbered steps (DC 13 Perception).
- **Tactics List**:
    - Bullet points for NPC behavior.
- **XP Footer**:
    - Sticky summary (Combat + Challenge = Total).

## 3. Interaction Logic
- **Quick-Entry**:
    - Tab order prioritized for speed.
- **Inline Math**:
    - Adding opponents updates Combat XP automatically.
- **Preset Hooks**:
    - Success/Failure fields have toggleable "Common Hooks" (e.g., "Found Map", "Captured").

## 4. Visual Design
- **Aesthetic**: Smartphone/Tablet optimized. High Contrast.
- **Layout**: Grid (2-column on desktop, stack on mobile).
- **Formatting**: Action-oriented icons (Crosshair, d20).

## 5. Data Model
```typescript
interface EncounterCard {
  title: string;
  goal: string;
  fastFillSeed?: string;
  description: string;
  envModifiers: string[];
  swteps: ChallengeStep[];
  tactics: string[];
  rewards: { xpChallenge: number; xpCombat: number };
}
```
