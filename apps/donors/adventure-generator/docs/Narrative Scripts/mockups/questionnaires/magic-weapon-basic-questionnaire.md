# UI Questionnaire: magic-weapon-basic

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A tool to transform a thematic description into a balanced, ready-to-use D&D 5e magic weapon stat block.

## 2. Core Inputs
- **Base Description:** The thematic or lore-based description of the weapon.
- **Goal Rarity:** (Common, Uncommon, Rare, Very Rare, Legendary).
- **Online Search Toggle:** Enable/Disable web search for source material accuracy.
- **Weapon System:** (Default 5e, but flexible).

## 3. UI Requirements
- **Input Text Area:** For the primary flavor description.
- **Rarity Selector:** A dropdown or slider to set the power level.
- **Feature Counter:** A visual indicator showing how many features are allowed based on the selected rarity (e.g., Rare = 2 features).
- **Balance Validator:** A toggle to ensure the weapon stays within 5e math limits.

## 4. Derived & Automated Fields
- **Stat Block Generator:** Automatically formats the weapon name, type, cost, damage, properties, and flavor text.
- **Rarity Constraints:** Enforces the "feature limit" (Common=0, Uncommon=1, Rare=2, etc.) based on the rarity input.

## 5. Exports & Integration
- Digital Stat Block (Markdown).
- VTT Item Manifest (JSON).
- Printable Item Card.
