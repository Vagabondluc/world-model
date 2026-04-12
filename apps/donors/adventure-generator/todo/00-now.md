# Current Focus Pointer

This file is the single source of truth for “what next.” Update it after each meaningful slice is completed.

## Current Focus (1–3)
- [ ] Audit completion checklist (P0–P3) — update as items finish.
- [ ] Accessibility testing.
- [ ] Contract testing.

## Next After That (1–3)
- [ ] Data migration + versioning operationalization.
- [ ] Overlay/Backdrop component.
- [ ] Zustand store factory.

## Audit Completion Checklist

### P0 (Critical)
- [x] AI provider retry de-dup via BaseAIProvider. (proof: `src/services/ai/baseProvider.ts:7`)
- [x] AI provider streaming parsing de-dup (shared helper + provider refactor + tests). (proof: `src/services/ai/streamUtils.ts:3`, `src/tests/behavior/aiStreamingParsing.test.ts:1`)
- [x] Consolidate duplicate Pydantic encounter models. (proof: `python-backend/models/encounters.py:1`)
- [x] PRD tech stack corrected. (proof: `docs/specs/PRD.md:8`)
- [x] Error handling spec added. (proof: `docs/specs/error-handling.md:1`)
- [x] Storage strategy clarified. (proof: `docs/specs/persistence.md:9`)
- [x] Conflict resolution requirements added. (proof: `docs/specs/PRD.md:48`, `docs/specs/persistence.md:62`)

### P1 (High)
- [x] Critical path tests beyond retry/streaming (entity handlers, file watching, persistence). (proof: `src/tests/behavior/adventureHandlers.test.ts:1`, `src/tests/behavior/ensembleService.test.ts:1`, `src/tests/behavior/sessionImportValidation.test.ts:1`)
- [x] Documentation critique gaps (complete missing critiques or correct SUMMARY scope). (proof: `docs/audit/critique/docs/SUMMARY.md:10`)
- [x] Ambiguity review gaps (complete remaining specs or correct SUMMARY scope). (proof: `docs/audit/ambiguity/SUMMARY.md:10`)
- [x] Data migration/versioning strategy added. (proof: `docs/specs/state-migration.md:60`)
- [x] Backup/recovery procedures added. (proof: `docs/specs/PRD.md:89`)

### P2 (Medium)
- [x] Expand import.md (installation/versioning/security). (proof: `docs/import.md:3`)
- [x] Fix decisions.md to ADR format. (proof: `docs/decisions.md:1`)
- [x] Documentation templates + standards. (proof: `docs/templates/README.md:1`)
- [x] Add version tracking to documentation. (proof: `docs/specs/PRD.md:4`)
- [x] Add diagrams to technical docs. (proof: `docs/INFRASTRUCTURE.md:53`, `docs/specs/persistence.md:52`)
- [x] Expand INFRASTRUCTURE.md. (proof: `docs/INFRASTRUCTURE.md:46`)
- [x] Generic generator router (Python). (proof: `python-backend/routers/generator_router.py:1`)
- [x] Entity development handler factory. (proof: `src/stores/workflowStore.ts:35`)
- [x] aiProviderStore (centralized provider config). (proof: `src/stores/aiProviderStore.ts:1`)
- [x] Error boundary test suite. (proof: `src/tests/behavior/GenerationErrorBoundary.test.tsx:1`)
- [x] Python queue manager tests. (proof: `python-backend/tests/test_queue_manager.py:1`)
- [x] RAG service tests. (proof: `python-backend/tests/test_rag_retriever.py:1`)

