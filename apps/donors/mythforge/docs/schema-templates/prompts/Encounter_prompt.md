## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/Encounters/EncounterDesign_v1.txt`

Use the sections below as the instruction skeleton for generating a tactical or narrative encounter. Follow style codes (AC&OT, MS&L, D&T, C&L, ND, PD). Keep output focused and usable at the table; the final output must be strict JSON matching the schema below.

Encounter Skeleton

- Title / Hook
- Encounter Type (combat, social, exploration, skill challenge)
- Difficulty & Suggested Level Range
- Environment and Terrain Effects
- Enemies / Opponents (names, CR, numbers)
- Objectives and Win Conditions
- Skill Checks and Non-Combat Solutions
- Tactics & Behavior Notes
- Rewards and XP Calculation
- Scaling and Variants
- GM Advice

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Encounter` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Encounter` JSON schema:

```
{
  "title": string,
  "type": string,
  "difficulty": string | null,
  "enemy_count": number | null,
  "average_cr": number | null,
  "environment": string,
  "description": string,
  "enemies": [{ "name": string, "cr": number | null, "count": number }],
  "objectives": [string],
  "skill_challenges": [string],
  "tactics": string,
  "rewards": { "xp": number | null, "loot": [{ "name": string, "description": string }] },
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
