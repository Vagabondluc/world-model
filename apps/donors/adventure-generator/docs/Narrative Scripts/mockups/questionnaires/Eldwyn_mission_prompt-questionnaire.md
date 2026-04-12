# UI Questionnaire: Westmarsh & Eldwyn Campaign Suite

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A specialized campaign management tool for 'Westmarsh' style games (specifically the Eldwyn setting), focusing on high-utility mission boards, matrix-driven adventure hooks, and a drama-first 'Traveling Event System' (TES).

## 2. Core Inputs
- **Mission Tier:** (Copper, Silver, Electrum, Gold, Platinum).
- **Mission Type:** (ESC, DEF, OFF, PI, REC, etc. - 31 types total).
- **Adventure Matrix Seeds:** (5x6 Table of Hooks, Threats, McGuffins, Intrigues, Places).
- **Travel Distance:** (Close, Far, Very Far).

## 3. UI Requirements
- **The Guild Mission Board:** A digital representation of the markdown template (Mission ID, Title, Rank, Objective, etc.).
- **Adventure Hook Matrix Console:** A 5x4 grid where numbers 1-6 are input to generate narrative outlines.
- **Traveling Event System (TES) Dashboard:** A color-coded event tracker (Red/Blue/Yellow/Combo Colors) that simplifies travel into drama-focused encounters.
- **NPC Profiler (Surface-Only):** A French-language input/output area for generating player-facing character "dossiers."
- **Reward Calculator:** Automatically suggests XP/GP and magic item rolls based on the Mission Tier.

## 4. Derived & Automated Fields
- **Mission ID Generator:** Format `{Type Abbreviation}-{Five Digit Code}`.
- **Matrix Outline Summarizer:** Transforms matrix seeds into 80-120 word adventure outlines.
- **Drama-First Travel Event Generator:** Suggests 1-3 events based on 'Distance' and the current 'Setting Description' (Cold, Rugged, Mining Town).

## 5. Exports & Integration
- Guild Mission Post (Markdown).
- Character Dossier (French Markdown).
- Travel Log & Encounter Manifest.
