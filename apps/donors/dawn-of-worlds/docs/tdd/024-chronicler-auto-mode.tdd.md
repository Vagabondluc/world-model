# TDD: Chronicler Auto Mode

## Specification Reference
- Spec: [`024-chronicler-auto-mode.md`](../specs/024-chronicler-auto-mode.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: AutoChronicler Initialization
**Given** an AutoChroniclerConfig is provided
**When** AutoChronicler is created
**Then** chronicler must be initialized with config and template engine

### AC-002: Entry Generation
**Given** a ChronicleCandidate is provided
**When** generateEntry is called
**Then** a valid JournalEntry must be returned or null if not eligible

### AC-003: Context Resolution
**Given** a candidate and world state
**When** context is resolved
**Then** all four passes must complete successfully

### AC-004: Author Selection
**Given** a candidate and config
**When** author is selected
**Then** author must follow selection rules or use preferred author

### AC-005: Template Selection
**Given** a candidate with suggested templates
**When** template is selected
**Then** first suggested template must be used

### AC-006: Verbosity-Specific Generation
**Given** a verbosity level is configured
**When** entry is generated
**Then** output must match verbosity profile

### AC-007: Myth Inclusion
**Given** a candidate and config with myth chance
**When** entry is generated
**Then** myths must be included based on chance

### AC-008: Observation Inclusion
**Given** a candidate and config with observation chance
**When** entry is generated
**Then** observations must be included based on chance

### AC-009: Procedural Table Usage
**Given** a candidate and config
**When** entry is generated
**Then** procedural tables must be used for embellishments

### AC-010: Config Update
**Given** a running AutoChronicler
**When** config is updated
**Then** new config must be applied to future generations

### AC-011: Provenance Tracking
**Given** an entry is generated
**When** provenance is recorded
**Then** generatedBy, tablesUsed, and reviewed must be set correctly

---

## Test Cases

### AC-001: AutoChronicler Initialization

#### TC-001-001: Happy Path - Initialize with Valid Config
**Input**:
```typescript
{
  config: {
    enabled: true,
    verbosity: "STANDARD",
    mythChance: 0.35,
    observationChance: 0.25,
    preferredAuthor: "THE_WORLD",
    maxEntriesPerRound: 3,
    useAI: false
  },
  templateEngine: { /* template engine instance */ }
}
```
**Expected**: AutoChronicler initialized successfully
**Priority**: P0

#### TC-001-002: Happy Path - Initialize Disabled
**Input**:
```typescript
{
  config: {
    enabled: false,
    verbosity: "STANDARD",
    mythChance: 0.35,
    observationChance: 0.25,
    preferredAuthor: "THE_WORLD",
    maxEntriesPerRound: 3,
    useAI: false
  },
  templateEngine: { /* template engine instance */ }
}
```
**Expected**: AutoChronicler initialized, will not generate entries
**Priority**: P0

#### TC-001-003: Edge Case - Invalid Verbosity
**Input**:
```typescript
{
  config: {
    enabled: true,
    verbosity: "INVALID", // Invalid verbosity
    mythChance: 0.35,
    observationChance: 0.25,
    preferredAuthor: "THE_WORLD",
    maxEntriesPerRound: 3,
    useAI: false
  }
}
```
**Expected**: Error thrown, invalid verbosity
**Priority**: P0

#### TC-001-004: Error Case - Invalid Myth Chance
**Input**:
```typescript
{
  config: {
    enabled: true,
    verbosity: "STANDARD",
    mythChance: 1.5, // Invalid: > 1.0
    observationChance: 0.25,
    preferredAuthor: "THE_WORLD",
    maxEntriesPerRound: 3,
    useAI: false
  }
}
```
**Expected**: Error thrown, mythChance must be 0.0-1.0
**Priority**: P0

---

### AC-002: Entry Generation

#### TC-002-001: Happy Path - Generate Valid Entry
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
    suggestedAuthors: ["IMPERIAL_SCRIBE"],
    autoEligible: true
  }
}
```
**Expected**: Valid JournalEntry returned with all fields
**Priority**: P0

#### TC-002-002: Edge Case - Non-Eligible Candidate
**Input**:
```typescript
{
  candidate: {
    id: "cc_002",
    autoEligible: false
  }
}
```
**Expected**: Returns null
**Priority**: P1

#### TC-002-003: Edge Case - Missing Template
**Input**:
```typescript
{
  candidate: {
    id: "cc_003",
    suggestedTemplates: ["non_existent_template"],
    autoEligible: true
  }
}
```
**Expected**: Returns null, template not found
**Priority**: P1

#### TC-002-004: Integration - Generate with Provenance
**Input**:
```typescript
{
  candidate: { /* valid candidate */ },
  context: { mythicSeed: ["embellishment"] }
}
```
**Expected**: Entry with provenance.generatedBy="AUTO", tablesUsed=["MYTHIC_EMBELLISHMENT"]
**Priority**: P0

---

### AC-003: Context Resolution

#### TC-003-001: Happy Path - Pass 1 - Canonical Facts
**Input**:
```typescript
{
  candidate: {
    triggerType: "SETTLEMENT_FOUND",
    sourceEventIds: ["evt_001"],
    age: 1
  }
}
```
**Expected**: Context contains age=1, eventName="SETTLEMENT_FOUND"
**Priority**: P0

#### TC-003-002: Happy Path - Pass 2 - Default Semantics
**Input**:
```typescript
{
  context: { age: 1, eventName: "TEST" }
}
```
**Expected**: Context includes foundingMotive="necessity", warCause="old grievance", tone="neutral"
**Priority**: P0

#### TC-003-003: Happy Path - Pass 3 - Procedural Tables
**Input**:
```typescript
{
  context: { age: 1, cityName: "Ashkel" },
  config: { mythChance: 0.5 },
  rng: new SeededRandom(42)
}
```
**Expected**: Context includes mythicSeed based on RNG
**Priority**: P0

#### TC-003-004: Integration - All Passes Complete
**Input**:
```typescript
{
  candidate: { /* valid candidate */ },
  state: { /* world state */ },
  config: { /* auto config */ },
  rng: new SeededRandom(42)
}
```
**Expected**: Complete context with all passes applied
**Priority**: P0

---

### AC-004: Author Selection

#### TC-004-001: Happy Path - Use Preferred Author
**Input**:
```typescript
{
  candidate: { triggerType: "TEST" },
  config: { preferredAuthor: "THE_WORLD" }
}
```
**Expected**: Author = "THE_WORLD"
**Priority**: P0

#### TC-004-002: Happy Path - Age Transition Author
**Input**:
```typescript
{
  candidate: { triggerType: "AGE_ADVANCE" },
  config: { preferredAuthor: "AUTO" }
}
```
**Expected**: Author = "THE_WORLD"
**Priority**: P0

#### TC-004-003: Happy Path - First City Author
**Input**:
```typescript
{
  candidate: { triggerType: "SETTLEMENT_FOUND" },
  config: { preferredAuthor: "AUTO" }
}
```
**Expected**: Author = "IMPERIAL_SCRIBE"
**Priority**: P0

#### TC-004-004: Edge Case - War Author by Age
**Input**:
```typescript
{
  candidate: { triggerType: "WAR_BEGIN", age: 1 },
  config: { preferredAuthor: "AUTO" }
}
```
**Expected**: Author = "THE_WORLD" (early age)
**Priority**: P1

#### TC-004-005: Edge Case - War Author by Age
**Input**:
```typescript
{
  candidate: { triggerType: "WAR_BEGIN", age: 3 },
  config: { preferredAuthor: "AUTO" }
}
```
**Expected**: Author = "UNKNOWN" (later age)
**Priority**: P1

---

### AC-005: Template Selection

#### TC-005-001: Happy Path - Use First Suggested Template
**Input**:
```typescript
{
  candidate: {
    suggestedTemplates: ["template_1", "template_2", "template_3"]
  }
}
```
**Expected**: Template = "template_1"
**Priority**: P0

#### TC-005-002: Edge Case - Empty Suggested Templates
**Input**:
```typescript
{
  candidate: {
    suggestedTemplates: []
  }
}
```
**Expected**: Returns null or uses default template
**Priority**: P1

#### TC-005-003: Integration - Template with Context
**Input**:
```typescript
{
  candidate: { suggestedTemplates: ["settlement_founding_chronicle"] },
  context: { cityName: "Ashkel", age: 1 }
}
```
**Expected**: Template selected and used with context
**Priority**: P0

---

### AC-006: Verbosity-Specific Generation

#### TC-006-001: Happy Path - MINIMAL Verbosity
**Input**:
```typescript
{
  config: { verbosity: "MINIMAL" },
  template: {
    text: "Ashkel became the first true city of the First Age. Here, permanence replaced wandering, and history found a place to begin."
  }
}
```
**Expected**: Text = "Ashkel became the first true city of the First Age."
**Priority**: P0

#### TC-006-002: Happy Path - STANDARD Verbosity
**Input**:
```typescript
{
  config: { verbosity: "STANDARD" },
  template: {
    text: "Ashkel became the first true city of the First Age. Here, permanence replaced wandering, and history found a place to begin."
  }
}
```
**Expected**: Text = "Ashkel became the first true city of the First Age. Here, permanence replaced wandering, and history found a place to begin."
**Priority**: P0

#### TC-006-003: Happy Path - RICH Verbosity
**Input**:
```typescript
{
  config: { verbosity: "RICH" },
  template: {
    text: "Ashkel became the first true city of the First Age. Here, permanence replaced wandering, and history found a place to begin."
  },
  context: { mythicSeed: ["Some say it was not made, but awakened."] }
}
```
**Expected**: Text = "Ashkel became the first true city of the First Age. Here, permanence replaced wandering, and history found a place to begin. Some say it was not made, but awakened."
**Priority**: P0

#### TC-006-004: Edge Case - Invalid Verbosity
**Input**:
```typescript
{
  config: { verbosity: "INVALID" },
  template: { text: "Test." }
}
```
**Expected**: Error thrown, invalid verbosity
**Priority**: P0

---

### AC-007: Myth Inclusion

#### TC-007-001: Happy Path - Myth Included
**Input**:
```typescript
{
  config: { mythChance: 1.0 },
  rng: new SeededRandom(42)
}
```
**Expected**: Context includes mythicSeed
**Priority**: P0

#### TC-007-002: Happy Path - Myth Not Included
**Input**:
```typescript
{
  config: { mythChance: 0.0 },
  rng: new SeededRandom(42)
}
```
**Expected**: Context does not include mythicSeed
**Priority**: P0

#### TC-007-003: Edge Case - Partial Myth Chance
**Input**:
```typescript
{
  config: { mythChance: 0.5 },
  rng: new SeededRandom(42)
}
```
**Expected**: Context includes mythicSeed 50% of time (deterministic based on RNG)
**Priority**: P1

#### TC-007-004: Integration - Myth with Template
**Input**:
```typescript
{
  config: { mythChance: 1.0 },
  candidate: { suggestedTemplates: ["settlement_myth"] },
  rng: new SeededRandom(42)
}
```
**Expected**: Myth template used with embellishment
**Priority**: P0

---

### AC-008: Observation Inclusion

#### TC-008-001: Happy Path - Observation Included
**Input**:
```typescript
{
  config: { observationChance: 1.0 },
  candidate: { suggestedTemplates: ["settlement_observation"] }
}
```
**Expected**: Observation template used
**Priority**: P0

#### TC-008-002: Happy Path - Observation Not Included
**Input**:
```typescript
{
  config: { observationChance: 0.0 },
  candidate: { suggestedTemplates: ["settlement_observation"] }
}
```
**Expected**: Observation template not used
**Priority**: P0

#### TC-008-003: Edge Case - Both Myth and Observation
**Input**:
```typescript
{
  config: { mythChance: 0.5, observationChance: 0.5 },
  candidate: { suggestedTemplates: ["settlement_chronicle", "settlement_observation"] }
}
```
**Expected**: Both myth and observation may be included
**Priority**: P1

#### TC-008-004: Integration - Observation with Context
**Input**:
```typescript
{
  config: { observationChance: 1.0 },
  context: { cityName: "Ashkel" }
}
```
**Expected**: Observation template used with context
**Priority**: P0

---

### AC-009: Procedural Table Usage

#### TC-009-001: Happy Path - Roll from Table
**Input**:
```typescript
{
  table: {
    id: "MYTHIC_EMBELLISHMENT_V1",
    entries: ["A", "B", "C"]
  },
  rng: new SeededRandom(42)
}
```
**Expected**: Deterministic entry selected based on seed
**Priority**: P0

#### TC-009-002: Happy Path - Multiple Tables
**Input**:
```typescript
{
  tables: {
    MYTHIC_EMBELLISHMENT: { entries: ["A", "B"] },
    WAR_CAUSE: { entries: ["X", "Y"] }
  },
  rng: new SeededRandom(42)
}
```
**Expected**: Entries selected from each table
**Priority**: P0

#### TC-009-003: Edge Case - Empty Table
**Input**:
```typescript
{
  table: { id: "EMPTY_TABLE", entries: [] },
  rng: new SeededRandom(42)
}
```
**Expected**: Returns empty string
**Priority**: P1

#### TC-009-004: Integration - Table Registration
**Input**:
```typescript
{
  table: { id: "NEW_TABLE", entries: ["X", "Y", "Z"] }
}
```
**Expected**: Table registered for future use
**Priority**: P0

---

### AC-010: Config Update

#### TC-010-001: Happy Path - Update Verbosity
**Input**:
```typescript
{
  currentConfig: { verbosity: "STANDARD" },
  update: { verbosity: "RICH" }
}
```
**Expected**: Config updated, future generations use RICH verbosity
**Priority**: P0

#### TC-010-002: Happy Path - Update Multiple Settings
**Input**:
```typescript
{
  currentConfig: { verbosity: "STANDARD", mythChance: 0.35 },
  update: { verbosity: "RICH", mythChance: 0.5, maxEntriesPerRound: 5 }
}
```
**Expected**: All settings updated
**Priority**: P0

#### TC-010-003: Edge Case - Update Disabled
**Input**:
```typescript
{
  currentConfig: { enabled: true },
  update: { enabled: false }
}
```
**Expected**: Config updated, auto-chronicler disabled
**Priority**: P1

#### TC-010-004: Integration - Update During Generation
**Input**:
```typescript
{
  action: "UPDATE_CONFIG",
  newConfig: { verbosity: "RICH" },
  pendingGenerations: 2
}
```
**Expected**: Config updated, pending generations use new config
**Priority**: P1

---

### AC-011: Provenance Tracking

#### TC-011-001: Happy Path - Auto-Generated Entry
**Input**:
```typescript
{
  entry: { /* generated entry */ },
  tablesUsed: ["MYTHIC_EMBELLISHMENT_V1"]
}
```
**Expected**: Provenance.generatedBy="AUTO", tablesUsed=["MYTHIC_EMBELLISHMENT_V1"], reviewed=false
**Priority**: P0

#### TC-011-002: Happy Path - No Tables Used
**Input**:
```typescript
{
  entry: { /* generated entry */ },
  tablesUsed: undefined
}
```
**Expected**: Provenance.generatedBy="AUTO", tablesUsed=undefined
**Priority**: P0

#### TC-011-003: Edge Case - Guided Entry
**Input**:
```typescript
{
  entry: { /* generated from guided mode */ }
}
```
**Expected**: Provenance.generatedBy="GUIDED"
**Priority**: P1

#### TC-011-004: Integration - Provenance in Entry
**Input**:
```typescript
{
  candidate: { /* candidate */ },
  context: { mythicSeed: ["embellishment"] }
}
```
**Expected**: Entry includes full provenance metadata
**Priority**: P0

---

## Test Data

### Sample AutoChroniclerConfig
```typescript
const SAMPLE_AUTO_CONFIG: AutoChroniclerConfig = {
  enabled: true,
  verbosity: "STANDARD",
  mythChance: 0.35,
  observationChance: 0.25,
  preferredAuthor: "THE_WORLD",
  maxEntriesPerRound: 3,
  useAI: false
};
```

### Sample Verbosity Profiles
```typescript
const VERBOSITY_PROFILES = {
  MINIMAL: {
    sentences: "1-2",
    content: "Chronicle only",
    example: "In the Second Age, Ashkel was founded."
  },
  STANDARD: {
    sentences: "3-5",
    content: "Chronicle + observation",
    example: "Ashkel became the first true city of the Second Age. Here, permanence replaced wandering, and history found a place to begin."
  },
  RICH: {
    sentences: "5+",
    content: "Chronicle + myth + sensory",
    example: "Some say Ashkel was built where the land itself seemed to pause, as if holding its breath for something momentous. Ashkel became the first true city of the Second Age. Here, permanence replaced wandering, and history found a place to begin. The old stories claim it has always been there, waiting."
  }
};
```

### Sample Procedural Tables
```typescript
const MYTHIC_EMBELLISHMENT_TABLE: ProceduralTable = {
  id: "MYTHIC_EMBELLISHMENT_V1",
  name: "Mythic Embellishments",
  version: "1.0.0",
  entries: [
    "Some say it was not made, but awakened.",
    "The old stories claim it has always been there.",
    "Travelers speak of strange lights in its presence.",
    "None who have approached have returned unchanged.",
    "It is said to remember what the world has forgotten."
  ]
};

