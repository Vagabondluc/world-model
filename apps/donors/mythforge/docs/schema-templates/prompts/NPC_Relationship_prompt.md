## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/NPCs/Quick_NPC.txt` and relationship templates

Use the sections below as the instruction skeleton for generating NPC relationships (bonds, rivalries, patronage). Emphasize motives and mechanical hooks. Final output must be strict JSON matching the schema below.

NPC Relationship Skeleton

- Subject NPC and Counterparty
- Relationship Type (ally, rival, patron, family)
- History and Origin
- Power Dynamics and Obligations
- Mutual Goals and Conflicts
- Mechanical Hooks (inspiration, advantage, duty)
- Secrets and Leverage
- Typical Interaction Beats
- Eventual Evolution / Arc

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `NPCRelationship` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `NPCRelationship` JSON schema:

```
{
  "subject": { "name": string, "role": string | null },
  "counterparty": { "name": string, "role": string | null },
  "type": string,
  "origin": string | null,
  "dynamics": string | null,
  "goals": [string],
  "mechanical_hooks": [string],
  "secrets": [string],
  "interaction_beats": [string],
  "arc": string | null,
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
