# SPEC: Error Handling and Recovery

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04

## 1. Overview
This specification defines standard error handling patterns across the app, including UI messaging, retry logic, and recovery behavior for AI, persistence, and file system operations.

## 2. Error Taxonomy

### 2.1 Categories
- **AI Errors:** timeouts, quota/limit reached, invalid response shape, streaming interruptions.
- **Persistence Errors:** Dexie read/write failures, data validation failures, migration errors.
- **File System Errors:** read/write permissions, path not found, file lock contention.
- **Network Errors:** local sidecar unavailable, connection refused, unexpected status codes.
- **UI/Workflow Errors:** missing required inputs, invalid state transitions.

### 2.2 Severity
- **P0 (Critical):** data loss, corruption, or system unusable.
- **P1 (High):** feature non-functional, but app still usable.
- **P2 (Medium):** degraded behavior, user can proceed with workarounds.
- **P3 (Low):** cosmetic or non-blocking issues.

## 3. Standard Handling Rules

### 3.1 Logging
- Log all errors to console with consistent prefixes (e.g., `[AI]`, `[PERSISTENCE]`).
- For user-facing failures, include a concise, actionable message.

### 3.2 User Messaging
- **Non-blocking errors:** show a toast/banner with clear action guidance.
- **Blocking errors:** show modal with retry/cancel and a short explanation.
- Do not show raw stack traces to users.

### 3.3 Retry Policy
- Default to **exponential backoff** for transient failures:
  - 3 attempts: 500ms, 1500ms, 3000ms.
  - Abort if error is known non-retryable (e.g., validation error).
- Surface a final failure toast after the last retry.

### 3.4 Validation Failures
- If Zod/Pydantic validation fails on load, skip invalid records, log details, and continue.
- Never hard-crash on validation of persisted data.

## 4. Component/Layer Rules

### 4.1 AI Generation (Frontend)
- Wrap provider calls with `retryWithBackoff`.
- If response fails validation, show “Generation failed; try again” and log details.
- Streaming failure: show partial results if safe, otherwise discard.

### 4.2 Python Sidecar
- Standardize FastAPI error payload shape:
  ```json
  { "error": "human readable", "code": "AI_TIMEOUT", "details": { ... } }
  ```
- Use HTTP status codes consistently (400 for validation, 429 for quota, 500 for internal).

### 4.3 Persistence
- File system writes are the source of truth; failures must be surfaced.
- Dexie failures should not block writes to disk but should show a warning.

### 4.4 Session Import/Export
- On invalid session import, show a toast and keep current session intact.
- On export failure, show retry option and a warning to back up manually.

## 5. UX Copy Guidelines
- Use short, action-oriented messages:
  - “Save failed. Check folder permissions and try again.”
  - “AI request timed out. Retry?”
  - “Import failed: incompatible session file version.”

## 6. Acceptance Criteria
- All AI and persistence errors follow the retry policy.
- User-facing errors are consistent and actionable.
- Validation errors do not crash the app and are logged.
