## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: five_by_five_campaign
subscribes_to: [seed, node_generation, create_entities, link_nodes, synthesize, finalize]
source: Mysteries/5x5_mystery_campaign.txt
type: method
---

# 5×5 Mystery Campaign

## Role
Design a meta-campaign composed of five interconnected 5-Node Mysteries. Each mystery is a
campaign node; together they form a campaign-level 5-Node structure. Requires `FiveNodeMystery_prompt`
as the inner builder.

## Input Contract
- `loom.seed`: overarching campaign premise (central villain, cosmic stakes, genre)
- `loom.stage`: which phase to run

## Stage Behavior

### seed
Generate the campaign-level concept: what connects all five mysteries?
- Central antagonist or conspiracy
- Overarching revelation the players build toward
- Campaign tone and genre mix

### node_generation
Create five mystery stubs (A–E), each with:
- Unique concept, setting, cast of characters
- Mystery type: murder / theft / conspiracy / supernatural / political
Arrange them: A points to B,C,D; B,C,D point to each other and E; E is the culmination.

### create_entities
Expand each mystery stub using `FiveNodeMystery_prompt` at `seed` stage.
Name files: `5NodeMystery_[Name]_[Number]`.

### link_nodes
For each mystery, create ≥3 inter-mystery clues pointing to other mysteries.
Spread clues across nodes within each mystery.
Develop recurring elements: NPCs, locations, or themes crossing multiple mysteries.

### synthesize
Produce campaign-level documents:
- Inter-mystery connections map
- Overarching narrative summary
- Recurring elements manifest
- Escalation curve (complexity + stakes increase toward E)

### finalize
Master campaign overview: summary of each mystery, key connections, overarching narrative,
running suggestions, flexible entry points (campaign startable from any of A–D).

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "5×5 campaign overview — five mysteries, one conspiracy.",
  "campaign_5x5": {
    "id": "5x5-{{slug}}",
    "overarching_narrative": "...",
    "central_antagonist": "...",
    "mysteries": [
      { "id": "A", "title": "...", "type": "murder", "setting": "...", "connections_to": ["B","C","D"] },
      { "id": "E", "title": "...", "type": "conspiracy", "setting": "...", "is_culmination": true }
    ],
    "inter_mystery_clues": [
      { "found_in": "A", "node": "A-Node2", "points_to": "B", "clue": "..." }
    ],
    "recurring_elements": [{ "type": "NPC", "name": "...", "appears_in": ["A","C","E"] }],
    "escalation_notes": "...",
    "seed": "{{loom.seed}}"
  }
}
```
