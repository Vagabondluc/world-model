# UI Questionnaire: CreateRiddle_v1

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A direct riddle generator that takes a desired answer and produces both easy and hard versions of a riddle, providing a logical explanation for the solution.

## 2. Core Inputs
- **Riddle Answer:** The target word or concept for the riddle.
- **Tone/Theme:** (Optional, e.g., Cryptic, Whimsical, Dark).
- **Target Audience:** (Optional, e.g., Children, Experienced Players).

## 3. UI Requirements
- **Answer Input Field:** A prominent field to enter the riddle's solution.
- **Difficulty Toggle/Display:** Persistent side-by-side view for "Easy" and "Hard" versions.
- **Logic Explanation Box:** A dedicated area for the "Why it's correct" explanation.
- **Regenerate Button:** For each difficulty tier to allow for multiple options.

## 4. Derived & Automated Fields
- **Clue Intensity Meter:** A visual indicator of how obscure the clues are in the "Hard" version.
- **Thematic Consistency Check:** Ensures the riddle's language matches the optional tone.

## 5. Exports & Integration
- Single Riddle Card (Markdown).
- Easy/Hard Comparison Sheet.
- GM Hint Key (Handout).
