# TDD: Chronicler Form System

## Specification Reference
- Spec: [`026-chronicler-form-system.md`](../specs/026-chronicler-form-system.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: Form Initialization
**Given** a ChroniclerForm is defined
**When** form is initialized
**Then** form must be ready with default values

### AC-002: Form Validation
**Given** a form with required fields
**When** user submits without filling required fields
**Then** validation must fail with appropriate error

### AC-003: Form Submission
**Given** a valid form
**When** user submits
**Then** session must be created with form values

### AC-004: Auto-Fill Functionality
**Given** a form with default values
**When** user clicks auto-fill
**Then** all fields must be set to defaults

### AC-005: Draft Saving
**Given** a form in progress
**When** user saves draft
**Then** form values must be persisted

### AC-006: Draft Loading
**Given** saved draft data
**When** form is loaded
**Then** form values must be restored

### AC-007: Form Cancellation
**Given** a form in progress
**When** user cancels
**Then** form must close without creating session

### AC-008: Question Type Handling
**Given** different question types
**When** form is rendered
**Then** appropriate input controls must be displayed

### AC-009: Radio Button Selection
**Given** a radio question
**When** user selects option
**When** only one option must be selected

### AC-010: Checkbox Selection
**Given** a checkbox question
**When** user selects options
**Then** multiple options may be selected

### AC-011: Text Input Validation
**Given** a text question with validation
**When** user enters invalid text
**Then** validation error must be displayed

### AC-012: Select Dropdown Handling
**Given** a select question
**When** user selects option
**Then** selected value must be updated

---

## Test Cases

### AC-001: Form Initialization

#### TC-001-001: Happy Path - Initialize Age Transition Form
**Input**:
```typescript
{
  form: AGE_TRANSITION_FORM,
  candidateId: "cc_001"
}
```
**Expected**: Form initialized with default values
**Priority**: P0

#### TC-001-002: Happy Path - Initialize Settlement Form
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  candidateId: "cc_002"
}
```
**Expected**: Form initialized with default values
**Priority**: P0

#### TC-001-003: Edge Case - Initialize Invalid Form
**Input**:
```typescript
{
  form: { /* invalid form */ },
  candidateId: "cc_003"
}
```
**Expected**: Error thrown, invalid form
**Priority**: P0

#### TC-001-004: Integration - Initialize with Candidate Data
**Input**:
```typescript
{
  form: AGE_TRANSITION_FORM,
  candidate: {
    triggerType: "AGE_ADVANCE",
    age: 1,
    sourceEventIds: ["evt_age_001"]
  }
}
```
**Expected**: Form initialized with candidate context
**Priority**: P0

---

### AC-002: Form Validation

#### TC-002-001: Happy Path - Valid Form Submission
**Input**:
```typescript
{
  form: AGE_TRANSITION_FORM,
  values: {
    age_definition: "creation",
    age_memory: "reverence"
  }
}
```
**Expected**: Form validates, session created
**Priority**: P0

#### TC-002-002: Error Case - Missing Required Field
**Input**:
```typescript
{
  form: AGE_TRANSITION_FORM,
  values: {
    age_definition: "creation"
    // age_memory missing
  }
}
```
**Expected**: Validation error, "age_memory is required"
**Priority**: P0

#### TC-002-003: Error Case - Invalid Option Value
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  values: {
    settlement_motive: "invalid_option"
  }
}
```
**Expected**: Validation error, "invalid_option is not a valid option"
**Priority**: P0

#### TC-002-004: Edge Case - Empty Text Field
**Input**:
```typescript
{
  form: LANDMARK_FORM,
  values: {
    landmark_name: ""
  }
}
```
**Expected**: Validation error, "landmark_name cannot be empty"
**Priority**: P1

