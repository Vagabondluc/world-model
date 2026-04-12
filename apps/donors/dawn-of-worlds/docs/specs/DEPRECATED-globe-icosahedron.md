# Deprecated: Faceted Icosahedron Globe Specifications

## Deprecation Date
2026-01-31

## Reason for Deprecation
The faceted icosahedron-based globe architecture has been deprecated in favor of a pure smooth spherical geometry approach. The smooth spherical architecture provides:

- Continuous curvature across the entire globe surface
- Better visual quality with no visible faceting
- Improved pole region rendering with dedicated mitigation techniques
- Enhanced user experience with a more realistic planet appearance

## Deprecated Specifications

### Core Specifications
The following specifications have been deprecated:

- [`new-specs/globe.md`](new-specs/globe.md) - Faceted icosahedron globe overview
- [`030-globe-geometry-core.md`](030-globe-geometry-core.md) - Faceted icosahedron geometry core
- [`031-globe-coordinate-transform.md`](031-globe-coordinate-transform.md) - Faceted coordinate transformations
- [`032-globe-scale-system.md`](032-globe-scale-system.md) - Faceted scale system
- [`033-globe-rendering-layer.md`](033-globe-rendering-layer.md) - Faceted rendering layer
- [`034-globe-camera-interaction.md`](034-globe-camera-interaction.md) - Faceted camera interaction
- [`035-globe-migration-path.md`](035-globe-migration-path.md) - Migration path from flat maps

### Test-Driven Development Files
The following TDD files have been deprecated:

- [`../tdd/030-globe-geometry-core.tdd.md`](../tdd/030-globe-geometry-core.tdd.md)
- [`../tdd/031-globe-coordinate-transform.tdd.md`](../tdd/031-globe-coordinate-transform.tdd.md)
- [`../tdd/032-globe-scale-system.tdd.md`](../tdd/032-globe-scale-system.tdd.md)
- [`../tdd/033-globe-rendering-layer.tdd.md`](../tdd/033-globe-rendering-layer.tdd.md)
- [`../tdd/034-globe-camera-interaction.tdd.md`](../tdd/034-globe-camera-interaction.tdd.md)
- [`../tdd/035-globe-migration-path.tdd.md`](../tdd/035-globe-migration-path.tdd.md)

### Task Files
The following task files have been deprecated:

- [`../tasks/030-globe-geometry-core.tasks.md`](../tasks/030-globe-geometry-core.tasks.md)
- [`../tasks/031-globe-coordinate-transform.tasks.md`](../tasks/031-globe-coordinate-transform.tasks.md)
- [`../tasks/032-globe-scale-system.tasks.md`](../tasks/032-globe-scale-system.tasks.md)
- [`../tasks/033-globe-rendering-layer.tasks.md`](../tasks/033-globe-rendering-layer.tasks.md)
- [`../tasks/034-globe-camera-interaction.tasks.md`](../tasks/034-globe-camera-interaction.tasks.md)
- [`../tasks/035-globe-migration-path.tasks.md`](../tasks/035-globe-migration-path.tasks.md)

## Replacement Architecture

All new development must use the smooth spherical architecture defined in:

- [`036-smooth-spherical-globe-architecture.md`](036-smooth-spherical-globe-architecture.md) - Overall smooth spherical architecture
- [`037-smooth-sphere-geometry.md`](037-smooth-sphere-geometry.md) - Smooth sphere mesh generation
- [`038-hex-overlay-rendering.md`](038-hex-overlay-rendering.md) - Hex overlay rendering on smooth sphere
- [`039-pole-mitigation.md`](039-pole-mitigation.md) - Pole deformation mitigation techniques
- [`040-spatial-indexing.md`](040-spatial-indexing.md) - Spatial hashing for cell lookup
- [`041-risk-assessment-mitigation.md`](041-risk-assessment-mitigation.md) - Risk assessment and mitigation

## Key Differences

| Aspect | Faceted Icosahedron (Deprecated) | Smooth Spherical (Current) |
|--------|--------------------------------|---------------------------|
| Base Geometry | Icosahedron subdivision | High-resolution smooth sphere |
| Curvature | Discontinuous | Continuous |
| Visual Appearance | Visible edges/facets | Smooth surface |
| Pole Handling | Pentagonal cells | Adaptive vertex density + displacement |
| Hex Rendering | Geometry faces | Visual overlay on smooth sphere |
| Performance | Lower vertex count | Higher vertex count (mitigated by LOD) |

## Historical Context

The faceted icosahedron approach was initially designed to provide a spherical globe using hexagonal cells. While technically sound, the approach resulted in visible faceting that detracted from the desired "planet" visual experience. The smooth spherical architecture was developed to address this limitation while maintaining the logical hex grid for gameplay mechanics.

## Notes

- **All deprecated files are retained for historical reference only**
- **Do not use any code, tests, or tasks from the deprecated specifications**
- **All new development must reference the smooth spherical architecture (036-041)**
- **The logical hex grid remains unchanged - only the rendering approach has changed**

## Migration Guidance

For any existing code or documentation that references the deprecated specifications:

1. **Update references** to point to smooth spherical specs (036-041)
2. **Remove dependencies** on deprecated coordinate transform implementations
3. **Replace faceted rendering** with hex overlay approach
4. **Update documentation** to reflect smooth spherical architecture
5. **Remove any migration path** references related to faceted approach

---

**Last Updated**: 2026-01-31
**Status**: DEPRECATED - DO NOT USE
