# TDD: Chronicler Template Engine

## Specification Reference
- Spec: [`022-chronicler-template-engine.md`](../specs/022-chronicler-template-engine.md)
- Version: 1.0.0

---

## Acceptance Criteria

### AC-001: Template Registration
**Given** a LoreTemplate is defined
**When** template is registered
**Then** template must be stored and available for generation

### AC-002: Template Retrieval
**Given** a template ID is requested
**When** template exists
**Then** template must be returned with all fields

### AC-003: Template Deprecation Handling
**Given** a deprecated template is requested
**When** template has replacement
**Then** replacement template must be used instead

### AC-004: Context Validation
**Given** a template is used for generation
**When** required context is missing
**Then** error must be thrown or fallback to defaults

### AC-005: Title Generation
**Given** a template and context
**When** title is generated
**Then** title must be a valid string with placeholders resolved

### AC-006: Text Generation
**Given** a template and context
**When** text is generated
**Then** text must be a valid string with placeholders resolved

### AC-007: Author Selection
**Given** a template and context
**When** author is selected
**Then** author must be valid Author type

### AC-008: Placeholder Substitution
**Given** a template with placeholders
**When** context is provided
**Then** all placeholders must be replaced with context values

### AC-009: Built-in Function Application
**Given** a template with built-in functions
**When** template is rendered
**Then** functions must be applied correctly to context values

### AC-010: Conditional Block Evaluation
**Given** a template with conditional blocks
**When** template is rendered
**Then** conditionals must be evaluated and appropriate blocks rendered

### AC-011: Context Resolution Pipeline
**Given** an event and world state
**When** context is being built
**Then** all four passes must complete successfully

### AC-012: Procedural Table Usage
**Given** a template references procedural tables
**When** generation occurs
**Then** table entries must be selected using seeded RNG

### AC-013: Seeded Random Number Generation
**Given** a seed value
**When** random numbers are generated
**Then** same seed must produce same sequence

---

## Test Cases

### AC-001: Template Registration

#### TC-001-001: Happy Path - Register Valid Template
**Input**:
```typescript
{
  id: "test_template",
  version: "1.0.0",
  trigger: "TEST_EVENT",
  entryType: "CHRONICLE",
  scope: "GLOBAL",
  title: "Test Title",
  text: "Test text.",
  author: "THE_WORLD",
  requiredContext: [],
  optionalContext: [],
  enabled: true
}
```
**Expected**: Template registered successfully
**Priority**: P0

#### TC-001-002: Happy Path - Register Multiple Templates
**Input**:
```typescript
[
  { id: "template_1", ... },
  { id: "template_2", ... },
  { id: "template_3", ... }
]
```
**Expected**: All templates registered successfully
**Priority**: P0

#### TC-001-003: Edge Case - Register Duplicate Template ID
**Input**:
```typescript
{
  id: "duplicate_template",
  // ... fields
}
```
**Expected**: Error thrown or existing template replaced
**Priority**: P1

#### TC-001-004: Error Case - Invalid Template Structure
**Input**:
```typescript
{
  id: "invalid_template",
  // Missing required fields
}
```
**Expected**: Validation error thrown
**Priority**: P0

---

### AC-002: Template Retrieval

#### TC-002-001: Happy Path - Retrieve Existing Template
**Input**: templateId = "test_template"
**Expected**: Template returned with all fields
**Priority**: P0

#### TC-002-002: Edge Case - Retrieve Non-Existent Template
**Input**: templateId = "non_existent_template"
**Expected**: Returns undefined or throws error
**Priority**: P1

#### TC-002-003: Integration - Retrieve Template for Generation
**Input**:
```typescript
{
  templateId: "settlement_founding_chronicle",
  context: { cityName: "Ashkel", age: 1 }
}
```
**Expected**: Template retrieved and used for generation
**Priority**: P0

---

### AC-003: Template Deprecation Handling

#### TC-003-001: Happy Path - Use Replacement Template
**Input**:
```typescript
{
  oldTemplate: {
    id: "old_template",
    deprecated: true,
    supersededBy: "new_template"
  },
  newTemplate: {
    id: "new_template",
    deprecated: false
  }
}
```
**Expected**: new_template used, warning logged
**Priority**: P0