#### TC-002-005: Integration - Validation with Multiple Errors
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  values: {
    settlement_motive: "", // Missing
    settlement_character: [] // Missing required
  }
}
```
**Expected**: Multiple validation errors
**Priority**: P0

---

### AC-003: Form Submission

#### TC-003-001: Happy Path - Submit Valid Form
**Input**:
```typescript
{
  form: AGE_TRANSITION_FORM,
  values: {
    age_definition: "creation",
    age_memory: "reverence"
  },
  action: "SUBMIT"
}
```
**Expected**: ChroniclerSession created with draft values
**Priority**: P0

#### TC-003-002: Happy Path - Submit with Auto-Generated Draft
**Input**:
```typescript
{
  form: AGE_TRANSITION_FORM,
  values: { /* auto-filled values */ },
  action: "SUBMIT"
}
```
**Expected**: Session created with generated draft
**Priority**: P0

#### TC-003-003: Edge Case - Submit Invalid Form
**Input**:
```typescript
{
  form: AGE_TRANSITION_FORM,
  values: { /* invalid values */ },
  action: "SUBMIT"
}
```
**Expected**: Submit disabled, validation errors displayed
**Priority**: P0

#### TC-003-004: Integration - Submit Creates Session
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  values: { /* valid values */ },
  action: "SUBMIT"
}
```
**Expected**: ChroniclerSession created, draft populated
**Priority**: P0

---

### AC-004: Auto-Fill Functionality

#### TC-004-001: Happy Path - Auto-Fill All Fields
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  action: "AUTO_FILL"
}
```
**Expected**: All fields set to default values
**Priority**: P0

#### TC-004-002: Happy Path - Auto-Fill Partial
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  existingValues: {
    settlement_motive: "trade"
  },
  action: "AUTO_FILL"
}
```
**Expected**: Non-empty fields preserved, empty fields filled with defaults
**Priority**: P0

#### TC-004-003: Edge Case - Auto-Fill Invalid Form
**Input**:
```typescript
{
  form: { /* invalid form */ },
  action: "AUTO_FILL"
}
```
**Expected**: No action or error thrown
**Priority**: P1

#### TC-004-004: Integration - Auto-Fill with Context
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  candidate: { /* candidate with context */ },
  action: "AUTO_FILL"
}
```
**Expected**: Fields filled with context-aware defaults
**Priority**: P0

---

### AC-005: Draft Saving

#### TC-005-001: Happy Path - Save Draft
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  values: {
    settlement_motive: "trade",
    settlement_character: ["markets", "stone"]
  },
  action: "SAVE_DRAFT"
}
```
**Expected**: Draft saved, isDirty=false
**Priority**: P0

#### TC-005-002: Happy Path - Load Draft
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  savedDraft: {
    settlement_motive: "trade",
    settlement_character: ["markets", "stone"]
  },
  action: "LOAD_DRAFT"
}
```
**Expected**: Form values restored, isDirty=false
**Priority**: P0

#### TC-005-003: Edge Case - Load Invalid Draft
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  savedDraft: { /* invalid data */ },
  action: "LOAD_DRAFT"
}
```
**Expected**: Error thrown, invalid draft data
**Priority**: P1

#### TC-005-004: Integration - Draft Persistence
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  values: { /* values */ },
  action: "SAVE_DRAFT"
}
```
**Expected**: Draft persisted to storage
**Priority**: P0

---

### AC-006: Draft Loading

#### TC-006-001: Happy Path - Load Existing Draft
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  draftId: "draft_settlement_001"
}
```
**Expected**: Form values loaded from draft
**Priority**: P0

#### TC-006-002: Edge Case - Load Non-Existent Draft
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  draftId: "draft_non_existent"
}
```
**Expected**: Error thrown, draft not found
**Priority**: P1

#### TC-006-003: Integration - Load Draft with Form State
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  draftId: "draft_settlement_001",
  existingValues: { settlement_motive: "defense" }
}
```
**Expected**: Form values merged with draft
**Priority**: P0

---

### AC-007: Form Cancellation

#### TC-007-001: Happy Path - Cancel Form
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  action: "CANCEL"
}
```
**Expected**: Form closes, no session created
**Priority**: P0

#### TC-007-002: Happy Path - Cancel with Dirty Warning
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  isDirty: true,
  action: "CANCEL"
}
```
**Expected**: Warning displayed, form closes
**Priority**: P1

#### TC-007-003: Edge Case - Cancel Already Submitted
**Input**:
```typescript
{
  form: { status: "SUBMITTED" },
  action: "CANCEL"
}
```
**Expected**: No action, form already submitted
**Priority**: P1

#### TC-007-004: Integration - Cancel Creates Cancelled Session
**Input**:
```typescript
{
  form: SETTLEMENT_FOUNDING_FORM,
  action: "CANCEL"
}
```
**Expected**: ChroniclerSession created with status=CANCELLED
**Priority**: P0

