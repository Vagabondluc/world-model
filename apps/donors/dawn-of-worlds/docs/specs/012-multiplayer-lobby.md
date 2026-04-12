
# SPEC-012: Multiplayer Lobby & Diplomacy System

**Feature:** Networking & Communication
**Dependencies:** SPEC-007 (Meta-Game), SPEC-011 (Sync Architecture)
**Status:** Draft
**Priority:** High (Required for Beta)

## 1. Executive Summary
This specification defines the "Social Layer" of Dawn of Worlds. It covers two distinct phases:
1.  **The Assembly (Pre-Game Lobby):** Where players connect, claim divine avatars (colors), and synchronize game settings before the world is forged.
2.  **The Whispering Gallery (In-Game Diplomacy):** A persistent, non-blocking communication overlay allowing public discourse and private conspiracies (whispers), essential for Age III politics.

## 2. Phase 1: The Assembly (Lobby)

**Route:** `view === 'LOBBY'`
**Theme:** "The Waiting Room of Gods". Ethereal, suspended animation, expectant.

### 2.1 Host Experience ("Opening the Gate")
*   **Entry:** From Landing Screen -> "Host Session".
*   **Session ID Generation:** The Host generates a unique 6-character alphanum code (e.g., `DAWN-X7`).
*   **Controls:**
    *   **Config Access:** Full read/write access to `GameSessionConfig` (Map Size, Rules).
    *   **Player Management:** Kick users, swap slot colors.
    *   **The Big Button:** "Forge World" (Disabled until all players are `READY`).

### 2.2 Guest Experience ("Answering the Call")
*   **Entry:** From Landing Screen -> "Join Session".
*   **Input:** Session Code (`DAWN-X7`) + Display Name.
*   **State:** Upon joining, the guest enters the **Staging Area**.
*   **Interaction:**
    *   View currently selected Game Settings (Read-Only).
    *   Select an available Player Slot (Color/Avatar).
    *   Toggle `READY` status.

### 2.3 Visual Layout (Staging Area)
A central, floating monolith panel over the "Cosmic Void" background.

**The Roster (List Component):**
| Slot | Avatar | Player Name | Status | Ping |
| :--- | :--- | :--- | :--- | :--- |
| P1 | 🔴 | The Host | **HOST** | 0ms |
| P2 | 🔵 | Guest User | **READY** | 45ms |
| P3 | 🟢 | *Open Slot* | *Waiting...* | - |

*   **Visual Cues:**
    *   **Ready State:** The avatar ring glows Gold.
    *   **Not Ready:** The avatar ring is dim/grey.
    *   **Slot Conflict:** If two players try to pick Blue simultaneously, the slot shakes (animation `reject`) and locks briefly.

---

## 3. Phase 2: The Whispering Gallery (In-Game Chat)

**UI Layer:** `Overlay / Panel`
**Theme:** "Diplomatic Scrolls". Minimalist, unobtrusive, readable.

### 3.1 The Communications Controller
The chat system is **not** just a text box. It is a scoped communication tool supporting three modes:

1.  **Global (The Table):** Visible to all. White text.
2.  **System (The Log):** Automated messages. Gold/Muted text.
    *   *Example:* "Player Red rolled 10 Power."
3.  **Whisper (The Shadow):** Private 1:1 messages. Purple/Italic text.
    *   *Crucial for Age III:* Allows players to plot betrayals without the table knowing.

### 3.2 Visual Component: The Chat HUD
Currently, the UI has left/right sidebars. The Chat HUD lives in the **Bottom Left** (Desktop) or a **Tab** (Mobile).

**Collapsed State (Default):**
*   A semi-transparent pill: `[ 💬 3 New Messages ]`.
*   **Visual Cue (Update):** When a new message arrives, the pill pulses.
    *   *Global:* Pulses White.
    *   *Whisper:* Pulses Purple (High urgency).

**Expanded State (The Scroll):**
*   Slides up from the bottom (Desktop: 300px width, 400px height).
*   **Header:** Tabs for `[Global]`, `[P.Blue]`, `[P.Green]`.
*   **Body:** Scrollable history.
*   **Input:** Text area with "Send" button.

### 3.3 Message Styling
Messages are formatted to be distinct at a glance.

*   **Global:**
    > **Player Red:** I think we should flood the valley.
*   **Whisper (Incoming):**
    > *from Player Blue:* **(Secretly)** If Red floods the valley, I will help you burn his forest.
*   **System:**
    > ⚔️ **Age Advance:** The world enters the Age of Conflict.

---

## 4. Interaction & Feedback

### 4.1 Visual Cues for Updates
Users may be looking at the map or the inspector. They should not miss diplomacy.

*   **The "Heads-Up" Toast:**
    *   When a message arrives and the Chat HUD is collapsed, a temporary "Toast" notification appears at the top-center of the screen.
    *   *Duration:* 4 seconds.
    *   *Content:* Avatar + Truncated Message.
    *   *Action:* Clicking the toast opens the full Chat HUD.

*   **Typing Indicators:**
    *   If Player Blue is typing, a small "..." bubble appears next to their name in the Dashboard or Lobby.
    *   *Flavor:* "Player Blue is scribing..."

*   **The "Unread" Badge:**
    *   A red numerical badge on the Chat Icon (e.g., `(2)`).
    *   Clears when the panel is opened.

### 4.2 Audio / Haptics (Integration with SPEC-009)
*   **Incoming Global:** Soft "Paper Rustle" sound. No haptic.
*   **Incoming Whisper:** "Chime" sound. Light `tap` haptic pattern.
*   **Player Joined Lobby:** "Door Open" sound.
*   **Game Start:** "Gong" sound. Heavy `turn` haptic pattern.

## 5. Mobile Adaptation

On mobile, screen real estate is premium.

*   **Lobby:** Vertical stack card view.
*   **Chat:** Does **not** overlay the map. It is a dedicated **Bottom Tab** (see `UI_MOBILE.md`).
    *   *Notification:* The Tab Icon (`chat_bubble`) animates/bounces when unread messages exist.
*   **Input:** Opening the keyboard hides the message history to maximize typing space.

## 6. Implementation Architecture

### 6.1 Data Model: `ChatMessage`
```typescript
interface ChatMessage {
  id: string;           // UUID
  timestamp: number;
  senderId: string;     // PlayerId or "SYSTEM"
  targetId?: string;    // If undefined, Global. If set, Private.
  content: string;
  isRead: boolean;      // Local state only
}
```

### 6.2 State Management
*   **Ephemeral:** Chat history is **not** stored in `IndexedDB` or the main `GameSave`. It is ephemeral to the active session to prevent save-file bloat.
*   **Buffer:** Keep only the last 100 messages in memory.

### 6.3 Security
*   **Whisper Integrity:** The client must filter messages. However, in a P2P architecture, "private" messages might technically pass through a relay. The UI must ensure they are strictly filtered by `targetId` before rendering.

## 7. Acceptance Criteria

1.  **Host** can create a room and see a Lobby Code.
2.  **Guest** can enter a code and appear in the Host's list.
3.  **Host** cannot start game until all players toggle "Ready".
4.  **In-Game:** Sending a message updates the chat log for all connected peers.
5.  **In-Game:** Sending a whisper is only visible to Sender and Target.
6.  **Visual:** Incoming messages trigger the "Pulse" animation on the Chat toggle button.
