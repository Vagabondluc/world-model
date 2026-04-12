# Project Gap Analysis & Requirements
**Date:** 2026-01-31
**Status:** High-Level Requirements

## 1. AI Intelligence (The Automaton)
**Current Status:** Functional Skeleton. The AI can technically take a turn (roll dice, yield), but possesses no agency or intelligence.
**Goal:** A reactive, personality-driven opponent that challenges various playstyles.

### Requirements
- [ ] **Strategic Decision Engine**
    - AI must evaluate the board state to identify high-value targets (e.g., "Best land to claim", "Nearest enemy to attack").
    - AI must manage its Action Points (Power) efficiently, saving for big moves vs. spending on small upgrades.
- [ ] **Personality/Archetypes**
    - **The Warlord:** Prioritizes military actions, avatars, and destroying enemy settlements.
    - **The Builder:** Prioritizes city upgrades, extensive land shaping, and defensive wonders.
    - **The Expansionist:** Prioritizes covering maximum territory quickly.
- [ ] **Reactive Systems**
    - **Defense:** If attacked, the AI must respond (counter-attack or fortify) rather than ignoring the event.
    - **Opportunity:** If a player is weak (low power), the AI should recognize the opening.
- [ ] **Implementation Gap:**
    - `logic/ai/brain.ts` needs a full utility scoring system.
    - `logic/ai/combat.ts` needs to be implemented.
    - `logic/ai/scanner.ts` needs to understand strategic value, not just legal moves.

## 2. The Globe (Visuals & Scale)
**Current Status:** Preliminary/Flat. The world likely feels like a generic hex grid rather than a planet.
**Goal:** A "Google Earth-like" seamless spherical experience that serves as the **Pre-Game World Generator**.

### Requirements
- [ ] **Pre-Game Genesis Protocol**
    - The Globe is generated **before** the game starts. It is not the active game board.
    - Users explore the full planet to select a specific **Region** to play in.
- [ ] **Data Flow (Decoupled)**
    - **Step 1:** Generate Planet (Smooth Globe).
    - **Step 2:** Select Region (Rectangular/Hex area).
    - **Step 3:** Convert Region to Game Board (Flat Grid).
    - *The active game loop runs on the selected region, not the full globe.*
- [ ] **True Spherical Geometry**
    - The world must be rendered as a sphere (likely Icosahedron-based) without visible UV seams or poles pinching.
    - **Specs:** See `docs/specs/036-smooth-spherical-globe-architecture.md`.
- [ ] **Visual Fidelity**
    - "Premium" aesthetic: Glassmorphism UI, atmospheric scattering shaders, dynamic lighting.
    - Avoid "low-poly" look unless stylistically intentional; aim for "Massive & Real".
- [ ] **Implementation Gap:**
    - Migration from current 3D/2D implementation to the new `SmoothSphereMesh` architecture.
    - Implementation of the **Region Selector** interface.

## 3. The Chronicler (Narrative)
**Current Status:** Non-Existent. Game actions happen and are forgotten.
**Goal:** An intelligent "Dungeon Master" that records history and weaves a story from gameplay events.

### Requirements
- [ ] **Data Capture (The Journal)**
    - Every major action (City founded, War started, Avatar killed) must generate a `JournalEntry`.
    - Entries must store context: Who, Where, When, and "Why" (if inferred).
- [ ] **Narrative Generation**
    - Use templates or LLM-lite logic to turn raw data (`P1 attacked P2`) into prose (`"The Warlord declared a blood feud against the peace-loving weavers..."`).
    - **Tone Settings:** User can select "Mythic", "Gritty", or "Concise" styles.
- [ ] **The History Book UI**
    - A searchable, paginated book interface where players can read the story of their world.
    - **Export:** Ability to export the story as Markdown/PDF/Epub.
- [ ] **Implementation Gap:**
    - Full system needs to be built. See `docs/tasks/020` through `026`.

## 4. Multiplayer Polish
**Current Status:** Operational but friction-heavy. The "Handover" bug (stuck turns) highlights the fragility.
**Goal:** A seamless "pass-and-play" or networked experience that feels professional.

### Requirements
- [ ] **Seamless Turn Handovers**
    - **Hotseat:** The "Screen Curtain" must work flawlessly.
    - **Hybrid:** If an AI takes a turn, the "Screen Curtain" must **skip** automatically (FIX REQUIRED IMMEDIATELY).
- [ ] **State Synchronization**
    - Determine if `peer-to-peer` or `host-client` architecture is used for networked play.
    - Ensure game state (RNG seeds, event log) is identical on all clients.
- [ ] **UX Flow**
    - Notifications for "Your Turn".
    - Replay system: "Watch what happened while you were away" (essential for async play).
- [ ] **Implementation Gap:**
    - Fix the `AIController` handover logic (In Progress).
    - Harden the `SyncChannel` or networking layer.
