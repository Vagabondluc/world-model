# Release Criteria

The final app can be released only when the following are true:

## Canonical Model

- `world-model` defines the canonical records and attachments
- promoted schema contracts are emitted and versioned
- append-only history and projection behavior are stable

## Adapter Layer

- donor repos are no longer runtime dependencies
- copied adapter snapshots exist for each donor
- each adapter has passing tests
- migrations are reproducible

## Final App

- guided, studio, and architect modes all work
- save/load round-trip through canonical bundles
- mode switching preserves canonical state
- no direct donor import remains in the app runtime path

## Quality Gates

- unit tests pass
- adapter tests pass
- migration tests pass
- integration tests pass
- browser E2E passes
- no open architecture decision remains unresolved for the release scope

## Exclusions

The release does not require:

- re-implementing donor apps
- perfect feature parity with donor UIs
- moving all donor code into the final app

The release does require:

- one coherent product surface
- one canonical world model
- one adapter path per donor
