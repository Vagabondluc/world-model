# Specification: Dungeon Concept Brainstormer (dungeon-concept-brainstormer)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Dungeon Detail & Expansion Suite is a multi-modal hub for dungeon design. It integrates distinct workflows: High-level Brainstorming, Structured Room Building (JP Cooper), and Sensory Detailing.

## 2. Component Architecture
### 2.1 Core Panels
- **Multimodal Hub**:
    - Switch: Concept Brainstormer, 10-Room Wizard, Corridor Studio.
- **Concept Pod**:
    - Helper tools: "Monster Manual Scan" (Denizens), "Location Twist".
- **10-Room Wizard**:
    - Conversational UI.
    - One-prompt-per-step for the JP Cooper method.
    - "Logical Follow-Through" AI checker.
- **Strctural Auditor (Xander)**:
    - Checks for Loops, Elevation Shifts.

## 3. Interaction Logic
- **"Roll X Ideas"**:
    - Embedded buttons to generate options for specific fields.
- **Thematic Bleed**:
    - Global "Theme" (e.g., Spiders) auto-populates the "Corridor Generator" sub-panel.
- **Logical Validation**:
    - Warns if Room 4 input contradicts Room 1 Theme.

## 4. Visual Design
- **Aesthetic**: Control Center (Collapsible modules).
- **Organization**: Dense but categorized.
- **Progressive Disclosure**: Advanced features (Xandering) hidden by default.

## 5. Data Model
```typescript
interface ConceptState {
  mode: 'Brainstorm' | 'Wizard' | 'Corridor';
  focus: { denizens: string; goal: string; twist: string };
  rooms: string[]; // 10 distinct room concepts
  structuralAudit: { loops: boolean; elevation: boolean };
}
```
