# Specification: Proactive Node Architect (proactive_mystery_node)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Proactive Node Architect designs "Safety Net" scenes triggered when players get stuck. It features conditional logic (Early/Mid/Late phase) and "Back-to-Path" lead mapping.

## 2. Component Architecture
### 2.1 Core Panels
- **Trigger Manager**:
    - Checkbox list of triggers (e.g., "Stalled for 2 hours").
- **Phase Switcher**:
    - Slider: Early -> Mid -> Late.
    - Updates content accordingly.
- **Lead Mapper**:
    - Links clues back to Main Nodes (A, B, C).
- **NPC Logic**:
    - Dynamic dialogue based on phase.

## 3. Interaction Logic
- **Adaptive Leads**:
    - UI suggests leads based on "Missed Clues" (if linked to campaign state).
- **Preview**:
    - Real-time text preview of the "Note/Message" content for the selected phase.

## 4. Visual Design
- **Aesthetic**: Emergency / Rescue (Gold/Orange).
- **Icons**: "Return to Track" symbol on leads.

## 5. Data Model
```typescript
interface ProactiveNode {
  id: string;
  triggers: string[];
  phases: { early: string; mid: string; late: string };
  leads: ProactiveLead[];
  npc: string;
}

interface ProactiveLead {
  description: string;
  targetNode: string;
}
```
