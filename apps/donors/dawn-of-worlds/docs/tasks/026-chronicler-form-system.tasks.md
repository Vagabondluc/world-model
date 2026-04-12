# Task List: Chronicler Form System

**TDD Reference:** [026-chronicler-form-system.tdd.md](../tdd/026-chronicler-form-system.tdd.md)

---

## Phase 1: Form Types

### Task 1.1: Create FormQuestion Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-008 (Question type handling)
**Implementation Steps:**
1. Create file `logic/chronicler/form/types.ts`
2. Define `FormQuestion` interface with fields:
   - `id: string`
   - `type: QuestionType`
   - `label: string`
   - `required: boolean`
   - `options?: string[]`
   - `validation?: ValidationRule[]`
   - `defaultValue?: unknown`
3. Export interface
**Test Mapping:** TC-008-001, TC-008-002 (Question type tests)

### Task 1.2: Create QuestionType Enum
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-008 (Question type handling)
**Implementation Steps:**
1. In `logic/chronicler/form/types.ts`, define `QuestionType` enum with values: `TEXT`, `RADIO`, `CHECKBOX`, `SELECT`, `TEXTAREA`
2. Export enum
**Test Mapping:** TC-008-001, TC-008-002 (Question type tests)

### Task 1.3: Create ValidationRule Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-002 (Validation)
**Implementation Steps:**
1. In `logic/chronicler/form/types.ts`, define `ValidationRule` interface with fields:
   - `type: ValidationType`
   - `message: string`
   - `value?: unknown`
2. Define `ValidationType` enum with values: `REQUIRED`, `MIN_LENGTH`, `MAX_LENGTH`, `PATTERN`, `CUSTOM`
3. Export types
**Test Mapping:** TC-002-001, TC-002-002 (Validation rule tests)

### Task 1.4: Create FormData Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Form initialization)
**Implementation Steps:**
1. In `logic/chronicler/form/types.ts`, define `FormData` type as `Record<string, unknown>`
2. Export type
**Test Mapping:** TC-001-001, TC-001-002 (Form data tests)

### Task 1.5: Create FormState Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Form initialization)
**Implementation Steps:**
1. In `logic/chronicler/form/types.ts`, define `FormState` interface with fields:
   - `data: FormData`
   - `errors: Record<string, string[]>`
   - `touched: Record<string, boolean>`
   - `dirty: boolean`
   - `valid: boolean`
   - `submitting: boolean`
2. Export interface
**Test Mapping:** TC-001-001, TC-001-002 (Form state tests)

---

## Phase 2: Form Manager

### Task 2.1: Create FormManager Class
**Priority:** P0
**Dependencies:** Task 1.5
**Acceptance Criteria:** AC-001 (Form initialization)
**Implementation Steps:**
1. Create file `logic/chronicler/form/manager.ts`
2. Implement `FormManager` class
3. Add `initialize(questions: FormQuestion[]): void` method
4. Add `getState(): FormState` method
5. Add `subscribe(listener: (state: FormState) => void): () => void` method
6. Export class
**Test Mapping:** TC-001-001, TC-001-002 (Manager tests)

### Task 2.2: Create FormManager Instance
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Global form manager)
**Implementation Steps:**
1. In `logic/chronicler/form/manager.ts`, create factory function `createFormManager(questions: FormQuestion[]): FormManager`
2. Export factory function
**Test Mapping:** TC-001-001 (Factory test)

---

## Phase 3: Form Initialization

### Task 3.1: Implement initialize Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Form initialization)
**Implementation Steps:**
1. In `FormManager`, implement `initialize()` method
2. Store questions
3. Initialize form data with default values
4. Initialize errors and touched state
5. Set initial valid/dirty/submitting flags
6. Export method
**Test Mapping:** TC-001-001, TC-001-002 (Initialization tests)

