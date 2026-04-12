
# Spec: Atmospheric Fronts & Air Mass Dynamics (Phase 14)

## 1. Objective
Replace the static "Perlin Moisture" cloud generation with a deterministic simulation of **Air Masses**. The system will model the interaction between bodies of Cold (Dense) air and Hot (Buoyant) air.
The visual goal is to generate recognizable weather patterns: **Cold Fronts** (Storm lines), **Warm Fronts** (Stratus sheets), and **Cyclones**, derived directly from the underlying terrain thermodynamics.

## 2. Physics Model

### 2.1 Air Mass Classification
Every Hex is classified as carrying a specific type of Air Mass based on its `BiomeData`.

| Symbol | Type | Temp ($T$) | Moisture ($M$) | Density ($\rho$) | Origin |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **cP** | **Continental Polar** | Cold | Dry | High | Tundra/Ice/Snow |
| **mP** | **Maritime Polar** | Cool | Humid | Medium | Ocean (High Lat) |
| **cT** | **Continental Tropical** | Hot | Dry | Low | Desert |
| **mT** | **Maritime Tropical** | Hot | Humid | Very Low | Ocean (Low Lat) |

**Density Formula (Simplified)**: 
$$ \rho \propto \frac{1}{T} \times (1 - 0.3M) $$
*(Cold air is denser; Moist air is lighter than dry air).*

### 2.2 Atmospheric Pressure ($P$)
Pressure is derived from Density and Altitude.
$$ P = P_{base} \times \rho - (Height \times 0.1) $$
- **High Pressure (H)**: Cold, Dry regions (sinking air).
- **Low Pressure (L)**: Hot, Wet regions (rising air).

### 2.3 Wind Vectors ($\vec{V}$)
Wind flows from **High Pressure** to **Low Pressure**.
For every Hex $H$:
1.  Calculate Pressure gradient $\nabla P$ relative to neighbors.
2.  $\vec{V}_{geo} = -\nabla P$ (Gradient Force).
3.  Apply **Coriolis Deflection**: Rotate vector by $\theta$ based on Latitude (Right in North, Left in South).
    - $\theta = Lat \times 0.5$ (Max 45° deflection).

## 3. Frontal Interactions (The "Meeting")

When two Air Masses meet, the boundary is a **Front**. We detect this by analyzing the gradient of Density ($\nabla \rho$) and the Wind Vector ($\vec{V}$).

### 3.1 Cold Front (Storm Line)
**Condition**:
1.  High $\nabla \rho$ (Steep density contrast).
2.  Cold Air velocity is pushing *into* Warm Air.

**Simulation Effect**:
- **Rapid Uplift**: The cold wedge forces warm air up aggressively.
- **Result**: Formation of **Cumulonimbus Towers**.
- **Voxel Output**: Vertical stacks of clouds (Height 5-8 voxels), narrow band (1 hex wide).

### 3.2 Warm Front (Stratus Shield)
**Condition**:
1.  High $\nabla \rho$.
2.  Warm Air velocity is gliding *over* Cold Air.

**Simulation Effect**:
- **Gradual Uplift**: Warm air slides up the "ramp" of cold air.
- **Result**: Formation of **Nimbostratus**.
- **Voxel Output**: Wide, flat sheets of clouds (Height 1-2 voxels), spread across 2-3 hexes ahead of the front.

### 3.3 Occlusion & Stationary
- **Stationary**: High density contrast, but wind vectors are parallel to the boundary. (Clear skies or light fog).
- **Occluded**: Cold front overtakes a warm front (Cyclonic spiral center).

## 4. Data Model Extension

### 4.1 `HexData` Updates
```typescript
interface AtmosphereData {
  pressure: number;         // Normalized 0.8 to 1.2
  airMassType: 'cP' | 'mP' | 'cT' | 'mT';
  windVector: [number, number, number]; 
  frontType: 'NONE' | 'COLD' | 'WARM' | 'STATIONARY';
  stormIntensity: number;   // 0.0 to 1.0
}
```

## 5. Visual Implementation

### 5.1 Cloud Architectures
Instead of generic noise clouds, `CloudLayer.tsx` will instantiate specific shapes based on `frontType`:

1.  **The Wall (Cold Front)**:
    - Dense voxel packing.
    - High verticality (Anvil tops).
    - Darker base color (Shadows).

2.  **The Blanket (Warm Front)**:
    - Sparse but contiguous packing.
    - Low verticality.
    - Uniform coverage.

3.  **Fair Weather (High Pressure)**:
    - "Popcorn" cumulus.
    - Small, isolated clusters.

## 6. Verification Plan (TDD)

### TC-1401: Density Calculation
- **Input**: Hex A (Cold/Dry), Hex B (Hot/Wet).
- **Expect**: $\rho_A > \rho_B$.
- **Expect**: Pressure A > Pressure B.
- **Expect**: Wind Vector points roughly A -> B.

### TC-1402: Cold Front Detection
- **Setup**: Place a block of `cP` hexes moving East into a block of `mT` hexes.
- **Action**: Run `analyzeFronts()`.
- **Expect**: The boundary hexes are flagged as `frontType: 'COLD'`.

### TC-1403: Visual Logic
- **Input**: A hex with `frontType: 'COLD'` and `stormIntensity: 0.9`.
- **Output**: Voxel generator produces a cloud column > 6 voxels high.
