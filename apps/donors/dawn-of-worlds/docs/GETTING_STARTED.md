# Getting Started

This guide will help you run the Dawn of Worlds project locally.

## Architecture Note

This project utilizes a **Browser-only Runtime**.
- No `node_modules`
- No build step (Webpack/Vite/Parcel)
- No server-side rendering
- Dependencies are loaded via ESM from CDNs (`esm.sh`).

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional) A local static file server (e.g., VS Code Live Server, Python `http.server`, `serve`)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dawnWorld
```

### 2. No Dependencies to Install

You do **not** need to run `npm install`. All dependencies are resolved at runtime via the `<script type="importmap">` in `index.html`.

## Quick Start

### Option A: Direct File Open (Limited)
You can drag `index.html` into your browser. *Note: Some browser security policies may restrict ES module loading from `file://` protocol.*

### Option B: Static Server (Recommended)

Using Python:
```bash
python3 -m http.server
# Open http://localhost:8000
```

Using Node (npx):
```bash
npx serve .
# Open http://localhost:3000
```

Using VS Code:
- Install "Live Server" extension.
- Right-click `index.html` -> "Open with Live Server".

## Project Structure

```
dawnWorld/
├── index.html          # Entry point (contains importmap & CSS refs)
├── index.tsx           # React entry root
├── types.ts            # Type definitions
├── App.tsx             # Main Application component
├── components/         # UI Components
│   ├── HexGrid.tsx     # Map renderer
│   ├── Layout.tsx      # Main layout shell
│   └── ...
├── docs/               # Documentation
└── metadata.json       # Application metadata
```

## Development Setup

### Type Checking
Since there is no bundler, you rely on your IDE (VS Code) for type checking. Ensure `tsconfig.json` (if present) is configured to look at the source files.

### Adding Dependencies
To add a new library:
1. Find the ESM-compatible URL (e.g., from [esm.sh](https://esm.sh)).
2. Add it to the `"imports"` section of the `<script type="importmap">` in `index.html`.
3. Record it in `docs/import.md`.

## Troubleshooting

### "Module not found" or CORS errors
If you see CORS errors in the console, ensure you are using a local static server (Option B above) rather than opening the file directly.

### Type Errors in IDE
Ensure your IDE is using the workspace TypeScript version.

## Next Steps

- **For Players**: Read the [User Guide](USER_GUIDE.md) to learn how to play.
- **For Developers**:
    - Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system design
    - Review [UI_COMPONENTS.md](UI_COMPONENTS.md) to learn about components
    - Check [API_REFERENCE.md](API_REFERENCE.md) for type definitions
