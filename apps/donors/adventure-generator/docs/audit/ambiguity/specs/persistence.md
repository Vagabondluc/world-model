# Ambiguity Report: Client-Side Persistence (Dexie.js)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## File Information
- **Path:** `docs/specs/persistence.md`
- **Last Modified:** Not available
- **Related Files:** `docs/specs/schema-validation.md`, `docs/specs/state-migration.md`, `docs/specs/uuid-integration.md`

## Ambiguities Found

### 1. Auto-Save Debounce Timing
- **Location:** Section 3.B.1, Line 41
- **Issue:** The spec mentions "Auto-Save (Debounced): For high-frequency changes" but doesn't specify the debounce duration (e.g., 300ms, 500ms, 1s) or what constitutes "high-frequency" vs. "critical actions."
- **Impact:** Medium
- **Suggested Resolution:** Define specific debounce intervals for different change types (text input: 500ms, drag operations: 1s, structural changes: immediate).

### 2. BulkPut Performance Considerations
- **Location:** Section 3.B, Line 50
- **Issue:** The code example shows `db.locations.bulkPut(Object.values(state.locations))` but doesn't address performance implications for large datasets (e.g., 1,000+ locations) or batching strategies.
- **Impact:** Medium
- **Suggested Resolution:** Specify batching strategies (e.g., chunk bulk operations into 100-record batches), performance targets, and loading indicators for large datasets.

### 3. Quarantine Handling for Invalid Records
- **Location:** Section 5, Line 61
- **Issue:** The spec states "Invalid records should be logged and optionally quarantined" but doesn't specify quarantine mechanism (separate table, file, in-memory store) or user notification strategy.
- **Impact:** High
- **Suggested Resolution:** Define quarantine storage mechanism, user notification process, and recovery/repair workflow for invalid data.

### 4. Link Integrity Check Scope
- **Location:** Addendum 5.2, Line 103
- **Issue:** The spec mentions "run link integrity checks" but doesn't specify what constitutes a "broken link" (missing target, wrong type, circular reference) or the frequency of checks (on load, on save, on demand).
- **Impact:** High
- **Suggested Resolution:** Define link validation rules, check frequency, and user notification strategy for broken links.

### 5. Per-Step Artifact Storage
- **Location:** Addendum 5.2, Line 104
- **Issue:** The spec mentions "Store per-step artifacts to allow partial regeneration" but doesn't specify artifact format (JSON, binary), storage location, or cleanup strategy for old artifacts.
- **Impact:** Medium
- **Suggested Resolution:** Define artifact schema, storage strategy, lifecycle management (when to prune), and user access to artifacts.

## Vague Requirements

### 1. "Graceful Fallback Defaults" Definition
- **Location:** Section 2, Line 8
- **Issue:** The goal states "Provide graceful fallback defaults when AI returns partial data" but doesn't specify what constitutes a "graceful fallback" or how defaults are determined.
- **Impact:** Medium
- **Suggested Resolution:** Define fallback strategy (e.g., use default values for missing fields, preserve partial data, notify user of missing information).

### 2. "High-frequency changes" Classification
- **Location:** Section 3.B.1, Line 41
- **Issue:** The spec distinguishes between "high-frequency changes" and "critical actions" but doesn't provide examples or clear criteria for classification.
- **Impact:** Low
- **Suggested Resolution:** Provide examples of each type (e.g., typing in text area = high-frequency, creating new entity = critical) and default save strategies for each.

### 3. "Orphan Management" Cleanup Criteria
- **Location:** Section 4.2, Line 82
- **Issue:** The spec mentions "cleanup utility in SettingsManager to 'Delete Unused Drafts'" but doesn't define what constitutes "unused" (time-based, never referenced, no parent adventure) or if cleanup is automatic or manual.
- **Impact:** Medium
- **Suggested Resolution:** Define orphan criteria (e.g., drafts older than 30 days with no parent adventure), cleanup schedule (automatic on startup, manual trigger), and user confirmation requirements.

