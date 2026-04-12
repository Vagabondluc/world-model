Loom Workflows — Meta-schema and Stage Contracts

Overview
--------
This document defines the Loom stage contract and artifact expectations used by MythosForge.

Canonical stages
---------------
- seed — initial seed and high-level parameters
- table — generate tables of options (rows)
- matrix — expand tables into matrices and variant sets
- node_generation — emit nodes (clues, scenes, hooks)
- link_nodes — produce explicit connections between nodes
- synthesize — compress nodes into structured artifacts (quests, missions)
- finalize — produce human readable text and final JSON

Artifact policy
---------------
- Every artifact MUST contain a top-level `loom` object with `stage` and `seed`.
- Artifacts SHOULD include `id` and `seed` at the artifact root.
- Output MUST include both human-friendly `text` and machine-friendly `json` when possible.

Subscription model
------------------
- Narrative Scripts and prompt skeleton files can either include YAML frontmatter `subscribes_to` or be listed in a central `loom_subscriptions.yaml` registry.

Validation
----------
- JSON Schemas live in `mythforge/docs/schema-templates/schemas/` and are used to validate synthesized artifacts.

Examples
--------
- See `samples/mission/sample.json` and `samples/node_cloud/sample.json` for canonical produced artifacts.

Next steps
----------
- Add `loom_subscriptions.yaml` entries for all Narrative Scripts.
- Implement `src/lib/loom/registry.ts` (done: lightweight dispatcher)
- Add fixtures and Vitest tests to validate outputs per schema.
