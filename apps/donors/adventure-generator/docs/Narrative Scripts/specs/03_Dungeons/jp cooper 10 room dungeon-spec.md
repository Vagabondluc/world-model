# Specification: JP Cooper 10 Room Dungeon (jp cooper 10 room dungeon)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
This is a Conversational UI that implements the JP Cooper 10-Room Method. It guides the GM step-by-step through specific prompt questions (Purpose -> Guardian -> etc.) and builds a "Dungeon Ledger" sidebar in real-time.

## 2. Component Architecture
### 2.1 Core Panels
- **Guided Chat Interface**:
    - Linear flow (System Question -> User Answer).
- **Dungeon Ledger (Sidebar)**:
    - Lists the 10 rooms/steps as they are defined.
- **Smart Toolbar**:
    - Contextual buttons: "Roll 3 Ideas", "Roll Grimdark".
- **Review Panel**:
    - Full summary view.

## 3. Interaction Logic
- **"Roll" Interception**:
    - "Roll" buttons trigger background LLM generation, populated into the chat.
- **Hot-Swapping**:
    - Clicking a Sidebar item jumps the chat back to that step (Editing History).
- **Contextual Continuity**:
    - Suggestions are weighted by previous answers (Theme/Purpose).

## 4. Visual Design
- **Theme-Responsive**: Chat colors shift based on Genre.
- **Pro-Tips**: Toasts encouraging "Genre Rolls".

## 5. Data Model
```typescript
interface JPCooperDungeon {
  theme: { location: string; purpose: string; creator: string };
  rooms: { [step: number]: string }; // 1-10
  chatHistory: Message[];
}
```
