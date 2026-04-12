## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: scene_descriptor
subscribes_to: [seed, synthesize]
source: plot/SceneDescriptor_v1.txt
type: descriptor
---

# Scene Descriptor

## Role
Generate a structured scene description for GM use: bullet-point details, vivid player-facing
prose, and GM operational notes. System-agnostic and genre-flexible.

## Input Contract
- `loom.seed`: scene type, genre/setting, location/situation, and key elements to include
- `loom.stage`: `seed` or `synthesize`

## Stage Behavior

### seed
Parse the scene request:
- Genre/Setting: fantasy, sci-fi, horror, etc.
- Location/Situation: what kind of place or moment
- Key elements: characters/creatures/objects present
- Goals/Challenges/Events integral to the scene
- Atmospheric details to emphasize

### synthesize
Produce the three-part scene document:

**Scene Description** (player-facing):
- Bullet points of important details
- Explanation paragraph turning bullets into vivid immersive prose
- Addresses ≥3 senses; uses active verbs; avoids info dumps

**Game Master Information**:
- What the GM needs to know to run this scene
- Hidden elements, DCs, timing, NPC motivations

**Key Points for Running the Scene**:
- Bullet checklist of operational priorities for GM

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Player-facing scene description (prose).",
  "scene_descriptor": {
    "id": "sdesc-{{slug}}",
    "genre": "...",
    "location": "...",
    "detail_bullets": ["..."],
    "player_description": "Full vivid prose paragraph.",
    "gm_information": "...",
    "atmosphere_notes": { "sight": "...", "sound": "...", "smell": "..." },
    "key_running_points": ["..."],
    "seed": "{{loom.seed}}"
  }
}
```
