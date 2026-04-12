# Phase 9: Exhaustive Donor UI Representation and Canonical Data Folding

Phase 9 closes the donor completeness gap left by the three-donor implementation path. The objective is exhaustive donor representation in `world-model`: every donor group in the donor index must have a donor route, characterization baseline, conformance contract, exact UI implementation evidence, and canonical bridge evidence.

This phase does not normalize donor UI into a generic shell. Donor UI remains source truth. Only data and persistence are folded into canonical state.

The UI/data boundary for this phase is defined in `docs/donors/DONOR_UI_SCOPE_AND_BOUNDARIES.md`.

The Phase 9 inventory report (`phase-9-donor-completeness-report.json`) proves donor coverage only. It is not evidence that the donor UIs are vendored, mounted, canonical-bridged, or behavior-exact. Exactness is proven by `phase-9-exact-donor-ui-report.json`.

Phase 9 execution retries, atomic decomposition, and failure logging are tracked in `docs/roadmap/support/PHASE_9_EXECUTION_CHECKLIST.md`.

## Dependencies

- Phase 7 complete
- Phase 8 complete
- donor inventory frozen in `docs/donors/INDEX.md`
- no runtime imports from donor repos

## Donor set for this phase

- `mythforge`
- `orbis`
- `adventure-generator`
- `mappa-imperium`
- `dawn-of-worlds`
- `faction-image`
- `watabou-city`
- `encounter-balancer`

## Methodology classes

- app donor: exact donor behavior target on route structure, controls, interaction order, modal flow, keyboard/focus
- clean-room app donor: exact donor behavior target from the clean-room implementation
- scaffold-copy donor: parity to representative baseline plus clone-equivalence checks across all copies

## Deliverables

### Routes

- `/donor/mythforge`
- `/donor/orbis`
- `/donor/adventure-generator`
- `/donor/mappa-imperium`
- `/donor/dawn-of-worlds`
- `/donor/faction-image`
- `/donor/watabou-city`
- `/donor/encounter-balancer`
- `/compare/donors` includes all donor groups

### App/runtime

- donor registry expanded to all donor groups
- donor comparison and donor pages render all donor groups
- donor data bridges write to canonical core types or donor attachments only

### Docs

- `docs/testing/DONOR_UI_AUDIT.md` updated for all donor groups
- `docs/testing/DONOR_CHARACTERIZATION_MATRIX.md` updated for all donor groups
- `docs/testing/DONOR_UI_CONFORMANCE_MATRIX.md` updated for all donor groups
- `tests/characterization/baselines.yaml` updated for all donor groups
- `tests/conformance/waivers.yaml` updated for all donor groups as needed

### Harness

- `scripts/check_phase_9_exhaustive_donors.py`
- `scripts/check_phase_9_exact_donor_ui.py`
- `scripts/gates/phase_9_gate.py`
- `python world-model/scripts/run_harness.py --phase 9`

## Subphases

### 9.1 Donor model correction

- update roadmap references that still assume only three donors
- retire semantic-only Orbis treatment for Phase 9 and classify with app donor behavior target
- keep `mechanical-sycophant` out of donor artifacts

### 9.2 Exhaustive donor registry and routes

- expand donor enums and route registries to all donor groups
- ensure donor compare page is donor-keyed and not fixed-width three-column logic
- add donor smoke tests for all eight donor routes

### 9.3 Characterization expansion

- one characterization suite and captured baseline per donor group
- app donors: behavioral capture basis
- watabou-city: exact clean-room app rehost from `to be merged/watabou-city-clean-room/2nd/`
- encounter-balancer: representative baseline plus clone-equivalence checks for all four roots

### 9.4 Conformance expansion

- one conformance suite per donor group
- app donors must pass exact or explicitly adapted parity checks
- fragment/scaffold donors must pass baseline parity checks with explicit waivers

### 9.5 Exact donor UI implementation checks

- app donors must have vendored runtimes under `world-model/apps/donors/<donor>/`
- app-donor routes must mount vendored same-origin runtimes, not `SourceUiPreview`, `sourceUiUrl`, iframe-only routes, or source-baseline cards
- exactness report must fail until app-donor implementation status is `exact-vendored`
- `watabou-city` must use the clean-room implementation, not the GPL/reference tree, and must fail exactness until the clean-room app is vendored and mounted
- `encounter-balancer` must use one representative scaffold UI plus clone-equivalence checks across the four physical roots

### 9.6 Canonical data folding checks

- projector/action-translator tests per donor bridge
- round-trip tests show donor writes persist only to canonical core types or donor attachments
- donor-local transient UI state never persists

### 9.7 Cross-donor integration updates

- shared concept families stay explicit:
- biome/location
- entities
- workflows
- simulation-events
- projections
- attachments
- at least one explicit multi-lens round-trip test for each family represented by multiple donors

## Gate rules

Phase 9 fails if any of the following are missing or failing:

- donor registry does not contain all donor groups from donor index
- `/compare/donors` does not render all donor groups
- characterization baselines manifest is incomplete
- conformance tests or scripts are incomplete for any donor group
- waivers are missing for non-exact parity surfaces
- inventory checker fails
- exact donor-ui checker fails
- app-donor conformance accepts `source baseline`, `SourceUiPreview`, `sourceUiUrl`, iframe-only routes, or live-source UI evidence as parity

## Failure Cases

- donor inventory in docs and donor routes diverge
- donor UI behavior replaced by generic normalized UI
- donor UI behavior replaced by source-baseline placeholder panels
- app-donor route relies on an external live source app instead of a vendored same-origin donor runtime
- canonical projector or action translator is missing for any donor
- donor-local transient fields leak into canonical persistence
- any donor group exists in docs but has no characterization/conformance surface
