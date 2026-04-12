# SPEC-037: AI Advanced Intelligence (The Automaton)

**Epic:** AI Intelligence
**Status:** DRAFT
**Dependencies:** SPEC-036 (Controller Skeleton)

## 1. Overview
The Automaton requires a "brain" that goes beyond random dice rolling. This specification defines a **Utility-Based AI System** where every possible action is assigned a score (0.0 - 1.0) based on the current game state and the AI's specific "Personality Profile".

## 2. Core Components

### 2.1 The Utility Scorer (`UtilityScorer.ts`)
A stateless function that accepts `GameState`, `Identity`, and `CandidateAction` and returns a `Score`.

$$ Score = (BaseUtility \times PersonalityWeight) + StrategicModifier + Noise $$

#### Scoring Factors
1.  **Economy:** Does this action gain power or efficiency?
2.  **Expansion:** Does this gain territory?
3.  **Aggression:** Does this harm an opponent?
4.  **Defense:** Does this protect an asset?
5.  **Roleplay:** Does this align with the Domain (e.g., Fire God burning things)?

### 2.2 Personality Profiles (`profiles.ts`)
Defines distinct archetypes with different weightings.

| Profile | Expansion | Aggression | Defense | Hoarding | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **The Warlord** | 1.2 | **2.0** | 0.5 | 0.2 | Seeks conflict. Ignores defense. |
| **The Builder** | 0.8 | 0.3 | **1.5** | 0.5 | Turtles up. Builds tall. |
| **The Pioneer** | **2.0** | 0.5 | 0.5 | 0.1 | Claims land rapidly. |
| **The Hoarder** | 0.5 | 0.5 | 1.0 | **1.5** | Saves AP for high-cost Age transition moves. |

### 2.3 The Scanner (`scanner.ts` - Enhanced)
Must identify **Strategic Contexts** before generating actions.

- **Threat Detection:** "Enemy Army is adjacent to my City."
- **Opportunity Detection:** "Empty land adjacent to my Capital."
- **Resource Detection:** "Hex with High Magic nearby."

## 3. Decision Logic

### 3.1 The Action Loop
1.  **Scan:** Identify all legal moves (Candidates).
2.  **Filter:** Remove "stupid" moves (e.g., attacking own unit).
3.  **Score:** specific `UtilityScorer` runs on each candidate.
4.  **Select:** Pick top score (or weighted random from top 3).
5.  **Execute:** Dispatch GameEvent.

### 3.2 Combat Logic (`combat.ts`)
AI must handle the `CombatSession` state machine.

- **Setup Phase:**
    - If Attacker: Always confirm.
    - If Defender: Assess odds. If losing bad -> Retreat? (If implemented). Else -> Confirm.
- **Resolution Phase:**
    - AI accepts results immediately.

## 4. Implementation Details

```typescript
interface DecisionContext {
    threats: Threat[];
    opportunities: Opportunity[];
    resources: Resource[];
}

function decide(state: GameState, profile: AIPersonality): Action {
    const context = analyzeContext(state);
    const candidates = scan(state);
    
    return candidates.map(c => score(c, context, profile))
                     .sort((a,b) => b.score - a.score)[0];
}
```

## 5. Verification
- **AI v AI Simulation:** Run two AIs against each other; Warlord should attack, Builder should build.
- **Save State Analysis:** Inspect `GameState` to ensure AI is spending AP efficiently.
