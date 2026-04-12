# Ollama & Python Backend: Strategic Analysis & Roadmap

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. The Case for a Python Backend (The "Why")

While TypeScript is excellent for UI, AI logic in JS/TS often feels like "fighting the language." A Python backend transforms the AI from a simple chat interface into a **Reasoning Engine.**

### A. Strict Schema Enforcement (The "Instructor" Benefit)
D&D generation requires high-precision JSON (e.g., specific stats for a level 5 Rogue). 
- **The Problem**: Ollama's `format: "json"` is a "hint," and TypeScript validation (Zod) is "defensive." You often get retries or "partially valid" JSON.
- **The Solution**: The Python library `instructor` uses **Pydantic** to patch the LLM call itself. It leverages "Function Calling" or "Structured Outputs" at the token-generation level. 
- **Impact**: 100% valid D&D stat blocks, every time, with automatic retries handled invisibly by the backend.

### B. World-State Grounding (The "RAG" Benefit)
For a campaign to feel real, the AI needs to remember that "The Red Dragon's Lair" is 3 days North of "Goldcrest."
- **The Problem**: Passing the entire campaign history in every prompt hits context limits and costs "intellectual density."
- **The Solution**: **Local RAG**. Python's `LangChain` and `ChromaDB` ecosystem allows us to index the user's `.md` files and `.yaml` logs into a vector database.
- **Impact**: The AI only "retrieves" the relevant lore for the current scene, keeping prompts fast and highly grounded.

---

## 2. The "Distribution Nightmare" (The "Why Not Yet")

Moving to a managed "Tauri Sidecar" too early is a major risk.

| Challenge | Impact |
| :--- | :--- |
| **Binary Bloat** | A bundled Python runtime adds ~150MB to your installer. For a D&D tool, this is a heavy friction point for new users. |
| **Dependency Hell** | Numpy/PyTorch/Tensorflow (if used for map math) have heavy C-extension dependencies. Bundling them cross-platform requires a dedicated build farm. |
| **Security Scope** | Allowing a compiled binary to spawn local servers requires complex code-signing on macOS and often triggers "Windows Defender" false positives. |

---

## 3. The "Bring Your Own Python" (BYOP) Protocol

To move forward without the "Nightmare," we adopt the **BYOP Strategy.**

### Initial Architecture (Phase 1: Development)
1. **Frontend**: The React app looks for an environment variable `VITE_PYTHON_BACKEND_URL`. 
2. **User**: You (the developer) run a local FastAPI server in a dedicated terminal.
3. **Connectivity**: The app communicates via standard REST/WebSockets.

### Roadmap to Production
1. **Pilot Phase (Current)**: Build the `backend/` folder. Use `pip install` and `uvicorn`.
2. **Hardening Phase**: Implement a "Check Backend" health pulse in the UI. If the backend is missing, the app gracefully falls back to "Direct Ollama" mode.
3. **Bundling Phase**: Only once the RAG/Instructor features are "Must Haves," we use `PyInstaller` to bundle the backend as a sidecar.

---

## 4. Proposed Skeleton: `backend/`

We should initialize the following structure:
```text
backend/
├── main.py          # FastAPI entry point
├── requirements.txt  # instructor, fastapi, pydantic, ollama
├── services/
│   ├── generator.py  # Structured output logic (Instructor)
│   └── rag.py        # Vector search / World lore grounding
└── models/
    └── schemas.py    # Pydantic models (NPCs, Encounters, Maps)
```

---

## 5. The "Managed Sidecar" Path (Separate Binary)

If we commit to a separate Python binary, we transition from BYOP to a **Managed Sidecar** architecture.

### A. The Build Pipeline (PyInstaller)
To create the separate binary:
1. **Command**: Run `pyinstaller --onefile --name ensemble-ai-backend main.py`.
2. **Naming Convention**: Tauri requires sidecars to include the target triple.
   - Example (Windows): `ensemble-ai-backend-x86_64-pc-windows-msvc.exe`
   - Example (Mac Arm): `ensemble-ai-backend-aarch64-apple-darwin`

### B. Tauri Configuration (`tauri.conf.json`)
You must register the binary in the `bundle` section:
```json
"bundle": {
  "externalBin": [
    "binaries/ensemble-ai-backend"
  ]
}
```

### C. Rust Integration (`lib.rs`)
While Tauri bundles the binary, you still need to spawn it and handle its lifecycle (e.g., ensuring it dies when the app closes).
```rust
use tauri_plugin_shell::ShellExt;

// In setup block
let sidecar = app.shell().sidecar("ensemble-ai-backend").unwrap();
let (mut _rx, _child) = sidecar.spawn().unwrap();
```

### D. Trade-offs Scorecard
- **Ease of Use**: 10/10 (One click for the user).
- **Developer Overhead**: 9/10 (Complex CI/CD, cross-compilation).
- **Capabilities**: 10/10 (Infinite Python power).


### E. Critical Critique: The "Hidden Costs" of Sidecars

While the "One-Click" appeal is strong, the Managed Sidecar approach has significant downsides that often trap developers:

| Risk Factor | Severity | Description |
| :--- | :--- | :--- |
| **Anti-Virus False Positives** | 🔴 **CRITICAL** | Binaries created by `PyInstaller` or `Nuitka` are frequently flagged as **Trojan/Malware** by Windows Defender and macOS Gatekeeper because they act like self-extracting archives. <br> **Fix**: Requires an EV Code Signing Certificate (~$400/year) and building up "Reputation" with Microsoft SmartScreen. |
| **Zombie Processes** | 🟠 **HIGH** | If the main Tauri app crashes or is Force Quit, the sidecar often survives. It keeps the port (8000) locked. When the user restarts the app, the *new* sidecar fails to bind the port, causing a silent failure. |
| **Update Friction** | 🟠 **HIGH** | You lose the agility of web dev. A 1-line Python fix requires rebuilding the 200MB installer and forcing the user to download/reinstall everything. You cannot use "Over-the-Air" (OTA) updates for the binary. |
| **Debugging "Black Box"** | 🟡 **MEDIUM** | In production, if the Python binary crashes, the user just sees "Connection Failed." You lose the terminal's stdout/stderr unless you implement a complex log-shipping pipeline back to the Rust/Tauri layer. |

## 6. Final Verdict (Revised)

**Don't build the sidecar yet.** 

The "Anti-Virus False Positive" issue alone is often a project-killer for indie distribution.
1. **Stick to BYOP** (Bring Your Own Python) for the development phase.
2. If you *must* ship features requiring Python, consider asking the user to install Python separately or use a Docker container, rather than maintaining a fragile bundled binary.
