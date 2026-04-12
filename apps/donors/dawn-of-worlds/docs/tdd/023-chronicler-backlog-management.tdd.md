# TDD: Chronicler Backlog Management

## Specification Reference
- Spec: [`023-chronicler-backlog-management.md`](../specs/023-chronicler-backlog-management.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: Candidate Addition
**Given** a ChronicleCandidate is created
**When** candidate is added to backlog
**Then** candidate must be stored and queue rebuilt

### AC-002: Candidate Retrieval
**Given** a backlog exists
**When** next candidate is requested
**Then** highest priority pending candidate must be returned

### AC-003: Priority Ordering
**Given** multiple candidates in backlog
**When** queue is rebuilt
**Then** candidates must be ordered by urgency, age, then creation time

### AC-004: Candidate Status Update
**Given** a candidate is processed
**When** status is updated
**Then** candidate must reflect new status and queue rebuilt

### AC-005: Candidate Dismissal
**Given** a pending candidate
**When** player dismisses candidate
**Then** candidate status must be DISMISSED

### AC-006: Candidate Chronicling
**Given** a pending candidate
**When** entry is created from candidate
**Then** candidate status must be CHRONICLED with entry ID

### AC-007: Backlog Statistics
**Given** a backlog with candidates
**When** statistics are requested
**Then** accurate counts by status, urgency, and age must be returned

### AC-008: Expiry Processing
**Given** candidates with expiry dates
**When** age advances past expiry
**Then** expired candidates must be marked EXPIRED

### AC-009: Auto-Processing
**Given** pending candidates in backlog
**When** auto-processing is triggered
**Then** eligible candidates must be processed within limits

### AC-010: Backlog Persistence
**Given** a backlog with candidates
**When** game is saved
**Then** backlog must be persisted to storage

### AC-011: Backlog Loading
**Given** saved backlog data
**When** game is loaded
**Then** backlog must be restored with all candidates

### AC-012: Backlog Clearing
**Given** a new game starts
**When** backlog is cleared
**Then** all candidates must be removed

---

## Test Cases

### AC-001: Candidate Addition

#### TC-001-001: Happy Path - Add Single Candidate
**Input**:
```typescript
{
  candidate: {
    id: "cc_001",
    triggerType: "SETTLEMENT_FOUND",
    status: "PENDING",
    urgency: "NORMAL",
    age: 1,
    createdAtTurn: 10
  }
}
```
**Expected**: Candidate added, queue rebuilt
**Priority**: P0

#### TC-001-002: Happy Path - Add Multiple Candidates
**Input**:
```typescript
{
  candidates: [
    { id: "cc_001", urgency: "HIGH", age: 1, createdAtTurn: 10 },
    { id: "cc_002", urgency: "NORMAL", age: 1, createdAtTurn: 15 },
    { id: "cc_003", urgency: "LOW", age: 1, createdAtTurn: 20 }
  ]
}
```
**Expected**: All candidates added, queue rebuilt
**Priority**: P0

#### TC-001-003: Edge Case - Add Duplicate Candidate ID
**Input**:
```typescript
{
  candidate: { id: "cc_001", urgency: "NORMAL" }
}
```
**Expected**: Error thrown or existing candidate replaced
**Priority**: P1

#### TC-001-004: Integration - Add from Trigger
**Input**:
```typescript
{
  trigger: { id: "SETTLEMENT_FOUND", urgency: "NORMAL" },
  event: { id: "evt_001", type: "WORLD_CREATE" }
}
```
**Expected**: Candidate created and added to backlog
**Priority**: P0

---

### AC-002: Candidate Retrieval

#### TC-002-001: Happy Path - Get Next Candidate
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", urgency: "HIGH", status: "PENDING", age: 1, createdAtTurn: 10 },
      { id: "cc_002", urgency: "NORMAL", status: "PENDING", age: 1, createdAtTurn: 15 }
    ]
  }
}
```
**Expected**: Returns cc_001 (HIGH urgency)
**Priority**: P0

#### TC-002-002: Happy Path - Get Next with Same Urgency
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", urgency: "NORMAL", status: "PENDING", age: 1, createdAtTurn: 10 },
      { id: "cc_002", urgency: "NORMAL", status: "PENDING", age: 1, createdAtTurn: 15 }
    ]
  }
}
```
**Expected**: Returns cc_001 (earlier creation time)
**Priority**: P0

