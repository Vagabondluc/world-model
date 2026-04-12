## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
subscribes_to: ["seed", "matrix", "create_entities", "link_nodes", "synthesize", "finalize"]
source: "Narrative Scripts/Execution_Systems/Dungeons/DungeonDesign_5Room_v1.txt"
type: "multi-step"
---

# Five-Room Dungeon Prompt (LLM Skeleton)

Purpose:
- Generate a complete 5-room dungeon with a canonical room structure: Entrance/Guard, Puzzle/RP, Trick/Setback, Climax/Battle, Reward/Revelation.

Inputs:
- `seed` (string) — canonical seed.
- `theme` (string) — dungeon theme (e.g., "abandoned dwarven forge", "elven tomb").
- `level_range` (string) — e.g., "3-5".
- `tone` (string) — optional: dark, ruins, whimsical, horror.

Output contract:
- Top-level `dungeon` with: `id`, `title`, `theme`, `rooms[]` (5 objects, one per canonical room type), `connections[]`, `traps[]`, `rewards`, `seed`.
- Each room: `id`, `type` (entrance|puzzle|trick|climax|reward), `title`, `description`, `encounters[]`, `features[]`, `exits[]`.
- Top-level `text` GM brief.

Stage guidance:
- `seed`: Accept theme, level, tone; derive mood for each room.
- `matrix`: Produce a 5-row option matrix (room type × feature options).
- `create_entities`: Expand each of the 5 rooms as full room objects.
- `link_nodes`: Connect rooms via `exits[]` and `connections[]`.
- `synthesize`: Assemble the full `dungeon` artifact.
- `finalize`: Polish descriptions; add read-aloud boxed text per room.

Prompt template:
"You are a dungeon architect. Given seed `{{seed}}`, theme `{{theme}}`, level range `{{level_range}}`, and tone `{{tone}}`, produce a JSON object `dungeon` with exactly 5 rooms: entrance_guard, puzzle_rp, trick_setback, climax_battle, reward_revelation. Each room has id, type, title, description, encounters, features, and exits. Produce `connections[]` between adjacent rooms. Include traps, rewards, and a root `text` GM brief. All IDs short strings; `seed` present at root."
