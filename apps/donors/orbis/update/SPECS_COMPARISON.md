# Orbis 1.0 Update - Specs Comparison Analysis

**Generated:** 2026-02-14  
**Purpose:** Compare Orbis 1.0/update specs to main project specs and identify updates needed

---

## Summary

This document compares the specifications in `Orbis 1.0/update/specs/` with the main project specifications in `docs/specs/`. The analysis identifies:

1. Specs that exist in both locations (need synchronization check)
2. Specs that only exist in main project (need to be added to update)
3. Specs that only exist in update (need to be verified)

---

## Analysis Results

### Specs in Both Locations (Synchronization Needed)

| Orbis 1.0/update | Main Project | Status |
|-------------------|--------------|--------|
| `specs/00-data-types.md` | `docs/specs/00-core-foundation/00-data-types.md` | ⚠️ Needs sync |
| `specs/01-time-clock-system.md` | `docs/specs/00-core-foundation/01-time-clock-system.md` | ⚠️ Needs sync |
| `specs/02-magnetosphere.md` | `docs/specs/20-world-generation/02-magnetosphere.md` | ⚠️ Needs sync |
| `specs/02-metric-registry.md` | `docs/specs/00-core-foundation/90-metric-registry.md` | ⚠️ Needs sync |
| `specs/03-climate-system.md` | `docs/specs/20-world-generation/03-climate-system.md` | ⚠️ Needs sync |
| `specs/03-threshold-registry.md` | `docs/specs/00-core-foundation/93-threshold-registry.md` | ⚠️ Needs sync |
| `specs/04-carbon-cycle.md` | `docs/specs/20-world-generation/04-carbon-cycle.md` | ⚠️ Needs sync |
| `specs/04-mvp-acceptance-gates.md` | `docs/specs/00-core-foundation/94-mvp-acceptance-gates.md` | ⚠️ Needs sync |
| `specs/05-biosphere-capacity.md` | `docs/specs/10-life-ecology/05-biosphere-capacity.md` | ⚠️ Needs sync |
| `specs/06-species-archetypes.md` | `docs/specs/10-life-ecology/06-species-archetypes.md` | ⚠️ Needs sync |
| `specs/07-species-modules.md` | `docs/specs/10-life-ecology/07-species-modules.md` | ⚠️ Needs sync |
| `specs/08-species-template-procedural-biology.md` | `docs/specs/10-life-ecology/08-species-template-procedural-biology.md` | ⚠️ Needs sync |
| `specs/09-fantasy-race-templates.md` | `docs/specs/10-life-ecology/09-fantasy-race-templates.md` | ⚠️ Needs sync |
| `specs/09-narrative-dashboard-mockups.md` | `docs/ui-ux/09-narrative-dashboard-mockups.md` | ⚠️ Needs sync |
| `specs/10-easy-win-dashboard-catalog.md` | `docs/ui-ux/10-easy-win-dashboard-catalog.md` | ⚠️ Needs sync |
| `specs/10-life-engine.md` | `docs/specs/10-life-ecology/10-life-engine.md` | ⚠️ Needs sync |
| `specs/11-deterministic-event-ordering.md` | `docs/specs/00-core-foundation/11-deterministic-event-ordering.md` | ⚠️ Needs sync |
| `specs/12-atmosphere-console-spec.md` | `docs/ui-ux/12-atmosphere-console-spec.md` | ⚠️ Needs sync |
| `specs/12-trophic-energy.md` | `docs/specs/10-life-ecology/12-trophic-energy.md` | ⚠️ Needs sync |
| `specs/13-population-dynamics.md` | `docs/specs/10-life-ecology/13-population-dynamics.md` | ⚠️ Needs sync |
| `specs/13-wind-weather-viewer-spec.md` | `docs/ui-ux/13-wind-weather-viewer-spec.md` | ⚠️ Needs sync |
| `specs/14-mass-extinction.md` | `docs/specs/10-life-ecology/14-mass-extinction.md` | ⚠️ Needs sync |
| `specs/14-ocean-currents-viewer-spec.md` | `docs/ui-ux/14-ocean-currents-viewer-spec.md` | ⚠️ Needs sync |
| `specs/15-adaptive-radiation.md` | `docs/specs/10-life-ecology/15-adaptive-radiation.md` | ⚠️ Needs sync |
| `specs/15-biome-stability-atlas-spec.md` | `docs/ui-ux/15-biome-stability-atlas-spec.md` | ⚠️ Needs sync |
| `specs/16-refugia-colonization.md` | `docs/specs/10-life-ecology/16-refugia-colonization.md` | ⚠️ Needs sync |
| `specs/16-species-viewer-spec.md` | `docs/ui-ux/16-species-viewer-spec.md` | ⚠️ Needs sync |
| `specs/17-bestiary.md` | `docs/specs/10-life-ecology/17-bestiary.md` | ⚠️ Needs sync |
| `specs/17-food-web-dashboard-spec.md` | `docs/ui-ux/17-food-web-dashboard-spec.md` | ⚠️ Needs sync |
| `specs/18-invasive-disease-watch-spec.md` | `docs/ui-ux/18-invasive-disease-watch-spec.md` | ⚠️ Needs sync |
| `specs/18-nomenclature.md` | `docs/specs/10-life-ecology/18-nomenclature.md` | ⚠️ Needs sync |
| `specs/19-biome-stability.md` | `docs/specs/20-world-generation/19-biome-stability.md` | ⚠️ Needs sync |
| `specs/19-civilization-pulse-spec.md` | `docs/ui-ux/19-civilization-pulse-spec.md` | ⚠️ Needs sync |
| `specs/20-hydrology-coupling.md` | `docs/specs/20-world-generation/20-hydrology-coupling.md` | ⚠️ Needs sync |
| `specs/20-settlement-viability-map-spec.md` | `docs/ui-ux/20-settlement-viability-map-spec.md` | ⚠️ Needs sync |
| `specs/21-climate-transport.md` | `docs/specs/20-world-generation/21-climate-transport.md` | ⚠️ Needs sync |
| `specs/21-trade-supply-lanes-spec.md` | `docs/ui-ux/21-trade-supply-lanes-spec.md` | ⚠️ Needs sync |
| `specs/22-conflict-forecast-board-spec.md` | `docs/ui-ux/22-conflict-forecast-board-spec.md` | ⚠️ Needs sync |
| `specs/22-geological-epoch.md` | `docs/specs/20-world-generation/22-geological-epoch.md` | ⚠️ Needs sync |
| `specs/23-event-forge-v2-spec.md` | `docs/ui-ux/23-event-forge-v2-spec.md` | ⚠️ Needs sync |
| `specs/23-voxel-projection.md` | `docs/specs/60-projection-performance/23-voxel-projection.md` | ⚠️ Needs sync |
| `specs/24-arc-composer-timeline-spec.md` | `docs/ui-ux/24-arc-composer-timeline-spec.md` | ⚠️ Needs sync |
| `specs/24-performance-lod.md` | `docs/specs/60-projection-performance/24-performance-lod.md` | ⚠️ Needs sync |
| `specs/24-species-civilization-emergence-bridge.md` | `docs/specs/10-life-ecology/104-species-civilization-emergence-bridge.md` | ⚠️ Needs sync |
| `specs/25-region-story-cards-spec.md` | `docs/ui-ux/25-region-story-cards-spec.md` | ⚠️ Needs sync |
| `specs/25-resource-generation.md` | `docs/specs/20-world-generation/25-resource-generation.md` | ⚠️ Needs sync |
| `specs/26-erosion-sediment.md` | `docs/specs/20-world-generation/26-erosion-sediment.md` | ⚠️ Needs sync |
| `specs/26-solver-validity-monitor-spec.md` | `docs/ui-ux/26-solver-validity-monitor-spec.md` | ⚠️ Needs sync |
| `specs/27-determinism-replay-integrity-spec.md` | `docs/ui-ux/27-determinism-replay-integrity-spec.md` | ⚠️ Needs sync |
| `specs/27-settlement-suitability.md` | `docs/specs/20-world-generation/27-settlement-suitability.md` | ⚠️ Needs sync |
| `specs/28-benchmark-scenarios-panel-spec.md` | `docs/ui-ux/28-benchmark-scenarios-panel-spec.md` | ⚠️ Needs sync |
| `specs/28-movement-cost.md` | `docs/specs/20-world-generation/28-movement-cost.md` | ⚠️ Needs sync |
| `specs/29-faction-territorial-growth.md` | `docs/specs/20-world-generation/29-faction-territorial-growth.md` | ⚠️ Needs sync |
| `specs/29-parameter-provenance-explorer-spec.md` | `docs/ui-ux/29-parameter-provenance-explorer-spec.md` | ⚠️ Needs sync |
| `specs/30-cross-scale-tick-synchronization.md` | `docs/specs/30-runtime-determinism/30-cross-scale-tick-synchronization.md` | ⚠️ Needs sync |
| `specs/30-tag-explorer-spec.md` | `docs/ui-ux/30-tag-explorer-spec.md` | ⚠️ Needs sync |
| `specs/31-simulator-dashboard.md` | `docs/specs/30-runtime-determinism/31-simulator-dashboard.md` | ⚠️ Needs sync |
| `specs/31-world-compare-ab-spec.md` | `docs/ui-ux/31-world-compare-ab-spec.md` | ⚠️ Needs sync |
| `specs/32-easy-win-dashboard-mockups.md` | `docs/ui-ux/32-easy-win-dashboard-mockups.md` | ⚠️ Needs sync |
| `specs/32-need-driven-behavior.md` | `docs/specs/30-runtime-determinism/32-need-driven-behavior.md` | ⚠️ Needs sync |
| `specs/33-ui-implied-contracts-spec.md` | `docs/ui-ux/33-ui-implied-contracts-spec.md` | ⚠️ Needs sync |
| `specs/33-universal-tag-system.md` | `docs/specs/30-runtime-determinism/33-universal-tag-system.md` | ⚠️ Needs sync |
| `specs/34-deterministic-models.md` | `docs/specs/30-runtime-determinism/34-deterministic-models.md` | ⚠️ Needs sync |
| `specs/34-reusable-component-library-spec.md` | `docs/ui-ux/34-reusable-component-library-spec.md` | ⚠️ Needs sync |
| `specs/35-dashboard-panel-definitions-spec.md` | `docs/ui-ux/35-dashboard-panel-definitions-spec.md` | ⚠️ Needs sync |
| `specs/35-deterministic-rng.md` | `docs/specs/30-runtime-determinism/35-deterministic-rng.md` | ⚠️ Needs sync |
| `specs/36-domain-mode-policy.md` | `docs/specs/30-runtime-determinism/36-domain-mode-policy.md` | ⚠️ Needs sync |
| `specs/37-domain-dashboard-contract.md` | `docs/specs/30-runtime-determinism/37-domain-dashboard-contract.md` | ⚠️ Needs sync |
| `specs/38-unified-tag-system.md` | `docs/specs/30-runtime-determinism/38-unified-tag-system.md` | ⚠️ Needs sync |
| `specs/39-deterministic-utility-decision.md` | `docs/specs/30-runtime-determinism/39-deterministic-utility-decision.md` | ⚠️ Needs sync |
| `specs/40-action-resolution-world-delta.md` | `docs/specs/30-runtime-determinism/40-action-resolution-world-delta.md` | ⚠️ Needs sync |
| `specs/40-onboarding-planet-pulse.md` | `docs/ui-ux/40-onboarding-planet-pulse.md` | ⚠️ Needs sync |
| `specs/41-onboarding-atmosphere-console.md` | `docs/ui-ux/41-onboarding-atmosphere-console.md` | ⚠️ Needs sync |
| `specs/41-tag-interaction-math.md` | `docs/specs/30-runtime-determinism/41-tag-interaction-math.md` | ⚠️ Needs sync |
| `specs/42-onboarding-wind-weather.md` | `docs/ui-ux/42-onboarding-wind-weather.md` | ⚠️ Needs sync |
| `specs/42-species-gameplay-ratings.md` | `docs/specs/10-life-ecology/42-species-gameplay-ratings.md` | ⚠️ Needs sync |
| `specs/43-encounter-packaging-plugin.md` | `docs/specs/40-actions-gameplay/43-encounter-packaging-plugin.md` | ⚠️ Needs sync |
| `specs/44-disaster-active-event-system.md` | `docs/specs/40-actions-gameplay/44-disaster-active-event-system.md` | ⚠️ Needs sync |
| `specs/45-economic-flow-trade-network.md` | `docs/specs/40-actions-gameplay/45-economic-flow-trade-network.md` | ⚠️ Needs sync |
| `specs/49-climate-solver-contract-ebm.md` | `docs/specs/50-solver-contracts/49-climate-solver-contract-ebm.md` | ⚠️ Needs sync |
| `specs/50-hydrology-solver-contract.md` | `docs/specs/50-solver-contracts/50-hydrology-solver-contract.md` | ⚠️ Needs sync |
| `specs/51-refugia-colonization-solver-contract.md` | `docs/specs/50-solver-contracts/51-refugia-colonization-solver-contract.md` | ⚠️ Needs sync |
| `specs/52-population-dynamics-predator-prey-stability.md` | `docs/specs/50-solver-contracts/52-population-dynamics-predator-prey-stability.md` | ⚠️ Needs sync |
| `specs/53-spatial-query-biome-region-tagging.md` | `docs/specs/20-world-generation/53-spatial-query-biome-region-tagging.md` | ⚠️ Needs sync |
| `specs/54-field-representation-projection-contract.md` | `docs/specs/60-projection-performance/54-field-representation-projection-contract.md` | ⚠️ Needs sync |
| `specs/55-seed-digest-contract.md` | `docs/specs/30-runtime-determinism/55-seed-digest-contract.md` | ⚠️ Needs sync |
| `specs/56-unified-parameter-registry-schema-contract.md` | `docs/specs/30-runtime-determinism/56-unified-parameter-registry-schema-contract.md` | ⚠️ Needs sync |
| `specs/57-save-load-snapshot-contract.md` | `docs/specs/30-runtime-determinism/57-save-load-snapshot-contract.md` | ⚠️ Needs sync |
| `specs/58-state-authority-contract.md` | `docs/specs/30-runtime-determinism/58-state-authority-contract.md` | ⚠️ Needs sync |
| `specs/59-worlddelta-validation-invariant-enforcement.md` | `docs/specs/30-runtime-determinism/59-worlddelta-validation-invariant-enforcement.md` | ⚠️ Needs sync |
| `specs/60-event-schema-reason-code-registry.md` | `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md` | ⚠️ Needs sync |
| `specs/61-multi-axial-world-generation.md` | `docs/specs/20-world-generation/61-multi-axial-world-generation.md` | ⚠️ Needs sync |
| `specs/62-specialized-biomes.md` | `docs/specs/20-world-generation/62-specialized-biomes.md` | ⚠️ Needs sync |
| `specs/63-baked-texture-spec.md` | `docs/specs/60-projection-performance/63-baked-texture-spec.md` | ⚠️ Needs sync |
| `specs/64-depression-filling-flow-routing.md` | `docs/specs/20-world-generation/64-depression-filling-flow-routing.md` | ⚠️ Needs sync |
| `specs/65-edit-propagation-policy.md` | `docs/specs/60-projection-performance/65-edit-propagation-policy.md` | ⚠️ Needs sync |
| `specs/66-coastal-orchestrator.md` | `docs/specs/20-world-generation/66-coastal-orchestrator.md` | ⚠️ Needs sync |
| `specs/67-runtime-lod-chunking-performance.md` | `docs/specs/60-projection-performance/67-runtime-lod-chunking-performance.md` | ⚠️ Needs sync |
| `specs/68-numerical-stability-fixed-point-math-contract.md` | `docs/specs/30-runtime-determinism/68-numerical-stability-fixed-point-math-contract.md` | ⚠️ Needs sync |
| `specs/69-deterministic-curve-lut-library.md` | `docs/specs/30-runtime-determinism/69-deterministic-curve-lut-library.md` | ⚠️ Needs sync |
| `specs/70-canonical-normalization-remapping.md` | `docs/specs/30-runtime-determinism/70-canonical-normalization-remapping.md` | ⚠️ Needs sync |
| `specs/71-domain-dependency-graph-execution-phases.md` | `docs/specs/70-governance-benchmarks/71-domain-dependency-graph-execution-phases.md` | ⚠️ Needs sync |
| `specs/72-cross-domain-feedback-forcing.md` | `docs/specs/70-governance-benchmarks/72-cross-domain-feedback-forcing.md` | ⚠️ Needs sync |
| `specs/73-phase-transition-regime-change.md` | `docs/specs/70-governance-benchmarks/73-phase-transition-regime-change.md` | ⚠️ Needs sync |
| `specs/74-regime-metrics-observables.md` | `docs/specs/70-governance-benchmarks/74-regime-metrics-observables.md` | ⚠️ Needs sync |
| `specs/75-benchmark-scenario-contract.md` | `docs/specs/70-governance-benchmarks/75-benchmark-scenario-contract.md` | ⚠️ Needs sync |
| `specs/76-ui-ai-reason-code-registry.md` | `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md` | ⚠️ Needs sync |
| `specs/77-registry-reason-codes.md` | `docs/specs/00-core-foundation/77-registry-reason-codes.md` | ⚠️ Needs sync |
| `specs/78-math-primitives.md` | `docs/specs/00-core-foundation/78-math-primitives.md` | ⚠️ Needs sync |
| `specs/79-impact-propagation-engine.md` | `docs/specs/70-governance-benchmarks/79-impact-propagation-engine.md` | ⚠️ Needs sync |
| `specs/79-tech-impact-matrix-contract.md` | `docs/specs/70-governance-benchmarks/79-tech-impact-matrix-contract.md` | ⚠️ Needs sync |
| `specs/80-sociological-ideology-tree.md` | `docs/specs/70-governance-benchmarks/80-sociological-ideology-tree.md` | ⚠️ Needs sync |
| `specs/80-impact-propagation-engine.md` | `docs/specs/70-governance-benchmarks/80-impact-propagation-engine.md` | ⚠️ Needs sync |
| `specs/81-government-form-system.md` | `docs/specs/70-governance-benchmarks/81-government-form-system.md` | ⚠️ Needs sync |
| `specs/81-regime-transition-state-machine.md` | `docs/specs/70-governance-benchmarks/81-regime-transition-state-machine.md` | ⚠️ Needs sync |
| `specs/82-government-transition-system.md` | `docs/specs/70-governance-benchmarks/82-government-transition-system.md` | ⚠️ Needs sync |
| `specs/82-sociological-ideology-tree.md` | `docs/specs/70-governance-benchmarks/82-sociological-ideology-tree.md` | ⚠️ Needs sync |
| `specs/83-civil-war-fragmentation-simulator.md` | `docs/specs/70-governance-benchmarks/83-civil-war-fragmentation-simulator.md` | ⚠️ Needs sync |
| `specs/83-faction-interest-group-generator.md` | `docs/specs/70-governance-benchmarks/83-faction-interest-group-generator.md` | ⚠️ Needs sync |
| `specs/84-institution-elite-layer.md` | `docs/specs/70-governance-benchmarks/84-institution-elite-layer.md` | ⚠️ Needs sync |
| `specs/84-legitimacy-and-authority-engine.md` | `docs/specs/70-governance-benchmarks/84-legitimacy-and-authority-engine.md` | ⚠️ Needs sync |
| `specs/85-elite-actor-character-engine.md` | `docs/specs/70-governance-benchmarks/85-elite-actor-character-engine.md` | ⚠️ Needs sync |
| `specs/85-narrative-and-myth-production-engine.md` | `docs/specs/70-governance-benchmarks/85-narrative-and-myth-production-engine.md` | ⚠️ Needs sync |
| `specs/86-information-control-and-media-engine.md` | `docs/specs/70-governance-benchmarks/86-information-control-and-media-engine.md` | ⚠️ Needs sync |
| `specs/86-information-narrative-engine.md` | `docs/specs/70-governance-benchmarks/86-information-narrative-engine.md` | ⚠️ Needs sync |
| `specs/87-collective-emotion-engine.md` | `docs/specs/70-governance-benchmarks/87-collective-emotion-engine.md` | ⚠️ Needs sync |
| `specs/87-player-control-bridge.md` | `docs/specs/70-governance-benchmarks/87-player-control-bridge.md` | ⚠️ Needs sync |
| `specs/88-db-ai-ux-implementation-bridge.md` | `docs/specs/70-governance-benchmarks/88-db-ai-ux-implementation-bridge.md` | ⚠️ Needs sync |
| `specs/88-decision-engine-integration.md` | `docs/specs/70-governance-benchmarks/88-decision-engine-integration.md` | ⚠️ Needs sync |
| `specs/89-hierarchical-temporal-tiers.md` | `docs/specs/00-core-foundation/89-hierarchical-temporal-tiers.md` | ⚠️ Needs sync |
| `specs/89-save-schema-core-eventlog-snapshot-ppm.md` | `docs/specs/70-governance-benchmarks/89-save-schema-core-eventlog-snapshot-ppm.md` | ⚠️ Needs sync |
| `specs/89-unit-actor-construction.md` | `docs/specs/70-governance-benchmarks/89-unit-actor-construction.md` | ⚠️ Needs sync |
| `specs/90-action-defs-and-deterministic-preview-model.md` | `docs/specs/70-governance-benchmarks/90-action-defs-and-deterministic-preview-model.md` | ⚠️ Needs sync |
| `specs/90-project-production-management.md` | `docs/specs/70-governance-benchmarks/90-project-production-management.md` | ⚠️ Needs sync |
| `specs/91-population-task-assignment.md` | `docs/specs/70-governance-benchmarks/91-population-task-assignment.md` | ⚠️ Needs sync |
| `specs/91-roguejs-orbis-responsibility-matrix.md` | `docs/specs/40-actions-gameplay/91-roguejs-orbis-responsibility-matrix.md` | ⚠️ Needs sync |
| `specs/91-situation-room-and-action-picker-ux-backbone.md` | `docs/specs/70-governance-benchmarks/91-situation-room-and-action-picker-ux-backbone.md` | ⚠️ Needs sync |
| `specs/92-dungeon-geometry-generator.md` | `docs/specs/70-governance-benchmarks/92-dungeon-geometry-generator.md` | ⚠️ Needs sync |
| `specs/92-phased-addition-factions-institutions-actors.md` | `docs/specs/70-governance-benchmarks/92-phased-addition-factions-institutions-actors.md` | ⚠️ Needs sync |
| `specs/92-render-adapter-layer.md` | `docs/specs/40-actions-gameplay/92-render-adapter-layer.md` | ⚠️ Needs sync |
| `specs/93-belief-narrative-activation-plan.md` | `docs/specs/70-governance-benchmarks/93-belief-narrative-activation-plan.md` | ⚠️ Needs sync |
| `specs/93-settlement-urban-realizer.md` | `docs/specs/70-governance-benchmarks/93-settlement-urban-realizer.md` | ⚠️ Needs sync |
| `specs/94-dungeon-loot-hazard-distribution.md` | `docs/specs/70-governance-benchmarks/94-dungeon-loot-hazard-distribution.md` | ⚠️ Needs sync |
| `specs/94-government-form-system.md` | `docs/specs/70-governance-benchmarks/94-government-form-system.md` | ⚠️ Needs sync |
| `specs/95-government-transition-system.md` | `docs/specs/70-governance-benchmarks/95-government-transition-system.md` | ⚠️ Needs sync |
| `specs/95-urban-growth-lifecycle.md` | `docs/specs/70-governance-benchmarks/95-urban-growth-lifecycle.md` | ⚠️ Needs sync |
| `specs/96-civil-war-fragmentation-simulator.md` | `docs/specs/70-governance-benchmarks/96-civil-war-fragmentation-simulator.md` | ⚠️ Needs sync |
| `specs/96-role-bucket-efficiency-math.md` | `docs/specs/70-governance-benchmarks/96-role-bucket-efficiency-math.md` | ⚠️ Needs sync |
| `specs/97-chronicler-historiography-system.md` | `docs/specs/70-governance-benchmarks/97-chronicler-historiography-system.md` | ⚠️ Needs sync |
| `specs/97-rogue-adventure-bridge.md` | `docs/specs/70-governance-benchmarks/97-rogue-adventure-bridge.md` | ⚠️ Needs sync |
| `specs/98-dice-box-threejs-integration.md` | `docs/specs/40-actions-gameplay/98-dice-box-threejs-integration.md` | ⚠️ Needs sync |
| `specs/99-dice-orchestration-bridge.md` | `docs/specs/40-actions-gameplay/99-dice-orchestration-bridge.md` | ⚠️ Needs sync |
| `specs/100-roguejs-orbis-responsibility-matrix.md` | `docs/specs/40-actions-gameplay/100-roguejs-orbis-responsibility-matrix.md` | ⚠️ Needs sync |
| `specs/101-render-adapter-layer.md` | `docs/specs/40-actions-gameplay/101-render-adapter-layer.md` | ⚠️ Needs sync |
| `specs/102-century-compression-rules.md` | `docs/specs/40-actions-gameplay/102-century-compression-rules.md` | ⚠️ Needs sync |
| `specs/102-documentary-mode.md` | `docs/specs/40-actions-gameplay/102-documentary-mode.md` | ⚠️ Needs sync |
| `specs/102-mvp-roadmap-credible-causality.md` | `docs/specs/70-governance-benchmarks/102-mvp-roadmap-credible-causality.md` | ⚠️ Needs sync |
| `specs/103-great-person-biography-generator.md` | `docs/specs/70-governance-benchmarks/103-great-person-biography-generator.md` | ⚠️ Needs sync |
| `specs/103-hardening-checklist.md` | `docs/specs/70-governance-benchmarks/103-hardening-checklist.md` | ⚠️ Needs sync |
| `specs/103-playable-museum-interface.md` | `docs/specs/40-actions-gameplay/103-playable-museum-interface.md` | ⚠️ Needs sync |
| `specs/104-civilization-multipliers-catalog.md` | `docs/specs/70-governance-benchmarks/104-civilization-multipliers-catalog.md` | ⚠️ Needs sync |
| `specs/104-species-civilization-emergence-bridge.md` | `docs/specs/10-life-ecology/104-species-civilization-emergence-bridge.md` | ⚠️ Needs sync |
| `specs/105-brainstorm-critique-and-priority-fixes.md` | `docs/specs/70-governance-benchmarks/105-brainstorm-critique-and-priority-fixes.md` | ⚠️ Needs sync |
| `specs/106-century-compression-rules.md` | `docs/specs/40-actions-gameplay/106-century-compression-rules.md` | ⚠️ Needs sync |
| `specs/106-scale-genre-matrix.md` | `docs/specs/70-governance-benchmarks/106-scale-genre-matrix.md` | ⚠️ Needs sync |
| `specs/107-cross-scale-information-contract.md` | `docs/specs/70-governance-benchmarks/107-cross-scale-information-contract.md` | ⚠️ Needs sync |
| `specs/107-great-person-biography-generator.md` | `docs/specs/40-actions-gameplay/107-great-person-biography-generator.md` | ⚠️ Needs sync |
| `specs/108-multi-resolution-data-architecture.md` | `docs/specs/70-governance-benchmarks/108-multi-resolution-data-architecture.md` | ⚠️ Needs sync |
| `specs/109-memory-storage-explosion-control.md` | `docs/specs/70-governance-benchmarks/109-memory-storage-explosion-control.md` | ⚠️ Needs sync |
| `specs/109-narrative-stability-policy.md` | `docs/specs/40-actions-gameplay/109-narrative-stability-policy.md` | ⚠️ Needs sync |
| `specs/110-wonder-generator-system.md` | `docs/specs/70-governance-benchmarks/110-wonder-generator-system.md` | ⚠️ Needs sync |
| `specs/110-mean-field-intent-field-contract.md` | `docs/specs/70-governance-benchmarks/110-mean-field-intent-field-contract.md` | ⚠️ Needs sync |
| `specs/111-tech-tree-design-deep-search-integration.md` | `docs/specs/70-governance-benchmarks/111-tech-tree-design-deep-search-integration.md` | ⚠️ Needs sync |
| `specs/111-template-history-generation-contract.md` | `docs/specs/40-actions-gameplay/111-template-history-generation-contract.md` | ⚠️ Needs sync |
| `specs/112-bit-packed-actor-state-contract.md` | `docs/specs/30-runtime-determinism/112-bit-packed-actor-state-contract.md` | ⚠️ Needs sync |
| `specs/112-core-architecture-integration-map.md` | `docs/specs/70-governance-benchmarks/112-core-architecture-integration-map.md` | ⚠️ Needs sync |
| `specs/113-canonical-key-registry.md` | `docs/specs/70-governance-benchmarks/113-canonical-key-registry.md` | ⚠️ Needs sync |
| `specs/113-influence-map-navigation-contract.md` | `docs/specs/60-projection-performance/113-influence-map-navigation-contract.md` | ⚠️ Needs sync |
| `specs/114-threshold-and-reasoncode-registry.md` | `docs/specs/70-governance-benchmarks/114-threshold-and-reasoncode-registry.md` | ⚠️ Needs sync |
| `specs/115-panel-data-contracts.md` | `docs/specs/70-governance-benchmarks/115-panel-data-contracts.md` | ⚠️ Needs sync |
| `specs/116-tech-tree-research-report-synthesis.md` | `docs/specs/70-governance-benchmarks/116-tech-tree-research-report-synthesis.md` | ⚠️ Needs sync |
| `specs/117-best-of-market-tech-tree-patterns.md` | `docs/specs/70-governance-benchmarks/117-best-of-market-tech-tree-patterns.md` | ⚠️ Needs sync |
| `specs/118-tech-coverage-audit.md` | `docs/specs/70-governance-benchmarks/118-tech-coverage-audit.md` | ⚠️ Needs sync |
| `specs/119-tech-mitigation-parity.md` | `docs/specs/70-governance-benchmarks/119-tech-mitigation-parity.md` | ⚠️ Needs sync |
| `specs/120-era-impact-scaling.md` | `docs/specs/70-governance-benchmarks/120-era-impact-scaling.md` | ⚠️ Needs sync |
| `specs/121-tech-environmental-forcing.md` | `docs/specs/70-governance-benchmarks/121-tech-environmental-forcing.md` | ⚠️ Needs sync |
| `specs/122-causality-trace-contract.md` | `docs/specs/70-governance-benchmarks/122-causality-trace-contract.md` | ⚠️ Needs sync |
| `specs/123-brainstorm-to-spec-promotion-gate.md` | `docs/specs/70-governance-benchmarks/123-brainstorm-to-spec-promotion-gate.md` | ⚠️ Needs sync |
| `specs/124-evolution-to-civilization-bridge.md` | `docs/specs/70-governance-benchmarks/124-evolution-to-civilization-bridge.md` | ⚠️ Needs sync |
| `specs/124-species-to-unit-abstraction.md` | `docs/specs/70-governance-benchmarks/124-species-to-unit-abstraction.md` | ⚠️ Needs sync |
| `specs/125-cognitive-ecology-and-social-forms.md` | `docs/specs/70-governance-benchmarks/125-cognitive-ecology-and-social-forms.md` | ⚠️ Needs sync |
| `specs/125-fantasy-race-unit-bestiary.md` | `docs/specs/70-governance-benchmarks/125-fantasy-race-unit-bestiary.md` | ⚠️ Needs sync |
| `specs/126-surplus-population-and-tech-affordance.md` | `docs/specs/70-governance-benchmarks/126-surplus-population-and-tech-affordance.md` | ⚠️ Needs sync |
| `specs/126-unaffiliated-creatures-plants-bestiary.md` | `docs/specs/70-governance-benchmarks/126-unaffiliated-creatures-plants-bestiary.md` | ⚠️ Needs sync |
| `specs/127-civilization-emergence-trigger-engine.md` | `docs/specs/70-governance-benchmarks/127-civilization-emergence-trigger-engine.md` | ⚠️ Needs sync |
| `specs/127-expanded-unaffiliated-creature-bestiary.md` | `docs/specs/70-governance-benchmarks/127-expanded-unaffiliated-creature-bestiary.md` | ⚠️ Needs sync |
| `specs/128-institutional-differentiation-engine.md` | `docs/specs/70-governance-benchmarks/128-institutional-differentiation-engine.md` | ⚠️ Needs sync |
| `specs/128-linguistic-name-bank.md` | `docs/specs/70-governance-benchmarks/128-linguistic-name-bank.md` | ⚠️ Needs sync |
| `specs/129-legitimacy-and-authority-engine.md` | `docs/specs/70-governance-benchmarks/129-legitimacy-and-authority-engine.md` | ⚠️ Needs sync |
| `specs/130-narrative-and-myth-production-engine.md` | `docs/specs/70-governance-benchmarks/130-narrative-and-myth-production-engine.md` | ⚠️ Needs sync |
| `specs/131-information-control-and-media-engine.md` | `docs/specs/70-governance-benchmarks/131-information-control-and-media-engine.md` | ⚠️ Needs sync |
| `specs/132-collective-emotion-engine.md` | `docs/specs/70-governance-benchmarks/132-collective-emotion-engine.md` | ⚠️ Needs sync |
| `specs/133-decision-engine-integration.md` | `docs/specs/70-governance-benchmarks/133-decision-engine-integration.md` | ⚠️ Needs sync |
| `specs/134-tech-tree-simulation-interconnects.md` | `docs/specs/70-governance-benchmarks/134-tech-tree-simulation-interconnects.md` | ⚠️ Needs sync |
| `specs/135-exactly-once-idempotency-contract.md` | `docs/specs/30-runtime-determinism/135-exactly-once-idempotency-contract.md` | ⚠️ Needs sync |
| `specs/135-typescript-simulation-architecture.md` | `docs/specs/70-governance-benchmarks/135-typescript-simulation-architecture.md` | ⚠️ Needs sync |
| `specs/136-hierarchical-pathfinding-hpa.md` | `docs/specs/70-governance-benchmarks/136-hierarchical-pathfinding-hpa.md` | ⚠️ Needs sync |
| `specs/136-telemetry-observability-envelope.md` | `docs/specs/30-runtime-determinism/136-telemetry-observability-envelope.md` | ⚠️ Needs sync |
| `specs/137-simulation-validation-gate-chain.md` | `docs/specs/70-governance-benchmarks/137-simulation-validation-gate-chain.md` | ⚠️ Needs sync |
| `specs/137-visibility-fog-of-war-engine.md` | `docs/specs/70-governance-benchmarks/137-visibility-fog-of-war-engine.md` | ⚠️ Needs sync |
| `specs/138-shared-spec-policy-clauses.md` | `docs/specs/30-runtime-determinism/138-shared-spec-policy-clauses.md` | ⚠️ Needs sync |
| `specs/138-utility-ai-decision-engine.md` | `docs/specs/70-governance-benchmarks/138-utility-ai-decision-engine.md` | ⚠️ Needs sync |
| `specs/139-deterministic-rule-conformance.md` | `docs/specs/30-runtime-determinism/139-deterministic-rule-conformance.md` | ⚠️ Needs sync |
| `specs/139-macro-economic-input-output-model.md` | `docs/specs/70-governance-benchmarks/139-macro-economic-input-output-model.md` | ⚠️ Needs sync |
| `specs/140-narrative-ai-director.md` | `docs/specs/70-governance-benchmarks/140-narrative-ai-director.md` | ⚠️ Needs sync |
| `specs/140-magic-spell-catalog-core.md` | `docs/specs/40-actions-gameplay/140-magic-spell-catalog-core.md` | ⚠️ Needs sync |
| `specs/141-cultural-drift-and-social-structures.md` | `docs/specs/70-governance-benchmarks/141-cultural-drift-and-social-structures.md` | ⚠️ Needs sync |
| `specs/141-magic-learning-and-progression-contract.md` | `docs/specs/40-actions-gameplay/141-magic-learning-and-progression-contract.md` | ⚠️ Needs sync |
| `specs/142-global-logistics-supply-graph.md` | `docs/specs/70-governance-benchmarks/142-global-logistics-supply-graph.md` | ⚠️ Needs sync |
| `specs/142-magic-equipment-and-artifacts-contract.md` | `docs/specs/40-actions-gameplay/142-magic-equipment-and-artifacts-contract.md` | ⚠️ Needs sync |
| `specs/143-ecological-causality-kernels.md` | `docs/specs/70-governance-benchmarks/143-ecological-causality-kernels.md` | ⚠️ Needs sync |
| `specs/143-non-magic-tag-taxonomy.md` | `docs/specs/30-runtime-determinism/143-non-magic-tag-taxonomy.md` | ⚠️ Needs sync |
| `specs/144-zoom-dependent-spawning-contract.md` | `docs/specs/70-governance-benchmarks/144-zoom-dependent-spawning-contract.md` | ⚠️ Needs sync |
| `specs/144-tag-interaction-matrix-expansion.md` | `docs/specs/30-runtime-determinism/144-tag-interaction-matrix-expansion.md` | ⚠️ Needs sync |
| `specs/145-procedural-history-compression.md` | `docs/specs/70-governance-benchmarks/145-procedural-history-compression.md` | ⚠️ Needs sync |
| `specs/145-action-point-economy-contract.md` | `docs/specs/40-actions-gameplay/145-action-point-economy-contract.md` | ⚠️ Needs sync |
| `specs/146-hardened-species-evolution-kernel.md` | `docs/specs/70-governance-benchmarks/146-hardened-species-evolution-kernel.md` | ⚠️ Needs sync |
| `specs/146-species-evolution-kernel.md` | `docs/specs/10-life-ecology/146-species-evolution-kernel.md` | ⚠️ Needs sync |
| `specs/147-tactical-combat-resolution.md` | `docs/specs/70-governance-benchmarks/147-tactical-combat-resolution.md` | ⚠️ Needs sync |
| `specs/147-character-action-catalog-contract.md` | `docs/specs/40-actions-gameplay/147-character-action-catalog-contract.md` | ⚠️ Needs sync |
| `specs/148-multi-user-sync-contract.md` | `docs/specs/70-governance-benchmarks/148-multi-user-sync-contract.md` | ⚠️ Needs sync |
| `specs/148-spell-research-and-discovery-contract.md` | `docs/specs/40-actions-gameplay/148-spell-research-and-discovery-contract.md` | ⚠️ Needs sync |
| `specs/149-magical-leyline-physics.md` | `docs/specs/70-governance-benchmarks/149-magical-leyline-physics.md` | ⚠️ Needs sync |
| `specs/149-mana-regeneration-and-channeling-contract.md` | `docs/specs/40-actions-gameplay/149-mana-regeneration-and-channeling-contract.md` | ⚠️ Needs sync |
| `specs/149-leyline-physics-kernel.md` | `docs/specs/10-life-ecology/149-leyline-physics-kernel.md` | ⚠️ Needs sync |
| `specs/150-magic-system-architecture.md` | `docs/specs/70-governance-benchmarks/150-magic-system-architecture.md` | ⚠️ Needs sync |
| `specs/150-multi-spell-combination-contract.md` | `docs/specs/40-actions-gameplay/150-multi-spell-combination-contract.md` | ⚠️ Needs sync |
| `specs/151-divine-magic-god-powers.md` | `docs/specs/70-governance-benchmarks/151-divine-magic-god-powers.md` | ⚠️ Needs sync |
| `specs/151-anti-magic-and-resistance-contract.md` | `docs/specs/40-actions-gameplay/151-anti-magic-and-resistance-contract.md` | ⚠️ Needs sync |
| `specs/152-high-magic-strategic-spells.md` | `docs/specs/70-governance-benchmarks/152-high-magic-strategic-spells.md` | ⚠️ Needs sync |
| `specs/152-action-cooldown-families-contract.md` | `docs/specs/40-actions-gameplay/152-action-cooldown-families-contract.md` | ⚠️ Needs sync |
| `specs/153-unit-tactical-magic.md` | `docs/specs/70-governance-benchmarks/153-unit-tactical-magic.md` | ⚠️ Needs sync |
| `specs/153-action-validation-contract.md` | `docs/specs/40-actions-gameplay/153-action-validation-contract.md` | ⚠️ Needs sync |
| `specs/154-magical-creature-elementalization.md` | `docs/specs/70-governance-benchmarks/154-magical-creature-elementalization.md` | ⚠️ Needs sync |
| `specs/154-elementalization-system.md` | `docs/specs/10-life-ecology/154-elementalization-system.md` | ⚠️ Needs sync |
| `specs/154-action-queue-and-execution-contract.md` | `docs/specs/40-actions-gameplay/154-action-queue-and-execution-contract.md` | ⚠️ Needs sync |
| `specs/155-emergent-zodiac-system.md` | `docs/specs/70-governance-benchmarks/155-emergent-zodiac-system.md` | ⚠️ Needs sync |
| `specs/155-action-visual-timing-adapter-contract.md` | `docs/specs/40-actions-gameplay/155-action-visual-timing-adapter-contract.md` | ⚠️ Needs sync |
| `specs/156-magic-tag-taxonomy.md` | `docs/specs/70-governance-benchmarks/156-magic-tag-taxonomy.md` | ⚠️ Needs sync |
| `specs/156-action-interruption-and-cancellation-contract.md` | `docs/specs/40-actions-gameplay/156-action-interruption-and-cancellation-contract.md` | ⚠️ Needs sync |
| `specs/157-creature-status-effect-system.md` | `docs/specs/70-governance-benchmarks/157-creature-status-effect-system.md` | ⚠️ Needs sync |
| `specs/157-unified-tag-explorer.md` | `docs/specs/70-governance-benchmarks/157-unified-tag-explorer.md` | ⚠️ Needs sync |
| `specs/157-action-undo-redo-policy-contract.md` | `docs/specs/40-actions-gameplay/157-action-undo-redo-policy-contract.md` | ⚠️ Needs sync |
| `specs/158-multi-scale-temporal-simulation.md` | `docs/specs/70-governance-benchmarks/158-multi-scale-temporal-simulation.md` | ⚠️ Needs sync |
| `specs/157-tag-explorer-interface.md` | `docs/specs/00-core-foundation/157-tag-explorer-interface.md` | ⚠️ Needs sync |
| `specs/158-action-replay-recording-contract.md` | `docs/specs/40-actions-gameplay/158-action-replay-recording-contract.md` | ⚠️ Needs sync |
| `specs/159-light-rpg-layer.md` | `docs/specs/40-actions-gameplay/159-light-rpg-layer.md` | ⚠️ Needs sync |
| `specs/159-unified-resource-system-contract.md` | `docs/specs/00-core-foundation/159-unified-resource-system-contract.md` | ⚠️ Needs sync |
| `specs/160-state-persistence-integration-contract.md` | `docs/specs/30-runtime-determinism/160-state-persistence-integration-contract.md` | ⚠️ Needs sync |
| `specs/161-social-networking.md` | `docs/specs/70-governance-benchmarks/161-social-networking.md` | ⚠️ Needs sync |
| `specs/161-unified-ui-integration-contract.md` | `docs/specs/40-actions-gameplay/161-unified-ui-integration-contract.md` | ⚠️ Needs sync |
| `specs/162-system-modding-extension-contract.md` | `docs/specs/30-runtime-determinism/162-system-modding-extension-contract.md` | ⚠️ Needs sync |
| `specs/162-zodiac-system-contract.md` | `docs/specs/70-governance-benchmarks/162-zodiac-system-contract.md` | ⚠️ Needs sync |
| `specs/163-government-npc-ai.md` | `docs/specs/70-governance-benchmarks/163-government-npc-ai.md` | ⚠️ Needs sync |
| `specs/163-spell-failure-and-backfire-contract.md` | `docs/specs/40-actions-gameplay/163-spell-failure-and-backfire-contract.md` | ⚠️ Needs sync |
| `specs/164-legislative-policy-impact.md` | `docs/specs/70-governance-benchmarks/164-legislative-policy-impact.md` | ⚠️ Needs sync |
| `specs/164-action-interruption-and-cancellation-contract.md` | `docs/specs/40-actions-gameplay/164-action-interruption-and-cancellation-contract.md` | ⚠️ Needs sync |
| `specs/165-procedural-history-archetypes.md` | `docs/specs/70-governance-benchmarks/165-procedural-history-archetypes.md` | ⚠️ Needs sync |
| `specs/165-tag-conflict-resolution-contract.md` | `docs/specs/30-runtime-determinism/165-tag-conflict-resolution-contract.md` | ⚠️ Needs sync |
| `specs/166-opportunity-reaction-actions-contract.md` | `docs/specs/40-actions-gameplay/166-opportunity-reaction-actions-contract.md` | ⚠️ Needs sync |
| `specs/166-knowledge-diffusion-kernel.md` | `docs/specs/70-governance-benchmarks/166-knowledge-diffusion-kernel.md` | ⚠️ Needs sync |
| `specs/167-magic-non-combat-usage-contract.md` | `docs/specs/40-actions-gameplay/167-magic-non-combat-usage-contract.md` | ⚠️ Needs sync |
| `specs/167-espionage-and-ip-theft-engine.md` | `docs/specs/70-governance-benchmarks/167-espionage-and-ip-theft-engine.md` | ⚠️ Needs sync |
| `specs/168-lifestyle-based-technology-floor.md` | `docs/specs/70-governance-benchmarks/168-lifestyle-based-technology-floor.md` | ⚠️ Needs sync |
| `specs/168-magic-skill-proficiency-contract.md` | `docs/specs/40-actions-gameplay/168-magic-skill-proficiency-contract.md` | ⚠️ Needs sync |
| `specs/169-summoned-creature-autonomy-contract.md` | `docs/specs/40-actions-gameplay/169-summoned-creature-autonomy-contract.md` | ⚠️ Needs sync |
| `specs/170-action-combo-chain-contract.md` | `docs/specs/40-actions-gameplay/170-action-combo-chain-contract.md` | ⚠️ Needs sync |
| `specs/171-action-cost-scaling-contract.md` | `docs/specs/40-actions-gameplay/171-action-cost-scaling-contract.md` | ⚠️ Needs sync |
| `specs/172-tag-visual-representation-contract.md` | `docs/specs/30-runtime-determinism/172-tag-visual-representation-contract.md` | ⚠️ Needs sync |
| `specs/173-magic-visual-effects-contract.md` | `docs/specs/40-actions-gameplay/173-magic-visual-effects-contract.md` | ⚠️ Needs sync |
| `specs/174-magic-audio-cues-contract.md` | `docs/specs/40-actions-gameplay/174-magic-audio-cues-contract.md` | ⚠️ Needs sync |
| `specs/175-tag-audio-representation-contract.md` | `docs/specs/30-runtime-determinism/175-tag-audio-representation-contract.md` | ⚠️ Needs sync |
| `specs/176-action-undo-redo-policy-contract.md` | `docs/specs/40-actions-gameplay/176-action-undo-redo-policy-contract.md` | ⚠️ Needs sync |
| `specs/177-action-replay-recording-contract.md` | `docs/specs/40-actions-gameplay/177-action-replay-recording-contract.md` | ⚠️ Needs sync |
| `specs/180-temporal-ui-gating-contract.md` | `docs/specs/30-runtime-determinism/180-temporal-ui-gating-contract.md` | ⚠️ Needs sync |
| `specs/181-visual-state-gating-and-adaptive-refresh.md` | `docs/specs/60-projection-performance/181-visual-state-gating-and-adaptive-refresh.md` | ⚠️ Needs sync |
| `specs/182-ui-performance-monitoring-and-budgets.md` | `docs/specs/60-projection-performance/182-ui-performance-monitoring-and-budgets.md` | ⚠️ Needs sync |
| `specs/185-civilizational-vulnerability-and-collapse.md` | `docs/specs/70-governance-benchmarks/185-civilizational-vulnerability-and-collapse.md` | ⚠️ Needs sync |
| `specs/186-demographic-transition-and-carrying-capacity.md` | `docs/specs/70-governance-benchmarks/186-demographic-transition-and-carrying-capacity.md` | ⚠️ Needs sync |
| `specs/187-malthusian-resource-feedback-loop.md` | `docs/specs/70-governance-benchmarks/187-malthusian-resource-feedback-loop.md` | ⚠️ Needs sync |
| `specs/188-group-monitoring-dashboard-spec.md` | `docs/specs/70-governance-benchmarks/188-group-monitoring-dashboard-spec.md` | ⚠️ Needs sync |
| `specs/189-governance-overstretch-kernel.md` | `docs/specs/70-governance-benchmarks/189-governance-overstretch-kernel.md` | ⚠️ Needs sync |
| `specs/190-plot-maturation-and-execution-queue.md` | `docs/specs/70-governance-benchmarks/190-plot-maturation-and-execution-queue.md` | ⚠️ Needs sync |
| `specs/95-event-log-tiering-policy.md` | `docs/specs/60-projection-performance/95-event-log-tiering-policy.md` | ⚠️ Needs sync |
| `specs/96-lazy-agent-spawning-contract.md` | `docs/specs/60-projection-performance/96-lazy-agent-spawning-contract.md` | ⚠️ Needs sync |
| `specs/97-hierarchical-pathfinding-contract.md` | `docs/specs/60-projection-performance/97-hierarchical-pathfinding-contract.md` | ⚠️ Needs sync |
| `specs/102-documentary-mode.md` | `docs/specs/40-actions-gameplay/102-documentary-mode.md` | ⚠️ Needs sync |
| `specs/138-utility-ai-decision-engine.md` | `docs/specs/40-actions-gameplay/138-utility-ai-decision-engine.md` | ⚠️ Needs sync |

