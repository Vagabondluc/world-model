# Cross-Donor Integration Matrix

This matrix records the canonical concepts that must project cleanly through multiple donor lenses in Phase 8. The `basis` column is required because every rule must declare whether it was captured from a runnable donor app, reconstructed from surviving donor fragments, or designed intentionally for a semantic-only donor.

| Family | Basis | Canonical key | Default lens | Product surfaces | Donor surfaces | Round-trip rule |
|---|---|---|---|---|---|---|
| biome-location | captured | `entity:harbor-biome` | Mythforge | `/world`, `/schema`, `/compare` | Mythforge, Adventure Generator, Orbis | Switching lenses does not mutate canonical state |
| entities | captured | `entity:harbor-warden` | Mythforge | `/world`, `/story`, `/schema` | Mythforge, Adventure Generator, Orbis | Entity cards and projections stay in sync |
| workflows | reconstructed | `workflow:sample-adventure` | Adventure Generator | `/story`, `/compare` | Adventure Generator, Mythforge, Orbis | Workflow checkpoints and progress remain canonical |
| simulation-events | designed | `event:session-advanced` | Orbis | `/schema`, `/compare` | Orbis, Mythforge, Adventure Generator | Event review does not rewrite event history |
| projections | designed | `projection:harbor-warden` | Orbis | `/schema`, `/compare` | Orbis, Mythforge, Adventure Generator | Projection display stays tied to source events |
| attachments | captured | `world:sample` | Mythforge | `/world`, `/story`, `/schema` | Mythforge, Adventure Generator, Orbis | Attachments can be inspected in-place without writing |

## Lens-switch smoke requirement

Each shared concept family must have at least one explicit smoke test that switches lenses in-place. The smoke test must prove:

- the visible lens label changes
- the canonical key stays the same
- the underlying bundle remains unchanged
- no route reload is required to switch lenses

## Donor-local field rule

Donor-local fields are whatever the Phase 7 waiver manifest explicitly excludes from canonical persistence. The integration tests must reference that waiver set as the exclusion list when they assert that no donor-local field leaks into the canonical bundle.
