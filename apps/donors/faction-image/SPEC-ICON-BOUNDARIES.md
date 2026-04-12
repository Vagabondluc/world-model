# Icon Generator Boundary Specification

Version: 1.0  
Date: 2026-03-10  
Scope: `src/icon-generator/*` and integration points with `src/lib/faction/*`

## 1. Purpose

This document defines strict ownership boundaries and decision rules for the faction icon generator so behavior is predictable, testable, and maintainable.

Primary goals:
- Remove conflicting authority between domain colors, color presets, and manual colors.
- Define one source of truth for generation state and visual output.
- Prevent duplicate generator systems from drifting apart.

## 2. Product Principles

- Determinism first: same effective config + same seed => same icon output.
- Explicit authority: every visual property must have one current owner.
- User intent preservation: explicit manual edits must never be silently overwritten unless user chooses to reset/reapply.
- Single pipeline: generation logic belongs in engine modules, not UI components.

## 3. Architecture Boundaries

## 3.1 Module Ownership

- `src/icon-generator/types.ts`
  - Owns canonical types for config/spec/layers/effects.
  - No duplicate type declarations in sibling modules.

- `src/icon-generator/domainPalettes.ts`
  - Owns domain palette definitions and lookup helpers.
  - Does not own UI behavior.

- `src/icon-generator/iconSpecBuilder.ts`
  - Owns procedural geometry/layer generation from effective config.
  - Must not depend on UI components.

- `src/icon-generator/ConfigForm.tsx`
  - Owns user input capture only.
  - Must not embed business precedence logic beyond dispatching explicit user intents.

- `src/icon-generator/IconGenerator.tsx`
  - Owns orchestration (variant generation, selection, export actions).
  - Must not contain core composition generation algorithms long-term.

- `src/icon-generator/exportUtils.ts`
  - Owns serialization/export formatting only.

- `src/icon-generator/colorReducer.ts` (or `colorService.ts`)
  - Owns color ownership transitions (`SelectDomain`, `SelectPreset`, `ManualEdit`, resets).
  - Must be pure and deterministic.

- `src/icon-generator/seedManager.ts`
  - Owns seed generation, collision handling, and seed history appends.
  - Must be deterministic and side-effect free.

- `src/lib/faction/*`
  - Must either be deprecated/removed from active UI path or made adapter-only.
  - Active page must not use two independent engines for the same concept.

## 3.2 Forbidden Boundary Violations

- Duplicate unions for the same concept in multiple files (e.g., symbol style/type).
- UI-level mutation rules that conflict with engine-level defaults.
- Multiple generators used for same UI surface without adapter contract.

## 4. Single Source of Truth Model

Effective visual state is derived from:
1. Base config (seed, domain, complexity, shape/style controls)
2. Color policy (domain/preset/manual ownership state)
3. Composition policy (layers, blend modes, filters)

The app must track explicit ownership metadata, not infer from color values.

Required config metadata:
- `ownerByChannel`: `{ primaryColor, secondaryColor, accentColor, backgroundColor } => "domain" | "preset" | "manual"`
- `colorPresetKey`: nullable preset id
- `manualColorDirtyByChannel`: optional per-channel dirty flags

`colorMode` is not persisted as authoritative state.  
If needed for UI display, it is derived as:
- `manual` if any channel owner is `manual`
- `preset` if no manual owners and any channel owner is `preset`
- `domain` otherwise

## 4.1 Color Ownership State Machine

The state machine is channel-centric. Every user action evaluates each channel independently.

Action semantics:
- `SelectDomain(d)` updates only channels owned by `domain`
- `SelectPreset(p, applyToAll=false)` updates only channels owned by `domain` or `preset`
- `SelectPreset(p, applyToAll=true)` updates all channels and sets owner to `preset`
- `ManualEdit(channel, value)` updates that channel and sets owner to `manual`
- `ResetToDomain` sets all owners to `domain`, reapplies domain palette
- `ResetToPreset` sets all owners to `preset`, reapplies selected preset

