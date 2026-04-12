
# Spec: Orbital Mechanics & Temporal Cycles (Phase 19)

## 1. Objective
Implement a deterministic celestial mechanics system that simulates:
1.  **Axial Tilt (Obliquity):** Locking the planet's rotation axis at a specific angle.
2.  **Day/Night Cycle:** Planetary rotation creating a terminator line (light/dark side).
3.  **Solar Orbit (Seasons):** The relative movement of the Sun creating seasonal variations in insolation.
4.  **Calendar:** A calculated date system based on orbital position.

## 2. Theoretical Model (Geocentric Visualization)
To maintain floating-point precision and simplify camera controls, we use a **Geocentric Rendering Model**.
*   **The Player** is stationary relative to the planet's center.
*   **The Planet** rotates around its local Y-axis (Spin).
*   **The Planet Container** is tilted by the Axial Tilt.
*   **The Sun** orbits around the Planet Container (Year).

### 2.1 Coordinate Hierarchy
```
World Origin (0,0,0)
  ├── Sun Light (DirectionalLight) -> Orbits in XZ plane (The Ecliptic)
  └── Planet Pivot (Group)
      └── Tilt Container (Group) -> Rotates Z by -AxialTilt
          └── Planet Mesh (Group) -> Rotates Y by DaySpin (0..2π)
```

### 2.2 Solar Mechanics
*   **Year Progress ($\theta_{year}$)**: $0 \to 2\pi$ radians.
*   **Sun Position**: 
    $$ x = R_{orbit} \cdot \cos(\theta_{year}) $$
    $$ z = R_{orbit} \cdot \sin(\theta_{year}) $$
*   **Season Determination**:
    *   Defined by the angle between the Sun vector and the Planet's Up vector (adjusted for tilt).
    *   $\theta_{year} \approx 0$: Sun aligns with Northern Hemisphere tilt (Summer North).
    *   $\theta_{year} \approx \pi$: Sun aligns with Southern Hemisphere tilt (Winter North).

## 3. Data Model

### 3.1 Config Schema (`PlanetConfig`)
Extend the existing config with:
```typescript
interface OrbitalConfig {
  dayLengthRealSeconds: number; // e.g., 60 seconds = 1 day
  yearLengthDays: number;       // e.g., 365 days
  axialTilt: number;            // Degrees, e.g., 23.5
  sunIntensity: number;         // Lux proxy
}
```

### 3.2 Runtime State (`useTimeStore`)
A new store to handle the "Cosmic Clock".
```typescript
interface TimeState {
  // The absolute timestamp of the universe (in Game Seconds)
  // 0 = Start of Year 1
  absoluteTime: number; 
  
  // Controls
  isPaused: boolean;
  timeScale: number; // 1.0 = Realtime, 100.0 = Fast Forward
  
  // Derived (Calculated getters)
  getYear: () => number;
  getDayOfYear: () => number;
  getLocalTime: () => number; // 0..24
  getSeason: () => 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
  getSunPosition: () => THREE.Vector3;
}
```

## 4. Visual Implementation

### 4.1 Lighting
*   **Sun**: `DirectionalLight` with `castShadow=true`. Position updated every frame based on `absoluteTime`.
*   **Ambience**: `HemisphereLight`.
    *   *GroundColor*: Dark Blue/Black (Night side).
    *   *SkyColor*: Very faint purple/grey.
    *   Prevents the dark side from being pitch black (simulating atmospheric scattering).

### 4.2 Atmosphere Shader Integration (Future hook)
The `sunDirection` uniform in any atmospheric shaders must effectively be: 
`normalize(SunPosition - PlanetPosition)`.

### 4.3 Seasonal Geometry (The "Wobble")
We do not wobble the planet. We rotate the Sun. However, because the planet is in a `TiltContainer`, the *effect* is that the North Pole points towards the sun at one side of the orbit and away at the other.

## 5. Calendar System
*   **Year**: `floor(absoluteTime / (dayLength * yearLength))`
*   **Day**: `floor(absoluteTime / dayLength) % yearLength`
*   **Hour**: `(absoluteTime % dayLength) / dayLength * 24`

## 6. Verification Plan
*   [ ] **TC-19-01**: Sun rises in the East and sets in the West (Relative to rotation).
*   [ ] **TC-19-02**: At "Summer Solstice", the North Pole is lit continuously (Midnight Sun).
*   [ ] **TC-19-03**: At "Winter Solstice", the North Pole is dark continuously (Polar Night).
*   [ ] **TC-19-04**: One full orbit of the light source equals exactly `yearLengthDays` rotations of the mesh.
