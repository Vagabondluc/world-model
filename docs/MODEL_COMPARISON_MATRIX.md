# Model Comparison Matrix

Source-analysis document only. Final canonical promotion output now lives under `contracts/promoted-schema/`.

This matrix compares the donor models in discovery order:

**Phase 1 (original 3 donors):**
- Mythforge
- Orbis
- Adventure Generator

**Phase 2 (unregistered donors discovered April 2026):**
- Mappa Imperium
- Dawn of Worlds
- Sacred Sigil Generator (Faction-Image)

Note: The winner rules below remain from the Phase 1 analysis. Phase 2 donors contribute specialized lanes (world-era, world-taxonomy, asset-sigil) without challenging the core ownership model.

## Winner Rule

There is no shared trunk ownership.

- Mythforge wins trunk ownership.
- Orbis wins simulation attachment concepts.
- Adventure Generator wins workflow attachment concepts.

## Matrix

| Dimension | Mythforge | Orbis | Adventure Generator | Winner | Reason |
| --- | --- | --- | --- | --- | --- |
| Identity model | Explicit UUID container identity for durable world objects | Strong world/runtime profile concepts but weaker entity identity emphasis | Guided-flow and session state dominate identity | Mythforge | The trunk needs durable identity before simulation or wizard flow state |
| State model | Schema binding plus projection over event history | Deterministic runtime state and snapshots | Mutable guided workflow state | Mythforge | Canonical state must outlive one flow and one simulation slice |
| History/event model | Append-only event thinking is explicit in the architecture docs | Strong trace metadata and simulation event envelopes | Checkpoint history exists, but not as the canonical truth surface | Mythforge | Append-only history is the chosen platform rule |
| Schema model | Strong external schema binding model | Domain contracts exist, but not as trunk schema binding | Strong schema usage in generation, but not as canonical binding | Mythforge | External schema binding matches the planned platform structure |
| Workflow model | Present, but not the strongest donor for guided progression | Runtime-oriented tasks rather than user-facing flow | Strong steps, checkpoints, progress, resumability | Adventure Generator | Guided workflow state is its strongest reusable contribution |
| Simulation model | Not the strongest source | Strongest source for profiles, domains, fidelity, snapshots, and diagnostics | Limited simulation depth | Orbis | Simulation remains an optional attachment, not the trunk |
| Spatial model | Locations can be treated as entities with spatial attachment | Spatial state mostly exists in service of simulation | Strong map-facing UX and location stores | Mythforge | Spatial truth should attach to entities rather than replace them |
| Asset model | Asset attachment aligns with canonical identity ownership | Not a strong asset donor | Assets often appear as generated outputs or UI data | Mythforge | Assets need stable ownership under world/entity identity |
| Persistence assumptions | Durable world memory and eventful entity state | Runtime/snapshot persistence emphasis | Flow/session persistence emphasis | Mythforge | The canonical core is a world database engine first |
| UI assumptions | Can support deep advanced authoring | Expert simulation/diagnostic surfaces | Strong beginner-guided surfaces | Split | UI is not owned by `world-model`; only the domain contracts are |

## Strengths

### Mythforge

- strongest trunk for identity
- strongest schema binding direction
- strongest append-only history thesis
- strongest projection-based state model

### Orbis

- strongest optional simulation domain model
- strongest runtime trace and snapshot thinking
- strongest deterministic attachment concepts

### Adventure Generator

- strongest guided workflow model
- strongest checkpoint/progress/resume concepts
- strongest user-facing step breakdowns

## Irreducible Weaknesses

### Mythforge

- donor implementation is still evolving
- runtime entity store is behind the architecture docs

### Orbis

- not MVP-ready as a whole system
- too easy to over-promote into product architecture

### Adventure Generator

- not MVP-ready as a whole system
- workflow strength should not be confused with trunk ownership

## Selection Outcome

The canonical model is not negotiated across all donors equally.

- Mythforge concepts become the trunk model.
- Orbis concepts become optional simulation attachments.
- Adventure Generator concepts become optional workflow attachments.
