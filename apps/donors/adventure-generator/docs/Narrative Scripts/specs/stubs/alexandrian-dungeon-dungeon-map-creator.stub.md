# Spec Stub: Alexandrian Dungeon Map Creator

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


- **Purpose:** Capture how to combine materials, scales, layouts, rooms, corridors, entrances, and xandering into a visually appealing and functional dungeon map.
- **Inputs:** Designer’s chosen scale, materials list, entrance style, desired room connections, and any xandering preferences.
- **Outputs:** Structured map layout, room numbers, entrance notes, corridor connections, legend, and final map image for DM use.
- **Example call:** The designer selects “Map Creator,” provides a grid layout, and receives a formatted map with rooms, connections, and a legend.
- **Edge cases:** Missing layout (use default grid), conflicting connections (prompt to resolve or prioritize), missing scale (default to 5 ft/square), missing materials (default to stone), broken xandering rules (suggest fixes).
- **Mapping:** Supplies the map builder contract and informs room/feature contracts and legend UI used in the dungeon builder.
- **Priority:** High