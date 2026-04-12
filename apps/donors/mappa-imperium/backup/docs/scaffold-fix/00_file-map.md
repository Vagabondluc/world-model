
# Logic Subsystem File Map

This document maps the files identified in the Project Audit to the specific logic subsystems undergoing parity analysis.

## 01. State Persistence & Initialization
**Core Logic:**
- `src/stores/gameStore.ts` (Persistence configuration, rehydration)
- `src/components/layout/AppLayout.tsx` (Initialization gate)
- `src/App.tsx` (Root state provider)

## 02. Era I Drafts
**Core Logic:**
- `src/hooks/useEraCreationState.ts` (Draft state management)
- `src/stores/gameStore.ts` (Draft slice in store)
- `src/components/era-interfaces/EraCreationContent.tsx` (UI integration)

## 03. AI Context & Service
**Core Logic:**
- `src/services/aiService.ts` (Generation logic, context processing)
- `src/hooks/useAIGeneration.ts` (Context assembly hook)
- `src/components/shared/AIContextInput.tsx` (UI for context selection)
- `src/components/shared/AIGenerationSection.tsx` (UI container)

## 04. Lifecycle & Render Stability
**Core Logic:**
- `src/components/layout/AppLayout.tsx` (Ready state handling)
- `src/components/era-interfaces/EraContent.tsx` (Child readiness reporting)
- `src/stores/gameStore.ts` (Ready flag state)

## 05. Debug System
**Core Logic:**
- `src/components/debug/UnifiedDebugSystem.tsx` (Main container)
- `src/components/debug/tabs/GameToolsTab.tsx` (State manipulation)
- `src/stores/gameStore.ts` (Debug actions: prepopulate, unlock)
- `src/data/prepopulationData.ts` (Seed data)

## 06. Styling Tokens
**Core Logic:**
- `src/design/tokens.ts` (Token registry)
- `src/components/ui/Button.tsx` (Token consumption)
- `src/components/ui/Card.tsx` (Token consumption)
- `src/utils/cn.ts` (Class merging utility)

## 07. Player Switching
**Core Logic:**
- `src/stores/gameStore.ts` (Current player state, UI state dictionary)
- `src/components/navigation/PlayerStatus.tsx` (Switching UI)
- `src/components/era-interfaces/EraCreationContent.tsx` (Player-specific data retrieval)
