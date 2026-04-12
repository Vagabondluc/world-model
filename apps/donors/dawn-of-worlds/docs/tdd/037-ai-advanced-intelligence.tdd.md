# TDD-037: AI Advanced Intelligence

**Epic:** AI Intelligence
**Spec:** `docs/specs/037-ai-advanced-intelligence.md`

## 1. Utility Scoring Tests

### `logic/ai/scorer.test.ts`

- **Test:** `calculateScore_ShouldPrioritizeAggression_ForWarlord`
    - **Setup:** Create a Warlord profile. Two actions: "Attack Enemy" (Aggressive) and "Build Farm" (Economic).
    - **Expect:** Attack score > Build score.

- **Test:** `calculateScore_ShouldPrioritizeExpansion_ForPioneer`
    - **Setup:** Create Pioneer profile. Same actions.
    - **Expect:** Build/Claim score > Attack score.

- **Test:** `calculateScore_ShouldAddDefensiveBonus_WhenUnderThreat`
    - **Setup:** Place Enemy Army adjacent to AI City. Action: "Fortify City".
    - **Expect:** Score should be significantly higher than baseline "Fortify" score.

## 2. Decision Engine Tests

### `logic/ai/brain.test.ts`

- **Test:** `decide_ShouldYield_WhenNoGoodMoves`
    - **Setup:** AI has 0 Power. No 0-cost actions available.
    - **Expect:** Returns `TURN_END` (or `yield` signal).

- **Test:** `decide_ShouldSavePower_ForHoarder`
    - **Setup:** Hoarder profile. Current Power: 5. Action cost: 5.
    - **Expect:** Score should be penalized because it drains "Hoarding" reserve.

## 3. Combat Logic Tests

### `logic/ai/combat.test.ts`

- **Test:** `handleCombat_ShouldConfirmSetup_Immediately`
    - **Setup:** `combatSession.stage` = 'SETUP'.
    - **Expect:** Returns `COMBAT_CONFIRM` (or equivalent state transition).

- **Test:** `handleCombat_ShouldResolve_Immediately`
    - **Setup:** `combatSession.stage` = 'RESOLUTION'.
    - **Expect:** Returns `COMBAT_FINISH`.
