# Comprehensive Test Plans

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Executive Summary

This document provides comprehensive test plans for the D&D Adventure Generator project, covering unit, integration, and end-to-end testing scenarios. The plans are designed to ensure robust coverage of critical paths identified in the pattern analysis, including AI provider interfaces, retry logic, entity development handlers, state management patterns, file system operations, and cross-system communication.

## 1. Unit Test Plans

### Frontend - Components

| Component | Test Cases | Priority | Coverage Target |
|-----------|------------|----------|-----------------|
| [`Modal.tsx`](src/components/common/Modal.tsx:1) | - Renders when isOpen is true<br>- Does not render when isOpen is false<br>- Calls onClose when backdrop is clicked<br>- Calls onClose when Escape key is pressed<br>- Prevents body scroll when open<br>- Restores body scroll when closed<br>- Applies correct size variant (standard/large) | P0 | 90% |
| [`Drawer.tsx`](src/components/common/Drawer.tsx:1) | - Renders when isOpen is true<br>- Does not render when isOpen is false<br>- Calls onClose when backdrop is clicked<br>- Calls onClose when Escape key is pressed<br>- Prevents body scroll when open<br>- Renders children correctly | P0 | 90% |
| [`ErrorBoundary.tsx`](src/components/common/ErrorBoundary.tsx:1) | - Catches errors in child components<br>- Displays fallback UI on error<br>- Logs error details<br>- Resets error state after error | P0 | 95% |
| [`GenerationErrorBoundary.tsx`](src/components/common/GenerationErrorBoundary.tsx:1) | - Catches AI generation errors<br>- Displays user-friendly error message<br>- Provides retry option<br>- Logs generation failures | P0 | 95% |
| [`DiceRoller.tsx`](src/components/common/DiceRoller.tsx:1) | - Renders dice controls<br>- Executes dice roll on click<br>- Displays roll result<br>- Supports multiple dice types (d4, d6, d8, d10, d12, d20)<br>- Handles modifier input | P1 | 85% |
| [`Statblock.tsx`](src/components/common/Statblock.tsx:1) | - Renders monster statblock<br>- Displays correct stats (AC, HP, Speed)<br>- Renders abilities correctly<br>- Shows actions and traits<br>- Formats dice notation properly | P1 | 85% |
| [`MonsterCard.tsx`](src/components/bestiary/MonsterCard.tsx:1) | - Displays monster name and CR<br>- Shows monster type<br>- Renders preview image<br>- Handles click to select<br>- Displays delete button for user monsters | P1 | 85% |
| [`BestiaryToolbar.tsx`](src/components/bestiary/BestiaryToolbar.tsx:1) | - Renders search input<br>- Renders filter dropdowns<br>- Toggles view mode (grid/list)<br>- Sorts monsters correctly<br>- Applies filters | P1 | 80% |
| [`EncounterBalancer.tsx`](src/components/encounter/EncounterBalancer.tsx:1) | - Calculates encounter difficulty<br>- Shows party level input<br>- Displays XP threshold<br>- Adds/removes combatants<br>- Updates balance in real-time | P0 | 90% |
| [`InitiativeTracker.tsx`](src/components/encounter/InitiativeTracker.tsx:1) | - Sorts combatants by initiative<br>- Advances to next turn<br>- Handles damage/healing<br>- Marks combatants as defeated<br>- Resets encounter | P0 | 90% |
| [`PersonaManager.tsx`](src/components/npc/PersonaManager.tsx:1) | - Displays NPC personas<br>- Adds new persona<br>- Edits existing persona<br>- Deletes persona<br>- Links persona to NPC | P1 | 80% |
| [`Sidebar.tsx`](src/components/common/Sidebar.tsx:1) | - Renders navigation items<br>- Highlights active route<br>- Collapses/expands<br>- Responds to theme changes | P2 | 70% |
| [`SystemMessage.tsx`](src/components/common/SystemMessage.tsx:1) | - Displays success messages<br>- Displays error messages<br>- Displays info messages<br>- Auto-dismisses after timeout<br>- Manually dismissible | P1 | 85% |

### Frontend - Hooks

