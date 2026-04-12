# Product Requirements Document (PRD)

**Project Name:** Ensemble (Working Title)
**Version:** 1.0.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04
**Tech Stack:** Tauri (Rust), React (TS), Python (FastAPI sidecar), Local LLM (Ollama / LM Studio)

---

## 1. Executive Summary

**Ensemble** is a local-first, AI-powered Desktop application for Tabletop Role-Playing Games (TTRPGs). It treats the game world as a curated "ensemble" of Markdown files.

Unlike existing tools (Obsidian, WorldAnvil), Ensemble focuses on **Information Asymmetry**: it simultaneously renders a "Game Master View" (with secrets, AI tools, and node-based outlines) and a restricted "Player View" (immersive, read-only, fog-of-war). It also serves as a publishing engine, exporting campaign databases to static websites (Hugo) or portable vaults (Obsidian).

---

## 2. User Personas

| Persona | Role | Core Need |
| --- | --- | --- |
| **The Architect (Designer)** | System Creator | Needs to design narrative flow charts, create UI templates for stat blocks, and define schemas for valid Markdown content. |
| **The Director (GM)** | World Runner | Needs real-time access to lore, AI assistance to generate content on the fly, and controls to reveal/hide information. |
| **The Actor (Player)** | Participant | Needs an immersive, distraction-free view of the world, a place to take notes, and tools to manage their character sheet. |

---

## 3. System Architecture

### 3.1 Core Components

1. **Host:** Tauri (Rust) for window management, file system access, and heavy compute threads.
2. **Frontend:** React (TypeScript) for the UI, using `react-flow` for the node editor and `unified`/`remark` for Markdown rendering.
3. **AI Engine:** Python sidecar (FastAPI) orchestrating local AI calls (Ollama / LM Studio) and prompt routing.
4. **Publisher:** File-system export pipeline (implementation TBD; no Go dependency assumed).

---

## 4. Functional Requirements

### 4.1 The Workspace Manager (Tauri)

* **REQ-1.1:** The app must support multiple simultaneous windows with shared state.
* **REQ-1.2:** **State Isolation:** Actions in the GM window (e.g., "Reveal Map") must instantly update the Player window via local event bus (Rust-to-Frontend).
* **REQ-1.3:** **File Watching:** The app must detect external edits to Markdown files (e.g., via VS Code or Notepad) and refresh the UI automatically.
* **REQ-1.4:** **Conflict Resolution:** When multiple windows or external edits change the same entity, the app must detect conflicts using version stamps and prompt the user to resolve (keep local, keep disk, or merge where possible).

### 4.2 The Designer Workspace ("The Blueprint")

* **REQ-2.1:** **Node-Based Outliner:** A canvas interface (React Flow) to create narrative structures.
* Must support Linear, Branching, and Hub-and-Spoke structures.
* Nodes must link to actual Markdown templates.
* **REQ-2.2:** **Template Engine:** A UI to map YAML Frontmatter fields to visual components (e.g., Map `hp: 10` to a Red Progress Bar).
* **REQ-2.3:** **Schema Validation:** A tool to scan all files and report broken `[[WikiLinks]]` or missing required metadata.

### 4.3 The GM Workspace ("The Forge")

* **REQ-3.1:** **Secret Management:** Support for parsing `secret: true` frontmatter and `%% hidden %%` inline syntax. These must be visible to GM but stripped for Players.
* **REQ-3.2:** **AI Context Selector (RAG):** A sidebar allowing the GM to select specific folders (e.g., "Active Session," "Bestiary") to feed into the Local LLM context window.
* **REQ-3.3:** **Streaming Generation:** AI responses must stream token-by-token.
* **REQ-3.4:** **Quick-Look Graph:** A mini-map showing the current file's relationships (incoming/outgoing links).

### 4.4 The Player Workspace ("The Journal")

* **REQ-4.1:** **Read-Only Rendering:** Players cannot edit "World Files" (Lore), but can edit "Journal Files" (Notes).
* **REQ-4.2:** **Dice Roller:** Clicking text like `1d20+5` renders a 3D die roll or a random number result.
* **REQ-4.3:** **Fog of War:** Images/Maps default to "Blurred/Hidden" until the GM toggles visibility.

### 4.5 The Export Pipeline

* **REQ-5.1:** **Multi-Target Export:** The system must export to:
* **Hugo:** Optimized for "Hugo Book" theme (converting WikiLinks to Shortcodes).
* **Obsidian:** Optimized for portability (preserving WikiLinks, converting Node Graph to `.canvas` JSON).
* **REQ-5.2:** **Sanitization:** All content marked `secret: true` must be physically removed from the exported files, not just hidden via CSS.

---

## 4.6 Storage Strategy (Clarification)

The application is **file-system-first**:
- **Source of truth:** The user’s campaign folder on disk (YAML/Markdown + assets).
- **Cache:** IndexedDB (Dexie.js) is a performance cache and offline buffer, not the authoritative store.
- **Sync:** App startup loads from disk into cache; writes flow to disk, with cache updated for fast reads.
- **Concurrency:** Conflicts are detected using version stamps (e.g., `updatedAt` or content hashes) and surfaced to the user for resolution.

## 4.7 Backup and Recovery
- Automatic backups should be created on a schedule (e.g., daily) and before schema migrations.
- Users must be able to export a portable session snapshot (JSON) at any time.
- Recovery flow should offer: restore from last backup, restore from chosen backup, or continue without restoring.

---

## 5. Data Models

### 5.1 Markdown File Structure

```markdown
---
id: uuid-v4
type: npc | location | quest
title: "Baroness Vane"
tags: [noble, vampire]
secret: false
---
# Content
The visible description...

%% secret %%
The Baroness is actually a dragon.
%% end %%
```

### 5.2 Node Graph Structure (JSON)

```json
{
  "nodes": [
    { "id": "1", "label": "Entrance", "template": "room.md", "prompt": "Scary door" }
  ],
  "edges": [
    { "source": "1", "target": "2", "label": "Unlock Door" }
  ]
}
```

---

## 6. Roadmap & Milestones

### Phase 1: The Core (MVP)

* Setup Tauri + React boilerplate.
* Implement Markdown file reader/writer (Rust).
* Build basic Split View (GM vs Player) with simple text rendering.

### Phase 2: The Intelligence

* Integrate Ollama API.
* Build the "AI Chat" component with Markdown context injection.
* Implement `%% secret %%` parsing logic.

### Phase 3: The Designer

* Implement React Flow for the Node Graph.
* Create the "Template" system for custom UI blocks.

### Phase 4: The Publisher

* Develop the Go CLI tool.
* Implement the "Export to Hugo" feature.
* Implement the "Export to Obsidian Canvas" feature.

---

## 7. Success Metrics

1. **Performance:** App load time < 2s for a vault of 1,000 Markdown files.
2. **AI Latency:** Time to First Token (TTFT) from Local LLM < 500ms.
3. **Export Fidelity:** Exported Hugo sites must have 0 broken links.
