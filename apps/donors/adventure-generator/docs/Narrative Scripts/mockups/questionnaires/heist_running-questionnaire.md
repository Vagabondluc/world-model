# UI Questionnaire: heist_running

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A live operations dashboard for GMs to run heist scenarios, transforming prep data into dynamic actions, NPC behaviors, and tension management.

## 2. Core Inputs
- **Initial Prep Data:** The heist_prep document (Objective, Location, Defenses, Crew).
- **Security Routines:** Guard behaviors, patrol timelines, and alarm states.
- **NPC/Adversary Roster:** Detailed profiles and stat blocks for guards, staff, and rivals.
- **Tension/Suspicion Mechanics:** Meters that track how close the crew is to being discovered.
- **Dynamic Complications:** Plot twists and random events (e.g., "A guard stops to chat").
- **Phase Guide:** Structured steps for Infiltration, Execution, and Extraction.

## 3. UI Requirements
- **Heist Live-Roll Console:** A tool to resolve player actions (Infiltrate, Hack, Seduce) with pre-filled difficulty modifiers from the prep doc.
- **Security Timeline Tracker:** A visual clock or timeline showing guard positions and scheduled security sweeps.
- **Tension Meter:** A visible bar or radial gauge (0-100%) that increases with failed checks or suspicious noise.
- **Adversary Manager:** Quick-access cards for guards and NPCs, allowing the DM to track their current location and status (e.g., Unconscious, Alert).
- **Complication Trigger Button:** A "Random Obstacle" button that injects a dynamic event into the current scene.

## 4. Derived & Automated Fields
- **Phase Transition Prompts:** Automatically suggests the next GM instructions when the objective is reached or the extraction begins.
- **Suspicion Consequence Overlay:** Shows which security measures activate once the Tension Meter hits specific thresholds (e.g., 50% = Increased Patrols, 100% = Full Lockdown).

## 5. Exports & Integration
- Session Log (History of player moves and outcomes).
- Aftermath Summary (Generated rewards and consequences).
- VTT "Fog of War" controller for revealing map areas as players progress.
