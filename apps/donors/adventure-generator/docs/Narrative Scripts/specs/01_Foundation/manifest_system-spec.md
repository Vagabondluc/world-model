# Specification: Manifest Explorer (manifest_system)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Manifest Explorer is a high-fidelity "Script Repository Browser" component. It provides an IDE-like interface for browsing, managing, and validating the `Narrative Scripts` file structure, abstracting `index.json` and `manifest.yaml` behind a unified GUI.

## 2. Component Architecture
### 2.1 Core Panels
- **Hierarchical Repository Tree**:
    - Folder-based nav system (Execution_Systems > Dungeons > ...).
    - Status badges (Ready, Missing Deps).

- **Unified Catalog Reader**:
    - Resolves `.json` and `.yaml` manifests.

- **Dependency Map Panel**:
    - Shows Inputs (Requirements) and Outputs (Artifacts) for selected scripts.

- **Manifest Details**:
    - Metadata display: Tool Name, Type, Description.

## 3. Interaction Logic
- **Global Path Validation**:
    - "Validate All Paths" button checks file existence on disk.
    - Badges update to "Missing" if validation fails.

- **Auto-Discovery**:
    - "Scan Root" identifies unregistered `.py`/`.txt` files.
    - Prompts for registration.

- **Script Execution**:
    - "Run Script" triggers the CLI entry point.
    - Captures output in a modal terminal.

## 4. Visual Design
- **Aesthetic**: IDE / Code Editor (VS Code style).
- **Layout**: Sidebar + Detail View.
- **Badges**: Clear colors for "Ready" (Green), "Error" (Red).

## 5. Data Model
```typescript
interface ManifestEntry {
  id: string; // usually filename
  displayName: string;
  path: string;
  type: 'Scripted Execution' | 'Standard';
  dependencies: {
    inputs: string[];
    outputs: string[];
  };
  studio: string;
}
```
