# SPEC-036: AI Controller & Automaton System

**Feature:** AI Opponents (The Automaton)
**Dependencies:** SPEC-014 (Event Engine), SPEC-016 (Conflict)
**Status:** REVISED (Full Implementation)
**Priority:** High

## 1. Executive Summary
This specification defines the "Automaton," a comprehensive AI system for handling non-human players in *Dawn of Worlds*. Unlike a simple script, the Automaton is a utility-based agent with distinct personality profiles, a robust state machine for turn management, and direct integration with the game engine (bypassing the UI) to ensure stability and performance.

## 2. Core Architecture

### 2.1 The AI Controller (Orchestrator)
A headless React component (`<AIController />`) mounted at the `App` level.
- **Role:** The "Brain" of the operation.
- **Lifecycle:**
    - Mounts on game start.
    - Subscribes to `gameStore` updates.
    - Activates only when `activePlayer.isHuman === false`.

### 2.2 The Automaton State Machine
The AI operates on a strictly defined state machine to prevent race conditions and "stuck" states.

| State | Description | Transitions |
| :--- | :--- | :--- |
| `IDLE` | Waiting for turn. | `AWAKENING` (when activePlayer changes to AI) |
| `AWAKENING` | Initial delay, context gathering. | `DELIBERATING` |
| `DELIBERATING` | Scanning board, scoring moves. | `ACTING` or `YIELDING` |
| `ACTING` | Executing an action. | `DELIBERATING` (after delay) |
| `COMBAT` | Handling combat resolution. | `ACTING` (after combat resolves) |
| `YIELDING` | Ending turn. | `IDLE` |

## 3. The Decision Engine

### 3.1 Candidate Scanning
Instead of iterating every possible combination, the Scanner identifies "Points of Interest" (POIs):
1.  **Owned Hexes:** Locations owned by the AI.
2.  **Frontier:** Empty hexes adjacent to Owned Hexes.
3.  **Threats:** Enemy units within range.

For each POI, it generates valid `CandidateActions`:
- *Example:* For an empty Frontier hex, candidates might be `CREATE_AVATAR` or `SHAPE_LAND`.

### 3.2 Utility Scoring
Each `CandidateAction` is assigned a score (0.0 - 1.0) based on the **Personality Profile**.

$$ Score = (BaseUtility \times PersonalityWeight) + StrategicModifier + Noise $$

- **BaseUtility:** Derived from the action's immediate value (e.g., getting points, removing enemy).
- **PersonalityWeight:** Multiplier from the active Persona (e.g., "Aggressive" profile values combat higher).
- **StrategicModifier:** Contextual bonuses (e.g., "Low Health" increases value of defense).
- **Noise:** Small random variance (+/- 0.05) to prevent deterministic stalemates.

### 3.3 Throttling & Focus
To make the AI feel "alive" and not like a glitch:
- **Thinking Time:** Minimum 800ms between actions.
- **Camera Focus:** Before acting, the AI emits a `CAMERA_FOCUS` event to pan the user's view to the target hex.

## 4. Systems Integration

### 4.1 Direct Action Dispatch
The AI constructs and dispatches `GameEvent` objects directly to the store, bypassing React UI callbacks.
- **Safety:** It runs the same `validate()` logic as the UI to ensure legality.
- **Payloads:** It constructs full payloads (e.g., `{ roll: [D6, D6], ... }`) for `POWER_ROLL` events.

### 4.2 Combat Handling (The "Black Box" Approach)
The AI handles conflict without needing the `TheArena` UI component.
1.  **Initiation:** AI dispatches `COMBAT_START` (internal flag, not the UI modal).
2.  **Resolution:** AI calculates the outcome immediately using standard dice rules.
    - *Note:* It respects the same mathematical rules as the player.
3.  **Conclusion:** AI dispatches `COMBAT_RESOLVE` with the results.
4.  **Feedback:** The UI receives the event and shows a "Conflict Notification" toast instead of blocking the screen with the Arena modal.

## 5. Persistence & Recovery

### 5.1 Stuck Detection
The Controller maintains a "Heartbeat".
- If `state === ACTING` for > 5 seconds, it triggers a **Panic Reset**:
    - Dispatches `TURN_END` immediately to unblock the game.
    - Logs error to `chronicler`.

### 5.2 Save/Load
AI state is ephemeral. On game load:
- If it is AI's turn, State resets to `AWAKENING`.
- AI re-evaluates board from scratch.

## 6. Personality Profiles (Data Models)

```typescript
export interface Persona {
  id: string;
  name: string;
  weights: {
    EXPANSION: number; // 0.0 - 2.0
    AGGRESSION: number;
    DEVELOPMENT: number;
    HOARDING: number;  // Tendency to save AP
  };
  preferredDomains: string[]; // e.g., ['WAR', 'FIRE']
}

export const THE_CONQUEROR: Persona = {
  id: 'conqueror',
  name: 'The Warlord',
  weights: { EXPANSION: 1.5, AGGRESSION: 2.0, DEVELOPMENT: 0.5, HOARDING: 0.2 },
  preferredDomains: ['DESTRUCTION', 'MIGHT']
};

export const THE_GARDENER: Persona = {
  id: 'gardener',
  name: 'The Lifebringer',
  weights: { EXPANSION: 0.8, AGGRESSION: 0.2, DEVELOPMENT: 2.0, HOARDING: 0.5 },
  preferredDomains: ['LIFE', 'NATURE']
};
```

## 7. Implementation Roadmap

### Phase 1: The Brain (Component)
- Scaffold `<AIController>` in `App.tsx`.
- Implement `useAIState` hook for the state machine.
- **Deliverable:** AI that passes turn immediately.

### Phase 2: The Hands (Actions)
- Implement `AIScanner` to find valid moves.
- Implement `AIDispatcher` to execute `POWER_ROLL` and `CREATE_AVATAR`.
- **Deliverable:** AI that rolls dice and creates an avatar.

### Phase 3: The Personality (Scoring)
- Implement `UtilityScorer`.
- Tune "The Warlord" and "The Gardener" profiles.
- **Deliverable:** AI that makes "smart" choices.

### Phase 4: The Sword (Combat)
- Implement headless combat resolution.
- **Deliverable:** AI that can fight and destroy.
