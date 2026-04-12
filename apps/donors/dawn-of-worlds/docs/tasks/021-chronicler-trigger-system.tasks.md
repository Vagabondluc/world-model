# Task List: Chronicler Trigger System

**TDD Reference:** [021-chronicler-trigger-system.tdd.md](../tdd/021-chronicler-trigger-system.tdd.md)

---

## Phase 1: Core Trigger Types

### Task 1.1: Create LoreTrigger Interface
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (LoreTrigger registration)
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/types.ts`
2. Define `LoreTrigger` interface with fields:
   - `id: string`
   - `name: string`
   - `eventType: string`
   - `condition: TriggerCondition`
   - `templateId: string`
   - `priority: number`
   - `deprecated: boolean`
3. Export interface
**Test Mapping:** TC-001-001, TC-001-002 (Trigger structure tests)

### Task 1.2: Create TriggerCondition Base Type
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (Trigger condition structure)
**Implementation Steps:**
1. In `logic/chronicler/triggers/types.ts`, define `TriggerCondition` as discriminated union
2. Create condition type variants: `AlwaysCondition`, `FirstOfKindCondition`, `ThresholdCondition`, `CompositeCondition`, `CustomCondition`
3. Export condition types
**Test Mapping:** TC-001-001, TC-001-002 (Condition type tests)

### Task 1.3: Create AlwaysCondition Type
**Priority:** P0
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-005 (Always condition evaluation)
**Implementation Steps:**
1. In `logic/chronicler/triggers/types.ts`, define `AlwaysCondition` interface with empty object
2. Export condition type
**Test Mapping:** TC-005-001, TC-005-002 (Always condition tests)

### Task 1.4: Create FirstOfKindCondition Type
**Priority:** P1
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-006 (FirstOfKind condition evaluation)
**Implementation Steps:**
1. In `logic/chronicler/triggers/types.ts`, define `FirstOfKindCondition` interface with field `kind: string`
2. Export condition type
**Test Mapping:** TC-006-001, TC-006-002 (FirstOfKind condition tests)

### Task 1.5: Create ThresholdCondition Type
**Priority:** P1
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-007 (Threshold condition evaluation)
**Implementation Steps:**
1. In `logic/chronicler/triggers/types.ts`, define `ThresholdCondition` interface with fields:
   - `property: string`
   - `operator: ThresholdOperator`
   - `value: number`
2. Define `ThresholdOperator` enum: `GREATER_THAN`, `LESS_THAN`, `EQUAL`, `GREATER_EQUAL`, `LESS_EQUAL`
3. Export types
**Test Mapping:** TC-007-001, TC-007-002 (Threshold condition tests)

### Task 1.6: Create CompositeCondition Type
**Priority:** P1
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-008 (Composite condition evaluation)
**Implementation Steps:**
1. In `logic/chronicler/triggers/types.ts`, define `CompositeCondition` interface with fields:
   - `operator: CompositeOperator`
   - `conditions: TriggerCondition[]`
2. Define `CompositeOperator` enum: `AND`, `OR`, `NOT`
3. Export types
**Test Mapping:** TC-008-001, TC-008-002 (Composite condition tests)

### Task 1.7: Create CustomCondition Type
**Priority:** P2
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-009 (Custom condition evaluation)
**Implementation Steps:**
1. In `logic/chronicler/triggers/types.ts`, define `CustomCondition` interface with field `evaluator: (event: GameEvent) => boolean`
2. Export condition type
**Test Mapping:** TC-009-001, TC-009-002 (Custom condition tests)

---

## Phase 2: Trigger Registry

### Task 2.1: Create TriggerRegistry Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (LoreTrigger registration)
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/registry.ts`
2. Implement `TriggerRegistry` class with Map storage
3. Add `register(trigger: LoreTrigger): void` method
4. Add `get(id: string): LoreTrigger | undefined` method
5. Add `getAll(): LoreTrigger[]` method
6. Add `unregister(id: string): boolean` method
7. Export registry class
**Test Mapping:** TC-001-001, TC-001-002 (Registration tests)

### Task 2.2: Create TriggerRegistry Instance
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Global trigger registry)
**Implementation Steps:**
1. In `logic/chronicler/triggers/registry.ts`, create singleton instance `triggerRegistry`
2. Export singleton for application-wide use
**Test Mapping:** TC-001-001 (Singleton test)

---

## Phase 3: Event Matching System

### Task 3.1: Create GameEvent Interface
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-002 (Event matching)
**Implementation Steps:**
1. In `logic/chronicler/triggers/types.ts`, define `GameEvent` interface with fields:
   - `type: string`
   - `timestamp: number`
   - `data: Record<string, unknown>`
2. Export interface
**Test Mapping:** TC-002-001, TC-002-002 (Event structure tests)

### Task 3.2: Create EventMatcher Function
**Priority:** P0
**Dependencies:** Task 2.1, Task 3.1
**Acceptance Criteria:** AC-002 (Event matching)
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/matcher.ts`
2. Implement `matchEvent(event: GameEvent): LoreTrigger[]` function
3. Query registry for triggers matching event type
4. Return array of matching triggers
5. Export matcher function
**Test Mapping:** TC-002-001, TC-002-002 (Event matching tests)

---

## Phase 4: Condition Evaluation System

### Task 4.1: Create Condition Evaluator Base
**Priority:** P0
**Dependencies:** Task 1.2, Task 3.1
**Acceptance Criteria:** AC-003 (Condition evaluation)
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/evaluator.ts`
2. Implement `evaluateCondition(condition: TriggerCondition, event: GameEvent): boolean` function
3. Add type discrimination for condition variants
4. Export evaluator function
**Test Mapping:** TC-003-001, TC-003-002 (Condition evaluation tests)

### Task 4.2: Implement AlwaysCondition Evaluator
**Priority:** P0
**Dependencies:** Task 1.3, Task 4.1
**Acceptance Criteria:** AC-005 (Always condition evaluation)
**Implementation Steps:**
1. In `logic/chronicler/triggers/evaluator.ts`, add case for `AlwaysCondition`
2. Return `true` for all events
**Test Mapping:** TC-005-001, TC-005-002 (Always condition tests)

### Task 4.3: Implement FirstOfKindCondition Evaluator
**Priority:** P1
**Dependencies:** Task 1.4, Task 4.1
**Acceptance Criteria:** AC-006 (FirstOfKind condition evaluation)
**Implementation Steps:**
1. In `logic/chronicler/triggers/evaluator.ts`, add case for `FirstOfKindCondition`
2. Track seen event kinds in evaluator state
3. Return `true` only for first event of matching kind
4. Add state reset functionality
**Test Mapping:** TC-006-001, TC-006-002 (FirstOfKind tests)

### Task 4.4: Implement ThresholdCondition Evaluator
**Priority:** P1
**Dependencies:** Task 1.5, Task 4.1
**Acceptance Criteria:** AC-007 (Threshold condition evaluation)
**Implementation Steps:**
1. In `logic/chronicler/triggers/evaluator.ts`, add case for `ThresholdCondition`
2. Extract property value from event data
3. Apply comparison operator
4. Return comparison result
**Test Mapping:** TC-007-001, TC-007-002 (Threshold tests)

### Task 4.5: Implement CompositeCondition Evaluator
**Priority:** P1
**Dependencies:** Task 1.6, Task 4.1
**Acceptance Criteria:** AC-008 (Composite condition evaluation)
**Implementation Steps:**
1. In `logic/chronicler/triggers/evaluator.ts`, add case for `CompositeCondition`
2. Implement AND logic: all conditions must be true
3. Implement OR logic: at least one condition must be true
4. Implement NOT logic: invert condition result
5. Recursively evaluate nested conditions
**Test Mapping:** TC-008-001, TC-008-002 (Composite tests)

### Task 4.6: Implement CustomCondition Evaluator
**Priority:** P2
**Dependencies:** Task 1.7, Task 4.1
**Acceptance Criteria:** AC-009 (Custom condition evaluation)
**Implementation Steps:**
1. In `logic/chronicler/triggers/evaluator.ts`, add case for `CustomCondition`
2. Call custom evaluator function with event
3. Return evaluator result
**Test Mapping:** TC-009-001, TC-009-002 (Custom condition tests)

---

## Phase 5: Candidate Generation System

### Task 5.1: Create CandidateGenerator Interface
**Priority:** P0
**Dependencies:** Task 2.1, Task 3.2, Task 4.1
**Acceptance Criteria:** AC-004 (Candidate generation)
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/generator.ts`
2. Implement `generateCandidates(event: GameEvent): ChronicleCandidate[]` function
3. Match triggers to event
4. Evaluate conditions for each matching trigger
5. Create candidates for triggers with true conditions
6. Return array of candidates
7. Export generator function
**Test Mapping:** TC-004-001, TC-004-002 (Candidate generation tests)

### Task 5.2: Integrate Template Resolution in Generation
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-004 (Template-based candidate generation)
**Implementation Steps:**
1. Modify `generateCandidates()` to resolve template ID
2. Fetch template from template registry
3. Attach template to candidate context
4. Handle missing template case
**Test Mapping:** TC-004-003, TC-004-004 (Template integration tests)

---

## Phase 6: Trigger Priority System

### Task 6.1: Create PriorityComparator
**Priority:** P1
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-010 (Trigger priority)
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/priority.ts`
2. Implement `compareTriggerPriority(a: LoreTrigger, b: LoreTrigger): number` function
3. Higher priority value = higher precedence
4. Return negative if a has higher priority, positive if b has higher priority
5. Export comparator function
**Test Mapping:** TC-010-001, TC-010-002 (Priority comparison tests)

### Task 6.2: Sort Candidates by Priority
**Priority:** P1
**Dependencies:** Task 5.1, Task 6.1
**Acceptance Criteria:** AC-010 (Priority-based candidate ordering)
**Implementation Steps:**
1. Modify `generateCandidates()` to sort results by trigger priority
2. Apply priority comparator to candidate array
3. Return sorted candidates
**Test Mapping:** TC-010-003, TC-010-004 (Priority sorting tests)

---

## Phase 7: Trigger Deprecation System

### Task 7.1: Create TriggerDeprecationHandler
**Priority:** P2
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-011 (Trigger deprecation)
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/deprecation.ts`
2. Implement `deprecateTrigger(id: string): boolean` function
3. Set trigger `deprecated: true`
4. Return success status
5. Export deprecation function
**Test Mapping:** TC-011-001, TC-011-002 (Deprecation tests)

### Task 7.2: Filter Deprecated Triggers from Matching
**Priority:** P2
**Dependencies:** Task 3.2, Task 7.1
**Acceptance Criteria:** AC-011 (Deprecated trigger exclusion)
**Implementation Steps:**
1. Modify `matchEvent()` to filter out deprecated triggers
2. Only return non-deprecated triggers
3. Log deprecation warnings for matched deprecated triggers
**Test Mapping:** TC-011-003, TC-011-004 (Deprecation filtering tests)

---

## Phase 8: Trigger Factory

### Task 8.1: Create LoreTrigger Factory
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (LoreTrigger creation)
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/factory.ts`
2. Implement `createLoreTrigger()` function
3. Add validation for required fields
4. Set default `priority: 0`
5. Set default `deprecated: false`
6. Generate unique ID if not provided
7. Export factory function
**Test Mapping:** TC-001-001, TC-001-002 (Factory tests)

---

## Phase 9: Test Files

### Task 9.1: Create LoreTrigger Tests
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/__tests__/LoreTrigger.test.ts`
2. Write tests for trigger creation
3. Write tests for trigger registration
4. Write tests for trigger retrieval
**Test Mapping:** TC-001-001, TC-001-002

### Task 9.2: Create EventMatching Tests
**Priority:** P0
**Dependencies:** Task 3.2
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/__tests__/matcher.test.ts`
2. Write tests for event type matching
3. Write tests for no matching triggers
4. Write tests for multiple matching triggers
**Test Mapping:** TC-002-001, TC-002-002

