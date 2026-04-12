# UI Wireframe: Manifest Explorer (index/manifest system)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


```text
+--------------------------------------------------------------------------------+
|  [Manifest Explorer: Script Repository Browser]                       [?] [X]  |
+--------------------------------------------------------------------------------+
|  Search: [ Dungeon Design ]  |  Filter: [ [V] .py  [V] .txt  [V] .json ]       |
+--------------------------------------------------------------------------------+
|  REPOSITORY TREE (index.json)            |  MANIFEST DETAILS (manifest.yaml)   |
|  > Execution_Systems/                   |                                     |
|    > Dungeons/                          |  Tool: [ Dungeon Key Writer ]       |
|      - concept-brainstormer.txt          |  Type: [ Scripted Execution ]       |
|      - [X] dungeon-key-writer.txt       |  Path: Narrative Scripts/Execution...|
|      - dungeon-map-creator.txt           |                                     |
|    > Encounters/                        |  [ DESCRIPTION ]                    |
|      - [X] combat-balancer.txt          |  Detail reactions, treasures, and   |
|    > Travels/                           |  lore for each dungeon room.        |
|                                          |                                     |
|  [Scan Root] [Register New]              |  [ DEPENDENCIES ]                   |
|  [Validate All Paths]                    |  - Requires: database_schema.md     |
|                                          |  - Produces: Area Summary Artifacts |
+------------------------------------------+-------------------------------------+
|  SELECTED ITEM ACTIONS                                                         |
|  [RUN SCRIPT] [EDIT SOURCE] [OPEN WORKING FOLDER] [DELETE ENTRY]               |
+------------------------------------------+-------------------------------------+
|  [Sync Manifests] [Check for Orphans] [Export Library List]           [Done]   |
+--------------------------------------------------------------------------------+
```
