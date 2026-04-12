# UI Questionnaire: CreateRiddle_v2

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A structured riddle generator based on the "Compound Word" logic (Word A + Word B = Final Solution), ensuring logical derivation and zero ambiguity.

## 2. Core Inputs
- **Word A:** The first segment of the solution (e.g., "Fire").
- **Word B:** The second segment of the solution (e.g., "Fly").
- **Final Answer:** Automatically derived (e.g., "Firefly").
- **Cryptic Logic:** Directions for crafting the non-ambiguous descriptions for each component.

## 3. UI Requirements
- **Component Entry Fields:** Two distinct fields for Word A and Word B.
- **Answer Synthesizer:** A display showing the combined Final Answer.
- **Cryptic Description Editors:** Two text areas to draft or generate the descriptions for each word.
- **Structural Wrapper Toggle:** A toggle to include the required intro: *"The two secret words in these lines won't easily yield..."*

## 4. Derived & Automated Fields
- **Ambiguity Auditor:** Checks for overused or vague synonyms in the cryptic descriptions.
- **Logical Bridge Checker:** Ensures that Word A + Word B forms a single, recognizable concept or phrase.

## 5. Exports & Integration
- Compound Riddle Card (Markdown).
- Solution Breakdown (Explaining Word A and Word B).
- VTT Asset Legend.
