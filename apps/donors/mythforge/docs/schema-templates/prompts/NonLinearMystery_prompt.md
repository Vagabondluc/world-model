## Container Vocabulary

- UUID container: the persistent entity instance being authored or projected.
- Schema binding: the contract attached to the UUID for this template.
- Projection: the JSON payload the model should emit for the bound schema.
- Events: append-only history stored outside this file.
- Native schema: a code-backed runtime contract.
- Project schema: a file-backed template in docs/schema-templates/.
- Auxiliary context: loom and text can appear when the prompt requires them, but they are not the container itself.
---
id: non_linear_mystery
subscribes_to: [seed, node_generation, link_nodes, synthesize]
source: Mysteries/non-linear_mystery.txt
type: method
---

# Non-Linear Mystery Structure Builder

## Role
Design the structural topology of a mystery investigation. Supports five topologies:
Conclusion, Funnel, Layer Cake, Loop, Dead End. Uses `mystery_node.txt` (MysteryNode) as
the atomic brick. The Three Clue Rule is enforced throughout.

## Input Contract
- `loom.seed`: mystery premise + chosen topology
- `loom.stage`: which phase to run

## Stage Behavior

### seed
Choose topology and explain its implication:
- **Conclusion**: all investigation nodes feed a central concluding node
- **Funnel**: layers narrow toward "neck" nodes
- **Layer Cake**: layers representing depth of mystery; movement in both directions
- **Loop**: 4–6 nodes in a circular path, explorable in any order
- **Dead End**: within any structure, one node is a satisfying dead end

### node_generation
Generate node stubs for chosen topology:
- Conclusion: 1 concluding node (D) + 3–4 investigation nodes
- Funnel: 2–3 layers of 3–4 nodes each, neck nodes as gateways
- Layer Cake: 2–4 layers of 3–4 inter-connected nodes
- Loop: 4–6 nodes in circular arrangement, multiple entry points
- Dead End: designate 1 node in any structure as dead end with reward

### link_nodes
Apply Three Clue Rule: every essential node has ≥3 inbound clue paths.
Wire all inter-node connections. For dead-end: add 1–2 clues pointing to it from other nodes.

### synthesize
Produce the complete node-structure document with all connections verified.
Include proactive node hook: when/how to trigger it if players get stuck.

## Output Contract
```json
{
  "loom": { "stage": "{{loom.stage}}", "seed": "{{loom.seed}}" },
  "text": "Mystery topology summary — structure and clue flow described.",
  "mystery_structure": {
    "id": "mstruct-{{slug}}",
    "topology": "conclusion|funnel|layer_cake|loop|dead_end",
    "mystery_title": "...",
    "nodes": [
      { "id": "A", "label": "The Abandoned Warehouse", "type": "investigation|conclusion|dead_end", "clues_inbound": ["from B", "from C", "from D"] }
    ],
    "connections": [
      { "from": "A", "to": "B", "clue": "A bloodied glove bearing the merchant's seal" }
    ],
    "three_clue_check": { "all_essential_nodes_have_3_clues": true },
    "dead_end": { "node_id": "E", "reward": "Floor safe with 200gp and a red herring letter" },
    "proactive_node": { "trigger": "Players stuck for 2 sessions", "clue_provided": "..." },
    "seed": "{{loom.seed}}"
  }
}
```