### Task 3.2: Implement reset Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Form reset)
**Implementation Steps:**
1. In `FormManager`, implement `reset(): void` method
2. Reset form data to default values
3. Clear errors and touched state
4. Reset dirty flag
5. Notify subscribers
6. Export method
**Test Mapping:** TC-001-003, TC-001-004 (Reset tests)

---

## Phase 4: Validation

### Task 4.1: Implement validateField Method
**Priority:** P0
**Dependencies:** Task 2.1, Task 1.3
**Acceptance Criteria:** AC-002 (Validation)
**Implementation Steps:**
1. Create file `logic/chronicler/form/validator.ts`
2. Implement `validateField(question: FormQuestion, value: unknown): string[]` function
3. Apply validation rules to value
4. Return array of error messages
5. Export function
**Test Mapping:** TC-002-001, TC-002-002 (Field validation tests)

### Task 4.2: Implement validateForm Method
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-002 (Form validation)
**Implementation Steps:**
1. In `logic/chronicler/form/validator.ts`, implement `validateForm(questions: FormQuestion[], data: FormData): Record<string, string[]>` function
2. Validate all fields
3. Return errors object
4. Export function
**Test Mapping:** TC-002-003, TC-002-004 (Form validation tests)

### Task 4.3: Implement ValidationRule Implementations
**Priority:** P0
**Dependencies:** Task 4.1
**Acceptance Criteria:** AC-002 (Validation rules)
**Implementation Steps:**
1. Implement REQUIRED rule validator
2. Implement MIN_LENGTH rule validator
3. Implement MAX_LENGTH rule validator
4. Implement PATTERN rule validator
5. Implement CUSTOM rule validator
6. Export validators
**Test Mapping:** TC-002-001, TC-002-002 (Rule tests)

### Task 4.4: Integrate Validation with Manager
**Priority:** P0
**Dependencies:** Task 2.1, Task 4.2
**Acceptance Criteria:** AC-002 (Validation integration)
**Implementation Steps:**
1. In `FormManager`, implement `validate(): boolean` method
2. Validate all fields
3. Update errors in state
4. Update valid flag
5. Notify subscribers
6. Export method
**Test Mapping:** TC-002-005, TC-002-006 (Integration tests)

---

## Phase 5: Submission

### Task 5.1: Implement submit Method
**Priority:** P0
**Dependencies:** Task 2.1, Task 4.4
**Acceptance Criteria:** AC-003 (Submission)
**Implementation Steps:**
1. In `FormManager`, implement `submit(): Promise<SubmissionResult>` method
2. Validate form
3. Set submitting flag
4. Call submit handler with form data
5. Return submission result
6. Export method
**Test Mapping:** TC-003-001, TC-003-002 (Submit tests)

### Task 5.2: Create SubmissionResult Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-003 (Submission result)
**Implementation Steps:**
1. In `logic/chronicler/form/types.ts`, define `SubmissionResult` interface with fields:
   - `success: boolean`
   - `data?: FormData`
   - `errors?: Record<string, string[]>`
2. Export interface
**Test Mapping:** TC-003-001, TC-003-002 (Result tests)

### Task 5.3: Implement setSubmitHandler Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-003 (Submit handler)
**Implementation Steps:**
1. In `FormManager`, implement `setSubmitHandler(handler: (data: FormData) => Promise<SubmissionResult>): void` method
2. Store submit handler
3. Export method
**Test Mapping:** TC-003-003, TC-003-004 (Handler tests)

---

## Phase 6: Auto-fill

### Task 6.1: Implement autoFill Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-004 (Auto-fill)
**Implementation Steps:**
1. In `FormManager`, implement `autoFill(data: Partial<FormData>): void` method
2. Merge provided data with form data
3. Update dirty flag
4. Validate updated fields
5. Notify subscribers
6. Export method
**Test Mapping:** TC-004-001, TC-004-002 (Auto-fill tests)

### Task 6.2: Implement autoFillField Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-004 (Field auto-fill)
**Implementation Steps:**
1. In `FormManager`, implement `autoFillField(fieldId: string, value: unknown): void` method
2. Set field value
3. Mark field as touched
4. Validate field
5. Notify subscribers
6. Export method
**Test Mapping:** TC-004-003, TC-004-004 (Field auto-fill tests)

