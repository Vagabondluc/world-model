# Spec stub — alexandrian_wilderness_travel_long

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Purpose
- Surface a wilderness travel rules chapter and support automated travel encounter generation with tables.

API / Inputs
- WildernessTravelRequest {
  biome: "desert" | "forest" | "tundra" | "swamp" | string,
  levelRange: string,
  pace: "slow" | "normal" | "fast",
  partyResources: { food: number; water: number; lightSources: number },
  encounterSeeds?: string[],
  weather?: string
}

Outputs
- WildernessTravelDocument {
  markdown: string,
  encounterTables: { roll: string; result: string }[],
  randomTablesPayload: { tableId: string; entries: string[] }[],
  resourceGuidance: { resource: string; recommendation: string }[]
}

Types
- `interface WildernessTravelRequest { biome: string; levelRange: string; pace: string; partyResources: ResourceState; encounterSeeds?: string[]; weather?: string }`
- `interface ResourceState { food: number; water: number; lightSources: number }`
- `interface WildernessTravelDocument { markdown: string; encounterTables: TableEntry[]; randomTablesPayload: RandomTable[]; resourceGuidance: Guideline[] }`
- `interface ApiError { error: string; code: number; details?: string[] }`

Behavior
- Confirm biome + levelRange are present; fallback to default biome if missing.
- Generate rules sections (travel mechanics, encounters, weather systems) plus PRD tables.
- Produce random tables payloads for 2d6 encounters and weather.
- Provide resource guidance per partyResources state and store table references.

Edge cases
- Missing biome/levelRange → return `{ error: "Missing required fields", code: 422, details: ["biome", "levelRange"] }`.
- Over-budget partyResources → emit warning within `resourceGuidance`.
- Unknown pace value → default to "normal" and log change.
- Request includes >10 encounterSeeds → trim list and note truncation.

Mapping to UI
- Reader page shows sections with expandable tables and dice roll widgets.
- Travel planner canvas consumes `encounterTables` and `resourceGuidance` for checklist cards.
- Export options: markdown, printable tables, JSON payload for encounters.

Non-functional requirements
- Latency: default responses <2s; large tables delivered via pagination.
- Streaming: support incremental table rendering for long documents.
- Accessibility: tables include captions, column headers, and aria labels.
- i18n: biome names and weather descriptions support localization tokens.

Tests (examples)
- Request with valid fields returns `WildernessTravelDocument` with table entries.
- Missing levelRange triggers ApiError with code 422.
- High-partyResources situation adds warning entry to `resourceGuidance`.
- Streaming mode sends table chunks before final markdown.

Priority
- Medium