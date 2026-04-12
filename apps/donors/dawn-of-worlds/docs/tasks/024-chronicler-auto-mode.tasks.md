# Task List: Chronicler Auto Mode

**TDD Reference:** [024-chronicler-auto-mode.tdd.md](../tdd/024-chronicler-auto-mode.tdd.md)

---

## Phase 1: AutoChronicler Types

### Task 1.1: Create AutoChroniclerState Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-001 (AutoChronicler initialization)
**Implementation Steps:**
1. Create file `logic/chronicler/auto/types.ts`
2. Define `AutoChroniclerState` interface with fields:
   - `initialized: boolean`
   - `running: boolean`
   - `config: AutoChroniclerConfig`
   - `lastTickTime: number`
   - `entriesGenerated: number`
3. Export interface
**Test Mapping:** TC-001-001, TC-001-002 (State tests)

### Task 1.2: Create GenerationResult Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-002 (Entry generation)
**Implementation Steps:**
1. In `logic/chronicler/auto/types.ts`, define `GenerationResult` interface with fields:
   - `success: boolean`
   - `entry?: JournalEntry`
   - `error?: string`
2. Export interface
**Test Mapping:** TC-002-001, TC-002-002 (Result tests)

### Task 1.3: Create ProvenanceType Type
**Priority:** P0
**Dependencies:** None
**Acceptance Criteria:** AC-010 (Provenance tracking)
**Implementation Steps:**
1. In `logic/chronicler/auto/types.ts`, define `ProvenanceType` enum with values: `MANUAL`, `AUTO`, `IMPORTED`
2. Export enum
**Test Mapping:** TC-010-001, TC-010-002 (Provenance type tests)

---

## Phase 2: AutoChronicler Initialization

### Task 2.1: Create AutoChronicler Class
**Priority:** P0
**Dependencies:** Task 1.1
**Acceptance Criteria:** AC-001 (AutoChronicler initialization)
**Implementation Steps:**
1. Create file `logic/chronicler/auto/chronicler.ts`
2. Implement `AutoChronicler` class
3. Add `initialize(config: AutoChroniclerConfig): void` method
4. Add `start(): void` method
5. Add `stop(): void` method
6. Export class
**Test Mapping:** TC-001-001, TC-001-002 (Initialization tests)

### Task 2.2: Create AutoChronicler Instance
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Global auto chronicler)
**Implementation Steps:**
1. In `logic/chronicler/auto/chronicler.ts`, create singleton instance `autoChronicler`
2. Export singleton for application-wide use
**Test Mapping:** TC-001-001 (Singleton test)

### Task 2.3: Implement initialize Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (AutoChronicler initialization)
**Implementation Steps:**
1. In `AutoChronicler`, implement `initialize()` method
2. Validate config
3. Set state to initialized
4. Set running to false
5. Initialize counters
6. Export method
**Test Mapping:** TC-001-001, TC-001-002 (Initialization tests)

---

## Phase 3: Entry Generation

### Task 3.1: Implement generateEntry Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Entry generation)
**Implementation Steps:**
1. In `AutoChronicler`, implement `generateEntry(context: LoreContext): GenerationResult` function
2. Select template based on context
3. Generate title and text
4. Create journal entry
5. Return generation result
6. Export method
**Test Mapping:** TC-002-001, TC-002-002 (Generation tests)

### Task 3.2: Implement generateEntryForEvent Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Event-based entry generation)
**Implementation Steps:**
1. In `AutoChronicler`, implement `generateEntryForEvent(event: GameEvent): GenerationResult` function
2. Match triggers to event
3. Generate candidates from triggers
4. Generate entry from top candidate
5. Return generation result
6. Export method
**Test Mapping:** TC-002-003, TC-002-004 (Event generation tests)

---

## Phase 4: Context Resolution

### Task 4.1: Implement resolveContext Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-003 (Context resolution)
**Implementation Steps:**
1. In `AutoChronicler`, implement `resolveContext(templateId: string): LoreContext` function
2. Get template from registry
3. Extract required placeholders
4. Resolve placeholder values from game state
5. Return resolved context
6. Export method
**Test Mapping:** TC-003-001, TC-003-002 (Context resolution tests)

### Task 4.2: Implement resolveContextForEvent Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-003 (Event-based context resolution)
**Implementation Steps:**
1. In `AutoChronicler`, implement `resolveContextForEvent(event: GameEvent, templateId: string): LoreContext` function
2. Extract data from event
3. Map event data to template placeholders
4. Return resolved context
5. Export method
**Test Mapping:** TC-003-003, TC-003-004 (Event context tests)

---

## Phase 5: Author Selection

