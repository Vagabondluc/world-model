
# Spec: Meteorological Dynamics & Micro-Voxels (Phase 9b)

## 1. Problem Definition
1.  **Visual Scale**: Previous cloud voxels were too large (~25% of a hex), creating a "blocky" or "exaggerated" look rather than a diffuse atmosphere.
2.  **Physics**: The atmosphere currently rotates as a rigid body. Real planetary atmospheres exhibit **Differential Rotation** and **Zonal Flow** (winds moving in opposite directions based on latitude).

## 2. Visual Overhaul: Micro-Voxels
To fix the "exaggerated size", we will increase the resolution of the cloud layer significantly while reducing the individual particle size.

- **Scale Factor**: Reduce cloudlet size from `0.45` to `0.12` (approx 1/4th previous size).
- **Density**: Increase particle count per hex from `3-8` to `12-24`.
- **Dispersion**: Increase the jitter radius. Instead of a tight cluster, particles should spread to the edges of the hex, allowing clouds to visually blend with neighbors.

## 3. Meteorological Model: Zonal Circulation
We will implement a simplified **General Circulation Model (GCM)** based on Earth's atmospheric cells. The atmosphere will no longer be a single `Group`; it will be sliced into **Latitudinal Bands**, each with independent velocity vectors.

### 3.1 The Three-Cell Model
We divide the sphere into bands based on absolute latitude ($\phi$):

| Cell Name | Latitude Range | Surface Wind Direction | Orbital Rotation Logic |
| :--- | :--- | :--- | :--- |
| **Hadley Cell** | $0^\circ - 30^\circ$ | **Trade Winds** (East to West) | Rotates **Retrograde** (Slower than planet or backwards relative to surface). |
| **Ferrel Cell** | $30^\circ - 60^\circ$ | **Westerlies** (West to East) | Rotates **Prograde** (Faster than planet). |
| **Polar Cell** | $60^\circ - 90^\circ$ | **Polar Easterlies** (East to West) | Rotates **Retrograde**. |

### 3.2 Implementation Strategy: Banded Instancing
Instead of one global `CloudLayer` component, we calculate the latitude of every cloud particle at spawn and assign it to one of three `InstancedMesh` groups:
1.  `EquatorialClouds` (Hadley)
2.  `TemperateClouds` (Ferrel)
3.  `PolarClouds` (Polar)

### 3.3 Dynamic Velocity
Each group will rotate at a different delta:
- **Base Planet Rotation**: $\omega$
- **Equatorial**: $\omega - 0.002$ (Lagging)
- **Temperate**: $\omega + 0.003$ (Leading/Jet Stream)
- **Polar**: $\omega - 0.001$ (Slight Lag)

This creates the visual effect of clouds "shearing" past each other at the 30° and 60° latitude lines.

## 4. Advanced Turbulence (Vertex Shader Injection)
To further break up the static look without heavy CPU cost, we will inject a custom implementation into the `MeshStandardMaterial`'s `onBeforeCompile`.
- **Effect**: Local position noise.
- **Uniforms**: `uTime`.
- **Logic**: `vPosition.y += sin(uTime + vPosition.x) * 0.05`.
- **Result**: Clouds will gently bob and weave within their clusters.

## 5. Verification Plan

### TC-904: Scale Check
- **Visual**: Clouds should appear as "fine dust" or "mist" rather than "boxes".
- **Visual**: Individual voxels should be barely distinguishable at default zoom.

### TC-905: The "Jupiter Effect" (Shearing)
- **Visual**: Speed up time. Observe the cloud bands at the equator moving left, while clouds at mid-latitudes move right.
- **Visual**: Verify a "turbulence zone" exists at roughly 30° latitude where the two bands grind past each other.
