# Phase 1: Foundation & Tooling - Questionnaires

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. database_schema.md (Admin Database Manager)

**1. What is the core data entity being managed?**
The "Card" (a document representing a filled form or adventure node).

**2. What are the essential fields for a Card document?**
`uuid`, `title`, `type`, `description`, `categories`, `formData` (object), `connections` (array), `createdAt`, `updatedAt`, `createdBy`.

**3. What specialized views are required for NoSQL data?**
- A JSON viewer/editor for `formData`.
- A connection graph or table list for `connections`.
- An index management panel for composite indexes (e.g., `type` + `createdAt`).

**4. What administrative controls are needed?**
- Authentication status indicator.
- Security rule simulator/viewer.
- Data validation status for mandatory fields.

---

## 2. dungeon-master-guide.txt (System Orchestrator)

**1. What is the primary user workflow?**
A 15-step sequential dungeon-creation process launched via a central CLI/UI.

**2. What are the key Workspace requirements?**
- Selection of a active "Working Folder" under `ttrpg-master/`.
- Tracking of all generated artifacts beside this workspace.

**3. How does the UI handle AI orchestration?**
A model toggle for `olmo:3:7b-instruct` (visible output) vs `olmo:3:7b-thinking` (opaque/logged output).

**4. What are the critical navigation options?**
- Step-by-step workflow navigation.
- "Discover & run" script execution menu.
- Export summaries and handout generation.

---

## 3. dungeon-master-toolkit.txt (Technical Tool Map)

**1. What information must be mapped visually?**
The relationship between Menu Steps, Files, and internal Disk Locations (e.g., `Execution_Systems/Dungeons/`).

**2. What diagnostic tools are needed?**
- Script discovery status (Scanning the `Narrative Scripts` tree).
- Log viewer for stdout/stderr/exit codes.
- "Let It Ride" vs "Tick" status for active generation steps.

**3. What file management features are required?**
- Automated naming convention enforcement (e.g., `maps/<name>.txt`).
- Manifest registry (Checking if an artifact is registered in `index.json`).

---

## 4. manifest_collection (index.json, manifest.json, manifest.yaml)

**1. What type of interface best suits these files?**
A "Package Manager" or "Repository Browser" view.

**2. How should the search/discovery work?**
Filtration by tags, categories, script type, and "Studio" membership.

**3. What actions are available for a manifest entry?**
- Run script.
- View source.
- Check dependencies.
- Update metadata.
