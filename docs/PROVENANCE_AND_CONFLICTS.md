# Provenance And Conflicts

Every promoted concept in `contracts/promoted-schema/spec-promotion-report.json` records:

- donor
- source file path
- source concept name
- promotion class
- alias history

Alias normalization groups:

- `world` <- `container`, `root-world`
- `entity` <- `node`, `object`
- `location` <- `region`, `site`
- `workflow` <- `activity`, `session-flow`
- `simulation-profile` <- `domain-config`, `world-profile`

Current conflict posture:

- core ownership is resolved and explicit
- simulation ownership is resolved and explicit
- workflow ownership is resolved and explicit
- location remains a split concept because Adventure contributes linkage semantics while Mythforge owns identity and spatial attachment

The comparison docs remain in this workspace as source-analysis references. They are no longer the final truth surface. The promotion report and promoted schema contracts are the canonical output of donor schema assembly.
