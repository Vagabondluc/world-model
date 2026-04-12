# D&D Adventure Generator: Architecture & Design Documentation

## Executive Summary

This document provides a comprehensive overview of the D&D Adventure Generator codebase. The application is a robust, production-ready hybrid desktop application built with **React 19**, **Tauri**, and a **Python Sidecar**. It utilizes a hybrid persistence model (File System + IndexedDB), a multi-store **Zustand** state management system, and a modular CSS-in-JS architecture.

## Design Philosophy & Principles

1.  **Modular & Maintainable**: Code is organized into logical, single-responsibility components and services.
2.  **Atomic & Composable State**: Global state is managed by multiple, feature-specific **Zustand** stores.
3.  **World-Aware Design**: Features like session management and the Location Manager are contextually aware of the "campaign world."
4.  **Resilient & User-Friendly**: Features graceful error handling and clear loading states.
5.  **AI Orchestration**: Uses a Python-based ensemble for advanced AI tasks, RAG, and structured data generation.

## Folder Structure & Organization

```
.
├── src/                # Frontend React application
│   ├── components/     # UI Components (Feature-driven)
│   ├── data/           # Static constants and patterns
│   ├── hooks/          # Custom business logic hooks
│   ├── schemas/        # Zod validation schemas
│   ├── services/       # Integration services (AI, Persistence)
│   ├── stores/         # Zustand state slices
│   ├── styles/         # Emotion-based styling
│   └── utils/          # Helper functions
├── python-backend/     # Python/FastAPI Sidecar
│   ├── core/           # Core AI logic and RAG
│   ├── routers/        # API endpoints
│   ├── services/       # Business logic services
│   └── main.py         # Entry point
├── src-tauri/          # Rust Backend (Tauri)
├── docs/               # System documentation and specs
└── srd_export/         # SRD Content (Monsters, Spells, etc.)
```

## Architecture Deep Dive

### Hybrid Desktop Architecture (Tauri + React + Python)

The application operates as a distributed desktop application:
- **Frontend**: React 19 SPA.
- **Tauri**: Rust process for secure file system access and OS integration.
- **Python Backend**: Sidecar for complex AI workflows, Instructor-based validation, and RAG.

### Persistence & Data Pipeline

The application follows a **File-System-First** approach:
1.  **Source of Truth**: Campaign data is stored as YAML/Markdown in the Campaign Folder.
2.  **Hydration**: `PersistenceService` populates Zustand stores on startup.
3.  **Caching**: **Dexie.js** (IndexedDB) provides a local cache for performance.

### State Management (Zustand)

Global state is decentralized across domain-specific stores:
- **`useCampaignStore`**: Session, config, and bestiary.
- **`useLocationStore`**: Maps, layers, and locations.
- **`useCompendiumStore`**: Lore and adventure entities.
- **`useAdventureDataStore`**: Current adventure generation state.
- **`useTavernStore`**: AI chat and narrative job boards.

### Legacy Components

- **`src/context`**: Deprecated in favor of Zustand (except `AppContext`).
- **`src/reducers`**: Fully deprecated.

## Conclusion

The D&D Adventure Generator leverages a modern, distributed stack to provide a powerful and extensible GM toolset.