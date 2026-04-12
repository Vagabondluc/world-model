# Critique of SPEC-036 Draft 1

## 1. Combat Integration Weakness
**Critique:** The draft suggests `TheArena` needs modification to support Auto-Resolve. reliable AI shouldn't depend on UI components.
**Improvement:** The AI should bypass `TheArena` component entirely and interact directly with `gameStore` to:
1. Dispatch `startCombat`.
2. Wait small delay.
3. Calculate outcomes internally.
4. Dispatch `COMBAT_RESOLVE` directly.
5. Close combat session.
This ensures the AI doesn't get stuck if the UI fails to render.

## 2. Candidate Generation Over-Optimization
**Critique:** "Iterate only Relevant Hexes" introduces complexity in defining "relevance".
**Improvement:** For the current Globe size (~132 cells) and action count (~10), a full board scan is performant (< 5ms). Remove "Relevant Hexes" constraint for V1 to ensure no legal moves are missed.

## 3. Action Payloads
**Critique:** The draft assumes actions just take a `hex`. Some actions (Movement, Shape Land with specific params) require complex payloads.
**Improvement:** Define the `Candidate` interface to include the fully constructed `GameEvent` payload, not just the target hex.

## 4. End Turn Logic
**Critique:** The loop checks `currentPower > 0`. What if the AI has 5 AP but no valid moves?
**Improvement:** The threshold check handles this, but explicitly: if `bestScore < PASS_THRESHOLD`, end turn immediately, even if AP remains. This prevents "soft locks".

## 5. UI Feedback
**Critique:** AI actions happening instantly are confusing for the human player.
**Improvement:** Enforce a "Focus Camera" event or side-effect. When AI acts on Hex X, the camera should pan to Hex X so the human sees what happened.
