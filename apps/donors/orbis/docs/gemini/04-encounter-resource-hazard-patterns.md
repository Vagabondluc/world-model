# Encounter, Resource, and Hazard Patterns

## Intent
Extract reusable gameplay patterns from the gazetteer text.

## Hazard Pattern Classes
- Environmental pressure: heat, pressure, toxicity, corrosive media.
- Perceptual/psychic pressure: despair, memory loss, mutagenic influence.
- Traversal instability: shifting terrain, collapsing bridges, predatory weather.
- Equipment constraints: metal failure, organic dissolution, light suppression.

## Resource Pattern Classes
- Extreme-zone rewards: high value in high danger bands.
- Ecological byproducts: spores, sap, preserved artifacts, condensed energy.
- Plane-law resources: metaphysical materials (light condensates, dream-reactive fluids).

## Encounter Pattern Classes
- Predator ecology loops: entities adapted to local hazard mechanics.
- Factional adaptation: cultures shaped by stratum constraints.
- Symbiotic conflict: quest hooks emerge from non-human biome actors.

## Procedural Hook Template

```ts
type EncounterHook = {
  trigger: string;      // weather, threshold crossing, proximity, extraction action
  pressure: string;     // hazard rule currently constraining players
  actor: string;        // inhabitant/faction/resource guardian
  objective: string;    // recover, negotiate, survive, escort, disable
  complication: string; // biome-specific twist
};
```

## Design Rules
- Hazards should change decision-making, not just HP totals.
- Resources should justify risk zones and create route planning tension.
- Encounters should be consequences of ecology/metaphysics, not random insertions.
