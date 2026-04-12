# Task List: Chronicler Backlog Management

**TDD Reference:** [023-chronicler-backlog-management.tdd.md](../tdd/023-chronicler-backlog-management.tdd.md)

---

## Phase 1: Backlog Types

### Task 1.1: Create BacklogStatistics Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-007 (Backlog statistics)
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/types.ts`
2. Define `BacklogStatistics` interface with fields:
   - `totalCandidates: number`
   - `pendingCandidates: number`
   - `dismissedCandidates: number`
   - `chronicledCandidates: number`
   - `expiredCandidates: number`
3. Export interface
**Test Mapping:** TC-007-001, TC-007-002 (Statistics tests)

### Task 1.2: Create BacklogConfig Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-008 (Expiry processing)
**Implementation Steps:**
1. In `logic/chronicler/backlog/types.ts`, define `BacklogConfig` interface with fields:
   - `maxCandidates: number`
   - `candidateExpiryMs: number`
   - `autoProcessEnabled: boolean`
   - `autoProcessIntervalMs: number`
3. Export interface
**Test Mapping:** TC-008-001, TC-008-002 (Config tests)

---

## Phase 2: Backlog Storage

### Task 2.1: Create BacklogStorage Interface
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-010 (Backlog persistence)
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/storage.ts`
2. Define `BacklogStorage` interface with methods:
   - `save(backlog: ChronicleCandidate[]): Promise<void>`
   - `load(): Promise<ChronicleCandidate[]>`
   - `clear(): Promise<void>`
3. Export interface
**Test Mapping:** TC-010-001, TC-010-002 (Storage interface tests)

### Task 2.2: Create LocalStorageBacklogStorage
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-010 (LocalStorage implementation)
**Implementation Steps:**
1. In `logic/chronicler/backlog/storage.ts`, implement `LocalStorageBacklogStorage` class
2. Implement `save()` using localStorage
3. Implement `load()` from localStorage
4. Implement `clear()` from localStorage
5. Export class
**Test Mapping:** TC-010-001, TC-010-002 (LocalStorage tests)

---

## Phase 3: Backlog Manager