Per-channel transition table:

| Current Owner | Action | Next Owner | Value Source |
|---|---|---|---|
| `domain` | `SelectDomain` | `domain` | domain palette |
| `domain` | `SelectPreset(applyToAll=false)` | `preset` | preset palette |
| `domain` | `ManualEdit` | `manual` | user input |
| `preset` | `SelectDomain` | `preset` | unchanged |
| `preset` | `SelectPreset(applyToAll=false)` | `preset` | new preset palette |
| `preset` | `ManualEdit` | `manual` | user input |
| `manual` | `SelectDomain` | `manual` | unchanged |
| `manual` | `SelectPreset(applyToAll=false)` | `manual` | unchanged |
| `manual` | `SelectPreset(applyToAll=true)` | `preset` | preset palette |
| any | `ResetToDomain` | `domain` | domain palette |
| any | `ResetToPreset` | `preset` | preset palette |

## 5. Color Authority Contract (Critical)

## 5.1 Owners

- Domain owner: `domain` controls palette channels.
- Preset owner: selected preset controls palette channels.
- Manual owner: user color picker controls specific channels.

Only one owner controls each channel at a time.

## 5.2 Channel-Level Ownership

Channels:
- `primaryColor`
- `secondaryColor`
- `accentColor`
- `backgroundColor`

Each channel must have `owner` metadata:
- `"domain" | "preset" | "manual"`

## 5.3 Precedence Rules

- Selecting a domain:
  - sets color owner to `domain` for non-manual channels.
  - does not overwrite channels currently owned by `manual` unless user confirms/reset action.

- Selecting a color preset:
  - sets owner to `preset` for channels it provides.
  - does not overwrite `manual` channels unless user chooses “apply to all”.

- Manual color picker change:
  - immediately sets that channel owner to `manual`.

- “Reset to domain” action:
  - sets all color owners to `domain` and reapplies domain palette.

- “Reset to preset” action:
  - sets all color owners to `preset` and reapplies preset palette.

## 5.4 Ownership Conflict Resolution

Conflict policy is strict and deterministic:
- Manual ownership is sticky by default.
- Presets do not override manual channels unless user chooses `applyToAll=true`.
- Domain selection never overrides manual channels.
- Background channel follows same rules as other channels.

UX requirements:
- Preset apply UI must expose:
  - `Apply to unlocked` (default)
  - `Apply to all channels` (explicit override)
- UI must visually indicate channel owners (`domain` / `preset` / `manual`).

## 5.5 Dark Mode Policy

Dark mode is not a color-authority input in this system.

Rules:
- No user-facing dark-mode palette toggle in MVP flow.
- If app theming exists, it affects page chrome only, not generated symbol palette selection.
- Future dark-mode support must be added as explicit render context with separate acceptance tests.

## 6. Generate/Seed Semantics

- `Generate` behavior:
  - If no icon exists yet: use current seed (or create one if empty).
  - If icon exists: create a new seed and regenerate (explicit “next idea” behavior).

- `Regenerate same` behavior (must exist as separate action):
  - regenerate using current seed exactly.

- `Randomize` behavior:
  - always sets new seed and regenerates.

UI must always display the active seed currently used for selected variant batch.

## 6.1 Seed Versioning & Reproducibility

Every seed mutation must be logged in-order.

Required seed history model:
- `seedHistory[]` entries:
  - `revision`: monotonic integer
  - `seed`: string
  - `reason`: `"initial" | "generate-next" | "randomize" | "manual-edit" | "regenerate-same"`
  - `timestamp`: ISO 8601

Rules:
- `Generate` after first result appends `generate-next`.
- `Regenerate same` appends `regenerate-same` with unchanged seed.
- Export payload must include current seed revision and full seed history for reproducibility.

## 6.2 Seed Identity Contract

Seed is first-class state and is independent from faction name.

