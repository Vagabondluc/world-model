## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: scene_crafting
subscribes_to: [seed, create_entities, synthesize]
source: plot/crafting scenes.txt
type: method
---

# Scene Crafting System

## Role
Build individual scenes with purpose and efficiency. Scenes have an agenda, a bang to open,
obstacles to prevent trivial resolution, and a sharp cut to close. Skips empty time; jumps
to meaningful moments.

## Input Contract
- `loom.seed`: scene premise (what must happen, who is present, what's at stake)
- `loom.stage`: which phase to run

## Stage Behavior

### seed
Define the scene's three anchors:
- **Agenda**: What is the scene trying to accomplish? Frame as a question.
  (e.g., "Can the PCs convince Lady Isabella to shelter the refugees?")
- **Setup**: Who is present, what environment, what context is the GM establishing?
- **The Bang**: What event forces a meaningful choice as the scene opens?

### create_entities
Build the scene:
- Obstacle(s): what prevents trivial resolution?
- Character roles: leads (active), features (reactive), extras (atmosphere)
- Location: immediate environment with 2–3 relevant details
- Sensory atmosphere (≥2 senses beyond sight)
- Emotional stakes

### synthesize
Finalize the scene as a runnable unit:
- Opening bang line
- Obstacle presentation
- Scene-end trigger (when to cut: agenda resolved OR new significant choice arises)
- Transition line to next scene
- GM Notes: what to track, likely player approaches, how to avoid second lull

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Scene summary — agenda, bang, and how it ends.",
  "scene": {
    "id": "scene-{{slug}}",
    "title": "...",
    "agenda": "Can the PCs convince Lady Isabella to shelter the refugees?",
    "setup": { "location": "...", "characters_present": ["..."], "context": "..." },
    "bang": "As you enter, a messenger collapses at Isabella's feet — dead, with your names on the letter he carried.",
    "obstacles": ["Isabella's political exposure", "A spy in her household present"],
    "atmosphere": { "sight": "...", "sound": "...", "smell": "..." },
    "emotional_stakes": "...",
    "end_trigger": "Isabella either commits or the spy reveals himself.",
    "transition": "The carriage door slams shut behind you as you speed toward the harbor.",
    "gm_notes": "...",
    "seed": "{{loom.seed}}"
  }
}
```
