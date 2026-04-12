# Phase 9 Execution Checklist

This checklist is the working ledger for Phase 9 completion. It is not a planning doc. It records atomic actions, repeated harness failures, command outputs, and the next narrower decomposition when a branch fails more than once.

## Rules

- Treat `phase-9-donor-completeness-report.json` as inventory-only.
- Treat `phase-9-exact-donor-ui-report.json` as executable evidence.
- Use `python world-model/scripts/run_harness.py --only 9` for the Phase 9 retry loop until the strict path is ready.
- Use `python world-model/scripts/run_harness.py --phase 9` only after the Phase 0 manifest blocker is cleared.
- If the same atomic action fails twice, split it into a smaller evidence unit and log both failures here and in the run logs under `.harness-scratch/runs/<run-id>/logs/`.
- If the same branch fails three times, stop that branch, record the blocker, and move to a different atomic action.

## Atomic Actions

| # | Atomic action | Evidence command | First failure | Second failure | Next narrower action | Status |
|---|---|---|---|---|---|---|
| 1 | Unblock strict harness manifests | `python world-model/scripts/run_harness.py --phase 9` | Done | Passed | Move on to the next strict-harness blocker surfaced by the ordered run | Resolved |
| 2 | Keep inventory and exactness reports separate | `python world-model/scripts/check_phase_9_exhaustive_donors.py` and `python world-model/scripts/check_phase_9_exact_donor_ui.py` | Pending | Pending | Split inventory vs exactness assertions into separate report checks | Open |
| 3 | Finish app-donor runtime mounting | `npm run test:conformance:mounts` | Pending | Pending | Isolate one donor route and one mount assertion at a time | Open |
| 4 | Finish canonical bridge evidence | `npm run test:conformance:bridges` | Pending | Pending | Split bridge existence from bridge execution and log the failing donor id | Open |
| 5 | Finish parity conformance | `npm run test:conformance:exactness` | Pending | Pending | Reduce to one donor route plus one parity assertion | Open |
| 6 | Finish special donor handling | donor-specific characterization and conformance commands | Pending | Pending | Split `watabou-city` and `encounter-balancer` evidence from app-donor work | Open |
| 7 | Close cross-donor integration | `npm run test:integration` and `npm run test:integration:round-trip` | Pending | Pending | Reduce to a single concept-family round-trip or a single transition flow | Open |

## Failure Ledger

Record one entry per failed attempt. Keep the command, exit code, the first actionable error, and the decomposed retry target.