| Hook | Test Cases | Priority | Coverage Target |
|------|------------|----------|-----------------|
| [`useBestiaryLogic.ts`](src/hooks/useBestiaryLogic.ts:1) | - Loads monsters from campaign store<br>- Loads SRD monsters<br>- Filters by search query<br>- Filters by CR range<br>- Filters by type<br>- Sorts by name/CR<br>- Handles monster selection<br>- Loads monster details<br>- Handles monster deletion<br>- Toggles view mode<br>- Debounces search input | P0 | 90% |
| [`useFilteredEntities.ts`](src/hooks/useFilteredEntities.ts:1) | - Filters scenes by search<br>- Filters locations by search<br>- Filters NPCs by search<br>- Filters factions by search<br>- Filters by location relationship<br>- Filters by faction relationship<br>- Parses JSON content safely<br>- Handles parse errors | P0 | 90% |
| [`useCompendiumManagerLogic.ts`](src/hooks/useCompendiumManagerLogic.ts:1) | - Loads compendium entries<br>- Creates new entry<br>- Updates existing entry<br>- Deletes entry<br>- Filters by category<br>- Handles entry selection<br>- Manages form state | P0 | 85% |
| [`useLocationManagerLogic.ts`](src/hooks/useLocationManagerLogic.ts:1) | - Loads locations<br>- Creates new location<br>- Updates location<br>- Deletes location<br>- Links locations to scenes<br>- Manages location form state | P0 | 85% |
| [`useDebounce.ts`](src/hooks/useDebounce.ts:1) | - Returns initial value immediately<br>- Debounces subsequent updates<br>- Cancels pending updates on unmount<br>- Handles different delay values | P1 | 95% |
| [`useAsyncOperation.ts`](src/hooks/useAsyncOperation.ts:1) | - Executes async operation<br>- Sets loading state during execution<br>- Handles successful completion<br>- Handles errors<br>- Provides retry capability | P0 | 90% |
| [`useJobQueue.ts`](src/hooks/useJobQueue.ts:1) | - Adds jobs to queue<br>- Processes jobs sequentially<br>- Updates job status<br>- Handles job failures<br>- Cancels pending jobs<br>- Clears completed jobs | P0 | 90% |
| [`useAppSession.ts`](src/hooks/useAppSession.ts:1) | - Initializes session on mount<br>- Saves session state<br>- Restores session on reload<br>- Handles session expiration<br>- Clears session on logout | P0 | 85% |
| [`useTheme.ts`](src/hooks/useTheme.ts:1) | - Applies theme to document<br>- Switches between themes<br>- Persists theme preference<br>- Handles system theme changes | P2 | 80% |
| [`useZodForm.ts`](src/hooks/useZodForm.ts:1) | - Validates form with Zod schema<br>- Displays validation errors<br>- Handles form submission<br>- Resets form state<br>- Handles default values | P0 | 90% |
| [`useMonsterCreator.ts`](src/hooks/useMonsterCreator.ts:1) | - Creates new monster<br>- Validates monster data<br>- Calculates CR<br>- Generates statblock<br>- Saves to bestiary | P0 | 85% |
| [`useNpcGeneration.ts`](src/hooks/useNpcGeneration.ts:1) | - Generates NPC via AI<br>- Handles generation errors<br>- Retries on failure<br>- Displays generation progress<br>- Saves generated NPC | P0 | 85% |
| [`useHexGridInteraction.ts`](src/hooks/useHexGridInteraction.ts:1) | - Handles hex click<br>- Handles hex hover<br>- Selects multiple hexes<br>- Deselects hexes<br>- Handles drag selection | P1 | 80% |
| [`useContextualNavigation.ts`](src/hooks/useContextualNavigation.ts:1) | - Provides navigation context<br>- Handles back navigation<br>- Handles forward navigation<br>- Maintains navigation history | P2 | 75% |
| [`useViewTransition.ts`](src/hooks/useViewTransition.ts:1) | - Triggers view transition<br>- Handles transition end<br>- Supports different transition types | P2 | 70% |

### Frontend - Utilities

| Utility | Test Cases | Priority | Coverage Target |
|---------|------------|----------|-----------------|
| [`crCalculator.ts`](src/utils/crCalculator.ts:1) | - Calculates defensive CR<br>- Calculates offensive CR<br>- Computes final CR<br>- Generates warnings for imbalances<br>- Handles fractional CR<br>- Handles edge cases (zero DPR, zero HP) | P0 | 95% |
| [`diceHelpers.ts`](src/utils/diceHelpers.ts:1) | - Parses dice strings correctly<br>- Calculates average damage<br>- Formats damage payload<br>- Nudges dice to target DPR<br>- Handles modifiers<br>- Handles damage types | P0 | 95% |
| [`aiHelpers.ts`](src/utils/aiHelpers.ts:1) | - Extracts JSON from AI response<br>- Handles markdown-wrapped JSON<br>- Handles malformed JSON<br>- Generates placeholder images<br>- Sanitizes AI output | P0 | 90% |
| [`monsterHelpers.ts`](src/utils/monsterHelpers.ts:1) | - Gets monster CR<br>- Gets monster type<br>- Calculates XP value<br>- Formats statblock data<br>- Validates monster data | P0 | 90% |
| [`hexUtils.ts`](src/utils/hexUtils.ts:1) | - Converts axial to cube coordinates<br>- Converts cube to axial coordinates<br>- Calculates hex distance<br>- Gets hex neighbors<br>- Converts hex to pixel<br>- Converts pixel to hex | P1 | 90% |
| [`trapHelpers.ts`](src/utils/trapHelpers.ts:1) | - Calculates trap DC<br>- Calculates trap damage<br>- Determines trap CR<br>- Generates trap description<br>- Handles trap triggers | P1 | 85% |
| [`biomePatterns.ts`](src/utils/biomePatterns.ts:1) | - Generates biome patterns<br>- Applies noise to terrain<br>- Creates biome transitions<br>- Handles edge cases | P2 | 80% |
| [`delveGenerator.ts`](src/utils/delveGenerator.ts:1) | - Generates delve structure<br>- Creates room connections<br>- Places encounters<br>- Generates loot<br>- Handles delve depth | P1 | 85% |
| [`markovGenerator.ts`](src/utils/markovGenerator.ts:1) | - Builds Markov chain from text<br>- Generates names from chain<br>- Handles edge cases (empty input)<br>- Supports different chain orders | P2 | 80% |
| [`sanitizeHtml.ts`](src/utils/sanitizeHtml.ts:1) | - Removes dangerous tags<br>- Removes dangerous attributes<br>- Allows safe tags<br>- Preserves text content<br>- Handles malformed HTML | P0 | 95% |
| [`validators.ts`](src/utils/validators.ts:1) | - Validates email addresses<br>- Validates URLs<br>- Validates monster names<br>- Validates CR values<br>- Validates dice notation | P0 | 90% |
| [`zodHelpers.ts`](src/utils/zodHelpers.ts:1) | - Converts Zod schema to JSON schema<br>- Validates data with schema<br>- Formats validation errors<br>- Handles complex schemas | P0 | 90% |
| [`seededRng.ts`](src/utils/seededRng.ts:1) | - Generates consistent random numbers<br>- Supports different seed values<br>- Handles integer ranges<br>- Handles float ranges | P2 | 85% |
| [`httpUtils.ts`](src/utils/httpUtils.ts:1) | - Makes GET requests<br>- Makes POST requests<br>- Handles HTTP errors<br>- Adds auth headers<br>- Handles timeouts | P0 | 90% |
| [`errorUtils.ts`](src/utils/errorUtils.ts:1) | - Formats error messages<br>- Categorizes errors<br>- Extracts error details<br>- Handles network errors<br>- Handles validation errors | P0 | 85% |

