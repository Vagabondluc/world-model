# Documentation Normalization Roadmap

> Status: Draft
> Version: 1.0
> Scope: Mythforge docs normalization and harness-backed UI verification
> Operating rule: No milestone is considered complete until the user has tested the UI and answered the checkpoint question.

## Roadmap Overview

This roadmap turns the documentation cleanup into a staged delivery process. Each milestone ends with a user-facing UI test checkpoint.

| Milestone | Focus | Output | User test gate |
|---|---|---|---|
| 1 | Canonical docs index | A single entry point for docs and status labels | Confirm the index matches the repo structure |
| 2 | Schema-template and TDD normalization | Schema templates, specs, and TDD plans use the same vocabulary and references | Test the category template editor/manager flow and confirm the schema state matches the docs |
| 3 | Harness-backed E2E | True end-to-end UI coverage is documented and runnable | Run browser and desktop flows through the harness |
| 4 | Onboarding and milestone gates | Roadmap checkpoints ask the user for confirmation at every boundary | Answer the milestone question before continuing |

## Milestone 1: Canonical Docs Index

Goal:

- make it obvious which docs are canonical
- reduce duplication and conflicting terminology
- establish the docs home page

Atomic actions:

- [ ] Inventory the docs tree
  Acceptance: every active doc under `docs/` is accounted for.
- [ ] Pick one canonical file per topic
  Acceptance: every topic has exactly one primary doc and all others are reference-only.
- [ ] Mark secondary docs as supporting/reference material
  Acceptance: no reference doc competes with the canonical source for the same topic.
- [ ] Add the docs index page
  Acceptance: `docs/README.md` links to the canonical docs set.
- [ ] Add explicit status labels to the main docs
  Acceptance: each canonical doc states whether it is draft, reference, or canonical.
- [ ] Add cross-links from the index to the canonical sources
  Acceptance: users can navigate from the index to every canonical doc without dead links.

Deliverables:

- `docs/README.md` as the canonical index
- clear status labels on the main docs
- links from specs to their matching TDD or roadmap docs

User checkpoint:

- Please review the docs index and confirm whether the canonical list matches how you expect to navigate the project.

Exact UI test at the gate:

- Browser: start the app in the browser, open the main shell, and confirm the app still loads cleanly after the docs pass.
- Desktop: start the Tauri/desktop build, open the same shell, and confirm the window opens and the core layout renders.

Question to ask at milestone completion:

- "Does this docs index reflect the project the way you would actually browse it?"

## Milestone 2: Schema-Template and TDD Normalization

Goal:

- align the schema-template docs, main specs, TDD plans, and implementation plans
- remove ambiguity about what is intended, what is tested, and what is already built in the template workflow

Atomic actions:

- [ ] Normalize shared terms across the schema-template docs
  Acceptance: `docs/schema-templates/index.md`, `methods.md`, and `methods/architect_guide.md` use the same definitions for schema, prompt, workflow, sample, and validation.
- [ ] Decide the category-name collision policy for runtime custom templates
  Acceptance: the docs state whether a custom category may shadow a built-in one.
- [ ] Decide the inheritance-cycle policy for runtime custom templates
  Acceptance: the docs state whether cycles are rejected, warned about, or resolved by fallback.
- [ ] Add an implementation map to the schema-template index that shows schema layer, workflow layer, validation layer, and UI layer
  Acceptance: the docs explain how `docs/schema-templates` maps to `src/lib/validation/schemas-entities.ts`, `src/lib/validation.ts`, `src/lib/types/templates.ts`, `src/components/mythosforge/TemplateManager.tsx`, and `src/components/mythosforge/TemplateEditor.tsx`.
- [ ] Make each schema-template doc point to the matching runtime file or TDD doc
  Acceptance: every category template has a visible path to implementation and verification docs.
- [ ] Make each spec point to the matching TDD or roadmap doc
  Acceptance: every spec has a visible path to implementation and verification docs.
- [ ] Make each TDD plan point back to the source spec
  Acceptance: every plan names the behavior it validates.
- [ ] Remove any wording that implies the schema/template workflow is already implemented when it is only partially wired
  Acceptance: no doc claims custom-schema generation, prompt registration, or editor coverage that is not in code.
- [ ] Separate design intent from execution detail
  Acceptance: design docs and implementation docs are clearly labeled and do not blur roles.
- [ ] Keep research docs from contradicting canonical docs
  Acceptance: research material is marked as reference-only when it conflicts with canonical status.

Deliverables:

