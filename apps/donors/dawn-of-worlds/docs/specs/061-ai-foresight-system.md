# 061 - AI Foresight System (Readiness Gating)

## 1. Core Philosophy
**Pressure creates Options. Foresight decides Timing.**

The AI does not blindly act on pressure. It generates an **Option** (Potential Plan) and evaluates its **Readiness**.
If `Readiness < Threshold`, the AI **WAITS** and **PREPARES**.

> "Wait" is a first-class action. It enables plotting, gathering strength, and striking only when the window is open.

---

## 2. The Readiness Algebra (Amplify)
Readiness is not a feeling; it is a calculated probability of success.

```typescript
Readiness = (Capability * 0.4) + (Opportunity * 0.3) + (Confidence * 0.2) + (Timing * 0.1)
// Multiplied by Personality Modifiers
```

### 2.1. Capability (Can I do it?)
*   **Military**: `MyStrength / TargetStrength` (e.g. 1.2 = 100% Ready)
*   **Economic**: `Treasury / Cost` (e.g. 2x Cost = 100% Ready)
*   **Political**: `Influence / RequiredVotes`

### 2.2. Opportunity (Is now the time?)
*   **Distraction**: Is target at war? (Yes = +0.3)
*   **Weakness**: Is target unstable? (Stability < 50 = +0.2)
*   **Allies**: Do we have support?

### 2.3. Confidence (Do I know enough?)
*   **Intel**: `% of Target Units Visible`
*   **Fog**: `% of Terrain Mapped`

### 2.4. Timing (Prerequisites)
*   **Season**: Is it Winter? (No = +0.1)
*   **Tech**: Do we have the critical upgrade? (Yes = +0.5)

---

## 3. Preparation Logic (Scheming) - "The Wait"

When `Readiness < Threshold`, the AI enters `PREPARE` phase. It analyzes **WHY** it isn't ready and generates a **Scheme** to fix it.

| Missing Factor | Generated Scheme (Action) | Effect |
| :--- | :--- | :--- |
| **Low Capability** | `MUSTERING` | Build units specifically near the target border. |
| **Low Funds** | `HOARDING` | Cut spending, sell resources to raise liquid gold. |
| **Low Opportunity** | `DESTABILIZING` | Fund rebels or sow dissent in target city. |
| **Low Confidence** | `PROBING` | Send scouts or spies to reveal target area. |
| **Poor Timing** | `BIDING` | Simply wait for Turn X (e.g. "Wait for Spring"). |

---

## 4. Option Lifecycle (Expanded)

1.  **CONSIDER**: Tag `VENGEFUL` -> Priority Option `MILITARY_RAID`.
2.  **EVALUATE**:
    *   Capability: 0.4 (Too weak).
    *   Result: `Readiness = 0.3`.
3.  **GATE**:
    *   Threshold: 0.7.
    *   Decision: **PREPARE**.
4.  **SCHEME**:
    *   Reason: "Low Capability".
    *   Action: **Execute `MUSTERING`**.
5.  **LOOP**: Next turn, Capability is 0.5... then 0.6...
6.  **EXECUTE**:
    *   Capability: 0.8. `Readiness = 0.75`.
    *   Decision: **LAUNCH**.

---

## 5. Data Structures

```typescript
interface AIOption {
    id: string;
    type: StoreID; 
    target: string;
    associatedTagId: string;
    
    // State
    phase: "CONSIDER" | "PREPARE" | "EXECUTE";
    readiness: number;
    
    // The "Plan"
    missingFactors: string[]; // e.g. ["CAPABILITY_MILITARY"]
}

interface ForesightConfig {
    thresholds: {
        IMPULSIVE: 0.4,
        NORMAL: 0.7,
        CAUTIOUS: 0.9
    };
    weights: {
        capability: number;
        opportunity: number;
        confidence: number;
        timing: number;
    };
}
```
