# TDD: Chronicler Trigger System

## Specification Reference
- Spec: [`021-chronicler-trigger-system.md`](../specs/021-chronicler-trigger-system.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: LoreTrigger Registration
**Given** a LoreTrigger is defined
**When** the trigger is registered
**Then** the trigger must be stored and available for evaluation

### AC-002: Event Matching
**Given** a world event occurs
**When** the trigger system evaluates triggers
**Then** matching triggers must be identified based on event type and kind

### AC-003: Condition Evaluation
**Given** a trigger matches an event
**When** the trigger condition is evaluated
**Then** the condition must return true or false based on world state

### AC-004: ChronicleCandidate Generation
**Given** a trigger condition evaluates to true
**When** a ChronicleCandidate is created
**Then** the candidate must contain all required fields from the trigger

### AC-005: AlwaysCondition Evaluation
**Given** a trigger with AlwaysCondition
**When** the matching event occurs
**Then** the condition must always return true

### AC-006: FirstOfKindCondition Evaluation
**Given** a trigger with FirstOfKindCondition
**When** the event occurs
**Then** the condition must return true only for the first occurrence

### AC-007: ThresholdCondition Evaluation
**Given** a trigger with ThresholdCondition
**When** the world state is evaluated
**Then** the condition must return true when the threshold is crossed

### AC-008: CompositeCondition Evaluation
**Given** a trigger with CompositeCondition
**When** the condition is evaluated
**Then** the condition must apply logical operators to sub-conditions

### AC-009: CustomCondition Evaluation
**Given** a trigger with CustomCondition
**When** the condition is evaluated
**Then** the custom function must be called with event and state

### AC-010: Trigger Priority Assignment
**Given** a ChronicleCandidate is created
**When** the candidate is added to the backlog
**Then** the urgency must be assigned based on trigger type

### AC-011: Trigger Deprecation
**Given** a deprecated trigger exists
**When** the trigger is evaluated
**Then** the system must use the replacement trigger if available

---

## Test Cases

### AC-001: LoreTrigger Registration

#### TC-001-001: Happy Path - Register Valid Trigger
**Input**:
```typescript
{
  id: "TEST_TRIGGER",
  name: "Test Trigger",
  version: "1.0.0",
  eventType: "WORLD_CREATE",
  eventKind: "SETTLEMENT",
  condition: { type: "ALWAYS" },
  suggestedTemplates: ["test_template"],
  suggestedAuthors: ["THE_WORLD"],
  defaultScope: "GLOBAL",
  autoEligible: true,
  urgency: "NORMAL",
  enabled: true
}
```
**Expected**: Trigger registered successfully
**Priority**: P0

#### TC-001-002: Happy Path - Register Multiple Triggers
**Input**:
```typescript
[
  { id: "TRIGGER_1", eventType: "WORLD_CREATE", ... },
  { id: "TRIGGER_2", eventType: "WORLD_MODIFY", ... },
  { id: "TRIGGER_3", eventType: "AGE_ADVANCE", ... }
]
```
**Expected**: All triggers registered successfully
**Priority**: P0

#### TC-001-003: Edge Case - Register Duplicate Trigger ID
**Input**:
```typescript
{
  id: "DUPLICATE_TRIGGER",
  // ... fields
}
```
**Expected**: Error thrown or existing trigger replaced
**Priority**: P1

#### TC-001-004: Error Case - Invalid Trigger Structure
**Input**:
```typescript
{
  id: "INVALID_TRIGGER",
  // Missing required fields
}
```
**Expected**: Validation error thrown
**Priority**: P0

---

### AC-002: Event Matching

#### TC-002-001: Happy Path - Match by Event Type
**Input**:
```typescript
{
  event: { type: "WORLD_CREATE", kind: "SETTLEMENT" },
  trigger: { eventType: "WORLD_CREATE" }
}
```
**Expected**: Trigger matches
**Priority**: P0

#### TC-002-002: Happy Path - Match by Event Type and Kind
**Input**:
```typescript
{
  event: { type: "WORLD_CREATE", kind: "SETTLEMENT" },
  trigger: { eventType: "WORLD_CREATE", eventKind: "SETTLEMENT" }
}
```
**Expected**: Trigger matches
**Priority**: P0

#### TC-002-003: Edge Case - No Matching Triggers
**Input**:
```typescript
{
  event: { type: "CUSTOM_EVENT", kind: "CUSTOM" },
  triggers: [
    { eventType: "WORLD_CREATE" },
    { eventType: "WORLD_MODIFY" }
  ]
}
```
**Expected**: No triggers match
**Priority**: P1

#### TC-002-004: Integration - Multiple Triggers Match Same Event
**Input**:
```typescript
{
  event: { type: "WORLD_CREATE", kind: "SETTLEMENT" },
  triggers: [
    { id: "T1", eventType: "WORLD_CREATE", eventKind: "SETTLEMENT" },
    { id: "T2", eventType: "WORLD_CREATE", eventKind: "SETTLEMENT" }
  ]
}
```
**Expected**: Both triggers match
**Priority**: P1

---

### AC-003: Condition Evaluation

#### TC-003-001: Happy Path - Condition Returns True
**Input**:
```typescript
{
  condition: { type: "ALWAYS" },
  event: { type: "TEST" },
  state: { currentAge: 1 }
}
```
**Expected**: Condition evaluates to true
**Priority**: P0

#### TC-003-002: Happy Path - Condition Returns False
**Input**:
```typescript
{
  condition: { type: "FIRST_OF_KIND", kind: "SETTLEMENT", scope: "GLOBAL" },
  event: { type: "WORLD_CREATE", kind: "SETTLEMENT" },
  state: { settlements: [{ id: "s1" }] } // Already has settlement
}
```
**Expected**: Condition evaluates to false
**Priority**: P0

#### TC-003-003: Edge Case - Condition with Missing State
**Input**:
```typescript
{
  condition: { type: "THRESHOLD", metric: "region_count", operator: "GTE", value: 3 },
  event: { type: "TEST" },
  state: {} // Missing region_count
}
```
**Expected**: Condition evaluates to false or throws error
**Priority**: P1

---

### AC-004: ChronicleCandidate Generation

#### TC-004-001: Happy Path - Generate Valid Candidate
**Input**:
```typescript
{
  trigger: {
    id: "SETTLEMENT_FOUND",
    suggestedTemplates: ["settlement_founding_chronicle"],
    suggestedAuthors: ["IMPERIAL_SCRIBE"],
    defaultScope: "REGIONAL",
    autoEligible: true,
    urgency: "NORMAL"
  },
  event: { id: "evt_001", type: "WORLD_CREATE", kind: "SETTLEMENT" },
  state: { currentAge: 1, currentTurn: 10 }
}
```
**Expected**: Candidate created with all fields populated
**Priority**: P0

#### TC-004-002: Edge Case - Generate with Expiry
**Input**:
```typescript
{
  trigger: {
    id: "MINOR_EVENT",
    suggestedTemplates: ["minor_observation"],
    suggestedAuthors: ["UNKNOWN"],
    defaultScope: "LOCAL",
    autoEligible: true,
    urgency: "LOW",
    expiresAfterAges: 1
  },
  event: { id: "evt_002", type: "WORLD_CREATE" },
  state: { currentAge: 1, currentTurn: 20 }
}
```
**Expected**: Candidate created with expiresAtAge = 2
**Priority**: P1

#### TC-004-003: Error Case - Invalid Trigger Data
**Input**:
```typescript
{
  trigger: {
    id: "INVALID",
    suggestedTemplates: [], // Empty
    suggestedAuthors: [], // Empty
    defaultScope: "INVALID", // Invalid scope
    autoEligible: true,
    urgency: "NORMAL"
  },
  event: { id: "evt_003", type: "TEST" },
  state: { currentAge: 1 }
}
```
**Expected**: Error thrown
**Priority**: P0

---

### AC-005: AlwaysCondition Evaluation

#### TC-005-001: Happy Path - Always Fires
**Input**:
```typescript
{
  condition: { type: "ALWAYS" },
  event: { type: "AGE_ADVANCE" },
  state: { currentAge: 2 }
}
```
**Expected**: Condition returns true
**Priority**: P0

#### TC-005-002: Integration - Age Transition Trigger
**Input**:
```typescript
{
  trigger: AGE_ADVANCE_TRIGGER,
  event: { type: "AGE_ADVANCE", fromAge: 1, toAge: 2 },
  state: { currentAge: 2 }
}
```
**Expected**: Candidate created for age transition
**Priority**: P0

---

### AC-006: FirstOfKindCondition Evaluation

#### TC-006-001: Happy Path - First Occurrence
**Input**:
```typescript
{
  condition: { type: "FIRST_OF_KIND", kind: "SETTLEMENT_CITY", scope: "GLOBAL" },
  event: { type: "WORLD_CREATE", kind: "SETTLEMENT", isCity: true },
  state: { settlements: [] }
}
```
**Expected**: Condition returns true
**Priority**: P0

#### TC-006-002: Happy Path - Not First Occurrence
**Input**:
```typescript
{
  condition: { type: "FIRST_OF_KIND", kind: "SETTLEMENT_CITY", scope: "GLOBAL" },
  event: { type: "WORLD_CREATE", kind: "SETTLEMENT", isCity: true },
  state: { settlements: [{ id: "city_1", kind: "CITY" }] }
}
```
**Expected**: Condition returns false
**Priority**: P0

#### TC-006-003: Edge Case - Regional First
**Input**:
```typescript
{
  condition: { type: "FIRST_OF_KIND", kind: "SETTLEMENT", scope: "REGIONAL" },
  event: { type: "WORLD_CREATE", kind: "SETTLEMENT", region: "NORTH" },
  state: { regionalSettlements: { NORTH: [], SOUTH: [{ id: "s1" }] } }
}
```
**Expected**: Condition returns true for NORTH region
**Priority**: P1

#### TC-006-004: Integration - First City Trigger
**Input**:
```typescript
{
  trigger: SETTLEMENT_FOUNDING_TRIGGER,
  event: { type: "WORLD_CREATE", kind: "SETTLEMENT", isCity: true },
  state: { settlements: [] }
}
```
**Expected**: Candidate created for first city
**Priority**: P0

---

### AC-007: ThresholdCondition Evaluation

#### TC-007-001: Happy Path - Threshold Crossed
**Input**:
```typescript
{
  condition: { type: "THRESHOLD", metric: "region_count", operator: "GTE", value: 3, scope: "REGIONAL" },
  event: { type: "WORLD_MODIFY", kind: "REGION" },
  state: { nations: { nation_1: { regions: ["r1", "r2", "r3"] } } }
}
```
**Expected**: Condition returns true (3 >= 3)
**Priority**: P0

#### TC-007-002: Happy Path - Threshold Not Crossed
**Input**:
```typescript
{
  condition: { type: "THRESHOLD", metric: "region_count", operator: "GTE", value: 3, scope: "REGIONAL" },
  event: { type: "WORLD_MODIFY", kind: "REGION" },
  state: { nations: { nation_1: { regions: ["r1", "r2"] } } }
}
```
**Expected**: Condition returns false (2 < 3)
**Priority**: P0

#### TC-007-003: Edge Case - One-Time Threshold
**Input**:
```typescript
{
  condition: { type: "THRESHOLD", metric: "city_count", operator: "GTE", value: 1, scope: "GLOBAL", oneTime: true },
  event: { type: "WORLD_CREATE", kind: "SETTLEMENT", isCity: true },
  state: { cities: [{ id: "c1" }] }
}
```
**Expected**: Condition returns true, subsequent calls return false
**Priority**: P1

#### TC-007-004: Integration - Nation Proclamation Trigger
**Input**:
```typescript
{
  trigger: NATION_PROCLAMATION_TRIGGER,
  event: { type: "WORLD_CREATE", kind: "NATION" },
  state: { nations: [] }
}
```
**Expected**: Candidate created for nation proclamation
**Priority**: P0

---

### AC-008: CompositeCondition Evaluation

#### TC-008-001: Happy Path - AND Condition
**Input**:
```typescript
{
  condition: {
    type: "AND",
    conditions: [
      { type: "FIRST_OF_KIND", kind: "SETTLEMENT", scope: "REGIONAL" },
      { type: "CUSTOM", evaluate: () => true }
    ]
  },
  event: { type: "WORLD_CREATE", kind: "SETTLEMENT" },
  state: { regionalSettlements: { R1: [] } }
}
```
**Expected**: Condition returns true (both sub-conditions true)
**Priority**: P0

#### TC-008-002: Happy Path - OR Condition
**Input**:
```typescript
{
  condition: {
    type: "OR",
    conditions: [
      { type: "FIRST_OF_KIND", kind: "WAR", scope: "GLOBAL" },
      { type: "CUSTOM", evaluate: () => false }
    ]
  },
  event: { type: "WORLD_MODIFY", kind: "WAR" },
  state: { wars: [] }
}
```
**Expected**: Condition returns true (first sub-condition true)
**Priority**: P0

#### TC-008-003: Happy Path - NOT Condition
**Input**:
```typescript
{
  condition: {
    type: "NOT",
    conditions: [{ type: "CUSTOM", evaluate: () => false }]
  },
  event: { type: "TEST" },
  state: {}
}
```
**Expected**: Condition returns true (NOT false = true)
**Priority**: P0

#### TC-008-004: Edge Case - Nested Composite
**Input**:
```typescript
{
  condition: {
    type: "AND",
    conditions: [
      {
        type: "OR",
        conditions: [
          { type: "FIRST_OF_KIND", kind: "WAR", scope: "GLOBAL" },
          { type: "CUSTOM", evaluate: () => true }
        ]
      },
      { type: "CUSTOM", evaluate: () => true }
    ]
  },
  event: { type: "TEST" },
  state: { wars: [] }
}
```
**Expected**: Condition evaluates nested logic correctly
**Priority**: P1

---

### AC-009: CustomCondition Evaluation

#### TC-009-001: Happy Path - Custom Function Returns True
**Input**:
```typescript
{
  condition: {
    type: "CUSTOM",
    evaluate: (event, state) => event.kind === "LANDMARK" && state.landmarks.length === 0,
    safe: true
  },
  event: { type: "WORLD_CREATE", kind: "LANDMARK" },
  state: { landmarks: [] }
}
```
**Expected**: Condition returns true
**Priority**: P0

#### TC-009-002: Happy Path - Custom Function Returns False
**Input**:
```typescript
{
  condition: {
    type: "CUSTOM",
    evaluate: (event, state) => event.kind === "LANDMARK" && state.landmarks.length === 0,
    safe: true
  },
  event: { type: "WORLD_CREATE", kind: "LANDMARK" },
  state: { landmarks: [{ id: "l1" }] }
}
```
**Expected**: Condition returns false
**Priority**: P0

#### TC-009-003: Edge Case - Custom Function Throws Error
**Input**:
```typescript
{
  condition: {
    type: "CUSTOM",
    evaluate: () => { throw new Error("Custom error"); },
    safe: true
  },
  event: { type: "TEST" },
  state: {}
}
```
**Expected**: Error caught and logged, condition returns false
**Priority**: P1

#### TC-009-004: Error Case - Unsafe Custom Function Throws Error
**Input**:
```typescript
{
  condition: {
    type: "CUSTOM",
    evaluate: () => { throw new Error("Custom error"); },
    safe: false
  },
  event: { type: "TEST" },
  state: {}
}
```
**Expected**: Error propagates
**Priority**: P0

---

### AC-010: Trigger Priority Assignment

#### TC-010-001: Happy Path - High Urgency Assignment
**Input**:
```typescript
{
  triggerType: "AGE_ADVANCE",
  urgency: "HIGH"
}
```
**Expected**: Candidate urgency = "HIGH"
**Priority**: P0

#### TC-010-002: Happy Path - Normal Urgency Assignment
**Input**:
```typescript
{
  triggerType: "SETTLEMENT_FOUND",
  urgency: "NORMAL"
}
```
**Expected**: Candidate urgency = "NORMAL"
**Priority**: P0

#### TC-010-003: Happy Path - Low Urgency Assignment
**Input**:
```typescript
{
  triggerType: "CULTURAL_TRAIT",
  urgency: "LOW"
}
```
**Expected**: Candidate urgency = "LOW"
**Priority**: P0

#### TC-010-004: Integration - Urgency-Based Backlog Ordering
**Input**:
```typescript
{
  candidates: [
    { id: "c1", urgency: "LOW", age: 1, createdAtTurn: 10 },
    { id: "c2", urgency: "HIGH", age: 1, createdAtTurn: 20 },
    { id: "c3", urgency: "NORMAL", age: 1, createdAtTurn: 15 }
  ]
}
```
**Expected**: Candidates ordered: c2 (HIGH), c3 (NORMAL), c1 (LOW)
**Priority**: P0

---

### AC-011: Trigger Deprecation

#### TC-011-001: Happy Path - Deprecated Trigger with Replacement
**Input**:
```typescript
{
  trigger: {
    id: "OLD_TRIGGER",
    version: "1.0.0",
    deprecated: true,
    supersededBy: "NEW_TRIGGER",
    enabled: false
  },
  event: { type: "TEST" }
}
```
**Expected**: System uses NEW_TRIGGER instead
**Priority**: P0

#### TC-011-002: Edge Case - Deprecated Trigger Without Replacement
**Input**:
```typescript
{
  trigger: {
    id: "OLD_TRIGGER",
    version: "1.0.0",
    deprecated: true,
    supersededBy: undefined,
    enabled: false
  },
  event: { type: "TEST" }
}
```
**Expected**: Error thrown, no replacement available
**Priority**: P1

#### TC-011-003: Integration - Trigger Version Migration
**Input**:
```typescript
{
  oldTrigger: { id: "OLD_TRIGGER", deprecated: true, supersededBy: "NEW_TRIGGER" },
  newTrigger: { id: "NEW_TRIGGER", version: "2.0.0" },
  event: { type: "TEST" }
}
```
**Expected**: NEW_TRIGGER evaluated, migration logged
**Priority**: P1

---

## Test Data

### Sample LoreTrigger
```typescript
const SAMPLE_LORE_TRIGGER: LoreTrigger = {
  id: "SETTLEMENT_FOUND",
  name: "Settlement Founding",
  version: "1.0.0",
  eventType: "WORLD_CREATE",
  eventKind: "SETTLEMENT",
  condition: {
    type: "OR",
    conditions: [
      { type: "FIRST_OF_KIND", kind: "SETTLEMENT_CITY", scope: "GLOBAL" },
      { type: "FIRST_OF_KIND", kind: "SETTLEMENT", scope: "REGIONAL" }
    ]
  },
  suggestedTemplates: ["settlement_founding_chronicle", "settlement_observation"],
  suggestedAuthors: ["IMPERIAL_SCRIBE", "UNKNOWN"],
  defaultScope: "REGIONAL",
  autoEligible: true,
  urgency: "NORMAL",
  enabled: true
};
```

### Sample Trigger Conditions
```typescript
const ALWAYS_CONDITION: AlwaysCondition = { type: "ALWAYS" };

const FIRST_OF_KIND_CONDITION: FirstOfKindCondition = {
  type: "FIRST_OF_KIND",
  kind: "SETTLEMENT_CITY",
  scope: "GLOBAL",
  filters: { named: true, uniqueKind: false }
};

const THRESHOLD_CONDITION: ThresholdCondition = {
  type: "THRESHOLD",
  metric: "region_count",
  operator: "GTE",
  value: 3,
  scope: "REGIONAL",
  oneTime: false
};

const COMPOSITE_CONDITION: CompositeCondition = {
  type: "AND",
  conditions: [
    { type: "FIRST_OF_KIND", kind: "WAR", scope: "GLOBAL" },
    { type: "CUSTOM", evaluate: (e, s) => s.currentAge > 1 }
  ]
};

const CUSTOM_CONDITION: CustomCondition = {
  type: "CUSTOM",
  evaluate: (event, state) => {
    return event.kind === "LANDMARK" && state.landmarks.length === 0;
  },
  safe: true
};
```

### Mock World State
```typescript
const MOCK_WORLD_STATE: WorldState = {
  currentAge: 1,
  currentTurn: 25,
  settlements: [
    { id: "city_ashkel", name: "Ashkel", kind: "SETTLEMENT", isCity: true }
  ],
  nations: {
    nation_velor: { id: "nation_velor", name: "Velor", regions: ["r1", "r2", "r3"] }
  },
  wars: [],
  landmarks: [],
  events: [
    { id: "evt_001", type: "WORLD_CREATE", kind: "SETTLEMENT", turn: 15 }
  ]
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test each trigger condition type in isolation
- Test event matching logic
- Test candidate generation from triggers
- Test priority assignment
- Test deprecation handling

### Integration Testing Approach
- Test full trigger evaluation pipeline
- Test trigger registration and lookup
- Test condition evaluation with real world state
- Test candidate creation and backlog integration
- Test trigger replacement on deprecation

### End-to-End Testing Approach
- Test event → trigger → candidate → backlog flow
- Test multiple triggers for same event
- Test trigger evaluation across game sessions
- Test trigger persistence and loading

### Performance Testing Approach
- Test trigger evaluation with many registered triggers
- Test condition evaluation performance
- Test candidate generation throughput
- Test trigger lookup performance

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── triggers/
│   │   ├── LoreTrigger.test.ts
│   │   ├── AlwaysCondition.test.ts
│   │   ├── FirstOfKindCondition.test.ts
│   │   ├── ThresholdCondition.test.ts
│   │   ├── CompositeCondition.test.ts
│   │   ├── CustomCondition.test.ts
│   │   └── TriggerRegistry.test.ts
├── integration/
│   ├── triggers/
│   │   ├── EventMatching.test.ts
│   │   ├── ConditionEvaluation.test.ts
│   │   ├── CandidateGeneration.test.ts
│   │   └── TriggerDeprecation.test.ts
└── e2e/
    ├── triggers/
    │   ├── FullTriggerPipeline.test.ts
    │   └── TriggerCatalog.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by condition type for unit tests
- Group by trigger feature for integration tests
- Group by trigger catalog scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases
