# Glossary

- Authority level: simulation layer that stores truth (not just visual output).
- Baked semantic texture: generated per-hex data map encoding simulation meaning.
- Chunk: fixed-size voxel storage block (for streaming and sparse world management).
- Determinism: same inputs (seed + authority fields) produce identical outputs.
- Edge seam: visible/data discontinuity between neighboring hex/chunk boundaries.
- Hex authority: rule/state ownership at hex level (biome, climate, elevation, tags).
- LOD: level of detail used for scale-dependent representations.
- Local hex (L5): authoritative ~3-mile gameplay hex in this stack.
- Sub-hex: derived child cell inside one parent hex for local refinement.
- Voxel: volumetric sample/value at `(x, y, z)`.
- Voxel view: generated geometry/material representation, not permanent global truth.
