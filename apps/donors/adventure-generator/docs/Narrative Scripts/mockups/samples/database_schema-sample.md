# Sample Output: Admin Database Manager (database_schema)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


# Document: a1b2c3d4-e5f6-7890-1234-567890abcdef

### 1. Header Information
- **Title:** The Whispering Woods
- **Type:** Location
- **Creation Date:** 2025-12-21 03:00:00 UTC
- **Last Updated:** 2025-12-21 04:30:00 UTC
- **Created By:** DM_Alpha_1

### 2. Narrative Metadata
- **Description:** A dense, fog-choked forest where the trees seem to lean in and murmur secrets to those who wander off the path.
- **Categories:** [Forest, Exploration, Mystery, Tier 2]

### 3. Form Data (JSON Object)
```json
{
  "locationType": "Wilderness Domain",
  "mechanic": "Whispering Winds (DC 14 Wisdom save vs Confusion)",
  "vividDetails": [
    "Silver-gray bark that glows under starlight",
    "Roots that move slowly when not being watched",
    "Constant low-frequency humming"
  ],
  "primaryThreat": "Shimmer-Stalkers (Fey Predators)",
  "lootPool": "Sylvan Relics"
}
```

### 4. Connections (Relationship Graph)
- **Target:** `b2c3d4e5...` (The Sunken Temple) | **Type:** Linear | **Label:** "Deeper into the woods"
- **Target:** `c3d4e5f6...` (The Druid's Grove) | **Type:** Landmark | **Label:** "Safe Haven nearby"

---

### 5. System Indicators
- **Index Status:** `title` (OK), `type` + `createdAt` (OK).
- **Security Check:** READ: ALLOWED | WRITE: RESTRICTED (Owner Only).
- **Validation:** 100% Schema Alignment.
