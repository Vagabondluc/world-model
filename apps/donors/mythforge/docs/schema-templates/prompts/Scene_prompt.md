## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/plot/SceneDescriptor_v1.txt`

Use the sections below as the instruction skeleton for generating a single dramatic scene. Preserve pacing and beats; deliver table-ready, concise prose. The final output must be strict JSON matching the schema below.

Scene Skeleton

- Title / Scene Hook
- Purpose in the larger arc
- Setting (location, time, atmosphere)
- Major Characters Present and Goals
- Beats (ordered list of 3–6 beats)
- Conflict and Stakes
- Turning Point
- Outcome Variants (success/failure)
- Sensory Details and Micro-descriptions
- GM keys (rolls, NPC reactions, optional complications)

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Scene` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Scene` JSON schema:

```
{
  "title": string,
  "purpose": string,
  "location": string,
  "mood": string,
  "participants": [{ "name": string, "role": string, "goal": string }],
  "beats": [{ "index": number, "description": string, "purpose": string }],
  "conflict": string,
  "turning_point": string | null,
  "outcomes": { "success": string, "failure": string },
  "duration_minutes": number | null,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
