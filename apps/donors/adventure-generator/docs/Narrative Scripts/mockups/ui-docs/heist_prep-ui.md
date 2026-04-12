# UI Explanation: heist_prep

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Blueprint Designer Canvas:** A central visual tool to layout the target facility. It allows the DM to place objects and tag them as "Known" (visible to players on the blueprint) or "Hidden" (revealed only through high-level scouting or during the heist).
- **Defense Layer Stack:** A vertical hierarchy manager that orders the facility's defenses from the outermost perimeter to the innermost vault. This provides a clear "Obstacle Course" view for the DM.
- **Surveyability Matrix:** A table that classifies facility features into Trivial (automatic intel), Challenging (requires specific prep), or Impossible (cannot be known until inside).
- **Crew Specialization Dashboard:** A role-assignment interface where DMs can map PC abilities to essential heist archetypes (Lookout, Technical, etc.).
- **Prep Task Manager:** A checklist interface for tracking player-side intelligence gathering and resource acquisition milestones.

## Interaction Logic
- **Dynamic Exploration:** As players complete Prep Activities (e.g., bribing a guard), the Blueprint Designer automatically transitions specific "Hidden" tags to "Known," updating the player-facing handout in real-time.
- **Security Check Balancing:** The UI calculates suggested DC ranges based on the Tier of the facility and the density of the Layered Defenses.
- **Role Synergy Alerts:** Flagging if the chosen Crew Composition lacks a critical role (e.g., "Warning: No Safecracker assigned to Tier 3 Vault").

## Visual Design
- **Tactical Stealth Aesthetic:** Dark mode interface with neon blueprint lines (cyan for walls, orange for security, red for objectives).
- **Iconography for Intel:** Uses symbols like magnifying glasses for surveyed items, padlocks for secured entries, and warning triangles for active patrols.
- **Top-Down Perspective:** Mimics a physical blueprint or CAD drawing to encourage strategic thinking and spatial planning.
