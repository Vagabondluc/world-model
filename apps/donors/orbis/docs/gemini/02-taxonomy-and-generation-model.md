# Taxonomy and Generation Model

## Intent
Translate the gazetteer into a reusable generation taxonomy for content pipelines.

## Canonical Entity Types
Each generated biome instance should emit structured fields:
- `zoneId`
- `planeId`
- `strataId`
- `concept`
- `ecologicalDynamics`
- `hazards[]`
- `inhabitants[]`
- `resources[]`
- `tropes[]`
- `twists[]` (optional)

## Suggested IDs

Zones:
- `ZONE_I_TROPICAL_RAINFOREST`
- `ZONE_II_SUBTROPICAL_DESERT`
- `ZONE_III_TEMPERATE_SEASONAL`
- `ZONE_IV_TUNDRA_ICE_CAP`

Planes:
- `MATERIAL`
- `FEYWILD`
- `SHADOWFELL`

Strata:
- `AERO`
- `TERRA`
- `LITHO`
- `ABYSSAL`

## Generation Pipeline
1. Select climate zone from macro-world climate authority.
2. Select plane/realm law set.
3. Select stratum.
4. Resolve biome concept template.
5. Sample hazards/resources/inhabitants by weighted tags.
6. Attach encounter hooks and survival checks.

## Constraint Rules
- Hazard logic must match both ecology and spirit law.
- Resource placement should reflect local dynamics, not random rarity rolls.
- Inhabitants must be ecologically or metaphysically justified.
- Strata transitions should alter traversal, visibility, and pressure/atmosphere rules.

## Recommended Serialization Shape

```ts
type BiomeCell = {
  zoneId: string;
  planeId: "MATERIAL" | "FEYWILD" | "SHADOWFELL";
  strataId: "AERO" | "TERRA" | "LITHO" | "ABYSSAL";
  concept: string;
  ecologicalDynamics: string;
  hazards: string[];
  inhabitants: string[];
  resources: string[];
  tropes: string[];
  twists?: string[];
};
```
