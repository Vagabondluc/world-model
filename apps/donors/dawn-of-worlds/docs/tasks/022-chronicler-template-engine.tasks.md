# Task List: Chronicler Template Engine

**TDD Reference:** [022-chronicler-template-engine.tdd.md](../tdd/022-chronicler-template-engine.tdd.md)

---

## Phase 1: Template Types

### Task 1.1: Create PlaceholderToken Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-006 (Placeholder substitution)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/types.ts`
2. Define `PlaceholderToken` interface with fields:
   - `name: string`
   - `type: PlaceholderType`
   - `defaultValue?: string`
3. Define `PlaceholderType` enum: `STRING`, `NUMBER`, `BOOLEAN`, `ARRAY`, `OBJECT`
4. Export types
**Test Mapping:** TC-006-001, TC-006-002 (Placeholder token tests)

### Task 1.2: Create TemplateFunction Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-008 (Built-in functions)
**Implementation Steps:**
1. In `logic/chronicler/templates/types.ts`, define `TemplateFunction` interface:
   - `name: string`
   - `arity: number`
   - `handler: (...args: unknown[]) => string`
2. Export type
**Test Mapping:** TC-008-001, TC-008-002 (Template function tests)

### Task 1.3: Create ConditionalBlock Type
**Priority:** P1
**Dependencies:** None
**Acceptance Criteria:** AC-009 (Conditional blocks)
**Implementation Steps:**
1. In `logic/chronicler/templates/types.ts`, define `ConditionalBlock` interface with fields:
   - `condition: string`
   - `content: string`
   - `elseContent?: string`
2. Export type
**Test Mapping:** TC-009-001, TC-009-002 (Conditional block tests)

### Task 1.4: Create ProceduralTable Type
**Priority:** P2
**Dependencies:** None
**Acceptance Criteria:** AC-011 (Procedural tables)
**Implementation Steps:**
1. In `logic/chronicler/templates/types.ts`, define `ProceduralTable` interface with fields:
   - `name: string`
   - `entries: ProceduralTableEntry[]`
2. Define `ProceduralTableEntry` interface with fields:
   - `weight: number`
   - `value: string`
3. Export types
**Test Mapping:** TC-011-001, TC-011-002 (Procedural table tests)

---

## Phase 2: Template Registry

### Task 2.1: Create TemplateRegistry Class
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (Template registration)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/registry.ts`
2. Implement `TemplateRegistry` class with Map storage
3. Add `register(template: LoreTemplate): void` method
4. Add `get(id: string): LoreTemplate | undefined` method
5. Add `getAll(): LoreTemplate[]` method
6. Add `getByEntryType(entryType: EntryType): LoreTemplate[]` method
7. Export registry class
**Test Mapping:** TC-001-001, TC-001-002 (Registration tests)

### Task 2.2: Create TemplateRegistry Instance
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Global template registry)
**Implementation Steps:**
1. In `logic/chronicler/templates/registry.ts`, create singleton instance `templateRegistry`
2. Export singleton for application-wide use
**Test Mapping:** TC-001-001 (Singleton test)

---

## Phase 3: Template Retrieval

### Task 3.1: Create TemplateRetriever
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Template retrieval)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/retriever.ts`
2. Implement `retrieveTemplate(id: string): LoreTemplate | undefined` function
3. Query registry by ID
4. Return template or undefined
5. Export retriever function
**Test Mapping:** TC-002-001, TC-002-002 (Retrieval tests)

### Task 3.2: Create TemplateRetriever by EntryType
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Template retrieval by type)
**Implementation Steps:**
1. In `logic/chronicler/templates/retriever.ts`, implement `retrieveTemplatesByType(entryType: EntryType): LoreTemplate[]` function
2. Query registry by entry type
3. Return array of templates
4. Export retriever function
**Test Mapping:** TC-002-003, TC-002-004 (Retrieval by type tests)

---

## Phase 4: Template Deprecation