#### TC-003-002: Edge Case - Deprecated Template Without Replacement
**Input**:
```typescript
{
  template: {
    id: "deprecated_no_replacement",
    deprecated: true,
    supersededBy: undefined
  }
}
```
**Expected**: Error thrown, no replacement available
**Priority**: P1

#### TC-003-003: Integration - Version Migration
**Input**:
```typescript
{
  templateId: "old_template",
  context: {}
}
```
**Expected**: new_template used, migration logged
**Priority**: P1

---

### AC-004: Context Validation

#### TC-004-001: Happy Path - All Required Context Present
**Input**:
```typescript
{
  template: { requiredContext: ["cityName", "age"] },
  context: { cityName: "Ashkel", age: 1 }
}
```
**Expected**: Validation passes
**Priority**: P0

#### TC-004-002: Error Case - Missing Required Context
**Input**:
```typescript
{
  template: { requiredContext: ["cityName", "age"] },
  context: { cityName: "Ashkel" } // age missing
}
```
**Expected**: Error thrown or fallback used
**Priority**: P0

#### TC-004-003: Edge Case - Optional Context Missing
**Input**:
```typescript
{
  template: {
    requiredContext: ["cityName"],
    optionalContext: ["raceName"]
  },
  context: { cityName: "Ashkel" } // raceName missing
}
```
**Expected**: Validation passes, raceName undefined in output
**Priority**: P1

#### TC-004-004: Integration - Context with Custom Fields
**Input**:
```typescript
{
  template: {
    requiredContext: ["cityName"],
    optionalContext: []
  },
  context: {
    cityName: "Ashkel",
    custom: { customField: "value" }
  }
}
```
**Expected**: Validation passes, custom field preserved
**Priority**: P2

---

### AC-005: Title Generation

#### TC-005-001: Happy Path - Static Title
**Input**:
```typescript
{
  template: { title: "The Founding of Ashkel" },
  context: {}
}
```
**Expected**: Title = "The Founding of Ashkel"
**Priority**: P0

#### TC-005-002: Happy Path - Template String Title
**Input**:
```typescript
{
  template: {
    title: {
      type: "TEMPLATE",
      pattern: "The Founding of {{cityName}}"
    }
  },
  context: { cityName: "Ashkel" }
}
```
**Expected**: Title = "The Founding of Ashkel"
**Priority**: P0

#### TC-005-003: Happy Path - Function Title
**Input**:
```typescript
{
  template: {
    title: (ctx) => `The Founding of ${ctx.cityName}`
  },
  context: { cityName: "Ashkel" }
}
```
**Expected**: Title = "The Founding of Ashkel"
**Priority**: P0

#### TC-005-004: Edge Case - Title with Missing Context
**Input**:
```typescript
{
  template: {
    title: {
      type: "TEMPLATE",
      pattern: "The Founding of {{cityName}}"
    }
  },
  context: {} // cityName missing
}
```
**Expected**: Title contains placeholder or error thrown
**Priority**: P1

---

### AC-006: Text Generation

#### TC-006-001: Happy Path - Static Text
**Input**:
```typescript
{
  template: { text: "Ashkel was founded." },
  context: {}
}
```
**Expected**: Text = "Ashkel was founded."
**Priority**: P0

#### TC-006-002: Happy Path - Template String Text
**Input**:
```typescript
{
  template: {
    text: {
      type: "TEMPLATE",
      pattern: "{{cityName}} became the first city of the {{ordinal age}} Age."
    }
  },
  context: { cityName: "Ashkel", age: 1 }
}
```
**Expected**: Text = "Ashkel became the first city of the 1st Age."
**Priority**: P0

#### TC-006-003: Happy Path - Function Text
**Input**:
```typescript
{
  template: {
    text: (ctx) => `${ctx.cityName} was founded in the ${ctx.age} Age.`
  },
  context: { cityName: "Ashkel", age: 1 }
}
```
**Expected**: Text = "Ashkel was founded in the 1 Age."
**Priority**: P0

