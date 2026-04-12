## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Use these sections to generate a playable dungeon description. Follow Narrative Scripts style codes (AC&OT, MS&L, D&T, C&L, ND, PD). Keep prose focused; final output must be strict JSON matching the schema below.

Dungeon Instruction Skeleton

- Name and Theme
- Purpose / Origin
- Layout Summary (levels, key areas)
- Threats, Factions, and Monsters
- Traps and Puzzles
- Notable Rooms & Landmarks
- Loot Summary
- Adventure Hooks & GM Advice

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Dungeon` schema exactly.
- Use `null` for unknown scalar values and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical `Dungeon` JSON schema:

```
{
  "name": string,
  "total_rooms": number,
  "average_cr": number,
  "exploration_time_minutes": number,
  "key_areas": [{ "name": string, "description": string }],
  "threats": [string],
  "traps": [string],
  "loot_summary": string,
  "hooks": [{ "tag": string, "summary": string }],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