### Task 5.1: Implement selectAuthor Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-004 (Author selection)
**Implementation Steps:**
1. In `AutoChronicler`, implement `selectAuthor(entryType: EntryType): Author` function
2. Select appropriate author based on entry type
3. Return author object
4. Export method
**Test Mapping:** TC-004-001, TC-004-002 (Author selection tests)

### Task 5.2: Implement selectAuthorForMyth Method
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-004 (Myth author selection)
**Implementation Steps:**
1. In `AutoChronicler`, implement `selectAuthorForMyth(): Author` function
2. Select system author for myths
3. Return author object
4. Export method
**Test Mapping:** TC-004-003, TC-004-004 (Myth author tests)

### Task 5.3: Implement selectAuthorForObservation Method
**Priority:** P0
**Dependencies:** Task 5.1
**Acceptance Criteria:** AC-004 (Observation author selection)
**Implementation Steps:**
1. In `AutoChronicler`, implement `selectAuthorForObservation(): Author` function
2. Select player author for observations
3. Return author object
4. Export method
**Test Mapping:** TC-004-005, TC-004-006 (Observation author tests)

---

## Phase 6: Template Selection

### Task 6.1: Implement selectTemplate Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-005 (Template selection)
**Implementation Steps:**
1. In `AutoChronicler`, implement `selectTemplate(entryType: EntryType): LoreTemplate` function
2. Get templates by entry type
3. Select template based on criteria
4. Return selected template
5. Export method
**Test Mapping:** TC-005-001, TC-005-002 (Template selection tests)

### Task 6.2: Implement selectTemplateRandomly Method
**Priority:** P0
**Dependencies:** Task 6.1
**Acceptance Criteria:** AC-005 (Random template selection)
**Implementation Steps:**
1. In `AutoChronicler`, implement `selectTemplateRandomly(templates: LoreTemplate[]): LoreTemplate` function
2. Select random template from array
3. Return selected template
4. Export method
**Test Mapping:** TC-005-003, TC-005-004 (Random selection tests)

---

## Phase 7: Verbosity-Specific Generation

### Task 7.1: Implement generateMinimalEntry Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-006 (Verbosity-specific generation)
**Implementation Steps:**
1. In `AutoChronicler`, implement `generateMinimalEntry(context: LoreContext): GenerationResult` function
2. Generate minimal title
3. Generate minimal text
4. Create journal entry
5. Return generation result
6. Export method
**Test Mapping:** TC-006-001, TC-006-002 (Minimal generation tests)

### Task 7.2: Implement generateNormalEntry Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-006 (Verbosity-specific generation)
**Implementation Steps:**
1. In `AutoChronicler`, implement `generateNormalEntry(context: LoreContext): GenerationResult` function
2. Generate normal title
3. Generate normal text
4. Create journal entry
5. Return generation result
6. Export method
**Test Mapping:** TC-006-003, TC-006-004 (Normal generation tests)

### Task 7.3: Implement generateVerboseEntry Method
**Priority:** P0
**Dependencies:** Task 3.1
**Acceptance Criteria:** AC-006 (Verbosity-specific generation)
**Implementation Steps:**
1. In `AutoChronicler`, implement `generateVerboseEntry(context: LoreContext): GenerationResult` function
2. Generate verbose title
3. Generate verbose text
4. Create journal entry
5. Return generation result
6. Export method
**Test Mapping:** TC-006-005, TC-006-006 (Verbose generation tests)

### Task 7.4: Implement generateEntryByVerbosity Method
**Priority:** P0
**Dependencies:** Task 7.1, Task 7.2, Task 7.3
**Acceptance Criteria:** AC-006 (Verbosity-based routing)
**Implementation Steps:**
1. In `AutoChronicler`, implement `generateEntryByVerbosity(context: LoreContext, verbosity: VerbosityLevel): GenerationResult` function
2. Route to appropriate generation method based on verbosity
3. Return generation result
4. Export method
**Test Mapping:** TC-006-007, TC-006-008 (Verbosity routing tests)

---

## Phase 8: Myth and Observation Inclusion

### Task 8.1: Implement shouldIncludeMyth Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-007 (Myth inclusion)
**Implementation Steps:**
1. In `AutoChronicler`, implement `shouldIncludeMyth(): boolean` function
2. Check config includeMyths setting
3. Return boolean result
4. Export method
**Test Mapping:** TC-007-001, TC-007-002 (Myth inclusion tests)

### Task 8.2: Implement shouldIncludeObservation Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-008 (Observation inclusion)
**Implementation Steps:**
1. In `AutoChronicler`, implement `shouldIncludeObservation(): boolean` function
2. Check config includeObservations setting
3. Return boolean result
4. Export method
**Test Mapping:** TC-008-001, TC-008-002 (Observation inclusion tests)