#### TC-006-004: Edge Case - Text with Multiple Placeholders
**Input**:
```typescript
{
  template: {
    text: {
      type: "TEMPLATE",
      pattern: "{{cityName}} ({{raceName}}) in {{ordinal age}} Age"
    }
  },
  context: { cityName: "Ashkel", age: 1 } // raceName missing
}
```
**Expected**: Text = "Ashkel () in the 1st Age"
**Priority**: P1

---

### AC-007: Author Selection

#### TC-007-001: Happy Path - Fixed Author
**Input**:
```typescript
{
  template: { author: "THE_WORLD" },
  context: {}
}
```
**Expected**: Author = "THE_WORLD"
**Priority**: P0

#### TC-007-002: Happy Path - Author Function
**Input**:
```typescript
{
  template: {
    author: (ctx) => ctx.age <= 2 ? "THE_WORLD" : "UNKNOWN"
  },
  context: { age: 1 }
}
```
**Expected**: Author = "THE_WORLD"
**Priority**: P0

#### TC-007-003: Edge Case - Culture ID Author
**Input**:
```typescript
{
  template: {
    author: (ctx) => ctx.cultureName || "THE_WORLD"
  },
  context: { cultureName: "KARTHI" }
}
```
**Expected**: Author = "KARTHI"
**Priority**: P1

---

### AC-008: Placeholder Substitution

#### TC-008-001: Happy Path - Single Placeholder
**Input**:
```typescript
{
  pattern: "The Founding of {{cityName}}",
  context: { cityName: "Ashkel" }
}
```
**Expected**: Result = "The Founding of Ashkel"
**Priority**: P0

#### TC-008-002: Happy Path - Multiple Placeholders
**Input**:
```typescript
{
  pattern: "{{cityName}} ({{raceName}}) in Age {{age}}",
  context: { cityName: "Ashkel", raceName: "Karthi", age: 1 }
}
```
**Expected**: Result = "Ashkel (Karthi) in Age 1"
**Priority**: P0

#### TC-008-003: Edge Case - Placeholder Not in Context
**Input**:
```typescript
{
  pattern: "The Founding of {{cityName}} in {{ordinal age}} Age",
  context: { cityName: "Ashkel" } // age missing
}
```
**Expected**: Result = "The Founding of Ashkel in {{ordinal age}} Age"
**Priority**: P1

#### TC-008-004: Error Case - Malformed Placeholder
**Input**:
```typescript
{
  pattern: "The Founding of {{cityName",
  context: { cityName: "Ashkel" }
}
```
**Expected**: Error thrown, malformed placeholder
**Priority**: P0

---

### AC-009: Built-in Function Application

#### TC-009-001: Happy Path - Ordinal Function
**Input**:
```typescript
{
  pattern: "{{ordinal age}}",
  context: { age: 1 }
}
```
**Expected**: Result = "1st"
**Priority**: P0

#### TC-009-002: Happy Path - Lower Function
**Input**:
```typescript
{
  pattern: "{{lower cityName}}",
  context: { cityName: "Ashkel" }
}
```
**Expected**: Result = "ashkel"
**Priority**: P0

#### TC-009-003: Happy Path - Upper Function
**Input**:
```typescript
{
  pattern: "{{upper raceName}}",
  context: { raceName: "Karthi" }
}
```
**Expected**: Result = "KARTHI"
**Priority**: P0

#### TC-009-004: Happy Path - Title Function
**Input**:
```typescript
{
  pattern: "{{title cityName}}",
  context: { cityName: "ashkel" }
}
```
**Expected**: Result = "Ashkel"
**Priority**: P0

#### TC-009-005: Edge Case - Function with Missing Context
**Input**:
```typescript
{
  pattern: "{{ordinal age}}",
  context: {} // age missing
}
```
**Expected**: Result = "{{ordinal age}}" or error thrown
**Priority**: P1

---

### AC-010: Conditional Block Evaluation

#### TC-010-001: Happy Path - True Condition
**Input**:
```typescript
{
  pattern: "{{#if isFirstCity}}The first true city{{else}}A new city{{/if}} was founded.",
  context: { isFirstCity: true }
}
```
**Expected**: Result = "The first true city was founded."
**Priority**: P0

