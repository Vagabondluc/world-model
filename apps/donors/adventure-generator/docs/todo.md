# Session Todo: AI Grounding & Stitch UI

## 🟢 [T-706] AI Grounding Service (The "Brain")
**Context:** Inject map awareness into the AI System Prompt.
**TDD Reference:** `docs/tdd/ai_grounding_and_stitch_tdd.md`

### Phase 1: Logic Engine (Unit Tests)
- [ ] **Scaffold:** Create `src/services/GroundingService.ts` and test file. <!-- id: 100 -->
- [ ] **Test:** `getEffectiveBiome(hex)` (Resolves overrides). <!-- id: 101 -->
- [ ] **mplement:** `getEffectiveBiome` logic. <!-- id: 102 -->
- [ ] **Test:** `getTags(hex)` (Accumulates location + region tags). <!-- id: 103 -->
- [ ] **Implement:** `getTags` logic. <!-- id: 104 -->
- [ ] **Test:** `serializeBiome` & `serializeTags` (Natural language conversion). <!-- id: 105 -->
- [ ] **Implement:** Serialization logic (Mock Dictionary for now). <!-- id: 106 -->

### Phase 2: Integration & Injection
- [ ] **Test:** `constructSystemPrompt` (Injection ordering). <!-- id: 200 -->
- [ ] **Implement:** `constructSystemPrompt` to prepend Context before Instructions. <!-- id: 201 -->
- [ ] **Test:** `truncateContext` (Token budgeting ~250 tokens). <!-- id: 202 -->
- [ ] **Implement:** Trucation logic (Simple char limit or word count). <!-- id: 203 -->
- [ ] **Hook:** Wire up to `LocationStore` in the actual app. <!-- id: 204 -->

---

## 🔵 [T-710] Stitch UI Polish (The "Spatial Anchor")
**Context:** Clean architecture and View Transitions for navigation.
**TDD Reference:** `docs/tdd/ai_grounding_and_stitch_tdd.md`

### Phase 1: Theme Architecture
- [ ] **Test:** `useTheme` hook applies data-attributes to root. <!-- id: 300 -->
- [ ] **Implement:** `useTheme` hook & `LayerTheme` definitions. <!-- id: 301 -->
- [ ] **CSS:** Define CSS Variables for `[data-theme='shadowfell']` etc. in `index.css`. <!-- id: 302 -->

### Phase 2: Visual Transitions
- [ ] **Test:** `useViewTransition` fallback logic (runs callback if API missing). <!-- id: 400 -->
- [ ] **Implement:** `useViewTransition` hook. <!-- id: 401 -->
- [ ] **Integration:** Apply `useViewTransition` to the "Zoom to Tavern" action. <!-- id: 402 -->
- [ ] **CSS:** Add `view-transition-name` to `MapCanvas` and `LocationSidebar`. <!-- id: 403 -->

## 🐍 [T-800] Python Backend (Ensemble Sidecar)
**Context:** Moving AI logic to Python for Instructor/RAG capabilities.
**TDD Reference:** docs/tdd/python_backend_tdd.md

### Phase 1: Environment & Models
- [x] **Scaffold:** Initialize python-backend with lternative content. <!-- id: 500 -->
- [x] **Test:** 	est_env.py (Verify imports/setup). <!-- id: 501 -->
- [x] **Test:** 	est_models.py (Pydantic validation for NPC/Encounter). <!-- id: 502 -->
- [x] **Implement:** models.py (Using lternative/models.py as base). <!-- id: 503 -->

### Phase 2: AI Logic (Mocked)
- [x] **Test:** 	est_generator.py (Mocked Instructor calls). <!-- id: 600 -->
- [x] **Implement:** services/generator_service.py (Refactor from lternative/routers). <!-- id: 601 -->
- [x] **Test:** 	est_rag.py (Mocked LlamaIndex). <!-- id: 602 -->
- [x] **Implement:** services/rag_service.py (Using lternative/rag_service.py as base). <!-- id: 603 -->

### Phase 3: API Surface
- [x] **Test:** 	est_api_integration.py (FastAPI TestClient). <!-- id: 700 -->
- [x] **Implement:** main.py routing & dependency injection. <!-- id: 701 -->
- [x] **Integration:** Update Frontend OllamaImpl to optionally use Backend. <!-- id: 702 -->

---

## ✅ [DEC-077] Faction Clock Automation
**Status:** Complete
**Context:** Faction progress is often forgotten by GMs.
**Decision:** Integrate encounter outcomes with automatically advancing clocks.
**Completion Notes:**
- Extended faction schema with FactionClock, ClockEvent, and ResolutionMethod types
- Created visual clock components (FactionClock, ClockSegment, ClockLegend, ClockForm)
- Implemented factionClockStore with CRUD operations, progress management, and resolution logic
- Added encounter outcome integration with faction clock advancement
- Created downtime roller UI (DowntimeRoller, FactionClockManager, FactionClockPanel, ProgressEventViewer)
- Integrated with compendium views and encounter system

---

## ✅ [DEC-078] CR Solver Optimization
**Status:** Complete
**Context:** Precise CR balancing is difficult manually.
**Decision:** Build an iterative stat optimizer to nudge monster stats toward target CR.
**Completion Notes:**
- Enhanced monsterScaler algorithm with improved convergence, dynamic step sizing, and stagnation detection
- Added stat adjustment priorities (defense first, offense first, balance checking)
- Enhanced damage parsing for complex expressions
- Added feature preservation logic for legendary actions and special traits
- Implemented fractional CR support
- Created UI components (CRSolverPanel, CRAdjustmentSummary, CRComparisonDisplay)
- Integrated into Monster Creator with target CR input and solver options
- Added before/after comparison feedback
