# UI Questionnaire: Battlemap Token Generator (CreateToken_v1 & v2)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
An automated image-prompt architect designed to generate 2D, top-down aerial view assets (VTT tokens) with transparent backgrounds for TTRPG maps.

## 2. Core Inputs
- **Character/Creature Description:** The visual details of the subject (e.g., "A dwarf paladin in plate armor").
- **Style Preset:** (Select: Fantasy, Sci-Fi, v2 Token Style).
- **Background Setting:** (Implicitly Transparent PNG).
- **Detail Level:** (Vivid Colors, High Detail).

## 3. UI Requirements
- **Visual Description Studio:** A rich text area to describe the character's attire and features.
- **Aesthetic Toggles:** Specific buttons for "2D Game Art," "VTT Style," and "v1/v2 Presets."
- **Prompt Previewer:** A real-time display of the compiled DALL-E prompt.
- **Image Generation Hub:** Integration with DALL-E to generate and view the resulting token asset.
- **Transparency Filter:** A tool to confirm or apply background transparency for the PNG output.

## 4. Derived & Automated Fields
- **Perspective Enforcer:** Automatically adds the "Directly from above/Aerial view" instructions to the prompt.
- **Contextual keyword Injector:** Adds "Battlemap asset," "D&D token," and "png" based on the selected mode.

## 5. Exports & Integration
- Generated Token Image (PNG with transparency).
- Compiled Image Prompt (Text).
- VTT Asset Manifest.