---

### AC-008: Question Type Handling

#### TC-008-001: Happy Path - Render Radio Question
**Input**:
```typescript
{
  question: {
    id: "age_definition",
    type: "RADIO",
    label: "What defined this Age most?",
    options: [
      { value: "creation", label: "Creation" },
      { value: "conflict", label: "Conflict" },
      { value: "expansion", label: "Expansion" }
    ],
    required: true,
    defaultValue: "creation"
  }
}
```
**Expected**: Radio buttons rendered, default selected
**Priority**: P0

#### TC-008-002: Happy Path - Render Checkbox Question
**Input**:
```typescript
{
  question: {
    id: "settlement_character",
    type: "CHECKBOX",
    label: "What defines it?",
    options: [
      { value: "stone", label: "Stone" },
      { value: "markets", label: "Markets" },
      { value: "walls", label: "Walls" },
      { value: "learning", label: "Learning" }
    ],
    required: true,
    defaultValue: ["stone", "markets"]
  }
}
```
**Expected**: Checkboxes rendered, defaults selected
**Priority**: P0

#### TC-008-003: Happy Path - Render Text Question
**Input**:
```typescript
{
  question: {
    id: "landmark_name",
    type: "TEXT",
    label: "What is it called?",
    required: true,
    validation: [
      { type: "MIN_LENGTH", value: 1 }
    ]
  }
}
```
**Expected**: Text input rendered with validation
**Priority**: P0

#### TC-008-004: Happy Path - Render Select Question
**Input**:
```typescript
{
  question: {
    id: "capital_reason",
    type: "SELECT",
    label: "Why was it chosen?",
    options: [
      { value: "centrality", label: "Centrality" },
      { value: "history", label: "History" },
      { value: "strength", label: "Strength" },
      { value: "symbolism", label: "Symbolism" }
    ],
    required: true,
    defaultValue: "centrality"
  }
}
```
**Expected**: Select dropdown rendered, default selected
**Priority**: P0

#### TC-008-005: Edge Case - Invalid Question Type
**Input**:
```typescript
{
  question: {
    id: "invalid_question",
    type: "INVALID_TYPE"
  }
}
```
**Expected**: Error thrown, invalid question type
**Priority**: P0

#### TC-008-006: Integration - Render Form Section
**Input**:
```typescript
{
  section: {
    id: "definition",
    title: "What defined this Age most?",
    questions: [/* questions */]
  }
}
```
**Expected**: Section rendered with all questions
**Priority**: P0

---

### AC-009: Radio Button Selection

#### TC-009-001: Happy Path - Select Radio Option
**Input**:
```typescript
{
  question: { /* radio question */ },
  value: "conflict"
}
```
**Expected**: Only "conflict" selected
**Priority**: P0

#### TC-009-002: Happy Path - Change Radio Selection
**Input**:
```typescript
{
  question: { /* radio question */ },
  currentValue: "creation",
  newValue: "conflict"
}
```
**Expected**: Selection changes to "conflict"
**Priority**: P0

#### TC-009-003: Edge Case - Select Disabled Option
**Input**:
```typescript
{
  question: {
    /* radio question */,
    options: [
      { value: "creation", label: "Creation" },
      { value: "conflict", label: "Conflict", disabled: true }
    ]
  },
  value: "conflict"
}
```
**Expected**: Selection fails or warning displayed
**Priority**: P1

#### TC-009-004: Integration - Radio with Validation
**Input**:
```typescript
{
  question: {
    /* radio question */,
    required: true
  },
  value: null // No selection
}
```
**Expected**: Submit disabled, validation error
**Priority**: P0

---

### AC-010: Checkbox Selection

#### TC-010-001: Happy Path - Select Multiple Checkboxes
**Input**:
```typescript
{
  question: { /* checkbox question */ },
  values: ["stone", "markets", "learning"]
}
```
**Expected**: All three options selected
**Priority**: P0

#### TC-010-002: Happy Path - Deselect Checkbox
**Input**:
```typescript
{
  question: { /* checkbox question */ },
  currentValue: ["stone", "markets", "learning"],
  value: "stone"
}
```
**Expected**: Only "stone" selected
**Priority**: P0