### P3 (Low)
- [x] Data migration + versioning strategy fully operationalized (beyond spec). (proof: `src/services/sessionMigration.ts:1`)
- [x] Security/access control model spec. (proof: `docs/specs/security.md:1`)
- [x] Backup/recovery implementation. (proof: `src/services/backupService.ts:1`, `src/hooks/useAppSession.ts:108`)
- [x] Comprehensive architecture document. (proof: `docs/ARCHITECTURE.md:1`)
- [x] Overlay/Backdrop component. (proof: `src/components/common/Overlay.tsx:1`)
- [x] FilteredList component. (proof: `src/components/common/FilteredList.tsx:1`)
- [x] Zustand store factory. (proof: `src/stores/storeFactory.ts:1`)
- [x] Performance benchmarks. (proof: `src/tests/performanceBenchmarks.test.ts:1`)
- [ ] Accessibility testing. (proof: no axe/a11y test code outside audit docs; `rg "axe|a11y|accessibility" src python-backend docs` shows only audit references)
- [ ] Contract testing. (proof: `rg "contract test|pact|contract testing" -g "*"` no matches)
- [ ] Documentation review process. (proof: no policy doc outside audit references; `rg "review process|doc review" docs` only audit notes)
- [ ] Documentation style guide. (proof: no style guide doc; `rg "style guide" docs` only audit notes)
- [ ] Complete ambiguity review (if not already in P1 scope). (proof: only 4 spec reports in `docs/audit/ambiguity/specs/`)
- [ ] Complete documentation critique (if not already in P1 scope). (proof: critique docs exist but no explicit completion marker; see `docs/audit/critique/docs/` listing)
- [ ] Create missing codebase analysis document. (proof: `rg "codebase-analysis.md" docs` shows missing file referenced as not created)

## Last Completed (with date)
- [x] 2026-02-03: ActiveTrapPanel dice-roll flow implemented with “Last Checks” UI and tests.
- [x] 2026-02-03: Encounter stores wired to shared AI helper + tests + Vitest alias fix.
- [x] 2026-02-03: Schema validation expansion (delve, npc persona, encounter tactics) and session import schema wiring.
- [x] 2026-02-03: Added minimal session import validation test for SessionStateV2Schema.
- [x] 2026-02-03: PRD tech stack updated and storage strategy clarified in persistence spec.
- [x] 2026-02-03: Consolidated duplicate encounter config/result models in python-backend.
- [x] 2026-02-03: Added `docs/specs/error-handling.md` with retry and messaging standards.
- [x] 2026-02-03: Introduced BaseAIProvider and refactored OpenAI/Claude/Gemini/Ollama retry logic.
- [x] 2026-02-03: Added BaseAIProvider retry tests.
- [x] 2026-02-03: Documented conflict resolution for concurrent edits in PRD and persistence specs.
- [x] 2026-02-03: Added data migration/versioning strategy to state-migration spec.
- [x] 2026-02-03: Added backup and recovery requirements to PRD.
- [x] 2026-02-03: Added AI provider streaming parsing tests and fixed provider constructors.
- [x] 2026-02-03: TypeScript typecheck clean.
- [x] 2026-02-03: Corrected audit critique/ambiguity summaries to match actual coverage.
- [x] 2026-02-03: Added critical-path tests for adventure entity development handlers.
- [x] 2026-02-03: Added file-watching tests for EnsembleService.
- [x] 2026-02-03: Added documentation templates and applied version tracking headers.
- [x] 2026-02-03: Expanded import.md with version management and security guidance.
- [x] 2026-02-03: Expanded INFRASTRUCTURE.md with data flow, error handling, security, performance.
- [x] 2026-02-03: Updated decisions.md to ADR format fields.
- [x] 2026-02-03: Added Mermaid diagrams to INFRASTRUCTURE and persistence specs.
- [x] 2026-02-03: Added aiProviderStore and refactored workflow entity development via factory.
- [x] 2026-02-03: Added GenerationErrorBoundary tests.
- [x] 2026-02-04: Verified queue manager tests and RAG retriever tests exist in python-backend.
- [x] 2026-02-04: Added security/access control spec (`docs/specs/security.md`).
- [x] 2026-02-04: Added architecture overview (`docs/ARCHITECTURE.md`).
- [x] 2026-02-04: Added generic generator router and refactored NPC/encounter endpoints.
- [x] 2026-02-04: Fixed python-backend model import shadowing and verified router import smoke test.
- [x] 2026-02-04: Implemented local backups and restore flow (BackupService + UI wiring).
- [x] 2026-02-04: TypeScript typecheck clean.
- [x] 2026-02-04: Added session migration service and safe import path.
- [x] 2026-02-04: Session migration tests added and passing (vitest).
- [x] 2026-02-04: Performance benchmarks added and passing (vitest).
- [x] 2026-02-04: Added Overlay component and refactored Modal/Drawer to share escape + body lock.
- [x] 2026-02-04: Added FilteredList component and refactored list rendering.
- [x] 2026-02-04: Added store factory helpers and refactored settings/user/navigation stores.
