# Donor UI Audit

Phase 7 treats donor UI as part of the donation surface when that UI exists.

The donor classifications are fixed for this workspace. The audit inventories source roots and test commands; it does not reopen classification.

## Audit Result

| Donor | Class | Methodology | Basis | Workspace evidence | Notes |
|---|---|---|---|---|---|
| Mythforge | app donor | behavioral capture | captured | `mythforge/package.json`, `mythforge/src/app/page.tsx`, `mythforge/src/components/mythosforge/*` | Runnable donor app with portable UI tests and recognizable route/panel structure. |
| Adventure Generator | fragment donor | intent reconstruction | reconstructed | `to be merged/dungeon generator/zai2/.next`, `next-env.d.ts`, adapter docs | Surviving app residue exists, but source root and package metadata are incomplete. Rehost follows reconstructed workflow intent. |
| Orbis | semantic-only donor | designed intent authoring | designed | `world-model/docs/adapters/ORBIS_ADAPTER.md`, adapter snapshots, stray workspace residue only | No runnable donor UI root exists in the workspace. Rehost is authored from simulation semantics, not captured behavior. |

## Mythforge

- Runnable app root: `D:\coding\AI\Chat-Gpt-Agent\mythforge`
- Entry script: `npm run dev`
- Test commands:
  - `npm run test`
  - `npm run test:contracts`
  - `npm run test:e2e`
  - `npm run test:rust`
- Characterization source:
  - `src/app/page.tsx`
  - `src/components/mythosforge/TopNav.tsx`
  - `src/components/mythosforge/ExplorerTree.tsx`
  - `src/components/mythosforge/Workspace.tsx`

## Adventure Generator

- Workspace residue root: `D:\coding\AI\Chat-Gpt-Agent\to be merged\dungeon generator\zai2`
- Confirmed residue:
  - `.next/`
  - `node_modules/`
  - `next-env.d.ts`
- Missing from the current workspace:
  - root `package.json`
  - source tree
  - runnable test entrypoint
- Characterization source:
  - adapter docs
  - surviving residue
  - workflow semantics in canonical attachments

## Orbis

- No runnable donor app root was found in the current workspace.
- Visible workspace evidence is limited to:
  - `world-model/docs/adapters/ORBIS_ADAPTER.md`
  - adapter snapshot and concept map
  - `to be merged/Orbis Spec 2.0/Orbis 1.0/.env.local`
- Characterization source:
  - adapter docs
  - adapter snapshot semantics
  - designed simulation surface requirements

## Pre-Registered Waivers

The following waivers are registered before gate execution:

- Mythforge:
  - donor-only AI copilot and donor-only external dashboard surfaces
- Adventure Generator:
  - exact source-level parity with the original donor app until full source recovery exists
- Orbis:
  - exact DOM parity with a donor UI, because no donor UI root exists in the workspace
