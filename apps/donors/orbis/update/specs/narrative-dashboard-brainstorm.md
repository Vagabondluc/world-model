# Narrative Dashboard Brainstorm

Audience: TTRPG DMs, worldbuilders, and novelists.

Goal: make Orbis feel like a story engine, not a lab console.

## What Is Great About This System (From Narrative POV)

1. Deep-time causality creates believable history
- Kingdoms, species, and myths emerge from climate, geology, and ecology instead of random lore.

2. Deterministic world state supports continuity
- If you rerun the same seed + choices, your canon remains stable.

3. Multi-layer simulation produces plot hooks automatically
- Famines, migrations, extinctions, strange biomes, and collapse/recovery arcs appear naturally.

4. Benchmark scenarios can become story templates
- Snowball recovery, runaway warming, predator collapse can be campaign eras.

5. Plane/stratum overlays support genre shifts
- Material/Feywild/Shadowfell framing enables tonal variants of one shared world.

## Core Interface Principle

Show **story levers and consequences**, not raw coefficients.

Raw values can exist in an “Advanced” drawer, but default UX should be:
- “Trigger drought for 3 years in this region”
- “Spawn impact crater chain near this coast”
- “Introduce invasive species”
- “Found new civilization with scarcity doctrine”

## Narrative Dashboard Screens

## 1) Story Director (Home)
- Current era summary (climate, conflict, biodiversity, stability).
- “What changed this year?” feed.
- Top narrative tensions:
  - food stress
  - migration pressure
  - succession instability
  - disaster risk

## 2) Event Forge (SimCity-style)
- Trigger events with intensity, region, and duration:
  - meteor strike
  - drought
  - volcanic eruption
  - plague
  - flood
  - trade collapse
  - magical anomaly (if enabled)
- Immediate preview:
  - expected casualties
  - biome damage
  - political shock
  - recovery time band
- “Soft launch” mode:
  - queue event in future year
  - chain events (eruption -> famine -> migration war)

## 3) Species & Race Studio
- Create custom races/species from modular traits:
  - physiology
  - cognition
  - social structure
  - habitat affinities
  - cultural defaults
- Narrative presets:
  - nomadic survivors
  - coastal traders
  - volcanic zealots
  - fungal archivists
- Validate against world constraints:
  - “This species struggles below 8% oxygen”
  - “Population likely collapses in current desert epoch”

## 4) Civilization Drama Panel
- Found/merge/split factions.
- Toggle strategic doctrines:
  - expansionist
  - isolationist
  - trade-first
  - ecological stewardship
- See consequence graph:
  - wars likely in 10-20 years
  - trade growth potential
  - internal unrest risk

## 5) Arc Composer (Campaign/Novel Planning)
- Build timeline arcs:
  - setup -> escalation -> catastrophe -> recovery
- Pin canonical beats:
  - “Year 4021: Skyfire impact”
  - “Year 4043: The Ash Treaty”
- Lock canon mode:
  - prevents accidental rewrites of prior timeline segments

## 6) Region Story Cards
- Click any region to get:
  - short narrative summary
  - current stresses
  - species/faction presence
  - “next likely outcomes”
- One-click prompt generation:
  - encounter seeds
  - chapter hooks
  - session openers

## 7) Consequence Inspector
- For any action/event, show:
  - direct effects (0-1 years)
  - cascading effects (1-20 years)
  - legacy effects (20+ years)
- Confidence display:
  - low / medium / high narrative certainty

## 8) Canon & Export
- Export world bible snapshots:
  - geography
  - species sheets
  - faction dossiers
  - timeline
- Export “DM packet”:
  - active conflicts
  - local hazards
  - rumor table

## Key UX Features To Build

1. Plain-language controls
- “Make winters harsher in the north” instead of “decrease annual mean insolation.”

2. Safety rails
- “This action may irreversibly crash 3 trophic levels” confirmation.

3. Story-first presets
- Golden Age
- Age of Ash
- Flooded World
- Fractured Empires

4. Before/After compare
- Side-by-side world cards for “current vs proposed event.”

5. Reversible sandbox mode
- Test disruptive events without committing to canon.

6. Reason-code explainability in plain English
- Technical reason codes mapped to narrative explanations.

## Example DM/Narrative Actions

1. “Create a new amphibious race in delta regions.”
2. “Trigger a magnitude-7 volcanic winter over this continent.”
3. “Force a 5-year drought in the imperial breadbasket.”
4. “Spawn meteor strike at sea to generate tsunami migration crisis.”
5. “Split one empire into 3 successor states with different doctrines.”
6. “Advance 200 years and summarize the resulting mythic age.”

## Suggested Data Model (Narrative Layer)

```ts
type NarrativeActionType =
  | "trigger_event"
  | "create_species"
  | "modify_faction"
  | "set_arc_milestone"
  | "advance_time"

interface NarrativeAction {
  id: string
  type: NarrativeActionType
  label: string
  payload: Record<string, unknown>
  applyAtTick?: number
  canonMode: boolean
}

interface NarrativeConsequencePreview {
  direct: string[]
  cascades: string[]
  longTail: string[]
  confidence: "low" | "medium" | "high"
  riskFlags: string[]
}
```

## Implementation Priority (Narrative UX)

1. Event Forge
2. Species & Race Studio
3. Arc Composer
4. Consequence Inspector
5. Region Story Cards
6. Canon Export

This order gives immediate playability for DMs and novelists.