#### TC-010-002: Happy Path - False Condition
**Input**:
```typescript
{
  pattern: "{{#if isFirstCity}}The first true city{{else}}A new city{{/if}} was founded.",
  context: { isFirstCity: false }
}
```
**Expected**: Result = "A new city was founded."
**Priority**: P0

#### TC-010-003: Happy Path - Condition with Operator
**Input**:
```typescript
{
  pattern: "{{#if age GT 1}}Later age{{else}}First age{{/if}}",
  context: { age: 2 }
}
```
**Expected**: Result = "Later age"
**Priority**: P0

#### TC-010-004: Edge Case - Nested Conditionals
**Input**:
```typescript
{
  pattern: "{{#if isFirstCity}}{{#if isCapital}}First capital city{{else}}First city{{/if}}{{else}}New city{{/if}}",
  context: { isFirstCity: true, isCapital: true }
}
```
**Expected**: Result = "First capital city"
**Priority**: P1

---

### AC-011: Context Resolution Pipeline

#### TC-011-001: Happy Path - Full Pipeline
**Input**:
```typescript
{
  event: { name: "SETTLEMENT_FOUND", payload: { cityId: "city_ashkel" } },
  state: {
    currentAge: 1,
    worldObjects: {
      city_ashkel: { name: "Ashkel", kind: "SETTLEMENT", isCity: true }
    }
  }
}
```
**Expected**: Context contains age=1, cityName="Ashkel", isFirstCity=true
**Priority**: P0

#### TC-011-002: Happy Path - Pass 1 - Canonical Facts
**Input**:
```typescript
{
  event: { name: "TEST_EVENT", payload: {} },
  state: { currentAge: 1 }
}
```
**Expected**: Context contains age=1, eventName="TEST_EVENT"
**Priority**: P0

#### TC-011-003: Happy Path - Pass 2 - Default Semantics
**Input**:
```typescript
{
  context: { age: 1, eventName: "TEST" }
}
```
**Expected**: Context includes foundingMotive="necessity", warCause="old grievance", tone="neutral"
**Priority**: P0

#### TC-011-004: Happy Path - Pass 3 - Procedural Tables
**Input**:
```typescript
{
  context: { age: 1, cityName: "Ashkel" },
  config: { mythChance: 0.35 },
  rng: new SeededRandom(42)
}
```
**Expected**: Context may include mythicSeed based on RNG
**Priority**: P0

#### TC-011-005: Integration - All Passes Complete
**Input**:
```typescript
{
  event: { name: "SETTLEMENT_FOUND", payload: { cityId: "city_ashkel" } },
  state: {
    currentAge: 1,
    worldObjects: {
      city_ashkel: { name: "Ashkel", kind: "SETTLEMENT", isCity: true }
    }
  },
  config: { mythChance: 0.35 },
  rng: new SeededRandom(42)
}
```
**Expected**: Complete context with all passes applied
**Priority**: P0

---

### AC-012: Procedural Table Usage

#### TC-012-001: Happy Path - Roll from Table
**Input**:
```typescript
{
  table: {
    id: "MYTHIC_EMBELLISHMENT_V1",
    name: "Mythic Embellishments",
    entries: [
      "Some say it was not made, but awakened.",
      "The old stories claim it has always been there."
    ]
  },
  rng: new SeededRandom(42)
}
```
**Expected**: Entry selected deterministically based on seed
**Priority**: P0

#### TC-012-002: Happy Path - Multiple Tables
**Input**:
```typescript
{
  tables: {
    MYTHIC_EMBELLISHMENT: { entries: ["A", "B", "C"] },
    WAR_CAUSE: { entries: ["X", "Y", "Z"] }
  },
  rng: new SeededRandom(42)
}
```
**Expected**: Entries selected from each table deterministically
**Priority**: P0

#### TC-012-003: Edge Case - Empty Table
**Input**:
```typescript
{
  table: {
    id: "EMPTY_TABLE",
    entries: []
  },
  rng: new SeededRandom(42)
}
```
**Expected**: Returns empty string or throws error
**Priority**: P1

---

### AC-013: Seeded Random Number Generation

#### TC-013-001: Happy Path - Same Seed Same Result
**Input**:
```typescript
{
  seed: 42,
  calls: [1, 2, 3]
}
```
**Expected**: Same sequence for same seed
**Priority**: P0

