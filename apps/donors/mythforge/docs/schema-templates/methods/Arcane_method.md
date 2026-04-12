Arcane Loom Method — Spec

Overview
--------
The Arcane method is a multi-stage Loom workflow that discovers, creates, and links arcane content: locations, NPCs, scenes, ritual nodes, and artifacts. It is intended for generative pipelines that must both expand content and produce canonical JSON artifacts.

Stages & responsibilities
-------------------------
- seed: Accepts `seed` and `scope` — returns a normalized `seed` and high-level goals.
- table/matrix: Produce motif/ritual/trait tables to sample variations.
- node_generation: Emit raw nodes (clue, ritual, site, NPC-beat) with `id`, `type`, `summary`, `detail`.
- create_entities: For nodes that require full entities, output `locations[]`, `npcs[]`, `scenes[]`, `artifacts[]` with canonical `id` and descriptive fields.
- link_nodes: Create `connections[]` objects ({from,to,reason}) linking nodes and entities.
- synthesize: Assemble a final `arcane` JSON artifact combining nodes, entities and connections, plus `text` narrative.
- finalize: Polished human text and optional translation to other output formats.

Artifact conventions
--------------------
- Every artifact must include top-level `loom` with `stage` and `seed`.
- Core artifact key is `arcane` with nested arrays: `locations`, `npcs`, `scenes`, `nodes`, `connections`, `artifacts`.
- Use short unique ids (e.g., "A1","L3","N2").

Integration notes
-----------------
- Add `Arcane_prompt.md` to the prompt directory and register it in `loom_subscriptions.yaml` to subscribe to the stages above.
- Provide sample fixtures under `samples/arcane/` for each major stage to aid testing and schema validation.
