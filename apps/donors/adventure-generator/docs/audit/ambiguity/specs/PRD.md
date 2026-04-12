# Ambiguity Report: Product Requirements Document (PRD)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## File Information
- **Path:** `docs/specs/PRD.md`
- **Last Modified:** Not available
- **Related Files:** `docs/specs/adventure-maker-ux.md`, `docs/specs/persistence.md`, `docs/specs/schema-validation.md`

## Ambiguities Found

### 1. Tech Stack Inconsistency
- **Location:** Section 3, Line 6
- **Issue:** The PRD lists "Go (CLI Tools)" in the tech stack, but the user context indicates the project uses "Python 3.11+ sidecar (FastAPI)" for AI orchestration. This creates ambiguity about which technologies are actually in use.
- **Impact:** High
- **Suggested Resolution:** Update PRD to reflect the actual tech stack: Tauri (Rust), React (TS), Python (FastAPI), and clarify the role of Go tools (if any remain).

### 2. "Local-first" vs "File-system-first" Storage Strategy
- **Location:** Section 1, Line 12
- **Issue:** The PRD states "local-first" application, but the user context specifies "File-system-first (YAML/Markdown) + IndexedDB (Dexie.js) cache". These are different architectural approaches with different implications for data synchronization and offline behavior.
- **Impact:** High
- **Suggested Resolution:** Clarify the storage strategy. Specify whether the file system is the primary source of truth with IndexedDB as a cache, or if they're meant to be synchronized.

### 3. "Streaming Generation" Implementation Details
- **Location:** Section 4.3, REQ-3.3
- **Issue:** The requirement states "AI responses must stream token-by-token" but doesn't specify which AI service (Ollama, LM Studio, or Python sidecar) or how the streaming should be implemented (WebSocket, Server-Sent Events, or chunked HTTP responses).
- **Impact:** Medium
- **Suggested Resolution:** Specify the AI service integration and the streaming mechanism to be used.

### 4. File Watching Scope and Performance
- **Location:** Section 4.1, REQ-1.3
- **Issue:** The requirement states the app "must detect external edits" but doesn't specify the scope (recursive directory watching, specific file extensions, performance constraints for large file sets) or the implementation method (native file system APIs vs. polling).
- **Impact:** Medium
- **Suggested Resolution:** Define the file watching implementation strategy, performance targets, and edge case handling (file locks, rapid changes, network drives).

### 5. "Secret" Content Sanitization
- **Location:** Section 4.5, REQ-5.2
- **Issue:** The requirement states "All content marked `secret: true` must be physically removed from the exported files" but doesn't clarify if this applies to both Hugo and Obsidian exports, or if there are different sanitization rules for each export target.
- **Impact:** High
- **Suggested Resolution:** Specify sanitization rules for each export format (Hugo vs. Obsidian) and clarify if `%% hidden %%` inline syntax should also be removed.

## Vague Requirements

### 1. Performance Metrics Lack Specificity
- **Location:** Section 7, Success Metrics
- **Issue:** Performance targets are stated as "< 2s" and "< 500ms" but don't specify the testing environment (hardware specs, browser type, dataset size for 1,000 files) or measurement methodology.
- **Impact:** Medium
- **Suggested Resolution:** Define testing environment specifications, measurement methodology, and acceptable variance ranges for performance metrics.

### 2. "0 broken links" Success Criteria
- **Location:** Section 7, Success Metrics #3
- **Issue:** The requirement states "Exported Hugo sites must have 0 broken links" but doesn't define what constitutes a "broken link" (404 error, invalid WikiLink syntax, circular references) or the validation method.
- **Impact:** Medium
- **Suggested Resolution:** Define link validation criteria, the validation process, and acceptable edge cases (optional links, external references).

### 3. Node-Based Outliner Structure Support
- **Location:** Section 4.2, REQ-2.1
- **Issue:** The requirement states nodes must support "Linear, Branching, and Hub-and-Spoke structures" but doesn't specify the maximum complexity limits, nesting depth, or visualization constraints for large graphs.
- **Impact:** Medium
- **Suggested Resolution:** Define complexity limits, performance targets for different structure types, and UI constraints for visualization.

### 4. AI Context Selector Implementation
- **Location:** Section 4.3, REQ-3.2
- **Issue:** The requirement mentions "select specific folders to feed into the Local LLM context window" but doesn't specify context window limits, prioritization strategies, or how to handle context overflow.
- **Impact:** High
- **Suggested Resolution:** Define context window size limits, folder prioritization strategies, and context truncation or summarization methods.