#### TC-013-002: Happy Path - Different Seed Different Result
**Input**:
```typescript
{
  seed1: 42,
  seed2: 43
}
```
**Expected**: Different sequences for different seeds
**Priority**: P0

#### TC-013-003: Edge Case - Zero Seed
**Input**:
```typescript
{
  seed: 0
}
```
**Expected**: Valid deterministic sequence
**Priority**: P1

#### TC-013-004: Integration - Seeded Context Generation
**Input**:
```typescript
{
  seed: 42,
  config: { mythChance: 0.5 }
}
```
**Expected**: Same mythicSeed for same seed
**Priority**: P0

---

## Test Data

### Sample LoreTemplate
```typescript
const SAMPLE_LORE_TEMPLATE: LoreTemplate = {
  id: "settlement_founding_chronicle",
  version: "1.0.0",
  trigger: "SETTLEMENT_FOUND",
  entryType: "CHRONICLE",
  scope: "REGIONAL",
  title: (ctx) => `The Founding of ${ctx.cityName}`,
  text: "{{#if isFirstCity}}{{cityName}} became the first true city of the {{ordinal age}} Age.{{else}}{{cityName}} was founded.{{/if}}",
  author: "IMPERIAL_SCRIBE",
  requiredContext: ["cityName", "age"],
  optionalContext: ["isFirstCity", "raceName"],
  canGenerateMyths: true,
  canGenerateObservations: true,
  tablesUsed: ["FOUNDING_MOTIVE_V1"],
  enabled: true
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

### Sample Context
```typescript
const SAMPLE_LORE_CONTEXT: LoreContext = {
  age: 1,
  eventName: "SETTLEMENT_FOUND",
  eventPayload: { cityId: "city_ashkel" },
  terrainName: "Plains",
  cityName: "Ashkel",
  raceName: "Karthi",
  nationName: "Velor",
  capitalName: "Ashkel",
  isFirstCity: true,
  isFirstWar: false,
  isRegional: true,
  isGlobal: false,
  thresholdReached: "first_city",
  mythicSeed: ["Some say it was not made, but awakened."],
  tone: "neutral"
};
```

---

## Testing Strategy

### Unit Testing Approach
- Test template registration and retrieval
- Test placeholder substitution
- Test built-in function application
- Test conditional block evaluation
- Test context resolution passes
- Test seeded RNG generation

### Integration Testing Approach
- Test full template generation pipeline
- Test template deprecation handling
- Test procedural table integration
- Test context building from events
- Test multi-pass context resolution

### End-to-End Testing Approach
- Test event → context → template → entry flow
- Test regeneration with same seed
- Test template replacement on deprecation
- Test full context resolution pipeline

### Performance Testing Approach
- Test template generation throughput
- Test placeholder substitution performance
- Test seeded RNG performance
- Test context resolution with large state

---

## Test Organization

### File Structure
```
tests/
├── unit/
│   ├── template/
│   │   ├── TemplateEngine.test.ts
│   │   ├── TemplateRegistration.test.ts
│   │   ├── PlaceholderSubstitution.test.ts
│   │   ├── BuiltInFunctions.test.ts
│   │   ├── ConditionalBlocks.test.ts
│   │   └── ContextBuilder.test.ts
├── integration/
│   ├── template/
│   │   ├── TemplateGeneration.test.ts
│   │   ├── ContextResolution.test.ts
│   │   ├── ProceduralTables.test.ts
│   │   └── TemplateDeprecation.test.ts
└── e2e/
    ├── template/
    │   ├── FullGenerationPipeline.test.ts
    │   ├── SeededGeneration.test.ts
    │   └── TemplateReplacement.test.ts
```

### Naming Conventions
- Unit tests: `{TypeName}.test.ts`
- Integration tests: `{FeatureName}.test.ts`
- E2E tests: `{ScenarioName}.test.ts`
- Test files: `*.test.ts`
- Test utilities: `*.test-utils.ts`

### Test Grouping Strategy
- Group by template feature for unit tests
- Group by generation pipeline for integration tests
- Group by generation scenario for E2E tests
- Use `describe` blocks for logical grouping
- Use `test` for individual test cases
