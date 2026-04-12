## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Plane Instruction Skeleton

- Name and Alignment
- Elemental/Conceptual Traits
- Accessibility and Travel Hazards
- Inhabitants and Factions
- Points of Power and Anchors
- Hooks & Campaign Impact

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Plane` schema exactly.
- Use `null` for unknown scalar values and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical `Plane` JSON schema:

```
{
  "name": string,
  "alignment": string,
  "element": string,
  "accessibility": string,
  "description": string,
  "hazards": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