### Task 3.1: Create BacklogManager Class
**Priority:** P0
**Dependencies:** Task 1.2, Task 2.2
**Acceptance Criteria:** AC-001 (Candidate addition)
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/manager.ts`
2. Implement `BacklogManager` class with array storage
3. Add `addCandidate(candidate: ChronicleCandidate): void` method
4. Add `getCandidate(id: string): ChronicleCandidate | undefined` method
5. Add `getAllCandidates(): ChronicleCandidate[]` method
6. Export manager class
**Test Mapping:** TC-001-001, TC-001-002 (Manager tests)

### Task 3.2: Create BacklogManager Instance
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-001 (Global backlog manager)
**Implementation Steps:**
1. In `logic/chronicler/backlog/manager.ts`, create singleton instance `backlogManager`
2. Export singleton for application-wide use
**Test Mapping:** TC-001-001 (Singleton test)

---

## Phase 4: Candidate Addition

### Task 4.1: Implement addCandidate Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-001 (Candidate addition)
**Implementation Steps:**
1. In `BacklogManager`, implement `addCandidate()` method
2. Validate candidate before adding
3. Add candidate to storage array
4. Set candidate timestamp
5. Export method
**Test Mapping:** TC-001-001, TC-001-002 (Addition tests)

### Task 4.2: Implement Max Candidates Limit
**Priority:** P1
**Dependencies:** Task 3.1, Task 1.2
**Acceptance Criteria:** AC-001 (Max candidates limit)
**Implementation Steps:**
1. Modify `addCandidate()` to check max candidates limit
2. Remove oldest candidates if limit exceeded
3. Log warning when limit exceeded
**Test Mapping:** TC-001-003, TC-001-004 (Limit tests)

---

## Phase 5: Candidate Retrieval

### Task 5.1: Implement getCandidate Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Candidate retrieval)
**Implementation Steps:**
1. In `BacklogManager`, implement `getCandidate()` method
2. Search storage array by ID
3. Return candidate or undefined
4. Export method
**Test Mapping:** TC-002-001, TC-002-002 (Retrieval tests)

### Task 5.2: Implement getCandidatesByStatus Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-002 (Candidate retrieval by status)
**Implementation Steps:**
1. In `BacklogManager`, implement `getCandidatesByStatus()` method
2. Filter storage array by status
3. Return filtered array
4. Export method
**Test Mapping:** TC-002-003, TC-002-004 (Retrieval by status tests)

---

## Phase 6: Priority Ordering

### Task 6.1: Implement getOrderedCandidates Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-003 (Priority ordering)
**Implementation Steps:**
1. In `BacklogManager`, implement `getOrderedCandidates()` method
2. Sort candidates by priority (descending)
3. Return sorted array
4. Export method
**Test Mapping:** TC-003-001, TC-003-002 (Ordering tests)

### Task 6.2: Implement getPendingCandidates Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-003 (Pending candidates ordering)
**Implementation Steps:**
1. In `BacklogManager`, implement `getPendingCandidates()` method
2. Filter for pending status
3. Sort by priority (descending)
4. Return sorted array
5. Export method
**Test Mapping:** TC-003-003, TC-003-004 (Pending ordering tests)

---

## Phase 7: Status Updates

### Task 7.1: Implement updateCandidateStatus Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-004 (Status updates)
**Implementation Steps:**
1. In `BacklogManager`, implement `updateCandidateStatus()` method
2. Find candidate by ID
3. Update candidate status
4. Return success status
5. Export method
**Test Mapping:** TC-004-001, TC-004-002 (Status update tests)

### Task 7.2: Implement dismissCandidate Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-005 (Candidate dismissal)
**Implementation Steps:**
1. In `BacklogManager`, implement `dismissCandidate()` method
2. Find candidate by ID
3. Set status to DISMISSED
4. Return success status
5. Export method
**Test Mapping:** TC-005-001, TC-005-002 (Dismissal tests)

### Task 7.3: Implement chroniclerCandidate Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-006 (Candidate chronicling)
**Implementation Steps:**
1. In `BacklogManager`, implement `chroniclerCandidate()` method
2. Find candidate by ID
3. Set status to CHRONICLED
4. Return success status
5. Export method
**Test Mapping:** TC-006-001, TC-006-002 (Chronicling tests)

---

## Phase 8: Statistics

### Task 8.1: Implement getStatistics Method
**Priority:** P0
**Dependencies:** Task 3.1, Task 1.1
**Acceptance Criteria:** AC-007 (Backlog statistics)
**Implementation Steps:**
1. In `BacklogManager`, implement `getStatistics()` method
2. Count total candidates
3. Count candidates by status
4. Return `BacklogStatistics` object
5. Export method
**Test Mapping:** TC-007-001, TC-007-002 (Statistics tests)

---

## Phase 9: Expiry Processing

### Task 9.1: Implement processExpiredCandidates Method
**Priority:** P1
**Dependencies:** Task 3.1, Task 1.2
**Acceptance Criteria:** AC-008 (Expiry processing)
**Implementation Steps:**
1. In `BacklogManager`, implement `processExpiredCandidates()` method
2. Find candidates past expiry time
3. Set status to DISMISSED for expired candidates
4. Return count of expired candidates
5. Export method
**Test Mapping:** TC-008-001, TC-008-002 (Expiry tests)

### Task 9.2: Implement Auto Expiry Check
**Priority:** P1
**Dependencies:** Task 9.1
**Acceptance Criteria:** AC-008 (Auto expiry check)
**Implementation Steps:**
1. Add timer to `BacklogManager` for periodic expiry check
2. Call `processExpiredCandidates()` on interval
3. Start timer on manager initialization
4. Export timer control methods
**Test Mapping:** TC-008-003, TC-008-004 (Auto expiry tests)

---

## Phase 10: Auto Processing

### Task 10.1: Implement autoProcessCandidates Method
**Priority:** P1
**Dependencies:** Task 3.1, Task 1.2
**Acceptance Criteria:** AC-009 (Auto processing)
**Implementation Steps:**
1. In `BacklogManager`, implement `autoProcessCandidates()` method
2. Get pending candidates ordered by priority
3. Process top N candidates (from config)
4. Return count of processed candidates
5. Export method
**Test Mapping:** TC-009-001, TC-009-002 (Auto processing tests)

### Task 10.2: Implement Auto Processing Timer
**Priority:** P1
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-009 (Auto processing timer)
**Implementation Steps:**
1. Add timer to `BacklogManager` for periodic auto processing
2. Call `autoProcessCandidates()` on interval
3. Start timer if autoProcessEnabled in config
4. Export timer control methods
**Test Mapping:** TC-009-003, TC-009-004 (Auto timer tests)

---

## Phase 11: Persistence

### Task 11.1: Implement saveBacklog Method
**Priority:** P0
**Dependencies:** Task 3.1, Task 2.2
**Acceptance Criteria:** AC-010 (Backlog persistence)
**Implementation Steps:**
1. In `BacklogManager`, implement `saveBacklog()` method
2. Serialize candidates to JSON
3. Call storage save
4. Return promise
5. Export method
**Test Mapping:** TC-010-001, TC-010-002 (Save tests)

### Task 11.2: Implement loadBacklog Method
**Priority:** P0
**Dependencies:** Task 3.1, Task 2.2
**Acceptance Criteria:** AC-011 (Backlog loading)
**Implementation Steps:**
1. In `BacklogManager`, implement `loadBacklog()` method
2. Call storage load
3. Deserialize JSON to candidates
4. Replace current storage with loaded candidates
5. Return promise
6. Export method
**Test Mapping:** TC-011-001, TC-011-002 (Load tests)

### Task 11.3: Implement Auto Save
**Priority:** P1
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-010 (Auto save)
**Implementation Steps:**
1. Add auto save trigger after candidate operations
2. Debounce auto save to avoid excessive writes
3. Export auto save configuration
**Test Mapping:** TC-010-003, TC-010-004 (Auto save tests)

---

## Phase 12: Clearing

### Task 12.1: Implement clearBacklog Method
**Priority:** P0
**Dependencies:** Task 3.1, Task 2.2
**Acceptance Criteria:** AC-012 (Backlog clearing)
**Implementation Steps:**
1. In `BacklogManager`, implement `clearBacklog()` method
2. Clear all candidates from storage
3. Call storage clear
4. Return promise
5. Export method
**Test Mapping:** TC-012-001, TC-012-002 (Clear tests)

### Task 12.2: Implement clearByStatus Method
**Priority:** P1
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-012 (Clear by status)
**Implementation Steps:**
1. In `BacklogManager`, implement `clearByStatus()` method
2. Remove candidates with specified status
3. Return count of removed candidates
4. Export method
**Test Mapping:** TC-012-003, TC-012-004 (Clear by status tests)

---

## Phase 13: Test Files

### Task 13.1: Create BacklogManager Tests
**Priority:** P0
**Dependencies:** Task 3.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/__tests__/manager.test.ts`
2. Write tests for manager initialization
3. Write tests for singleton instance
**Test Mapping:** TC-001-001, TC-001-002

