---
subscribes_to: ["synthesize", "finalize"]
---

## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.

# Mission Prompt (LLM Skeleton)

Instructions:

- Input: a `seed` string and optional `mission` partial object with constraints.
- Output: Produce a JSON object at root `mission` matching the `Quest.schema.json`/`Mission` contract and a human-readable `text` section with GM notes.

Schema notes:

- Include `id`, `title`, `summary`, `primary_objective`, `scenes[]`, `key_npcs[]`, `rewards`.
- Provide `gm_advice` and `hooks` as arrays of short objects.

Prompt Body (use as template):

"You are a creative RPG scenario generator. Given the seed: {{seed}} and constraints: {{constraints}}, output a JSON object with top-level key `mission` that contains: id, title, subtitle, type, level_range, difficulty, summary, stakes, primary_objective, secondary_objectives, start_location, key_locations, key_npcs, scenes (with beats and complications), rewards, failed_outcomes, hooks, tags, gm_advice, and seed. Also include a top-level `text` field with a concise GM-facing narrative (3 paragraphs). Ensure the JSON is valid and machine-parseable."
