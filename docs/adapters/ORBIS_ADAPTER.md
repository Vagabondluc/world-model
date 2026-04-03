# Orbis Adapter

Orbis is the simulation donor. Its adapter contributes optional simulation depth to the final app.

## What Is Copied

Copy the Orbis material that defines:

- world profile
- enabled simulation domains
- fidelity levels
- simulation snapshots
- simulation events
- domain-specific config metadata

## What Is Not Copied

Do not copy Orbis UI assumptions that are tied to the donor shell, including:

- standalone simulation dashboards
- exploratory harness-only chrome
- unfinished product navigation
- placeholder panels that do not map to canonical contracts

## Canonical Mapping

The adapter maps Orbis concepts into:

- `SimulationAttachment`
- simulation-specific event payloads
- snapshot payloads
- domain-profile contracts

## Final App Role

In the final app, Orbis is an optional layer. It is visible when the current world uses simulation depth, but it does not own the core world model. The final app uses the copied adapter snapshot only as the source for simulation semantics.
