# Donor UI Conformance Matrix

Every row includes a `Basis` field:

- `captured`: observed from runnable donor UI behavior
- `reconstructed`: frozen from reference/scaffold source material

| Donor | Basis | Route | Surface purpose | Required panels | Required controls | Visible states | Interaction order | Allowed substitutions |
|---|---|---|---|---|---|---|---|---|
| Mythforge | captured | `/donor/mythforge` | world authoring | top nav, explorer, workspace | New World, New Entity, Save | empty/active/saved | explorer -> workspace | canonical data/store replacement; outer shell |
| Orbis | captured | `/donor/orbis` | simulation review | profile, domains, snapshots, event stream | domain toggles, run simulation, inspect snapshot | empty/active/history | profile -> domains -> snapshots -> events | canonical data/store replacement; outer shell |
| Adventure Generator | captured | `/donor/adventure-generator` | guided workflow | workflow registry, steps, checkpoints, outputs | create link, start, resume | empty/active/resumed | registry -> steps -> outputs | canonical data/store replacement; outer shell |
| Mappa Imperium | captured | `/donor/mappa-imperium` | era/territory session | era timeline, territory map, session controls | create territory, advance era | empty/active era | era -> territory -> session | canonical data/store replacement; outer shell |
| Dawn of Worlds | captured | `/donor/dawn-of-worlds` | turn-based worldbuilding | world kind, turn controls, multiplayer session | start turn, apply world command | no turn/active turn | world kind -> turn -> multiplayer | canonical data/store replacement; outer shell |
| Faction Image | captured | `/donor/faction-image` | sigil generation | layer stack, icon discovery, variant preview | add layer, search icon, export | empty/active variant | layer -> icon -> variant | canonical data/store replacement; outer shell |
| Watabou City | clean-room implementation | `/donor/watabou-city` | clean-room city app | city layout, seed controls, render options | regenerate, adjust seed, export | no seed/generated | seed -> generate -> export | no GPL/reference substitution; use clean-room source |
| Encounter Balancer | reconstructed | `/donor/encounter-balancer` | encounter scaffold baseline | balancer tab, environmental tab | adjust difficulty, set environment | empty/configured | balancer -> environment -> preview | representative baseline + clone-equivalence |

## Shared concept families

Shared canonical concept families in scope:

- biome-location
- entities
- workflows
- simulation-events
- projections
- attachments

For each family above, at least one round-trip test must prove:

1. the same canonical bundle projects into every relevant donor surface,
2. donor-specific presentation differences do not corrupt canonical state,
3. donor-local UI-only fields do not persist.