Rules:
- Initial creation may derive seed from normalized `name + domain`.
- After creation, seed is persisted and does not change automatically on rename.
- Renaming faction metadata must not mutate seed.
- User can explicitly request new seed (`Generate next` / `Randomize`).
- User can explicitly set seed in advanced mode (copy/edit).

Normalization for initial derivation:
- lowercase
- trim outer whitespace
- collapse internal whitespace to single spaces
- remove punctuation except `-` and `_`

Collision handling:
- If deterministic hash collides for same workspace scope, append `-n` suffix and rehash.

## 6.3 Generation Interaction State Machine

Authoritative persisted state:
- `seed`: string
- `seedHistory[]`: list of revisions
- `domain`: enum

Derived/runtime UI state:
- `hasGenerated`: derived from `seedHistory.length > 0`
- `locked`: UI intent flag; not authoritative for seed history and not required in export payload

Actions:
- `Generate`
- `RegenerateSame`
- `Randomize`
- `ToggleLock`
- `ChangeDomain`
- `RenameFaction`

Transition table:

| Current | Action | Next | Effects |
|---|---|---|---|
| `hasGenerated=false, locked=false` | `Generate` | `hasGenerated=true` | if seed empty create seed; generate variants with current seed+domain |
| `hasGenerated=true, locked=false` | `Generate` | unchanged | create new seed; append seed history (`generate-next`); regenerate variants |
| `hasGenerated=true, locked=true` | `Generate` | unchanged | keep current seed; regenerate variants with same seed (`regenerate-same`) |
| any | `RegenerateSame` | unchanged | regenerate with current seed; append `regenerate-same` |
| any | `Randomize` | unchanged | force new seed; append `randomize`; regenerate variants |
| any | `ToggleLock` | lock flips | no generation side-effect |
| any | `ChangeDomain` | domain updates | always regenerate with current seed + new domain; do not mutate seed; `locked` has no effect on this action |
| any | `RenameFaction` | name updates | no seed mutation; no automatic regenerate |

Invariants:
- Domain changes do not alter seed.
- Rename does not alter seed.
- All generate paths are deterministic for same effective inputs.
- `seed` + `seedHistory` are authoritative; any derived flags must stay consistent with them.

## 7. Variant Semantics

- Variant grid and main preview must reflect the same composition mode by default.
- If composition is preview-only, UI must clearly label this and exports must match preview.
- Variant identity should include:
  - batch seed
  - variant index
  - composition revision id (if composition applied)

Composition revision requirements:
- Revision id is content-hash based (hash of normalized composition config).
- Revision changes only when composition config changes.
- Revision id is included in export metadata.

## 7.1 Domain Style Curation Contract

Domain-to-style curation must be data-driven, not hardcoded in component logic.

Required config file:
- `config/domain-style-curation.json` (or equivalent)

Required shape:
```json
{
  "version": 1,
  "domains": {
    "arcane": {
      "defaultStyles": ["shield", "mandala", "star", "rune", "circle", "glyph"],
      "fallbackStyle": "shield"
    }
  }
}
```

Rules:
- Exactly 6 default styles per domain for simplified mode.
- No duplicates in `defaultStyles`.
- Unknown/missing style entries fall back to `fallbackStyle`.
- `Show All` reveals full style registry but must not mutate curation config.
- Custom domain support must be possible through config extension without code edits.

## 8. Composition Boundary

- Composition algorithm should move to engine module (`compositionBuilder.ts`) and return deterministic layers from composition config.
- UI only edits composition config; it does not synthesize geometry logic inline.

Composition config minimum:
- enabled overlays
- blend mode
- filter preset + intensity
- optional per-layer overrides

## 8.2 Composition Ownership & Applicability

Composition is first-class persisted state, separate from variant selection.

Minimum structure:
```typescript
interface CompositionConfig {
  id: string;
  compositionVersion: number;
  mode: "overlay-center" | "impalement-horizontal" | "quartered";
  layers: CompositionLayer[];
  revisionId: string; // hash of normalized config
  appliedToVariants: string[] | "all";
  updatedAt: string; // ISO 8601
}
```

