# UI Wireframe: xandered-dungeon-designer

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


```text
+--------------------------------------------------------------------------------+
|  [Xandered Dungeon Designer: Topology View]                           [?] [X]  |
+--------------------------------------------------------------------------------+
|  Entrances: [ 1 ] [ 2 ] [+]  |  Complexity Score: [ 84% ] [Optimize Flow]      |
+------------------------------+-------------------------------------------------+
|  MAP CANVAS (Top-Down Flow)                                                    |
|                                                                                |
|  [ENTRANCE A] ----> [ROOM 1] ----> [ROOM 2] ---- [SECRET] ----> [EXIT]        |
|        |              |              |                                         |
|        |              +--- [LOOP] ---+              [LVL LINK: TO B1]          |
|        v                                                    |                  |
|  [ENTRANCE B] ---- [ROOM 3] ---- [CHUTE] ----> [SUB-LEVEL: THE PIT]            |
|                                                                                |
+--------------------------------------------------------------------------------+
|  XANDER TOOLBOX       |  ORIENTATION LANDMARKS                                 |
|  [+] Add Loop         |  [M] The Colossus Statue (Lvl 1)                       |
|  [^] Add Level Link   |  [M] The Glowing Forge (Lvl 2)                         |
|  [?] Add Secret Path  |  [+ Add Landmark]                                      |
+-----------------------+--------------------------------------------------------+
|  [Export Topology] [Sync to Map Creator] [Verify Navigation]           [Done]  |
+--------------------------------------------------------------------------------+
```
