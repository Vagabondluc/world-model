# npc_creator_bot — UI Explanation

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Overview
Versatile NPC generator with dual modes: Random (seed-based) or From Prompt (AI-driven). Includes text-to-image AI prompt generation optimized for Stable Diffusion/DALL-E.

## Environment
React + Tailwind. Components: `NPCBotForm`, `ModeSelector`, `ConditionalFields`, `ImagePromptPreview`, `DialogSample`.

## Form Field Mapping
Input fields:
- `generationMode` → "random" | "fromPrompt" (radio)
- `textPrompt` → prompt text (conditional, required if fromPrompt)
- `race` → formData.race (conditional, only if random)
- `class` → formData.class (conditional, only if random)
- `alignment` → formData.alignment (conditional, only if random)
- `imageStyle` → generation.imageStyle (enum: fantasy-art/realistic/anime/sketch)
- `seed` → generation.seed

Output fields (all auto-generated):
- `race` → formData.race
- `class` → formData.class
- `alignment` → formData.alignment
- `personalityTraits` → formData.personalityTraits (array[5])
- `goals` → formData.goals (string)
- `visualDescription` → formData.visualDescription (string, no line breaks)
- `sampleDialog` → formData.sampleDialog (string, 1-3 sentences)

## Mode Switching
### Random Mode
Shows: Race dropdown, Class dropdown, Alignment dropdown, Seed input
Hides: Text Prompt textarea
Behavior: procedural generation from tables

### From Prompt Mode
Shows: Text Prompt textarea, Seed input
Hides: Race/Class/Alignment dropdowns
Behavior: AI parses prompt and generates all fields

Mode change clears previous generation data (with confirmation).

## Behavior
### AI Fill (From Prompt Mode)
POST to AI:
```json
{
  "mode": "fromPrompt",
  "prompt": "<user prompt>",
  "imageStyle": "<style>",
  "seed": "<seed>"
}
```
AI returns structured JSON:
```json
{
  "race": "Half-Elf",
  "class": "Bard",
  "alignment": "Neutral Good",
  "personalityTraits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
  "goals": "Seeks to...",
  "visualDescription": "A slender half-elf woman...",
  "sampleDialog": "\"The song I play...\""
}
```

### Generate (Random Mode)
- RNG seed → sample race, class, alignment from dropdowns or tables
- Generate 5 personality traits from weighted table
- Generate goals from templates
- Assemble visual description from race/class/style templates
- Generate sample dialog from personality-appropriate templates

### Visual Description Format
Critical: must be single paragraph, no line breaks, optimized for text-to-image AI:
- Include: race, age range, physical features, clothing/gear, pose/setting, art style, lighting
- Exclude: bullet points, numbered lists, line breaks
- Example: "A slender half-elf woman in her late twenties with long silver hair braided with musical note charms, wearing elegant traveling bard robes in deep violet and gold, holding an ornate lute carved with glowing runes, amber eyes filled with determination, standing in a moonlit forest clearing, fantasy art style, detailed character portrait, soft magical lighting"

### Image Style Integration
Visual description adapts based on `imageStyle`:
- fantasy-art → "fantasy art style, detailed character portrait"
- realistic → "photorealistic, high detail, natural lighting"
- anime → "anime style, cel-shaded, vibrant colors"
- sketch → "pencil sketch, concept art, monochrome"

## Persistence & Export
- Save as `card`: `type: "NPC"`, formData contains all fields
- Copy visual description to clipboard (for pasting into image AI)
- "Generate Image" button → opens image AI tool with pre-filled prompt (if integrated)

## Edge Cases
- Prompt mode with race/class selected → ignore manual selections, use AI interpretation
- Random mode with prompt filled → ignore prompt, use random selections
- Visual description > 500 chars → truncate and warn (some image AIs have limits)
- AI returns < 5 personality traits → pad with procedural traits
- Sample dialog too long → truncate to 3 sentences max

## Accessibility
- Mode selector clearly labeled with radio buttons
- Conditional fields announced when shown/hidden
- Visual description copyable via keyboard shortcut

## Testing
- Unit: mode switching, visual description format validation, trait count
- Integration: AI response parsing, procedural generation determinism
- E2E: random mode → generate → copy visual → paste to image AI tool
- E2E: prompt mode → AI fill → save to cards → export