### Task 8.3: Filter Templates by Entry Type
**Priority:** P0
**Dependencies:** Task 6.1, Task 8.1, Task 8.2
**Acceptance Criteria:** AC-007, AC-008 (Entry type filtering)
**Implementation Steps:**
1. Modify `selectTemplate()` to filter by config settings
2. Exclude myth templates if includeMyths is false
3. Exclude observation templates if includeObservations is false
4. Return filtered template
**Test Mapping:** TC-007-003, TC-007-004, TC-008-003, TC-008-004 (Filtering tests)

---

## Phase 9: Procedural Tables

### Task 9.1: Implement selectFromProceduralTable Method
**Priority:** P1
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-009 (Procedural tables)
**Implementation Steps:**
1. In `AutoChronicler`, implement `selectFromProceduralTable(tableName: string): string` function
2. Get table from registry
3. Select entry based on weighted random
4. Return selected value
5. Export method
**Test Mapping:** TC-009-001, TC-009-002 (Procedural table tests)

### Task 9.2: Integrate Procedural Tables with Generation
**Priority:** P1
**Dependencies:** Task 3.1, Task 9.1
**Acceptance Criteria:** AC-009 (Procedural table integration)
**Implementation Steps:**
1. Modify `generateEntry()` to handle procedural table placeholders
2. Parse table placeholder patterns `{{table:tableName}}`
3. Replace with values from procedural tables
4. Return generation result
**Test Mapping:** TC-009-003, TC-009-004 (Integration tests)

---

## Phase 10: Config Update

### Task 10.1: Implement updateConfig Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-010 (Config update)
**Implementation Steps:**
1. In `AutoChronicler`, implement `updateConfig(config: Partial<AutoChroniclerConfig>): void` method
2. Merge new config with existing config
3. Apply config changes
4. Export method
**Test Mapping:** TC-010-001, TC-010-002 (Config update tests)

### Task 10.2: Handle Config Changes During Runtime
**Priority:** P0
**Dependencies:** Task 10.1
**Acceptance Criteria:** AC-010 (Runtime config changes)
**Implementation Steps:**
1. Modify `updateConfig()` to handle enabled/disabled state
2. Start/stop auto processing based on config
3. Update verbosity settings
4. Update inclusion settings
**Test Mapping:** TC-010-003, TC-010-004 (Runtime config tests)

---

## Phase 11: Provenance Tracking

### Task 11.1: Implement addProvenance Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-011 (Provenance tracking)
**Implementation Steps:**
1. In `AutoChronicler`, implement `addProvenance(entry: JournalEntry, provenance: ProvenanceType): JournalEntry` function
2. Add provenance metadata to entry
3. Return entry with provenance
4. Export method
**Test Mapping:** TC-011-001, TC-011-002 (Provenance tests)

### Task 11.2: Integrate Provenance with Entry Generation
**Priority:** P0
**Dependencies:** Task 3.1, Task 11.1
**Acceptance Criteria:** AC-011 (Provenance integration)
**Implementation Steps:**
1. Modify `generateEntry()` to add provenance metadata
2. Set provenance to AUTO for auto-generated entries
3. Return entry with provenance
**Test Mapping:** TC-011-003, TC-011-004 (Integration tests)

---

## Phase 12: Tick Processing

### Task 12.1: Implement tick Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-002 (Tick-based entry generation)
**Implementation Steps:**
1. In `AutoChronicler`, implement `tick(): void` method
2. Check if running
3. Process backlog candidates
4. Generate entries for candidates
5. Update last tick time
6. Export method
**Test Mapping:** TC-002-005, TC-002-006 (Tick tests)

### Task 12.2: Implement start Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Start auto chronicler)
**Implementation Steps:**
1. In `AutoChronicler`, implement `start()` method
2. Check if initialized
3. Set running to true
4. Start tick timer based on config
5. Export method
**Test Mapping:** TC-001-003, TC-001-004 (Start tests)

### Task 12.3: Implement stop Method
**Priority:** P0
**Dependencies:** Task 2.1
**Acceptance Criteria:** AC-001 (Stop auto chronicler)
**Implementation Steps:**
1. In `AutoChronicler`, implement `stop()` method
2. Set running to false
3. Stop tick timer
4. Export method
**Test Mapping:** TC-001-005, TC-001-006 (Stop tests)

---

## Phase 13: Test Files

