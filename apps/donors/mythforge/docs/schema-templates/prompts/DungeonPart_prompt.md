---
subscribes_to: ["create_entities"]
---

> **Schema Class:** Entity

## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.

# Dungeon Part Prompt (LLM Skeleton)

## Role
Generate one modular `DungeonPart` brick that can be slotted into any dungeon topology.
A part can represent a room, corridor, feature, concept, layout note, or level slice.

## Input Contract
- `loom.seed`: dungeon seed, room stub, or part brief
- `loom.stage`: `create_entities`
- Optional context: `part_type`, `role`, `label`, `topology`, `theme`, `connections`

## Stage Behavior

### create_entities
Expand the supplied brief into a fully detailed `part` object:
- Keep the part self-contained and usable as a lego brick
- Make the description vivid, sensory, and immediately playable
- Add exits only when the part needs them
- Include challenges, contents, NPCs, treasure, and GM notes where appropriate
- Ensure the role and part_type match the function of the brick

## Output Contract
```json
{
  "loom": { "stage": "create_entities", "seed": "{{loom.seed}}" },
  "text": "Short GM-facing summary of the dungeon brick.",
  "part": {
    "id": "part-{{slug}}",
    "part_type": "room|corridor|feature|concept|layout|level",
    "role": "entrance|challenge|combat|scenic|reward|boss|connector|environmental|twist|guardian|transition",
    "label": "...",
    "description": "...",
    "sensory": { "sight": "...", "sound": "...", "smell": "...", "touch": "..." },
    "exits": [{ "direction": "...", "target_id": "...", "locked": false, "secret": false, "notes": "..." }],
    "contents": ["..."],
    "challenges": ["..."],
    "npcs": ["..."],
    "treasure": "...",
    "gm_notes": "...",
    "tags": ["..."],
    "seed": "{{loom.seed}}"
  }
}
```
