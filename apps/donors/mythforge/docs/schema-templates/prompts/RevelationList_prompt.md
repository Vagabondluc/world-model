## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: revelation_list
subscribes_to: [synthesize]
source: Mysteries/revelations_dm_aid.txt
type: descriptor
---

# Revelation List — DM Aid

## Role
Organize all clues and their sources into a GM-facing cross-reference document.
Answers "which clues lead to this node, and where are they found?" at a glance.
Enforces the Three Clue Rule by making gaps visible.

## Input Contract
- `loom.seed`: adventure summary or mystery id with all nodes listed
- `loom.stage`: `synthesize`

## Stage Behavior

### synthesize
From the provided adventure summary or mystery structure:
1. List all nodes as headings.
2. For each node: list every clue that points to it + where that clue is found.
3. Cross-reference: `(Found in Node B: The Police Station)`.
4. Flag any node with fewer than 3 inbound clues as needing more.
5. Add Proactive Nodes section at end: triggers + clues provided.
6. Final check: verify all cross-references are accurate and flow allows multiple paths.

## Output Contract
```json
{
  "loom": { "stage": "synthesize", "seed": "{{loom.seed}}" },
  "text": "Complete revelation list for GM reference — all clue paths mapped.",
  "revelation_list": {
    "id": "rlist-{{slug}}",
    "mystery_title": "...",
    "nodes": [
      {
        "node_id": "A",
        "label": "Node A: The Abandoned Warehouse",
        "clues_leading_here": [
          { "description": "A bloodied glove with the merchant's seal", "found_in": "Node C: The Dockmaster's Office" },
          { "description": "Witness account from the innkeeper", "found_in": "Node B: The Inn" },
          { "description": "Shipping manifest with the address", "found_in": "Node D: The Customs House" }
        ],
        "three_clue_satisfied": true
      }
    ],
    "proactive_nodes": [
      { "label": "Proactive Node 1: The Informant", "trigger": "Players stuck >1 session", "clues_provided": ["Points to A", "Points to D"] }
    ],
    "seed": "{{loom.seed}}"
  }
}
```
