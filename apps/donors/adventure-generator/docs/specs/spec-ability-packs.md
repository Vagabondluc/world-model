
# SPEC: Granular Ability Packs & UI Overhaul (DEC-019)

## 1. Motivation
The current procedural monster "Theme" system (e.g., Fire, Cold) provides elemental flavor but lacks mechanical depth and identity. It is unable to differentiate between distinct class-based concepts like a "Controller Wizard" (focused on debuffs) and a "Support Wizard" (focused on buffs/healing), as both would fall under a generic "Magic" theme. This specification details the plan to replace this system with a more granular and powerful "Ability Pack" system.

## 2. Goals
- **Mechanical Depth:** Introduce class-like ability packages that provide distinct mechanical identities to generated monsters.
- **Granularity:** Allow users to combine multiple primary and secondary packs to create unique hybrid creatures.
- **Role Differentiation:** Enable the generation engine to make smarter choices based on the monster's role (e.g., a Brute with the "Barbarian" pack should favor rage abilities).
- **UI Improvement:** Replace the simple dropdowns with a more intuitive multi-select interface.

## 3. Implementation Plan

### Phase 1: Data Architecture Refactor

The core of this change is to redefine themes as structured **Ability Packs**.

1.  **New Data Structure (`types/monsterGrammar.ts`):**
    - The `ThemeTag` interface will be deprecated.
    - A new `AbilityPack` interface will be introduced:
    ```typescript
    export interface AbilityPack {
      id: string; // e.g., "wizard:evocation", "fighter:weapon-master"
      name: string; // e.g., "Wizard: School of Evocation"
      category: 'Martial' | 'Magical' | 'Primal' | 'Supernatural' | 'Other';
      description: string;
      keywords: string[]; // "fire", "control", "weapon-attack"
      roleAffinity?: Partial<Record<MonsterRole, number>>; // e.g., { Controller: 1.2, Artillery: 1.1 }
    }
    ```
2.  **New Data File (`data/abilityPacks.ts`):**
    - A new file will be created to define all available `ABILITY_PACKS`.
    - Packs will be grouped by category (Martial, Magical, Primal, etc.) for UI organization.
3.  **Update Rule Engine (`types/monsterGrammar.ts`):**
    - The `Rule` interface will be updated to key off these new packs.
    - `when.requireThemes` will be replaced with `when.requirePacks?: string[]`.
    - `when.forbidThemes` will be replaced with `when.forbidPacks?: string[]`.
    - Example rule: `{ id: 'wizard:fireball', when: { requirePacks: ['wizard:evocation'] } ... }`

### Phase 2: UI/UX Overhaul

The current two-dropdown system will be replaced with a modal-based, multi-select component.

1.  **Store Update (`stores/monsterCreatorStore.ts`):**
    - The state will change from `themes: string[]` to `primaryPacks: string[]` and `secondaryPacks: string[]`.
2.  **New Component (`components/monster/form/AbilityPackSelector.tsx`):**
    - This new component will render a modal for pack selection.
    - The modal will display all `ABILITY_PACKS`, grouped by their `category`.
    - Users can select multiple packs via checkboxes.
3.  **Refactor (`components/monster/form/ThemeSection.tsx`):**
    - This component will be renamed to `AbilityPackSection.tsx`.
    - It will display selected packs as removable tags.
    - It will contain "Add Primary Pack..." and "Add Secondary Pack..." buttons that open the `AbilityPackSelector` modal.

### Phase 3: Generation Engine Upgrade

The procedural engine will be updated to leverage the new Ability Packs and their `roleAffinity`.

1.  **Update `generatePowers` (`services/monsterPowerGenerator.ts`):**
    - The rule filtering logic will be updated to use `rule.when.requirePacks`.
    - **Role Affinity Logic:** When calculating the selection weight for a rule, the engine will check the `roleAffinity` of its required pack. If a rule's pack has a high affinity for the current monster's role, its selection weight will be multiplied, making it more likely to be chosen.
    - This directly implements the "Controller Wizard" vs. "Support Wizard" differentiation.
2.  **Update AI Prompting (`MonsterCreatorView.tsx`):**
    - For AI-based generation, the prompt will be updated to list the selected `primaryPacks` and `secondaryPacks` to give the AI a more specific mechanical and thematic direction.

## Addendum: Multi-Step Pipeline Integration

- Pipeline: Outline Pack -> Generate Mechanics -> Balance and Validate -> Package and Tag.
- If a pack references class, feat, or item entities, emit typed links during Generate Mechanics using the Link Registry contract in `docs/specs/persistence.md`.
- Add a validation gate before packaging to ensure all links resolve to stable IDs.
