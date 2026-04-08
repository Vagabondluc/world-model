# Donor Characterization Matrix

Every donor uses a resolved characterization methodology. There are no runtime branches in this phase.

| Donor | Class | Methodology | Basis | Source | Baseline artifact root | Gate meaning |
|---|---|---|---|---|---|---|
| Mythforge | app donor | behavioral capture | captured | live donor source and tests | `world-model/tests/characterization/mythforge/captured/` | Coverage means captured donor routes, panels, controls, and states exist. |
| Adventure Generator | fragment donor | intent reconstruction | reconstructed | surviving app residue plus workflow semantics | `world-model/tests/characterization/adventure-generator/captured/` | Coverage means the reconstructed workflow baseline is complete enough to drive rehost parity. |
| Orbis | semantic-only donor | designed intent authoring | designed | adapter snapshot plus simulation semantics | `world-model/tests/characterization/orbis/captured/` | Coverage means the designed simulation baseline is explicit, frozen, and testable. |

## Mythforge characterization

Required captured artifacts:

- route inventory
- panel inventory
- primary controls
- empty/loading/error states
- keyboard and modal behavior

## Adventure Generator characterization

Required reconstructed artifacts:

- workflow definitions
- step sequences
- checkpoint semantics
- generated-output visibility rules
- location/adventure linkage expectations

## Orbis characterization

Required designed artifacts:

- simulation profile surface
- enabled-domain toggle surface
- snapshot inspection surface
- event-stream inspection surface
- designed control and state model for simulation review