### Frontend - Services

| Service | Test Cases | Priority | Coverage Target |
|---------|------------|----------|-----------------|
| [`aiManager.ts`](src/services/ai/aiManager.ts:1) | - Routes to correct AI provider<br>- Handles provider switching<br>- Implements retry logic<br>- Handles provider failures<br>- Shows system messages on errors<br>- Manages provider state | P0 | 90% |
| [`aiService.ts`](src/services/aiService.ts:1) | - Generates structured content<br>- Generates text content<br>- Streams text content<br>- Generates images<br>- Handles API errors<br>- Manages API keys | P0 | 90% |
| [`OllamaImpl.ts`](src/services/ai/ollamaImpl.ts:1) | - Generates structured output<br>- Generates text output<br>- Streams text<br>- Generates images<br>- Implements retry with backoff<br>- Parses SSE streams<br>- Validates JSON responses<br>- Handles connection errors | P0 | 90% |
| [`OpenAIImpl.ts`](src/services/ai/openaiImpl.ts:1) | - Generates structured output<br>- Generates text output<br>- Streams text<br>- Implements retry with backoff<br>- Parses SSE streams<br>- Validates JSON responses<br>- Handles API rate limits | P0 | 90% |
| [`ClaudeImpl.ts`](src/services/ai/claudeImpl.ts:1) | - Generates structured output<br>- Generates text output<br>- Streams text<br>- Implements retry with backoff<br>- Parses SSE streams<br>- Validates JSON responses<br>- Handles API rate limits | P0 | 90% |
| [`GeminiImpl.ts`](src/services/ai/geminiImpl.ts:1) | - Generates structured output<br>- Generates text output<br>- Streams text<br>- Implements retry with backoff<br>- Parses SSE streams<br>- Validates JSON responses<br>- Handles API errors | P0 | 90% |
| [`adventureHandlers.ts`](src/services/adventureHandlers.ts:1) | - Develops scenes<br>- Develops locations<br>- Develops NPCs<br>- Develops factions<br>- Handles development errors<br>- Manages development state | P0 | 85% |
| [`adventureGenerators.ts`](src/services/adventureGenerators.ts:1) | - Generates hooks<br>- Refines hooks<br>- Generates outline<br>- Generates full outline<br>- Handles generation errors<br>- Manages generation state | P0 | 85% |
| [`encounterHandlers.ts`](src/services/encounterHandlers.ts:1) | - Creates encounters<br>- Updates encounters<br>- Balances encounters<br>- Handles encounter errors<br>- Manages encounter state | P0 | 85% |
| [`GroundingService.ts`](src/services/GroundingService.ts:1) | - Grounds entities to locations<br>- Grounds entities to scenes<br>- Manages grounding relationships<br>- Handles circular references<br>- Validates grounding | P0 | 85% |
| [`lootGenerator.ts`](src/services/lootGenerator.ts:1) | - Generates loot based on CR<br>- Generates individual items<br>- Generates treasure hoards<br>- Handles loot tables<br>- Calculates coin values | P1 | 85% |
| [`monsterLoader.ts`](src/services/monsterLoader.ts:1) | - Loads SRD monsters<br>- Caches loaded monsters<br>- Handles load errors<br>- Parses monster data<br>- Validates monster structure | P0 | 85% |
| [`fileSystemStore.ts`](src/services/fileSystemStore.ts:1) | - Saves files to file system<br>- Loads files from file system<br>- Handles file errors<br>- Manages file paths<br>- Serializes/deserializes data | P0 | 90% |
| [`persistenceService.ts`](src/services/persistenceService.ts:1) | - Saves campaign data<br>- Loads campaign data<br>- Handles persistence errors<br>- Manages save state<br>- Implements auto-save | P0 | 90% |
| [`srdImportService.ts`](src/services/srdImportService.ts:1) | - Imports SRD data<br>- Parses SRD JSON<br>- Validates SRD structure<br>- Handles import errors<br>- Manages import progress | P1 | 85% |
| [`sessionManager.ts`](src/services/sessionManager.ts:1) | - Creates new sessions<br>- Loads existing sessions<br>- Updates session data<br>- Handles session errors<br>- Manages session history | P0 | 85% |

### Frontend - Stores

| Store | Test Cases | Priority | Coverage Target |
|-------|------------|----------|-----------------|
| [`settingsStore.ts`](src/stores/settingsStore.ts:1) | - Initializes with defaults<br>- Sets backend URL<br>- Sets backend endpoint<br>- Sets theme skin<br>- Persists to localStorage<br>- Restores from localStorage<br>- Handles persistence errors | P0 | 90% |
| [`campaignStore.ts`](src/stores/campaignStore.ts:1) | - Loads campaign data<br>- Saves campaign data<br>- Manages bestiary<br>- Manages compendium<br>- Manages locations<br>- Manages NPCs<br>- Manages factions<br>- Handles campaign errors | P0 | 85% |
| [`navigationStore.ts`](src/stores/navigationStore.ts:1) | - Tracks current route<br>- Tracks navigation history<br>- Handles back navigation<br>- Handles forward navigation<br>- Man breadcrumbs | P1 | 80% |
| [`monsterCreatorStore.ts`](src/stores/monsterCreatorStore.ts:1) | - Manages monster form state<br>- Validates monster data<br>- Calculates monster CR<br>- Saves monster<br>- Resets form | P0 | 85% |
| [`encounterStore.ts`](src/stores/encounterStore.ts:1) | - Manages encounter state<br>- Adds combatants<br>- Removes combatants<br>- Updates combatant HP<br>- Tracks initiative<br>- Handles encounter flow | P0 | 85% |
| [`workflowStore.ts`](src/stores/workflowStore.ts:1) | - Manages workflow state<br>- Tracks workflow steps<br>- Handles workflow transitions<br>- Manages workflow errors<br>- Persists workflow state | P0 | 85% |
| [`tavernStore.ts`](src/stores/tavernStore.ts:1) | - Manages tavern state<br>- Handles tavern interactions<br>- Manages tavern NPCs<br>- Tracks tavern reputation<br>- Handles tavern events | P1 | 80% |
| [`locationStore.ts`](src/stores/locationStore.ts:1) | - Manages location state<br>- Creates locations<br>- Updates locations<br>- Deletes locations<br>- Links locations to scenes | P0 | 85% |
| [`generatorConfigStore.ts`](src/stores/generatorConfigStore.ts:1) | - Manages generator settings<br>- Configures AI models<br>- Sets generation parameters<br>- Persists configuration<br>- Restores configuration | P0 | 85% |
| [`aiLedgerStore.ts`](src/stores/aiLedgerStore.ts:1) | - Tracks AI calls<br>- Records token usage<br>- Calculates costs<br>- Manages ledger history<br>- Exports ledger data | P1 | 80% |
| [`ensembleStore.ts`](src/stores/ensembleStore.ts:1) | - Manages ensemble state<br>- Handles player connections<br>- Syncs ensemble data<br>- Manages ensemble sessions<br>- Handles ensemble errors | P1 | 80% |
| [`compendiumStore.ts`](src/stores/compendiumStore.ts:1) | - Manages compendium entries<br>- Creates entries<br>- Updates entries<br>- Deletes entries<br>- Filters entries<br>- Searches entries | P0 | 85% |
| [`historyStore.ts`](src/stores/historyStore.ts:1) | - Tracks action history<br>- Implements undo<br>- Implements redo<br>- Clears history<br>- Manages history limits | P1 | 80% |

