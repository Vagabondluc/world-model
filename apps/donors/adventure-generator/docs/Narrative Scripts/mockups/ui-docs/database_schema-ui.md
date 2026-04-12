# UI Explanation: Admin Database Manager (database_schema)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Dual-Pane Data Surface:** A split interface design. The left panel manages the collection-level registry (Card list), while the right panel provides deep-dive document editing.
- **JSON Object Editor:** A specialized input area for `formData`. It provides syntax highlighting and validation specifically for the `map` (object) structure used in Firestore.
- **Dynamic Connection Visualizer:** A relational map or indented tree view that resolves `targetUUID` references. It shows how "Adventure Nodes" or NPCs are logically linked.
- **Validation Badge System:** Global status indicators that audit the active document against the required schema (e.g., flagging missing `uuid` or `title`).

## Interaction Logic
- **Sync/Pull Mechanism:** A manual "Update Firestore" action to prevent accidental writes, mirroring the development cycle of a NoSQL database.
- **Connection Drag-and-Drop:** Allows users to link cards by dragging a 'Card Badge' from the list into the `connections` array of another.
- **Search Metadata Filter:** A refined search that allows filtering by type (e.g., "Show only NPCs") and categories (e.g., "Tags: Horror, Stealth").

## Visual Design
- **Technical/DevOps Aesthetic:** Uses high-contrast dark mode, mono-spaced fonts for UUIDs/JSON, and a simplified color palette (Green for valid, Amber for warnings, Blue for metadata).
- **Proactive Dashboard Layout:** Designed for power users who need to manage hundreds of narrative entities at once.
- **Metadata Visibility:** Important fields like `createdAt` and `updatedBy` are always visible in a sticky document header.