### Task 4.1: Create TemplateDeprecationHandler
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-003 (Template deprecation)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/deprecation.ts`
2. Implement `deprecateTemplate(id: string): boolean` function
3. Set template `deprecated: true`
4. Return success status
5. Export deprecation function
**Test Mapping:** TC-003-001, TC-003-002 (Deprecation tests)

### Task 4.2: Filter Deprecated Templates from Retrieval
**Priority:** P1
**Dependencies:** Task 3.1, Task 4.1
**Acceptance Criteria:** AC-003 (Deprecated template exclusion)
**Implementation Steps:**
1. Modify `retrieveTemplate()` to warn on deprecated template
2. Modify `retrieveTemplatesByType()` to filter out deprecated templates
3. Log deprecation warnings
**Test Mapping:** TC-003-003, TC-003-004 (Deprecation filtering tests)

---

## Phase 5: Context Validation

### Task 5.1: Create ContextValidator
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-004 (Context validation)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/validator.ts`
2. Implement `validateContext(template: LoreTemplate, context: LoreContext): ValidationResult` function
3. Check all placeholders have values in context
4. Return validation result with errors array
5. Export validator function
**Test Mapping:** TC-004-001, TC-004-002 (Validation tests)

### Task 5.2: Create ValidationResult Type
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-004 (Validation result)
**Implementation Steps:**
1. In `logic/chronicler/templates/types.ts`, define `ValidationResult` interface with fields:
   - `valid: boolean`
   - `errors: ValidationError[]`
2. Define `ValidationError` interface with fields:
   - `placeholder: string`
   - `message: string`
3. Export types
**Test Mapping:** TC-004-001, TC-004-002 (Validation result tests)

---

## Phase 6: Template Generation

### Task 6.1: Create TitleGenerator
**Priority:** P0
**Dependencies:** Task 1.1, Task 5.1
**Acceptance Criteria:** AC-005 (Title generation)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/generator.ts`
2. Implement `generateTitle(template: LoreTemplate, context: LoreContext): string` function
3. Parse title template for placeholders
4. Substitute placeholder values from context
5. Return generated title
6. Export generator function
**Test Mapping:** TC-005-001, TC-005-002 (Title generation tests)

### Task 6.2: Create TextGenerator
**Priority:** P0
**Dependencies:** Task 1.1, Task 5.1
**Acceptance Criteria:** AC-005 (Text generation)
**Implementation Steps:**
1. In `logic/chronicler/templates/generator.ts`, implement `generateText(template: LoreTemplate, context: LoreContext): string` function
2. Parse text template for placeholders
3. Substitute placeholder values from context
4. Return generated text
5. Export generator function
**Test Mapping:** TC-005-003, TC-005-004 (Text generation tests)

### Task 6.3: Create AuthorGenerator
**Priority:** P0
**Dependencies:** Task 1.1, Task 5.1
**Acceptance Criteria:** AC-005 (Author generation)
**Implementation Steps:**
1. In `logic/chronicler/templates/generator.ts`, implement `generateAuthor(template: LoreTemplate, context: LoreContext): Author` function
2. Parse author template for placeholders
3. Substitute placeholder values from context
4. Return generated author
5. Export generator function
**Test Mapping:** TC-005-005, TC-005-006 (Author generation tests)

---

## Phase 7: Placeholder Substitution

### Task 7.1: Create PlaceholderParser
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-006 (Placeholder substitution)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/parser.ts`
2. Implement `parsePlaceholders(template: string): PlaceholderToken[]` function
3. Use regex to find placeholder patterns `{{placeholderName}}`
4. Return array of placeholder tokens
5. Export parser function
**Test Mapping:** TC-006-001, TC-006-002 (Parsing tests)

### Task 7.2: Create PlaceholderSubstitutor
**Priority:** P0
**Dependencies:** Task 1.1, Task 7.1
**Acceptance Criteria:** AC-006 (Placeholder substitution)
**Implementation Steps:**
1. In `logic/chronicler/templates/substitutor.ts`, implement `substitutePlaceholders(template: string, context: Record<string, unknown>): string` function
2. Parse placeholders from template
3. Replace each placeholder with context value
4. Use default value if context value missing
5. Return substituted string
6. Export substitutor function
**Test Mapping:** TC-006-003, TC-006-004 (Substitution tests)

