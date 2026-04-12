# Donor UI Audit

Phase 9 treats donor UI as a first-class contract. The donor inventory is exhaustive and fixed to the donor index.

## Donor classes and methodologies

| Donor | Class | Methodology | Basis | Workspace evidence |
|---|---|---|---|---|
| Mythforge | app donor | behavioral capture | captured | `mythforge/` |
| Orbis | app donor | behavioral capture | captured | `to be merged/true orbis/Orbis Spec 2.0/` |
| Adventure Generator | app donor | behavioral capture | captured | `to be merged/dungeon generator/` |
| Mappa Imperium | app donor | behavioral capture | captured | `to be merged/mappa imperium/` |
| Dawn of Worlds | app donor | behavioral capture | captured | `to be merged/world-builder-ui/` |
| Faction Image | app donor | behavioral capture | captured | `to be merged/faction-image/` |
| Watabou City | clean-room app donor | clean-room app capture | clean-room implementation | `to be merged/watabou-city-clean-room/2nd/` |
| Encounter Balancer | scaffold-copy donor | representative baseline + clone-equivalence | reconstructed | `to be merged/apocalypse/`, `to be merged/character-creator/`, `to be merged/deity creator/`, `to be merged/genesis/` |

## Audit notes

- `mechanical-sycophant` is not a donor and is excluded from this inventory.
- app-donor parity is measured as exact or adapted parity against captured donor baselines.
- watabou-city parity is measured against the clean-room implementation in `2nd/`; encounter-balancer parity is measured against the representative scaffold baseline with explicit clone-equivalence evidence.

## Pre-registered waivers

Waivers are tracked in `world-model/tests/conformance/waivers.yaml` and must include one row per donor group.