#### TC-002-003: Edge Case - Empty Backlog
**Input**:
```typescript
{
  backlog: { candidates: [] }
}
```
**Expected**: Returns undefined
**Priority**: P1

#### TC-002-004: Edge Case - All Candidates Processed
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", status: "CHRONICLED" },
      { id: "cc_002", status: "DISMISSED" }
    ]
  }
}
```
**Expected**: Returns undefined
**Priority**: P1

---

### AC-003: Priority Ordering

#### TC-003-001: Happy Path - Order by Urgency
**Input**:
```typescript
{
  candidates: [
    { id: "cc_001", urgency: "LOW", age: 1, createdAtTurn: 10 },
    { id: "cc_002", urgency: "HIGH", age: 1, createdAtTurn: 20 },
    { id: "cc_003", urgency: "NORMAL", age: 1, createdAtTurn: 15 }
  ]
}
```
**Expected**: Order: cc_002 (HIGH), cc_003 (NORMAL), cc_001 (LOW)
**Priority**: P0

#### TC-003-002: Happy Path - Order by Age
**Input**:
```typescript
{
  candidates: [
    { id: "cc_001", urgency: "NORMAL", age: 2, createdAtTurn: 10 },
    { id: "cc_002", urgency: "NORMAL", age: 1, createdAtTurn: 20 }
  ]
}
```
**Expected**: Order: cc_002 (age 1), cc_001 (age 2)
**Priority**: P0

#### TC-003-003: Happy Path - Order by Creation Time
**Input**:
```typescript
{
  candidates: [
    { id: "cc_001", urgency: "NORMAL", age: 1, createdAtTurn: 15 },
    { id: "cc_002", urgency: "NORMAL", age: 1, createdAtTurn: 10 }
  ]
}
```
**Expected**: Order: cc_002 (turn 10), cc_001 (turn 15)
**Priority**: P0

#### TC-003-004: Integration - Full Priority Sort
**Input**:
```typescript
{
  candidates: [
    { id: "cc_001", urgency: "LOW", age: 2, createdAtTurn: 30 },
    { id: "cc_002", urgency: "HIGH", age: 1, createdAtTurn: 10 },
    { id: "cc_003", urgency: "NORMAL", age: 1, createdAtTurn: 20 },
    { id: "cc_004", urgency: "NORMAL", age: 1, createdAtTurn: 15 }
  ]
}
```
**Expected**: Order: cc_002, cc_004, cc_003, cc_001
**Priority**: P0

---

### AC-004: Candidate Status Update

#### TC-004-001: Happy Path - Mark as Chronicled
**Input**:
```typescript
{
  candidateId: "cc_001",
  entryId: "je_A1_001",
  turn: 25
}
```
**Expected**: Candidate status = CHRONICLED, processedAtTurn = 25, resultingEntryId = je_A1_001
**Priority**: P0

#### TC-004-002: Happy Path - Mark as Dismissed
**Input**:
```typescript
{
  candidateId: "cc_002",
  turn: 30
}
```
**Expected**: Candidate status = DISMISSED, processedAtTurn = 30
**Priority**: P0

#### TC-004-003: Edge Case - Update Already Processed Candidate
**Input**:
```typescript
{
  candidate: { id: "cc_001", status: "CHRONICLED" },
  action: "CHRONICLE"
}
```
**Expected**: No change or warning logged
**Priority**: P1

#### TC-004-004: Error Case - Invalid Status Transition
**Input**:
```typescript
{
  candidate: { id: "cc_001", status: "CHRONICLED" },
  newStatus: "PENDING"
}
```
**Expected**: Error thrown, invalid transition
**Priority**: P0

---

### AC-005: Candidate Dismissal

#### TC-005-001: Happy Path - Dismiss Pending Candidate
**Input**:
```typescript
{
  candidateId: "cc_001"
}
```
**Expected**: Candidate status = DISMISSED
**Priority**: P0

#### TC-005-002: Edge Case - Dismiss Already Processed Candidate
**Input**:
```typescript
{
  candidate: { id: "cc_001", status: "CHRONICLED" }
}
```
**Expected**: No change or warning logged
**Priority**: P1

#### TC-005-003: Integration - Dismiss with Reason
**Input**:
```typescript
{
  candidateId: "cc_001",
  reason: "Player chose not to chronicler"
}
```
**Expected**: Candidate status = DISMISSED, reason logged
**Priority**: P1

---

### AC-006: Candidate Chronicling

#### TC-006-001: Happy Path - Create Entry from Candidate
**Input**:
```typescript
{
  candidate: {
    id: "cc_001",
    triggerType: "SETTLEMENT_FOUND",
    sourceEventIds: ["evt_001"],
    age: 1,
    scope: "REGIONAL",
    urgency: "NORMAL",
    suggestedTemplates: ["settlement_founding_chronicle"],
    suggestedAuthors: ["IMPERIAL_SCRIBE"]
  },
  entry: {
    id: "je_A1_001",
    type: "CHRONICLE",
    title: "The Founding of Ashkel",
    text: "Ashkel became the first city.",
    author: "IMPERIAL_SCRIBE"
  }
}
```
**Expected**: Candidate status = CHRONICLED, resultingEntryId = je_A1_001
**Priority**: P0

#### TC-006-002: Edge Case - Chronicling Non-Eligible Candidate
**Input**:
```typescript
{
  candidate: {
    id: "cc_002",
    autoEligible: false
  }
}
```
**Expected**: Error thrown, candidate not auto-eligible
**Priority**: P1

#### TC-006-003: Integration - Chronicling with Auto-Chronicler
**Input**:
```typescript
{
  candidate: { id: "cc_001", autoEligible: true },
  autoChronicler: { /* auto-chronicler instance */ }
}
```
**Expected**: Entry generated, candidate marked CHRONICLED
**Priority**: P0

---

### AC-007: Backlog Statistics

#### TC-007-001: Happy Path - Calculate Statistics
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", status: "PENDING", urgency: "HIGH", age: 1 },
      { id: "cc_002", status: "CHRONICLED", urgency: "NORMAL", age: 1 },
      { id: "cc_003", status: "DISMISSED", urgency: "LOW", age: 1 },
      { id: "cc_004", status: "PENDING", urgency: "NORMAL", age: 2 }
    ]
  }
}
```
**Expected**: Stats: total=4, PENDING=2, CHRONICLED=1, DISMISSED=1, HIGH=1, NORMAL=2, LOW=1, age1=3, age2=1
**Priority**: P0

