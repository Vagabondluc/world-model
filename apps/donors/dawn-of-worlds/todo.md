# Implementation Todo List

## Current Focus: Documentation & Code Quality

### Phase 1: Mapping Guide Completion
- [ ] Review and finalize `docs/guide_to_mapping/05 - Mapping Your World.md`
- [ ] Verify all mapping guide chapters are complete and consistent
- [ ] Add visual examples/diagrams to mapping documentation
- [ ] Cross-reference mapping guide with existing specs

### Phase 2: DRY Violations Refactoring
Based on `plans/DRY-ANALYSIS.md`, address critical violations:

#### Critical Priority
- [ ] **Validation Patterns**: Extract shared validation logic from `age1.ts`, `age2.ts`, `age3.ts` into `logic/actions/shared.ts`
- [ ] **Serialization Logic**: Create unified `logic/serialization.ts` for Map/Set handling
- [ ] **Player State Init**: Consolidate player state initialization into `logic/playerState.ts`
- [ ] **Event Construction**: Create event builder factory in `logic/actions/builders.ts`
- [ ] **Hex Coordinate Keys**: Consolidate hex key generation in `logic/geometry.ts`
- [ ] **Export Functionality**: Create shared `utils/export.ts` utility
- [ ] **Event Filtering**: Extract event filters to `logic/eventFilters.ts`

#### High Priority
- [ ] **Toggle Button Pattern**: Create reusable `ToggleButton` component
- [ ] **Glow/Icon Mapping**: Unify visual config in `logic/biomes.ts`
- [ ] **Modal Headers**: Create reusable `ModalHeader` component
- [ ] **Hex Neighbor Logic**: Consolidate to single implementation in `geometry.ts`
- [ ] **Audio Context**: Refactor with higher-order function pattern

### Phase 3: Standalone Globe Project
- [ ] Verify standalone globe project builds independently
- [ ] Document globe project setup and usage
- [ ] Test globe interaction features (biome colors, hover, selection)
- [ ] Create integration guide for globe renderer

### Phase 4: Testing & Validation
- [ ] Run full build verification for main project
- [ ] Run full build verification for standalone globe
- [ ] Perform user acceptance testing for 3-Age playthrough
- [ ] Test multiplayer synchronization
- [ ] Verify mobile experience

### Phase 5: Release Preparation (v0.9 → v1.0)
- [ ] Complete user guide documentation
- [ ] Finalize rulebook integration
- [ ] Create deployment guide
- [ ] Prepare release notes
- [ ] Tag v1.0 release

## Post-Release Enhancements
- [ ] Advanced export (PDF/Markdown timelines)
- [ ] Network relay upgrade (WebRTC/WebSocket)
- [ ] UI theme skinning system

## Notes
- Main project preview running on port (check terminal)
- Standalone globe preview running separately
- Focus on code quality and maintainability before v1.0 release