## Missing Requirements

### 1. Error Handling for AI Failures
- **Context:** Section 4.3 describes AI integration but doesn't address what happens when AI services are unavailable, return errors, or timeout.
- **Impact:** High
- **Suggested Addition:** Add requirements for AI service failure handling, fallback mechanisms, user notification, and retry strategies.

### 2. Data Migration and Versioning
- **Context:** The PRD describes a complex data model with schemas but doesn't address how data migrations are handled when schemas change between versions.
- **Impact:** High
- **Suggested Addition:** Specify data migration strategy, version compatibility requirements, and user data preservation during upgrades.

### 3. Concurrent Access and Conflict Resolution
- **Context:** The app supports "multiple simultaneous windows with shared state" but doesn't address how concurrent edits to the same data are handled.
- **Impact:** High
- **Suggested Addition:** Specify conflict resolution strategies for concurrent edits, locking mechanisms, and user notification for merge conflicts.

### 4. Security and Access Control
- **Context:** The app manages "secrets" and GM-only content but doesn't specify security measures for protecting this content from players.
- **Impact:** High
- **Suggested Addition:** Define access control mechanisms, authentication requirements (if any), and security measures for preventing unauthorized access to GM content.

### 5. Backup and Recovery
- **Context:** The app is "local-first" but doesn't specify backup mechanisms, disaster recovery, or data loss prevention strategies.
- **Impact:** High
- **Suggested Addition:** Specify backup requirements, automatic backup schedules, recovery procedures, and data integrity verification.

## Inconsistencies

### 1. Tech Stack Mismatch
- **Conflict:** PRD lists Go for CLI tools, but user context indicates Python sidecar for AI orchestration.
- **Locations:** Section 3 (PRD) vs. User Context
- **Impact:** High
- **Suggested Resolution:** Update PRD to accurately reflect the current tech stack or clarify if Go tools are still used for specific purposes.

### 2. Storage Strategy Ambiguity
- **Conflict:** PRD mentions "local-first" but other specs describe "file-system-first with IndexedDB cache".
- **Locations:** Section 1 (PRD) vs. `docs/specs/persistence.md`
- **Impact:** High
- **Suggested Resolution:** Standardize terminology and clarify the relationship between file system storage and IndexedDB caching across all specifications.

### 3. AI Integration Approach
- **Conflict:** PRD mentions "Local HTTP Interface (connecting to localhost:11434 for Ollama or LM Studio)" but user context indicates Python sidecar for AI orchestration.
- **Locations:** Section 3 (PRD) vs. User Context
- **Impact:** Medium
- **Suggested Resolution:** Clarify the AI service architecture - whether the app connects directly to Ollama/LM Studio or routes through the Python sidecar.

## Undefined Terms

| Term | Context | Suggested Definition |
|------|---------|----------------------|
| "Information Asymmetry" | Section 1, Line 12 | The practice of showing different information to different users (GM vs. Player) based on their roles and permissions. |
| "Fog-of-war" | Section 4.4, REQ-4.3 | A visual masking technique where map content is hidden or obscured until revealed by the GM. |
| "WikiLinks" | Section 4.2, REQ-2.3 | A markdown link syntax for referencing other files in the same vault (e.g., `[[Other File]]`). |
| "Shortcodes" | Section 4.5, REQ-5.1 | Hugo-specific template syntax for embedding content or functionality (e.g., `{{< shortcode >}}`). |
| "Die Roller" | Section 4.4, REQ-4.2 | A feature that parses dice notation (e.g., `1d20+5`) and generates random results. |

## Unclear Success Criteria

| Requirement | Current Criteria | Suggested Acceptance Criteria |
|-------------|-------------------|-------------------------------|
| REQ-1.1: Multiple windows | "The app must support multiple simultaneous windows with shared state" | App can open ≥2 windows, state changes in one window are reflected in all other windows within 100ms, and window state persists across window close/reopen. |
| REQ-3.3: Streaming Generation | "AI responses must stream token-by-token" | AI responses appear in UI within 500ms of initiation, tokens appear incrementally with ≤100ms between tokens, and streaming works for responses up to 2000 tokens. |
| REQ-5.1: Multi-Target Export | "The system must export to Hugo and Obsidian" | Export produces valid Hugo site with all links resolving, and Obsidian vault preserves all WikiLinks and includes `.canvas` file for node graph. |
| Performance: App load time | "App load time < 2s for a vault of 1,000 Markdown files" | Measured on reference hardware (specify), cold start <2s, warm start <1s, with 95th percentile <2.5s. |
| Performance: AI Latency | "Time to First Token (TTFT) from Local LLM < 500ms" | Measured from request initiation to first token display, median <500ms, 95th percentile <800ms, across 100 test prompts. |