### Task 13.1: Create AutoChronicler Tests
**Priority:** P0
**Dependencies:** Task 2.3
**Acceptance Criteria:** AC-001
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/chronicler.test.ts`
2. Write tests for initialization
3. Write tests for start/stop
4. Write tests for singleton instance
**Test Mapping:** TC-001-001, TC-001-002

### Task 13.2: Create EntryGeneration Tests
**Priority:** P0
**Dependencies:** Task 3.2
**Acceptance Criteria:** AC-002
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/generation.test.ts`
2. Write tests for entry generation
3. Write tests for event-based entry generation
4. Write tests for tick-based generation
**Test Mapping:** TC-002-001, TC-002-002

### Task 13.3: Create ContextResolution Tests
**Priority:** P0
**Dependencies:** Task 4.2
**Acceptance Criteria:** AC-003
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/context.test.ts`
2. Write tests for context resolution
3. Write tests for event-based context resolution
4. Write tests for missing context handling
**Test Mapping:** TC-003-001, TC-003-002

### Task 13.4: Create AuthorSelection Tests
**Priority:** P0
**Dependencies:** Task 5.3
**Acceptance Criteria:** AC-004
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/author.test.ts`
2. Write tests for author selection
3. Write tests for myth author selection
4. Write tests for observation author selection
**Test Mapping:** TC-004-001, TC-004-002

### Task 13.5: Create TemplateSelection Tests
**Priority:** P0
**Dependencies:** Task 6.2
**Acceptance Criteria:** AC-005
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/template.test.ts`
2. Write tests for template selection
3. Write tests for random template selection
4. Write tests for no template handling
**Test Mapping:** TC-005-001, TC-005-002

### Task 13.6: Create VerbosityGeneration Tests
**Priority:** P0
**Dependencies:** Task 7.4
**Acceptance Criteria:** AC-006
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/verbosity.test.ts`
2. Write tests for minimal generation
3. Write tests for normal generation
4. Write tests for verbose generation
5. Write tests for verbosity routing
**Test Mapping:** TC-006-001, TC-006-002

### Task 13.7: Create MythInclusion Tests
**Priority:** P0
**Dependencies:** Task 8.3
**Acceptance Criteria:** AC-007
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/myth.test.ts`
2. Write tests for myth inclusion check
3. Write tests for myth filtering
4. Write tests for config-based inclusion
**Test Mapping:** TC-007-001, TC-007-002

### Task 13.8: Create ObservationInclusion Tests
**Priority:** P0
**Dependencies:** Task 8.3
**Acceptance Criteria:** AC-008
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/observation.test.ts`
2. Write tests for observation inclusion check
3. Write tests for observation filtering
4. Write tests for config-based inclusion
**Test Mapping:** TC-008-001, TC-008-002

### Task 13.9: Create ProceduralTable Tests
**Priority:** P1
**Dependencies:** Task 9.2
**Acceptance Criteria:** AC-009
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/procedural.test.ts`
2. Write tests for procedural table selection
3. Write tests for procedural table integration
4. Write tests for missing table handling
**Test Mapping:** TC-009-001, TC-009-002

### Task 13.10: Create ConfigUpdate Tests
**Priority:** P0
**Dependencies:** Task 10.2
**Acceptance Criteria:** AC-010
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/config.test.ts`
2. Write tests for config update
3. Write tests for runtime config changes
4. Write tests for invalid config handling
**Test Mapping:** TC-010-001, TC-010-002

### Task 13.11: Create ProvenanceTracking Tests
**Priority:** P0
**Dependencies:** Task 11.2
**Acceptance Criteria:** AC-011
**Implementation Steps:**
1. Create file `logic/chronicler/auto/__tests__/provenance.test.ts`
2. Write tests for provenance addition
3. Write tests for provenance integration
4. Write tests for provenance type validation
**Test Mapping:** TC-011-001, TC-011-002

---

## Summary

**Total Tasks:** 51
**P0 Tasks:** 44 (Types, Initialization, Generation, Context, Author, Template, Verbosity, Myth/Observation, Config, Provenance, Tick, Tests)
**P1 Tasks:** 7 (Procedural tables, Tests)

**Phases:** 13
- Phase 1: AutoChronicler Types (3 tasks)
- Phase 2: AutoChronicler Initialization (3 tasks)
- Phase 3: Entry Generation (2 tasks)
- Phase 4: Context Resolution (2 tasks)
- Phase 5: Author Selection (3 tasks)
- Phase 6: Template Selection (2 tasks)
- Phase 7: Verbosity-Specific Generation (4 tasks)
- Phase 8: Myth and Observation Inclusion (3 tasks)
- Phase 9: Procedural Tables (2 tasks)
- Phase 10: Config Update (2 tasks)
- Phase 11: Provenance Tracking (2 tasks)
- Phase 12: Tick Processing (3 tasks)
- Phase 13: Test Files (11 tasks)
