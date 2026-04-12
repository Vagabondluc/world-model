# Spec Stub: Alexandrian Dungeon Adversary Roster Creator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


- **Purpose:** Capture how the roster creator structures action groups, classifications, tactical notes, and stat references so the UI can render tables for quick DM use.
- **Inputs:** User choices about group types, locations, creature counts, patrol routes, and desired composition patterns.
- **Outputs:** Table-ready data with group identifiers, location context, behavior notes, and quick stat references tailored for the encounter manager view.
- **Example call:** The designer selects “Roster Creator,” provides a location and group size, and the system returns grouped entries with nodes for each action group along with leader details.
- **Edge cases:** Incomplete patrol data (fallback to “unknown route”), overlapping locations (prioritize primary starting area), empty group composition (prompt for default values).
- **Mapping:** Feeds the component contract for the roster table, informs the tactical notes pane, and binds to the stat reference sidebar.
- **Priority:** High