Semantics:
- Changing selected variant does not reset composition.
- Composition applies to preview and export consistently.
- `Add Layer` creates a new composition layer entry and bumps `revisionId`.
- Export captures composition as applied at export time.

## 8.1 Deterministic Composition Algorithms

The term "smart composition" is prohibited in implementation docs without algorithm binding.

Allowed layout modes:
- `overlay-center`
- `impalement-horizontal`
- `quartered`

Deterministic defaults:
- `overlay-center`
  - primary layer opacity `1.0`, scale `1.0`, centered
  - secondary layer opacity `0.6`, scale `0.75`, centered
- `impalement-horizontal`
  - left/right split at 50%
  - both layers opacity `1.0`, clipped to side
- `quartered`
  - 4 quadrants with deterministic seed suffixes `q1..q4`

Mode selection rules:
- If user explicitly chooses mode: use chosen mode.
- If auto mode:
  - two selected symbols from same faction => `overlay-center`
  - two selected symbols from different factions => `impalement-horizontal`
  - four selected symbols => `quartered`

Seeding rules:
- Composite seed = `hash(primarySeed + "|" + secondarySeed + "|" + mode + "|" + compositionVersion)`
- Layout randomness must derive only from composite seed.

## 9. Type Authority Rules

- `MainSymbolType` and related unions must exist in one canonical file only.
- Supporting modules import canonical types; no local duplicate type unions.
- Build should fail on duplicate conflicting symbol key maps.

## 10. Test Requirements

Minimum tests required before boundary work is considered complete:

Acceptance matrix (minimum):

| ID | Given | When | Then |
|---|---|---|---|
| C1 | owner=domain | SelectDomain(new) | channel updates to new domain palette, owner stays domain |
| C2 | owner=manual | SelectDomain(new) | channel unchanged, owner stays manual |
| C3 | owner=preset | SelectDomain(new) | channel unchanged, owner stays preset |
| C4 | owner=domain | SelectPreset(applyToAll=false) | channel updates to preset, owner=preset |
| C5 | owner=manual | SelectPreset(applyToAll=false) | channel unchanged, owner=manual |
| C6 | owner=manual | SelectPreset(applyToAll=true) | channel updates to preset, owner=preset |
| C7 | mixed owners | ResetToDomain | all channels domain palette, owners all domain |
| C8 | mixed owners | ResetToPreset | all channels preset palette, owners all preset |
| C9 | seed present, no prior result | Generate | uses current seed (or creates one if empty), history +1 |
| C10 | prior result exists | Generate | new seed generated, history reason=generate-next |
| C11 | prior result exists | Regenerate same | seed unchanged, history reason=regenerate-same |
| C12 | prior result exists | Randomize | new seed generated, history reason=randomize |
| C13 | selected variant + composition | Export SVG/PNG/JSON | exported payload matches displayed preview and composition |
| C14 | composition unchanged | regenerate/export | composition revision id unchanged |
| C15 | composition config edited | regenerate/export | composition revision id changes |
| C16 | symbol types registry | build/test | symbol union and path registry are in sync |
| C17 | faction renamed | RenameFaction | seed unchanged, output unchanged until explicit regenerate |
| C18 | locked=true | Generate | seed unchanged, history reason=regenerate-same |
| C19 | locked=false | Generate after existing | seed changes, history reason=generate-next |
| C20 | domain curation config | load defaults | exactly 6 unique styles per domain |
| C21 | same composition config | render twice | byte-stable composition revision id |
| C22 | same `{seed,domain,options,version}` | render/export | deterministic SVG/JSON payloads |
| C23 | import older JSON schema | import | either successful migration or explicit unsupported-version error |
| C24 | preset+manual mixed owners | SelectPreset(applyToAll=false) | manual channels remain unchanged |

Coverage policy:
- All C1-C24 must pass in CI before Phase C or D work begins.
- Any new color/composition action requires at least one new matrix row.

