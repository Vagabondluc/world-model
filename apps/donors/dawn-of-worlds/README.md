# Dawn of Worlds — React Web Game

> **⚠️ PROJECT STATUS: ALPHA PROTOTYPE**
>
> This project is currently in a **technical preview** state (v0.5).
> *   **Implemented:** Core event engine, Age I (Terrain) actions, Local persistence, UI Shell.
> *   **Missing:** Age II & III content, Multiplayer networking, Advanced Map Visuals.
>
> See [PROJECT_STATUS.md](PROJECT_STATUS.md) for a detailed manifest.

A collaborative worldbuilding game engine built with React (Browser-only) and TypeScript.

## Overview

Dawn of Worlds is a turn-based worldbuilding game where players act as "World Architects" (or gods) who spend Action Points (AP) to shape a shared world across multiple Ages. This implementation provides:

- **Browser-only Architecture** — No build step, no Node.js required for frontend
- **Event-sourced architecture** for deterministic replays
- **Quality-of-life features** for frictionless play
- **High-fidelity UI** with Tailwind CSS

## Documentation

| Document | Description |
|-----------|-------------|
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | **Current State & Limitations** |
| [ROADMAP.md](docs/ROADMAP.md) | Implementation Plan |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, event sourcing pattern, data flow |
| [GETTING_STARTED.md](docs/GETTING_STARTED.md) | Prerequisites, quick start |
| [CORE_IMPLEMENTATION.md](docs/CORE_IMPLEMENTATION.md) | Type definitions, reducer, selectors, deriveWorld |
| [UI_COMPONENTS.md](docs/UI_COMPONENTS.md) | Action Palette, Inspector, Timeline, component contracts |
| [API_REFERENCE.md](docs/API_REFERENCE.md) | Complete type definitions and function signatures |

## Quick Start

This project uses a browser-only runtime. No `npm install` or build step is required for the frontend.

1.  Open `index.html` in a modern browser.
2.  (Optional) Serve with a static server for better performance:
    ```bash
    npx serve .
    # or
    python3 -m http.server
    ```

## Features (Implemented)

### Core Gameplay
- **Age I Actions**: Physical world shaping (Terrain, Water, Landmarks).
- **Turn-based**: Action Point budget system with turn cycling.
- **Immutable timeline**: Full history log of all game events.

### Quality of Life
- **Context-sensitive action filtering** — Only legal actions shown.
- **Action preview (ghost mode)** — See changes before confirming.
- **Turn-scoped undo** — Revert mistakes during your turn.
- **World Inspector** — Forensic view of any object's history.

## Technology Stack

- **Runtime**: Browser-only (ES Modules)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Material Symbols (Google Fonts)
- **Bundler**: None (Native ESM)

## License

See LICENSE file for details.