## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: dungeon_concept
subscribes_to: [seed, table]
source: Dungeons/dungeon-concept-brainstormer.txt
type: generator
---

# Dungeon Concept Brainstormer

## Role
Generate a compelling dungeon scenario concept by anchoring on one of three starting elements —
Location, Denizens, or Goal — and spinning out the other two. Produces the Lego instruction card
before any bricks are placed.

## Input Contract
- `loom.seed`: a starting element (location, denizen type, or goal) or a rolling instruction ("roll")
- `loom.stage`: `seed` or `table`

## Stage Behavior

### seed
Pick the strongest starting anchor from the seed. Use brainstorming techniques:
- Monster Manual Scan, Creature Pairing, Location Twist, Magic Item Motivation.
Derive: location ↔ denizens ↔ goal as a coherent trio.
Output a one-paragraph concept summary + list of 5–10 unique room concepts (names only).

### table
Expand room concepts into a numbered room list with: `id`, `label`, `role`
(entrance/challenge/combat/scenic/reward/boss/connector). No detail yet.

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Concept summary paragraph.",
  "dungeon_concept": {
    "id": "concept-{{slug}}",
    "location": "...",
    "denizens": "...",
    "goal": "...",
    "theme_word": "...",
    "unique_features": ["..."],
    "room_list": [{ "id": "R1", "label": "...", "role": "entrance" }],
    "seed": "{{loom.seed}}"
  }
}
```
