# Specification: Mystery Structure Architect (non-linear_mystery)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Mystery Structure Architect (Framework Editor) allows DMs to build specific structures (Loop, Funnel, Dead End) for their mystery. It manages the connections and "break conditions" of a 4-6 node graph.

## 2. Component Architecture
### 2.1 Core Panels
- **Framework Template Library**:
    - Selectable presets (Loop, Funnel, Layer Cake).
- **Structure Graph**:
    - Interactive canvas enforcing logic (e.g., Loop = circle).
    - Connection types (Standard, Proactive Trigger).
- **Configuration Panel**:
    - Node Type (Investigation vs Dead End).
    - Clue definition.
- **Loop-Break Logic**:
    - Define exit conditions ("Found 4/6 clues").

## 3. Interaction Logic
- **Neck-Node Validation**:
    - Highlights critical nodes in Funnel structure.
- **Dead-End Decorator**:
    - Adds "Compensatory Reward" field if node type is "Dead End".
- **Filename Preview**:
    - Shows generated name (e.g., `_Loop_A.txt`).

## 4. Visual Design
- **Aesthetic**: Blueprint CAD.
- **Indicators**: Animated pulses for "Essential Paths".

## 5. Data Model
```typescript
interface NonLinearMystery {
  title: string;
  framework: 'Loop' | 'Funnel' | 'LayerCake';
  nodes: StructureNode[];
  settings: { breakCondition: string; entryPoints: string[] };
}

interface StructureNode {
  id: string;
  type: string;
  clues: string[];
  isDeadEnd?: boolean;
}
```