- consistent terminology across schema-template, spec, and TDD docs
- cross-links between schema-template docs, runtime files, and implementation plan files
- concise status sections on the main docs

User checkpoint:

- Test the category template editor/manager flow that the docs describe and verify that the visible schema fields and validation states match what you see.

Exact UI test at the gate:

- Browser: open the category template editor/manager flow, create or edit a template, save it, and confirm the visible fields and validation messages match the schema-template docs.
- Desktop: repeat the same flow in the desktop app and confirm the same visible schema and validation states appear there.

Question to ask at milestone completion:

- "Did the template editor and validator behave the way the normalized schema docs described them?"

## Milestone 3: True E2E Harness Coverage

Goal:

- prove the UI end to end with the harness, not only with unit tests
- keep the browser flow and desktop flow both covered

Atomic actions:

- [x] Verify the canonical harness file exists at `tests/harness/openui-optiona-harness.ts`
  Acceptance: the helper file is present and used by the OpenUI route tests.
- [ ] Document how the harness drives the browser UI
  Acceptance: the docs name the browser entrypoint that the harness will hit.
- [ ] Document how the harness drives the desktop UI
  Acceptance: the docs name the desktop entrypoint that the harness will hit.
- [ ] Write down the immediate-render scenario as a visible UI flow
  Acceptance: the docs describe a user-visible immediate response path, not just an API response.
- [ ] Write down the streaming-fallback scenario as a visible UI flow
  Acceptance: the docs describe the fallback as an observable UI state change.
- [ ] Write down the validation-error scenario as a visible UI flow
  Acceptance: the docs describe the failure state the user sees.
- [ ] Define pass/fail criteria for each scenario
  Acceptance: each flow has an explicit pass condition and an explicit fail condition.

Required E2E coverage:

- browser UI flow
- desktop/Tauri UI flow
- immediate render path
- streaming fallback path
- error and validation handling path

Deliverables:

- harness documentation that names the actual UI surfaces and the canonical harness path (`tests/harness/openui-optiona-harness.ts`)
- harness examples for browser and desktop execution
- clear pass/fail criteria for each flow
- documented distinction between unit, contract, and E2E tests

User checkpoint:

- Run the harness-backed UI flow in the browser and in the desktop app, then confirm the observed result.

Exact UI test at the gate:

- Browser: run the harness against the browser UI and confirm the immediate render, fallback, and validation-error cases all behave as documented.
- Desktop: run the same harness-backed flow against the desktop UI and confirm the same three cases behave the same way.

Question to ask at milestone completion:

- "Did both the browser UI and the desktop UI pass the harness-backed end-to-end flow?"

## Milestone 4: Onboarding and Milestone Gates

Goal:

- make the roadmap self-bootstrapping for the user
- ensure every milestone boundary includes a pause for confirmation

Atomic actions:

- [ ] Write the checkpoint prompts into the roadmap
  Acceptance: each milestone has a specific question the user must answer.
- [ ] Explain how to review the docs before a milestone starts
  Acceptance: the onboarding flow tells the user where to begin.
- [ ] Explain how to test the UI at each boundary
  Acceptance: each milestone tells the user what to open and what behavior to verify.
- [ ] Make it explicit that the next milestone does not start until the user answers
  Acceptance: the roadmap states that user confirmation is mandatory before advancing.
- [ ] Document the resume flow if a checkpoint is paused
  Acceptance: a paused milestone can be resumed without ambiguity.

Deliverables:

- milestone gate text for the roadmap
- the checkpoint question to ask the user at each boundary
- a short onboarding section explaining how to test the UI at each milestone

User checkpoint:

- I will stop at each milestone, ask you to test the UI, and wait for your answer before continuing.

Exact UI test at the gate:

- Browser: open the docs index and roadmap, confirm the checkpoint instructions are visible, and confirm the next step is clear.
- Desktop: open the same docs in the desktop app or desktop browser workflow, and confirm the checkpoint instructions are visible there too.

Question to ask at milestone completion:

- "Do you want me to continue to the next milestone?"

## Onboarding Flow

1. Read `docs/README.md` to find the canonical document.
2. Review the current milestone in `docs/DOCS_NORMALIZATION_ROADMAP.md`.
3. Run the UI flow described by the milestone.
4. Answer the checkpoint question.
5. Continue only after the milestone is accepted.

## Definition Of Done

- docs are normalized
- roadmap milestones are explicit
- harness-backed E2E testing is documented as a real UI test
- the user is prompted at every milestone boundary
