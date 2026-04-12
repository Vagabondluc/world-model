> **_Note: This document describes an aspirational, long-term vision for Mappa Imperium. It outlines a target architecture that includes a full backend for private, persistent games. The application's current, simpler implementation features a public, read-only Chronicle Lobby and is detailed in the `/docs/current` directory._**

# Feature Proposal: Private Chronicles & Invitation Links

**TO:** Mappa Imperium Development Team  
**CC:** Project Stakeholders, UI/UX Team  
**FROM:** Lead Frontend Engineer  
**DATE:** October 26, 2023  
**SUBJECT:** Feature Proposal: Private, Persistent Game Rooms with Invitation Links

## 1. Overview

This document outlines the architecture for a "Private Chronicle" system, a significant evolution from the public, read-only Chronicle Lobby. This feature will allow a user to create a persistent, password-protected game session on a server. Instead of manually sharing files, the creator will receive a unique, shareable URL that acts as an invitation for other players to join their specific game.

This directly addresses the user request for password protection, an alternate starting page for select people, and unique join links, enabling a true, secure, asynchronous multiplayer experience.

## 2. Architectural Shift: Introducing a Backend

The core requirement for this feature is a move from the current "serverless" model to a client-server architecture. A backend is necessary to:
-   Securely store multiple, independent game states in a database.
-   Manage user authentication and permissions for each game.
-   Provide a central API for the frontend to fetch and update game data.

**Proposed Backend Stack:**
-   **Database**: PostgreSQL or similar (to store game states, user data).
-   **API**: Node.js with Express/Fastify (to handle requests for game data).
-   **Authentication**: JWT-based system for secure user sessions.
-   **Real-time (Optional but Recommended)**: WebSockets (Socket.io) for live updates when multiple players are online simultaneously.

## 3. The "Private Chronicle" Workflow

### A. Creating a Game

1.  A logged-in user clicks "Create Private Chronicle" on the `GameSetup` screen.
2.  The frontend sends the initial `gameSettings` to a new API endpoint (e.g., `POST /api/games`).
3.  The backend creates a new game entry in the database, generating a unique `gameId`.
4.  The creator is designated as the "host" and sets a master password for the game.
5.  The backend returns the `gameId`. The frontend then redirects the user to the game's unique URL: `https://mappa-imperium.com/game/{gameId}`.

### B. The Unique Game Page

The URL `.../game/{gameId}` becomes the dedicated "lobby" or entry point for that specific game.

-   **For the Host**: They are automatically logged in and see the full game interface. The header now includes a "Share Invitation" button.
-   **For a New Player**: When they visit the link, they are presented with a simplified version of the `PlayerSelection` screen, specific to this game. They can select an open player slot, set their name, and join using the master password provided by the host.
-   **For a Returning Player**: They select their already-claimed slot and enter their personal password to rejoin.

### C. Sharing and Joining

1.  The host clicks "Share Invitation" and copies the unique URL to their clipboard.
2.  They share this link and the master game password with their friends via email, chat, etc.
3.  New players use the link and password to join, creating their own personal passwords in the process to secure their slot for future sessions.

## 4. API Endpoints (Conceptual)

-   `POST /api/games`: Create a new private game.
-   `GET /api/games/{gameId}`: Fetch the public metadata for a game lobby (player list, etc.).
-   `POST /api/games/{gameId}/join`: Join a game, claiming a player slot.
-   `GET /api/games/{gameId}/state`: (Authenticated) Fetch the full element state for an authorized player.
-   `PUT /api/games/{gameId}/state`: (Authenticated) Push updates to the game state.

## 5. Benefits

-   **Security & Privacy**: Games are no longer public. Only invited players can view or participate.
-   **Persistence**: Game state is saved automatically on the server. No more manual file import/export for passing turns.
-   **Ease of Use**: Joining a game is as simple as clicking a link and entering a password.
-   **True Asynchronous Play**: Players can log in and take their turn at any time, with the server maintaining the canonical state.

## 6. Next Steps

This feature represents a major architectural upgrade. The next step would be to fully scope the backend development work, starting with the database schema design and core API endpoints for game creation and state management. This document serves as the foundational brief for that effort.