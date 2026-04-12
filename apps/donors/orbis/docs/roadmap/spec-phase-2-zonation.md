
# Spec: Vertical Zonation (Phase 2)

## 1. Objective
Define strict vertical slices of the world to prevent "mushy" terrain where mountains look like hills and beaches are invisible.

## 2. Vertical Zones (Enum)

| Zone Name | Range (Normalized) | Visual / Voxel Material |
| :--- | :--- | :--- |
| **ABYSSAL** | `-1.00` to `-0.60` | Deep Water (Dark Blue), Gravel/Sand bottom |
| **OCEANIC** | `-0.60` to `-0.10` | Water (Blue), Sand bottom |
| **SHELF** | `-0.10` to `0.00` | Coastal Water (Turquoise), Sand |
| **STRAND** | `0.00` to `0.05` | Sand / Beach |
| **LOWLAND** | `0.05` to `0.40` | Grass, Dirt, Forest floor |
| **HIGHLAND** | `0.40` to `0.70` | Stone, Sparse Grass |
| **MONTANE** | `0.70` to `0.90` | Stone, Bare Rock |
| **SUMMIT** | `0.90` to `1.00` | Snow, Ice |

## 3. Height Redistribution
Raw noise is Gaussian (bell curve). We need to flatten the valleys and sharpen the peaks.
**Formula**:
```typescript
function redistributeElevation(e: number): number {
  // Exponentiate land to make peaks rarer
  if (e > 0) return Math.pow(e, 2.0); 
  // Flatten oceans slightly
  return -Math.pow(Math.abs(e), 1.5);
}
```

## 4. Verification Plan (TDD)
- [ ] **Test Case 1**: Ensure `SHELF` zone exists. Visual check: Light blue ring around continents.
- [ ] **Test Case 2**: Ensure `SUMMIT` appears only sparingly (top 1-5% of hexes).
- [ ] **Test Case 3**: Voxel engine generates `SAND` only in `STRAND` zone or Arid biomes.
