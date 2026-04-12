# Donor Characterization Matrix

Every donor has a frozen characterization baseline before conformance runs.

| Donor | Class | Methodology | Basis | Source | Baseline artifact root | Parity target |
|---|---|---|---|---|---|---|
| Mythforge | app donor | behavioral capture | captured | runnable donor app | `world-model/tests/characterization/mythforge/captured/` | exact + adapted |
| Orbis | app donor | behavioral capture | captured | runnable donor source root | `world-model/tests/characterization/orbis/captured/` | exact + adapted |
| Adventure Generator | app donor | behavioral capture | captured | runnable donor source root | `world-model/tests/characterization/adventure-generator/captured/` | exact + adapted |
| Mappa Imperium | app donor | behavioral capture | captured | runnable donor source root | `world-model/tests/characterization/mappa-imperium/captured/` | exact + adapted |
| Dawn of Worlds | app donor | behavioral capture | captured | runnable donor source root | `world-model/tests/characterization/dawn-of-worlds/captured/` | exact + adapted |
| Faction Image | app donor | behavioral capture | captured | runnable donor source root | `world-model/tests/characterization/faction-image/captured/` | exact + adapted |
| Watabou City | clean-room app donor | clean-room app capture | clean-room implementation | clean-room app source | `world-model/tests/characterization/watabou-city/captured/` | exact clean-room rehost |
| Encounter Balancer | scaffold-copy donor | representative baseline + clone-equivalence | reconstructed | scaffold-copy roots | `world-model/tests/characterization/encounter-balancer/captured/` | adapted + waived |

## Coverage rule

Characterization coverage is complete only when route map, panel inventory, controls, and visible states are present for each donor row above.
