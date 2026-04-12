# UI Explanation: raid_execution

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Tactical Time-Scale Switcher:** A prominent toggle that allows the DM to shift between Dungeon Turns (macro exploration), Raid Turns (micro tactical timing), and Combat Rounds (moment-to-moment action). The UI updates its "Tick" duration and available action menus accordingly.
- **Dynamic Theater of Operations:** A visual zone-map that dynamically highlights rooms and hallways that are "Active" (containing PCs or Aware/Alert enemies). It uses line-of-sight and noise-radius logic to show where the "Theater" is expanding.
- **Adversary Awareness Board:** A status-tracking list for all enemy squads (Action Groups). It uses color-coded states:
    - **Green (Passive):** Routine behavior, standard perception.
    - **Yellow (Alert):** Searching, heightened perception (+2 DC).
    - **Red (Aware):** Engaging/Chasing, knows player location.
- **Fail-Forward Decision Modal:** An automated prompt that appears when a player fails a critical check. It presents the DM with context-relevant complications (e.g., "Alarm Tripped," "Ambush Triggered") or "Success at a Cost" (e.g., "Door Opens, but PC takes 1d6 damage").
- **Awareness Ripple Engine:** a logic-subsystem that automatically updates the status of neighboring action groups when a nearby squad raises an alarm or starts combat.

## Interaction Logic
- **Automated Distance Scaling:** When rolling perception, the DM can click a distance (e.g., 30ft, 60ft) to automatically apply the script's distance penalties to the DC.
- **"Let It Ride" Implementation:** The UI can tag a check as "Let It Ride," meaning its result remains active for the next [X] turns until a major change in approach occurs, preventing "Rolling to Failure."
- **Raid Turn Pulse:** Every 1-minute raid turn, the UI "Pulses," triggering any scheduled activation checks or patrol movements.

## Visual Design
- **High-Stakes Command Aesthetic:** Designed to look like a field-operations tablet or a dungeon-commander's strategic map.
- **Zone Lighting:** Active zones in the Theater of Operations glow with a pulse, while passive areas are dimmed or "Grayed Out" (Fog of War).
- **Proactive Alerts:** Visual banners flash when a group transitions from Alert to Aware, ensuring the DM never misses a tactical shift.