| Date | Atomic action | Command | Exit | First actionable failure | Retry target | Notes |
|---|---|---|---|---|---|---|
| 2026-04-10 | Strict harness manifests | `python world-model/scripts/run_harness.py --phase 9` | 1 | Phase 0 manifest fingerprint missing for `mappa-imperium`, `dawn-of-worlds`, `faction-image` | `--only 9` exactness loop until Phase 0 is fixed | Strict path blocked before Phase 9 |
| 2026-04-10 | Strict harness manifests | `python world-model/scripts/run_harness.py --phase 9` | 1 | Phase 1 canonical model export drift in `world-model-specs` | Fix Phase 1 schema export determinism and rerun strict harness | Phase 0 now passes; strict harness advances into Phase 1 |
| 2026-04-10 | Exact donor-ui verification | `python world-model/scripts/check_phase_9_exact_donor_ui.py` | 1 | App donors still report non-vendored mount kinds and missing bridge evidence | Split by donor, then by mount vs bridge evidence | Exactness gate is intentionally red |
| 2026-04-10 | Bridge evidence | `npm run test:conformance:bridges` | 1 | No bridge tests exist yet for app donors | Create one bridge test per donor | Harness now fails with donor-specific missing evidence |
| 2026-04-10 | Mount evidence | `npm run test:conformance:mounts` | 1 | App donor routes still mount `source-baseline` / `external-source-reference` kinds | Fix one donor route at a time | Mount suite now pinpoints the mismatched mount kind |
| 2026-04-10 | Phase 3 scaffold tests | `python world-model/scripts/run_harness.py --phase 9` | 1 | `bridge-harness.test.ts` still has no executable bridge files and donor routes still mount source-baseline kinds | Split the donor-runtime migration into one donor route and one bridge file at a time | Strict harness now advances through Phases 0-2 and fails on the first Phase 3 exactness gate |
| 2026-04-11 | Donor E2E harness | `python world-model/scripts/check_phase_9_exact_donor_ui.py` | 1 | Live donor startup failures for `mythforge`, `orbis`, `adventure-generator`, and `dawn-of-worlds`; `mappa-imperium` missing required button evidence | Keep donor E2E parallel, fail fast on startup errors, and isolate the mappa parity selectors | E2E report now records per-donor startup failures and reference/scaffold tests pass |
| 2026-04-11 | Exact donor-ui semantics | `python world-model/scripts/check_phase_9_exact_donor_ui.py` | 1 | `DonorPage` still mounted `DonorRuntimeHost` and every donor root was only a `runtime.ts` marker | Vendor one donor subapp package at a time with `package.json`, `src/WorldModelDonorApp.tsx`, style/assets, direct route mount, then rerun exactness | Superseded by donor source vendoring and `DonorSubappHost` route split |
| 2026-04-11 | Phase 9-only harness | `python world-model/scripts/run_harness.py --only 9` | 19 | Phase 9 inventory passed, exactness failed on `DonorPage` using `DonorRuntimeHost` as primary donor route body | Replace `DonorRuntimeHost` route body with donor subapp registry after vendoring the first donor runtime | Harness failure is bounded and no longer hangs on donor E2E while static rehost evidence is missing |
| 2026-04-11 | Watabou clean-room rehost | `npm run test:conformance:mounts` | 1 | Vendored Watabou source could not resolve donor-local Tailwind and schema assets from the unified app route | Vendor the missing clean-room `docs/06-schemas` assets and adapt the vendored CSS import to the unified app Tailwind package | Resolved; Watabou now mounts as `rehost-mounted`, not `exact-vendored` |
| 2026-04-11 | Phase 9B conformance | `npm run test:conformance:phase9b` | 1 | Conformance and integration tests still asserted the retired `DonorRuntimeHost` route body | Update tests to assert the donor subapp host, full-bleed donor routes, Watabou clean-room app evidence, and context retention after returning to shell routes | Resolved; Phase 9B Vitest harness passes |
| 2026-04-11 | Static donor subapp mount evidence | `python world-model/scripts/check_phase_9_exact_donor_ui.py` | 1 | The checker verified `DonorPage` no longer used `DonorRuntimeHost`, but did not prove a `rehost-mounted` donor is imported through `DonorSubappHost` | Require `WorldModelDonorApp` imports in `DonorSubappHost` for any `rehost-mounted` or `exact-vendored` donor | Resolved for Watabou; exactness remains red for remaining route-mount and parity certification |
| 2026-04-11 | Exhaustive donor source vendoring | `python world-model/scripts/check_phase_9_exact_donor_ui.py` | 1 | Seven donor roots had no app package metadata or `WorldModelDonorApp` entrypoint | Copy donor source packages into `world-model/apps/donors/<id>/`, excluding dependency/build/temp outputs, then add wrapper entrypoints | Source packages and entrypoints now exist; route integration and exact parity remain open |

## Current Working Set

- Phase 0 strict-harness blocker is resolved.
- Phase 1 strict-harness blocker has been cleared.
- Phase 9 exactness blocker: donor roots now have vendored source packages and `src/WorldModelDonorApp.tsx` entrypoints, but all donors except Watabou still need per-framework route mount adapters, canonical bridge depth, Playwright parity, and `exact-vendored` status only after parity passes.
- Phase 3/Phase 9 scaffold tests now label unrehosted donor routes as `scaffold-mounted`, not exact donor rehosts.
- Phase 9 donor E2E blocker: browser parity is skipped by the exactness checker until donor routes are exact-mounted and parity-certified, so stale E2E reports cannot be mistaken for current exactness proof.
- Special donors remain intentionally split from app-donor work:
  - `watabou-city` is vendored from `to be merged/watabou-city-clean-room/2nd/` and mounts as `rehost-mounted`; it still needs Playwright/live parity before `exact-vendored`
  - `encounter-balancer` has representative source vendored from `to be merged/apocalypse/`, but still needs route mount integration and clone-equivalence parity before exactness