### Task 9.3: Create ConditionEvaluation Tests
**Priority:** P0
**Dependencies:** Task 4.6
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/__tests__/evaluator.test.ts`
2. Write tests for condition evaluation
3. Write tests for invalid condition handling
4. Write tests for condition type discrimination
**Test Mapping:** TC-003-001, TC-003-002

### Task 9.4: Create CandidateGeneration Tests
**Priority:** P0
**Dependencies:** Task 5.2
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/__tests__/generator.test.ts`
2. Write tests for candidate generation
3. Write tests for no candidates generated
4. Write tests for multiple candidates generated
**Test Mapping:** TC-004-001, TC-004-002

### Task 9.5: Create AlwaysCondition Tests
**Priority:** P0
**Dependencies:** Task 4.2
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. In `logic/chronicler/triggers/__tests__/evaluator.test.ts`
2. Write tests for always condition returning true
3. Write tests for always condition with various events
**Test Mapping:** TC-005-001, TC-005-002

### Task 9.6: Create FirstOfKindCondition Tests
**Priority:** P1
**Dependencies:** Task 4.3
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. In `logic/chronicler/triggers/__tests__/evaluator.test.ts`
2. Write tests for first event of kind
3. Write tests for subsequent events of same kind
4. Write tests for different kinds
**Test Mapping:** TC-006-001, TC-006-002

### Task 9.7: Create ThresholdCondition Tests
**Priority:** P1
**Dependencies:** Task 4.4
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. In `logic/chronicler/triggers/__tests__/evaluator.test.ts`
2. Write tests for GREATER_THAN operator
3. Write tests for LESS_THAN operator
4. Write tests for EQUAL operator
5. Write tests for boundary conditions
**Test Mapping:** TC-007-001, TC-007-002

### Task 9.8: Create CompositeCondition Tests
**Priority:** P1
**Dependencies:** Task 4.5
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. In `logic/chronicler/triggers/__tests__/evaluator.test.ts`
2. Write tests for AND composite
3. Write tests for OR composite
4. Write tests for NOT composite
5. Write tests for nested composites
**Test Mapping:** TC-008-001, TC-008-002

### Task 9.9: Create CustomCondition Tests
**Priority:** P2
**Dependencies:** Task 4.6
**Acceptance Criteria:** AC-009
**Implementation Steps:**
1. In `logic/chronicler/triggers/__tests__/evaluator.test.ts`
2. Write tests for custom evaluator returning true
3. Write tests for custom evaluator returning false
4. Write tests for custom evaluator with event data access
**Test Mapping:** TC-009-001, TC-009-002

### Task 9.10: Create TriggerPriority Tests
**Priority:** P1
**Dependencies:** Task 6.2
**Acceptance Criteria:** AC-010
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/__tests__/priority.test.ts`
2. Write tests for priority comparison
3. Write tests for equal priority
4. Write tests for candidate sorting by priority
**Test Mapping:** TC-010-001, TC-010-002

### Task 9.11: Create TriggerDeprecation Tests
**Priority:** P2
**Dependencies:** Task 7.2
**Acceptance Criteria:** AC-011
**Implementation Steps:**
1. Create file `logic/chronicler/triggers/__tests__/deprecation.test.ts`
2. Write tests for trigger deprecation
3. Write tests for deprecated trigger exclusion from matching
4. Write tests for deprecation warning logging
**Test Mapping:** TC-011-001, TC-011-002

---

## Summary

**Total Tasks:** 39
**P0 Tasks:** 17 (Core types, Registry, Event matching, Condition evaluation, Candidate generation, Tests)
**P1 Tasks:** 16 (FirstOfKind, Threshold, Composite conditions, Priority system, Tests)
**P2 Tasks:** 6 (Custom condition, Deprecation system, Tests)

**Phases:** 9
- Phase 1: Core Trigger Types (7 tasks)
- Phase 2: Trigger Registry (2 tasks)
- Phase 3: Event Matching System (2 tasks)
- Phase 4: Condition Evaluation System (6 tasks)
- Phase 5: Candidate Generation System (2 tasks)
- Phase 6: Trigger Priority System (2 tasks)
- Phase 7: Trigger Deprecation System (2 tasks)
- Phase 8: Trigger Factory (1 task)
- Phase 9: Test Files (11 tasks)
