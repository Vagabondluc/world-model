# Logic Trace – Master Instructions (Full Coverage)

Goal
Generate a **logic-trace markdown file for every .ts and .tsx file** that contains executable logic in the `/src` tree, regardless of which subsystem it belongs to.

We are doing a **parity-style trace between Scaffold and Src**, but most files will only exist in `src/`. For those, just describe current behavior; only compare with Scaffold when you actually have scaffold code to look at.

---

## Output Folder & Naming

- All trace files go in: `docs/scaffold-fix/`
- One logic-trace file **per source file**, using this naming scheme:

  - For `src/stores/gameStore.ts` → `docs/scaffold-fix/src_stores_gameStore.logic-trace.md`
  - For `src/components/layout/AppLayout.tsx` →  
    `docs/scaffold-fix/src_components_layout_AppLayout.logic-trace.md`

Rules:
- Replace `/` with `_`.
- Drop the leading `src_`.
- Keep `.logic-trace.md` as suffix.

Example:
- `src/hooks/useAIGeneration.ts` → `docs/scaffold-fix/hooks_useAIGeneration.logic-trace.md`

---

## Per-File Template (STRICT)

For **each** .ts/.tsx file that actually contains code (not just re-exports), create a file that follows this exact structure:

```markdown
FILE: <exact relative path from repo root, e.g. src/components/layout/AppLayout.tsx>
SUBSYSTEM: <best guess: e.g. Layout, Navigation, Era I, Debug, AI, Store, UI, Shared, etc.>

LOGIC TRACE ENTRIES
--------------------------------
# One or more entries, each like this:

LOGIC TRACE ENTRY
--------------------------------
ORIGIN: <Scaffold | Src | Both>
FILE: <same path as above>
FUNCTION / COMPONENT: <main exported function/component or hook name>
INPUTS:
- <props | arguments | store selectors | context>
PRECONDITIONS:
- <things that must be true / shapes that must exist>
TRANSITION:
1. <step-by-step description of what this function does>
2. <side-effects, state updates, calls to services, etc.>
OUTPUT / NEXT STEP:
- <return value OR what state / UI changes this produces>
DEPENDENCIES:
- <other functions/hooks/modules this code depends on>
STATUS: <MATCH | ADAPTED | NEW | DEPRECATED>
NOTES:
- <anything relevant about parity with Scaffold or weird edge cases>

# Repeat LOGIC TRACE ENTRY blocks for each significant function/component/hook
# in the file.

PARITY SUMMARY TABLE
--------------------------------
STEP | SCAFFOLD LOCATION | SRC LOCATION | PARITY | MISSING/CHANGED LOGIC
---|---|---|---|---
<High-level step label> | <if scaffold equivalent exists> | <this file> | <MATCH/ADAPTED/NEW/DELETED> | <short note>
```

Important:

* If there is **no Scaffold version** of the file, set:
  * `ORIGIN: Src`
  * In the table, put `SCAFFOLD LOCATION` as `N/A` and `PARITY` as `NEW`.
* If the file is **pure styling or dumb presentational UI** (no logic other than rendering props), you can still do one short LOGIC TRACE ENTRY describing it as “presentational only”.

---

## How to Process the Project

You must eventually cover **every .ts/.tsx file under `/src`**. To stay sane, do it in **batches**:

### Phase 1 – Core State & Layout
1. `src/stores/gameStore.ts`
2. `src/App.tsx`
3. `src/main.tsx`
4. `src/components/layout/AppLayout.tsx`
5. `src/components/navigation/NavigationHeader.tsx`
6. `src/components/navigation/EraSelector.tsx`
7. `src/components/navigation/PlayerStatus.tsx`

### Phase 2 – Shared Hooks & Services
1. `src/hooks/useAIGeneration.ts`
2. `src/hooks/useEraCreationState.ts`
3. `src/hooks/useOnClickOutside.ts`
4. `src/services/aiService.ts`
5. `src/services/exportService.ts`
6. `src/services/websocketService.ts`
7. `src/utils/timelineCalculator.ts`
8. `src/utils/cn.ts`

### Phase 3 – Session & Debug
1. All files under `src/components/session/`
2. All files under `src/components/debug/` (including hooks & tabs)

### Phase 4 – Era Interfaces
For each folder under `src/components/era-interfaces/`:
1. Start with `EraContent.tsx` and `Era*Content.tsx` files.
2. Then cover each subfolder (`era-creation`, `era-myth`, `era-foundation`, `era-discovery`, `era-empires`, `era-collapse`).
3. One logic-trace file for every TS/TSX in those folders.

### Phase 5 – Shared & UI Primitives
1. All files in `src/components/shared/`
2. All files in `src/components/ui/`
3. All files in `src/components/world-manager/`

### Phase 6 – Design & Data
1. `src/design/tokens.ts`
2. Any TS files in `src/data/` that contain logic (if any). For pure JSON-ish constant files, a single short LOGIC TRACE ENTRY is enough.
