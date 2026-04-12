## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: pointyhat_dungeon
subscribes_to: [seed, table, create_entities, synthesize, finalize]
source: Dungeons/DungeonCreation_PointyHat_v1.txt
type: method
---

# PointyHat Dungeon Creation Method

## Role
Thematic dungeon builder using Pointy Hat's 5-step framework: Theme → Mechanics → Goal →
Encounters → Ending. Every choice is anchored to the one-word theme so dungeon feels
internally coherent. Produces a `DungeonAssembly` with `topology: pointyhat`.

## Input Contract
- `loom.seed`: one-word theme (e.g. "Decay", "Hunger", "Silence") OR a premise
- `loom.stage`: which phase to run

## Stage Behavior

### seed
Extract or assign theme word. Define what the theme means mechanically and narratively.

### table
Select ≥2 game mechanics that embody the theme (e.g. "Decay" → all food spoils, healing halved).
Set player goal — clear, achievable, thematically resonant.

### create_entities
Design 5–10 encounters around theme:
- Combat: monsters that embody the theme
- Puzzle: mechanical puzzle using the theme's mechanic
- Trap: environmental hazard expressive of theme
- Roleplay: NPC or faction shaped by the theme

### synthesize
Design the ending encounter: climactic scene that synthesizes theme, mechanics, and narrative.

### finalize
Write full PointyHat dungeon doc with all five steps filled in, ready to run.

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Dungeon concept summary anchored to theme.",
  "dungeon": {
    "id": "ph-{{slug}}",
    "title": "...",
    "theme": "Decay",
    "topology": "pointyhat",
    "goal": "Retrieve the Seed of Renewal before the dungeon consumes itself.",
    "creator_lore": "...",
    "mechanics": ["All food and healing items spoil each long rest", "Rot damage on critical fails"],
    "parts": [
      { "id": "R1", "part_type": "room", "role": "entrance", "label": "The Rotting Gates", "description": "..." }
    ],
    "connections": [],
    "gm_advice": "...",
    "seed": "{{loom.seed}}"
  }
}
```
