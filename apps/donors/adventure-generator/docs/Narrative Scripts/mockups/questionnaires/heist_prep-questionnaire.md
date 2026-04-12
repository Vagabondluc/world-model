# UI Questionnaire: heist_prep

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A strategic planning tool for DMs to design complex heist scenarios, focusing on target surveying, layered defenses, and team roles.

## 2. Core Inputs
- **Heist Objective:** Primary and tiered goals (e.g., Treasure, Intel, Sabotage).
- **Target Location:** Facility type (Museum, Bank, etc.) and its key features.
- **Surveyability:** Which elements are trivial, challenging, or impossible to scout.
- **Entry Points:** At least two options, including secured and hidden entries.
- **Layered Defenses:** Passive obstacles (traps, locks) and active forces (guards, alarms).
- **Blueprint Data:** Known vs. hidden elements to be revealed on the map.
- **Crew Specializations:** Roles like Safecracker, Technical specialist, etc.
- **Prep Activities:** Intel gathering, resource acquisition, rehearsal steps.

## 3. UI Requirements
- **Objective Architect:** A section to define tiered goals and high-stakes motives.
- **Blueprint Designer:** A grid or canvas to layout the target facility, tagging rooms with security levels and survey statuses.
- **Defense Layer Stack:** A vertical list showing the progression of security measures from the perimeter to the vault.
- **Crew Roster:** A role-assignment table that maps player characters to specialized heist functions.
- **Prep Phase Checklist:** A task manager for players to track intelligence gathered and equipment acquired.

## 4. Derived & Automated Fields
- **Stealth Difficulty Rating:** Calculated based on the number and type of active/passive defenses.
- **Survey Intelligence Level:** Tracks how much of the blueprint is currently "Visible" to the players based on their prep actions.

## 5. Exports & Integration
- Player-Facing Blueprint (Markdown/Image).
- Heist DM Operations Manual (PDF).
- VTT Map Overlay for hidden traps and patrol paths.