---

## Phase 8: Built-in Functions

### Task 8.1: Create BuiltInFunctionRegistry
**Priority:** P0
**Dependencies:** Task 1.2
**Acceptance Criteria:** AC-008 (Built-in functions)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/functions.ts`
2. Implement `BuiltInFunctionRegistry` class with Map storage
3. Add `register(name: string, handler: TemplateFunction): void` method
4. Add `get(name: string): TemplateFunction | undefined` method
5. Export registry class
**Test Mapping:** TC-008-001, TC-008-002 (Registry tests)

### Task 8.2: Implement capitalize Function
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-008 (Built-in capitalize function)
**Implementation Steps:**
1. In `logic/chronicler/templates/functions.ts`, implement `capitalize(text: string): string` function
2. Capitalize first letter of input
3. Return result
4. Register function in registry
**Test Mapping:** TC-008-003, TC-008-004 (Capitalize tests)

### Task 8.3: Implement lowercase Function
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-008 (Built-in lowercase function)
**Implementation Steps:**
1. In `logic/chronicler/templates/functions.ts`, implement `lowercase(text: string): string` function
2. Convert input to lowercase
3. Return result
4. Register function in registry
**Test Mapping:** TC-008-005, TC-008-006 (Lowercase tests)

### Task 8.4: Implement uppercase Function
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-008 (Built-in uppercase function)
**Implementation Steps:**
1. In `logic/chronicler/templates/functions.ts`, implement `uppercase(text: string): string` function
2. Convert input to uppercase
3. Return result
4. Register function in registry
**Test Mapping:** TC-008-007, TC-008-008 (Uppercase tests)

### Task 8.5: Implement plural Function
**Priority:** P0
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-008 (Built-in plural function)
**Implementation Steps:**
1. In `logic/chronicler/templates/functions.ts`, implement `plural(word: string, count: number): string` function
2. Return plural form if count != 1
3. Return singular form if count == 1
4. Register function in registry
**Test Mapping:** TC-008-009, TC-008-010 (Plural tests)

### Task 8.6: Implement random Function
**Priority:** P1
**Dependencies:** Task 8.1
**Acceptance Criteria:** AC-008 (Built-in random function)
**Implementation Steps:**
1. In `logic/chronicler/templates/functions.ts`, implement `random(...options: string[]): string` function
2. Return random element from options
3. Register function in registry
**Test Mapping:** TC-008-011, TC-008-012 (Random tests)

---

## Phase 9: Conditional Blocks

### Task 9.1: Create ConditionalBlockParser
**Priority:** P1
**Dependencies:** Task 1.3
**Acceptance Criteria:** AC-009 (Conditional blocks)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/conditional.ts`
2. Implement `parseConditionalBlocks(template: string): ConditionalBlock[]` function
3. Parse `{{if condition}}...{{endif}}` patterns
4. Parse `{{if condition}}...{{else}}...{{endif}}` patterns
5. Return array of conditional blocks
6. Export parser function
**Test Mapping:** TC-009-001, TC-009-002 (Parsing tests)

### Task 9.2: Create ConditionalBlockEvaluator
**Priority:** P1
**Dependencies:** Task 1.3, Task 9.1
**Acceptance Criteria:** AC-009 (Conditional block evaluation)
**Implementation Steps:**
1. In `logic/chronicler/templates/conditional.ts`, implement `evaluateConditionalBlocks(template: string, context: Record<string, unknown>): string` function
2. Parse conditional blocks from template
3. Evaluate each condition against context
4. Replace block with appropriate content
5. Return processed template
6. Export evaluator function
**Test Mapping:** TC-009-003, TC-009-004 (Evaluation tests)

---

## Phase 10: Context Resolution Pipeline

