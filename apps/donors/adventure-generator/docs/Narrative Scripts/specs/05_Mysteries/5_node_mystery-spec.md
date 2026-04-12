# Specification: 5-Node Mystery Architect (5_node_mystery)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The 5-Node Mystery Architect is a tool for building linear-branching mysteries (The "Five-Node Design"). It focuses on the Node Graph (A->B->C->D->E) and the "Who/What/Why" scenario definition.

## 2. Component Architecture
### 2.1 Core Panels
- **Node Graph**:
    - Visual map (A:Hook, B:Location, C:Location, D:Location, E:Climax).
    - Canvas interactions (click node to edit).
- **Scenario Details**:
    - Form: Victim, Perp, Motive, Method.
- **Node Editor**:
    - Active Node details.
    - Clue list (with outbound targets).
- **Consistency Tools**:
    - "3-Clue Rule" Validator.

## 3. Interaction Logic
- **Connections**:
    - Clues in Node A must point to B, C, or D.
- **Node Generation**:
    - "Generate All Files" creates 5 text files based on the scenario data.
- **Graph Navigation**:
    - Clicking a link shows the clues connecting those nodes.

## 4. Visual Design
- **Aesthetic**: Noir Investigation Board (Pins & String).
- **Status Icons**: Warning triangles for missing clues.

## 5. Data Model
```typescript
interface Mystery5Node {
  title: string;
  concept: { victim: string; perp: string; motive: string };
  nodes: { [key: string]: NodeData }; // Keys: A, B, C, D, E
}

interface NodeData {
  id: string; // 'A'
  title: string;
  type: 'Hook' | 'Discovery' | 'Climax';
  clues: Clue[];
}

interface Clue {
  description: string;
  targetNodeId: string;
}
```
