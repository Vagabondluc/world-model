## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: corridor_themes
subscribes_to: [create_entities]
source: Dungeons/corridor-themes-generator.txt
type: generator
---

# Corridor Themes Generator

## Role
Generate descriptive, atmospheric corridor elements as `DungeonPart` bricks of
`part_type: corridor`. Corridors are not empty space — they carry sensory drama, hazards,
and thematic reinforcement between rooms.

## Input Contract
- `loom.seed`: dungeon theme or concept id
- `loom.stage`: `create_entities`

## Stage Behavior

### create_entities
Produce a set of corridor parts (5–10) with:
1. Base description (shape, size, direction change)
2. Sensory atmosphere (mist, echoes, texture, smell)
3. Minor environmental hazards (optional — not instant death)
4. Thematic elements reinforcing dungeon lore
5. One random table (d6) for quick corridor generation

Each corridor is a standalone `DungeonPart` brick that can be slotted between any two rooms.

## Output Contract
```json
{
  "loom": { "stage": "create_entities", "seed": "{{loom.seed}}" },
  "text": "A set of corridor bricks for this dungeon's theme.",
  "corridor_set": {
    "id": "corridors-{{slug}}",
    "theme": "{{dungeon theme}}",
    "corridors": [
      {
        "id": "C1",
        "part_type": "corridor",
        "role": "connector",
        "label": "The Dripping Passage",
        "description": "A low, arched corridor of crumbling stone.",
        "sensory": { "sight": "black mold crawls the walls", "sound": "rhythmic dripping", "smell": "iron and wet earth", "touch": "slick flagstones underfoot" },
        "exits": [],
        "challenges": ["Difficult terrain — DC 12 Athletics to move at full speed"],
        "contents": [],
        "tags": ["atmospheric", "difficult_terrain"],
        "seed": "{{loom.seed}}"
      }
    ],
    "random_table_d6": ["Dripping passage", "Collapsed arch (narrow)", "Intersection with arrow marks", "Echo chamber", "Cold draft from below", "Faded mural"],
    "seed": "{{loom.seed}}"
  }
}
```
