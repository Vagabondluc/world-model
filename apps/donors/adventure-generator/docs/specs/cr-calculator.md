
# SPEC: Monster CR Calculator & Validator (DEC-011)

## 1. Motivation
Currently, the monster generator picks "cool powers" based on an abstract budget, but it doesn't verify if the resulting monster mathematically meets the definition of its target Challenge Rating (CR) according to D&D 5e standards (DMG p. 274). We need a feedback loop to ensure a "CR 5 Brute" is actually a mathematical challenge for a level 5 party.

## 2. The Logic: DMG Standard Calculation
The system will reverse-engineer the CR from the generated stat block using the standard 3-step flow.

### A. Calculate Defensive Challenge Rating (DCR)
1.  **Effective Hit Points (EHP):**
    *   **Base:** Actual HP.
    *   **Multipliers:** Apply based on Resistances/Immunities vs. Expected CR tier (e.g., Resistance at CR 1-4 = 2x HP; at CR 11+ = 1x).
    *   **Regeneration:** Add `(Regen Amount × 3)` to HP.
    *   **Traits:** specific buffers (e.g., *Undead Fortitude* adds effective HP).
2.  **Target AC Check:**
    *   Lookup EHP in the "Monster Statistics by Challenge Rating" table to find **Suggested DCR**.
    *   Compare Actual AC vs. **Suggested AC**.
3.  **Adjustment:**
    *   Adjust DCR up/down by 1 for every 2 points of AC divergence.

### B. Calculate Offensive Challenge Rating (OCR)
1.  **Damage Per Round (DPR):**
    *   Average damage over 3 rounds.
    *   *Round 1:* Strongest limited ability (Breath Weapon, Spell).
    *   *Rounds 2-3:* Standard Multiattack routine.
    *   **AoE:** Assume 2 targets hit.
2.  **Target Attack/DC Check:**
    *   Lookup DPR in the table to find **Suggested OCR**.
    *   Compare Actual Attack Bonus (or Save DC) vs. **Suggested Attack/DC**.
3.  **Adjustment:**
    *   Adjust OCR up/down by 1 for every 2 points of Attack/DC divergence.

### C. Final Calculation
1.  **Average:** `(DCR + OCR) / 2`.
2.  **Rounding:** Round to nearest standard CR.

## 3. Implementation Plan

### Data Layer (`data/crRules.ts`)
Digitize the DMG table into a constant lookup object:
```typescript
export const CR_SCALING_TABLE = [
  { cr: 0,   prof: 2, ac: 13, hpMin: 1,   hpMax: 6,   atk: 3,  dmgMin: 0,   dmgMax: 1,   dc: 10 },
  { cr: 1/8, prof: 2, ac: 13, hpMin: 7,   hpMax: 35,  atk: 3,  dmgMin: 2,   dmgMax: 3,   dc: 13 },
  // ... up to CR 30
];
```

### Logic Layer (`utils/crCalculator.ts`)
A pure function that takes a `CreatureDetails` object and returns a `CRAnalysis` object.

```typescript
interface CRAnalysis {
  defensiveCR: number;
  offensiveCR: number;
  finalCR: number;
  breakdown: string[]; // Explainer text (e.g., "High AC (+2 DCR)")
  warnings: string[];  // (e.g., "Offensive CR is much higher than Defensive")
}
```

### UI Layer (`components/monster/MonsterResult.tsx`)
*   **The "CR Meter":** A visual indicator showing Target CR vs. Calculated CR.
*   **Audit Tooltip:** Hovering over the CR reveals the breakdown (e.g., "Defensive CR 8, Offensive CR 4").
*   **Validation Warning:** If `Calculated != Target`, display a warning suggesting adjustments (e.g., "Monster is too weak. Increase HP or Damage.").

## Addendum: Multi-Step Pipeline Integration

- Treat the calculation as a single synchronous operation with internal sub-steps (normalize -> compute -> validate).
- Do not require global pipeline stepper integration or cross-entity links for this spec.