---

## Specs Only in Main Project (Need to Add to Update)

The following specs exist in the main project but are missing from `Orbis 1.0/update/specs/`:

### Core Foundation (00-core-foundation/)
- `docs/specs/00-core-foundation/157-tag-explorer-interface.md`
- `docs/specs/00-core-foundation/159-unified-resource-system-contract.md`

### Life & Ecology (10-life-ecology/)
- `docs/specs/10-life-ecology/104-species-civilization-emergence-bridge.md`
- `docs/specs/10-life-ecology/121-environmental-forcing-kernel.md`
- `docs/specs/10-life-ecology/143-ecological-causality-kernel.md`
- `docs/specs/10-life-ecology/146-species-evolution-kernel.md`
- `docs/specs/10-life-ecology/149-leyline-physics-kernel.md`
- `docs/specs/10-life-ecology/154-elementalization-system.md`

### World Generation (20-world-generation/)
- `docs/specs/20-world-generation/53-spatial-query-biome-region-tagging.md`
- `docs/specs/20-world-generation/61-multi-axial-world-generation.md`
- `docs/specs/20-world-generation/62-specialized-biomes.md`
- `docs/specs/20-world-generation/64-depression-filling-flow-routing.md`
- `docs/specs/20-world-generation/66-coastal-orchestrator.md`

