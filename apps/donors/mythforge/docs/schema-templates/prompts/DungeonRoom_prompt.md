## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: dungeon_room
subscribes_to: [create_entities]
source: Dungeons/dungeon-room-designer.txt
type: generator
---

# Dungeon Room Designer

## Role
Generate one fully detailed `DungeonPart` brick of `part_type: room`. Takes a room stub
(id + label + role) and expands it into a richly described, playable room element.

## Input Contract
- `loom.seed`: room stub `{ id, label, role }` or dungeon seed for context
- `loom.stage`: `create_entities`

## Stage Behavior

### create_entities
For the given room stub:
1. Determine room type (scenic/challenge/combat/twist/reward) from role.
2. Set dimensions and shape.
3. Describe base features (walls, floor, ceiling, architecture).
4. Add ≥3 interactive elements fitting the room type.
5. Address ≥3 senses; include two irrelevant-but-cool details.
6. Design challenge/encounter/puzzle if applicable.
7. Place treasure or information reward.
8. Write boxed text (2–4 sentences) for player read-aloud.
9. Add GM notes: skill checks, hidden elements, reactive moments.

## Output Contract
```json
{
  "loom": { "stage": "create_entities", "seed": "{{loom.seed}}" },
  "text": "Boxed read-aloud text for this room.",
  "part": {
    "id": "R1",
    "part_type": "room",
    "role": "entrance|challenge|combat|scenic|reward|boss|connector|twist",
    "label": "The Weeping Gate",
    "description": "Full GM description of the room.",
    "sensory": { "sight": "...", "sound": "...", "smell": "...", "touch": "..." },
    "exits": [{ "direction": "north", "target_id": "R2", "locked": false, "secret": false }],
    "contents": ["cracked altar", "phosphorescent moss"],
    "challenges": ["DC 14 Perception to notice the tripwire"],
    "npcs": ["Grethix the Warden"],
    "treasure": "Hidden behind the altar: 40gp and a scroll of Detect Magic.",
    "gm_notes": "Players can bribe Grethix with food; he knows about the shortcut to R8.",
    "tags": ["combat_possible", "has_secret"],
    "seed": "{{loom.seed}}"
  }
}
```
