# TODO Comments in Code

## Encounter Stores: AI Service integration (line 31)
For each file:
- [x] Open file and inspect current store API surface.
- [x] Define AI service interface for this store.
- [x] Add request action (build prompt/input payload).
- [x] Add response handler (parse + update state).
- [x] Add error/loading states.
- [x] Add unit test for AI call flow.

Files:
- [x] `useCombatEncounterStore.ts`
- [x] `useEncounterdesignV1DeprecatedStore.ts`
- [x] `useUrbanCrawlStore.ts`
- [x] `useTrapPrepStore.ts`
- [x] `useSocialEventStore.ts`
- [x] `useRpgadventureScenecraftingV1Store.ts`
- [x] `useEncounterGenricBetaStore.ts`
- [x] `useEncounterdesignV1Store.ts`
- [x] `useEncounterdesignOlderV1Store.ts`
- [x] `useCombatEncounterV2Store.ts`
- [x] `useCombatEncounterBalancerStore.ts`

## Services & Utils

`jobGenerator.ts` (line 122)
- [x] Open file and locate biome affinity TODO.
- [x] Define weighting rules and inputs.
- [x] Implement weighting function.
- [x] Add unit tests for weighting.

`persistenceService.ts` (line 59, line 100)
- [x] Open file and locate load locations/assets TODO.
- [x] Implement load paths for Locations and Assets.
- [x] Add granular save operations.
- [x] Add tests for load/save.

## Schemas

`faction.ts` (line 53)
- [x] Open file and locate legacy `factionClock`.
- [x] Verify migration completion path.
- [x] Remove field and update schema.
- [x] Update any consumers/tests.

## Components

`ActiveTrapPanel.tsx` (line 78)
- [x] Open file and locate dice rolling TODO.
- [x] Define dice roll inputs/outputs.
- [x] Implement roll logic.
- [x] Add UI update for roll results.
- [x] Add unit tests.

## Scripts

`extract_schemas.py` (line 70)
- [x] Open file and locate Instructor TODO.
- [x] Define actual Instructor API call.
- [x] Implement request/response parsing.
- [x] Add tests or a dry-run mode.
