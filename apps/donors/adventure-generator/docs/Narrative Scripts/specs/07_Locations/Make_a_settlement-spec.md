# Specification: Extended Settlement Generator (Make_a_settlement)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Extended Settlement Generator builds deeply detailed cities defined by "Everyday Life" (traditions, mores) and "Challenges" (internal/external). It extends the Quick Settlement logic.

## 2. Component Architecture
### 2.1 Core Panels
- **Basic Params**:
    - Name, Type (Fortified City), Civ Level (Advanced).
- **Everyday Life Config**:
    - Toggles: Traditions, Mores, Occupations, Festivals.
    - Depth: Brief/Standard/Detailed.
- **Conflicts Config**:
    - Internal: Political, Social, Economic.
    - External: Military, Supernatural.
- **Output Preview**:
    - Markdown renderer.

## 3. Interaction Logic
- **Civ Level Impact**:
    - "Advanced" level generates more festivals and occupation diversity than "Primitive".
- **Procedural Logic**:
    - "Generate" uses seed-based RNG to pull from tables (e.g. `social_norms`, `seasonal_festivals`).
- **Conflict Generation**:
    - Generates specific conflict hooks (e.g. "Guild Dispute") based on selected categories.

## 4. Visual Design
- **Aesthetic**: Comprehensive Dashboard.
- **Preview**: Distinct formatting for bulleted lists (Everyday Life) vs Numbered lists (Conflicts).

## 5. Data Model
```typescript
interface ExtendedSettlement {
  identity: { name: string; type: string; civLevel: string };
  generation: { seed: string; mode: 'Procedural' | 'AI' };
  config: {
    everydayLife: { includes: string[]; depth: string };
    conflicts: { internal: string[]; external: string[]; count: number };
  };
  output: SettlementData;
}
```
