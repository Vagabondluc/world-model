# Task List: Chronicler Data Models

**TDD Reference:** [020-chronicler-data-models.tdd.md](../tdd/020-chronicler-data-models.tdd.md)

---

## Phase 1: Core Type Definitions

### Task 1.1: Create EntryType Enum
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (JournalEntry structure - EntryType field)
**Implementation Steps:**
1. Create file `logic/chronicler/types.ts`
2. Define `EntryType` enum with values: `MYTH`, `OBSERVATION`, `EVENT`, `NOTE`
3. Export enum for use in data models
**Test Mapping:** TC-001-001, TC-001-002 (EntryType validation tests)

### Task 1.2: Create EntryScope Enum
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (JournalEntry structure - EntryScope field)
**Implementation Steps:**
1. In `logic/chronicler/types.ts`, define `EntryScope` enum with values: `GLOBAL`, `REGION`, `CELL`
2. Export enum for use in data models
**Test Mapping:** TC-001-003, TC-001-004 (EntryScope validation tests)

### Task 1.3: Create Author Type Definition
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-004 (Author assignment - Author field)
**Implementation Steps:**
1. In `logic/chronicler/types.ts`, define `Author` interface with fields: `id`, `name`, `type`
2. Define `AuthorType` enum: `PLAYER`, `SYSTEM`, `NPC`
3. Export types for use in data models
**Test Mapping:** TC-004-001, TC-004-002 (Author type tests)

---

## Phase 2: JournalEntry Interface

### Task 2.1: Create JournalEntry Interface
**Priority:** P0
**Dependencies:** Tasks 1.1, 1.2, 1.3
**Acceptance Criteria:** AC-001 (JournalEntry structure)
**Implementation Steps:**
1. In `logic/chronicler/types.ts`, define `JournalEntry` interface with all required fields:
   - `id: string`
   - `type: EntryType`
   - `scope: EntryScope`
   - `title: string`
   - `text: string`
   - `author: Author`
   - `timestamp: number`
   - `contextId?: string`
2. Export interface
**Test Mapping:** TC-001-001 through TC-001-006 (JournalEntry creation and validation tests)

### Task 2.2: Create JournalEntry Factory Function
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (JournalEntry creation)
**Implementation Steps:**
1. Create file `logic/chronicler/factories.ts`
2. Implement `createJournalEntry()` function with validation
3. Add default value handling for optional fields
4. Export factory function
**Test Mapping:** TC-001-001, TC-001-002 (Happy path creation tests)

### Task 2.3: Create JournalEntry Validator
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (JournalEntry validation)
**Implementation Steps:**
1. In `logic/chronicler/validators.ts`, implement `validateJournalEntry()` function
2. Add validation for required fields
3. Add validation for field types
4. Return validation result with errors array
**Test Mapping:** TC-001-003 through TC-001-006 (Validation error tests)

---

## Phase 3: Entry ID Generation

### Task 3.1: Create Entry ID Generator Utility
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-010 (Entry ID generation)
**Implementation Steps:**
1. Create file `logic/chronicler/utils.ts`
2. Implement `generateEntryId()` function using timestamp + random suffix
3. Ensure uniqueness guarantee
4. Export utility function
**Test Mapping:** TC-010-001, TC-010-002 (ID generation tests)

### Task 3.2: Integrate ID Generator with JournalEntry Factory
**Priority:** P0
**Dependencies:** Task 2.2, Task 3.1
**Acceptance Criteria:** AC-010 (Entry ID generation integration)
**Implementation Steps:**
1. Modify `createJournalEntry()` to use `generateEntryId()`
2. Allow optional ID override for testing
3. Update factory to auto-generate ID when not provided
**Test Mapping:** TC-010-001 (Auto-generation test), TC-010-002 (Override test)

---

## Phase 4: LoreTemplate System

### Task 4.1: Create LoreTemplate Interface
**Priority:** P1
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-005 (LoreTemplate structure)
**Implementation Steps:**
1. In `logic/chronicler/types.ts`, define `LoreTemplate` interface with fields:
   - `id: string`
   - `entryType: EntryType`
   - `titleTemplate: string`
   - `textTemplate: string`
   - `placeholders: string[]`
   - `deprecated: boolean`
2. Export interface
**Test Mapping:** TC-005-001 through TC-005-004 (LoreTemplate tests)

### Task 4.2: Create LoreTemplate Registry
**Priority:** P1
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-005 (LoreTemplate registration)
**Implementation Steps:**
1. Create file `logic/chronicler/registry.ts`
2. Implement `LoreTemplateRegistry` class with Map storage
3. Add `register()` method
4. Add `get()` method
5. Add `getAll()` method
6. Export registry class
**Test Mapping:** TC-005-001, TC-005-002 (Registration and retrieval tests)