## Edge Cases Not Addressed

| Scenario | Impact | Suggested Handling |
|----------|--------|---------------------|
| User deletes file that is currently open in multiple windows | High | Specify notification to all windows, graceful degradation to read-only mode, and option to save changes before deletion. |
| AI service returns malformed or incomplete JSON | High | Define validation requirements, retry logic with exponential backoff, and fallback to partial data or error state. |
| Export fails due to file system permissions | Medium | Specify error handling, user notification with actionable guidance, and retry mechanism. |
| Concurrent edits to same file from multiple windows | High | Define conflict detection, merge strategies, and user notification for manual resolution. |
| Very large files (>1MB) in the vault | Medium | Specify performance targets, chunked loading strategy, and memory management. |
| Network drive or cloud-synced folder as vault location | Medium | Specify handling of file system events, conflict resolution, and performance considerations. |
| User attempts to export with circular WikiLink references | Medium | Define detection, validation, and user guidance for resolution. |
| AI context window exceeds token limit | High | Define truncation strategy, prioritization of content, and user notification of context limits. |

## Implicit Dependencies

| Dependency | Dependent Feature | Impact |
|------------|-------------------|--------|
| File system watching (Tauri) | REQ-1.3: File Watching | High - Without this, external edits won't be detected. |
| Local LLM service (Ollama/LM Studio or Python sidecar) | REQ-3.3: Streaming Generation | High - AI features won't function without this. |
| IndexedDB support in browser | REQ-1.1: Multiple windows with shared state | High - Cross-window state sync requires IndexedDB. |
| Markdown parsing library (unified/remark) | REQ-2.1: Node-Based Outliner | High - Required for rendering and linking markdown. |
| React Flow library | REQ-2.1: Node-Based Outliner | High - Required for graph visualization. |
| Hugo CLI or equivalent | REQ-5.1: Export to Hugo | High - Required for site generation. |
| UUID generation (crypto.randomUUID()) | Data Model: Markdown File Structure | Medium - Required for entity identification. |
| YAML frontmatter parser | REQ-3.1: Secret Management | Medium - Required for parsing metadata. |

## Missing Performance Requirements

| Feature | Missing Metric | Suggested Target |
|---------|----------------|------------------|
| File watching performance | Latency for detecting external edits | <100ms from file change to UI update |
| Graph rendering performance | Rendering time for large node graphs | <500ms for graphs with 100 nodes |
| Export performance | Time to generate Hugo site | <5s for 1,000 files |
| IndexedDB operations | Read/write latency | <50ms for single record, <500ms for bulk operations |
| Memory usage | Maximum memory footprint | <500MB for 1,000 file vault |
| Startup performance | Time to first interactive frame | <1s for app launch |

## Error Handling Gaps

| Scenario | Current Specification | Suggested Error Handling |
|----------|----------------------|-------------------------|
| Local LLM service is not running | Not specified | Show clear error message with instructions to start service, provide "Retry" button, and offer offline mode if applicable. |
| File system watch fails (permissions, network drive) | Not specified | Log error, notify user with specific guidance, offer manual refresh option, and degrade gracefully. |
| AI response fails validation (malformed JSON) | Not specified | Retry with modified prompt, log error for debugging, show user-friendly error, and offer to use partial data. |
| Export fails (disk full, permissions) | Not specified | Show specific error message, suggest resolution, allow retry, and preserve intermediate state. |
| Concurrent edit conflict | Not specified | Detect conflict, show diff view, offer merge options, and prevent data loss. |
| UUID collision (unlikely but possible) | Not specified | Detect on generation, regenerate with new UUID, log for debugging. |
| IndexedDB quota exceeded | Not specified | Notify user, suggest cleanup options, implement data pruning strategy. |

## Overall Assessment
- **Clarity Score:** 6/10
- **Completeness Score:** 5/10
- **Priority Issues:** 5

### Summary
The PRD provides a good high-level vision but suffers from significant ambiguities around the tech stack, storage strategy, and error handling. The performance metrics lack specificity, and there are critical missing requirements for data migration, concurrent access, and security. The document needs updates to reflect the actual tech stack (Python sidecar vs. Go tools) and clarify the relationship between file-system-first storage and IndexedDB caching.
