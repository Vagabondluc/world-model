# SPEC: Unify Monster Generation Rule Engine (DEC-007)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Motivation
The procedural monster generator currently uses two distinct data structures for abilities: a simple `PowerAtom` format (defined in `data/powerAtomLibrary.ts`) and a more powerful, executable `Rule[]` format (in `data/monsterRules.ts`). The `Rule[]` definitions are abstract and must look up `PowerAtom` fragments by ID to assemble a monster. This creates several problems:
*   **High Complexity**: A brittle transformation layer is required to connect rules to atoms, making the system hard to debug and extend.
*   **Limited Power**: The `Rule` engine's capabilities are constrained by what can be represented in the static `PowerAtom` library. Dynamic, context-aware ability generation (e.g., damage scaling based on CR *within* the rule's text) is difficult.
*   **Maintenance Overhead**: Modifying or adding a new ability requires changes in multiple files, increasing the risk of errors.

This refactor will unify the system into a single, self-contained `Rule[]` format, eliminating the `PowerAtom` library entirely, as decided in **DEC-007**.

## 2. Proposed Architecture

*   **Deprecation**: The file `data/powerAtomLibrary.ts` will be deleted. The `PowerAtom` type will continue to exist, but only as the direct *output* of a rule's `produce` function, not as a pre-defined, static library.
*   **Self-Contained Rules**: All monster abilities will be defined directly within `Rule` objects in new, modular files (e.g., `data/monsterRules/fireRules.ts`).
*   **Dynamic Generation**: The `produce` function of each `Rule` will now be responsible for generating the complete `PowerAtom` object, including the final, 5e-ready markdown `text`. This text will be templatized with placeholders (`{damage}`, `{dc}`, `{atk}`) that can be dynamically populated based on the monster's `Context` (CR, stats, etc.).
*   **Engine Simplification**: The `generatePowers` function in `services/monsterPowerGenerator.ts` will be simplified. It will no longer look up atoms by ID. Instead, it will directly consume the array of `PowerAtom` objects returned by each selected rule's `produce` function.

## 3. Migration Steps

1.  **Phase 1: Rule Migration & Modularization**
    *   Create a new directory: `data/monsterRules/`.
    *   Create new, theme-specific rule files within this directory: `fireRules.ts`, `coldRules.ts`, `lightningRules.ts`, `physicalRules.ts`, `utilityRules.ts`.
    *   Convert every `PowerAtom` from the old `powerAtomLibrary.ts` into a complete `Rule` in the appropriate new file. The `produce` function in each new rule will return an array containing a single, dynamically generated `PowerAtom`. The `text` property will be a template string.
    *   Create `data/monsterRules/index.ts` to aggregate and export all rules from the modular files as a single `ALL_RULES` array.

2.  **Phase 2: Engine Refactor**
    *   Modify `services/monsterPowerGenerator.ts`:
        *   Update the `generatePowers` function to remove any logic that looks up atoms by ID. It should now directly append the results of each `rule.produce(ctx)` call to its output array.
        *   The `assembleMonsterFromPowers` function will now be responsible for replacing the placeholders (`{damage}`, `{dc}`, etc.) in the `text` of the generated atoms.

3.  **Phase 3: Cleanup**
    *   Update `components/monster/ProceduralGeneratorForm.tsx` to import `ALL_RULES` from the new `data/monsterRules/index.ts`.
    *   Delete the now-obsolete `data/powerAtomLibrary.ts`.
    *   Delete the now-obsolete `data/monsterRules.ts`.
    *   Review the project for any other broken imports and correct them.

## 4. Acceptance Criteria
*   The files `data/powerAtomLibrary.ts` and `data/monsterRules.ts` are deleted.
*   The procedural generator (`PowerGeneratorForm.tsx`) remains fully functional.
*   Generating a monster (e.g., a CR 5 Fire Brute) correctly produces a statblock with dynamically generated, thematically appropriate abilities.
*   The generated abilities have correctly scaled numbers (damage, DC, attack bonus) based on the monster's CR and role.

## Addendum: Multi-Step Pipeline Integration

- Migration pipeline: Extract Rules -> Normalize Inputs -> Validate Outputs -> Replace Atom References.
- Emit progress events for each stage for tooling visibility (no UI stepper required).
- Track rule provenance with derived-from links for audit and rollback using the Link Registry contract in `docs/specs/persistence.md`.