### Task 13.2: Create CandidateAddition Tests
**Priority:** P0
**Dependencies:** Task 4.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. In `logic/chronicler/backlog/__tests__/addition.test.ts`
2. Write tests for candidate addition
3. Write tests for max candidates limit
4. Write tests for duplicate candidate handling
**Test Mapping:** TC-001-001, TC-001-002

### Task 13.3: Create CandidateRetrieval Tests
**Priority:** P0
**Dependencies:** Task 5.2
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/__tests__/retrieval.test.ts`
2. Write tests for candidate retrieval by ID
3. Write tests for candidate retrieval by status
4. Write tests for missing candidate handling
**Test Mapping:** TC-002-001, TC-002-002

### Task 13.4: Create PriorityOrdering Tests
**Priority:** P0
**Dependencies:** Task 6.2
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/__tests__/ordering.test.ts`
2. Write tests for priority ordering
3. Write tests for pending candidates ordering
4. Write tests for equal priority handling
**Test Mapping:** TC-003-001, TC-003-002

### Task 13.5: Create StatusUpdate Tests
**Priority:** P0
**Dependencies:** Task 7.3
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/__tests__/status.test.ts`
2. Write tests for status update
3. Write tests for status transitions
4. Write tests for invalid status handling
**Test Mapping:** TC-004-001, TC-004-002

### Task 13.6: Create Dismissal Tests
**Priority:** P0
**Dependencies:** Task 7.2
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. In `logic/chronicler/backlog/__tests__/dismissal.test.ts`
2. Write tests for candidate dismissal
3. Write tests for dismissal of missing candidate
4. Write tests for dismissal of already dismissed candidate
**Test Mapping:** TC-005-001, TC-005-002

### Task 13.7: Create Chronicling Tests
**Priority:** P0
**Dependencies:** Task 7.3
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/__tests__/chronicling.test.ts`
2. Write tests for candidate chronicling
3. Write tests for chronicling of missing candidate
4. Write tests for chronicling of already chronicled candidate
**Test Mapping:** TC-006-001, TC-006-002

