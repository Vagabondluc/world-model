
# SPEC-007: Meta-Game UI & Session Management (v2)

**Status:** Approved for Implementation
**Priority:** High
**Context:** The application currently lacks a proper entry point. Users are dropped into a debug state. We need a "Game Loop" wrapper.

---

## 1. Data Model: The Session Configuration

Before any UI is rendered, we must define the shape of a Game Session. This config object will be the seed for the `GameContext`.

### 1.1 Configuration Object (`GameSessionConfig`)
```typescript
interface GameSessionConfig {
  // Metadata
  id: string;             // UUID for the save file
  createdAt: number;      // Timestamp
  lastPlayed: number;     // Timestamp
  
  // World Parameters
  worldName: string;      // User input, e.g., "Aethelgard"
  mapSize: 'SMALL' | 'STANDARD' | 'GRAND';
  initialAge: 1 | 2 | 3;
  
  // Roster
  players: Array<{
    id: string;           // "P1", "P2", etc.
    name: string;         // "The Builder", "Architect X"
    color: string;        // Hex code
    secret?: string;      // Optional PIN for hotseat privacy
    isHuman: boolean;     // Future proofing for AI
  }>;

  // House Rules (Toggles)
  rules: {
    strictAP: boolean;    // If true, actions block on 0 AP. If false, allow negative.
    draftMode: boolean;   // If true, first round of Age allows global undo.
  };
}
```

---

## 2. Screen 1: The Cosmic Void (Landing Page)

**Visual Theme:** "Before Creation". Dark, atmospheric, minimal.
**Route:** `view === 'LANDING'`

### 2.1 Visual Design
*   **Background:** Deepest black (`#050505`).
*   **Ambient Effect:** A CSS-only, slow-rotating hexagonal mesh in the background. Opacity 5%. It should feel like "potential matter" waiting to be shaped.
*   **Typography:** Massive title "DAWN OF WORLDS". Font: `Space Grotesk`, `font-black`, `tracking-tighter`.
    *   *Effect:* Gradient text fill (Deep Purple to Cyan).
*   **Animation:** The title should fade in + scale down slightly (Hero reveal).

### 2.2 Functional Requirements
1.  **State Check (On Mount):**
    *   Check `localStorage` for key `dawn_save_v1`.
    *   If valid JSON found -> Enable "Continue" button.
    *   If invalid/missing -> Disable "Continue" button.

2.  **Primary Actions (Center Column):**
    *   `[ NEW WORLD ]`: Large, primary button. Glowing border. Triggers **Setup Wizard**.
    *   `[ CONTINUE: {WorldName} ]`: Secondary button. Shows timestamp of last save. Triggers **Game Load**.
    *   `[ ARCHIVES ]`: Tertiary button. (Future feature: Load JSON from file).

3.  **Footer:**
    *   Version Badge: "v0.5 Alpha"
    *   System Status: "Local Storage: Ready" (Green dot).

---

## 3. Screen 2: The Genesis Protocol (Setup Wizard)

**Visual Theme:** "Architectural Blueprint". Clean lines, high contrast, technical feel.
**Route:** `view === 'WIZARD'`

### 3.1 UX Pattern
A 3-step stepper modal. No scrolling needed.
`1. World Parameters` -> `2. The Pantheon (Players)` -> `3. Review & Forge`.

### 3.2 Step 1: World Parameters
*   **World Name Input:**
    *   *Behavior:* Large text input. Auto-focus.
    *   *Feature:* "Randomize" button (Dice icon) that pulls from a list of fantasy names (e.g., "Kaldor", "Orynthia", "Zenthos").
*   **Map Size Selector:**
    *   3 Cards laid out horizontally.
    *   **Small (20x15):** "Quick Skirmish".
    *   **Standard (30x20):** "Balanced Odyssey" (Default).
    *   **Grand (40x30):** "Epic Saga".
    *   *Interaction:* Clicking a card highlights it with a primary color border.

