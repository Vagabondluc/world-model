# UI Wireframe: Admin Database Manager (database_schema)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


```text
+--------------------------------------------------------------------------------+
|  [Admin DB: Card Registry]                                            [?] [X]  |
+--------------------------------------------------------------------------------+
|  Workspace: [ ttrpg-master/ShadowKeep ]  | Status: [ AUTHENTICATED ] [Refresh]  |
+--------------------------------------------------------------------------------+
|  CARD LISTING (Collection: 'cards')      |  DOCUMENT EDITOR (Live Schema View) |
|  [Search UUID/Title...] [Filter: Type]   |  ID: a1b2c3d4-e5f6-7890             |
|                                          |  Title: [ The Sunken Temple ]       |
|  - [X] The Sunken Temple (Node)          |  Type:  [ Adventure Node ]          |
|  - [ ] Sir Reginald (NPC)                |  ---------------------------------  |
|  - [ ] Black Citadel (Location)          |  FORM DATA (JSON Editor)            |
|  - [ ] Ritual Dagger (Item)              |  {                                  |
|                                          |    "CR": 8,                         |
|  [+] Create New Card                     |    "Rewards": "500gp",              |
|  [-] Delete Selection                    |    "Encounters": "Croc..."          |
|                                          |  }                                  |
+------------------------------------------+-------------------------------------+
|  CONNECTIONS GRAPH                       |  INDEX & SECURITY                   |
|  [ The Sunken Temple ]                   |  - Single Index: [OK]               |
|    |-- (choice) --> [ Left Path ]        |  - Composite: [Missing: type+date]  |
|    `-- (branch) --> [ Guard Room ]       |  - Validation: [WARN: Desc Empty]   |
+------------------------------------------+-------------------------------------+
|  [Update Firestore] [Validate All] [Export Schema Map]                 [Done]  |
+--------------------------------------------------------------------------------+
```
