# Phase 7: Donor UI Capture, Characterization, Rehost, and Conformance

Phase 7 establishes donor-ui conformance over canonical state and proves parity against donor-specific characterization baselines. Every donor UI is part of the contract. The UI above the canonical data layer must behave faithfully to the original donor app — only the data layer underneath it is shared.

## Dependencies

- Phase 4 complete
- Phase 6 complete
- canonical state bridge stable
- adapter snapshots stable

## Fixed donor methodologies

The initial donor classifications and characterization methodologies are resolved before implementation work starts. There are no execution-time classification branches for the initial set. Phase 9 expands this framework to the full donor inventory.

| Donor | Class | Characterization methodology |
|---|---|---|
| Mythforge | real app | behavioral capture — screenshots, DOM snapshots, route inventory, live interaction capture from the running app |
| Adventure Generator | fragment | intent reconstruction — infer behavior from surviving Next.js schemas, workflow stores, and adapter snapshot |
| Orbis | semantic-only | designed intent authoring — author a baseline consistent with simulation semantics from adapter snapshot and promoted schema |

Waivers for Adventure Generator (fragment) and Orbis (semantic-only) are pre-registered. They do not need to be re-litigated at gate time.

## Deliverables

### Routes
- `/donor/mythforge`
- `/donor/orbis`
- `/donor/adventure-generator`
- `/compare/donors`

### Commands
- `npm run test:characterize:mythforge`
- `npm run test:characterize:orbis`
- `npm run test:characterize:adventure`
- `npm run test:characterize`
- `npm run test:conformance:mythforge`
- `npm run test:conformance:orbis`
- `npm run test:conformance:adventure`
- `npm run test:conformance`

### Artifacts
- `world-model/tests/characterization/<donor>/captured/` — screenshots, DOM snapshots, accessibility trees, route metadata
- `world-model/tests/characterization/baselines.yaml`
- `world-model/tests/conformance/<donor>/`
- `world-model/tests/conformance/waivers.yaml`
- `world-model/docs/testing/DONOR_UI_AUDIT.md`
- `world-model/docs/testing/DONOR_CHARACTERIZATION_MATRIX.md`
- `world-model/docs/testing/DONOR_UI_CONFORMANCE_MATRIX.md`

### Harness
- `python world-model/scripts/run_harness.py --phase 7`

## Subphases

### 7.0 Donor UI Audit

Deliverables:

- inventory of each donor's real runnable entrypoints, route map, top-level layouts, modal systems, drawers, and primary workflows
- inventory of each donor's real test commands, classified as UI / backend / infrastructure
- pre-registered waivers for Adventure Generator (fragment) and Orbis (semantic-only) with justification
- `world-model/docs/testing/DONOR_UI_AUDIT.md`

Acceptance:

- all initial donors have a recorded methodology
- waivers are present before gate evaluation

### 7.1 Characterization — three tracks

Characterization runs on all initial donors before any rehost work starts. Conformance work cannot begin before characterization baselines are frozen.

#### Track A: Mythforge (behavioral capture)

- run the app from `mythforge/package.json`
- capture: route inventory, screen inventory, panel/layout structure, primary controls, modal/drawer flows, empty/loading/error/success states, keyboard/focus behavior, critical copy labels
- generate executable characterization tests from the running app
- store screenshots, DOM snapshots, accessibility trees, and route metadata under `world-model/tests/characterization/mythforge/captured/`

#### Track B: Adventure Generator (intent reconstruction)

- work from copied source in adapter snapshot, surviving Next.js schemas, workflow stores
- reconstruct: workflow step definitions, checkpoint sequences, progress/resume states, location/adventure linkage, generated-output shapes
- produce characterization tests derived from the source material without requiring the app to be runnable
- store inferred baselines and source-derived test fixtures under `world-model/tests/characterization/adventure-generator/captured/`

#### Track C: Orbis (designed intent authoring)

- work from adapter snapshot, promoted schema, simulation semantics
- author: domain toggle states, fidelity/profile controls, simulation snapshot inspection surface, event-stream inspection surface
- produce characterization tests that define the intended surface, not capture an existing one
- store authored baselines under `world-model/tests/characterization/orbis/captured/`

### 7.2 Characterization Matrix

Deliverables:

- `world-model/docs/testing/DONOR_CHARACTERIZATION_MATRIX.md`
- for each donor screen and flow: characterization source, parity target, rehost owner, whether exact or adapted parity is required, `basis` column (`captured` / `reconstructed` / `designed`)
- characterization coverage report per donor

Acceptance:

