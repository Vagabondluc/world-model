# Specification: Admin Database Manager (database_schema)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Admin Database Manager is a high-fidelity React component acting as a "Card Registry" and "Document Editor". It allows the DM/Admin to authenticate, search, filter, and edit narrative entities (Nodes, NPCs, Locations, Items) stored in the Firestore-like database.

## 2. Component Architecture
### 2.1 Core Panels
- **Dual-Pane Data Surface**:
    - **Left Panel (Card Listing)**: Manages the collection-level registry.
    - **Right Panel (Document Editor)**: Provides deep-dive editing for the selected entity.

- **JSON Object Editor**:
    - Specialized input area for `formData`.
    - Features: Syntax highlighting, auto-indentation, and validation for the map object structure.

- **Dynamic Connection Visualizer**:
    - Visualizes `targetUUID` references.
    - Relational map or indented tree view showing links between entities (e.g., Adventure Node -> NPC).

- **Validation Badge System**:
    - Global status indicators.
    - Audits active documents against the schema (e.g., flags missing `uuid`, empty `title`).

## 3. Interaction Logic
- **Sync/Pull Mechanism**:
    - Manual "Update Firestore" action.
    - Prevents accidental writes (transactional model).

- **Connection Management**:
    - Drag-and-Drop: Drag a 'Card Badge' from the list into the `connections` array of another card to link them.

- **Search & Filter**:
    - Metadata filtering by **Type** (e.g., "Narrative Node") and **Categories** (e.g., "Tags: Horror").

## 4. Visual Design
- **Aesthetic**: Technical/DevOps (Dark Mode).
- **Typography**: Monospace for UUIDs and JSON.
- **Color Palette**:
    - Green: Valid/Sync OK.
    - Amber: Warnings/Validation Errors.
    - Blue: Metadata (Type, ID).
- **Layout**: High-density dashboard for power users.

## 5. Data Schema (Implied)
```typescript
interface Card {
  uuid: string;
  title: string;
  type: string;
  description: string;
  categories: string[];
  connections: Connection[];
  formData: Record<string, any>;
  metadata: {
    createdAt: string;
    updatedBy: string;
  };
}

interface Connection {
  targetUUID: string;
  type: string;
  label: string;
}
```
