# UI Questionnaire: NPC Creator Bot

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A high-speed, systematic NPC generator that transforms a simple name and role into a fully fleshed-out character with motivations, personality, and physical traits.

## 2. Core Inputs
- **NPC Name:** (e.g., "Kaelen the Smith").
- **Core Role/Profession:** (e.g., Blacksmith, Rogue, Noble, Scholar).
- **Campaign Flavor:** (Select: High Fantasy, Gritty, Steampunk, etc.).
- **Generation Depth:** (Select: Quick Sketch, Detailed Profile, Full Backstory).

## 3. UI Requirements
- **NPC Identity Studio:** Fields for Name, Role, and a brief "Vibe" description.
- **Personality Matrix:** Toggles or sliders for key traits (e.g., Grumpy vs. Cheerful, Greedy vs. Altruistic).
- **Physicality Drawer:** Checkboxes for "Distinctive Features" (Scars, Tattoos, Unusual jewelry).
- **Motivation/Goal Input:** A field to specify what the NPC wants from the party or the world.
- **Bot Persona Toggle:** A switch to toggle between "Procedural Data" and "IC Chatbot" mode (if the tool includes a chat interface).

## 4. Derived & Automated Fields
- **Motive-Driven Quests:** Automatically generates 1-2 hooks based on the NPC's role and goal.
- **Visual Description Synthesis:** Combines physical traits into a 2-3 sentence descriptive paragraph.
- **Stat-Block Proxy:** Suggests a generic 5e stat-block (e.g., Commoner, Noble, Veteran) based on the role.

## 5. Exports & Integration
- NPC Profile (Markdown).
- VTT Actor Manifest (JSON).
- Campaign Contact List entry.
