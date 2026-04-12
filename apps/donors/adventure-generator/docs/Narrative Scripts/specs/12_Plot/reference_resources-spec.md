# Specification: Narrative Engine (reference_resources)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Narrative Engine & Tactical Lexicon provides "Atomic Generators" for plot, "Tactical Roles" for combat, and "Twist Decks."

## 2. Component Architecture
### 2.1 Core Panels
- **Plot Engine**:
    - Selector (e.g. "Blackmail"). Tension/Meat/Failure definitions.
- **Tactical Injector**:
    - Target (Goblin), Role (Leader). Output: Behavior mods.
- **Twist Deck**:
    - Card drawer (Universal Twists).
- **Workflow Suite**:
    - "Hook vs Meat" planner.

## 3. Interaction Logic
- **Mutation Tracking**:
    - Resolving "Blackmail" suggests next logical engine (e.g. "Manhunt").
- **Constraint Sync**:
    - Active "Constraint" (e.g. No Violence) disables certain engines.
- **Role Overlay**:
    - Applying "Controller" role adds specific abilities (e.g. "Gravity Welt") to statblock.

## 4. Visual Design
- **Aesthetic**: Codex / Card Deck.
- **Sparklines**: Synergy indicators for tactical groups.

## 5. Data Model
```typescript
interface PlotResources {
  activeEngine: PlotEngine;
  activeRole: { target: string; role: string; mods: string[] };
  twists: string[];
}
```
