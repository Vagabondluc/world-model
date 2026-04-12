# UI Questionnaire: magic-item

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A comprehensive magic item architect for conceptualizing, describing, and statting items ranging from common potions to world-shaping artifacts.

## 2. Core Inputs
- **Base Concept:** The core idea or name of the item.
- **Item Category:** (Armor, Potion, Ring, Rod, Scroll, Staff, Wand, Weapon, Wondrous).
- **Subtype Selection:** (e.g., specific weapon or armor types).
- **Goal Rarity:** (Common, Uncommon, Rare, Very Rare, Legendary, Artifact, Fabled).
- **Primary Function:** The core magical purpose (combat, utility, social).
- **Lore Context:** Brief history or origin (optional).

## 3. UI Requirements
- **Comprehensive Item Form:** Fields for Name, Type, Physical Description, and Magical Properties.
- **Activation Configurator:** A tool to set Command Words, Charges, Recharging logic, and Attunement requirements.
- **Sentient Item Workspace:** A special section for Mental Stats (INT/WIS/CHA), Communication, Senses, and Personality.
- **Fabled Growth Editor:** For items that level up with the character.
- **Artifact Destruction Logic:** A unique field for priceless items.

## 4. Derived & Automated Fields
- **Value Estimator:** Automatically suggests a gold cost range based on rarity.
- **Spell-to-Power Validator:** Checks that spell-based properties don't exceed rarity limits (e.g., no Level 9 spells on an Uncommon wand).
- **Lore Weaver:** AI-generated historical snippets based on the item's theme.

## 5. Exports & Integration
- Magic Item Concept (Markdown).
- VTT Inventory File (JSON).
- Printable Lore Card (PDF).