#### TC-007-002: Edge Case - Empty Backlog Statistics
**Input**:
```typescript
{
  backlog: { candidates: [] }
}
```
**Expected**: Stats: total=0, all counts=0
**Priority**: P1

#### TC-007-003: Integration - Statistics for Filtering
**Input**:
```typescript
{
  backlog: { /* candidates */ },
  filter: { urgency: "HIGH" }
}
```
**Expected**: Returns count of HIGH urgency candidates
**Priority**: P1

---

### AC-008: Expiry Processing

#### TC-008-001: Happy Path - Expire Candidates
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", status: "PENDING", expiresAtAge: 2, age: 1 },
      { id: "cc_002", status: "PENDING", expiresAtAge: 2, age: 1 }
    ]
  },
  currentAge: 2
}
```
**Expected**: Both candidates marked EXPIRED
**Priority**: P0

#### TC-008-002: Happy Path - Non-Expiring Candidates
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", status: "PENDING", expiresAtAge: undefined },
      { id: "cc_002", status: "PENDING", expiresAtAge: 999 }
    ]
  },
  currentAge: 2
}
**Expected**: No candidates expired
**Priority**: P1

#### TC-008-003: Edge Case - Already Expired Candidate
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", status: "EXPIRED", expiresAtAge: 2, age: 1 }
    ]
  },
  currentAge: 3
}
**Expected**: No change, already expired
**Priority**: P1

#### TC-008-004: Integration - Expiry on Age Transition
**Input**:
```typescript
{
  backlog: { /* candidates with expiry */ },
  fromAge: 1,
  toAge: 2
}
```
**Expected**: Expired candidates processed, queue rebuilt
**Priority**: P0

---

### AC-009: Auto-Processing

#### TC-009-001: Happy Path - Process High Urgency
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", urgency: "HIGH", status: "PENDING", autoEligible: true },
      { id: "cc_002", urgency: "NORMAL", status: "PENDING", autoEligible: true }
    ]
  },
  config: {
    processHighUrgency: true,
    maxEntriesPerRound: 3
  }
}
```
**Expected**: cc_001 processed, cc_002 skipped
**Priority**: P0