---

## Phase 7: Draft Saving

### Task 7.1: Create DraftStorage Interface
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-005 (Draft saving)
**Implementation Steps:**
1. Create file `logic/chronicler/form/storage.ts`
2. Define `DraftStorage` interface with methods:
   - `save(formId: string, data: FormData): Promise<void>`
   - `load(formId: string): Promise<FormData | null>`
   - `clear(formId: string): Promise<void>`
3. Export interface
**Test Mapping:** TC-005-001, TC-005-002 (Storage tests)

### Task 7.2: Create LocalStorageDraftStorage
**Priority:** P0
**Dependencies:** Task 7.1
**Acceptance Criteria:** AC-005 (LocalStorage implementation)
**Implementation Steps:**
1. In `logic/chronicler/form/storage.ts`, implement `LocalStorageDraftStorage` class
2. Implement `save()` using localStorage
3. Implement `load()` from localStorage
4. Implement `clear()` from localStorage
5. Export class
**Test Mapping:** TC-005-001, TC-005-002 (LocalStorage tests)

### Task 7.3: Implement saveDraft Method
**Priority:** P0
**Dependencies:** Task 2.1, Task 7.2
**Acceptance Criteria:** AC-005 (Draft saving)
**Implementation Steps:**
1. In `FormManager`, implement `saveDraft(formId: string): Promise<void>` method
2. Serialize form data
3. Save to draft storage
4. Export method
**Test Mapping:** TC-005-001, TC-005-002 (Save tests)

### Task 7.4: Implement loadDraft Method
**Priority:** P0
**Dependencies:** Task 2.1, Task 7.2
**Acceptance Criteria:** AC-006 (Draft loading)
**Implementation Steps:**
1. In `FormManager`, implement `loadDraft(formId: string): Promise<boolean>` method
2. Load from draft storage
3. Auto-fill loaded data
4. Return success status
5. Export method
**Test Mapping:** TC-006-001, TC-006-002 (Load tests)

### Task 7.5: Implement clearDraft Method
**Priority:** P0
**Dependencies:** Task 2.1, Task 7.2
**Acceptance Criteria:** AC-006 (Draft clearing)
**Implementation Steps:**
1. In `FormManager`, implement `clearDraft(formId: string): Promise<void>` method
2. Clear draft from storage
3. Export method
**Test Mapping:** TC-006-003, TC-006-004 (Clear tests)

---

## Phase 8: Cancellation

### Task 8.1: Implement cancel Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-007 (Cancellation)
**Implementation Steps:**
1. In `FormManager`, implement `cancel(): void` method
2. Reset form to initial state
3. Clear draft if exists
4. Notify subscribers
5. Export method
**Test Mapping:** TC-007-001, TC-007-002 (Cancel tests)

### Task 8.2: Implement confirmCancel Method
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-007 (Cancel confirmation)
**Implementation Steps:**
1. In `FormManager`, implement `confirmCancel(): boolean` method
2. Check if form is dirty
3. Return true if safe to cancel, false if confirmation needed
4. Export method
**Test Mapping:** TC-007-003, TC-007-004 (Confirmation tests)

---

## Phase 9: Field Value Handling

### Task 9.1: Implement setFieldValue Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-008 (Question type handling)
**Implementation Steps:**
1. In `FormManager`, implement `setFieldValue(fieldId: string, value: unknown): void` method
2. Set field value
3. Mark field as touched
4. Mark form as dirty
5. Validate field
6. Notify subscribers
7. Export method
**Test Mapping:** TC-008-001, TC-008-002 (Set value tests)

### Task 9.2: Implement getFieldValue Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-008 (Question type handling)
**Implementation Steps:**
1. In `FormManager`, implement `getFieldValue(fieldId: string): unknown` method
2. Get field value from form data
3. Return value
4. Export method
**Test Mapping:** TC-008-003, TC-008-004 (Get value tests)

