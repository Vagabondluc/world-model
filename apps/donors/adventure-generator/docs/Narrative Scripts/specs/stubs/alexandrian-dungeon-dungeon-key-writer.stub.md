# Spec Stub: Alexandrian Dungeon Key Writer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


- **Purpose:** Describe how the key writer structures room headers, descriptions, treasures, and cross-references so that UI can render formatted keys consistent with maps.
- **Inputs:** Map context (room numbers, corridor connections), existing room descriptions, desired focus areas, and any treasure or encounter data.
- **Outputs:** Formatted dungeon key with room headers, boxed room text, treasure lists, and cross-references suitable for DM use.
- **Example call:** The designer selects “Key Writer,” provides a map layout, and receives a structured key with room entries, descriptions, and treasure notes.
- **Edge cases:** Missing map context (use default numbering), conflicting room descriptions (prompt to resolve or prioritize), missing treasure data (use standard treasure tables), broken cross-references (warn and suggest fixes).
- **Mapping:** Supplies the key editor contract and feeds validation rules used in the dungeon builder.
- **Priority:** High