## Missing Requirements

### 1. IndexedDB Quota Management
- **Context:** The spec defines database schema but doesn't address IndexedDB storage limits or quota exceeded handling.
- **Impact:** High
- **Suggested Addition:** Specify quota monitoring, data pruning strategies, and user notification when approaching storage limits.

### 2. Data Versioning and Migration
- **Context:** The spec defines database schema version 1 but doesn't address how schema migrations are handled when upgrading from version 1 to version 2.
- **Impact:** High
- **Suggested Addition:** Define migration strategy (automatic migration, data transformation scripts, fallback for incompatible versions) and user notification process.

### 3. Conflict Resolution for Concurrent Writes
- **Context:** The spec supports multiple windows with shared state but doesn't address how concurrent writes to IndexedDB are handled.
- **Impact:** High
- **Suggested Addition:** Specify conflict detection, merge strategies, and user notification for write conflicts.

### 4. Backup and Recovery
- **Context:** The spec focuses on persistence but doesn't address backup mechanisms or disaster recovery.
- **Impact:** High
- **Suggested Addition:** Specify backup requirements (automatic backups, export functionality), backup frequency, and recovery procedures.

### 5. Error Handling for IndexedDB Operations
- **Context:** The spec shows database operations but doesn't address error handling for failures (quota exceeded, transaction abort, database corruption).
- **Impact:** High
- **Suggested Addition:** Specify error handling strategies, retry logic, user notification, and fallback mechanisms.

## Inconsistencies

### 1. Store vs. Database Terminology
- **Conflict:** The spec uses "Zustand stores" and "Dexie.js database" interchangeably without clarifying the relationship.
- **Locations:** Throughout document
- **Impact:** Low
- **Suggested Resolution:** Standardize terminology or clarify that Zustand stores are the in-memory state layer and Dexie.js is the persistent storage layer.

### 2. Link Registry Reference
- **Conflict:** The spec mentions "Link Registry contract in docs/specs/persistence.md" but doesn't define this contract within this document.
- **Locations:** Addendum 5.2, Line 103
- **Impact:** Medium
- **Suggested Resolution:** Either define the Link Registry contract in this document or provide a clear reference to its definition location.

## Undefined Terms

| Term | Context | Suggested Definition |
|------|---------|----------------------|
| "Side effect" | Section 3, Line 29 | A function that executes automatically in response to state changes, typically used for persistence, logging, or side effects. |
| "BulkPut" | Section 3.B, Line 50 | A Dexie.js operation that inserts or updates multiple records in a single transaction for efficiency. |
| "SafeParse" | Section 5, Line 60 | A Zod validation method that returns a result object indicating success or failure without throwing exceptions. |
| "RedirectMap" | Addendum 5.1, Line 95 | A mapping of old entity IDs to new entity IDs used during regeneration to preserve links. |
| "Link Registry" | Addendum 5.2, Line 102 | A system for tracking relationships between entities (e.g., NPCs, locations, encounters) with typed link types. |

## Unclear Success Criteria

| Requirement | Current Criteria | Suggested Acceptance Criteria |
|-------------|-------------------|-------------------------------|
| Hydration completes | "Renders UI only after hydration completes" | All stores are hydrated from IndexedDB within 2s, loading spinner is displayed, and UI becomes interactive. |
| Auto-save works | "For high-frequency changes (e.g., typing in text areas)" | Changes are persisted to IndexedDB within debounce interval (e.g., 500ms), and persisted data is retrievable after page refresh. |
| Immediate save works | "For critical actions (creating a new entity, deleting)" | Critical actions are persisted to IndexedDB within 100ms, and user receives confirmation of save. |
| Data validation | "All data read from Dexie MUST pass through relevant Zod schemas" | All records pass Zod validation, invalid records are quarantined, and user is notified of validation failures. |
| Link integrity | "Run link integrity checks and surface issues to the workflow UI" | All links resolve to valid target IDs, broken links are identified on load, and user can view and repair broken links. |

