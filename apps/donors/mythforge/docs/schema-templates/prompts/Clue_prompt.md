## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — mystery node and clue generation (`Execution_Systems/Mysteries/mystery_node.txt`).

Use the sections below as the instruction skeleton for generating a single clue/evidence item. Include provenance, difficulty, and implications. Final output must be strict JSON matching the schema below.

Clue Skeleton

- Clue ID / Short label
- Text / Description
- Type (physical, testimonial, document, circumstantial)
- Difficulty to find/interpet
- Where found (node/location)
- Who might recognize it
- Implications / leads
- False positive potential

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Clue` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Clue` JSON schema:

```
{
  "id": string,
  "text": string,
  "type": string | null,
  "difficulty": string | null,
  "location": string | null,
  "recognizable_by": [string],
  "implications": [string],
  "false_positive": string | null,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
