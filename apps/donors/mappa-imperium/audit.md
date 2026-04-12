# Project File Audit
**Date:** October 28, 2023
**Version:** 0.5.1

This document provides a comprehensive inventory of the Mappa Imperium project structure, categorizing files by their architectural role following the migration to the React/Vite/Zustand stack.

---

## 1. Root Configuration & Entry Points
Configuration files for build tools, dependencies, and environment settings.

- `/.env.local` (Local environment variables)
- `/.gitignore` (Git exclusion rules)
- `/filelist.txt` (File manifest)
- `/index.html` (Application entry point, includes inline Tailwind styles)
- `/package.json` (Project dependencies and scripts)
- `/postcss.config.js` (PostCSS configuration)
- `/README.md` (Project overview)
- `/tailwind.config.js` (Tailwind CSS configuration)
- `/tsconfig.json` (TypeScript compiler options)
- `/tsconfig.node.json` (TypeScript node options)
- `/vite.config.ts` (Vite build configuration)

---

## 2. Source Code (`/src`)
The core application logic, components, and state management.

### 2.1 Entry & Setup
- `/src/App.tsx` (Main application router and layout wrapper)
- `/src/main.tsx` (React DOM entry point)
- `/src/index.css` (Base CSS imports)
- `/src/types.ts` (Centralized TypeScript type definitions)

### 2.2 Components (`/src/components`)
User Interface components organized by feature.

#### Debug System (`/src/components/debug`)
- `/src/components/debug/UnifiedDebugSystem.tsx`
- `/src/components/debug/hooks/useConsoleLogger.ts`
- `/src/components/debug/hooks/useEnvironmentConstraints.ts`
- `/src/components/debug/hooks/useFileHealthCheck.ts`
- `/src/components/debug/hooks/usePerformanceMetrics.ts`
- `/src/components/debug/hooks/useSystemInfo.ts`
- `/src/components/debug/tabs/ConsoleTab.tsx`
- `/src/components/debug/tabs/EnvironmentConstraintsTab.tsx`
- `/src/components/debug/tabs/FileHealthTab.tsx`
- `/src/components/debug/tabs/GameToolsTab.tsx`
- `/src/components/debug/tabs/OverviewTab.tsx`
- `/src/components/debug/tabs/PerformanceTab.tsx`
- `/src/components/debug/tabs/SystemInfoTab.tsx`
- `/src/components/debug/types/debugTypes.ts`
- `/src/components/debug/utils/environment.ts`
- `/src/components/debug/utils/fileAnalysis.ts`
- `/src/components/debug/utils/reportExporter.ts`

#### Era Interfaces (`/src/components/era-interfaces`)
- `/src/components/era-interfaces/EraContent.tsx` (Era routing)
- `/src/components/era-interfaces/EraHomeContent.tsx`
- `/src/components/era-interfaces/EraCreationContent.tsx`
- `/src/components/era-interfaces/EraMythContent.tsx`
- `/src/components/era-interfaces/EraFoundationContent.tsx`
- `/src/components/era-interfaces/EraDiscoveryContent.tsx`
- `/src/components/era-interfaces/EraEmpiresContent.tsx`
- `/src/components/era-interfaces/EraCollapseContent.tsx`
- **Common**
    - `/src/components/era-interfaces/common/EraGameplayManager.tsx`
    - `/src/components/era-interfaces/common/EraLayoutContainer.tsx`
    - `/src/components/era-interfaces/common/GenericAIGenerator.tsx`
    - `/src/components/era-interfaces/common/RuleSection.tsx`
    - `/src/components/era-interfaces/common/RuleTable.tsx`
    - `/src/components/era-interfaces/common/SubRollHelper.tsx`
    - **Rules**: `EraCreationRules.tsx`, `EraMythRules.tsx`, `EraFoundationRules.tsx`, `EraDiscoveryRules.tsx`, `EraEmpiresRules.tsx`, `EraCollapseRules.tsx`, `EraHomeRules.tsx`, `RulesContainer.tsx`
    - **Tables**: `LandmassTable.tsx`, `GeographyTable.tsx`, `DeityCountTable.tsx`, `DomainTable.tsx`, `DeitySymbolTable.tsx`, `NameTable.tsx`, `SacredSitesTable.tsx`, `RaceTable.tsx`, `SymbolTable.tsx`, `ColorTable.tsx`, `NamingIdeasTable.tsx`, `NeighborsTable.tsx`, `SettlementTable.tsx`, `DiscoveryTable.tsx`, `ProfessionsTable.tsx`, `ProsperityTable.tsx`, `EmpiresTable.tsx`, `NeighborsDevelopTables.tsx`, `WarTable.tsx`, `CollapseTable.tsx`, `OmensTable.tsx`, `GameLengthTable.tsx`
