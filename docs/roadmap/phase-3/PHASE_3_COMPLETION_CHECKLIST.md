# Phase 3 Completion Checklist

Use this checklist to verify the executable unified-app scaffold.

## Scaffold

- [ ] `world-model/apps/unified-app/package.json` exists
- [ ] `world-model/apps/unified-app/index.html` exists
- [ ] `world-model/apps/unified-app/vite.config.ts` exists
- [ ] `world-model/apps/unified-app/src/App.tsx` exists
- [ ] `world-model/apps/unified-app/src/main.tsx` exists
- [ ] `world-model/apps/unified-app/src/routes/AppRoutes.tsx` exists
- [ ] `world-model/apps/unified-app/src/shell/AppShell.tsx` exists
- [ ] `world-model/apps/unified-app/src/modes/guided/GuidedMode.tsx` exists
- [ ] `world-model/apps/unified-app/src/modes/studio/StudioMode.tsx` exists
- [ ] `world-model/apps/unified-app/src/modes/architect/ArchitectMode.tsx` exists

## Canonical Bridge

- [ ] Canonical bundles validate before hydration
- [ ] Load/save roundtrip preserves canonical JSON
- [ ] Overlay state stays local to the app shell
- [ ] Contract version matches `world-model/contracts/json-schema/VERSION.txt`

## Shell Behavior

- [ ] Left navigation renders
- [ ] Top context bar renders
- [ ] Center workspace renders
- [ ] Right inspector renders
- [ ] Bottom drawer renders
- [ ] Mode switching preserves selected world context

## Safety

- [ ] No donor runtime imports exist in the app scaffold
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes

## Gate

- [ ] `python world-model/scripts/run_harness.py --phase 3` passes
