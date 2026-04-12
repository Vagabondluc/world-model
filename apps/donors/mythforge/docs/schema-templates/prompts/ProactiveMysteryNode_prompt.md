## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: proactive_mystery_node
subscribes_to: [node_generation, synthesize]
source: Mysteries/proactive_mystery_node.txt
type: generator
---

# Proactive Mystery Node

## Role
Create a flexible, trigger-ready mystery node that the GM can deploy at any point in an
investigation to re-engage stuck players. Content adapts based on when it is triggered.
Uses `mystery_node.txt` as the base brick.

## Input Contract
- `loom.seed`: mystery id or premise + name/identifier for this proactive node
- `loom.stage`: `node_generation` or `synthesize`

## Stage Behavior

### node_generation
Create the proactive node (extends standard MysteryNode) with:
- Multiple trigger conditions (players stuck / key clue missed / time elapsed)
- Dynamic content variations (different information depending on investigation stage)
- NPC(s) who can provide info relevant to multiple investigation stages
- Environmental elements that reveal different information based on trigger timing

### synthesize
Finalize integration instructions:
- At what stage should the GM trigger it?
- Which clues does it provide, pointing to which nodes?
- Consequences on the scenario after it fires
- Ensure ≥3 distinct clue paths back to main scenario

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Proactive node ready — deployable at multiple investigation stages.",
  "proactive_node": {
    "id": "proactive-{{slug}}",
    "label": "The Informant Surfaces",
    "trigger_conditions": [
      "Players have spent >1 session without finding new leads",
      "Players have missed Node B and Node C both",
      "More than 3 in-game days have passed"
    ],
    "npc": { "name": "Mira Ashveil", "role": "reluctant witness", "motivation": "Fears the killer will come for her next" },
    "dynamic_content": [
      { "trigger": "early", "clue": "Points toward Node A (the warehouse)" },
      { "trigger": "mid", "clue": "Points toward Node D (the conspiracy)" },
      { "trigger": "late", "clue": "Directly names the culprit if players are completely lost" }
    ],
    "clues_to_main_scenario": ["Points to A", "Points to C", "Points to D"],
    "integration_notes": "Deploy in a neutral public location — tavern, market, temple.",
    "seed": "{{loom.seed}}"
  }
}
```
