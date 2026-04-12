
# 🔒 TEMPORAL STABILITY & VISUAL GATING SPEC v1.0

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: [`docs/specs/00-core-foundation/01-time-clock-system.md`, `docs/specs/20-world-generation/19-orbital-cycles.md`]
- `Owns`: [`VisualRegime`, `DayLengthMath`, `PerformanceTelemetry`]
- `Writes`: [`rendering_constraints`, `time_config`]

---

## 0️⃣ Purpose

Fix discrepancies between simulation time and visual representation.
1.  **Visual Gating**: Disable high-frequency visual updates (Seasons, Day/Night) when `timeScale` exceeds perception thresholds to prevent strobing.
2.  **Day Length Authority**: Enforce strict mapping between `AbsTime` (microseconds) and Rotation Angle to fix "2-hour day" artifacts.
3.  **Performance Monitoring**: Expose Frame Rate (FPS) and Tick Rate (TPS) to the UI.

---

## 1️⃣ Visual Regimes (LOCKED)

The renderer must check `timeScale` against thresholds to determine which visual layers are active.

```ts
enum VisualRegime {
  REALTIME, // Scale <= 100x (Full animation)
  FAST,     // Scale <= 1 day/sec (Interpolated animation)
  WARP,     // Scale > 1 day/sec (Static Sun, Average Seasons)
  HYPER     // Scale > 42 days/sec (Static Biomes, No particles)
}
```

### 1.1 Thresholds

| Regime | TimeScale (Sec/RealSec) | Visual Rules |
| :--- | :--- | :--- |
| **REALTIME** | `0 - 100` | Full day/night cycle, smooth clouds. |
| **FAST** | `100 - 86,400` | Sun moves fast. Clouds static or simple drift. |
| **WARP** | `86,400 - 3,628,800` | **Sun Locked** (No Strobe). Seasons interpolate. |
| **HYPER** | `> 3,628,800 (42d/s)` | **Seasons Locked**. Static Lighting. No particles. |

**Rationale:** At >42 days/second, seasonal color shifts create a strobe effect (approx 12Hz) which is visually degrading and performance-heavy.

---

## 2️⃣ Day Length Correction (Physics Fix)

**Issue:** Day length currently perceived as ~2 hours (7200s) implies a mismatch between the `OrbitConfig` and the `CelestialSystem` rotation logic.

### 2.1 Canonical Rotation Formula

Planetary rotation must be derived strictly from `AbsTime` (microsecond resolution).

```ts
const MICROSECONDS_PER_SECOND = 1_000_000n;

// Inputs
const tNowUs: bigint = scheduler.getAbsoluteTime();
const dayLengthSec: number = config.orbital.dayLengthSeconds; // Default: 86400 (24h)

// Math
const simSeconds = Number(tNowUs / MICROSECONDS_PER_SECOND);
const dayProgress = (simSeconds % dayLengthSec) / dayLengthSec; // 0.0 to 1.0

const rotationY = dayProgress * (Math.PI * 2);
```

### 2.2 Visual Decoupling Rule

If `VisualRegime >= WARP`:
*   `rotationY` MUST be locked to a fixed angle (e.g., `Math.PI / 4` or "Noon at Prime Meridian").
*   Do NOT spin the planet mesh.
*   Do NOT orbit the Sun light source.
*   This ensures the user can inspect terrain/civ evolution without motion sickness.

---

## 3️⃣ Performance Telemetry (FPS/TPS)

We must expose performance metrics to ensure the "Sim-Worker" and "Main-Thread" are healthy.

### 3.1 Data Contract

```ts
interface PerformanceMetrics {
  fps: number; // Render Frames Per Second (Main Thread)
  tps: number; // Simulation Ticks Per Second (Logic)
  frameTimeMs: number; // ms per render frame
  overheadMs: number; // ms spent in React/overhead
}
```

### 3.2 Display Requirement

A compact indicator must be rendered below the `TimeWidget`.

*   **Format:** `XX FPS | YY TPS`
*   **Color Coding:**
    *   Green: > 55 FPS
    *   Yellow: 30-55 FPS
    *   Red: < 30 FPS

---

## 4️⃣ Season Visualization Gating

The `EnergyBalanceModel` (Climate) updates continuously, but the **Rendered Material** must gate updates.

### 4.1 Update Throttling

When `VisualRegime === HYPER` (>42 days/sec):

1.  **Shader Uniforms**: `u_season` is clamped to a static value (e.g., `0.0` or Summer).
2.  **Ice Cap Masks**: Update only on `Regenerate` ticks (e.g., every 100k years), do not interpolate every frame.
3.  **Rationale**: Prevents texture uploading bottlenecks and visual flickering.

### 4.2 React State Policy

Do not pass `currentSeason` to React Components via `useTimeStore` every tick if `timeScale` is high.

*   **Implementation:** `useTimeStore` should output a `debouncedSeason` that only updates when meaningful state changes occur (Event-driven), rather than every frame.

---

## 5️⃣ Implementation Plan

1.  **Refactor `CelestialSystem.tsx`**: Implement the Rotation Logic and Visual Regime locking.
2.  **Update `EnergyBalanceModel`**: Add a "Fast-Forward" mode that skips per-tick buffer generation if no major climate shift occurred.
3.  **Create `PerformanceMonitor`**: A lightweight rAF loop to measure FPS/TPS.
4.  **Update `TimeWidget`**: Add the FPS/TPS footer.

## 6️⃣ Compliance Vector
*   **Input**: `timeScale = 4,000,000` (approx 46 days/sec).
*   **Expected**:
    *   Sun position: Fixed (No rotation).
    *   Seasons: Fixed (No color shifting).
    *   FPS: Stable > 30.
    *   Sim Time: Increasing rapidly.

