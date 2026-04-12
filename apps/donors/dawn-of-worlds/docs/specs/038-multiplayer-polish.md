# SPEC-038: Multiplayer Polish

**Epic:** Multiplayer Polish
**Status:** DRAFT
**Dependencies:** SPEC-014 (Event Engine)

## 1. Overview
The multiplayer experience currently suffers from friction points, specifically the "Turn Handover" loop which halts the game when an AI player takes a turn. This epic addresses these usability issues and defines the networking architecture for synchronization.

## 2. Core Features

### 2.1 Seamless Turn Handover
The "Screen Curtain" (Handover Overlay) is designed for Hotseat play to prevent players from seeing each other's secrets.

- **Requirement:** The system must differentiate between **Human-to-Human** and **Human-to-AI** transitions.
- **Logic:**
    - If `NextPlayer.isHuman === true`: Show Screen Curtain. Wait for "I am Ready".
    - If `NextPlayer.isHuman === false`: **SKIP** Screen Curtain. AI begins turn immediately.
- **Visuals:** A brief "AI Thinking..." toast or indicator should appear instead of the full screen blocking overlay.

### 2.2 Sync Architecture (`SyncChannel`)
Validation of current peer-to-peer logic.

- **Host-Authoritative:** One client (the Host) holds the "True State".
- **Client-Side Prediction:** Clients predict the outcome of actions (optimistic UI) but rollback if Host disagrees.
- **Heartbeat:** Host sends a `SYNC_PULSE` every 5 seconds containing the `LastEventID` to detect desyncs.

### 2.3 Replay System
When a player returns to the game (or after a long AI turn), they need context.

- **The "While You Were Away" Log:** A filtered list of high-importance events (Wars, City Formations) that occurred since their last active turn.
- **Replay Visualization (Dream):** A fast-forward replay of the map changes. (Scope: stretch goal).

## 3. UX Improvements
- **Turn Notification:** Browser notification or sound when it becomes your turn.
- **Lobby Polish:** Better "Ready" status indicators and "Copy Invite Link" UX.

## 4. Implementation Details

```typescript
// GameStore Handover Logic
if (nextPlayer.isHuman) {
    set({ isHandoverActive: true }); // triggers Overlay
} else {
    set({ isHandoverActive: false }); // AI starts immediately
    // Optional: dispatch 'AI_TURN_START' for UI indicators
}
```

## 5. Verification
- **Hotseat Test:** P1 (Human) -> P2 (Human). Curtain should appear.
- **AI Test:** P1 (Human) -> P2 (AI). Curtain should NOT appear.
- **Network Test:** Host actions appear on Client within < 200ms.