### Task 4.3: Create LoreTemplate Factory
**Priority:** P1
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-005 (LoreTemplate creation)
**Implementation Steps:**
1. In `logic/chronicler/factories.ts`, implement `createLoreTemplate()` function
2. Add validation for required fields
3. Set default `deprecated: false`
4. Export factory function
**Test Mapping:** TC-005-001 (Happy path creation test)

---

## Phase 5: LoreContext System

### Task 5.1: Create LoreContext Interface
**Priority:** P1
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-006 (LoreContext structure)
**Implementation Steps:**
1. In `logic/chronicler/types.ts`, define `LoreContext` interface with fields:
   - `id: string`
   - `entryType: EntryType`
   - `scope: EntryScope`
   - `data: Record<string, unknown>`
   - `resolved: boolean`
2. Export interface
**Test Mapping:** TC-006-001 through TC-006-004 (LoreContext tests)

### Task 5.2: Create LoreContext Resolver
**Priority:** P1
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-006 (LoreContext resolution)
**Implementation Steps:**
1. Create file `logic/chronicler/resolvers.ts`
2. Implement `resolveLoreContext()` function
3. Add context data resolution logic
4. Set `resolved: true` after successful resolution
5. Export resolver function
**Test Mapping:** TC-006-003, TC-006-004 (Resolution tests)

### Task 5.3: Create LoreContext Factory
**Priority:** P1
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-006 (LoreContext creation)
**Implementation Steps:**
1. In `logic/chronicler/factories.ts`, implement `createLoreContext()` function
2. Set default `resolved: false`
3. Initialize empty data object
4. Export factory function
**Test Mapping:** TC-006-001 (Happy path creation test)

---

## Phase 6: ChronicleCandidate System

### Task 6.1: Create ChronicleCandidate Interface
**Priority:** P1
**Dependencies:** Task 2.1, Task 5.1
**Acceptance Criteria:** AC-007 (ChronicleCandidate structure)
**Implementation Steps:**
1. In `logic/chronicler/types.ts`, define `ChronicleCandidate` interface with fields:
   - `id: string`
   - `entry: Partial<JournalEntry>`
   - `context: LoreContext`
   - `priority: number`
   - `status: CandidateStatus`
   - `createdAt: number`
   - `expiresAt?: number`
2. Define `CandidateStatus` enum: `PENDING`, `DISMISSED`, `CHRONICLED`
3. Export types
**Test Mapping:** TC-007-001 through TC-007-004 (ChronicleCandidate tests)

### Task 6.2: Create ChronicleCandidate Factory
**Priority:** P1
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-007 (ChronicleCandidate creation)
**Implementation Steps:**
1. In `logic/chronicler/factories.ts`, implement `createChronicleCandidate()` function
2. Set default `priority: 0`
3. Set default `status: CandidateStatus.PENDING`
4. Set `createdAt` to current timestamp
5. Export factory function
**Test Mapping:** TC-007-001 (Happy path creation test)

---

## Phase 7: ChroniclerSession System

### Task 7.1: Create ChroniclerSession Interface
**Priority:** P1
**Dependencies:** Task 2.1, Task 6.1
**Acceptance Criteria:** AC-008 (ChroniclerSession structure)
**Implementation Steps:**
1. In `logic/chronicler/types.ts`, define `ChroniclerSession` interface with fields:
   - `id: string`
   - `entries: JournalEntry[]`
   - `candidates: ChronicleCandidate[]`
   - `active: boolean`
   - `startedAt: number`
   - `endedAt?: number`
2. Export interface
**Test Mapping:** TC-008-001 through TC-008-004 (ChroniclerSession tests)

### Task 7.2: Create ChroniclerSession Manager
**Priority:** P1
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-008 (ChroniclerSession management)
**Implementation Steps:**
1. Create file `logic/chronicler/session.ts`
2. Implement `ChroniclerSessionManager` class
3. Add `startSession()` method
4. Add `endSession()` method
5. Add `addEntry()` method
6. Add `addCandidate()` method
7. Export manager class
**Test Mapping:** TC-008-002, TC-008-003 (Session lifecycle tests)

### Task 7.3: Create ChroniclerSession Factory
**Priority:** P1
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-008 (ChroniclerSession creation)
**Implementation Steps:**
1. In `logic/chronicler/factories.ts`, implement `createChroniclerSession()` function
2. Set default `active: true`
3. Initialize empty entries and candidates arrays
4. Set `startedAt` to current timestamp
5. Export factory function
**Test Mapping:** TC-008-001 (Happy path creation test)

---

## Phase 8: AutoChroniclerConfig System

