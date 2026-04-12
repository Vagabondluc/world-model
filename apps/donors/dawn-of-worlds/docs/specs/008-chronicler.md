
# SPEC-008: The Chronicler & Event Log

**Feature:** Narrative Engine & History Tracking
**Dependencies:** SPEC-007 (Meta-Game), Google Gemini API
**Status:** Approved for Implementation

---

## 1. Executive Summary
The **Event Log** is the mechanical spine of the game, recording every authoritative action (creation, movement, combat) taken by players. 

The **Chronicler** is the UI layer that interprets this log:
1.  **The Scribe:** A dual-pane interface to view the Log and attach narrative "flavor" to mechanical events.
2.  **The Saga:** An AI-driven view that reads the Log + Scribe Notes to generate a story.

---

## 2. Component: The Event Log (Mechanical Layer)

The Chronicler relies on a rigid, immutable history of the game.

### 2.1 Data Structure (`GameEvent`)
Every action in the game emits an event. This is the "Source of Truth".

```typescript
// The mechanical truth the Chronicler reads
type GameEvent = 
  | { type: 'TURN_START', playerId: string, round: number, age: number }
  | { type: 'WORLD_CREATE', playerId: string, entityType: string, location: Hex }
  | { type: 'WORLD_MODIFY', playerId: string, targetId: string, modification: string }
  | { type: 'COMBAT_RESOLVE', attackerId: string, defenderId: string, outcome: string };
```

### 2.2 The "Stream" View
The Chronicler requires a selector `selectEventStream(state)` that returns events in **reverse chronological order**, filtered by visibility (e.g., hiding "Undo" events or "Debug" events).

---

## 3. UI: The Scribe (Input Interface)

**Route:** `view === 'CHRONICLER' && tab === 'SCRIBE'`
**Theme:** "The Archive". Paper textures, ink contrasts, serif fonts.

### 3.1 Layout: Master-Detail
A two-column layout designed for rapid data entry.

#### Left Column: The Event Stream (Master)
*   **Header:** "Recorded Events" (Filter: My Events | All Events).
*   **List Item Component:** `EventCard`.
    *   **Visual:** Compact card.
    *   **Icon:** Based on `GameEvent.type` (e.g., Sword for Combat, Hammer for Build).
    *   **Text:** "Player Red founded 'Ashkel' (City)" (Mechanical description).
    *   **Status Indicator:**
        *   *Grey Dot:* No Lore attached.
        *   *Gold Quill:* Lore attached.
    *   **Interaction:** Click to select. Selected card highlights in Gold.

#### Right Column: The Quill (Detail)
*   **State:** Disabled if no Event selected.
*   **Header:** "Annotation Details".
*   **Context Block:**
    *   Displays full JSON details of the selected event (read-only).
    *   *Example:* "Hex: 12,4 | Cost: 3AP | Timestamp: 12:04pm"
*   **Input Form:**
    *   **Lore Title:** "The Founding of the Glass Spire".
    *   **Narrative Note:** "Though it cost them dearly, the Karthi people raised the spire in a single night..."
    *   **Tone Tag:** [ Heroic ] [ Tragic ] [ Mysterious ].
*   **Auto-Save:** Fields save to `ChronicleContext` `onBlur`.

---

## 4. UI: The Saga (Output Interface)

**Route:** `view === 'CHRONICLER' && tab === 'SAGA'`
**Theme:** "The Storybook". Clean typography, book-like reading experience.

### 4.1 Narrative Generation Flow (The Pipeline)
To handle context windows and prevent hallucinations, we use a strict pipeline:

1.  **Chunking:** Events are grouped by **Round**. If a Round has > 25 events, it is sub-chunked.
2.  **Filtering:** Low-impact events (e.g., "Add Water" to 1 hex) are aggregated into summaries ("The seas expanded...") to save tokens. High-impact events (Cities, Wars) are kept distinct.
3.  **Prompt Construction:**
    *   *System Instruction:* "You are a fantasy historian. STRICTLY adhere to the provided event log. Do not invent wars, deaths, or cataclysms not present in the log. Focus on the 'why' based on the User Notes provided."
    *   *Input:* Serialized JSON of the chunk.
4.  **AI Processing:** Gemini 2.5 Flash processes the stream.
5.  **Output:** A Markdown-formatted story chapter.

### 4.2 The Reader View
*   **Visual:** Single text column, centered, max-width 65ch.
*   **Typography:** `Merriweather` or `Crimson Text` (Serif).
*   **Navigation:**
    *   **[ CLOSE TOME ]**: Top-right sticky button. Returns to Game Map.
    *   **Pagination:** Bottom arrows to flip between Rounds/Ages.
*   **Interactivity:**
    *   **Entity Linking:** If the AI mentions "Ashkel", it is rendered as a clickable link that opens the **Inspector** for that city.
    *   **Regenerate:** Button to re-roll the prose with a different "Voice" (e.g., "Drunk Bard", "Imperial Scribe").

### 4.3 Error Handling
*   **Quota Exceeded / Network Error:**
    *   *Visual:* A "torn page" graphic.
    *   *Text:* "The spirits are silent. (Connection/Quota Error)."
    *   *Action:* "Try Again" button.
*   **Empty Round:**
    *   *Text:* "Peace reigned in this era. No events were recorded."

---

## 5. Technical Implementation Details

### 5.1 Store Integration
The Chronicler does not mutate `GameState`. It maintains its own `ChronicleState` side-car.

```typescript
interface ChronicleState {
  // Key = GameEvent.id
  annotations: Record<string, {
    title: string;
    body: string;
    tone: string;
  }>;
  
  // Key = Age number
  generatedChapters: Record<number, string>;
}
```

### 5.2 Persistence
*   **Strategy:** **IndexedDB**. Text data is heavy. Do not use `localStorage`.
*   **Sync:** Must stay in sync with `dawn_save_v1`. If the game save is deleted, chronicles should be archived or wiped.

## 6. User Experience Goals
*   **The Log is Boring:** The raw log ("Created Terrain") is dry.
*   **The Scribe is Fast:** Players can quickly jot down "This mountain is haunted" without writing a novel.
*   **The Saga is Rewarding:** The AI does the heavy lifting of weaving "Created Terrain" + "Haunted" into a paragraph of lore.
*   **Safety:** Hallucinations are minimized by strict prompts; Limits are managed by chunking.