---

## Phase 10: Radio Question Handling

### Task 10.1: Implement RadioQuestionHandler
**Priority:** P0
**Dependencies:** Task 1.1, Task 9.1
**Acceptance Criteria:** AC-008 (Radio question handling)
**Implementation Steps:**
1. Create file `logic/chronicler/form/handlers.ts`
2. Implement `handleRadioChange(fieldId: string, value: string): void` function
3. Set radio field value
4. Mark field as touched
5. Validate field
6. Export handler function
**Test Mapping:** TC-008-005, TC-008-006 (Radio tests)

---

## Phase 11: Checkbox Question Handling

### Task 11.1: Implement CheckboxQuestionHandler
**Priority:** P0
**Dependencies:** Task 1.1, Task 9.1
**Acceptance Criteria:** AC-008 (Checkbox question handling)
**Implementation Steps:**
1. In `logic/chronicler/form/handlers.ts`, implement `handleCheckboxChange(fieldId: string, checked: boolean, value: string): void` function
2. Update checkbox field array
3. Mark field as touched
4. Validate field
5. Export handler function
**Test Mapping:** TC-008-007, TC-008-008 (Checkbox tests)

---

## Phase 12: Text Question Handling

### Task 12.1: Implement TextQuestionHandler
**Priority:** P0
**Dependencies:** Task 1.1, Task 9.1
**Acceptance Criteria:** AC-008 (Text question handling)
**Implementation Steps:**
1. In `logic/chronicler/form/handlers.ts`, implement `handleTextChange(fieldId: string, value: string): void` function
2. Set text field value
3. Mark field as touched
4. Validate field
5. Export handler function
**Test Mapping:** TC-008-009, TC-008-010 (Text tests)

---

## Phase 13: Select Question Handling

### Task 13.1: Implement SelectQuestionHandler
**Priority:** P0
**Dependencies:** Task 1.1, Task 9.1
**Acceptance Criteria:** AC-008 (Select question handling)
**Implementation Steps:**
1. In `logic/chronicler/form/handlers.ts`, implement `handleSelectChange(fieldId: string, value: string): void` function
2. Set select field value
3. Mark field as touched
4. Validate field
5. Export handler function
**Test Mapping:** TC-008-011, TC-008-012 (Select tests)

---

## Phase 14: React Components

### Task 14.1: Create Form Component
**Priority:** P0
**Dependencies:** Task 2.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `components/chronicler/Form.tsx`
2. Implement main form component
3. Connect to form manager
4. Handle state updates
5. Export component
**Test Mapping:** TC-001-001, TC-001-002

### Task 14.2: Create FormField Component
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `components/chronicler/FormField.tsx`
2. Implement form field component
3. Render label, input, error messages
4. Handle question type
5. Export component
**Test Mapping:** TC-008-001, TC-008-002

### Task 14.3: Create TextInput Component
**Priority:** P0
**Dependencies:** Task 12.1
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `components/chronicler/TextInput.tsx`
2. Implement text input component
3. Handle change events
4. Display validation errors
5. Export component
**Test Mapping:** TC-008-009, TC-008-010

### Task 14.4: Create RadioInput Component
**Priority:** P0
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `components/chronicler/RadioInput.tsx`
2. Implement radio input component
3. Handle change events
4. Display validation errors
5. Export component
**Test Mapping:** TC-008-005, TC-008-006

### Task 14.5: Create CheckboxInput Component
**Priority:** P0
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `components/chronicler/CheckboxInput.tsx`
2. Implement checkbox input component
3. Handle change events
4. Display validation errors
5. Export component
**Test Mapping:** TC-008-007, TC-008-008

### Task 14.6: Create SelectInput Component
**Priority:** P0
**Dependencies:** Task 13.1
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `components/chronicler/SelectInput.tsx`
2. Implement select input component
3. Handle change events
4. Display validation errors
5. Export component
**Test Mapping:** TC-008-011, TC-008-012

