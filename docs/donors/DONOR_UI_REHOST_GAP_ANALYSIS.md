# Donor UI Rehost Gap Analysis

**Status:** Open  
**Scope:** Current `world-model` donor routes vs. original donor UI behavior  
**Date:** 2026-04-11

## Summary

The current Phase 9 donor work is useful as an integration scaffold, but it is not a faithful donor UI rehost.

The current route path is now split:

- `/donor/<id>` bypasses the shared product shell and renders `DonorSubappHost`.
- `watabou-city` mounts a vendored clean-room app from `world-model/apps/donors/watabou-city/src/WorldModelDonorApp.tsx`.
- The remaining donor routes render explicit `scaffold-mounted` non-exact placeholders until their vendored donor apps are wired into the route and parity-certified.
- The remaining donor roots now contain vendored donor source packages and `src/WorldModelDonorApp.tsx` entrypoints, but those entrypoints are not yet imported by `DonorSubappHost` or parity-certified.

That means the current "exact-vendored" status is self-described metadata, not visual equivalence to the original UI. The Playwright and Vitest tests are still valuable, but they currently prove route hydration, sentinel metadata, and a small set of text/control landmarks. They do not prove layout, visual density, canvas/map/sigil rendering, modal order, drawers, dashboards, or original interaction flows.

## Cross-Cutting Gaps

| Gap | Current state | Required restoration |
|---|---|---|
| Donor app code | All donor roots now have vendored source packages and `WorldModelDonorApp` entrypoints; only `watabou-city` is currently mounted | Wire each donor source package into `DonorSubappHost`, resolve per-framework build adapters, and certify visual/behavioral parity before claiming exactness. |
| Route mounting | `/donor/<id>` now uses `DonorSubappHost`; unrehosted donors still show explicit scaffold placeholders | `/donor/<id>` must mount the donor app surface itself. The shared product shell can remain outside donor routes or be limited to a non-intrusive debug wrapper. |
| Visual parity | Text landmarks and a few controls | Capture and assert screenshots, DOM structure, accessibility tree, keyboard flow, modal/drawer order, and layout regions per donor route. |
| Canonical bridges | Generic projector/action translator returning donor id, label, runtime root, and action type | Replace with donor-shaped view models and donor action translators that write canonical core records or donor attachments. |
| Harness meaning | Green Phase 9 currently implies "route exists and contract landmarks pass" | Rename or weaken "exact-vendored" claims until visual and behavioral parity is actually proven. |
| Donor compare page | Useful diagnostic cards with `SourceUiPreview` | Keep as a final product/integration tool, but do not treat it as donor UI fidelity evidence. |

## Donor Gap List

### Mythforge

Original UI evidence:

- Source root: `mythforge/`
- Entry: `src/app/page.tsx`
- Major surfaces: `TopNav`, `ExplorerTree`, `Workspace`, resizable `PanelGroup`, `EntityModalWrapper`, `GMHudWrapper`, `MobileSidebarDrawer`, `MobileFABs`, file open/save input, toast flow.
- Additional donor UI modules include `CommandPalette`, `CalendarViewer`, `CalendarForge`, `NodeGraph`, `Timeline`, `PathFinder`, `SessionLogger`, `TemplateManager`, entity dialogs, AI chat widgets, and markdown editors.

Current `world-model` representation:

- Vendored source exists under `world-model/apps/donors/mythforge/` with `src/WorldModelDonorApp.tsx`.
- `/donor/mythforge` still renders the explicit `scaffold-mounted` placeholder; the Mythforge entrypoint is not imported by `DonorSubappHost`.
- No Mythforge top nav, explorer tree, workspace, panel resizing, mobile drawer, entity modal, GM HUD, command palette, graph, calendar, timeline, or AI widgets are visible in `world-model` yet.

Missing from original UI:

- Full-height dark Mythforge workspace shell.
- Resizable explorer/workspace split.
- Entity creation/editing modal stack.
- Category tree and relationship browsing.
- Calendar, timeline, graph, pathfinder, session log, GM HUD, command palette, and AI panels.
- Mobile sidebar drawer and mobile FABs.
- Native open/save/import behavior wired through Mythforge controls.

Restore:

- Vendor Mythforge UI modules and styles into `world-model/apps/donors/mythforge/`.
- Mount the Mythforge app entrypoint on `/donor/mythforge`.
- Replace `useWorldStore` persistence with canonical bundle adapters while leaving the UI composition intact.
- Add Playwright parity for the top nav, explorer/workspace split, entity modal, GM HUD, command palette, and one graph/calendar/timeline surface.

### Orbis

Original UI evidence:

- Source root: `to be merged/true orbis/Orbis Spec 2.0/Orbis 1.0/`
- Entry: `App.tsx`
- Major surfaces: `LayoutGrid`, `Header`, `Toolbars`, `HexGrid`, `MobileUI`, `TimeWidget`, `Legend`, `CosmicPanel`, `SimulationOrchestrator`, `RightPanel`, `HelpModal`, `LoadModal`.
- Key interactions: globe/flat projection, selected hex inspector, terraform brush, time pause, settings/inspector toggles, keyboard shortcuts for help, projection, pause, escape, global/local tabs.

Current `world-model` representation:

- Vendored source exists under `world-model/apps/donors/orbis/` with `src/WorldModelDonorApp.tsx`.
- `/donor/orbis` still renders the explicit `scaffold-mounted` placeholder; the Orbis entrypoint is not imported by `DonorSubappHost`.
- No HexGrid/globe viewport, layout grid, control panels, selected hex inspector, time widget, cosmic panel, legend, mobile dock, help/load modals, simulation orchestrator, or keyboard model are visible in `world-model` yet.

Missing from original UI:

- Planetary visualization viewport.
- Tool rail and right control panel.
- Simulation orchestration layer.
- Hex selection and local voxel hydration flow.
- Projection mode and terraform brush behavior.
- Time controls, cosmic panel, legend, and mobile tab UI.
- Original keyboard/focus behavior.

Restore:

- Vendor Orbis app modules and styles into `world-model/apps/donors/orbis/`.
- Mount the Orbis `App.tsx` route directly under `/donor/orbis`.
- Fold Orbis stores into canonical simulation attachments and projected donor view state.
- Add Playwright parity for viewport rendering, projection toggle, regenerate, selected hex inspector, help/load modals, keyboard shortcuts, and mobile layout.

### Adventure Generator

Original UI evidence:

- Source root: `to be merged/dungeon generator/`
- Entry: `src/components/App.tsx`
- Major surfaces: `Launcher`, hydration/loading screen, `AppLayout`, `SystemMessage`, `AdventureGenerator`, `InitialStep`, `HooksStep`, `OutlineHubView`, `DelveWizard`, scene/location/faction/NPC detail views, generation error boundary, save/load/clear/backup/restore session controls.
- Additional surfaces include backend control panels, AI settings, trap architect/generator views, compendium/detail panels, image/chat widgets, and theme support.

Current `world-model` representation:

- Vendored source exists under `world-model/apps/donors/adventure-generator/` with `src/WorldModelDonorApp.tsx`.
- `/donor/adventure-generator` still renders the explicit `scaffold-mounted` placeholder; the Adventure Generator entrypoint is not imported by `DonorSubappHost`.
- No launcher storage flow, parchment theme, hydration screen, app layout, workflow steps, hooks/outline/delve screens, detail views, drawers, system messages, backend controls, or backup/restore controls are visible in `world-model` yet.

Missing from original UI:

- Campaign root launcher and archive hydration flow.
- Workflow step router.
- Adventure hook generation and hook selection.
- Outline hub and generated-output review.
- Delve wizard.
- Scene, location, faction, and NPC detail views.
- Error boundary, system message, session backup/restore, theme behavior, and backend/AI control panels.

Restore:

- Vendor the Adventure Generator app shell and workflow components into `world-model/apps/donors/adventure-generator/`.
- Mount the original `AppContent`/`AdventureGenerator` path on `/donor/adventure-generator`.
- Replace persistence and workflow stores with canonical workflow attachments and donor-local transient UI state.
- Add Playwright parity for launcher, hydration, initial step, hooks step, outline hub, delve wizard, one detail view, save/load/backup, and error state.

### Mappa Imperium

Original UI evidence:

- Source root: `to be merged/mappa imperium/`
- Entry: `src/App.tsx`
- Major surfaces: game state router for setup, host setup, join setup, lobby waiting room, AI player setup, world creation wizard, player selection, chronicle lobby, playing layout, game end screen, unified debug system.
- UI modules include navigation header, era selector, era content screens, world manager, map renderer, node editor, player dashboard, action panel, chat, collaboration status, save/load era modals, settings, reference tables, and edit element modals.

Current `world-model` representation:

- Vendored source exists under `world-model/apps/donors/mappa-imperium/` with `src/WorldModelDonorApp.tsx`.
- `/donor/mappa-imperium` still renders the explicit `scaffold-mounted` placeholder; the Mappa entrypoint is not imported by `DonorSubappHost`.
- No Mappa game-state router, setup/lobby screens, world creation wizard, era content, map, chat, collaboration, debug system, or modals are visible in `world-model` yet.

Missing from original UI:

- Setup, host, join, lobby, AI configuration, world setup, player selection, chronicle lobby, playing, and finished screens.
- Era navigation and era-specific content.
- Territory map and world manager surfaces.
- Node editor and element editing forms.
- Player board, chat, collaboration status, shared notes/markers/cursors.
- Debug console and import/export/reset controls.

Restore:

- Vendor Mappa Imperium app modules and styles into `world-model/apps/donors/mappa-imperium/`.
- Mount its state-router entrypoint on `/donor/mappa-imperium`.
- Translate Mappa era/territory/session/player/chat state into canonical core records plus donor attachments.
- Add Playwright parity for setup, world creation wizard, playing layout, era selector, map renderer, node editor, chat/collaboration, and debug modal.

### Dawn of Worlds

Original UI evidence:

- Source root: `to be merged/world-builder-ui/`
- Entry: `App.tsx`
- Major surfaces: `StartScreen`, `GenerationMethodSelector`, `SetupWizard`, `LobbyView`, game layout, `MainView`, `TimelineView`, `SearchOverlay`, `EndTurnModal`, `PlayerDashboard`, `ChroniclerView`, `WorldCounselor`, `TurnHandoverOverlay`, `ShortcutsOverlay`, `TheArena`, `WhisperingGallery`, mobile layout, AI controller.
- Start screen includes full-screen galaxy background, Dawn of Worlds title treatment, Quick Play, Forge New World, Multiplayer, Resume, and storage status.

Current `world-model` representation:

- Vendored source exists under `world-model/apps/donors/dawn-of-worlds/` with `src/WorldModelDonorApp.tsx`.
- `/donor/dawn-of-worlds` still renders the explicit `scaffold-mounted` placeholder; the Dawn entrypoint is not imported by `DonorSubappHost`.
- No Dawn landing screen, galaxy background, generation method selector, setup wizard, lobby, game layout, timeline, search, end-turn modal, player dashboard, chronicler, counselor, arena, mobile layout, or AI controller are visible in `world-model` yet.

Missing from original UI:

- The entire visual landing experience and its action menu.
- Generation method selection and setup wizard.
- Lobby and multiplayer flow.
- Main game layout and map/turn UI.
- Search overlay, end-turn modal, timeline view, chronicler, counselor, player dashboard, arena, whispering gallery, shortcuts overlay, and mobile layout.
- Haptics, sync channel, keyboard shortcuts, and AI controller wiring.
- PNG asset usage from the donor root.

Restore:

- Vendor Dawn of Worlds app source, styles, and assets into `world-model/apps/donors/dawn-of-worlds/`.
- Mount the donor entrypoint on `/donor/dawn-of-worlds` without the shared donor card wrapping the primary surface.
- Fold world kind, turn, multiplayer/session, and timeline state into canonical records and donor attachments.
- Add Playwright parity for landing, quick play, setup wizard, game layout, end-turn, timeline, search, chronicler/counselor, mobile layout, and one asset-render check.

### Sacred Sigil Generator / Faction Image

Original UI evidence:

- Source root: `to be merged/faction-image/`
- Entry: `src/App.tsx` and `src/pages/Index.tsx`
- Main surface: `IconGenerator`.
- Major modules: `SVGRuntimeRenderer`, `ConfigForm`, `SymbolPicker`, `LayersSidebar`, `IconDiscoveryPanel`, `DiscoveryContext`, recolor engine, variant grid, composition/final-touch controls, export menu, onboarding panel, debug settings dialog, layer transform gizmos, SVG/PNG/JSON/React export.

Current `world-model` representation:

- Vendored source exists under `world-model/apps/donors/faction-image/` with `src/WorldModelDonorApp.tsx`.
- `/donor/faction-image` still renders the explicit `scaffold-mounted` placeholder; the Faction Image entrypoint is not imported by `DonorSubappHost`.
- No icon preview, SVG renderer, config form, symbol picker, layer stack, discovery panel, variant grid, composition controls, export menu, onboarding, debug settings, or transform gizmos are visible in `world-model` yet.

Missing from original UI:

- The sigil generator workspace.
- SVG preview and variant generation grid.
- Domain/style/symmetry/base shape controls.
- Layer sidebar and layer selection/editing.
- Icon discovery and recolor flow.
- Composition controls, final touches, overlays, gizmos, undo/redo, and export menu.
- Onboarding and debug settings modal.

Restore:

- Vendor the Faction Image app modules and assets into `world-model/apps/donors/faction-image/`.
- Mount the `IconGenerator` route on `/donor/faction-image`.
- Store generated sigil specs and layer state as canonical assets or donor attachments while keeping UI-only editor state transient.
- Add Playwright parity for generate, variant select, layer edit, icon discovery, export menu, onboarding, and debug settings.

### Watabou City

Original/reference evidence:

- Source root: `to be merged/watabou-city-clean-room/2nd/`
- Clean-room implementation material: `2nd/`
- GPL reference material: `gpl_source/` is not the Phase 9 rehost source.
- Major surfaces and concepts: city layout, seed/regenerate controls, SVG renderer, roads, rivers, walls, wards, buildings, farms, labels, render artifacts, diagnostics/quality panels, visual regression artifacts, deterministic generation.