### Backend - Routers

| Router | Test Cases | Priority | Coverage Target |
|--------|------------|----------|-----------------|
| [`encounter_gen.py`](python-backend/routers/encounter_gen.py:1) | - POST /generate/encounter returns valid encounter<br>- Handles missing required fields<br>- Handles invalid level values<br>- Handles generation errors<br>- Returns proper error responses<br>- Validates response model | P0 | 85% |
| [`npc_gen.py`](python-backend/routers/npc_gen.py:1) | - POST /generate/npc returns valid NPC<br>- Handles missing prompt<br>- Handles invalid model names<br>- Handles generation errors<br>- Returns proper error responses<br>- Validates response model | P0 | 85% |
| [`queue_router.py`](python-backend/routers/queue_router.py:1) | - POST /queue/job adds job to queue<br>- GET /queue/jobs returns all jobs<br>- GET /queue/job/:id returns specific job<br>- DELETE /queue/job/:id removes job<br>- Handles queue errors<br>- Validates job model | P0 | 85% |
| [`rag.py`](python-backend/routers/rag.py:1) | - POST /rag/query returns relevant results<br>- Handles empty query<br>- Handles no results found<br>- Handles RAG errors<br>- Returns proper error responses<br>- Validates response model | P0 | 85% |
| [`llm_router.py`](python-backend/core/llm_router.py:1) | - POST /llm/generate returns text<br>- POST /llm/generate-structured returns structured data<br>- Handles missing API key<br>- Handles invalid requests<br>- Returns proper error responses<br>- Validates response model | P0 | 85% |
| [`ollama_router.py`](python-backend/core/ollama_router.py:1) | - GET /ollama/models returns available models<br>- POST /ollama/test tests connection<br>- Handles connection errors<br>- Handles timeout errors<br>- Returns proper error responses | P0 | 85% |
| [`lmstudio_router.py`](python-backend/core/lmstudio_router.py:1) | - GET /lmstudio/models returns available models<br>- POST /lmstudio/test tests connection<br>- Handles connection errors<br>- Handles timeout errors<br>- Returns proper error responses | P0 | 85% |
| [`logs_router.py`](python-backend/core/logs_router.py:1) | - GET /logs returns log entries<br>- GET /logs/:level returns filtered logs<br>- Handles log read errors<br>- Returns proper error responses | P1 | 80% |
| [`server_router.py`](python-backend/core/server_router.py:1) | - GET /status returns server status<br>- GET /health returns health check<br>- Handles server errors<br>- Returns proper error responses | P0 | 90% |
| [`status_router.py`](python-backend/core/status_router.py:1) | - GET /status returns system status<br>- Checks all services<br>- Returns service availability<br>- Handles status check errors | P0 | 90% |

### Backend - Services

| Service | Test Cases | Priority | Coverage Target |
|---------|------------|----------|-----------------|
| [`generator_service.py`](python-backend/services/generator_service.py:1) | - Generates NPC with valid prompt<br>- Generates encounter with valid prompt<br>- Handles invalid prompts<br>- Handles API errors<br>- Implements retry logic<br>- Validates response models | P0 | 90% |
| [`rag_service.py`](python-backend/services/rag_service.py:1) | - Queries vector store<br>- Returns relevant documents<br>- Handles empty results<br>- Handles query errors<br>- Manages vector store connections<br>- Validates document structure | P0 | 90% |
| [`cache.py`](python-backend/core/cache.py:1) | - Caches responses<br>- Retrieves cached responses<br>- Handles cache misses<br>- Handles cache errors<br>- Implements cache expiration<br>- Manages cache size | P1 | 85% |
| [`queue_manager.py`](python-backend/core/queue_manager.py:1) | - Adds jobs to queue<br>- Processes jobs sequentially<br>- Handles job failures<br>- Retries failed jobs<br>- Removes completed jobs<br>- Manages queue state | P0 | 90% |
| [`config.py`](python-backend/core/config.py:1) | - Loads configuration from environment<br>- Validates configuration<br>- Handles missing config values<br>- Provides default values<br>- Handles config errors | P0 | 90% |
| [`log_handler.py`](python-backend/core/log_handler.py:1) | - Logs messages at different levels<br>- Formats log messages<br>- Handles log write errors<br>- Manages log rotation<br>- Filters logs by level | P1 | 85% |
| [`prompts.py`](python-backend/core/prompts.py:1) | - Builds system prompts<br>- Builds user prompts<br>- Formats prompts with context<br>- Handles prompt errors<br>- Validates prompt structure | P0 | 85% |

