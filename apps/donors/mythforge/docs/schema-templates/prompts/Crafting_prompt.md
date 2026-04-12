## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/plot/crafting scenes.txt` and item/crafting notes

Use the sections below as the instruction skeleton for generating a crafting or item-creation entry. Include materials, steps, and time/cost. Final output must be strict JSON matching the schema below.

Crafting Skeleton

- Item Name / Short Hook
- Required Materials and Quantities
- Required Skills and Tools
- Crafting Steps and DCs
- Time and Cost Estimates
- Failure Modes and Consequences
- Variant / Upgrades
- Special Recipes or Rites
- Hooks and Sourcing Notes

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Crafting` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Crafting` JSON schema:

```
{
  "item": string,
  "hook": string | null,
  "materials": [{ "name": string, "quantity": number | null }],
  "skills": [{ "name": string, "dc": number | null }],
  "tools": [string],
  "steps": [{ "step": number, "description": string, "dc": number | null }],
  "time_hours": number | null,
  "cost": number | null,
  "failure_modes": [string],
  "variants": [string],
  "special": string | null,
  "hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