Current `world-model` representation:

- Vendored clean-room React/Vite app under `world-model/apps/donors/watabou-city/`.
- `/donor/watabou-city` mounts `src/WorldModelDonorApp.tsx` full-bleed through `DonorSubappHost`.
- Current status is `rehost-mounted`, not `exact-vendored`: the app renders, but Playwright parity, deterministic replay, and canonical bridge depth are not yet complete.

Missing from reference UI:

- Playwright parity evidence for seed/regenerate, render nonblank checks, layer visibility, diagnostics, export, and deterministic replay.
- Behavior-exact comparison against the clean-room baseline route and workflow transcript.
- Canonical `CityLayoutAttachment` projection/action translation beyond the current generic bridge evidence.
- Persistence tests proving city-layout writes land only in canonical records or donor attachments.

Restore:

- Keep the vendored clean-room app as the source rehost and avoid copying the GPL reference tree.
- Replace the generic Watabou bridge with city-layout projection/action translation.
- Add Playwright parity for seed/regenerate, city render nonblank check, layer visibility, diagnostics panel, export, and deterministic replay.
- Promote status from `rehost-mounted` to `exact-vendored` only after parity and canonical persistence evidence pass.

### Encounter Balancer Scaffold

Original UI evidence:

- Representative source root: `to be merged/apocalypse/`
- Clone roots: `to be merged/character-creator/`, `to be merged/deity creator/`, `to be merged/genesis/`
- Entry: `src/app/page.tsx`
- Major surfaces: D&D Encounter Builder header, Templates dialog, Saved Elements panel, Balancer tab, Environmental tab, `EncounterBalancerTab`, `EnvironmentalScenarioTab`, `EncounterTemplatesGallery`, element cards, add monster/reward/tactical dialogs, export/print controls, monster search.

Current `world-model` representation:

- Vendored representative source exists under `world-model/apps/donors/encounter-balancer/` with `src/WorldModelDonorApp.tsx`.
- `/donor/encounter-balancer` still renders the explicit `scaffold-mounted` placeholder; the representative scaffold entrypoint is not imported by `DonorSubappHost`.
- No D&D Encounter Builder header, tabs, templates dialog, saved elements panel, balancer form, environmental scenario form, generated element cards, add dialogs, monster search, export/print flow, or footer are visible in `world-model` yet.

Missing from original UI:

- Header and product identity.
- Template selection dialog.
- Saved elements panel.
- Combat Encounter Balancer tab.
- Environmental Combat Scenario tab.
- Add Monster, Add Reward, and Add Tactical dialogs.
- Monster search dialog and export/print flow.
- Clone-equivalence evidence across the four scaffold roots.

Restore:

- Vendor the representative scaffold app into `world-model/apps/donors/encounter-balancer/`.
- Mount the representative Next route on `/donor/encounter-balancer`.
- Keep clone-equivalence checks for the other three roots.
- Fold encounter balance and environmental scenario state into donor attachments.
- Add Playwright parity for header, templates dialog, saved elements, both tabs, add dialogs, monster search, export/print, and clone-equivalence.

## Harness Gaps To Close

| Harness area | Current issue | Needed check |
|---|---|---|
| Manifest | Correctly keeps unrehosted donors at `scaffold-mounted` and Watabou at `rehost-mounted` | Fail if a donor root lacks an app entrypoint, package/build metadata, UI source evidence, and route mount file when exactness is claimed. |
| Mount tests | Assert `DonorSubappHost` plus `rehost-mounted` for Watabou and `scaffold-mounted` for unrehosted donors | Assert the donor-specific app renders its required layout regions and does not use the generic host as the primary body once exactness is claimed. |
| Live parity tests | Compare a small list of text landmarks and one loose control requirement | Compare baseline screenshots, DOM region tree, accessibility tree, keyboard flow, modal/drawer order, and a workflow transcript. |
| Bridge tests | Assert donor id and action type | Exercise real canonical projection and mutation for each donor concept family. |
| E2E report | Can pass when visualizations are absent | Require visual nonblank checks for map/globe/sigil/city/encounter surfaces. |
| Compare surface | Useful for final product work | Keep out of donor exactness evidence except as a diagnostic entrypoint. |

## Restore Order

1. Demote false exactness labels: mark current app-donor routes as `scaffold-mounted` or equivalent until real donor apps are mounted.
2. Finish adapting the vendored donor subapp packages so they can be imported safely from `DonorSubappHost`.
3. Change each remaining `/donor/<id>` route from scaffold placeholder to donor app mount after its package compiles inside the unified route boundary.
4. Add per-donor canonical bridge adapters after each donor UI is mounted, not before.
5. Replace landmark-only tests with characterization-driven Playwright parity.
6. Keep the current unified donor compare surface as a final product workspace, not as donor UI conformance evidence.
