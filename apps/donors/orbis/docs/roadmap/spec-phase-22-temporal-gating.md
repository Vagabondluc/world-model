
# Spec: Temporal System Gating (Phase 22)

## 1. Objective
Ensure simulation stability and visual clarity by dynamically enabling/disabling physical systems based on the `timeScale` of the cosmic clock.

## 2. Temporal Regimes

| Regime | Time Scale Range | Active Systems | Visual Features |
| :--- | :--- | :--- | :--- |
| **Living** | 0 to 1 Day/sec | Atmosphere, Wind, Local Voxel Realization | Clouds drift, Wind needles visible |
| **Historical**| 1 Day to 20 Years/sec | Civilization Growth, Seasonal Cycles | Atmosphere Static, Fast-forward lighting |
| **Geologic** | > 20 Years/sec | Tectonics, Erosion, Orogeny, Delta growth | Coastlines move, Mountains rise |

## 3. Implementation Logic

### 3.1 Gating Rules
The `useTimeStore` determines system status via three boolean flags:
*   `isAtmosphereActive`: `timeScale <= secondsPerDay`
*   `isGeologicActive`: `timeScale >= (secondsPerYear * 20)`
*   `isCivActive`: `timeScale > 0` (Always true if not paused)

### 3.2 System Response
1.  **Atmosphere**: When `!isAtmosphereActive`, `CloudLayer` stops internal rotation and `WindNeedles` are hidden.
2.  **Geosphere**: When `isGeologicActive`, the `SlowTick` (Erosion/Tectonics) is triggered every 100 accumulated years.

## 4. UI/UX
*   **Time Speed Slider**: Updated with markers for "Atmosphere Limit" and "Geologic Start".
*   **System Indicators**: Visual badges in the Time Widget showing which physics layers are currently being calculated.

## 5. Verification Plan
*   [ ] **TC-22-01**: Clouds stop moving when slider passes "1 Day / sec".
*   [ ] **TC-22-02**: Wind needles disappear at high speed to reduce visual noise.
*   [ ] **TC-22-03**: Geologic indicator appears when time is fast enough to simulate tectonics.
