
# SPEC-007: Meta-Game Architecture Overview

**Feature:** Game Session Management & Meta-UI
**Version:** 2.0 (Amplified)
**Status:** Approved for Implementation

## 1. Executive Summary
Currently, the application launches directly into a hardcoded debug game state. This specification defines the "Meta-Game" layer: the wrapper application that handles session creation, configuration, persistence, and administrative management.

We are introducing three distinct UI "Worlds" or themes that correspond to the player's proximity to the game simulation:
1.  **The Cosmic Void (Landing):** Pre-creation. Dark, ethereal, potential.
2.  **The Genesis Protocol (Setup):** Architectural, technical, blueprint-style.
3.  **The Council (Dashboard):** Bureaucratic, administrative, high-level oversight.

## 2. User Stories

### New Player
*   **As a** new player, **I want** to see a visually impressive title screen, **so that** I feel immersed immediately.
*   **As a** new player, **I want** a guided wizard to set up my world, **so that** I don't have to understand the configuration JSON.
*   **As a** new player, **I want** to choose my player color and name, **so that** I can identify my actions in the log.

### Returning Player
*   **As a** returning player, **I want** to see a "Continue" button with my world's name, **so that** I can instantly resume play.
*   **As a** returning player, **I want** to export my game to a JSON file, **so that** I can back it up or share it.

## 3. Navigation Flow

```mermaid
graph TD
    A[Launch App] --> B{Save Found?}
    B -- Yes --> C[Landing Screen (Continue Enabled)]
    B -- No --> D[Landing Screen (New Game Only)]
    
    C -- Click Continue --> E[Game Loop]
    D -- Click New Game --> F[Setup Wizard]
    
    F -- Step 1: World --> F
    F -- Step 2: Players --> F
    F -- Step 3: Rules --> G[Initialize State]
    
    G --> E
    
    E -- Open Dashboard --> H[Player Dashboard]
    H -- Exit Game --> C
    H -- Close --> E
```

## 4. Technical Constraints
*   **No Backend:** All state persistence must handle `localStorage` limits gracefully.
*   **Asset-Light:** Visuals must rely on CSS gradients, masks, and typography, not heavy image assets.
*   **Responsive:** All screens must function on mobile (portrait) and desktop (landscape).
