# Next Session Feature Proposals: Refined & Ratified

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


This document has been updated based on the **Risk Analysis & Critique** phase. It defines the recommended roadmap for the next development session.

## 1. World-State AI Grounding (Prompt Context) [T-706]
**Status:** ✅ **SELECTED FOR IMPLEMENTATION**
**The Vision:** Transform the map from a visual aid into the AI's "Source of Truth," but with strict complexity limits to avoid "Token Bloat."

### 💡 Refined Concept: "Direct Context Injection" (MVP)
Instead of a complex neighbor-graph traversal (which risks latency), we will focus on **Depth-First Context** for the *current* location.
-   **Primary Facts:** "You are in [City Name], a [Vocation] in the [Biome] biome."
-   **Tag Integration:** "This location has the tags: [#cursed], [#dwarven-ruin]. These mean..." (AI unpacks meaning).
-   **Simple Neighbors:** Only include immediate neighbors (Radius 1) if they are "Significant" (e.g., Capitals or Landmarks), ignoring generic terrain.

### 🛠️ Technical Plan:
-   **Grounding Utility:** `getGroundingContext(hexId)` returns a simplified string buffer.
-   **Fact Serializer:** A distinct "Narration" layer in the prompt builder.

---

## 2. Relational Map "Echoes" [T-707]
**Status:** ⚠️ **DE-PRIORITIZED / SIMPLIFIED**
**The Vision:** Multi-planar layers.
**Critique Adjustment:** The original plan for "Bi-Directional Syncing" is a major engineering risk.

### 💡 Refined Concept: "One-Way Shadowing"
-   We will implement the **Data Layers** (visual support for Shadowfell/Feywild).
-   We will **NOT** implement auto-syncing logic in this session.
-   **User Workflow:** The user manually "Clones" a location to another layer. There is no active link. This removes the "Update Hell" risk.

---

## 3. Diegetic UI "Stitch" Polish [T-710]
**Status:** ✅ **SELECTED FOR IMPLEMENTATION**
**The Vision:** Seamless Navigation and Spatial Context.
**Critique Adjustment:** "Glassmorphism" effectively removed from scope due to lack of functional value.

### 💡 Refined Concept: "The Spatial Anchor"
-   **Spatial Architecture:** Focus on a clean, high-contrast DOM structure that acts as a "Frame" for the map.
-   **Transitions:** The core value is **View Transitions**. When a user moves from "World Map" to "Tavern View," the transition should physically originate from the hex coordinates, anchoring the user in 3D space.
-   **No "Frost":** We will strip out decorative blur effects in favor of raw readability and performance.

### 🛠️ Technical Plan:
-   **Theme Engine:** `data-theme` attribute to switch color palettes (Material vs. Shadowfell) instantly.
-   **View Transition API:** Implement `document.startViewTransition` for route changes to provide that "Zoom In" feeling.

---

## 4. Sub-Map Generation
**Status:** 🛑 **DESCOPED (Risk: Scope Creep)**
**Reasoning:** Building a battlemap generator is effectively building a second application. It distracts from the core value proposition of *World* generation.
**Action:** Removed from immediate roadmap.

---

## 5. Region & Location Workspace
**Status:** ⏳ **BACKLOGGED (Functional but dry)**
**Reasoning:** While useful, it adds "Database Manager" UI which fights against the "Immersive Game" feel we want to establish with the Stitch Polish. We will revisit this after the UI overhaul.

---

## 🚀 The Ratified Roadmap

We will proceed with a **Hybrid Sprint** focusing on **Intelligence & Immersion**.

### Step 1: The "Brain" (AI Grounding)
Implement the **Grounding Utility** to make the AI aware of the map's tags and immediate biome.
*   *Why first?* It proves the core loop: Map -> Data -> AI -> Narrative.

### Step 2: The "Beauty" (Stitch UI)
Implement **View Transitions** to anchor the user in the world.
*   *Why second?* It improves the "Feel" of the app without risking the "Function."

### Ticket Breakdown
*   **[T-706]** AI Grounding Service (Context Injection)
*   **[T-710]** Stitch UI Overhaul (Spatial Transitions & Clean Architecture)

## Addendum: Multi-Step Pipeline Integration

- Pipeline: Analyze Campaign State -> Generate Proposals -> Link to Entities -> GM Digest.
- Proposals must link to referenced NPCs, locations, encounters, and adventures using the Link Registry contract in `docs/specs/persistence.md`.
- Block publication when required links are missing.
