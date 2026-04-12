## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/plot/campaign_prep.txt`

Use the sections below as the instruction skeleton for generating a single event (incident, discovery, milestone). Emphasize immediate consequences and player-facing choices. Final output must be strict JSON matching the schema below.

Event Skeleton

- Title / Summary
- Trigger and Preconditions
- Immediate Effects
- Involved Parties
- Spatial and Temporal Context
- Game-Mech Effects (checks, status changes)
- Possible Player Responses
- Short- and Long-term Consequences
- Recommended Scene Flow

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Event` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Event` JSON schema:

```
{
  "title": string,
  "summary": string | null,
  "trigger": string | null,
  "effects": [string],
  "parties": [{ "name": string, "role": string | null }],
  "context": { "location": string | null, "time": string | null },
  "mechanics": [string],
  "player_responses": [string],
  "consequences": { "short_term": [string], "long_term": [string] },
  "scene_flow": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
