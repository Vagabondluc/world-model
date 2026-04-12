## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Use the sections below as the instruction skeleton for generating a fully realized settlement description. Follow style codes from the Narrative Scripts (AC&OT, MS&L, D&T, C&L, ND, PD) and keep output precise.

Settlement Overview
- Name and Location
- Size and Population
- Narrative paragraph summarizing history, governance, economy, culture, and external relations

Geography and Layout
- Districts and Neighborhoods
- Landmarks and Iconic Structures
- Concise paragraph describing landscape, defenses, and transport

Society and Demographics
- Races and Ethnic Groups
- Notable Families and Factions
- Narrative paragraph summarizing hierarchy and beliefs

Economy and Trade
- Major industries, trading hubs, black market presence

Governance
- Leadership, political factions, law enforcement, military presence

Culture and Entertainment
- Gathering places, lodgings, festivals, arts

Associations and Collectives
- Guilds, esoteric circles, adventurer contacts

Prominent Individuals
- Provide an array of objects with `name`, `role`, `description`, `goal`

Everyday Life and Customs

Challenges and Conflicts

Adventure Hooks and Quests
- Provide multiple hooks spanning Mystery, Political Intrigue, Exploration, Treasure, Personal Dilemmas

GM Advice

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the Settlement canonical schema exactly (keys, nesting).
- Use `null` for unknown scalar fields and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical JSON schema (return object with these keys):

```
{
  "name": string,
  "location": string,
  "size": string,
  "population": number | null,
  "history": string,
  "governance": { "leader": string | null, "structure": string | null, "law_enforcement": string | null, "political_factions": string[] },
  "economy": { "major_industries": string[], "trade_hubs": string[], "black_market": string | null },
  "districts": [{ "name": string, "description": string }],
  "landmarks": [{ "name": string, "description": string }],
  "demographics": [{ "group": string, "proportion": string | null, "notes": string | null }],
  "notable_families": [{ "name": string, "influence": string | null, "notes": string | null }],
  "associations": [{ "name": string, "type": string, "description": string }],
  "prominent_individuals": [{ "name": string, "role": string, "description": string, "goal": string }],
  "everyday_life": string,
  "challenges": [string],
  "adventure_hooks": [{ "tag": string, "summary": string, "detail": string }],
  "gm_advice": string,
  "image_prompt": string,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