### Task 13.8: Create Statistics Tests
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/__tests__/statistics.test.ts`
2. Write tests for statistics calculation
3. Write tests for empty backlog statistics
4. Write tests for statistics with mixed statuses
**Test Mapping:** TC-007-001, TC-007-002

### Task 13.9: Create ExpiryProcessing Tests
**Priority:** P1
**Dependencies:** Task 9.2
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/__tests__/expiry.test.ts`
2. Write tests for expiry processing
3. Write tests for auto expiry check
4. Write tests for expiry configuration
**Test Mapping:** TC-008-001, TC-008-002

### Task 13.10: Create AutoProcessing Tests
**Priority:** P1
**Dependencies:** Task 10.2
**Acceptance Criteria:** AC-009
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/__tests__/auto-process.test.ts`
2. Write tests for auto processing
3. Write tests for auto processing timer
4. Write tests for auto processing configuration
**Test Mapping:** TC-009-001, TC-009-002

### Task 13.11: Create Persistence Tests
**Priority:** P0
**Dependencies:** Task 11.3
**Acceptance Criteria:** AC-010, AC-011
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/__tests__/persistence.test.ts`
2. Write tests for backlog save
3. Write tests for backlog load
4. Write tests for auto save
5. Write tests for save/load roundtrip
**Test Mapping:** TC-010-001, TC-010-002, TC-011-001, TC-011-002

### Task 13.12: Create Clearing Tests
**Priority:** P0
**Dependencies:** Task 12.2
**Acceptance Criteria:** AC-012
**Implementation Steps:**
1. Create file `logic/chronicler/backlog/__tests__/clearing.test.ts`
2. Write tests for backlog clearing
3. Write tests for clearing by status
4. Write tests for clearing empty backlog
**Test Mapping:** TC-012-001, TC-012-002

---

## Summary

**Total Tasks:** 48
**P0 Tasks:** 32 (Types, Storage, Manager, Addition, Retrieval, Ordering, Status, Statistics, Persistence, Clearing, Tests)
**P1 Tasks:** 16 (Max limit, Expiry, Auto processing, Tests)

**Phases:** 13
- Phase 1: Backlog Types (2 tasks)
- Phase 2: Backlog Storage (2 tasks)
- Phase 3: Backlog Manager (2 tasks)
- Phase 4: Candidate Addition (2 tasks)
- Phase 5: Candidate Retrieval (2 tasks)
- Phase 6: Priority Ordering (2 tasks)
- Phase 7: Status Updates (3 tasks)
- Phase 8: Statistics (1 task)
- Phase 9: Expiry Processing (2 tasks)
- Phase 10: Auto Processing (2 tasks)
- Phase 11: Persistence (3 tasks)
- Phase 12: Clearing (2 tasks)
- Phase 13: Test Files (12 tasks)
