# Encounter Balancer Scaffold (x4) - Donor Specification

## Identity

| Field | Value |
|---|---|
| Donor Name | Encounter Balancer Scaffold |
| Internal ID | `encounter-balancer-scaffold` |
| Class | scaffold-copy |
| Adapter ID | none - not registered |
| Manifest | not yet created |
| Source Roots | `to be merged/apocalypse/`, `to be merged/character-creator/`, `to be merged/deity creator/`, `to be merged/genesis/` |
| Source Kind | Next.js 16 scaffold (TypeScript + React + Prisma + shadcn + Tailwind) |
| Canonical Lane | encounter-balance (candidate) |
| Phase 7 Methodology | representative behavioral capture on one copy, then clone equivalence verification across the other three |
| Adapter Status | unregistered |

## What It Is

The four folders `to be merged/apocalypse/`, `to be merged/character-creator/`, `to be merged/deity creator/`, and `to be merged/genesis/` are byte-identical copies of the same scaffolded Next.js application. They are not four distinct donors.

The application itself is a D&D encounter builder with two visible tabs:

- `Balancer`
- `Environmental`

It also includes a templates dialog and a saved-elements panel. The current UI is framed as an encounter planning tool, not as four separate products.

## Evidence of Identity

| File | Identity Signal |
|---|---|
| `package.json` | `name = "nextjs_tailwind_shadcn_ts"` in all four folders |
| `src/app/page.tsx` | same `D&D Encounter Builder` page and tab structure in all four folders |
| `src/lib/encounter-types.ts` | identical scaffold vocabulary |
| `api/{elements,encounters,monsters,route.ts}` | identical route structure |
| `prisma/schema.prisma` | identical schema surface |

The four folders differ only in path name. The source content sampled during inventory is identical across all four locations.

## Behavioral Surface

The visible UI surface is the same across the copies:

- header with `D&D Encounter Builder`
- `Templates` dialog
- `SavedElementsPanel`
- `Balancer` tab with `EncounterBalancerTab`
- `Environmental` tab with `EnvironmentalScenarioTab`
- footer with version badge

This means the inventory should treat the four folders as one donor group with four physical roots, not as four separate donor identities.

## Canonical Contribution Potential

| Scaffold Concept | Provisional Canonical Target | Status |
|---|---|---|
| Encounter budget / XP balancing | `EncounterBudgetAttachment` or similar | candidate |
| Scenario templates | encounter preset records | candidate |
| Environmental hazard composition | encounter scenario metadata | candidate |
| Saved encounter elements | encounter composition record | candidate |

These are only candidate mappings. No canonical promotion should occur until the scaffold group is differentiated from the surrounding donor set and its intended product identity is confirmed.

## Relation to Other Donors

- The scaffold appears to be an encounter-planning tool, not a worldbuilding system.
- It does not currently contribute trunk `WorldRecord` / `EntityRecord` semantics.
- It may overlap with Mythforge or Adventure Generator at the level of encounter preparation, but the current source snapshot is a standalone scaffold app.

## Inventory Rule

This group should be listed once in the donor inventory, with all four source roots named explicitly.

Do not:

- list the four folders as four separate donors
- collapse them without naming the physical roots
- treat them as `mechanical-sycophant` or any other unrelated source

## Registration Steps Required

1. Decide whether the four copies are intentional clones or accidental duplication
2. If intentional, document the product split and keep one spec doc for the group
3. If accidental, consolidate to one canonical scaffold root and archive the others
4. Only after differentiation is settled should any adapter or canonical-lane work begin