### Backend - Models

| Model | Test Cases | Priority | Coverage Target |
|-------|------------|----------|-----------------|
| [`encounters.py`](python-backend/models/encounters.py:1) | - Validates CombatEncounterConfig<br>- Validates CombatEncounterResult<br>- Validates all encounter types<br>- Handles missing required fields<br>- Handles invalid field types<br>- Handles validation errors<br>- Serializes to JSON<br>- Deserializes from JSON | P0 | 100% |
| [`models.py`](python-backend/models.py:1) (NPC, Stats, Encounter) | - Validates NPC model<br>- Validates Stats model<br>- Validates Encounter model<br>- Handles missing required fields<br>- Handles invalid field types<br>- Handles nested models<br>- Serializes to JSON<br>- Deserializes from JSON | P0 | 100% |
| Pydantic Models (all) | - Validate with correct data<br>- Reject invalid data<br>- Handle optional fields<br>- Handle default values<br>- Handle nested models<br>- Handle list fields<br>- Handle dict fields | P0 | 100% |

### Backend - Core Modules

| Module | Test Cases | Priority | Coverage Target |
|--------|------------|----------|-----------------|
| [`addon_manager.py`](python-backend/core/addon_manager.py:1) | - Loads addons<br>- Initializes addons<br>- Handles addon errors<br>- Manages addon state<br>- Validates addon structure | P1 | 85% |
| [`security.py`](python-backend/core/security.py:1) | - Validates API keys<br>- Handles invalid keys<br>- Implements rate limiting<br>- Handles rate limit errors<br>- Validates request origins | P0 | 90% |
| [`orchestration_router.py`](python-backend/core/orchestration_router.py:1) | - Orchestrates multi-step operations<br>- Handles operation failures<br>- Tracks operation progress<br>- Returns operation status<br>- Handles orchestration errors | P0 | 85% |
| [`batch_router.py`](python-backend/core/batch_router.py:1) | - Processes batch requests<br>- Handles batch errors<br>- Returns batch results<br>- Validates batch input<br>- Manages batch state | P1 | 85% |

### Tauri - Commands

| Command | Test Cases | Priority | Coverage Target |
|---------|------------|----------|-----------------|
| [`read_markdown_file`](src-tauri/src/lib.rs:14) | - Reads file with frontmatter<br>- Reads file without frontmatter<br>- Handles file not found<br>- Handles permission errors<br>- Returns correct structure<br>- Handles malformed frontmatter | P0 | 85% |
| [`write_markdown_file`](src-tauri/src/lib.rs:35) | - Writes file with frontmatter<br>- Writes file without frontmatter<br>- Creates parent directories<br>- Handles permission errors<br>- Handles disk full errors<br>- Overwrites existing files | P0 | 85% |
| [`spawn_player_window`](src-tauri/src/lib.rs:53) | - Spawns new window<br>- Handles existing window<br>- Handles window creation errors<br>- Sets correct window properties<br>- Returns success/failure | P1 | 80% |
| [`start_watching`](src-tauri/src/lib.rs:72) | - Starts file watcher<br>- Watches directory recursively<br>- Emits file change events<br>- Handles watch errors<br>- Handles path errors<br>- Stops watcher on cleanup | P0 | 85% |
| [`export_vault`](src-tauri/src/lib.rs:97) | - Exports vault to target<br>- Strips secrets<br>- Transforms WikiLinks<br>- Handles Hugo format<br>- Creates target directory<br>- Handles export errors<br>- Handles permission errors | P1 | 80% |

## 2. Integration Test Plans

### Frontend Integration

| Scenario | Components Involved | Test Cases | Priority |
|----------|---------------------|------------|----------|
| Bestiary View Integration | [`BestiaryView.tsx`](src/components/bestiary/BestiaryView.tsx:1), [`useBestiaryLogic.ts`](src/hooks/useBestiaryLogic.ts:1), [`campaignStore`](src/stores/campaignStore.ts:1), [`monsterLoader`](src/services/monsterLoader.ts:1) | - Loading bestiary displays monsters<br>- Search filters monsters correctly<br>- Selection loads monster details<br>- Delete removes monster from store<br>- View toggle switches between grid/list | P0 |
| Encounter Wizard Integration | [`EncounterWizard.tsx`](src/components/encounter/EncounterWizard.tsx:1), [`encounterStore`](src/stores/encounterStore.ts:1), [`encounterHandlers`](src/services/encounterHandlers.ts:1), [`aiManager`](src/services/ai/aiManager.ts:1) | - Wizard steps progress correctly<br>- Combatants add to encounter<br>- AI generation populates combatants<br>- Encounter balances correctly<br>- Final encounter saves to store | P0 |
| NPC Generation Integration | PersonaManager, [`useNpcGeneration`](src/hooks/useNpcGeneration.ts:1), [`aiManager`](src/services/ai/aiManager.ts:1), [`campaignStore`](src/stores/campaignStore.ts:1) | - Persona selection influences generation<br>- Generation displays progress<br>- Generated NPC validates correctly<br>- NPC saves to compendium<br>- Errors display user-friendly messages | P0 |
| Location Manager Integration | Location components, [`useLocationManagerLogic`](src/hooks/useLocationManagerLogic.ts:1), [`locationStore`](src/stores/locationStore.ts:1), [`GroundingService`](src/services/GroundingService.ts:1) | - Creating location adds to store<br>- Location links to scenes<br>- Grounding updates correctly<br>- Location deletion removes links<br>- Form validation works correctly | P0 |
| Modal Integration | Modal, Drawer, SystemMessage, ErrorBoundary | - Modal closes on backdrop click<br>- Modal closes on Escape key<br>- Body scroll locks when modal open<br>- Error boundary catches errors<br>- System messages display correctly | P1 |
| AI Provider Integration | All AI implementations, [`aiManager`](src/services/ai/aiManager.ts:1), [`settingsStore`](src/stores/settingsStore.ts:1) | - Provider switching works correctly<br>- Retry logic triggers on failure<br>- Fallback to alternative provider<br>- Configuration persists<br>- Errors display correctly | P0 |
| Form Validation Integration | [`useZodForm`](src/hooks/useZodForm.ts:1), Zod schemas, Form components | - Validation errors display correctly<br>- Form submission blocked on invalid data<br>- Reset clears validation state<br>- Default values populate correctly | P0 |
| State Persistence Integration | All stores, [`persistenceService`](src/services/persistenceService.ts:1), [`fileSystemStore`](src/services/fileSystemStore.ts:1) | - State saves to file system<br>- State loads from file system<br>- Auto-save triggers on changes<br>- Persistence errors handled gracefully<br>- State syncs across windows | P0 |