### Task 8.1: Create AutoChroniclerConfig Interface
**Priority:** P1
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-009 (AutoChroniclerConfig structure)
**Implementation Steps:**
1. In `logic/chronicler/types.ts`, define `AutoChroniclerConfig` interface with fields:
   - `enabled: boolean`
   - `verbosity: VerbosityLevel`
   - `includeMyths: boolean`
   - `includeObservations: boolean`
   - `maxCandidatesPerTick: number`
   - `autoProcessInterval: number`
2. Define `VerbosityLevel` enum: `MINIMAL`, `NORMAL`, `VERBOSE`
3. Export types
**Test Mapping:** TC-009-001 through TC-009-004 (AutoChroniclerConfig tests)

### Task 8.2: Create AutoChroniclerConfig Factory
**Priority:** P1
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-009 (AutoChroniclerConfig creation)
**Implementation Steps:**
1. In `logic/chronicler/factories.ts`, implement `createAutoChroniclerConfig()` function
2. Set default `enabled: false`
3. Set default `verbosity: VerbosityLevel.NORMAL`
4. Set default `includeMyths: true`
5. Set default `includeObservations: true`
6. Set default `maxCandidatesPerTick: 5`
7. Set default `autoProcessInterval: 60000`
8. Export factory function
**Test Mapping:** TC-009-001 (Happy path creation test)

---

## Phase 9: Myth Conflict Resolution

### Task 9.1: Create Myth Conflict Detector
**Priority:** P2
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-011 (Myth conflict resolution)
**Implementation Steps:**
1. Create file `logic/chronicler/conflict.ts`
2. Implement `detectMythConflict()` function
3. Compare new myth entry against existing myths
4. Return conflict detection result
5. Export detector function
**Test Mapping:** TC-011-001, TC-011-002 (Conflict detection tests)

### Task 9.2: Create Myth Conflict Resolver
**Priority:** P2
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-011 (Myth conflict resolution)
**Implementation Steps:**
1. In `logic/chronicler/conflict.ts`, implement `resolveMythConflict()` function
2. Implement conflict resolution strategy (merge, reject, or flag)
3. Return resolution result with action taken
4. Export resolver function
**Test Mapping:** TC-011-003, TC-011-004 (Conflict resolution tests)

### Task 9.3: Integrate Conflict Resolution with Entry Creation
**Priority:** P2
**Dependencies:** Task 2.2, Task 9.2
**Acceptance Criteria:** AC-011 (Myth conflict resolution integration)
**Implementation Steps:**
1. Modify `createJournalEntry()` to check for myth conflicts
2. Call `detectMythConflict()` for myth entries
3. Call `resolveMythConflict()` if conflict detected
4. Handle resolution result appropriately
**Test Mapping:** TC-011-003, TC-011-004 (Integration tests)

---

## Phase 10: Entry Deletion Policy

### Task 10.1: Create Entry Deletion Validator
**Priority:** P2
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-012 (Entry deletion policy)
**Implementation Steps:**
1. Create file `logic/chronicler/deletion.ts`
2. Implement `canDeleteEntry()` function
3. Check entry deletion constraints
4. Return boolean result
5. Export validator function
**Test Mapping:** TC-012-001, TC-012-002 (Deletion validation tests)

### Task 10.2: Create Entry Deletion Handler
**Priority:** P2
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-012 (Entry deletion handling)
**Implementation Steps:**
1. In `logic/chronicler/deletion.ts`, implement `deleteEntry()` function
2. Validate deletion permission
3. Perform deletion with proper cleanup
4. Return deletion result
5. Export handler function
**Test Mapping:** TC-012-003, TC-012-004 (Deletion handling tests)

### Task 10.3: Create Entry Deletion Policy Enum
**Priority:** P2
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-012 (Entry deletion policy types)
**Implementation Steps:**
1. In `logic/chronicler/types.ts`, define `DeletionPolicy` enum with values: `ALLOWED`, `PROTECTED`, `ARCHIVED_ONLY`
2. Export enum
**Test Mapping:** TC-012-001, TC-012-002 (Policy type tests)

---

## Phase 11: Author Assignment Integration

### Task 11.1: Create Author Assignment Helper
**Priority:** P1
**Dependencies:** Task 1.3, Task 2.1
**Acceptance Criteria:** AC-004 (Author assignment)
**Implementation Steps:**
1. Create file `logic/chronicler/author.ts`
2. Implement `assignAuthor()` function
3. Handle player, system, and NPC author assignment
4. Return author object
5. Export helper function
**Test Mapping:** TC-004-001, TC-004-002 (Author assignment tests)

### Task 11.2: Integrate Author Assignment with Entry Factory
**Priority:** P1
**Dependencies:** Task 2.2, Task 11.1
**Acceptance Criteria:** AC-004 (Author assignment integration)
**Implementation Steps:**
1. Modify `createJournalEntry()` to use `assignAuthor()`
2. Add author parameter with default system author
3. Update factory to handle author assignment
**Test Mapping:** TC-004-001 (Integration test)

---

