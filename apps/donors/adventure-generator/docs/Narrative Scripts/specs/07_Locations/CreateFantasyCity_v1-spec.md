# Specification: Fantasy City Architect (CreateFantasyCity_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Fantasy City Architect is a top-down city builder focused on "Settlement Identity" and "Marketplace" generation. It features biome-integrated architecture (e.g. Glade Circles) and a strict 10-shop manifest.

## 2. Component Architecture
### 2.1 Core Panels
- **Identity Panel**:
    - Name, Population, Dominant Race (affects shop names).
- **Architecture Manager**:
    - Toggles for unique structures (e.g. "Treetop Housing").
- **Cultural Gallery**:
    - Artworks: Statues, Gardens, Tapestries.
- **Marketplace Editor**:
    - 10-slot grid for required shops (Magic, Armor, Weapon, etc.).
- **Timeline**:
    - History of Leadership (Luminarchs).

## 3. Interaction Logic
- **Biome Integration**:
    - Changing Biome updates architectural suggestions (e.g. "Dark Timber" vs "Sun-Bleached").
- **Auto-Naming**:
    - "Generate Shop Names" uses the Dominant Race to flavor the names (e.g. Elven -> "The Arcane Root").
- **Validation**:
    - Prevents completion until all 10 shops are defined.

## 4. Visual Design
- **Aesthetic**: Natural Heritage / Parchment.
- **Icons**: Trees, Hammers, Crowns.

## 5. Data Model
```typescript
interface FantasyCity {
  identity: { name: string; biome: string; race: string; pop: number };
  architecture: string[];
  culture: { statues: string[]; gardens: string[] };
  history: string[];
  market: ShopEntry[]; // Fixed 10 slots
}

interface ShopEntry {
  type: string; // 'Magic', 'Armor'
  name: string;
  description: string;
}
```
