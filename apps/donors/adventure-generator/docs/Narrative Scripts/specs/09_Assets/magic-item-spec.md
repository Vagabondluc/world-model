# Specification: Magic Item Architect (magic-item)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Magic Item Architect (Master Edition) builds items with "General Data," "Magical Properties," and "Lore." It features auto-value calculations and handling for Advanced features like Sentience.

## 2. Component Architecture
### 2.1 Core Panels
- **Identity**:
    - Name, Type (Wondrous), Rarity.
- **Property Builder**:
    - List of spells/abilities (Passive vs Charge-based).
- **History Linker**:
    - Lore generation based on properties.
- **Advanced Features**:
    - Toggles: Sentient, Cursed, Artifact.

## 3. Interaction Logic
- **Constraints**:
    - "Uncommon" rarity flags Level 5+ spells as warnings.
- **Auto-Value**:
    - Rarity/Complexity selection updates estimated GP value.
- **Charge Tracking**:
    - Visual indicators for item charges (5/5).

## 4. Visual Design
- **Aesthetic**: High-Fantasy / Compendium / Parchment.
- **Badges**: Color-coded Rarity (Blue, Purple, Gold).

## 5. Data Model
```typescript
interface MagicItem {
  name: string;
  type: string;
  rarity: string;
  properties: ItemProperty[];
  charges: { max: number; regen: string };
  value: number;
  lore: string;
}

interface ItemProperty {
  name: string;
  description: string;
  cost?: number; // Charges
}
```
