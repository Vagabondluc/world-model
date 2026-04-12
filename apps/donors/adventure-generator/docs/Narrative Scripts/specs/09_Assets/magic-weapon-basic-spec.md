# Specification: Magic Weapon Architect (magic-weapon-basic)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Magic Weapon Architect focuses on turning a text description into a structured 5e Stat Block. It includes "Thematic Extraction" and "Rarity-Driven Constraints".

## 2. Component Architecture
### 2.1 Core Panels
- **Description Input**:
    - Raw text (Lore).
- **Settings**:
    - Rarity, Type (Longsword), Auto-Balance toggle.
- **Live Preview**:
    - Real-time 5e Stat Block rendering.
- **Budget Tracker**:
    - "Features Used vs Allowed" (based on rarity).

## 3. Interaction Logic
- **Thematic Extraction**:
    - Analyzing "frozen heart" suggests "Cold Damage".
- **Feature Budget**:
    - Uncommon = 1 Minor Feature. Rare = 2 Features.
- **Preview Sync**:
    - Updating Name instantly updates the Stat Block header.

## 4. Visual Design
- **Aesthetic**: Modern Dark Theme / Official 5e Block style.
- **Layout**: Split-screen (Input vs Output).

## 5. Data Model
```typescript
interface MagicWeapon {
  description: string;
  name: string;
  rarity: string;
  type: string;
  stats: { damage: string; properties: string[] };
  features: WeaponFeature[];
}

interface WeaponFeature {
  name: string;
  effect: string;
}
```
