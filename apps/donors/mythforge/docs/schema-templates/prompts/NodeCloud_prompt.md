---
subscribes_to: ["node_generation", "link_nodes"]
---

> **Schema Class:** Entity

## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.

# NodeCloud Prompt (LLM Skeleton)

Instructions:

- Input: seed, theme, optional `focus` (e.g., "clues", "locations", "characters").
- Output: a machine-parsable JSON object with top-level `node_cloud` containing `id`, `title`, `nodes[]` and `connections[]`. Each node should have `id`, `type`, `summary`, `detail`, and optional `connections` listing other node ids.

Prompt Body:

"You are a node generator. Given `seed`: {{seed}} and `focus`: {{focus}}, generate a `node_cloud` object with a small network (3-12 nodes). Nodes should be varied types (clue, witness, location, obstacle, NPC). Also produce `connections[]` as objects {from,to,reason}. Include a short `text` summary describing how the nodes relate. Output only valid JSON."