### Runtime Determinism (30-runtime-determinism/)
- `docs/specs/30-runtime-determinism/55-seed-digest-contract.md`
- `docs/specs/30-runtime-determinism/60-event-schema-reason-code-registry.md`
- `docs/specs/30-runtime-determinism/76-ui-ai-reason-code-registry.md`
- `docs/specs/30-runtime-determinism/112-bit-packed-actor-state-contract.md`
- `docs/specs/30-runtime-determinism/135-exactly-once-idempotency-contract.md`
- `docs/specs/30-runtime-determinism/136-telemetry-observability-envelope.md`
- `docs/specs/30-runtime-determinism/143-non-magic-tag-taxonomy.md`
- `docs/specs/30-runtime-determinism/144-tag-interaction-matrix-expansion.md`
- `docs/specs/30-runtime-determinism/152-tag-intensity-decay-growth-contract.md`
- `docs/specs/30-runtime-determinism/153-tag-propagation-contract.md`
- `docs/specs/30-runtime-determinism/154-tag-driven-ai-modifier-contract.md`
- `docs/specs/30-runtime-determinism/160-state-persistence-integration-contract.md`
- `docs/specs/30-runtime-determinism/162-system-modding-extension-contract.md`
- `docs/specs/30-runtime-determinism/165-tag-conflict-resolution-contract.md`
- `docs/specs/30-runtime-determinism/172-tag-visual-representation-contract.md`
- `docs/specs/30-runtime-determinism/175-tag-audio-representation-contract.md`
- `docs/specs/30-runtime-determinism/180-temporal-ui-gating-contract.md`

