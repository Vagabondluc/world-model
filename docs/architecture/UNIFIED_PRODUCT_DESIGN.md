# Unified Product Design

Phase 8 turns the donor-faithful rehosts from Phase 7 into a coherent product surface. The product is not a new donor rewrite. It is a unified navigation and presentation layer over one canonical bundle.

## Product surfaces

- `/`
  - canonical-bundle-aware landing page
  - chooses a relevant product continuation from the current bundle state
- `/world`
  - spatial and location-first public surface
- `/story`
  - narrative and workflow-first public surface
- `/schema`
  - contract, adapter, migration, and provenance public surface

## Donor-faithful surfaces

**Phase 1 (registered donors):**
- `/donor/mythforge`
- `/donor/orbis`
- `/donor/adventure-generator`

**Phase 2 (unregistered donors, pending registration):**
- `/donor/mappa-imperium`
- `/donor/dawn-of-worlds`
- `/donor/faction-image`

**Shared:**
- `/compare/donors`

These surfaces preserve donor language, layout priorities, visible affordances, and interaction order. Their only architectural substitution is the data layer: they project canonical bundle state through explicit facades.

## Code-side boundary

The code-side product/donor boundary lives in:

- [`apps/unified-app/src/product/surface-contract.ts`](../../apps/unified-app/src/product/surface-contract.ts)

That file defines:

- the public product surfaces
- the donor lens vocabulary
- the shared canonical concept families
- the cross-donor journey set
- the projection helpers used by the product landing and compare pages

## Boundary rules

- Product surfaces use product language.
- Donor surfaces use donor language.
- Shared concept lens switching is read-only.
- Lens changes must not mutate canonical state.
- Donor-local UI fields are excluded by the Phase 7 waiver manifest and are never treated as canonical data.

## Shared concepts

The Phase 8 shared concept families are:

- biome/location
- entities
- workflows
- simulation events
- projections
- attachments

Each family can be projected through more than one donor lens, but the canonical bundle remains the only durable source of truth.

## Route flow

The product landing page can suggest the most relevant continuation from canonical bundle state, but it must not depend on a hidden recency store or any other separate user-preference persistence layer.

## Acceptance rule

If a route, panel, or view uses product language, it belongs to the unified product surface. If it preserves donor language and donor interaction order, it belongs to a donor-faithful surface.
