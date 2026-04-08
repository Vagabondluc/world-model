# UI Taxonomy Spec v0

## Purpose

This spec defines several candidate UI taxonomies for the unified app so they can be prototyped and compared against the same canonical data model and task set.

The goal is not to choose a final taxonomy yet. The goal is to test which structure best communicates:

- one shared product
- one shared canonical bundle
- multiple workflows
- modal tools such as the Markov name generator
- expert surfaces without cluttering the primary flows

## Non-Negotiables

All prototype variants must share:

- one canonical bundle
- one save/load path
- one persistent shell
- one global world/context indicator
- one modal tool system
- no donor-runtime dependency
- no duplicated source of truth

Modal tools, including the Markov name generator, must:

- be launchable from relevant surfaces
- not become durable state
- not become their own top-level app unless that is proven necessary by testing

This includes wizards and generators such as:

- city generator
- dungeon generator
- biome generator
- name generator
- guided workflow wizards
- import / migration wizards

These tools should be exposed in two ways:

- a direct button or action in the relevant screen
- a separate tools menu or launcher for discovery and reuse

## Common Surface Rules

Every prototype must support:

- open canonical bundle
- save canonical bundle
- inspect current world
- edit canonical records
- generate names
- view migration/import reports
- switch primary task area
- preserve context across navigation

## Taxonomy Candidates

### Option A: Role-Based Tabs

Top-level tabs represent user jobs.

Tabs:

- World
- Story
- Schema

Characteristics:

- World covers maps, locations, cities, biomes, dungeons, entities, and spatial relationships
- Story covers quests, sessions, progression, and generated content
- Schema covers contracts, adapters, migration reports, and provenance

Pros:

- clear and concrete
- easy to explain
- good separation of concerns

Cons:

- can still feel broad if World absorbs too much
- Story may overlap with World if not tightly scoped

### Option B: Task-Based Tabs

Top-level tabs represent actions.

Tabs:

- Create
- Edit
- Inspect
- Validate

Characteristics:

- Create covers generation and first-time setup
- Edit covers direct canonical record editing
- Inspect covers browse/search/compare behavior
- Validate covers schema, migration, provenance, and reports

Pros:

- action-oriented
- easy for first-time users
- modal tools fit naturally under Create

Cons:

- less domain-specific
- can feel abstract over time
- may hide the difference between world, story, and schema content

### Option C: Artifact-Based Tabs

Top-level tabs represent data categories.

Tabs:

- World
- Characters
- Places
- Stories
- Schemas
- Reports

Characteristics:

- each tab owns one artifact class
- modal tools vary by artifact type

Pros:

- explicit and familiar
- easy to reason about what lives where
- good for browsing and editing

Cons:

- may fragment the user experience
- creates overlap between places, worlds, and stories
- can become too many tabs

### Option D: Workflow Stages

Top-level tabs represent the user journey.

Tabs:

- Start
- Build
- Run
- Review

Characteristics:

- Start covers open/create/select
- Build covers edit and generation
- Run covers use, simulation, or guided play
- Review covers schema, migration, and provenance

Pros:

- strong onboarding
- good for guided usage
- easy to present as one flow

Cons:

- weaker for expert users
- expert tools can feel buried
- not ideal if users jump around frequently

### Option E: Layered Split

Top-level tabs represent layers of the system.

Tabs:

- Surface
- Model
- Schema

Characteristics:

- Surface covers user-facing content
- Model covers canonical records and relationships
- Schema covers adapters, imports, migration, and provenance

Pros:

- architecturally honest
- matches the system design
- keeps canonical truth explicit

Cons:

- too technical for some users
- weak as a product-facing label set
- may not guide user intent well enough

## Recommended Prototype Set

Prototype at least these three first:

- Role-Based Tabs
- Task-Based Tabs
- Workflow Stages

Reason:

- they test three distinct mental models
- they are different enough to reveal real preference
- they cover both beginner and expert navigation styles

If there is room for a fourth prototype, add:

- Artifact-Based Tabs

Defer Layered Split unless the goal is specifically to test a more technical framing.

## Modal Tool Spec

Modal tools should be shared across taxonomies where relevant.

### Markov Name Generator

Launch points:

- World
- Story
- Create
- Build

Returns:

- suggested names
- selected style or seed
- optional preview
- apply-to-field action

State:

- local to the modal until applied
- not persisted as canonical data

The same pattern should apply to other generation wizards, including city and place generators.

### Migration Report Viewer

Launch points:

- Schema
- Review
- Validate

Returns:

- donor
- run ID
- mapped / dropped / conflict counts
- replay result
- provenance summary

State:

- read-only
- no canonical mutation

### Import Preview

Launch points:

- Schema
- Review
- Validate

Returns:

- what will be imported
- what will be dropped
- what conflicts require resolution

State:

- temporary
- dismissible without side effects

## Shared Prototype Requirements

Each prototype should include:

- tab navigation
- one canonical entity/world editor surface
- one generator modal
- one report viewer surface
- one global save/load entry point
- one consistent location for selected-world context

## Evaluation Criteria

Compare prototypes using the same questions.

### Learnability

Can a new user tell:

- where to start
- where to edit
- where to generate
- where to inspect

### Cohesion

Does the app feel like:

- one product
- one data model
- one workflow system

### Expert Access

Can power users reach:

- schema
- migration
- adapter mappings
- reports

without disrupting beginner flows?

### Modal Fit

Does the Markov name generator feel like:

- a helpful tool
- not a separate app
- not a clutter source

### Scalability

Can the taxonomy absorb more tools later without becoming messy?

## Experimental Plan

For each taxonomy:

1. build the shell
2. wire the same canonical sample bundle
3. wire the same modal tools
4. wire the same report viewer
5. test the same tasks
6. compare results side by side

### Core Tasks to Test

- open a bundle
- create a world
- generate a name
- edit a record
- save the bundle
- inspect a migration report
- switch between top-level areas without losing context

## Expected Outputs Per Prototype

Each variant should produce:

- one shell implementation
- one tab set
- one route mapping
- one modal tool configuration
- one UI test suite
- one short evaluation note

## Decision Rule

After testing, choose the taxonomy that best balances:

- clarity for new users
- power for advanced users
- fit for modal tools
- coherence of one canonical data model

## Initial Recommendation

Start with:

- Role-Based Tabs as the likely strongest default
- Task-Based Tabs as the strongest challenger
- Workflow Stages as the guided-first alternative

That gives a useful spread without overbuilding.