### Task 14.7: Create FormActions Component
**Priority:** P0
**Dependencies:** Task 5.1, Task 8.1
**Acceptance Criteria:** AC-003, AC-007
**Implementation Steps:**
1. Create file `components/chronicler/FormActions.tsx`
2. Implement form actions component
3. Add submit button
4. Add cancel button
5. Handle button clicks
6. Export component
**Test Mapping:** TC-003-001, TC-003-002, TC-007-001, TC-007-002

---

## Phase 15: Test Files

### Task 15.1: Create FormManager Tests
**Priority:** P0
**Dependencies:** Task 3.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/chronicler/form/__tests__/manager.test.ts`
2. Write tests for form initialization
3. Write tests for form reset
4. Write tests for state management
**Test Mapping:** TC-001-001, TC-001-002

### Task 15.2: Create ValidationTests
**Priority:** P0
**Dependencies:** Task 4.4
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/chronicler/form/__tests__/validator.test.ts`
2. Write tests for field validation
3. Write tests for form validation
4. Write tests for validation rules
**Test Mapping:** TC-002-001, TC-002-002

### Task 15.3: Create SubmissionTests
**Priority:** P0
**Dependencies:** Task 5.3
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/chronicler/form/__tests__/submission.test.ts`
2. Write tests for form submission
3. Write tests for submit handler
4. Write tests for submission result
**Test Mapping:** TC-003-001, TC-003-002

### Task 15.4: Create AutoFillTests
**Priority:** P0
**Dependencies:** Task 6.2
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/chronicler/form/__tests__/autofill.test.ts`
2. Write tests for auto-fill
3. Write tests for field auto-fill
4. Write tests for auto-fill validation
**Test Mapping:** TC-004-001, TC-004-002

### Task 15.5: Create DraftTests
**Priority:** P0
**Dependencies:** Task 7.5
**Acceptance Criteria:** AC-005, AC-006
**Implementation Steps:**
1. Create file `logic/chronicler/form/__tests__/draft.test.ts`
2. Write tests for draft saving
3. Write tests for draft loading
4. Write tests for draft clearing
**Test Mapping:** TC-005-001, TC-005-002, TC-006-001, TC-006-002

### Task 15.6: Create CancellationTests
**Priority:** P0
**Dependencies:** Task 8.2
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/chronicler/form/__tests__/cancel.test.ts`
2. Write tests for form cancellation
3. Write tests for cancel confirmation
4. Write tests for dirty form handling
**Test Mapping:** TC-007-001, TC-007-002

### Task 15.7: Create QuestionTypeTests
**Priority:** P0
**Dependencies:** Task 13.1
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/chronicler/form/__tests__/questions.test.ts`
2. Write tests for text question handling
3. Write tests for radio question handling
4. Write tests for checkbox question handling
5. Write tests for select question handling
**Test Mapping:** TC-008-001, TC-008-002

---

## Summary

**Total Tasks:** 59
**P0 Tasks:** 56 (Types, Manager, Initialization, Validation, Submission, Auto-fill, Draft, Cancellation, Field handling, Question handlers, Components, Tests)
**P1 Tasks:** 3 (Cancel confirmation, Tests)

**Phases:** 15
- Phase 1: Form Types (5 tasks)
- Phase 2: Form Manager (2 tasks)
- Phase 3: Form Initialization (2 tasks)
- Phase 4: Validation (4 tasks)
- Phase 5: Submission (3 tasks)
- Phase 6: Auto-fill (2 tasks)
- Phase 7: Draft Saving (5 tasks)
- Phase 8: Cancellation (2 tasks)
- Phase 9: Field Value Handling (2 tasks)
- Phase 10: Radio Question Handling (1 task)
- Phase 11: Checkbox Question Handling (1 task)
- Phase 12: Text Question Handling (1 task)
- Phase 13: Select Question Handling (1 task)
- Phase 14: React Components (7 tasks)
- Phase 15: Test Files (7 tasks)
