# NPC_Description_Simple_v1 — UI Explanation

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Overview
Ultra-minimal physical description generator following strict template format. Produces single-paragraph descriptions copy/paste-ready for GM encounter notes.

## Environment
React + Tailwind. Components: `SimpleDescForm`, `TemplatePreview`, `SeedControls`.

## Form Field Mapping
All fields → template variables:
- `characterName` → (Name)
- `age` → (Age)
- `gender` → (Gender)
- `race` → (Race)
- `profession` → (Profession)
- `hairLength` → (Length)
- `hairTexture` → (Texture)
- `hairColor` → (Color)
- `eyeColor` → (Color)
- `skinColorDesc` → (Color/Desc)
- `heightCm` → (Height cm)
- `heightFtIn` → (Height ft/in) — auto-calculated from cm
- `bodyType` → (Body Type)
- `faceShape` → (Shape)
- `faceAdditionalDesc` → (Additional Description)
- `notableBehaviors` → (Notable behaviors)
- `seed` → generation.seed

## Template Format
Strictly enforced output:
```
(Character Name) is a (Age) year old (Gender) (Race) (Profession).
They have (Length), (Texture), (Color) hair and (Color) eyes.
They have (Color/Desc) skin.
They stand (Height cm) (Height ft/in) tall and have a (Body Type) build.
They have a (Shape), (Additional Description) face.
(Notable behaviors or traits).
```

## Behavior
### Height Auto-Calculation
When user enters `heightCm`, auto-calculate and display `heightFtIn`:
```js
const feet = Math.floor(cm / 30.48);
const inches = Math.round((cm % 30.48) / 2.54);
```

### AI Fill
POST to AI with template and current form state. AI returns filled template as plain text. Parse and extract values to populate form fields.

### Generate (Procedural)
- RNG seed → sample all dropdown tables
- Height: random within race-appropriate range (e.g., Dwarf: 110-150cm, Human: 150-200cm, Elf: 160-210cm)
- Auto-calculate ft/in from cm

## Validation
- Name: required, 2-50 chars
- Age: 1-999, warning if > 200 for non-elf races
- Height: 50-300 cm, validate against race norms

## Persistence & Export
- Save as snippet in `cards` collection: `type: "NPCSnippet"`, `formData.snippet` contains final paragraph
- Copy to clipboard button
- No full card creation (this is description-only tool)

## Edge Cases
- Missing fields → use placeholder "(unknown)" in template
- Invalid height → clamp to min/max
- Empty seed → timestamp-based

## Accessibility
- Simple form, clear labels
- Template preview uses semantic paragraph element
- Height conversion announced for screen readers

## Testing
- Unit: height conversion accuracy, template assembly
- Integration: RNG determinism with seed
- E2E: fill form → generate → copy → verify clipboard
