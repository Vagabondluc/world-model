# Easy-Win Dashboard Catalog (DM + Novelist + Builder)

Purpose: identify high-value, low-friction dashboards that expose simulation power without forcing users into raw solver parameters.

## A. World Overview Dashboards

### 1) Planet Pulse (Home Screen)
- Shows: global temperature trend, habitability, biosphere health, conflict pressure, major risks.
- Widgets:
- world status badges (`Stable`, `Warming`, `MassExtinctionRisk`)
- 3 trend lines (temp, biodiversity, unrest)
- top 5 active pressures
- Easy win because: one-screen orientation for every session.

### 2) Atmosphere Console
- Shows: O2/CO2 proxies, greenhouse state, oxygen compatibility by species classes.
- Widgets:
- gas composition bars
- breathable/not-breathable indicator
- “who survives now” species filter
- Easy win because: immediate link between planet chemistry and story stakes.

### 3) Wind & Weather Pattern Viewer
- Shows: prevailing winds, storm lanes, drought corridors, rain shadows.
- Widgets:
- animated global wind map
- monsoon/jetstream overlays
- seasonal toggle (dry/wet)
- Easy win because: explains migration, famine, trade, and war pressure in one view.

### 4) Ocean & Currents Viewer
- Shows: warm/cold currents, upwelling zones, anoxia risk pockets.
- Widgets:
- current vector overlay
- marine productivity heatmap
- fishery potential zones
- Easy win because: drives coastal civilization arcs and food stories.

## B. Biome & Ecology Dashboards

### 5) Biome Stability Atlas
- Shows: stable vs unstable biomes, transition fronts, refugia.
- Widgets:
- stability heatmap
- “next likely biome transition” cards
- refugium detection overlay
- Easy win because: gives future-world hints for campaign planning.

### 6) Species Viewer (Core)
- Shows: lineage tree, habitat fit, trophic role, risk, spread.
- Widgets:
- species card + trait tags
- survivability radar by biome
- population trend + extinction risk band
- Easy win because: this is the most requested storyteller tool.

### 7) Food Web / Trophic Dashboard
- Shows: producer-herbivore-predator balance and collapse points.
- Widgets:
- trophic pyramid
- bottleneck alerts
- cascade risk score
- Easy win because: explains “why this ecosystem collapses” fast.

### 8) Invasive Species & Disease Watch
- Shows: invasion fronts, susceptible regions, spread velocity.
- Widgets:
- spread map with ETA
- host vulnerability table
- projected damage band
- Easy win because: creates instant event hooks and interventions.

## C. Civilization & Society Dashboards

### 9) Civilization Pulse
- Shows: population, legitimacy, unrest, economy, military pressure.
- Widgets:
- faction scorecards
- unrest forecast
- doctrine badges
- Easy win because: direct campaign-level story driver.

### 10) Settlement Viability Map
- Shows: where cities can thrive now and 20-year outlook.
- Widgets:
- suitability heatmap
- water/food/trade access slices
- relocation recommendations
- Easy win because: supports both worldbuilding and strategic scenarios.

### 11) Trade & Supply Lanes
- Shows: route health, chokepoints, disruption risk.
- Widgets:
- route graph map
- critical dependency list
- shock impact preview
- Easy win because: easy to narrate and easy to act on.

### 12) Conflict Forecast Board
- Shows: likely flashpoints, factions involved, trigger causes.
- Widgets:
- war probability map
- trigger stack (`food`, `border`, `succession`)
- de-escalation levers
- Easy win because: generates immediate adventure seeds.

## D. Narrative Control Dashboards

### 13) Event Forge 2.0
- Shows: event families with story presets first, advanced params optional.
- Widgets:
- preset cards (`Ash Winter`, `Dynastic Crisis`, `Plague Route`)
- consequence preview bands
- canon/sandbox toggle
- Easy win because: converts engine complexity into one-click drama.

### 14) Arc Composer Timeline
- Shows: beats, locks, forks, outcomes.
- Widgets:
- beat rail with phase colors
- fork/merge lineage
- continuity warnings
- Easy win because: closes loop from simulation to publication/session prep.

### 15) Region Story Cards
- Shows: “what is happening here now” + “what likely happens next”.
- Widgets:
- region pressure stack
- 3 likely next events
- NPC/faction hooks
- Easy win because: DM-ready output with no extra synthesis.

## E. Engineering Trust Dashboards

### 16) Solver Validity Monitor
- Shows: saturation, fallback usage, out-of-range flags by domain.
- Widgets:
- validity flag counters
- domain health bars
- first-failure trace
- Easy win because: prevents silent bad worlds.

### 17) Determinism & Replay Integrity
- Shows: digest parity, mismatch location, replay confidence.
- Widgets:
- per-domain digest status
- mismatch timeline
- seed/replay metadata
- Easy win because: critical for reproducible narrative worlds.

### 18) Benchmark Scenarios Panel
- Shows: pass/fail status for canonical scenarios.
- Widgets:
- scenario list (`Snowball`, `Runaway`, `BoomBust`, etc.)
- regression diff summary
- last passing build
- Easy win because: fast confidence after every spec/model change.

## F. Creator Productivity Dashboards

### 19) Parameter Provenance Explorer
- Shows: where each tunable came from (`earth`, `fitted`, `gameplay`).
- Widgets:
- provenance badges
- change history
- confidence level
- Easy win because: resolves “is this science or game balance?” confusion.

### 20) Tag Explorer
- Shows: active tags by domain, intensity, propagation, collisions.
- Widgets:
- domain/tag filters
- tag timeline
- duplicate/overlap warnings
- Easy win because: your architecture is tag-centric and currently needs visibility.

### 21) World Compare (A/B)
- Shows: current vs proposed branch side-by-side.
- Widgets:
- delta cards (climate, species, civ, narrative)
- map diff slider
- commit recommendation
- Easy win because: safest way to approve big interventions.

## Suggested Build Order (Practical)
1. `Planet Pulse`
2. `Species Viewer`
3. `Atmosphere Console`
4. `Wind & Weather Pattern Viewer`
5. `Biome Stability Atlas`
6. `Civilization Pulse`
7. `Event Forge 2.0`
8. `Region Story Cards`
9. `Tag Explorer`
10. `Solver Validity Monitor`

## Minimum Data Contracts Needed
- `WorldSummarySnapshot`
- `AtmosphereStateSnapshot`
- `WindFieldSnapshot`
- `BiomeStabilitySnapshot`
- `SpeciesProfileSnapshot`
- `CivilizationProfileSnapshot`
- `NarrativeForecastSnapshot`
- `SolverValiditySnapshot`
- `TagPropagationSnapshot`

These should be read-model outputs only; mutation must stay behind validated command contracts.
