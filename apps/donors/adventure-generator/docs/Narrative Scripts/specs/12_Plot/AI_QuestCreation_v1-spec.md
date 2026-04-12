# Specification: AI Storyteller Dashboard (AI_QuestCreation_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The AI Storyteller Dashboard manages an AI-driven roleplay session. It features a "Narrative Feed" with subjective layers, "Constraint-Based Evaluation" for user actions, and a "Tension Meter."

## 2. Component Architecture
### 2.1 Core Panels
- **Storyteller Feed**:
    - Main text (Objective description).
    - Subjective Overlay (Character thoughts).
- **Environment Logic**:
    - Established Facts (Consistency check).
- **Task Evaluation**:
    - Input: Intention + Action.
    - Output: Difficulty (DC) + Result.
- **Tension Meter**:
    - Visual bar (0-100%).

## 3. Interaction Logic
- **Subjective Layering**:
    - Toggling "Subjective" injects inner monologue or memory cues into the feed.
- **Evaluation Engine**:
    - Classifies actions as "Effortless" or "Complex" based on context.
- **Conflict Mode**:
    - Switches UI layout for tactical sequencing.

## 4. Visual Design
- **Aesthetic**: Cinematic / Terminal (Sci-Fi) or Ledger (Fantasy).
- **Layout**: Dual-Focus (Narrative vs Logic).

## 5. Data Model
```typescript
interface AIStorySession {
  context: string;
  narrativeHistory: LogEntry[];
  tension: number;
  facts: string[];
  lastAction: { intention: string; result: string };
}
```
