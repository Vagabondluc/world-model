## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/plot/rumors.txt` and social prompts.

Use the sections below as the instruction skeleton for generating a rumor, gossip, or rumor-network lead. Keep it terse, ambiguous, and playable. Final output must be strict JSON matching the schema below.

Rumor Skeleton

- Rumor Text (short)
- Credibility (scale: improbable, possible, reliable)
- Source (who/where)
- Lead Items (what it suggests investigating)
- Consequences if true
- Counter-evidence or red flags
- Suggested followups / hooks

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Rumor` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Rumor` JSON schema:

```
{
  "text": string,
  "credibility": string | null,
  "source": string | null,
  "leads": [string],
  "consequences": string | null,
  "red_flags": [string],
  "followups": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
