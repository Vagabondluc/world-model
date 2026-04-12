# TDD Plan: Ensemble (DnD Adventure Generator Pivot)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


This document outlines the granular engineering tasks required to implement the "Ensemble" PRD. tasks are grouped by Phase and Component.

**Status Legend:**
- [ ] Pending
- [x] Complete
- [!] Blocked

---

## Phase 1: Core Architecture & File System (The "Host")

**Objective:** Establish the Rust/Tauri backend as the source of truth for the file system, enabling multi-window state synchronization.

### 1.1 Tauri Backend (Rust)
*   [ ] **Task 1.1.1:** Configure `tauri.conf.json` for multi-window support.
    *   *Verification:* Can spawn a secondary "Player View" window from the main "GM View" window via a button click.
*   [ ] **Task 1.1.2:** Implement `Command` for `read_markdown_file(path: String) -> Result<FileContent, String>`.
    *   *Details:* Should separate Frontmatter (YAML) from Content (String).
    *   *Verification:* Unit test in Rust reading a sample `.md` file.
*   [ ] **Task 1.1.3:** Implement `Command` for `write_markdown_file(path: String, content: String, frontmatter: String)`.
    *   *Verification:* File appears on disk with correct encoding and new frontmatter.
*   [ ] **Task 1.1.4:** Implement File Watcher (Hot-Reload).
    *   *Details:* Use `notify` crate or `tauri-plugin-fs-watch`.
    *   *Verification:* Edit a file in Notepad; the Tauri UI logs the change event within 500ms.

### 1.2 Frontend State (React/Zustand)
*   [ ] **Task 1.2.1:** Refactor `CampaignStore` to `EnsembleStore`.
    *   *State Model:*
        ```typescript
        interface FileNode { id: string; path: string; type: 'doc' | 'folder'; }
        interface EnsembleState {
            rootPath: string;
            fileIndex: Record<string, FileNode>; // Quick lookup
            openFiles: string[]; // Tabs
            activeWindow: 'gm' | 'player';
        }
        ```
*   [ ] **Task 1.2.2:** Implement `FileSystemSync` service.
    *   *Details:* A React hook that listens to Tauri Event Bus for file watcher events and updates the Store.

---

## Phase 2: The Markdown Engine (The "Lens")

**Objective:** Render Markdown with "Ensemble" specific features (WikiLinks, Secrets, Fog of War).

### 2.1 Markdown Parsing
*   [ ] **Task 2.1.1:** Setup `unified` / `remark` / `rehype` pipeline.
*   [ ] **Task 2.1.2:** Implement `remark-wikilink` plugin configuration.
    *   *Verification:* `[[The Dark Tower]]` renders as a clickable React Router link.
*   [ ] **Task 2.1.3:** Implement `remark-secret-block` custom plugin.
    *   *Logic:*
        *   Regex: `%% secret %% (.*?) %% end %%`
        *   Render: `<div className="gm-secret">...</div>` (GM View) vs `<!-- secret -->` (Player View).
    *   *Verification:* Toggle "Player View" mode; secret text disappears from DOM.

### 2.2 UI Components
*   [ ] **Task 2.2.1:** Create `MarkdownEditor` (Monaco or specialized text area).
*   [ ] **Task 2.2.2:** Create `MarkdownViewer` (Read-only render).
*   [ ] **Task 2.2.3:** Implement "Fog of War" Image Component.
    *   *Details:* Image loads with `filter: blur(20px)` and a "Reveal" button (GM only).

---

## Phase 3: The Designer Workspace (The "Blueprint")

**Objective:** Visualize the narrative structure using Node-Based editing.

### 3.1 Graph Engine
*   [ ] **Task 3.1.1:** Install & Setup `react-flow`.
*   [ ] **Task 3.1.2:** Implement `GraphService`.
    *   *Logic:* Scan all Markdown files for `[[WikiLinks]]`.
    *   *Transform:* Convert Files -> Nodes, Links -> Edges.
    *   *Verification:* Creating a link in File A to File B automatically draws an arrow in the Graph View.

### 3.2 Canvas UI
*   [ ] **Task 3.2.1:** Create `BlueprintCanvas` component.
*   [ ] **Task 3.2.2:** Implement "Quick Create" Node.
    *   *Action:* Double click canvas -> Create new `.md` file -> Add Node.

---

## Phase 4: The Intelligence (Ollama Integ.)

**Objective:** Leverage the existing Ollama work for RAG (Retrieval Augmented Generation).

### 4.1 Context Engine
*   [ ] **Task 4.1.1:** Create `ContextManager` service.
    *   *Action:* User selects a Folder ("Chapter 1").
    *   *Logic:* Read all files in folder -> Concatenate text -> Token Count check.
*   [ ] **Task 4.1.2:** Implement "Active Page" context.
    *   *Logic:* When chatting, automatically inject the content of the currently open Markdown file as system prompt context.

### 4.2 UI Updates
*   [ ] **Task 4.2.1:** Update `AIPanel` to support "Context Paling" (visual indicator of what the AI is reading).

---

## Phase 5: The Export Pipeline (Go)

**Objective:** decouple publishing from the main app using a robust CLI tool.

### 5.1 The CLI Tool (Go)
*   [ ] **Task 5.1.1:** Initialize Go module `ensemble-cli`.
*   [ ] **Task 5.1.2:** Implement `walker`.
    *   *Logic:* Recursive directory walk looking for `.md` files.
*   [ ] **Task 5.1.3:** Implement `sanitizer`.
    *   *Logic:* buffer read file -> remove `%% secret %%` -> write to `dist/`.
*   [ ] **Task 5.1.4:** Implement `hugo-transform`.
    *   *Logic:* Convert `[[Link]]` to `{{< relref "Link" >}}`.

### 5.2 Tauri Integration
*   [ ] **Task 5.2.1:** Add Sidebar button "Publish".
*   [ ] **Task 5.2.2:** Tauri `Command` spawns `ensemble-cli export --target=hugo --source=./vault`.

---

## 6. Migration Strategy (From Current App)

We are pivoting from a "Database-heavy" app to a "File-heavy" app.

1.  **Stop:** designing new SQL/Dexie schemas.
2.  **Keep:** The `dnd adventure generator/src/components/ai` (Ollama logic is good).
3.  **Refactor:** The `Sidebar` to visualize a File Tree instead of Route Links.
4.  **Refactor:** `App.tsx` to utilize the new `EnsembleStore`.

## 7. Next Immediate Steps (Session 1)

1.  [ ] **FS Access:** Verify we can read/write raw MD files from `src-tauri`.
2.  [ ] **Store:** Create the `EnsembleStore`.
3.  [ ] **UI:** Build the `FileTree` component.
