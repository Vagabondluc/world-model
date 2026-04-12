# SPEC: Security and Access Control

**Version:** 0.1.0
**Status:** Draft
**Owner:** Engineering
**Last Updated:** 2026-02-04

---

## 1. Overview

This specification defines the security and access control model for the D&D Adventure Generator. The app is local-first and single-user by default, but it must protect GM-only content from accidental exposure, especially across multiple windows, exports, and AI prompts.

## 2. Scope

**In scope:**
- Local data access rules (GM-only vs shareable content).
- UI-level access control for views, exports, and AI prompts.
- File-system safety expectations and permissions handling.
- Redaction requirements for shared exports.

**Out of scope (for now):**
- Multi-user authentication/authorization.
- Remote hosting, accounts, or cloud syncing.
- Encryption at rest.

## 3. Requirements

### 3.1 Content Classification
- **GM-Only:** Private notes, secrets, encounter tactics, hidden NPC traits, unrevealed lore.
- **Shareable:** Player-facing summaries, public-facing descriptions, exported handouts.
- **Mixed:** Entities that include both GM-only and shareable fields must support redaction.

### 3.2 UI Access Control
- Views labeled GM-only must not be visible in any player-facing mode.
- Any export flow must offer a **redacted export** option that strips GM-only fields.
- "Share" actions must default to redacted output unless explicitly overridden.

### 3.3 AI Prompt Safety
- AI requests that generate player-visible content must exclude GM-only fields.
- AI requests for GM content must clearly tag output as GM-only in metadata.
- When context includes both GM-only and shareable data, the prompt assembly must filter by the target audience.

### 3.4 Multi-Window Behavior
- If multiple windows are open, each window must honor its own view mode (GM vs player).
- If view mode changes, active panes should update immediately to hide GM-only content.

### 3.5 File System and Exports
- File write operations must fail safely if OS permissions are insufficient.
- Exported artifacts must be labeled with redaction status in file metadata or filename suffix.
- Import flows must preserve GM-only metadata flags where present.

## 4. Data Models

- Entities should include a `visibility` or `audience` flag on fields or sections.
- If a full-field flag is not available, a per-entity boolean `containsSecrets` must be tracked.
- Export formats should include a `redacted: true|false` field at the top-level.

## 5. Implementation Notes

- Use a single redaction utility to strip GM-only data before exports and player-facing AI prompts.
- Prefer centralized guard logic in services or store selectors (not in UI components).
- Ensure redaction is applied before any file write or AI call, not after.

## 6. Error Handling

- On permission errors, present a clear message and allow retry.
- If redaction fails or is incomplete, block the export and warn the user.
- Log redaction failures with enough context to diagnose the source entity.

## 7. Testing Requirements

- Unit tests for redaction utility (GM-only fields removed, shareable fields preserved).
- Integration tests: player-facing exports never include GM-only fields.
- AI prompt assembly tests: correct filtering based on target audience.

## 8. Migration/Backwards Compatibility

- Existing data without visibility flags should default to GM-only.
- When loading legacy sessions, infer visibility from known field sets (best-effort).

## 9. References

- `docs/specs/PRD.md`
- `docs/specs/persistence.md`
- `docs/specs/error-handling.md`