### Backend Integration

| Scenario | Modules Involved | Test Cases | Priority |
|----------|------------------|------------|----------|
| Encounter Generation Flow | [`encounter_gen.py`](python-backend/routers/encounter_gen.py:1), [`generator_service.py`](python-backend/services/generator_service.py:1), Encounter models, LLM client | - Router receives request<br>- Service calls LLM<br>- Response validates with model<br>- Error handling works end-to-end<br>- Retry logic triggers on failure | P0 |
| NPC Generation Flow | [`npc_gen.py`](python-backend/routers/npc_gen.py:1), [`generator_service.py`](python-backend/services/generator_service.py:1), NPC models, LLM client | - Router receives request<br>- Service calls LLM<br>- Response validates with model<br>- Error handling works end-to-end<br>- Retry logic triggers on failure | P0 |
| RAG Query Flow | [`rag.py`](python-backend/routers/rag.py:1), [`rag_service.py`](python-backend/services/rag_service.py:1), Vector store | - Router receives query<br>- Service queries vector store<br>- Results return correctly<br>- Empty results handled<br>- Query errors handled | P0 |
| Queue Processing Flow | [`queue_router.py`](python-backend/routers/queue_router.py:1), [`queue_manager.py`](python-backend/core/queue_manager.py:1), Generator service | - Job added to queue<br>- Job processes in order<br>- Failed jobs retry<br>- Completed jobs removed<br>- Queue state persists | P0 |
| LLM Provider Integration | [`llm_router.py`](python-backend/core/llm_router.py:1), [`ollama_router.py`](python-backend/core/ollama_router.py:1), [`lmstudio_router.py`](python-backend/core/lmstudio_router.py:1) | - Router routes to correct provider<br>- Provider connection tested<br>- Model list retrieved<br>- Generation succeeds<br>- Provider errors handled | P0 |
| Caching Integration | All routers, [`cache.py`](python-backend/core/cache.py:1) | - Responses cached correctly<br>- Cache hits return fast<br>- Cache misses trigger generation<br>- Cache expiration works<br>- Cache errors don't break flow | P1 |
| Logging Integration | All routers, [`log_handler.py`](python-backend/core/log_handler.py:1) | - All requests logged<br>- Errors logged with details<br>- Logs filtered by level<br>- Log rotation works<br>- Log errors don't break flow | P1 |

### Cross-System Integration

| Scenario | Systems Involved | Test Cases | Priority |
|----------|-------------------|------------|----------|
| React ↔ Python API Communication | Frontend services, Python routers, HTTP client | - Frontend calls Python API<br>- Python returns valid response<br>- Frontend handles response correctly<br>- Network errors handled<br>- Authentication works correctly | P0 |
| Tauri ↔ React Communication | Tauri commands, React invoke, File operations | - React calls Tauri commands<br>- Tauri executes commands<br>- Results return to React<br>- File operations work correctly<br>- Errors propagate correctly | P0 |
| File System Operations Across Systems | Tauri file commands, Python file operations, Frontend file services | - Files written by Tauri readable by Python<br>- Files written by Python readable by Tauri<br>- Path handling works on Windows<br>- Path handling works on POSIX<br>- Concurrent file access handled | P0 |
| State Synchronization | Zustand stores, IndexedDB, File system | - State persists to IndexedDB<br>- State loads from IndexedDB<br>- State syncs to file system<br>- File system changes sync to stores<br>- Conflict resolution works | P0 |
| AI Generation Across Systems | Frontend AI service, Python backend, LLM providers | - Frontend routes to Python<br>- Python calls LLM<br>- Response returns to frontend<br>- Streaming works correctly<br>- Errors handled at all levels | P0 |
| Ensemble Sync | Ensemble store, Player window, Backend sync | - Host changes sync to players<br>- Player changes sync to host<br>- Connection errors handled<br>- Reconnection works<br>- State conflicts resolved | P1 |

## 3. End-to-End Test Plans

### User Workflow Tests