- **Era I (Creation)**
    - `/src/components/era-interfaces/era-creation/GeographyAdvisor.tsx`
    - `/src/components/era-interfaces/era-creation/GeographyAdvicePanel.tsx`
    - `/src/components/era-interfaces/era-creation/FeatureSelector.tsx`
    - `/src/components/era-interfaces/era-creation/GeographyPlacer.tsx`
    - `/src/components/era-interfaces/era-creation/RegionMap.tsx`
    - `/src/components/era-interfaces/era-creation/DiceRoller.tsx`
    - `/src/components/era-interfaces/era-creation/resources/CustomResourceCreator.tsx`
    - `/src/components/era-interfaces/era-creation/resources/ResourcePlacer.tsx`
    - `/src/components/era-interfaces/era-creation/resources/ResourceCard.tsx`
- **Era II (Myth)**
    - `/src/components/era-interfaces/era-myth/PantheonSetup.tsx`
    - `/src/components/era-interfaces/era-myth/DeityCreator.tsx`
    - `/src/components/era-interfaces/era-myth/DeityCreatorForm.tsx`
    - `/src/components/era-interfaces/era-myth/DeityCard.tsx`
    - `/src/components/era-interfaces/era-myth/SacredSiteCreator.tsx`
    - `/src/components/era-interfaces/era-myth/SacredSiteCreatorForm.tsx`
    - `/src/components/era-interfaces/era-myth/LocationCard.tsx`
- **Era III (Foundation)**
    - `/src/components/era-interfaces/era-foundation/PrimeFactionCreator.tsx`
    - `/src/components/era-interfaces/era-foundation/NeighborPlacer.tsx`
    - `/src/components/era-interfaces/era-foundation/SettlementPlacer.tsx`
    - `/src/components/era-interfaces/era-foundation/FactionForm.tsx`
    - `/src/components/era-interfaces/era-foundation/SettlementForm.tsx`
    - `/src/components/era-interfaces/era-foundation/FactionCard.tsx`
    - `/src/components/era-interfaces/era-foundation/SettlementCard.tsx`
    - `/src/components/era-interfaces/era-foundation/DiceRoller.tsx`
- **Era IV (Discovery)**
    - `/src/components/era-interfaces/era-discovery/DiscoveryEngine.tsx`
    - `/src/components/era-interfaces/era-discovery/DiscoveryEventSelector.tsx`
    - `/src/components/era-interfaces/era-discovery/ColonizationPlanner.tsx`
    - `/src/components/era-interfaces/era-discovery/ProsperityDeveloper.tsx`
    - `/src/components/era-interfaces/era-discovery/EventCard.tsx`
    - `/src/components/era-interfaces/era-discovery/CharacterCard.tsx`
    - `/src/components/era-interfaces/era-discovery/WarCard.tsx`
    - `/src/components/era-interfaces/era-discovery/MonumentCard.tsx`
    - **Handlers**: `ExpansionSettlementCreator.tsx`, `HostilesCreator.tsx`, `LandmarkAndTribeCreator.tsx`, `MinorKingdomCreator.tsx`, `NeighborDevelopHandler.tsx`
- **Era V (Empires)**
    - `/src/components/era-interfaces/era-empires/EmpiresEventEngine.tsx`
    - `/src/components/era-interfaces/era-empires/EmpiresEventSelector.tsx`
    - `/src/components/era-interfaces/era-empires/NeighborDeveloper.tsx`
- **Era VI (Collapse)**
    - `/src/components/era-interfaces/era-collapse/CollapseEventEngine.tsx`
    - `/src/components/era-interfaces/era-collapse/CollapseEventSelector.tsx`
    - `/src/components/era-interfaces/era-collapse/IconicLandmarkCreator.tsx`
    - `/src/components/era-interfaces/era-collapse/WorldOmenCreator.tsx`

#### Layout (`/src/components/layout`)
- `/src/components/layout/AppLayout.tsx`
- `/src/components/layout/CollaborationStatus.tsx`
- `/src/components/layout/CompletionTracker.tsx`

#### Navigation (`/src/components/navigation`)
- `/src/components/navigation/NavigationHeader.tsx`
- `/src/components/navigation/EraSelector.tsx`
- `/src/components/navigation/PlayerStatus.tsx`

#### Session (`/src/components/session`)
- `/src/components/session/GameSetup.tsx`
- `/src/components/session/AiPlayerSetup.tsx`
- `/src/components/session/PlayerSelection.tsx`
- `/src/components/session/ChronicleLobby.tsx`
- `/src/components/session/GameEndScreen.tsx`
- `/src/components/session/Profile.tsx`