- every required donor screen has a baseline entry with a recorded `basis`
- no rehost work starts before the matrix row for that screen is frozen

### 7.3 UI Donation Contract

Deliverables:

- `world-model/docs/testing/DONOR_UI_CONFORMANCE_MATRIX.md`
- per donor screen: route, purpose, required panels, required controls, required visible states, required interaction order, required modal behavior, allowed substitutions, `basis` column

Allowed substitutions per donor screen:
- canonical data/store/backend replacement
- outer unified shell wrapper
- explicitly waived donor-only infrastructure

Not substitutable without a waiver:
- copy and label text
- interaction order
- layout grouping
- visible affordances
- modal sequence

### 7.4 Shared Rehost Runtime

Deliverables:

- `world-model/apps/unified-app/src/donors/mythforge/`
- `world-model/apps/unified-app/src/donors/orbis/`
- `world-model/apps/unified-app/src/donors/adventure-generator/`
- canonical facade adapters for: world/entity/history/projection/schema, simulation, workflow/checkpoint/progress
- reverse action translators so donor UI actions mutate canonical state
- donor workflow structure preserved; stores replaced, not user journeys

### 7.5 Mythforge Rehost

- rehost Mythforge under `/donor/mythforge` using behavioral capture baselines
- port portable Mythforge tests and bind them to the rehost
- add characterization-to-rehost parity checks for DOM, layout grouping, interactions, and critical copy

### 7.6 Adventure Generator Rehost

- rehost Adventure Generator under `/donor/adventure-generator` using intent-reconstructed baselines
- rehost flows: guided steps, checkpoints, progress/resume, generated-output inspection, location/adventure linkage
- bind against canonical `WorkflowAttachment` state

### 7.7 Orbis Rehost

- rehost Orbis under `/donor/orbis` using designed-intent baselines
- rehost flows: domain toggles, fidelity/profile controls, simulation snapshot inspection, event-stream inspection
- bind against canonical `SimulationAttachment` state

### 7.8 Cross-Donor Conformance

- add `/compare/donors` mounting the unified surface plus all donor rehosts
- for every shared canonical concept that appears in multiple donor UIs (e.g. biomes), prove the same bundle state projects into all donor views without data loss or misinterpretation
- prove donor-surface edits round-trip through canonical state and back into donor-shaped views
- prove no donor-local UI fields persist into canonical bundles
- add route-switch and context-retention tests among donor and unified surfaces

### 7.9 Conformance Harness

- conformance runs only after characterization baselines are frozen
- per donor: run donor tests, characterization suite, rehost parity suite
- report: donor tests passed, characterization coverage, exact parity passed, adapted parity passed, waived items with justification
- fail if: characterization coverage is incomplete for required screens, a portable donor test fails, an unwaived parity gap exists

### 7.10 Gate, CI, and Docs

- Phase 7 gate verifies: donor audit exists, characterization baselines exist for every donor, donor rehost routes exist, conformance matrix with `basis` column exists, waiver manifest exists, suites pass
- CI fan-out jobs per donor for both characterization and conformance
- update architecture docs to distinguish: unified public surface, donor-faithful rehost surfaces, prototype/internal surfaces, legacy redirects
- wire Phase 7 conformance suite into Phase 6 regression gates

## Gate rules

Phase 7 fails if any of the following are missing:

- `DONOR_UI_AUDIT.md` with pre-registered waivers
- `DONOR_CHARACTERIZATION_MATRIX.md` with `basis` column populated
- `DONOR_UI_CONFORMANCE_MATRIX.md` with `basis` column populated
- characterization baselines under `tests/characterization/<donor>/captured/`
- `tests/characterization/baselines.yaml`
- `tests/conformance/waivers.yaml`
- donor routes: `/donor/mythforge`, `/donor/orbis`, `/donor/adventure-generator`, `/compare/donors`
- characterization suite passes for all donors in scope for this phase
- conformance suite passes for all donors in scope for this phase

## Round-trip rule

For every shared canonical concept that appears in more than one donor surface, at least one test must prove the same canonical bundle state projects into all donor views without data loss, field misinterpretation, or donor-local persistence leakage.

## Phase 9 linkage

Phase 7 defines the initial conformance framework. Phase 9 extends this framework to the exhaustive donor inventory in `docs/donors/INDEX.md`.

## Failure Cases

- characterization starts after rehost work
- rehost UX deviates from donor baseline without a recorded waiver
- donor-local fields persist into canonical bundles
- round-trip test is missing for a shared concept (e.g. biomes)
- waivers are resolved at gate time rather than pre-registered
