# SPEC: Monster "Tag Grammar" Engine (DEC-020)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Motivation
The "Ability Pack" system (DEC-019) was a good step towards mechanical depth, but it remained somewhat monolithic. A more flexible and emergent system is desired, one that allows for true creativity through combination. This specification details a "Tag Grammar" engine that treats monster abilities as a language, built from atomic tags and combination rules.

## 2. Goals
- **Maximum Flexibility:** Move from class-like "packs" to granular, atomic "tags" (e.g., "Fire", "Poison", "Weaponry", "Illusion", "Summoning").
- **Emergent Design:** Implement a system where combining tags can unlock unique, synergistic abilities that don't exist within the tags themselves (e.g., "Fire" + "Earth" -> "Magma").
- **Role-Driven Abilities:** Ensure that the abilities provided by a tag are context-aware, offering different mechanics based on the monster's assigned role (e.g., a "Fire" Artillery monster gets a fireball, while a "Fire" Soldier gets a flaming shield).
- **Simplified UI:** The user experience should be a simple multi-select of desired tags, without the rigid distinction of "primary" and "secondary".

## 3. Implementation Plan

### Phase 1: Data Architecture Refactor

1.  **New Data Structure (`types/monsterGrammar.ts`):**
    - A simple `GrammarTag` interface will be defined:
    ```typescript
    export interface GrammarTag {
      id: string; // e.g., "fire", "weaponry", "illusion"
      name: string; // e.g., "Fire & Magma"
      category: 'Elemental' | 'Combat' | 'Magic' | 'Supernatural' | 'Other';
      description: string;
    }
    ```
2.  **New Data File (`data/grammarTags.ts`):**
    - This file will define all available `GrammarTag`s for the UI.

3.  **Update Rule Engine (`types/monsterGrammar.ts`):**
    - The `Rule` interface will be updated to handle both standard tags and combinations.
    - `when.requireThemes` will be replaced with `when.requireTags?: string[]` (for single-tag rules).
    - A new condition, `when.requireTagsAll?: string[]`, will be added for combination rules (e.g., `['fire', 'earth']`).
    - The rule files will now contain a mix of standard rules and combination rules.

### Phase 2: UI/UX Overhaul

1.  **Store Update (`stores/monsterCreatorStore.ts`):**
    - The state will be simplified from `primaryPacks` and `secondaryPacks` to a single `tags: string[]`.
2.  **New Component (`components/monster/form/TagSelector.tsx`):**
    - A new modal component will display all `GrammarTag`s, grouped by category, allowing for multi-selection.
3.  **Refactor (`components/monster/form/ThemeSection.tsx`):**
    - The component will be renamed to `TagSection.tsx`.
    - It will display selected tags as removable pills.
    - It will contain an "Add Tags..." button that opens the `TagSelector` modal.

### Phase 3: Generation Engine Upgrade

The procedural engine will be re-architected to handle the two-tiered rule system.

1.  **Update `generatePowers` (`services/monsterPowerGenerator.ts`):**
    - The function will now execute in two stages:
    1.  **Combination Pass:** The engine first filters the entire rule set to find all rules where `requireTagsAll` is a subset of the user's selected tags. These synergistic, high-priority rules are evaluated and applied first.
    2.  **Standard Pass:** With the remaining budget, the engine then filters for standard rules where `requireTags` matches any of the user's selected tags. It applies these rules until the budget is exhausted.
    - This two-pass system ensures that unique combinations are prioritized, creating the "matrix of interactions."
    - Role-specific variations will continue to be handled by the `when.roles` property within individual rules, ensuring a "Fire Brute" gets different abilities than a "Fire Controller".

2.  **Update AI Prompting (`MonsterCreatorView.tsx`):**
    - The prompt for AI generation will be updated to simply list the selected tags, giving the AI a clear but flexible set of concepts to work with.

## Addendum: Multi-Step Pipeline Integration

- Add a Resolve References stage that turns tags into entity links where possible.
- Store resolved links using the Link Registry contract in `docs/specs/persistence.md`, with a tag-origin attribute.
- Emit warnings when tags look like entities but fail to resolve.
