# Adapter Copy Policy

The final app is built from copied donor material, not from live donor imports.

## Policy

For each donor source:

1. identify the minimal useful source files
2. copy them into `adapters/<donor>/source-snapshot`
3. describe the copy in `adapters/<donor>/manifest.toml`
4. map the copied material into canonical `world-model` concepts
5. test the copied snapshot locally

## Allowed Inputs

Copyable material includes:

- schema templates
- workflow definitions
- model and domain code
- fixtures
- docs that describe durable behavior
- helper code needed to execute the copied adapter snapshot

## Excluded Inputs

Do not copy:

- build artifacts
- caches
- generated logs
- `node_modules`
- `dist`
- temporary working directories
- donor-specific deployment secrets
- donor UI assets that are only relevant to the donor shell

## Provenance Rules

Every copied file must be traceable back to:

- donor name
- original path
- copy date
- adapter manifest entry

## Maintenance Rule

The copied snapshot is frozen unless:

- the manifest is updated intentionally
- the copy is refreshed from the donor source
- the test matrix is updated to match the new snapshot

## Runtime Rule

The final app must not reach into donor repos at runtime. If the app needs donor behavior, it must use the copied snapshot under `adapters/<donor>/source-snapshot` and the canonical `world-model` contracts.
