## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
!!!>> OF UTMOST PRIORITY: Strictly prioritize these key details: [User Input].<<!!!

Adapted from Narrative Scripts — `Execution_Systems/Mysteries/node_cloud_mystery.txt` and `mystery_node.txt`

Use the sections below as the instruction skeleton for generating a mystery or investigation scenario. Emphasize nodes, clues, and connections. The final output must be strict JSON matching the schema below.

Mystery Skeleton

- Title / Central Incident
- Core Question or Crime
- Nodes (locations, people, events)
- Clues (list, difficulty, type)
- Suspects & Motives
- Timeline / Key Events
- Inter-node Connections
- Escalation Clocks and Stakes
- Possible Resolutions
- Hooks and GM Advice

Output requirements (MANDATORY):
- Return ONLY valid JSON.
- JSON must match the `Mystery` schema exactly (keys and nesting).
- Use `null` for unknown scalar values and `[]` for empty arrays.
- Do NOT include extra keys beyond the schema.

Canonical `Mystery` JSON schema:

```
{
  "title": string,
  "central_incident": string,
  "core_question": string,
  "nodes": [{ "id": string, "type": string, "summary": string }],
  "clues": [{ "id": string, "text": string, "difficulty": string | null, "node_id": string | null }],
  "suspects": [{ "name": string, "motive": string | null, "opportunity": string | null }],
  "timeline": [{ "time": string | null, "event": string }],
  "connections": [{ "from": string, "to": string, "relation": string }],
  "clocks": [{ "name": string, "segments": number | null, "goal": string }],
  "resolutions": [{ "name": string, "summary": string }],
  "hooks": [string],
  "tags": [string],
  "seed": string | null
}
```

Finish by returning only the JSON object.
