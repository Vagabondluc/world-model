# Onboarding UI Specification

Version: 1.0  
Date: 2026-03-10  
Scope: `src/icon-generator/*`

## Goal

Add a first-run onboarding option that explains how to use the icon generator UI with guided, step-by-step instructions tied to real interface elements.

## Requirements

1. Add an onboarding entry point in the main generator page.
2. Provide scripted steps with:
- step id
- title
- description
- target selector (`[data-onboard="..."]`)
3. On each step:
- auto-scroll target into view
- visually highlight target
- show step index (`n / total`)
4. Navigation controls:
- `Previous`
- `Next`
- `Finish` on last step
- `Close` at any time
5. Do not mutate user config while onboarding runs.
6. Onboarding must work on desktop and mobile layouts.

## Step Coverage (Minimum)

1. Seed input and randomize
2. Domain selection
3. Complexity slider
4. Color preset + apply mode
5. Manual color channels (owner icons)
6. Generate / Regenerate / Lock controls
7. Variant grid selection
8. Composition controls
9. Final touches overlay controls
10. Export actions

## Technical Contract

- Script source of truth: `src/icon-generator/onboardingScript.ts`
- UI target hooks: `data-onboard="<key>"` on relevant elements
- Runtime behavior:
  - resolve target by selector
  - apply temporary outline while step active
  - remove outline on step change/exit

## Acceptance Criteria

- Clicking onboarding entry starts at step 1.
- Step navigation moves through all scripted steps without runtime errors.
- Each step with a valid selector highlights the intended target.
- Closing onboarding removes any active highlight.
- No config values are changed unless user interacts with controls manually.

