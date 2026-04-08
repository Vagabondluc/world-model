# Phase 8: Unified Product Surface and Cross-Donor Integration

Phase 8 builds the coherent product experience that sits above the three donor-faithful surfaces. After Phase 7, the product is three proven donor rehosts sharing a canonical data layer. Phase 8 is what makes that product feel like one thing: a unified application whose power comes from all three donors contributing to every view.

The public navigation (`World`, `Story`, `Schema`) gets intentional, designed implementations informed by what Phase 7 proved about how each donor addresses those concepts. Cross-donor flows become first-class features, not accidental consequences of mounting three apps in the same shell.

## Dependencies

- Phase 7 complete
- all three donor surfaces live and conformance-passing
- canonical round-trip tests passing for all shared concepts
- `/compare/donors` route live

## The core invariant

Each donor surface behaves like its donor app. The unified product surface behaves like a product that could only exist because all three donors share one data layer. These are two different things. Phase 8 builds the second.

## Deliverables

### Routes
- `/world` — intentional, designed, not a Phase 3 stub
- `/story` — intentional, designed
- `/schema` — intentional, designed
- `/` — unified entry point that reads the current canonical bundle and opens the appropriate product landing surface without depending on recency/session history

### Commands
- `npm run test:integration` — cross-donor integration suite
- `npm run test:integration:round-trip` — shared-concept round-trip suite

### Artifacts
- `world-model/docs/architecture/UNIFIED_PRODUCT_DESIGN.md`
- `world-model/docs/testing/CROSS_DONOR_INTEGRATION_MATRIX.md`
- `world-model/apps/unified-app/src/product/surface-contract.ts`
- `world-model/tests/integration/<scenario>/`

### Harness
- `python world-model/scripts/check_phase_8_integration.py`
- `python world-model/scripts/run_harness.py --phase 8`

## Subphases

### 8.1 Unified navigation design

Deliverables:

- design the top-level navigation with intent, not as a Phase 3 stub
- `World`, `Story`, and `Schema` entries defined with explicit purpose, scope, and the donor concepts they surface
- entry-point routing logic that reads the canonical bundle and chooses the most relevant landing surface without relying on separate recency/session history
- navigation does not pick a single donor's UX; it is a new surface that draws from all three

Acceptance:

- each nav entry has a documented purpose grounded in canonical concepts, not inherited from one donor
- a new user landing on `/world` can reach Mythforge, Adventure Generator, and Orbis perspectives on the same canonical record

### 8.2 Shared canonical concept views

Some canonical concepts appear in all three donor surfaces with different visual treatments. Phase 8 makes these explicit.

Deliverables:

- for the explicit shared canonical concept families covered by this phase:
  - biome/location
  - entities
  - workflows
  - simulation events
  - projections
  - attachments
  - a unified canonical view that shows the same record through all donor lenses simultaneously, or with explicit donor-lens switching
  - proof that switching donor lens on a record does not mutate canonical state
- `world-model/docs/testing/CROSS_DONOR_INTEGRATION_MATRIX.md` — records which concepts have multi-donor views, which lens is default, and what switching costs

Acceptance:

- a biome/location record can be inspected as a Mythforge spatial object, an Adventure Generator environment filter, and an Orbis simulation parameter from a single canonical entity page
- switching lens does not produce a write to canonical state

### 8.3 Cross-donor transition flows

Phase 7 proved each surface works in isolation. Phase 8 proves they work as a system.

Deliverables:

- at least two explicitly designed cross-donor user journeys, e.g.:
  - author a world in Mythforge surface → attach adventure workflow in Adventure Generator surface → simulate in Orbis surface → return to Mythforge surface and inspect the simulation result
  - create a region with biomes in Mythforge surface → build a location-linked adventure in Adventure Generator surface → verify the region and biome appear correctly in Orbis simulation profile
- executable integration tests for each journey that span donor surface boundaries
- test that context (selected world, selected entity) is preserved across donor surface transitions
- a dedicated lens-switch smoke test that verifies a shared canonical concept can switch donor lenses in-place without a data write or route reload

Acceptance:

- cross-donor journeys complete without losing canonical state
- no donor-local field survives a cross-donor transition into the next surface's state
- context retention tests pass

### 8.4 Product identity pass

Deliverables:

- unified shell copy: navigation labels, empty states, loading states, error messages use product language, not donor-specific language
- the product reads as one coherent application, not three apps mounted in a frame
- document which surfaces are donor-faithful (preserve donor language) and which are unified-product (use product language)
- `world-model/docs/architecture/UNIFIED_PRODUCT_DESIGN.md` — the definitive record of the intended product identity, surface ownership, and language policy
- `world-model/apps/unified-app/src/product/surface-contract.ts` — the code-side boundary that encodes the product surfaces and shared concept families

Acceptance:

- donor surfaces use donor language (part of their fidelity contract)
- unified product surfaces use product language
- the boundary between the two is explicit and machine-checkable where possible

### 8.5 Integration conformance gates

Deliverables:

- integration test suite covering all cross-donor journeys from 8.3
- round-trip tests for every shared concept from 8.2
- no canonical state leak between donor surfaces
- context-retention tests for all donor surface transitions
- lens-switch smoke test for the shared concept panel
- performance baseline for cross-donor navigation recorded as SPA route/context smoke coverage; if timing thresholds are unstable they are documented, not gate-blocking
- wire integration suite into Phase 6 regression gates

Acceptance:

- integration suite passes
- no cross-donor canonical state corruption
- context is retained across all donor surface transitions
- integration suite is part of the regression harness

### 8.6 Architecture documentation update

Deliverables:

- update `world-model/docs/architecture/FINAL_APP_ARCHITECTURE.md` to reflect the full product shape:
  - unified product surfaces (`/world`, `/story`, `/schema`) — intentionally designed, not stubs
  - unified landing surface (`/`) — canonical-bundle-aware entry point
  - donor-faithful rehost surfaces (`/donor/*`) — behavioral contracts from Phase 7
  - cross-donor views — shared canonical concept surfaces from 8.2
  - cross-donor flows — user journeys from 8.3
  - prototype/internal surfaces
  - legacy redirects
- update `world-model/docs/architecture/REPOSITORY_LAYOUT.md` to reflect Phase 7 and Phase 8 additions

Acceptance:

- the architecture document accurately describes the full deployed product
- no surface is undocumented or misclassified

## Gate rules

Phase 8 fails if any of the following are missing or failing:

- unified navigation entries have documented purpose grounded in canonical concepts
- at least two cross-donor journeys are defined, tested, and passing
- the explicit shared canonical concept families have multi-donor views documented in `CROSS_DONOR_INTEGRATION_MATRIX.md`
- `UNIFIED_PRODUCT_DESIGN.md` exists and draws the product/donor language boundary
- `surface-contract.ts` exists and encodes the code-side boundary
- integration suite passes
- integration suite is wired into the regression harness

## Failure Cases

- `/world`, `/story`, `/schema` remain Phase 3 stubs without intentional design
- `/` behaves like a recency-based router instead of a canonical-bundle-aware landing surface
- cross-donor transitions lose canonical state or context
- donor language bleeds into unified product surfaces without documentation
- a shared canonical concept family (e.g. biome/location) has no multi-donor view
- integration suite is not part of regression gates
- the architecture documentation still describes Phase 3's interaction model
