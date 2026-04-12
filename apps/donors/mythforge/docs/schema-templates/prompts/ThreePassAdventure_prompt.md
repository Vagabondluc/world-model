## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
subscribes_to: ["seed", "create_entities", "synthesize", "finalize"]
source: "Narrative Scripts/Execution_Systems/adventures/Three-Pass Adventure Creation Method.txt"
type: "multi-step"
---

# Three-Pass Adventure Prompt (LLM Skeleton)

Purpose:
- Generate a complete, playable adventure across three refinement passes (narrative → mechanical → presentational), each building on and persisting the previous.

Inputs:
- `seed` (string) — canonical seed.
- `pass` (1|2|3) — which pass to execute.
- `adventure` (object, optional) — partial adventure artifact from a prior pass (required for pass 2+).
- `scope` (object) — optional constraints: level_range, tone, locale, theme.

Output contract:
- Top-level `adventure` (object) with: `id`, `title`, `premise`, `objective`, `setting`, `macguffin`, `rival`, `doomsday_clock`, `scenes[]`, `mechanics[]`, `presentation`, `seed`.
- Top-level `text` (string) with GM narrative summary.
- Top-level `pass` (number) indicating which pass this artifact represents.

Stage guidance:
- `seed`: Accept seed, scope, and pass number. If pass 1, initialise a blank `adventure` shell.
- `create_entities` (pass 1): Expand premise, objective, setting, MacGuffin, rival, doomsday clock, and scene outlines. Narrative only — no mechanics yet.
- `synthesize` (pass 2): Take pass-1 artifact; add mechanical elements to each scene: DCs, stat blocks, rewards, complication rules.
- `finalize` (pass 3): Take pass-2 artifact; format for table use — boxed text, quick-reference sidebar, GM advice block.

Prompt template:
"You are an adventure architect. Given seed `{{seed}}`, pass `{{pass}}`, prior state `{{adventure}}`, and scope `{{scope}}`, produce a JSON object `adventure` following the output contract. For pass 1, output narrative elements only. For pass 2, add mechanical elements to every scene without removing narrative content. For pass 3, reformat all content for GM usability (boxed read-aloud, stat sidebars, reward summary). Always include a root `text` field with a concise GM brief. Ensure all IDs are short strings and `seed` is present."
