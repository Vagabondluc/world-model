## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: dungeon_features
subscribes_to: [synthesize]
source: Dungeons/dungeon-features-summarizer.txt
type: descriptor
---

# Dungeon Features Summarizer

## Role
Generate the global features block that applies to the entire dungeon — the shared physical
and atmospheric constants that GM reads once and keeps in mind for every room.
Feeds into `DungeonKey_prompt` and the final `DungeonAssembly.global_features`.

## Input Contract
- `loom.seed`: dungeon concept or seed string
- `loom.stage`: `synthesize`

## Stage Behavior

### synthesize
Collate and define dungeon-wide constants:
- Illumination (torches, bioluminescent moss, pitch dark, flickering sconces)
- Ceiling heights (vary by zone if needed)
- Wall and floor materials (stone type, condition)
- Temperature and climate (chill, humid, volcanic warmth)
- Persistent sounds (dripping, distant growls, wind through shafts)
- Persistent smells (mold, sulfur, rot, incense)
- Special magical/technological systems affecting multiple rooms
- Any dungeon-specific quirks (gravity shifts, echo magic, cursed ground)

## Output Contract
```json
{
  "loom": { "stage": "synthesize", "seed": "{{loom.seed}}" },
  "text": "Quick-reference features paragraph for GM.",
  "dungeon_features": {
    "id": "features-{{slug}}",
    "illumination": "...",
    "ceiling_height": "...",
    "wall_material": "...",
    "floor_material": "...",
    "temperature": "...",
    "atmosphere": "...",
    "persistent_sounds": ["..."],
    "persistent_smells": ["..."],
    "special_systems": ["..."],
    "dungeon_quirks": ["..."],
    "seed": "{{loom.seed}}"
  }
}
```