## Phase 12: Test Files

### Task 12.1: Create EntryType Tests
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/types.test.ts`
2. Write tests for EntryType enum values
3. Write tests for EntryType validation
**Test Mapping:** TC-001-001, TC-001-002

### Task 12.2: Create EntryScope Tests
**Priority:** P0
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. In `logic/chronicler/__tests__/types.test.ts`
2. Write tests for EntryScope enum values
3. Write tests for EntryScope validation
**Test Mapping:** TC-001-003, TC-001-004

### Task 12.3: Create JournalEntry Tests
**Priority:** P0
**Dependencies:** Task 2.3
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/JournalEntry.test.ts`
2. Write happy path tests for entry creation
3. Write edge case tests for optional fields
4. Write error case tests for validation
**Test Mapping:** TC-001-001 through TC-001-006

### Task 12.4: Create LoreTemplate Tests
**Priority:** P1
**Dependencies:** Task 4.2
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/LoreTemplate.test.ts`
2. Write tests for template registration
3. Write tests for template retrieval
4. Write tests for template deprecation
**Test Mapping:** TC-005-001 through TC-005-004

### Task 12.5: Create LoreContext Tests
**Priority:** P1
**Dependencies:** Task 5.2
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/LoreContext.test.ts`
2. Write tests for context creation
3. Write tests for context resolution
4. Write tests for context data handling
**Test Mapping:** TC-006-001 through TC-006-004

### Task 12.6: Create ChronicleCandidate Tests
**Priority:** P1
**Dependencies:** Task 6.2
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/ChronicleCandidate.test.ts`
2. Write tests for candidate creation
3. Write tests for candidate status updates
4. Write tests for candidate priority handling
**Test Mapping:** TC-007-001 through TC-007-004

### Task 12.7: Create ChroniclerSession Tests
**Priority:** P1
**Dependencies:** Task 7.2
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/ChroniclerSession.test.ts`
2. Write tests for session lifecycle
3. Write tests for entry addition
4. Write tests for candidate addition
**Test Mapping:** TC-008-001 through TC-008-004

### Task 12.8: Create AutoChroniclerConfig Tests
**Priority:** P1
**Dependencies:** Task 8.2
**Acceptance Criteria:** AC-009
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/AutoChroniclerConfig.test.ts`
2. Write tests for config creation
3. Write tests for verbosity levels
4. Write tests for config updates
**Test Mapping:** TC-009-001 through TC-009-004

### Task 12.9: Create Author Tests
**Priority:** P0
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/Author.test.ts`
2. Write tests for author types
3. Write tests for author assignment
4. Write tests for author validation
**Test Mapping:** TC-004-001, TC-004-002

### Task 12.10: Create Entry ID Generation Tests
**Priority:** P0
**Dependencies:** Task 3.2
**Acceptance Criteria:** AC-010
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/utils.test.ts`
2. Write tests for ID generation
3. Write tests for ID uniqueness
4. Write tests for ID override
**Test Mapping:** TC-010-001, TC-010-002

### Task 12.11: Create Myth Conflict Resolution Tests
**Priority:** P2
**Dependencies:** Task 9.3
**Acceptance Criteria:** AC-011
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/conflict.test.ts`
2. Write tests for conflict detection
3. Write tests for conflict resolution
4. Write tests for conflict integration
**Test Mapping:** TC-011-001 through TC-011-004

### Task 12.12: Create Entry Deletion Tests
**Priority:** P2
**Dependencies:** Task 10.2
**Acceptance Criteria:** AC-012
**Implementation Steps:**
1. Create file `logic/chronicler/__tests__/deletion.test.ts`
2. Write tests for deletion validation
3. Write tests for deletion handling
4. Write tests for deletion policies
**Test Mapping:** TC-012-001 through TC-012-004

---

## Summary

**Total Tasks:** 44
**P0 Tasks:** 13 (Core types, JournalEntry, ID generation, tests)
**P1 Tasks:** 20 (Template, Context, Candidate, Session, Config, Author systems)
**P2 Tasks:** 11 (Conflict resolution, Deletion policy)

**Phases:** 12
- Phase 1: Core Type Definitions (3 tasks)
- Phase 2: JournalEntry Interface (3 tasks)
- Phase 3: Entry ID Generation (2 tasks)
- Phase 4: LoreTemplate System (3 tasks)
- Phase 5: LoreContext System (3 tasks)
- Phase 6: ChronicleCandidate System (2 tasks)
- Phase 7: ChroniclerSession System (3 tasks)
- Phase 8: AutoChroniclerConfig System (2 tasks)
- Phase 9: Myth Conflict Resolution (3 tasks)
- Phase 10: Entry Deletion Policy (3 tasks)
- Phase 11: Author Assignment Integration (2 tasks)
- Phase 12: Test Files (12 tasks)
