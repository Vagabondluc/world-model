
# SPEC-007-04: Component - The Council (Dashboard)

**Access:** Overlay Modal (z-index: 50).
**Trigger:** Click Top-Left Brand/Title area.
**Theme:** "Glassmorphism". Blur backdrop, data-heavy, HUD style.

## 1. Layout Structure
A 2x2 Grid Layout (Desktop) or Vertical Stack (Mobile).

### Quadrant A: World Vitals (Top Left)
**Goal:** High-level pacing metrics.
*   **Current Age:** Large Roman Numeral (I, II, III).
*   **Global Round:** Integer.
*   **Age Progression:** A calculated percentage bar.
    *   *Formula:* `(CurrentRound / MinRoundsForAge) * 100`.
    *   *Visual:* If > 100%, bar turns Gold (ready to advance).

### Quadrant B: The Ledger (Top Right)
**Goal:** Social competition and fairness tracking.
*   **Table Component:**
    *   **Rows:** Players.
    *   **Col 1: Architect:** Name + Color Dot.
    *   **Col 2: Influence:** A derived score.
        *   *Optimization:* This score is **cached**. It is recalculated only when `state.round` changes or when the Dashboard opens, NOT on every frame/render.
        *   *Logic:* Sum of (Hexes Controlled + Cities Founded + Wonders Built).
    *   **Col 3: AP Spent:** Total historical AP usage.
    *   **Col 4: Status:** "Active" (Green Pulse) or "Waiting" (Grey).

### Quadrant C: Session Control (Bottom Right)
**Goal:** Meta-game actions.
*   **Action 1: Export Archive**
    *   *Behavior:* Generates a `.json` blob of the entire `GameState`.
    *   *Trigger:* Browser download.
    *   *Filename:* `dawn_world_{name}_{timestamp}.json`.
*   **Action 2: Abandon World**
    *   *Style:* Danger/Red.
    *   *Behavior:* Requires "Hold to Confirm" or double click.
    *   *Result:* Clears active session (in memory), returns to Landing Page.

### Quadrant D: Activity Heatmap (Bottom Left)
**Goal:** Visual flair.
*   **Visual:** A sparkline or bar chart showing "Actions per Round".
*   *Implementation:* Simple CSS flex row of bars with varying heights based on event history frequency.

## 2. Mobile Adaptation
On screens < 768px:
1.  **Vitals** become a top sticky header.
2.  **Ledger** becomes the main scrollable body.
3.  **Controls** become a fixed bottom footer.
4.  **Heatmap** is hidden.