## 11. Migration Plan

Phase A: Boundary metadata
- Add color ownership metadata to config model.
- Add explicit actions for reset and regenerate-same.

Phase B: Authority centralization
- Move precedence logic from UI handlers into one reducer/service.

Phase C: Composition extraction
- Move composition generation out of `IconGenerator.tsx` into engine module.

Phase D: Generator unification
- Choose one active engine path; archive or adapt `src/lib/faction/generator.ts`.

## 11.1 Phase D Gates (Mandatory)

Do not switch active engine path until all gates pass:

1. Adapter contract
- Provide adapter interface from old generator call sites to new engine signatures.
- Keep old engine callable behind feature flag until cutover complete.

2. Feature parity checklist
- Domain palette parity
- Seed determinism parity
- Variant count/selection parity
- Export parity (SVG/PNG/JSON)
- Composition parity

3. Kill-switch
- Runtime flag to revert to old engine without deploy rollback.
- Rollback playbook documented and tested.

4. Validation window
- At least one release cycle with dual-run comparison in non-production or shadow mode.
- Diff threshold must be explicitly approved before hard cutover.

## 12. Non-Goals

- Adding new symbol styles.
- Styling/UI redesign.
- Performance micro-optimizations beyond current baseline.

## 14. Export/Import Contract (Normative)

All JSON exports must include schema version and be re-importable unless version explicitly unsupported.

Minimum export schema:
```json
{
  "schemaVersion": "1.0.0",
  "generatorVersion": "x.y.z",
  "faction": {
    "id": "uuid",
    "name": "The Crimson Covenant",
    "domain": "chaos"
  },
  "state": {
    "seed": "abc123",
    "seedRevision": 4,
    "seedHistory": [
      {
        "revision": 1,
        "seed": "abc123",
        "reason": "initial",
        "timestamp": "2026-03-10T12:00:00Z"
      }
    ],
    "ownerByChannel": {
      "primaryColor": "domain",
      "secondaryColor": "manual",
      "accentColor": "preset",
      "backgroundColor": "domain"
    },
    "colorPresetKey": "vivid"
  },
  "selection": {
    "variantIndex": 0,
    "style": "shield"
  },
  "composition": {
    "compositionVersion": 1,
    "mode": "overlay-center",
    "revisionId": "sha256:...",
    "layers": []
  },
  "artifacts": {
    "svg": "<svg .../>",
    "png": null
  }
}
```

Import rules:
- If `schemaVersion` major is supported: migrate forward to current runtime model.
- If unsupported major: fail with explicit error including supported versions.
- Import must preserve seed history and composition revision id.
- Legacy import handling:
  - if `seedHistory` missing and `seed` present: synthesize history entry `{ revision: 0, reason: "imported-legacy" }`
  - if both missing and faction name/domain present: derive initial seed once, mark reason `imported-derived`
  - if required identity fields missing: fail with explicit validation error

## 16. Validation Requirements

- `domain` is required.
- `seed` may be empty only before first generation.
- Color values must be valid hex when provided.
- `defaultStyles` per domain must contain exactly 6 unique styles.
- `composition.mode` must be one of allowed deterministic modes.
- `schemaVersion` must be present on export/import payloads.

## 15. Determinism Contract

For fixed:
- `seed`
- `domain`
- `variant style/index`
- `complexity`
- `composition config`
- `generatorVersion`

The generated:
- layer graph
- SVG output
- exported JSON fields (except wall-clock timestamps)

must be stable across repeated runs on the same version.

Version behavior:
- Any intentional visual output change must increment `generatorVersion`.
- Cross-version drift is allowed only with migration notes in changelog.

## 17. Acceptance Criteria

- No user-visible color “fighting” between domain, preset, and manual edits.
- All color changes are explainable by owner + precedence rules.
- Active seed is always visible and behavior is predictable.
- Single generation pipeline is documented and enforced.
- All required tests in Section 10 pass.