#### Shared (`/src/components/shared`)
- `/src/components/shared/AIContextInput.tsx`
- `/src/components/shared/AIGenerationSection.tsx`
- `/src/components/shared/CollapsibleReference.tsx`
- `/src/components/shared/ConfirmationModal.tsx`
- `/src/components/shared/DicePip.tsx`
- `/src/components/shared/EditElementModal.tsx`
- `/src/components/shared/ElementCardRenderer.tsx`
- `/src/components/shared/ElementTooltip.tsx`
- `/src/components/shared/EmojiPicker.tsx`
- `/src/components/shared/EraButton.tsx`
- `/src/components/shared/ErrorAlert.tsx`
- `/src/components/shared/ErrorBoundary.tsx`
- `/src/components/shared/HelpTooltip.tsx`
- `/src/components/shared/LoadingSpinner.tsx`
- `/src/components/shared/MarkdownRenderer.tsx`
- `/src/components/shared/ObserverMode.tsx`
- `/src/components/shared/ReferenceTableModal.tsx`
- `/src/components/shared/SettingsModal.tsx`
- `/src/components/shared/StepProgressBar.tsx`
- **Edit Forms**: `DeityForm.tsx`, `FactionForm.tsx`, `GenericDescriptionForm.tsx`, `LocationForm.tsx`, `ResourceForm.tsx`, `SettlementForm.tsx`

#### UI Primitives (`/src/components/ui`)
- `/src/components/ui/Button.tsx`
- `/src/components/ui/Card.tsx`

#### World Manager (`/src/components/world-manager`)
- `/src/components/world-manager/ElementManager.tsx`
- `/src/components/world-manager/ElementCardDisplay.tsx`
- `/src/components/world-manager/ElementListRow.tsx`
- `/src/components/world-manager/ElementTimelineRow.tsx`

### 2.3 Core Logic
- **Hooks (`/src/hooks`)**: `useAIGeneration.ts`, `useEraCreationState.ts`, `useOnClickOutside.ts`, `useStaticContent.ts` (and debug hooks listed above)
- **Services (`/src/services`)**: `aiService.ts`, `exportService.ts`, `websocketService.ts`
- **State Store (`/src/stores`)**: `gameStore.ts`
- **Utilities (`/src/utils`)**: `cn.ts`, `timelineCalculator.ts`

### 2.4 Data & Assets (`/src/data`)
- `ai-templates.ts`
- `aiProfiles.ts`
- `collapseEvents.ts`
- `discoveryEvents.ts`
- `emojis.ts`
- `empiresEvents.ts`
- `eras.ts`
- `factionTables.ts`
- `prepopulationData.ts`
- `referenceTables.ts`

### 2.5 Design (`/src/design`)
- `tokens.ts` (Component style registry)

---

## 3. Documentation (`/docs`)

### 3.1 Active Documentation
- `/docs/README.md`
- `/docs/to_do.md`
- `/docs/bug_report.md`
- `/docs/bug_archive.md`
- `/docs/documentation_organization.md`
- `/docs/logic_difference_report.md`

### 3.2 Current State
- `/docs/current/README.md`
- `/docs/current/current_architecture_overview.md`
- `/docs/current/source_code_organization.md`
- `/docs/current/element_manager_spec.md`
- `/docs/current/content_export_spec.md`
- `/docs/current/ai_assistant_instructions.md`
- `/docs/current/ai_interaction_patterns.md`
- `/docs/current/style_guide.md`
- `/docs/current/styling_architecture.md`
- `/docs/current/component_standards.md`
- `/docs/current/google_cloud_run_guidelines.md`
- `/docs/current/updating_progress_tracker.md`
- `/docs/current/style_token_analysis.md`

### 3.3 Roadmap & Features
- `/docs/roadmap/README.md`
- `/docs/roadmap/master_development_guide.md`
- `/docs/roadmap/master_guide/` (Phase 1-3 plans)
- `/docs/roadmap/backend_spec.md`
- `/docs/roadmap/multi_player_session_spec.md`
- `/docs/roadmap/ai_integration_spec.md`
- `/docs/roadmap/cross_player_coordination_spec.md`
- `/docs/roadmap/debug_system_spec.md`
- `/docs/roadmap/dynamic_turn_system.md`
- `/docs/roadmap/Era_Content_Creation_Spec.md`
- `/docs/feature_proposal_*.md` (Play by Email, Chronicle Feed, etc.)

### 3.4 Refactor Plans
- `/docs/scaffold-fix/` (Fix 01-08 specifications)
- `/refactor_plan/` (Phase 1-6 plans)

### 3.5 AI Templates
- `/docs/ai-templates/*.md` (Prompts for Eras 1-6)
- `/docs/ai-templates/events/` (Event-specific form specs for Eras 4-6)

### 3.6 Game Rules
- `/docs/game-rules/*.md` (Markdown transcriptions of the rulebook)

---

## 4. Public Assets (`/public`)
- `/public/styles/tailwind-components.css` (Reference for inline styles)
- `/public/chronicles/manifest.json` (Lobby manifest)
- `/public/chronicles/*/chronicle-feed.json` (Demo game feeds)
- `/public/rules/*.html` (HTML rulebook pages - replaced by components but kept for reference/fallback)
- `/public/rules/modals/*.html` (HTML rule tables - replaced by components but kept for reference/fallback)