### Actions & Gameplay (40-actions-gameplay/)
- `docs/specs/40-actions-gameplay/44-disaster-active-event-system.md`
- `docs/specs/40-actions-gameplay/45-economic-flow-trade-network.md`
- `docs/specs/40-actions-gameplay/111-template-history-generation-contract.md`
- `docs/specs/40-actions-gameplay/140-magic-spell-catalog-core.md`
- `docs/specs/40-actions-gameplay/141-magic-learning-and-progression-contract.md`
- `docs/specs/40-actions-gameplay/142-magic-equipment-and-artifacts-contract.md`
- `docs/specs/40-actions-gameplay/145-action-point-economy-contract.md`
- `docs/specs/40-actions-gameplay/147-character-action-catalog-contract.md`
- `docs/specs/40-actions-gameplay/148-spell-research-and-discovery-contract.md`
- `docs/specs/40-actions-gameplay/149-mana-regeneration-and-channeling-contract.md`
- `docs/specs/40-actions-gameplay/150-multi-spell-combination-contract.md`
- `docs/specs/40-actions-gameplay/151-anti-magic-and-resistance-contract.md`
- `docs/specs/40-actions-gameplay/152-action-cooldown-families-contract.md`
- `docs/specs/40-actions-gameplay/153-action-validation-contract.md`
- `docs/specs/40-actions-gameplay/154-action-queue-and-execution-contract.md`
- `docs/specs/40-actions-gameplay/155-action-visual-timing-adapter-contract.md`
- `docs/specs/40-actions-gameplay/156-action-interruption-and-cancellation-contract.md`
- `docs/specs/40-actions-gameplay/157-action-undo-redo-policy-contract.md`
- `docs/specs/40-actions-gameplay/158-action-replay-recording-contract.md`
- `docs/specs/40-actions-gameplay/159-light-rpg-layer.md`
- `docs/specs/40-actions-gameplay/161-unified-ui-integration-contract.md`
- `docs/specs/40-actions-gameplay/163-spell-failure-and-backfire-contract.md`
- `docs/specs/40-actions-gameplay/164-action-interruption-and-cancellation-contract.md`
- `docs/specs/40-actions-gameplay/165-procedural-history-archetypes.md`
- `docs/specs/40-actions-gameplay/166-opportunity-reaction-actions-contract.md`
- `docs/specs/40-actions-gameplay/167-magic-non-combat-usage-contract.md`
- `docs/specs/40-actions-gameplay/168-magic-skill-proficiency-contract.md`
- `docs/specs/40-actions-gameplay/169-summoned-creature-autonomy-contract.md`
- `docs/specs/40-actions-gameplay/170-action-combo-chain-contract.md`
- `docs/specs/40-actions-gameplay/171-action-cost-scaling-contract.md`
- `docs/specs/40-actions-gameplay/173-magic-visual-effects-contract.md`
- `docs/specs/40-actions-gameplay/174-magic-audio-cues-contract.md`
- `docs/specs/40-actions-gameplay/176-action-undo-redo-policy-contract.md`
- `docs/specs/40-actions-gameplay/177-action-replay-recording-contract.md`

