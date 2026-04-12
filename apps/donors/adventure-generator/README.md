# D&D Adventure Generator

A comprehensive, production-ready hybrid desktop application for Dungeon Masters, built with **React 19**, **Tauri**, and a **Python Backend** for advanced AI orchestration.

## Features

- **Procedural Content Generation**: Monsters, traps, and adventures generated on-demand.
- **Interactive World Map**: Multi-map, multi-layer hex grid with fog of war and landmark management.
- **Narrative AI Hub (The Tavern)**: NPC Chat, Job Boards, and Oracle for improvisational GMing.
- **Hybrid Persistence**: File-system-first storage (YAML/Markdown) with IndexedDB caching via Dexie.js.
- **AI Ensemble**: Orchestrated requests using a Python/FastAPI sidecar for RAG and structured outputs.

## Tech Stack

- **Frontend**: React 19, Zustand (State), Zod (Validation), @emotion/css (Styling).
- **Desktop Wrapper**: Tauri (Rust backend for FS/Native access).
- **AI Backend**: Python 3.11+, FastAPI, Ollama/Gemini integrations, Instructor.
- **Persistence**: Dexie.js (IndexedDB).

## Getting Started

### Prerequisites

- **Node.js** (v18+): [Download](https://nodejs.org/)
- **Python** (v3.11+): [Download](https://www.python.org/)
- **Rust** (for Tauri development): [Download](https://rustup.rs/)

### Installation

Choose your preferred installation method:

#### 1. Visual Dashboard (Recommended for most users)
Launch the visual management dashboard to check requirements and install everything with one click:
```bash
npm run setup:dashboard
```

#### 2. Automated Terminal Setup
Run the cross-platform setup script:
```bash
npm run setup
```

#### 3. Manual Installation
See the [Installation Guide](docs/INSTALLATION.md) for platform-specific scripts and manual steps.

### Running the App

- **Development Mode**:
  Start both frontend and backend:
  ```bash
  npm run dev      # Terminal 1
  npm run backend  # Terminal 2
  ```

- **Production Build**:
  Build the desktop app and backend executable:
  ```bash
  npm run build:desktop
  npm run build:backend
  ```

## Documentation

Full documentation is available in the `docs/` folder:
- [**Installation Guide**](docs/INSTALLATION.md)
- [Architecture & Design](CODEBASE.md)
- [System Requirements](docs/INFRASTRUCTURE.md)