| Workflow | Steps | Test Cases | Priority |
|----------|-------|------------|----------|
| Campaign Creation | 1. Create new campaign<br>2. Set campaign settings<br>3. Add first location<br>4. Add first NPC<br>5. Save campaign | - Campaign creates successfully<br>- Settings persist<br>- Location adds to compendium<br>- NPC adds to compendium<br>- Campaign saves to file system | P0 |
| Adventure Generation | 1. Select adventure type<br>2. Configure parameters<br>3. Generate adventure<br>4. Review generated content<br>5. Save adventure | - Adventure type selection works<br>- Parameters validate correctly<br>- Generation completes<br>- Content displays correctly<br>- Adventure saves to campaign | P0 |
| Encounter Design | 1. Create new encounter<br>2. Add combatants<br>3. Set difficulty<br>4. Balance encounter<br>5. Save encounter | - Encounter creates<br>- Combatants add correctly<br>- Difficulty calculates correctly<br>- Balance suggestions accurate<br>- Encounter saves | P0 |
| NPC Development | 1. Create NPC<br>2. Set persona<br>3. Generate details<br>4. Link to location<br>5. Add to compendium | - NPC creates<br>- Persona applies<br>- Generation works<br>- Linking works<br>- Compendium updates | P0 |
| Location Management | 1. Create location<br>2. Set biome<br>3. Add hex map<br>4. Link scenes<br>5. Save location | - Location creates<br>- Biome applies<br>- Hex map renders<br>- Scenes link correctly<br>- Location saves | P0 |
| Import/Export Campaign | 1. Export campaign<br>2. Verify export file<br>3. Import campaign<br>4. Verify import data<br>5. Compare with original | - Export completes<br>- File contains all data<br>- Import completes<br>- Data matches original<br>- No corruption | P0 |
| Session Management | 1. Create session<br>2. Add players<br>3. Run encounter<br>4. Track initiative<br>5. End session | - Session creates<br>- Players add<br>- Encounter runs<br>- Initiative tracks<br>- Session saves | P0 |
| Ensemble Mode | 1. Host creates ensemble<br>2. Player joins ensemble<br>3. Host shares content<br>4. Player views content<br>5. Disconnect and reconnect | - Ensemble creates<br>- Player joins<br>- Content syncs<br>- View updates<br>- Reconnection works | P1 |
| Monster Creation | 1. Create monster<br>2. Set stats<br>3. Add abilities<br>4. Calculate CR<br>5. Save to bestiary | - Monster creates<br>- Stats validate<br>- Abilities add<br>- CR calculates correctly<br>- Monster saves | P0 |
| Tavern Interaction | 1. Enter tavern<br>2. Talk to NPC<br>3. Accept quest<br>4. Complete quest<br>5. Claim reward | - Tavern loads<br>- NPC interaction works<br>- Quest accepts<br>- Quest completes<br>- Reward claims | P1 |

### Critical Path Tests

| Path | Steps | Test Cases | Priority |
|------|-------|------------|----------|
| AI-Powered Content Generation | 1. User requests content<br>2. Frontend routes to AI provider<br>3. AI provider calls LLM<br>4. LLM generates response<br>5. Response validates with schema<br>6. Content displays to user | - Request routes correctly<br>- Provider selected correctly<br>- LLM call succeeds<br>- Response validates<br>- Content displays<br>- Errors handled at each step | P0 |
| File System Persistence | 1. User makes change<br>2. State updates in store<br>3. Store triggers save<br>4. Data written to file<br>5. File watcher detects change<br>6. UI updates | - State updates<br>- Save triggers<br>- File writes<br>- Watcher detects<br>- UI updates<br>- Errors handled | P0 |
| State Management Flow | 1. Component mounts<br>2. Hook initializes<br>3. Store selector subscribes<br>4. State changes<br>5. Component re-renders<br>6. Component unmounts | - Mount works<br>- Hook initializes<br>- Subscription works<br>- Re-render works<br>- Cleanup works | P0 |
| Cross-Platform Path Handling | 1. User selects file path<br>2. Path normalized for OS<br>3. File operation executes<br>4. Result returns<br>5. Path displayed to user | - Path normalizes correctly on Windows<br>- Path normalizes correctly on POSIX<br>- Operation succeeds<br>- Result returns<br>- Display shows correct path | P0 |
| Multi-Step Workflow | 1. User starts workflow<br>2. Step 1 completes<br>3. State persists<br>4. Step 2 loads from state<br>5. Workflow completes | - Workflow starts<br>- Step 1 completes<br>- State persists<br>- Step 2 loads<br>- Workflow completes | P0 |

### Error Recovery Tests

| Scenario | Error Condition | Recovery Steps | Priority |
|----------|-----------------|----------------|----------|
| AI Provider Failure | LLM API returns 500 error | - Retry with exponential backoff<br>- Switch to fallback provider<br>- Display error to user<br>- Allow manual retry | P0 |
| File System Write Error | Disk full or permission denied | - Display error to user<br>- Queue write for retry<br>- Offer alternative location<br>- Preserve in-memory state | P0 |
| Network Timeout | API request times out | - Retry with increased timeout<br>- Display loading indicator<br>- Allow cancel<br>- Cache partial results | P0 |
| Invalid User Input | User enters invalid data | - Validate input<br>- Display specific error<br>- Highlight invalid fields<br>- Prevent submission | P0 |
| Schema Validation Failure | AI response doesn't match schema | - Retry generation<br>- Display validation error<br>- Offer manual edit<br>- Log failure for analysis | P0 |
| Concurrent File Access | Multiple processes write same file | - Detect conflict<br>- Merge changes if possible<br>- Prompt user to resolve<br>- Create backup copies | P1 |
| Memory Limit Exceeded | Large dataset causes memory error | - Detect memory pressure<br>- Paginate data<br>- Display warning<br>- Offer cleanup options | P1 |
| Corrupt Save File | Save file is corrupted | - Detect corruption<br>- Attempt repair<br>- Load backup<br>- Notify user | P0 |
| Authentication Failure | API key invalid or expired | - Clear stored key<br>- Prompt for new key<br>- Validate new key<br>- Retry operation | P0 |
| Ensemble Disconnection | Player loses connection | - Detect disconnection<br>- Pause session<br>- Show reconnection UI<br>- Resume on reconnect | P1 |

## 4. Test Coverage Goals

### Coverage Targets by Module

| Module Type | Target Coverage | Current Status |
|-------------|-----------------|----------------|
| React Components | 80%+ | TBD |
| React Hooks | 90%+ | TBD |
| React Utilities | 95%+ | TBD |
| React Services | 85%+ | TBD |
| Zustand Stores | 85%+ | TBD |
| Python Routers | 85%+ | TBD |
| Python Services | 90%+ | TBD |
| Python Models | 100% | TBD |
| Python Core Modules | 85%+ | TBD |
| Tauri Commands | 80%+ | TBD |

### Critical Path Coverage