### Projection & Performance (60-projection-performance/)
- `docs/specs/60-projection-performance/46-hex-lat-lon-band-mapping-contract.md`
- `docs/specs/60-projection-performance/47-field-representation-solver-basis.md`
- `docs/specs/60-projection-performance/48-field-id-registry-scale-table.md`
- `docs/specs/60-projection-performance/63-baked-texture-spec.md`
- `docs/specs/60-projection-performance/67-runtime-lod-chunking-performance.md`
- `docs/specs/60-projection-performance/95-event-log-tiering-policy.md`
- `docs/specs/60-projection-performance/96-lazy-agent-spawning-contract.md`
- `docs/specs/60-projection-performance/97-hierarchical-pathfinding-contract.md`
- `docs/specs/60-projection-performance/113-influence-map-navigation-contract.md`
- `docs/specs/60-projection-performance/181-visual-state-gating-and-adaptive-refresh.md`
- `docs/specs/60-projection-performance/182-ui-performance-monitoring-and-budgets.md`

### Governance & Benchmarks (70-governance-benchmarks/)
- `docs/specs/70-governance-benchmarks/110-mean-field-intent-field-contract.md`
- `docs/specs/70-governance-benchmarks/161-social-networking.md`
- `docs/specs/70-governance-benchmarks/162-zodiac-system-contract.md`
- `docs/specs/70-governance-benchmarks/163-government-npc-ai.md`
- `docs/specs/70-governance-benchmarks/164-legislative-policy-impact.md`
- `docs/specs/70-governance-benchmarks/166-knowledge-diffusion-kernel.md`
- `docs/specs/70-governance-benchmarks/167-espionage-and-ip-theft-engine.md`
- `docs/specs/70-governance-benchmarks/168-lifestyle-based-technology-floor.md`
- `docs/specs/70-governance-benchmarks/185-civilizational-vulnerability-and-collapse.md`
- `docs/specs/70-governance-benchmarks/186-demographic-transition-and-carrying-capacity.md`
- `docs/specs/70-governance-benchmarks/187-malthusian-resource-feedback-loop.md`
- `docs/specs/70-governance-benchmarks/188-group-monitoring-dashboard-spec.md`
- `docs/specs/70-governance-benchmarks/189-governance-overstretch-kernel.md`
- `docs/specs/70-governance-benchmarks/190-plot-maturation-and-execution-queue.md`