## Edge Cases Not Addressed

| Scenario | Impact | Suggested Handling |
|----------|--------|---------------------|
| IndexedDB is disabled or not supported | High | Detect on initialization, show user-friendly error, offer alternative storage (localStorage) or graceful degradation. |
| Database corruption detected | High | Implement recovery strategy (backup restoration, partial data recovery), notify user, and log error for debugging. |
| Very large dataset (>10,000 records) | Medium | Implement pagination, lazy loading, or chunked operations to maintain performance. |
| User clears browser data | High | Warn user before clearing, provide export option, and implement data recovery from file system if available. |
| Rapid successive saves (e.g., user typing quickly) | Medium | Debounce effectively, prevent excessive write operations, and ensure final state is persisted. |
| Schema version mismatch | High | Detect version difference, run migration script, notify user of upgrade process, and preserve backward compatibility where possible. |
| Transaction failure during bulk operation | Medium | Implement retry logic with exponential backoff, partial rollback, and user notification. |
| Concurrent access from multiple browser tabs | High | Implement cross-tab communication (BroadcastChannel, localStorage events) to synchronize state and prevent conflicts. |

## Implicit Dependencies

| Dependency | Dependent Feature | Impact |
|------------|-------------------|--------|
| Zustand store implementation | All persistence operations | High - Persistence is implemented as side effects of Zustand stores. |
| Zod schema definitions | Section 5: Zod Validation on Load | High - Validation requires defined Zod schemas. |
| IndexedDB browser support | All persistence operations | High - Entire persistence layer depends on IndexedDB. |
| UUID generation (crypto.randomUUID()) | Data model IDs | Medium - Entity IDs must be stable UUIDs. |
| Link Registry implementation | Addendum 5.2: Link Integrity | High - Link integrity checks require Link Registry. |
| Pipeline state management | Addendum 5.2: Pipeline Data Contracts | High - Pipeline persistence requires PipelineState schema. |

## Missing Performance Requirements

| Feature | Missing Metric | Suggested Target |
|---------|----------------|------------------|
| BulkPut operations | Time to persist 1000 records | <1s for bulkPut of 1000 location records |
| Hydration performance | Time to load all data on startup | <2s for 10,000 total records across all tables |
| Query performance | Time to fetch single record | <50ms for indexed query |
| Link integrity check | Time to validate all links | <500ms for 1000 links |
| Debounce latency | Delay before auto-save | 300-500ms for text input, 1s for drag operations |

## Error Handling Gaps

| Scenario | Current Specification | Suggested Error Handling |
|----------|----------------------|-------------------------|
| IndexedDB quota exceeded | Not specified | Detect quota error, notify user with storage usage, suggest cleanup, and implement data pruning. |
| Transaction abort | Not specified | Log error, retry operation, notify user if retry fails, and preserve partial state. |
| Database open failure | Not specified | Show user-friendly error, suggest browser compatibility check, offer alternative storage. |
| Schema validation failure | Not specified | Quarantine invalid record, log validation error, notify user, and offer repair option. |
| Concurrent write conflict | Not specified | Detect conflict, show diff view, offer merge options, and prevent data loss. |
| Network drive as storage location | Not specified | Warn about potential issues, implement robust error handling, and offer local storage option. |

## Overall Assessment
- **Clarity Score:** 7/10
- **Completeness Score:** 6/10
- **Priority Issues:** 4

### Summary
The persistence specification provides a solid foundation for IndexedDB-based storage but lacks critical details around error handling, performance targets, and edge cases. The auto-save debounce timing and bulk operation performance need specificity. Missing requirements for quota management, data migration, and conflict resolution are significant gaps that could impact reliability. The Link Registry and RedirectMap references need clearer definitions or cross-references.
