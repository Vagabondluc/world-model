# Donor UI Conformance Matrix

Every row records the basis for the requirement:

- `captured`: observed from a runnable donor app
- `reconstructed`: inferred from surviving donor fragments
- `designed`: authored from donor semantics because no donor UI exists to capture

| Donor | Basis | Route | Surface purpose | Required panels | Required controls | Visible states | Interaction order | Allowed substitutions |
|---|---|---|---|---|---|---|---|---|
| Mythforge | captured | `/donor/mythforge` | donor-faithful world authoring | top nav, explorer, workspace | New World, New Entity, Save Canonical, Grid, Graph | no entity, selected entity, saved/dirty shell state | explorer selection drives workspace detail | canonical data/store replacement; outer unified shell |
| Adventure Generator | reconstructed | `/donor/adventure-generator` | guided workflow progression | workflow registry, guided steps, checkpoints, generated outputs | Create linked entity, Start generator | no workflow, active workflow, resumed checkpoint state | workflow registry -> step state -> checkpoint/output review | canonical workflow backing; outer unified shell; residue-derived layout interpretation |
| Orbis | designed | `/donor/orbis` | simulation review surface | simulation profile, domains, snapshots, event stream | Inspect import, View migration | no simulation attachment, active profile, available snapshots | profile review -> domains -> snapshots -> event stream | canonical simulation backing; outer unified shell |

## Cross-Donor Round-Trip Requirement

For any canonical concept that appears in more than one donor surface, at least one round-trip test must prove:

1. the same canonical bundle projects into all donor views,
2. each donor view presents the concept without data loss,
3. edits round-trip back into canonical state without donor-local leakage.

The biome/location family is the reference stress case for this rule.
