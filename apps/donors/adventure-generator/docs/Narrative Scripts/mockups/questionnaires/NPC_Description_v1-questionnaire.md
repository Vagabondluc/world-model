# UI Questionnaire: Detailed NPC Architect (v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A narrative-heavy character design suite that blends structured data (table-based) with deep, multi-sectional personality and backstory generation.

## 2. Core Inputs
- **Card Value/Seed:** (A value used to seed the initial generation or link to a physical deck).
- **Core Identity:** (Name, Race, Role/Profession).
- **Alignment Matrix:** (Lawful/Neutral/Chaotic & Good/Neutral/Evil).
- **Atmospheric Palette:** (High-detail sensory keywords).

## 3. UI Requirements
- **Structured Data Grid:** A 16-field table editor covering all script requirements (from Catchphrases to Secret Knowledge).
- **Multi-Phase Character Studio:** Three distinct editing panes:
    1. **The Brief:** The high-level table.
    2. **The History:** Concisely written backstory generator.
    3. **The psyche:** Four specific sections for deep-dive personality logic.
- **Word-Count Monitor:** A live counter focused on the 500-word limit.
- **"Card Value" Linker:** A tool to input or randomly generate the "Card Value" used in the script.
- **Roleplay Cue Board:** A prominent list-builder for "Speaks slowly," "Nervous tic," etc.

## 4. Derived & Automated Fields
- **Psyche Synthesis:** Automatically populates the "Personality" section based on selections in the table (Motivations, Flaws).
- **Catchphrase Engine:** Suggests expressions based on Role/Profession and Alignment.
- **Contextual Knowledge Suggester:** Prompts the DM for "Available" vs "Secret" intel relative to the NPC's profession.

## 5. Exports & Integration
- Full Lore Dossier (Markdown, <500 words).
- Printable Character Sheet.
- AI Image Prompt (derived from the "Appearance" field).
