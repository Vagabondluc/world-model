## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Structure Instruction Skeleton

- Name and Purpose
- Physical Description (floors, condition)
- Owner and Tenure
- Interior Layout and Key Rooms
- Defenses and Access
- Role in the Local Economy or Culture
- Hooks & GM Advice

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Structure` schema exactly.
- Use `null` for unknown scalar values and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical `Structure` JSON schema:

```
{
  "name": string,
  "floors": number,
  "condition": string,
  "owner": string | null,
  "purpose": string,
  "key_rooms": [{ "name": string, "description": string }],
  "access_notes": string,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