### Task 10.1: Create ContextResolverPipeline
**Priority:** P0
**Dependencies:** Task 5.1, Task 7.2
**Acceptance Criteria:** AC-010 (Context resolution pipeline)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/resolver.ts`
2. Implement `resolveContext(template: LoreTemplate, rawContext: Record<string, unknown>): LoreContext` function
3. Validate context against template placeholders
4. Apply default values for missing placeholders
5. Return resolved context
6. Export resolver function
**Test Mapping:** TC-010-001, TC-010-002 (Resolution tests)

### Task 10.2: Create ContextResolver with Built-in Functions
**Priority:** P0
**Dependencies:** Task 8.6, Task 10.1
**Acceptance Criteria:** AC-010 (Context resolution with functions)
**Implementation Steps:**
1. Modify `resolveContext()` to evaluate built-in function calls
2. Parse function call patterns `{{functionName(arg1, arg2)}}`
3. Execute functions and substitute results
4. Return resolved context
**Test Mapping:** TC-010-003, TC-010-004 (Function resolution tests)

---

## Phase 11: Procedural Tables

### Task 11.1: Create ProceduralTableRegistry
**Priority:** P2
**Dependencies:** Task 1.4
**Acceptance Criteria:** AC-011 (Procedural tables)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/tables.ts`
2. Implement `ProceduralTableRegistry` class with Map storage
3. Add `register(table: ProceduralTable): void` method
4. Add `get(name: string): ProceduralTable | undefined` method
5. Export registry class
**Test Mapping:** TC-011-001, TC-011-002 (Registry tests)

### Task 11.2: Create ProceduralTableSelector
**Priority:** P2
**Dependencies:** Task 11.1
**Acceptance Criteria:** AC-011 (Procedural table selection)
**Implementation Steps:**
1. In `logic/chronicler/templates/tables.ts`, implement `selectFromTable(tableName: string): string` function
2. Get table from registry
3. Select entry based on weighted random
4. Return selected value
5. Export selector function
**Test Mapping:** TC-011-003, TC-011-004 (Selection tests)

---

## Phase 12: Seeded RNG

### Task 12.1: Create SeededRNG Class
**Priority:** P2
**Dependencies:** None
**Acceptance Criteria:** AC-012 (Seeded RNG)
**Implementation Steps:**
1. Create file `logic/chronicler/templates/rng.ts`
2. Implement `SeededRNG` class with seed-based random number generation
3. Add `next(): number` method for deterministic random
4. Add `nextInt(min: number, max: number): number` method
5. Add `nextFloat(): number` method
6. Add `reset(): void` method to reset to initial seed
7. Export RNG class
**Test Mapping:** TC-012-001, TC-012-002 (RNG tests)

### Task 12.2: Create SeededRNGManager
**Priority:** P2
**Dependencies:** Task 12.1
**Acceptance Criteria:** AC-012 (Seeded RNG management)
**Implementation Steps:**
1. In `logic/chronicler/templates/rng.ts`, implement `SeededRNGManager` class
2. Add `getRNG(seed: string): SeededRNG` method with caching
3. Add `clearCache(): void` method
4. Export manager class
**Test Mapping:** TC-012-003, TC-012-004 (Manager tests)

### Task 12.3: Integrate Seeded RNG with Template Generation
**Priority:** P2
**Dependencies:** Task 6.1, Task 6.2, Task 12.2
**Acceptance Criteria:** AC-012 (Seeded RNG integration)
**Implementation Steps:**
1. Modify `generateTitle()` to accept optional seed parameter
2. Modify `generateText()` to accept optional seed parameter
3. Use seeded RNG when seed provided
4. Ensure deterministic output for same seed
**Test Mapping:** TC-012-005, TC-012-006 (Integration tests)

---

## Phase 13: Test Files

### Task 13.1: Create TemplateRegistry Tests
**Priority:** P0
**Dependencies:** Task 2.2
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/registry.test.ts`
2. Write tests for template registration
3. Write tests for template retrieval
4. Write tests for template retrieval by entry type
**Test Mapping:** TC-001-001, TC-001-002

### Task 13.2: Create TemplateRetriever Tests
**Priority:** P0
**Dependencies:** Task 3.2
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/retriever.test.ts`
2. Write tests for template retrieval by ID
3. Write tests for template retrieval by type
4. Write tests for missing template handling
**Test Mapping:** TC-002-001, TC-002-002