#### TC-009-002: Happy Path - Process Multiple Candidates
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", urgency: "HIGH", status: "PENDING", autoEligible: true },
      { id: "cc_002", urgency: "NORMAL", status: "PENDING", autoEligible: true },
      { id: "cc_003", urgency: "NORMAL", status: "PENDING", autoEligible: true }
    ]
  },
  config: {
    processHighUrgency: true,
    processNormalUrgency: true,
    maxEntriesPerRound: 3
  }
}
```
**Expected**: All three candidates processed
**Priority**: P0

#### TC-009-003: Edge Case - Max Entries Limit
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", urgency: "HIGH", status: "PENDING", autoEligible: true },
      { id: "cc_002", urgency: "NORMAL", status: "PENDING", autoEligible: true },
      { id: "cc_003", urgency: "NORMAL", status: "PENDING", autoEligible: true },
      { id: "cc_004", urgency: "NORMAL", status: "PENDING", autoEligible: true }
    ]
  },
  config: { maxEntriesPerRound: 3 }
}
```
**Expected**: First three processed, cc_004 skipped
**Priority**: P1

#### TC-009-004: Integration - Auto-Processing with Auto-Chronicler
**Input**:
```typescript
{
  backlog: { /* pending candidates */ },
  autoChronicler: { /* instance */ },
  config: { /* auto-processing config */ }
}
```
**Expected**: Entries generated, candidates marked CHRONICLED
**Priority**: P0

---

### AC-010: Backlog Persistence

