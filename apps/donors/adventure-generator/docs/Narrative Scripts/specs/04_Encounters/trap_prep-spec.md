# Specification: Trap Architect (trap_prep)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Trap Architect is a generator for complex, fair hazards using a 4-part logic: Clue, Trigger, Danger, Obscure. It emphasizes "Staged" resolution (Warning -> Action -> Impact).

## 2. Component Architecture
### 2.1 Core Panels
- **Component Matrix**:
    - 6 options for each column (Clue, Trigger, etc.).
    - Roll buttons for randomization.
- **Active Trap Card**:
    - Synthesized description.
- **Sequence Visualizer**:
    - Stage 1 (Warning), Stage 2 (Action), Stage 3 (Impact).
- **Resolution Panel**:
    - DC checks and Save Types.

## 3. Interaction Logic
- **Matrix Randomization**:
    - "Generate 3x4 Matrix" creates a subset of options.
- **Theme Application**:
    - "Apply Theme" (e.g. Temple) filters the matrix keywords (e.g. "Lasers" -> "Darts").

## 4. Visual Design
- **Aesthetic**: Hazard Warning (Yellow/Black stripes logic).
- **Sequence**: Timeline view for the 3 stages.

## 5. Data Model
```typescript
interface Trap {
  theme: string;
  components: { clue: string; trigger: string; danger: string; obscure: string };
  stages: { warning: string; action: string; impact: string };
  mechanics: { dc: number; save: string; damage: string };
}
```
