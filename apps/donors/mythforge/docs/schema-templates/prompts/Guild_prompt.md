## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Guild Instruction Skeleton

- Name and Specialty
- Member Count and Structure
- Headquarters and Notable Members
- Wealth and Influence
- Rivalries and Contracts
- Hooks & GM Advice

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Guild` schema exactly.
- Use `null` for unknown scalar values and `[]` for empty lists.
- Do NOT include extra keys beyond the schema.

Canonical `Guild` JSON schema:

```
{
  "name": string,
  "member_count": number,
  "headquarters": string,
  "specialty": string,
  "wealth_rating": number,
  "notable_members": [string],
  "rivalries": [string],
  "contracts": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
