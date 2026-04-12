# UI Questionnaire: jp cooper 10 room dungeon

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A guided, step-by-step chat experience for generating a 10-room dungeon, supporting both manual input and "roll" commands.

## 2. Core Inputs
- **Theme Selection (1-5):** Location, Purpose, Creator, Treasure, Motivation.
- **Room Generation (1-10):** Specific presets for each of the 10 roles (Guardian, Secret, Boss, etc.).
- **"Roll" Commands:** Support for rolling multiple ideas or genre-themed ideas.

## 3. UI Requirements
- **Conversational Interface:** A chat-style central area where ChatGPT asks one question at a time.
- **Action Buttons:** Quick-click buttons for "Roll", "Roll 3", "Roll (Tolkien Theme)".
- **Live Summary Sidebar:** A list that updates as each question is answered (Rooms 1-10).
- **Edit/Undo:** Ability to click a previously answered question to change the data.

## 4. Derived & Automated Fields
- **Logical Connection Engine:** Post-processing to ensure Room 5 links to Room 4 contextually.

## 5. Exports & Integration
- Full Narrative PDF.
- Discord / Markdown export.
