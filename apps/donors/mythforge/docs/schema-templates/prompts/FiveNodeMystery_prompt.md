## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
subscribes_to: ["seed", "node_generation", "link_nodes", "synthesize", "finalize"]
source: "Narrative Scripts/Execution_Systems/Mysteries/5_node_mystery.txt"
type: "multi-step"
---

# Five-Node Mystery Prompt (LLM Skeleton)

Purpose:
- Build a cohesive mystery composed of exactly five interconnected nodes (A=hook, B/C/D=investigation, E=resolution) using an external `mystery_node` generator for each node, then link and synthesise into a coherent whole.

Inputs:
- `seed` (string) — canonical seed.
- `concept` (string) — one-line mystery concept (e.g., "murder of a guild accountant").
- `tone` (string) — optional: dark, cozy, political, horror.
- `scope` (object) — optional: locale, suspects (list), victim.

Output contract:
- Top-level `mystery` (object) with: `id`, `title`, `concept`, `nodes[]` (5 objects: id A–E, type, summary, detail, clues[], connections[]), `connections[]` (explicit {from,to,reason}), `resolution`, `seed`.
- Top-level `text` (string) GM-facing mystery brief with three-clue-rule note.

Stage guidance:
- `seed`: Normalise concept, victim, perpetrator, motive, method, tone.
- `node_generation`: Produce each node A–E. Node A = hook/intro. Nodes B–D = investigative beats, each in a different location with unique clues. Node E = climax/revelation.
- `link_nodes`: For each pair of connected nodes, produce a `connections[]` entry {from,to,reason}. Node A must connect to B, C, and D. B/C/D each connect to E.
- `synthesize`: Merge nodes + connections into the final `mystery` artifact. Verify three-clue rule (at least 3 clues in A point to B/C/D).
- `finalize`: Polish GM text; add ancillary revelations and reincorporation notes.

Prompt template:
"You are a mystery architect following the five-node mystery method. Given seed `{{seed}}`, concept `{{concept}}`, tone `{{tone}}`, and scope `{{scope}}`, generate a `mystery` JSON object with exactly 5 nodes (ids A–E). Node A introduces the mystery with at least three clues pointing to B, C, D. Nodes B–D are distinct investigation sites with unique challenges. Node E is the resolution/confrontation. Produce `connections[]` for all inter-node links. Also produce `text` as a GM brief. Ensure the three-clue rule is followed and the mystery is solvable through any node path."
