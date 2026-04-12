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

**Resolved:**
- core ownership is resolved and explicit (Mythforge)
- simulation ownership is resolved and explicit (Orbis)
- workflow ownership is resolved and explicit (Adventure Generator)
- location remains a split concept because Adventure contributes linkage semantics while Mythforge owns identity and spatial attachment
- BiomeType: AG/MI 17-value lowercase wins; Orbis maps to SimulationDomainBiome
- HexCoordinate: 3-axis cube {q,r,s} canonical; DoW adapts from offset {q,r}
- DiscoveryStatus: AG/MI vocabulary wins
- LayerType: AG superset is canonical (6 values including feywild/shadowfell/elemental)

**Open conflicts (ADR required before promotion):**
- `WorldKind` vs `EntityType`: DoW contributes 22-value taxonomy. How does it relate to Mythforge base `EntityRecord.entityType`? Mutual exclusivity? Orthogonal? Refinement?
- `Age` vs `EraName`: DoW uses ordinal turn eras (1|2|3); Mappa Imperium uses named narrative eras (6 epochs). Are these the same temporal model or complementary? How do they interoperate?
- `MapSize` casing: DoW uses SCREAMING_SNAKE (SMALL|STANDARD|GRAND); Mappa Imperium uses lowercase. Convention conflict unresolved.
- `CollaborativeSession` merge: Mappa Imperium and DoW both define multiplayer session structures. Require merge ADR to unify or keep separate.

The comparison docs remain in this workspace as source-analysis references. They are no longer the final truth surface. The promotion report and promoted schema contracts are the canonical output of donor schema assembly.
