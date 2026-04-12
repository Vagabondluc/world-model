
# SPEC-016: Conflict & War (The Arena)

**Feature:** Interactive Combat Resolution
**Dependencies:** SPEC-014 (Event Engine), SPEC-008 (Chronicler)
**Status:** Approved for Implementation
**Priority:** High

## 1. Executive Summary
While Dawn of Worlds is a builder, Age III introduces Conflict. We avoid complex wargaming rules in favor of a narrative-driven "Arena" model. This is a modal interface where the abstract mechanics of war (dice + modifiers) are visualized, resolved, and chronicled.

## 2. Data Model: `CombatState`

We do not store "Combat" as a persistent state in the store (it's ephemeral), but we generate a `COMBAT_RESOLVE` event upon completion.

### 2.1 The Standoff Object
This object drives the Arena UI state.

```typescript
interface CombatSession {
  // Phase
  stage: 'SETUP' | 'TACTICS' | 'ROLLING' | 'RESOLUTION' | 'CHRONICLE';
  
  // Participants
  attacker: {
    id: string; // Avatar, Army, or Nation ID
    name: string;
    hex: Hex; // Where they are attacking FROM
    baseRoll: number[]; // [d6, d6]
    modifiers: CombatModifier[];
  };
  
  defender: {
    id: string; // Target ID
    name: string;
    hex: Hex; // Where they are
    baseRoll: number[]; // [d6, d6]
    modifiers: CombatModifier[];
  };
}

interface CombatModifier {
  id: string;
  label: string; // e.g., "High Ground", "Wall", "Magic Weapon"
  value: number; // usually +1 or -1
  type: 'AUTO' | 'USER' | 'FATIGUE';
  editable: boolean;
}
```

## 3. UI Component: The Arena

**Visual Theme:** "The Colosseum". Darker background, red/gold accents, dramatic lighting.
**Route:** Overlay Modal (z-index: 100).

### 3.1 Stage 1: The Standoff (Setup)
*   **Visual:** Split screen. Left side (Red) for Attacker, Right side (Blue) for Defender.
*   **Center:** A "VS" badge.
*   **Input:** 
    *   Confirm Attacker (defaults to selected unit).
    *   Confirm Defender (defaults to clicked target).

### 3.2 Stage 2: The Tactics Table (Modifiers)
This is the core math layer. Both sides have a scrollable list of modifiers.

**A. Auto-Detected Modifiers (System Suggestions):**
The system heuristically scans the map state to suggest modifiers.
*   **Fatigue:** Checks `playerCache.actionsThisTurn` for the unit. Adds `-1` for each previous battle.
*   **Terrain:** Checks target Hex. If `Mountain`, adds `+1 High Ground` to Defender.
*   **Fortification:** Checks if target has `Wall` or `Fortress`. Adds `+1 Defense`.
*   **Race Traits:** Checks if Attacker/Defender has relevant Tags (e.g., "Warrior Culture").

**B. User-Editable Modifiers:**
*   **Toggle:** Users can uncheck auto-suggestions if they disagree with the logic.
*   **Custom Entry:** A "+ Add Modifier" button.
    *   *Input:* Text label (e.g., "Surprise Attack") and Value Stepper (+/-).
    *   *Philosophy:* The game engine is authoritative on *events*, but the players are authoritative on *circumstance*.

### 3.3 Stage 3: The Roll
*   **Visual:** Two sets of 3D dice (from `DiceTray`) fall into the respective sides of the arena.
*   **Animation:** Shake effect on impact.
*   **Summation:** `(Die1 + Die2) + TotalMods` displayed in large type.

### 3.4 Stage 4: Resolution
*   **Comparison:** High score wins. Ties go to Defender (Status Quo).
*   **Outcome Actions:**
    *   **If Attacker Wins:**
        *   `[ SCATTER ]`: Target removed visually (Cost: 0 AP for unit, Free).
        *   `[ OBLITERATE ]`: Target destroyed permanently. **Cost:** Calculates target's creation cost (e.g., 8 AP for Age I city) and deducts from Attacker. Disabled if insufficient AP.
    *   **If Defender Wins:**
        *   Attacker repelled. No state change (other than Fatigue).

---

## 4. UI Component: The War Scribe (Special Chronicler)

Immediately after the resolution, before the Arena closes, the **War Scribe** window slides up. War requires more than a standard log entry.

### 4.1 Visual Theme
"The Bloody Scroll". Tattered edges, red ink accents.

### 4.2 Auto-Generation
The system pre-fills the Scribe fields based on the math:
*   **Title:** "The Battle of [Hex Name]" or "The Fall of [Defender Name]".
*   **Body:** Generated via template:
    > "The [Attacker] forces clashed with [Defender] at [Location]. Despite the advantage of [Highest Modifier Name], the defenders fell..."

### 4.3 User Inputs
*   **Battle Name:** Editable text field.
*   **Casualties:** A slider or text input for flavor (e.g., "Heavy", "Total Massacre").
*   **Famous Duel:** A checkbox to flag if the Avatars fought personally.

### 4.4 Commit
Clicking "Seal Fate" dispatches two events atomically:
1.  `COMBAT_RESOLVE`: The mechanical outcome (AP spent, Unit removed).
2.  `CHRONICLE_ENTRY`: The narrative data linked to the combat event ID.

---

## 5. Fatigue System Logic

**Rule:** "If an army fights multiple times in one turn... cumulative -1 penalty."

### Implementation
1.  **Tracking:** In `PlayerRuntimeState`, we track `unitFatigue: Record<string, number>`.
2.  **Reset:** Cleared on `TURN_END`.
3.  **Application:** In The Arena, look up `state.unitFatigue[attackerId]`. If > 0, inject a `CombatModifier` of type `FATIGUE` with value `-1 * count`.

## 6. Destruction Cost Calculation (Rule IV)

When "Obliterate" is selected:
1.  Identify Target `kind` and `createdAge`.
2.  Consult `CANONICAL_COSTS` table for that Age/Kind combination.
3.  **Check:** `currentPower >= cost`.
4.  **Result:** If affordable, dispatch `WORLD_DELETE` with the calculated cost. If not, disable the button with tooltip "Requires X AP".

