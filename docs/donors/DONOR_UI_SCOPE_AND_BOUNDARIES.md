# Donor UI Scope and Boundaries

This document defines the Phase 9 contract for donor UI rehosts in `world-model`.

The donor apps are not inspiration, references, or style guides. For UI and user-visible behavior, each donor is an oracle. `world-model` must use the donor to prove that its adapter can render the same UI and behavior while folding durable data into the canonical data layer.

## Core Contract

For every donor group in `docs/donors/INDEX.md`:

- the original donor UI is the source of truth for app donors
- the clean-room donor UI is the source of truth for `watabou-city`
- the representative scaffold UI is the source of truth for `encounter-balancer`
- `/donor/<id>` must render the donor-faithful UI, not a normalized product surface
- durable data changes must flow through canonical core records or donor attachments
- donor-local transient UI state must remain local and must not persist into canonical bundles

## Scope

This contract covers:

- route structure that is user-visible in the donor app
- panels, layout regions, dialogs, drawers, overlays, toolbars, modals, and visualizations
- labels, control copy, empty states, loading states, error states, and success states
- interaction order, keyboard behavior, focus behavior, and modal/drawer behavior
- donor workflow semantics and user journeys
- canonical projection from `world-model` state into donor-shaped view models
- action translation from donor UI events into canonical state
- round-trip propagation between donor surfaces when they represent the same canonical concept

This contract does not require:

- sharing donor component internals across donors
- forcing donors into the public `World / Story / Schema` product taxonomy
- preserving donor runtime backends or donor persistence layers
- persisting donor-local UI drafts, hover state, expanded panels, selected tabs inside modal tools, or temporary view options
- runtime imports from source donor repositories outside `world-model`

## Donor Role

Donors are verification sources.

They answer this question:

Can `world-model` render the same UI and behavior as the donor while using the `world-model` data layer underneath?

They do not answer this question:

What should the final unified product UI look like?

The unified product surface may learn from donors, but it cannot replace donor-faithful routes or count as donor exactness evidence.

## Data Boundary

The data boundary is strict.

| State | Owner | Persistence Rule |
|---|---|---|
| shared world/entity/schema/history/projection/location concepts | canonical core records | persists in canonical bundle |
| donor-specific domain state without settled convergence | donor attachment | persists in canonical bundle under donor-specific attachment |
| donor UI state such as modal open/close, draft fields before apply, hover state, panel expansion, transient filters | donor subapp local state | does not persist |
| source donor app backend state | source donor app only | does not persist in `world-model` |

If a donor action changes a concept that exists in canonical state, the action translator must write the canonical record. If the concept is donor-specific and not safely promotable, the action translator must write a donor attachment. If the value is only UI state, it must stay local.

## Projection Boundary

Each donor bridge has two directional responsibilities.

| Direction | Required Behavior |
|---|---|
| canonical to donor UI | project canonical core records and donor attachments into the donor-shaped view model expected by that donor UI |
| donor UI to canonical | translate donor UI actions into canonical core writes or donor attachment writes |

The projection must preserve donor vocabulary and interaction semantics at the UI boundary. The canonical layer may normalize data for storage, but the donor UI must still receive a donor-shaped model.

## Cross-Surface Propagation

Changes propagate only through canonical state.

Example:

- a user edits a shared world name in the Mythforge donor surface
- the Mythforge action translator writes the canonical `WorldRecord`
- another donor surface that projects `WorldRecord` should reflect the changed name using its own donor UI presentation

This propagation is required only when both surfaces represent the same canonical concept. It is not required for donor-local UI state or donor-specific fields that have no shared canonical mapping.

## UI Exactness Boundary

For app donors, exactness includes:

- visible route structure
- layout regions and visual hierarchy
- controls and labels
- modal and drawer order
- visualizations and nonblank rendered surfaces
- keyboard navigation and focus behavior
- primary workflow order
- error, empty, loading, and success states

Exactness does not mean the same implementation files must be imported from the source donor repo at runtime. The implementation must live under `world-model/apps/donors/<donor>/` and must be mounted from `world-model`.

## Donor Classes

| Donor Class | UI Source of Truth | Required Evidence |
|---|---|---|
| app donor | original runnable donor app | live donor characterization, vendored rehost, canonical bridge tests, behavior parity tests, Playwright donor-to-`world-model` E2E |
| clean-room app donor | clean-room implementation | clean-room characterization, vendored rehost, canonical bridge tests, behavior parity tests, Playwright E2E |
| scaffold-copy donor | representative scaffold plus clone-equivalence across copies | representative characterization, clone-equivalence tests, canonical bridge tests, scaffold parity tests |

Current Phase 9 donor classes are defined in `docs/donors/INDEX.md`.

## Route Boundary

`/donor/<id>` is a donor-faithful route.

It must not pass exactness by rendering:

- `SourceUiPreview`
- iframe-only donor previews
- external live donor routes
- generic scaffold cards
- normalized product pages
- `/compare/donors` comparison panels

`/compare/donors` is useful diagnostic and product work. It is not conformance evidence for donor exactness.

## Harness Evidence Boundary

The Phase 9 reports have distinct meanings.

| Report | Meaning |
|---|---|
| `phase-9-donor-completeness-report.json` | inventory coverage only |
| `phase-9-rehost-matrix-report.json` | progress matrix for source vendoring, route mounting, bridge wiring, parity certification, E2E, and exact mounting |
| `phase-9-exact-donor-ui-report.json` | hard exactness gate |
| `phase-9-donor-e2e-report.json` | browser-level donor-to-`world-model` parity evidence |

A green inventory report does not mean the donor UI is exact. A donor is complete only when the exactness report and required E2E evidence pass.

## Failure Conditions

The implementation is out of scope or invalid if:

- a donor UI is replaced by a generic normalized `world-model` page
- a donor route passes by displaying a scaffold placeholder
- a donor route depends on an external live donor server for exactness
- a donor source repo is imported at runtime from outside `world-model`
- a canonical bridge stores donor-local UI state in the canonical bundle
- a shared canonical concept is edited in one donor and cannot project into another relevant donor surface
- `mechanical-sycophant` appears as a Phase 9 donor

## Current Interpretation

The present Phase 9 direction is:

- use donor UIs as exact behavior oracles
- vendor donor UI implementations into `world-model/apps/donors/<donor>/`
- mount donor-faithful routes under `/donor/<id>`
- keep only durable domain data in canonical records or donor attachments
- use the rehost matrix and exactness gate to distinguish source-vendored, route-mounted, and exact-mounted work
