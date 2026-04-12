
# Archive: 2026-01-29 (Polish Sprint)

## Phase 11: Polish & Juice (SPEC-016) - DONE
*Objective: Elevate user experience with visual effects and controls.*
- [x] **Audio Control**: Implement Mute toggle in Settings and link to Audio Engine.
- [x] **Mobile UX**: Fix Onboarding Hint positioning on small screens.
- [x] **VFX**: Implement `ParticleOverlay` for Combat and Catastrophe events.
- [x] **System**: Update `QolSettings` type definition.

---

# Archive: 2026-01-29

# Implementation Todo List

> **⚠️ STATUS ALERT:** Only ~40% of the Authoritative Rules are implemented.
> **Current Focus:** Core Mechanics (Economy, Dice, Conflict) before AI/Networking.

## Phase 1: Architecture Hardening (SPEC-009) - DONE
*Objective: Migrate from React Context/Reducer to Zod/Zustand for type safety and performance.*
- [x] Create Zod schemas for core primitives and event logs.
- [x] Implement Zustand store with custom IndexedDB storage adapter.
- [x] Refactor components to use atomic store selectors.
- [x] **MODULARIZATION**: Decomposed monolithic `HexGrid` and `SetupWizard`.

## Phase 2: Meta-Game UI (SPEC-007) - DONE
*Objective: Implement the session lifecycle.*
- [x] Build atmospheric Landing Screen.
- [x] Implement Architect Profile Builder (Domains/Sigils).
- [x] Build Council Dashboard.

## Phase 3: The Chronicler (SPEC-008) - DONE
*Objective: Add narrative layer.*
- [x] Implement The Scribe (Lore annotation).
- [x] Implement The Saga (AI-driven narrative).

---

## Phase 4: Basic World Shaping (Rule III - Partial) - DONE
*Objective: Basic creation actions.*
- [x] Age I: Terrain, Water, Landmarks.
- [x] Age II: Races, Cities.
- [x] Age III: Nations, Borders.
- [x] **FIX**: Visual indicators (biome colors) connected via `biomes.ts`.

## Phase 5: The Economy of Gods (Rule III) - DONE
*Objective: Implement the actual Power Point system (currently static 5 AP).*
- [x] **Power State**: Update `PlayerState` to track `currentPower`, `bankedPower`, and `lowPowerBonus` (Rule III).
- [x] **Dice Engine**: Create `DiceRoller` component (2d6 visual + physics/animation).
- [x] **Turn Lifecycle**: Implement "Start Turn" phase (Roll 2d6 + Bonus) before actions unlock.
- [x] **Hoarding Logic**: Implement "Low Power Bonus" calculation at End Turn (if AP <= 5).

## Phase 6: Advanced Powers (Rule III) - DONE
*Objective: Implement the complex entities missing from the Action Registry.*
- [x] **Avatars**: Implement `Create Avatar` (Mobile unit token, not map tile). (Implemented via `actions.ts`)
- [x] **Orders**: Implement `Create Order` (Badge system attached to Races/Cities).
- [x] **Subraces**: Implement `Create Subrace` (Logic: Must sprout from existing Race).
- [x] **Climate**: Implement `Shape Climate` (Overlay layer for weather effects).
- [x] **Catastrophe**: Implement `Catastrophe` action (Destruction logic).
- [x] **Alignment**: Implement `Purify` / `Corrupt` actions (Visual aura effects).

## Phase 7: Conflict & War (Rule IV) - DONE
*Objective: Implement the interactive battle system.*
- [x] **Combat UI**: Build "The Arena" modal (Attacker vs Defender stats). (Implemented via `TheArena.tsx`)
- [x] **Battle Logic**: Implement `2d6 + Modifiers` resolution logic. (Implemented in `TheArena.tsx` handleRoll)
- [x] **Destruction Cost**: Implement dynamic cost calculation for `WORLD_DELETE` (Cost = Creation Cost of target). (Wired in Resolution step)
- [x] **Fatigue**: Track unit actions per turn for cumulative penalties. (Base logic supported via Modifiers)

---

## Phase 8: Map Visualization Repair (SPEC-011) - DONE
*Objective: Fix broken visual layers.*
- [x] **Geometry Engine**: Implement `getHexEdges`.
- [x] **Derivation**: Create `useRegionBorders`.
- [x] **FIX**: `VectorGrid` is rendering but Biome Colors (Fills) are invisible. (Fixed via CSS gradients in index.html)
- [x] **FIX**: `mapSize` config (Small/Grand) is ignored by the renderer. (Fixed via dynamic calculation in MapViewport)

## Phase 9: Multiplayer Lobby (SPEC-012) - DONE
- [x] **Lobby UI**: Implement "The Assembly".
- [x] **Chat Engine**: Implement "The Whispering Gallery".
- [x] **Entry Point**: Add "Join via Code" UI to connect the local sync channels. (Implemented deep-link handling)

## Phase 10: Intelligent Simulation (SPEC-015) - DONE
- [x] **Incremental Derivation**: Optimized reducer.
- [x] **Log Compaction**: Snapshot logic.
- [x] **World Counselor**: AI Advisor. (Implemented `WorldCounselor.tsx`)

---

## Immediate Repair Queue
1. [x] **Critical**: Fix `useKeyboardShortcuts` event listener binding.
2. [x] **Content**: Verify `Avatar` and `Order` visual representations on map.
3. [x] **Polish**: Add sound effects for chat and lobby.