#### TC-010-003: Edge Case - Select Disabled Checkbox
**Input**:
```typescript
{
  question: {
    /* checkbox question */,
    options: [
      { value: "stone", label: "Stone" },
      { value: "markets", label: "Markets", disabled: true }
    ]
  },
  value: "markets"
}
```
**Expected**: Selection fails or warning displayed
**Priority**: P1

#### TC-010-004: Integration - Checkbox with Minimum Selection
**Input**:
```typescript
{
  question: {
    /* checkbox question */,
    required: true,
    options: [/* options */]
  },
  values: []
}
```
**Expected**: Submit disabled, validation error
**Priority**: P0

---

### AC-011: Text Input Validation

#### TC-011-001: Happy Path - Valid Text Input
**Input**:
```typescript
{
  question: {
    id: "landmark_name",
    type: "TEXT",
    validation: [
      { type: "MIN_LENGTH", value: 1 },
      { type: "MAX_LENGTH", value: 50 }
    ]
  },
  value: "The Ancient Spire"
}
```
**Expected**: Validation passes
**Priority**: P0

#### TC-011-002: Error Case - Text Too Short
**Input**:
```typescript
{
  question: {
    id: "landmark_name",
    type: "TEXT",
    validation: [
      { type: "MIN_LENGTH", value: 1 }
    ]
  },
  value: ""
}
```
**Expected**: Validation error, "Must be at least 1 character"
**Priority**: P0

#### TC-011-003: Error Case - Text Too Long
**Input**:
```typescript
{
  question: {
    id: "landmark_name",
    type: "TEXT",
    validation: [
      { type: "MAX_LENGTH", value: 50 }
    ]
  },
  value: "A".repeat(51)
}
```
**Expected**: Validation error, "Must be at most 50 characters"
**Priority**: P0

#### TC-011-004: Integration - Text with Pattern Validation
**Input**:
```typescript
{
  question: {
    id: "custom_id",
    type: "TEXT",
    validation: [
      { type: "PATTERN", value: "^[a-z0-9_]+$" }
    ]
  },
  value: "invalid@id"
}
```
**Expected**: Validation error, "Must contain only letters and numbers"
**Priority**: P0

---

### AC-012: Select Dropdown Handling

#### TC-012-001: Happy Path - Select Option
**Input**:
```typescript
{
  question: { /* select question */ },
  value: "history"
}
```
**Expected**: "history" selected
**Priority**: P0

#### TC-012-002: Happy Path - Change Selection
**Input**:
```typescript
{
  question: { /* select question */ },
  currentValue: "centrality",
  newValue: "history"
}
```
**Expected**: Selection changes to "history"
**Priority**: P0

#### TC-012-003: Edge Case - Select Disabled Option
**Input**:
```typescript
{
  question: {
    /* select question */,
    options: [
      { value: "centrality", label: "Centrality" },
      { value: "history", label: "History", disabled: true }
    ]
  },
  value: "history"
}
```
**Expected**: Selection fails or warning displayed
**Priority**: P1

#### TC-012-004: Integration - Select with Default
**Input**:
```typescript
{
  question: {
    /* select question */,
    defaultValue: "centrality"
  }
}
```
**Expected**: "centrality" selected by default
**Priority**: P0

---

## Test Data

### Sample ChroniclerForm
```typescript
const SAMPLE_FORM: ChroniclerForm = {
  id: "age_transition_form",
  version: "1.0.0",
  triggerType: "AGE_ADVANCE",
  candidateId: "cc_age_001",
  title: "THE PASSING OF AN AGE",
  description: "How will this Age be remembered?",
  sections: [
    {
      id: "definition",
      title: "What defined this Age most?",
      questions: [
        {
          id: "age_definition",
          type: "RADIO",
          label: "Primary characteristic",
          required: true,
          defaultValue: "creation",
          options: [
            { value: "creation", label: "Creation" },
            { value: "conflict", label: "Conflict" },
            { value: "expansion", label: "Expansion" },
            { value: "decline", label: "Decline" },
            { value: "transformation", label: "Transformation" }
          ]
        }
      ]
    },
    {
      id: "memory",
      title: "How is it remembered?",
      questions: [
        {
          id: "age_memory",
          type: "RADIO",
          label: "Emotional tone",
          required: true,
          defaultValue: "reverence",
          options: [
            { value: "reverence", label: "With reverence" },
            { value: "regret", label: "With regret" },
            { value: "awe", label: "With awe" },
            { value: "dread", label: "With dread" }
          ]
        }
      ]
    }
  ],
  actions: [
    { id: "submit", type: "SUBMIT", label: "Write Chronicle", primary: true },
    { id: "auto_fill", type: "AUTO_FILL", label: "Auto-Fill Defaults" },
    { id: "cancel", type: "CANCEL", label: "Cancel" }
  ],
  values: {},
  isDirty: false,
  isValid: false
};
```