### Task 13.3: Create TemplateDeprecation Tests
**Priority:** P1
**Dependencies:** Task 4.2
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/deprecation.test.ts`
2. Write tests for template deprecation
3. Write tests for deprecated template filtering
4. Write tests for deprecation warnings
**Test Mapping:** TC-003-001, TC-003-002

### Task 13.4: Create ContextValidation Tests
**Priority:** P0
**Dependencies:** Task 5.2
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/validator.test.ts`
2. Write tests for valid context
3. Write tests for missing placeholder
4. Write tests for multiple validation errors
**Test Mapping:** TC-004-001, TC-004-002

### Task 13.5: Create TemplateGeneration Tests
**Priority:** P0
**Dependencies:** Task 6.3
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/generator.test.ts`
2. Write tests for title generation
3. Write tests for text generation
4. Write tests for author generation
**Test Mapping:** TC-005-001, TC-005-002

### Task 13.6: Create PlaceholderSubstitution Tests
**Priority:** P0
**Dependencies:** Task 7.2
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/substitutor.test.ts`
2. Write tests for placeholder parsing
3. Write tests for placeholder substitution
4. Write tests for default value substitution
**Test Mapping:** TC-006-001, TC-006-002

### Task 13.7: Create BuiltInFunction Tests
**Priority:** P0
**Dependencies:** Task 8.6
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/functions.test.ts`
2. Write tests for capitalize function
3. Write tests for lowercase function
4. Write tests for uppercase function
5. Write tests for plural function
6. Write tests for random function
**Test Mapping:** TC-008-001, TC-008-002

### Task 13.8: Create ConditionalBlock Tests
**Priority:** P1
**Dependencies:** Task 9.2
**Acceptance Criteria:** AC-009
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/conditional.test.ts`
2. Write tests for conditional block parsing
3. Write tests for conditional block evaluation
4. Write tests for else block handling
**Test Mapping:** TC-009-001, TC-009-002

### Task 13.9: Create ContextResolution Tests
**Priority:** P0
**Dependencies:** Task 10.2
**Acceptance Criteria:** AC-010
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/resolver.test.ts`
2. Write tests for context resolution
3. Write tests for context resolution with built-in functions
4. Write tests for missing context handling
**Test Mapping:** TC-010-001, TC-010-002

### Task 13.10: Create ProceduralTable Tests
**Priority:** P2
**Dependencies:** Task 11.2
**Acceptance Criteria:** AC-011
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/tables.test.ts`
2. Write tests for table registration
3. Write tests for weighted selection
4. Write tests for empty table handling
**Test Mapping:** TC-011-001, TC-011-002

### Task 13.11: Create SeededRNG Tests
**Priority:** P2
**Dependencies:** Task 12.3
**Acceptance Criteria:** AC-012
**Implementation Steps:**
1. Create file `logic/chronicler/templates/__tests__/rng.test.ts`
2. Write tests for seeded random generation
3. Write tests for RNG reset
4. Write tests for RNG manager caching
5. Write tests for deterministic output
**Test Mapping:** TC-012-001, TC-012-002

---

## Summary

**Total Tasks:** 56
**P0 Tasks:** 30 (Core types, Registry, Retrieval, Validation, Generation, Substitution, Functions, Pipeline, Tests)
**P1 Tasks:** 14 (Deprecation, Conditional blocks, Tests)
**P2 Tasks:** 12 (Procedural tables, Seeded RNG, Tests)

**Phases:** 13
- Phase 1: Template Types (4 tasks)
- Phase 2: Template Registry (2 tasks)
- Phase 3: Template Retrieval (2 tasks)
- Phase 4: Template Deprecation (2 tasks)
- Phase 5: Context Validation (2 tasks)
- Phase 6: Template Generation (3 tasks)
- Phase 7: Placeholder Substitution (2 tasks)
- Phase 8: Built-in Functions (6 tasks)
- Phase 9: Conditional Blocks (2 tasks)
- Phase 10: Context Resolution Pipeline (2 tasks)
- Phase 11: Procedural Tables (2 tasks)
- Phase 12: Seeded RNG (3 tasks)
- Phase 13: Test Files (11 tasks)