| Feature | Coverage Priority |
|---------|-------------------|
| AI Generation | P0 |
| File Persistence | P0 |
| State Management | P0 |
| Error Handling | P0 |
| Retry Logic | P0 |
| Schema Validation | P0 |
| Cross-System Communication | P0 |
| User Authentication | P1 |
| Ensemble Sync | P1 |
| Caching | P1 |

## 5. Test Infrastructure Recommendations

### Mocking Strategy

**AI Services Mocking:**
- Create mock implementations for all AI providers (Ollama, OpenAI, Claude, Gemini)
- Mock LLM responses with realistic data matching schemas
- Use `vi.fn()` for Vitest and `MagicMock` for pytest
- Mock streaming responses with incremental data chunks
- Mock error scenarios (timeouts, rate limits, invalid responses)

**File System Mocking:**
- Use `memfs` or similar for in-memory file system in tests
- Mock Tauri file commands with in-memory storage
- Mock Python file operations with `tempfile` and `tmp_path`
- Test both success and error scenarios

**Network Mocking:**
- Use `msw` (Mock Service Worker) for frontend HTTP mocking
- Use `responses` or `httpx-mock` for Python HTTP mocking
- Mock all external API calls
- Test network error scenarios

**State Mocking:**
- Mock Zustand stores with `create()` and custom initial state
- Mock IndexedDB with `fake-indexeddb`
- Reset state between tests

### Test Data Management

**Fixtures:**
- Create reusable test fixtures for common entities (NPCs, monsters, locations)
- Use `vitest/fixtures.ts` for frontend fixtures
- Use `conftest.py` for Python fixtures
- Organize fixtures by domain (bestiary, encounters, locations)

**Factories:**
- Create factory functions for generating test data
- Use `faker` for generating realistic data
- Support variations for different test scenarios

**Test Data Storage:**
- Store test data in `src/tests/fixtures/` and `python-backend/tests/fixtures/`
- Use JSON/YAML for structured test data
- Version test data alongside code

### CI/CD Integration

**Automated Testing:**
- Run unit tests on every push
- Run integration tests on pull requests
- Run E2E tests on main branch
- Use GitHub Actions or similar

**Test Reporting:**
- Generate coverage reports with `c8` (frontend) and `pytest-cov` (backend)
- Upload coverage to Codecov or similar
- Fail PRs if coverage decreases

**Parallel Execution:**
- Run tests in parallel where possible
- Use `vitest --pool` for parallel frontend tests
- Use `pytest-xdist` for parallel Python tests

**Environment Setup:**
- Use Docker containers for consistent test environments
- Spin up test databases and services
- Clean up resources after tests

## 6. Testing Gaps Analysis

### Missing Test Coverage

| Area | Current Coverage | Gap | Recommended Action |
|------|------------------|-----|---------------------|
| AI Provider Retry Logic | Partial | No tests for exponential backoff timing<br>No tests for max retry limit<br>No tests for retry on specific error codes | Add retry logic tests to each AI provider test file |
| Streaming Response Parsing | Partial | No tests for incomplete chunks<br>No tests for malformed SSE<br>No tests for connection mid-stream | Add streaming tests with various edge cases |
| Entity Development Handlers | None | No tests for developScene<br>No tests for developLocation<br>No tests for developNpc<br>No tests for developFaction | Create comprehensive test file for adventureHandlers.ts |
| Zustand Store Persistence | Partial | No tests for IndexedDB sync<br>No tests for persistence middleware<br>No tests for state hydration | Add persistence tests for each store |
| Tauri File Watching | None | No tests for file watcher<br>No tests for event emission<br>No tests for recursive watching | Create integration tests for file watching |
| Python Queue Manager | Partial | No tests for concurrent job processing<br>No tests for job priority<br>No tests for queue persistence | Add comprehensive queue manager tests |
| RAG Service | Partial | No tests for vector store operations<br>No tests for document indexing<br>No tests for relevance scoring | Add RAG integration tests |
| Error Boundary | None | No tests for ErrorBoundary component<br>No tests for GenerationErrorBoundary<br>No tests for error recovery UI | Create error boundary test suite |
| Visual Regression | Minimal | Only baseline screenshots exist<br>No comprehensive visual test coverage<br>No cross-browser testing | Expand visual regression test suite |
| Ensemble Mode | None | No tests for ensemble store<br>No tests for player connection<br>No tests for content sync | Create ensemble mode test suite |

### Test Quality Issues

| Issue | Impact | Recommended Fix |
|-------|--------|-----------------|
| Tests use real AI API calls | Slow, flaky, requires API keys | Mock all AI API calls in tests |
| Tests depend on external services | Flaky when services unavailable | Use service mocks and fixtures |
| No test isolation | Tests interfere with each other | Reset state between tests, use unique IDs |
| Insufficient error scenario testing | Production errors not caught | Add negative test cases |
| No performance testing | Performance regressions go unnoticed | Add performance benchmarks |
| Limited accessibility testing | Accessibility issues not caught | Add a11y tests with axe-core |
| Snapshot tests not updated | Tests fail on unrelated changes | Update snapshots and review changes |
| No contract testing | API changes break integration | Add contract tests for API boundaries |

### Priority Implementation Recommendations

**Phase 1: Critical Path Testing (P0)**
1. Implement AI provider retry logic tests
2. Add streaming response parsing tests
3. Create entity development handler tests
4. Add Zustand store persistence tests
5. Implement file system operation tests
6. Add cross-system integration tests

**Phase 2: Core Functionality Testing (P1)**
1. Create error boundary test suite
2. Add Python queue manager tests
3. Implement RAG service tests
4. Add ensemble mode tests
5. Expand visual regression tests

**Phase 3: Comprehensive Coverage (P2)**
1. Add performance benchmarks
2. Implement accessibility testing
3. Add contract testing
4. Expand E2E test coverage
5. Add security testing

---

**Document Version:** 1.0  
**Date:** 2025-02-03  
**Author:** Test Plan Audit
