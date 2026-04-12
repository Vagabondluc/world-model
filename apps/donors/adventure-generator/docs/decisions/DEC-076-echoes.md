# DEC-076: Relational "Echoes"

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


* **Status:** Implemented
* **Date:** 2026-02-01
* **Context:** Multi-plane campaigns require consistency across layers.

## Summary

Implemented a system for managing location associations across parallel map layers, enabling users to:

1. **Track Layer Origins**: Each location can optionally specify which map layer it originated from via `layerAssociation.associatedMapId` and `layerAssociation.originalLayerId`.

2. **Visual Indicators**: The [`LayerIndicator`](src/components/location/LayerIndicator.tsx:1) component shows the current active layer with appropriate color coding.

3. **Smart Filtering**: The [`getFilteredLocationList()`](src/stores/locationStore.ts:14) method filters locations based on:
   - Active map membership
   - Active layer association (new system)
   - Backward compatibility (mapId matching for locations without explicit layerAssociation)

4. **Backward Compatibility**: Existing locations without `layerAssociation` continue to work by matching their `mapId` to the active layer.

## Technical Implementation

### Type System Updates
- Extended [`ManagedLocation`](src/types/location.ts:39) type with optional `layerAssociation?: LayerAssociation` field
- Added [`LayerAssociation`](src/types/location.ts:40) interface with `associatedMapId`, `isEchoed`, and `originalLayerId` fields

### Store Integration
- Updated [`useLocationStore`](src/stores/locationStore.ts:14) with `getFilteredLocationList()` method that implements the filtering logic
- Enhanced [`LocationSidebar`](src/components/location/LocationSidebar.tsx:1) to display the [`LayerIndicator`](src/components/location/LayerIndicator.tsx:1) when a location has an associated map

### Component Architecture
- [`LayerIndicator`](src/components/location/LayerIndicator.tsx:1): Visual indicator showing current layer with color-coded display
- Comprehensive test coverage in [`LayerAssociation.test.ts`](src/tests/location/LayerAssociation.test.ts:1)

## User Experience

The implementation provides a clean, intuitive way to manage location relationships across parallel map layers while maintaining full backward compatibility. Users can now:

- **See at a glance** which layer a location belongs to
- **Maintain consistency** when copying locations between layers
- **Navigate efficiently** with layer-aware location filtering

This aligns with the "One-Way Shadowing" concept from the original proposal, providing the core value of spatial context without the complexity of bi-directional syncing.