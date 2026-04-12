# Deployment Strategy: Multi-Platform Packaging

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


Packaging this application requires a hybrid approach because we are using **Tauri (Rust/React)** for the UI and **FastAPI (Python)** for the backend intelligence.

## 1. Desktop: Windows, macOS, Linux
For desktop, we use the **Tauri Sidecar** pattern. This bundles the Python backend into a single executable that Tauri manages (starts/stops) automatically.

### Step A: Compile the Python Sidecar
We use `pyinstaller` to turn the `python-backend/` into a standalone binary for each OS.
```bash
# Example for Windows
pyinstaller --noconfirm --onefile --windowed --name "adventure-api-backend" main.py
```
> [!IMPORTANT]
> You must build this on the target machine (build on Windows for `.exe`, build on Mac for Mach-O).

### Step B: Configure Tauri
In `src-tauri/tauri.conf.json`, we define the sidecar:
```json
"bundle": {
  "externalBin": [
    "binaries/adventure-api-backend"
  ]
}
```

### Step C: Build the Installer
Run the Tauri build command. It will bundle the sidecar and create a native installer (`.msi`, `.dmg`, `.deb`).
```bash
pnpm build:desktop
```

---

## 2. Mobile: Android & iOS
Mobile packaging is more complex because iOS and Android do not natively support running a full Python/ChromaDB stack in the background.

### Approach 1: Cloud-Connected Mobile (Recommended)
The mobile app acts as a **Thin Client**. 
- The UI (Tauri) runs natively on the phone.
- It connects to a cloud-hosted version of your Python backend.
- **Packaging**: Use `pnpm tauri android dev` or `pnpm tauri ios dev` to generate the Android Studio/Xcode projects.

### Approach 2: Edge-AI (Advanced)
To run fully offline on mobile, we would need to:
1.  **Replace Python**: Port the Python logic to **Rust** using `candle` (HuggingFace's Rust ML framework) or `ort` (ONNX Runtime).
2.  **Native Vector Store**: Use a Rust-native vector database like `qdrant` instead of ChromaDB.
3.  **Cross-Compilation**: Build the Rust logic directly into the Tauri mobile framework.

---

## 3. Automation (CI/CD)
To package for all targets simultaneously, we use **GitHub Actions**.

| OS | Runner | Output |
| :--- | :--- | :--- |
| **Windows** | `windows-latest` | `.exe`, `.msi` |
| **macOS** | `macos-latest` | `.app`, `.dmg` |
| **Linux** | `ubuntu-latest` | `.deb`, `.AppImage` |
| **Android** | `ubuntu-latest` | `.apk`, `.aab` |
| **iOS** | `macos-latest` | `.ipa` (requires Apple Dev Account) |

## Summary of Commands
| Action | Command |
| :--- | :--- |
| Install Dependencies | `pnpm install` |
| Compile Python (Sidecar) | `cd python-backend && pyinstaller main.spec` |
| Build Windows | `pnpm build:desktop` |
| Build Android | `pnpm build:android` |
| Build iOS | `pnpm build:ios` |
