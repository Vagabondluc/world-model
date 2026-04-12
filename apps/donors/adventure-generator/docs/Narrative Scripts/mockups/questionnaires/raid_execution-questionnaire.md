# UI Questionnaire: raid_execution

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Primary Purpose
A high-stakes tactical combat and infiltration engine designed for coordinated assaults, featuring "Failing Forward" logic, "Theater of Operations" management, and timed raid turns.

## 2. Core Inputs
- **Raid Scenario:** Location, objectives, and initial deployment.
- **Activation Logic:** Procedures for triggering Passive, Active, Alert, and Aware groups.
- **Action Group Status:**
    - **Active:** Normal patrol/task.
    - **Alert:** Suspicious, looking for trouble.
    - **Aware:** knows exactly where the players are.
- **Fail-Forward Triggers:** Costs for success (e.g., "Pay in Blood/Equipment").
- **Time Scaling:** Transitioning between Dungeon Turns (10 min), Raid Turns (1 min), and Combat Rounds (6 sec).
- **Perception Penalties:** Distance and obstruction modifiers for stealth.

## 3. UI Requirements
- **Tactical Time-Dial:** A switcher to toggle between Dungeon, Raid, and Combat time scales, adjusting the "Turn" duration automatically.
- **Theater of Operations Map:** A dynamic map area that highlights "Active Zones" based on line-of-sight and adversary awareness.
- **Group Status Board:** A list of enemy squads with toggle buttons for [Active | Alert | Aware].
- **Fail-Forward Modal:** A pop-up that appears on failed checks, offering the DM "Complication Options" (Alarm, Damage, Reinforcements) or "Success at a Cost" buttons.
- **Perception DC Calculator:** A small utility to set stealth DCs based on distance and environmental noise.

## 4. Derived & Automated Fields
- **Awareness Ripple Effect:** Automatically moves neighboring groups to "Alert" status if a nearby group becomes "Aware".
- **Activation Counter:** Tracks "Ticks" for periodic activation checks (patrols arriving).

## 5. Exports & Integration
- Raid After-Action Report (Analysis of success vs. complications).
- Dynamic map updates for VTT (Zone of Influence markers).
