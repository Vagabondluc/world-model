## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Output/homebrew 5e` templates and spell sections in subclass notes

Use the sections below as the instruction skeleton for generating a spell. Keep mechanical details precise. The final output must be strict JSON matching the schema below.

Spell Skeleton

- Name & Short Hook
- School & Subschool
- Level
- Casting Time
- Range
- Components (V/S/M)
- Duration & Concentration
- Schooling / Class List
- Ritual: yes/no
- Description (mechanics and flavor)
- Higher level scaling
- Example Uses / Hooks

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Spell` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Spell` JSON schema:

```
{
  "name": string,
  "school": string | null,
  "level": number | null,
  "casting_time": string | null,
  "range": string | null,
  "components": { "verbal": boolean, "somatic": boolean, "material": string | null },
  "duration": string | null,
  "concentration": boolean | null,
  "ritual": boolean | null,
  "classes": [string],
  "description": string,
  "higher_level": string | null,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