### Sample FormQuestion
```typescript
const SAMPLE_RADIO_QUESTION: FormQuestion = {
  id: "age_definition",
  type: "RADIO",
  label: "Primary characteristic",
  description: "Choose the defining quality of this Age.",
  required: true,
  options: [
    { value: "creation", label: "Creation", description: "The world was shaped anew." },
    { value: "conflict", label: "Conflict", description: "War and struggle defined the era." },
    { value: "expansion", label: "Expansion", description: "Civilization spread outward." }
  ],
  defaultValue: "creation"
};

const SAMPLE_CHECKBOX_QUESTION: FormQuestion = {
  id: "settlement_character",
  type: "CHECKBOX",
  label: "What defines it?",
  description: "Select the features that characterize this settlement.",
  required: true,
  options: [
    { value: "stone", label: "Stone", description: "Built of enduring materials." },
    { value: "markets", label: "Markets", description: "Center of commerce and trade." },
    { value: "walls", label: "Walls", description: "Protected by fortifications." },
    { value: "learning", label: "Learning", description: "Home to scholars and knowledge." }
  ],
  defaultValue: ["stone", "markets"]
};

const SAMPLE_TEXT_QUESTION: FormQuestion = {
  id: "landmark_name",
  type: "TEXT",
  label: "What is it called?",
  description: "Enter the name of this landmark.",
  required: true,
  validation: [
    { type: "MIN_LENGTH", value: 1 },
    { type: "MAX_LENGTH", value: 50 }
  ]
};

const SAMPLE_SELECT_QUESTION: FormQuestion = {
  id: "capital_reason",
  type: "SELECT",
  label: "Why was it chosen?",
  description: "Select the primary reason for this designation.",
  required: true,
  options: [
    { value: "centrality", label: "Centrality", description: "Central to all territories." },
    { value: "history", label: "History", description: "Ancient and traditional." },
    { value: "strength", label: "Strength", description: "Defensible and powerful." },
    { value: "symbolism", label: "Symbolism", description: "Represents an ideal." }
  ],
  defaultValue: "centrality"
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test form initialization
- Test form validation
- Test form submission
- Test auto-fill functionality
- Test draft saving and loading
- Test form cancellation
- Test question type handling

### Integration Testing Approach
- Test form with chronicler session
- Test form with template engine
- Test form with backlog system
- Test draft persistence
- Test form action handlers

### End-to-End Testing Approach
- Test complete form workflow
- Test form with auto-chronicler
- Test draft save/load cycles
- Test form validation scenarios
- Test form cancellation workflows

### Performance Testing Approach
- Test form rendering with many questions
- Test validation performance
- Test draft save/load performance
- Test form state management

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── form/
│   │   ├── ChroniclerForm.test.ts
│   │   ├── FormValidation.test.ts
│   │   ├── FormSubmission.test.ts
│   │   ├── AutoFill.test.ts
│   │   ├── DraftSaving.test.ts
│   │   ├── DraftLoading.test.ts
│   │   ├── FormCancellation.test.ts
│   │   ├── QuestionTypeHandling.test.ts
│   │   ├── RadioButtonSelection.test.ts
│   │   ├── CheckboxSelection.test.ts
│   │   ├── TextInputValidation.test.ts
│   │   └── SelectDropdownHandling.test.ts
├── integration/
│   ├── form/
│   │   ├── FormWithSession.test.ts
│   │   ├── FormWithTemplateEngine.test.ts
│   │   ├── FormWithBacklog.test.ts
│   │   ├── DraftPersistence.test.ts
│   │   └── FormActionHandlers.test.ts
└── e2e/
    ├── form/
    │   ├── CompleteFormWorkflow.test.ts
    │   ├── DraftSaveLoadCycle.test.ts
    │   ├── ValidationScenarios.test.ts
    │   └── CancellationWorkflows.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by form component for unit tests
- Group by integration feature for integration tests
- Group by user scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases
