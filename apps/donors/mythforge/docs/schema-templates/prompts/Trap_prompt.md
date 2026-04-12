## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/Locations/battlefield_generation.txt` and trap guidance files.

Use the sections below as the instruction skeleton for generating a trap or hazard. Keep mechanics explicit and table-ready; include detection, disarm, and trigger details. Final output must be strict JSON matching the schema below.

Trap Skeleton

- Name & Short Hook
- Trigger (how it activates)
- Detection Method and DC
- Disarm Method and DC
- Effect (damage, conditions, status)
- Frequency / Reset behavior
- Required Materials / Construction notes
- Placement / Environmental modifiers
- Tactics (usage and escalation)
- Adventure Hooks and Variants

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Trap` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Trap` JSON schema:

```
{
  "name": string,
  "hook": string | null,
  "trigger": string,
  "detection": { "method": string | null, "dc": number | null },
  "disarm": { "method": string | null, "dc": number | null },
  "effect": { "type": string, "damage": string | null, "conditions": [string] },
  "reset": string | null,
  "materials": [string],
  "placement_notes": string | null,
  "tactics": string | null,
  "variants": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
