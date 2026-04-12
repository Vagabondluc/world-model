## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/plot/create_hook.txt` and campaign templates.

Use the sections below as the instruction skeleton for generating a one-paragraph or short adventure hook. Emphasize stakes, NPCs, and immediate player choices. Final output must be strict JSON matching the schema below.

Hook Skeleton

- Title / Hook Line
- Hook Type (investigate, escort, fetch, defend, social)
- Setup (who, where, why)
- Immediate Stakes
- Suggested Hooks & Complications
- Key NPCs and Motivations
- Suggested Skill Checks or Encounters
- Short GM notes

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Hook` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Hook` JSON schema:

```
{
  "title": string,
  "hook_line": string,
  "type": string | null,
  "setup": string,
  "stakes": string,
  "complications": [string],
  "npcs": [{ "name": string, "motivation": string | null }],
  "checks_or_encounters": [string],
  "gm_notes": string | null,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
