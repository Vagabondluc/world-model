# 105 Brainstorm Critique And Priority Fixes

SpecTier: Brainstorm

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`brainstorm critique findings`, `priority fix matrix`]
- `Writes`: [`remediation recommendations`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/105-brainstorm-critique-and-priority-fixes.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

## Findings (highest risk first)

- **Missing canonical glossary and key registry**
  - The stack defines many terms (`pressure`, `legitimacy`, `influence`, `trust`, `divergence`) but there is no single canonical key dictionary.
  - Risk: semantic drift and duplicate metrics across files.
  - Affected: `79`, `80`, `82`, `83`, `86`, `94`, `97`, `104`.

- **Cross-file contracts are strong conceptually but weakly bound operationally**
  - Several files reference each other, but there is no explicit machine-checkable dependency table.
  - Risk: silent breakage when one draft changes shape.
  - Affected: `79` through `104`.

- **Tech tree still under-specified for systemic causality**
  - `tech-tree-comprehensive-v1.md` is comprehensive by listing, but many nodes still have no explicit impact package.
  - Risk: broad catalog with low simulation consequence density.
  - Affected: `tech-tree-comprehensive-v1.md`, `tech-tree-comprehensive-v1-prereqs.md`, `79`, `104`.

- **Government + transition + civil war chain is defined, but missing shared thresholds registry**
  - Thresholds appear in multiple drafts without one canonical source of truth.
  - Risk: inconsistent triggering behavior.
  - Affected: `94`, `95`, `96`, `80`, `103`.

- **Narrative/perception layer needs stronger anti-runaway safeguards**
  - `86` introduces divergence loops, but limits/caps are not fully standardized with the pressure engine policy.
  - Risk: unstable dynamics overpowering material state too easily.
  - Affected: `80`, `86`, `93`, `97`.

- **MVP sequencing is good, but success metrics are mostly qualitative**
  - Current acceptance language is readable, but there are few hard numeric pass/fail targets.
  - Risk: “looks good” bias and unclear completion.
  - Affected: `102`, `103`.

- **UI backbone exists but needs explicit data payload contracts per panel**
  - Situation room/action picker are defined structurally, not fully as data envelopes.
  - Risk: UI generation moves ahead with incompatible backend payloads.
  - Affected: `87`, `91`, `88`.

## Priority Fixes (do these next)

- Create `106-canonical-key-registry.md`
  - Single source for metric keys, units, bounds, ownership.

- Create `107-threshold-and-reasoncode-registry.md`
  - One table for trigger thresholds, cooldowns, reason codes, and owning subsystem.

- Create `108-tech-impact-coverage-audit.md`
  - For each tech node: `has_prereq`, `has_impacts`, `has_events`, `has_multiplier_links`.
  - Flag missing high-leverage techs (starting with nitrogen fixation chain).

- Create `109-panel-data-contracts.md`
  - API envelopes for `Situation Room`, `Action Picker`, `Timeline`, `Leader Card`, `Risk Feed`.

- Add stability policy annex for narrative layer
  - Explicit caps for belief divergence growth per tick and per century.
  - Define forced re-anchoring conditions.

- Add hard MVP pass criteria
  - Example:
    - deterministic replay hash parity = 100% on scenario pack
    - at least 3 distinct regime outcomes over 10 seeded runs
    - player can identify top 3 crisis drivers in one screen without drill-down

## Tech Tree Critique (focused)

- Good: breadth and historical texture are strong.
- Weak: causal density per node is uneven.
- Immediate fix:
  - Add a mandatory “impact minimum” rule: every tech must modify at least:
    - one primary pressure axis
    - one secondary social or narrative vector
  - Add an “era identity” rule: each level must have a clearly dominant civilizational pivot.

## Recommendation

Do not add more new layers before completing:
- canonical key registry
- threshold/reasoncode registry
- tech impact coverage audit
- panel data contracts

These four will convert the brainstorm from rich concept design into implementation-safe architecture.

## Compliance Vector (v1)
Input:
- deterministic fixture input under canonical bounds for this brainstorm contract.

Expected:
- deterministic output for identical inputs and evaluation order.
- out-of-range values are clamped/rejected explicitly via stated policy.
