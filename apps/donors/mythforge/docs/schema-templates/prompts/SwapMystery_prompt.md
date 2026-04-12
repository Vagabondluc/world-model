## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: swap_mystery
subscribes_to: [seed, create_entities, link_nodes, synthesize]
source: Mysteries/swap_mystery.txt
type: method
---

# Scenario Swap — Mystery Node Replacer

## Role
Replace any adventure node within a campaign structure (typically a 5-Node Mystery) with a
different scenario type — dungeon crawl, heist, investigation, social intrigue, or wilderness
exploration — while preserving all narrative connections and inter-mystery clue flow.

## Input Contract
- `loom.seed`: campaign id + target mystery slot to replace + replacement scenario type
- `loom.stage`: which phase to run

## Stage Behavior

### seed
Identify:
- Which mystery/slot is being replaced and why (variety, player request, tone shift)
- All existing connections and clues linking it to other parts of the campaign
- Replacement type: dungeon | heist | investigation | social_intrigue | wilderness

### create_entities
Use the appropriate domain prompt to generate the replacement scenario:
- Dungeon → `DungeonComposer_prompt`
- Heist → `HeistRunning_prompt`
- Social → `SocialEvent_prompt`
- Wilderness → `WildernessTravel_prompt`
- Investigation → `FiveNodeMystery_prompt`

Add "artificial nodes" (decision points, info hubs) that replicate the mystery node structure
so clue flow is preserved. Ensure multiple paths for non-linearity.

### link_nodes
Wire all inbound clues from other campaign parts to entry points in the new scenario.
Generate ≥3 new outbound clues pointing to other campaign mysteries.
Update any clue descriptions that need reframing for the new scenario type.

### synthesize
Update the campaign's recurring elements to include anything introduced by new scenario.
Write a transition guide for GM: how to shift tone/pacing from mystery → new type.
Update campaign overview document references.

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Scenario swap summary — what replaced what and how connections were preserved.",
  "scenario_swap": {
    "id": "swap-{{slug}}",
    "replaced_slot": "Mystery B",
    "replacement_type": "heist",
    "replacement_scenario_id": "heist-run-{{slug}}",
    "inbound_clues_rewired": [
      { "from": "Mystery A, Node 3", "original_clue": "...", "rewired_to": "Entry point E1 of heist" }
    ],
    "outbound_clues": [
      { "found_in": "Heist location, vault room", "points_to": "Mystery C", "clue": "..." }
    ],
    "transition_guide": "Shift tone from cerebral investigation to action-heist by ...",
    "seed": "{{loom.seed}}"
  }
}
```