const WAR_CAUSE_TABLE: ProceduralTable = {
  id: "WAR_CAUSE_V1",
  name: "War Causes",
  version: "1.0.0",
  entries: [
    "an old grievance that refused to fade",
    "a dispute over borders drawn in haste",
    "a betrayal that shattered trust",
    "a claim of right that could not be shared"
  ]
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test AutoChronicler initialization
- Test entry generation for various candidates
- Test context resolution passes
- Test author selection logic
- Test verbosity-specific generation
- Test procedural table usage

### Integration Testing Approach
- Test auto-chronicler with template engine
- Test auto-chronicler with backlog system
- Test config updates during operation
- Test provenance tracking
- Test seeded RNG determinism

### End-to-End Testing Approach
- Test full auto-chronicler generation pipeline
- Test auto-processing with backlog
- Test regeneration with same seed
- Test multiple verbosity levels
- Test config update scenarios

### Performance Testing Approach
- Test entry generation throughput
- Test context resolution performance
- Test procedural table lookup performance
- Test batch generation performance

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── auto/
│   │   ├── AutoChronicler.test.ts
│   │   ├── EntryGeneration.test.ts
│   │   ├── ContextResolution.test.ts
│   │   ├── AuthorSelection.test.ts
│   │   ├── VerbosityGeneration.test.ts
│   │   ├── ProceduralTables.test.ts
│   │   └── ConfigUpdate.test.ts
├── integration/
│   ├── auto/
│   │   ├── TemplateEngineIntegration.test.ts
│   │   ├── BacklogIntegration.test.ts
│   │   ├── ProvenanceTracking.test.ts
│   │   └── SeededRNG.test.ts
└── e2e/
    ├── auto/
    │   ├── FullGenerationPipeline.test.ts
    │   ├── VerbosityScenarios.test.ts
    │   └── Regeneration.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by auto-chronicler feature for unit tests
- Group by integration feature for integration tests
- Group by generation scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases
