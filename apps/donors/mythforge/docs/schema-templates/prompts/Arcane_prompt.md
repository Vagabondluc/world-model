---
subscribes_to: ["table", "matrix", "node_generation", "create_entities", "link_nodes", "synthesize", "finalize"]
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

# Arcane Method Prompt (LLM Skeleton)

Purpose:

- Create, link, or expand magical locations, NPCs, scenes, nodes, and artifacts across multiple Loom stages. Designed to run as a multi-stage method for worldbuilding and mystery/arcana generation.

Inputs:

- `seed` (string) — canonical seed for reproducibility.
- `theme` (string) — optional theme (e.g., "ritual theft", "lost library").
- `scope` (object) — optional constraints (levels, tone, locale).

Output contract:

- Top-level field `arcane` (object) containing: `id`, `title`, `locations[]`, `npcs[]`, `scenes[]`, `nodes[]`, `connections[]`, `artifacts[]`, `seed`.
- Top-level `text` (string) with human-facing synthesis and GM advice.

Stage guidance:

- `table` / `matrix`: produce option tables or matrices for motifs, ritual goals, artifact types.
- `node_generation`: emit raw nodes (clues, sites, rituals, NPC beats).
- `create_entities`: for nodes that imply new objects (locations, NPCs, scenes), output full entity objects with canonical `id` keys.
- `link_nodes`: produce explicit `connections[]` between nodes/entities with reasons.
- `synthesize`: combine nodes and entities into an `arcane` artifact (JSON) plus `text` summary.
- `finalize`: produce polished `text` for GM and final JSON.

Prompt template (use with LLM):

"You are an arcane worldbuilder. Given seed `{{seed}}`, theme `{{theme}}` and constraints `{{scope}}`, produce a machine-parseable JSON object with top-level `arcane` and `text`. Follow the Output contract above exactly. Ensure IDs are short unique strings and include the `seed` in the artifact."