### 3.3 Step 2: The Pantheon (Player Roster)
*   **Layout:** A vertical list of "Player Slots".
*   **Default State:** Pre-filled with 2 Players (Red and Blue).
*   **Slot Row UI:**
    *   **Color Swatch:** Dropdown. Preset palette of 8 distinct, color-blind friendly colors.
    *   **Name Input:** Text field.
    *   **Secret Key (Optional):** A password field. If filled, the game will ask for this PIN before starting this player's turn. (Hotseat security).
    *   **Delete Button:** Disabled if count <= 2.
*   **"Add Architect" Button:** Adds a new row. Max 6 players.

### 3.4 Step 3: Review & Forge
*   **Summary Card:** Displays the config in a read-only "receipt" style.
*   **Warning:** "This will overwrite any existing local save." (If a save exists).
*   **The "Forge" Button:**
    *   *Visual:* Pulsing animation.
    *   *Action:*
        1.  Construct `GameSessionConfig`.
        2.  Initialize `GameState` via `createInitialState(config)`.
        3.  Save to `localStorage`.
        4.  Transition App to `GAME` view.
        5.  Trigger Haptic "Success".

---

## 4. Screen 3: The Council (Player Dashboard)

**Visual Theme:** "Administrative Overlay". Glassmorphism, data-heavy, heads-up display.
**Route:** `overlay === 'DASHBOARD'` (Overlays the game).

### 4.1 Access
*   **Trigger:** Top bar button (Left side, replacing current Title text).
*   **Icon:** `public` (Globe) or `groups` (People).

### 4.2 Layout: The 2x2 Grid

#### Quadrant A: World Vitals (Top Left)
*   **Current Age:** Large Roman Numeral.
*   **Global Round:** Integer.
*   **Total Objects:** Count of all entities on map.
*   **Progress Bar:** "Progress to Next Age".
    *   *Logic:* `currentRound / minRoundsForAge`.

#### Quadrant B: The Ledger (Top Right / Full Width on Mobile)
*   **Leaderboard Table:**
    *   **Row:** Player Name (Colored).
    *   **Col 1: Influence (Score):** Calculated metric.
        *   *Formula:* `(Hexes Controlled) + (Cities * 5) + (Events * 2)`.
    *   **Col 2: AP Spent:** Total historical AP usage.
    *   **Col 3: Creations:** Count of `WorldObject`s where `createdBy === playerId`.
    *   **Col 4: Status:** "Active Turn" / "Waiting".

#### Quadrant C: Session Control (Bottom Right)
*   **Export Archive:**
    *   Button: `[ DOWNLOAD JSON ]`.
    *   *Action:* Triggers browser download of full state.
*   **Abandon World:**
    *   Button: `[ EXIT TO MENU ]`.
    *   *Action:* Confirm dialog -> Wipes in-memory state -> returns to Landing.

#### Quadrant D: History Sparkline (Bottom Left - Nice to Have)
*   A simple bar chart using CSS div heights showing "AP Spent per Round".
*   Helps visualize the pacing of the game.

---

## 5. Technical Requirements for Implementation

### 5.1 Asset Dependencies
*   **Fonts:** `Space Grotesk` (Headers), `Inter` (UI). Already imported.
*   **Icons:** `Material Symbols`. Already imported.

### 5.2 State Management
*   We need to lift `sessionConfig` up to `App.tsx` state, OR handle it entirely within `GameProvider`.
*   *Decision:* `App.tsx` handles the "Meta State" (Landing/Wizard), `GameProvider` handles the "Active Game".
*   `GameProvider` needs a new prop `initialConfig` to seed the reducer.

### 5.3 Responsive Behavior
*   **Mobile:** The Dashboard should stack vertically (Vitals -> Ledger -> Controls).
*   **Desktop:** 2x2 Grid.

### 5.4 Validation Logic
*   **Player Name:** Max 12 chars.
*   **Unique Colors:** Prevent two players from picking "Red". (Show error if duplicate detected).
*   **Map Size:** Ensure `HexGrid` component respects the `mapSize` prop during render loop (currently hardcoded 30x20).

## 6. Acceptance Criteria
1.  User can launch the app and see the Landing Page (not the map).
2.  User can configure a 3-player game with custom names and colors.
3.  Upon clicking "Forge", the Map loads with the *correct* player list in the turn order.
4.  Opening "The Council" shows accurate stats for the actions taken so far.
5.  Clicking "Exit" returns to Landing Page.
