# UI Questionnaire: swap_mystery

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A campaign-reconfiguration tool that allows DMs to replace a standard 5-node mystery with a different adventure type (Dungeon, Heist, Social) while maintaining all inter-mystery clues and narrative links.

## 2. Core Inputs
- **Target Mystery:** The specific 5-node mystery in the campaign to be replaced.
- **Replacement Type:** (Dungeon Crawl, Heist, Social Intrigue, Wilderness, etc.).
- **Inter-Mystery Connection Data:** The existing inbound and outbound clues for the target mystery.
- **Campaign Narrative Context:** The overarching goals and recurring elements that must be preserved.

## 3. UI Requirements
- **Replacement Wizard:** A step-by-step guide to selecting a new scenario and importing its core elements.
- **Clue Mapping Interface:** A specialized tool to manually "re-site" inbound clues to the new scenario's entry points.
- **Sub-Mystery Bridge Builder:** Helps define artificial "Information Hubs" in non-node based scenarios (like a dungeon) to act as node-equivalents.
- **Campaign Manifest Auditor:** A real-time check showing how the change impacts the "5x5" campaign overview and narrative files.
- **Transition Guide Constructor:** A field to write GM instructions for the shift in play-style (e.g., from Noir to Dungeon Crawl).

## 4. Derived & Automated Fields
- **Clue Integrity Check:** Automatically flags if the new scenario is missing the required 3 outbound leads.
- **NPC Re-skinning Suggestor:** Proposes how to incorporate existing recurring NPCs into the new scenario type.
- **Complexity Matcher:** Suggests difficulty levels for the new scenario to ensure it matches the campaign's current arc.

## 5. Exports & Integration
- 1x Replacement Scenario File (.txt).
- 1x Updated Campaign Overview.
- 1x Updated Recurring Elements list.
- 1x Scenario Transition Guide.
