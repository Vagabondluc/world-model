## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Landmark Instruction Skeleton

- Name and Location
- Physical Description and Scale
- Historical or Cultural Significance
- Visibility and Access (is_hidden / approachability)
- Associated Myths or Events
- Adventure Hooks and GM Advice

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Landmark` schema exactly.
- Use `null` for unknown scalar values and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical `Landmark` JSON schema:

```
{
  "name": string,
  "elevation_meters": number,
  "visibility_range_km": number,
  "is_hidden": boolean,
  "description": string,
  "significance": string,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
