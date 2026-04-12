# Documentation Normalization Plan

> Status: Draft
> Scope: All Mythforge docs
> Goal: Normalize the documentation set so specs, TDD plans, harness references, and roadmaps use one vocabulary and one milestone model.

## Objective

Mythforge currently has overlapping documentation across `docs/specs`, `docs/schema-templates`, `docs/loom`, `docs/openui`, and research material. The goal of this plan is to make the docs readable as one system:

- one canonical place for each topic
- one canonical place for category schemas, prompts, and workflow notes
- one roadmap that defines milestones
- one testing story that proves the UI end to end
- one onboarding checkpoint at the end of every milestone

## Normalization Rules

- Specs define intended behavior.
- TDD plans define how behavior is tested.
- Roadmaps define milestone order and user checkpoints.
- Schema-template docs define category schema, prompt, and workflow contracts.
- Harness docs define how true E2E flows are exercised in the UI.
- Research docs remain reference material and should not conflict with canonical specs.
- If a term appears in more than one doc, it must use the same definition everywhere.

## Planned Work

### Phase 1: Doc Inventory and Canonical Map

Deliverables:

- identify canonical docs for Loom, Schema Templates, OpenUI, and Mythforge core
- mark overlapping or deprecated docs as secondary references
- list every doc that is missing links, status labels, or owner context
- create a single index for the docs tree

Atomic actions:

- scan every active doc under `docs/`
- assign one canonical owner doc per topic
- flag duplicate or overlapping docs as reference-only
- add status labels to the main docs
- wire the index page to the canonical docs
- identify any doc that should be renamed for consistency

Verification:

- every active doc appears in `docs/README.md`
- every canonical topic has exactly one primary doc
- ambiguous doc titles are renamed or cross-linked

User checkpoint:

- I will ask you to review the index and confirm the canonical doc list before moving on

### Phase 2: Spec, Schema-Template, and TDD Alignment

Deliverables:

- align terminology across `MYTHFORGE_ENDGOAL_SPEC.md`, `docs/schema-templates`, Loom docs, and OpenUI docs
- make TDD plans refer to actual implementation milestones
- update references so specs point to TDD plans and TDD plans point back to specs
- separate conceptual design from implementation steps

Atomic actions:

- normalize shared terms and status language across the schema-template docs and the core specs
- make each spec point to its matching TDD or roadmap doc
- make each TDD doc point back to the source spec
- remove or reword any sentence that claims implementation is already done when it is only planned
- separate design intent from execution steps
- keep research docs as supporting material, not canonical sources

Verification:

- each spec has a matching testing path
- each TDD plan references the behavior it validates
- no doc claims a feature is implemented when the repo only documents it

User checkpoint:

- I will pause for your review of the aligned terminology and ask you to test the relevant UI slice if the milestone changes visible behavior

### Phase 3: Harness and True E2E Story

Deliverables:

- document the canonical harness path (`tests/harness/openui-optiona-harness.ts`) and its purpose
- ensure the harness is described as a UI-facing test tool, not just a mock helper
- connect harness examples to browser and desktop end-to-end flows
- add explicit pass/fail criteria for immediate render, fallback render, and error handling

Atomic actions:

- confirm the harness file exists, or add it if the repo is missing it
- document the browser UI entrypoint that the harness drives
- document the desktop/Tauri UI entrypoint that the harness drives
- describe the immediate-render path as a true UI interaction, not a unit test
- describe the fallback-render path as a visible UI fallback, not just a config change
- describe the validation-error path as a user-facing failure state
- define pass/fail criteria for each harness scenario

Verification:

- harness documentation names the actual UI surfaces it drives
- at least one browser flow and one desktop flow are described end to end
- the docs distinguish unit tests, contract tests, and UI E2E tests

User checkpoint:

- I will ask you to run the UI flow that the harness describes and confirm the observed behavior matches the doc

### Phase 4: Roadmap and Milestone Gates

Deliverables:

- create the canonical roadmap
- define milestone order
- include the required UI test gate for each milestone
- define the user questions to ask at each checkpoint

Atomic actions:

- write the milestone checklist in execution order
- attach one exact browser/desktop test to each milestone gate
- define the checkpoint question for each milestone
- require a user answer before the next milestone can start
- document the onboarding flow for a fresh contributor or user
- make the no-advance-without-confirmation rule explicit

Verification:

- every milestone has a completion gate
- every gate requires a human UI test
- each gate includes the exact question I will ask you before the next milestone begins

User checkpoint:

- I will stop at each milestone and ask you for confirmation before continuing

## Success Criteria

- docs are consistently named and cross-linked
- roadmap milestones match the implementation/test sequence
- harness-backed E2E testing is documented as a real UI process
- user onboarding checkpoints exist at every milestone boundary
