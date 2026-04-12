## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Faction Instruction Skeleton

- Name and Purpose
- Membership and Size
- Influence and Resources
- Headquarters and Territory
- Allies and Enemies
- Secrecy and Methods
- Hooks & GM Advice

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Faction` schema exactly.
- Use `null` for unknown scalar values and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical `Faction` JSON schema:

```
{
  "name": string,
  "member_count": number,
  "influence": string,
  "resources": string,
  "secrecy": number,
  "headquarters": string | null,
  "goals": [string],
  "allies": [string],
  "enemies": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