### Orbis 2.0 Expansion (80-orbis-2.0-expansion/)
- `docs/specs/80-orbis-2.0-expansion/200-core-data-types.md`
- `docs/specs/80-orbis-2.0-expansion/201-mathematical-foundations.md`
- `docs/specs/80-orbis-2.0-expansion/202-magic-leyline-physics.md`
- `docs/specs/80-orbis-2.0-expansion/203-biological-ecological.md`
- `docs/specs/80-orbis-2.0-expansion/204-civilization-political.md`
- `docs/specs/80-orbis-2.0-expansion/205-rpg-actor-agency.md`
- `docs/specs/80-orbis-2.0-expansion/206-technical-economic-temporal.md`

---

## Recommendations

### 1. Sync Existing Specs

For specs that exist in both locations:
- Compare content and merge changes
- Keep the most recent version
- Ensure consistency between locations

### 2. Add Missing Specs

For specs that only exist in main project:
- Copy to `Orbis 1.0/update/specs/`
- Create corresponding TDD files
- Add to migration log

### 3. Update Migration Log

Update `spec-migration-log.txt` to reflect:
- Total specs in main project
- Specs successfully migrated
- Specs pending migration

### 4. Re-run Migration Script

After adding missing specs:
- Re-run the migration script
- Update TDD files
- Verify compatibility sections

---

**End of Specs Comparison Analysis**