#### TC-010-001: Happy Path - Save Backlog
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", status: "PENDING" },
      { id: "cc_002", status: "CHRONICLED" }
    ],
    lastProcessedTurn: 25,
    lastProcessedAge: 1,
    persisted: false
  }
}
```
**Expected**: Backlog saved to storage, persisted = true
**Priority**: P0

#### TC-010-002: Edge Case - Save Empty Backlog
**Input**:
```typescript
{
  backlog: {
    candidates: [],
    lastProcessedTurn: 0,
    lastProcessedAge: 0,
    persisted: false
  }
}
```
**Expected**: Empty backlog saved
**Priority**: P1

#### TC-010-003: Integration - Save with Game State
**Input**:
```typescript
{
  backlog: { /* candidates */ },
  gameState: { /* full game state */ }
}
```
**Expected**: Backlog saved as part of game state
**Priority**: P0

---

### AC-011: Backlog Loading

#### TC-011-001: Happy Path - Load Backlog
**Input**:
```typescript
{
  savedData: {
    candidates: [
      { id: "cc_001", status: "PENDING" },
      { id: "cc_002", status: "CHRONICLED" }
    ],
    lastProcessedTurn: 25,
    lastProcessedAge: 1
  }
}
```
**Expected**: Backlog restored with all candidates
**Priority**: P0

#### TC-011-002: Edge Case - Load Corrupted Data
**Input**:
```typescript
{
  savedData: {
    candidates: "invalid data"
  }
}
```
**Expected**: Error thrown, backlog initialized empty
**Priority**: P1

#### TC-011-003: Integration - Load with Game State
**Input**:
```typescript
{
  gameState: { /* full game state with backlog */ }
}
```
**Expected**: Backlog loaded from game state
**Priority**: P0

---

### AC-012: Backlog Clearing

#### TC-012-001: Happy Path - Clear Backlog
**Input**:
```typescript
{
  backlog: {
    candidates: [
      { id: "cc_001", status: "PENDING" },
      { id: "cc_002", status: "CHRONICLED" }
    ]
  }
}
```
**Expected**: All candidates removed, lastProcessedTurn = 0, lastProcessedAge = 0
**Priority**: P0

#### TC-012-002: Edge Case - Clear Empty Backlog
**Input**:
```typescript
{
  backlog: { candidates: [] }
}
```
**Expected**: No change, already empty
**Priority**: P1

#### TC-012-003: Integration - Clear on New Game
**Input**:
```typescript
{
  action: "NEW_GAME"
}
```
**Expected**: Backlog cleared, queue rebuilt
**Priority**: P0

---

## Test Data

### Sample ChronicleBacklog
```typescript
const SAMPLE_BACKLOG: ChronicleBacklog = {
  candidates: [
    {
      id: "cc_1234567890_001",
      triggerType: "SETTLEMENT_FOUND",
      sourceEventIds: ["evt_settlement_001"],
      age: 1,
      scope: "REGIONAL",
      urgency: "HIGH",
      createdAtTurn: 15,
      suggestedTemplates: ["settlement_founding_chronicle"],
      suggestedAuthors: ["IMPERIAL_SCRIBE"],
      autoEligible: true,
      status: "PENDING"
    },
    {
      id: "cc_1234567890_002",
      triggerType: "AGE_ADVANCE",
      sourceEventIds: ["evt_age_001"],
      age: 1,
      scope: "GLOBAL",
      urgency: "HIGH",
      createdAtTurn: 100,
      suggestedTemplates: ["age_transition_chronicle"],
      suggestedAuthors: ["THE_WORLD"],
      autoEligible: true,
      status: "CHRONICLED",
      processedAtTurn: 100,
      resultingEntryId: "je_A1_050"
    }
  ],
  lastProcessedTurn: 100,
  lastProcessedAge: 1,
  persisted: true
};
```

### Sample AutoProcessingConfig
```typescript
const SAMPLE_AUTO_CONFIG: AutoProcessingConfig = {
  enabled: true,
  processHighUrgency: true,
  processNormalUrgency: true,
  processLowUrgency: true,
  maxEntriesPerRound: 3,
  ageTransitionOverride: true
};
```

### Sample ExpiryConfig
```typescript
const SAMPLE_EXPIRY_CONFIG: ExpiryConfig = {
  enabled: true,
  defaultAgeExpiry: 2,
  urgencyExpiry: {
    HIGH: 999,
    NORMAL: 2,
    LOW: 1
  },
  triggerTypeExpiry: {
    AGE_ADVANCE: 999,
    WAR_BEGIN: 999,
    SETTLEMENT_FOUND: 999
  }
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test candidate addition and retrieval
- Test priority ordering logic
- Test status update operations
- Test statistics calculation
- Test expiry processing
- Test backlog persistence

### Integration Testing Approach
- Test backlog with trigger system
- Test backlog with auto-chronicler
- Test backlog with form system
- Test backlog persistence across sessions
- Test auto-processing pipeline

### End-to-End Testing Approach
- Test event → trigger → backlog → entry flow
- Test backlog processing at end of round
- Test backlog processing at age transition
- Test backlog save/load cycle
- Test full auto-processing scenario

### Performance Testing Approach
- Test backlog with many candidates
- Test priority sorting performance
- Test statistics calculation performance
- Test auto-processing throughput
- Test persistence performance

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── backlog/
│   │   ├── BacklogManager.test.ts
│   │   ├── CandidateAddition.test.ts
│   │   ├── PriorityOrdering.test.ts
│   │   ├── StatusUpdate.test.ts
│   │   ├── Statistics.test.ts
│   │   ├── ExpiryProcessing.test.ts
│   │   └── BacklogPersistence.test.ts
├── integration/
│   ├── backlog/
│   │   ├── TriggerIntegration.test.ts
│   │   ├── AutoProcessing.test.ts
│   │   ├── FormIntegration.test.ts
│   │   └── BacklogLifecycle.test.ts
└── e2e/
    ├── backlog/
    │   ├── FullBacklogFlow.test.ts
    │   ├── AutoProcessingScenario.test.ts
    │   └── PersistenceCycle.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by backlog operation for unit tests
- Group by integration feature for integration tests
- Group by user scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases
