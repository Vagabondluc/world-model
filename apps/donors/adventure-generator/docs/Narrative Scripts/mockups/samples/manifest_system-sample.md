# Sample Output: Manifest Explorer (Unified Catalog)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


# Catalog Entry: dungeon-key-writer

### 1. General Info
- **Display Name:** Dungeon Key Writer
- **Source File:** `Narrative Scripts/Execution_Systems/Dungeons/dungeon-key-writer.txt`
- **Execution Engine:** Ollama (`olmo:3:7b-instruct`)
- **Category:** Dungeon Execution

### 2. Functional Description
Expand area summaries into full room descriptions, including narrative flavor, searchable loot tags, and GM-facing tactical notes. This script acts as the "Middle-Man" between the map creator and the encounter balancer.

### 3. Dependency Map
- **Input Dependencies:**
    - `maps/active_dungeon.txt` (Dungeon Map)
    - `database_schema.md` (Document structure)
- **Output Artifacts:**
    - `keys/room_keys.md`
    - `logs/key_writer_log.txt`

### 4. Integration & Studio
- **Studio:** "The Vault" (Dungeon Design Suite)
- **Suggested Follow-up:** Combat Encounter Balancer

---

### 5. Repository Statistics
| Metadata Type | Value |
| :--- | :--- |
| **Total Registered Scripts** | 72 |
| **Active Manifest Format** | .yaml (Primary), .json (Index) |
| **System Integrity** | 100% (All paths resolved) |
