> **Schema Class:** Entity

## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Use the sections below as the instruction skeleton for generating a complete, playable quest/mission. Follow style codes from Narrative Scripts (AC&OT, MS&L, D&T, C&L, ND, PD). Keep prose vivid but compact; the final output must be strict JSON matching the schema below.

Quest Instruction Skeleton

- Title and Subtitle
- Type (e.g., Investigation, Rescue, Heist, Exploration, Epic)
- Difficulty / Level Range
- Summary (one-paragraph elevator pitch)
- Stakes and Goals (what happens on success/failure)
- Primary Objective and Secondary Objectives
- Starting Situation and Hook
- Key NPCs (names, roles, motivations)
- Key Locations (start, middle, climax locations)
- Scene Beats: list ordered scenes with brief beats for each
- Complications and Twists (timed events, betrayals, environmental hazards)
- Rewards and Consequences (treasure, social, XP-equivalent, long-term fallout)
- Variants and Scaling (ways to scale or change tone)
- GM Advice (short, tactical suggestions for running)

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the canonical `Quest` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT add extra keys beyond the schema.

Canonical `Quest` JSON schema (return object with these keys):

```
{
  "title": string,
  "subtitle": string | null,
  "type": string,
  "level_range": string | null,
  "difficulty": string | null,
  "summary": string,
  "stakes": string,
  "primary_objective": string,
  "secondary_objectives": [string],
  "start_location": { "name": string, "description": string },
  "key_locations": [{ "name": string, "description": string }],
  "key_npcs": [{ "name": string, "role": string, "motivation": string, "description": string }],
  "scenes": [{ "id": number, "title": string, "setting": string, "beats": [string], "complications": [string], "npcs": [string] }],
  "complications": [string],
  "rewards": { "xp": number | null, "items": [{ "name": string, "description": string }], "social": string | null },
  "failed_outcomes": [string],
  "variants": [{ "tag": string, "summary": string }],
  "hooks": [{ "tag": string, "summary": string, "detail": string }],
  "tags": [string],
  "gm_advice": string,
  "seed": string | null
}
```

Finish by returning only the JSON object.
