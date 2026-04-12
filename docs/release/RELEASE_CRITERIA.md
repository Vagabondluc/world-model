# Release Criteria

The final app can be released only when the following are true.

## Shipped UI

- The public app uses the `World`, `Story`, and `Schema` taxonomy as the primary navigation.
- Prototype routes under `/prototype/role`, `/prototype/task`, and `/prototype/flow` remain available for internal comparison only.
- Legacy `/guided`, `/studio`, and `/architect` routes redirect to public routes and are not shown as the primary product surface.
- Modal tools are available from the shell tools menu and from contextual buttons inside the relevant tab.
- Wizards and generators remain modal tools, not separate runtime apps.

## Canonical model

- `world-model` defines the canonical records and attachments.
- Promoted schema contracts are emitted and versioned.
- Append-only history and projection behavior are stable.
- Save/load round-trips preserve canonical bundle content without overlay leakage.

## Adapter layer

- Donor repos are not runtime dependencies.
- Copied adapter snapshots exist for each donor.
- Each adapter has passing tests.
- Migration replay is reproducible.
- Phase 2 snapshot hashes and Phase 4 replay reports remain stable across reruns.

## Accessibility and safety

- Shell navigation, tabs, tools, and dialogs are keyboard reachable.
- Focus moves into modal dialogs and returns to the triggering control on close.
- Save/load and other critical actions are visible without pointer-only workflows.
- Modal escape behavior is supported for dismissal.

## Performance and scale

- Large canonical bundle save/load cycles complete within release thresholds.
- Large adapter snapshot checks complete within release thresholds.
- Migration replay and bundle hydration remain usable under stress cases.

## Known limitations

- Prototype routes remain available for internal comparison and compatibility redirects.
- Donor-specific UI behavior is intentionally not preserved in the final app shell.
- Release thresholds are based on representative stress bundles rather than exhaustive production datasets.

## Verification commands

Run these commands before release sign-off:

- `cd world-model/apps/unified-app && npm run verify`
- `python world-model/scripts/check_phase_2_snapshots.py`
- `python world-model/scripts/check_phase_4_migration.py`
- `python world-model/scripts/check_phase_6_release.py`
- `python world-model/scripts/run_harness.py --phase 6`
- `python world-model/scripts/run_harness.py --phase 6 --cleanup --cleanup-scope safe`

## Quality gates

- unit tests pass
- adapter tests pass
- migration tests pass
- release hardening tests pass
- browser E2E passes where applicable
- no open architecture decision remains unresolved for the release scope
- the release checklist in this document is complete and reviewable
- default cleanup preserves repo-root reports while removing harness-owned scratch outputs

## Exclusions

The release does not require:

- re-implementing donor apps
- perfect feature parity with donor UIs
- moving all donor code into the final app
- making prototype routes public as the primary navigation

The release does require:

- one coherent product surface
- one canonical world model
- one adapter path per donor
- one stable release checklist and maintenance plan
