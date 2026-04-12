# Orbis 1.0 Compatibility Layer

## Overview

This document defines the compatibility layer between Orbis 1.0 and Orbis 2.0, enabling data migration, type mapping, and cross-version interoperability.

## Type Mappings

### BiomeType Enum (Orbis 1.0 → Orbis 2.0)

Orbis 1.0 defines 23 biome types with integer values 0-22:

| Orbis 1.0 Value | Orbis 1.0 Name | Orbis 2.0 Mapping | Notes |
|-----------------|----------------|-------------------|-------|
| 0 | DEEP_OCEAN | DEEP_OCEAN | Direct mapping |
| 1 | OCEAN | OCEAN | Direct mapping |
| 2 | SHALLOW_OCEAN | SHALLOW_OCEAN | Direct mapping |
| 3 | BEACH | BEACH | Direct mapping |
| 4 | PLAINS | PLAINS | Direct mapping |
| 5 | FOREST | TEMPERATE_FOREST | Renamed for clarity |
| 6 | JUNGLE | TROPICAL_RAINFOREST | Renamed for clarity |
| 7 | DESERT | DESERT | Direct mapping |
| 8 | SAVANNA | SAVANNA | Direct mapping |
| 9 | TUNDRA | TUNDRA | Direct mapping |
| 10 | TAIGA | BOREAL_FOREST | Renamed for clarity |
| 11 | SWAMP | WETLAND | Renamed for clarity |
| 12 | MOUNTAIN | MOUNTAIN | Direct mapping |
| 13 | SNOWY_MOUNTAIN | ALPINE_MOUNTAIN | Renamed for clarity |
| 14 | ICE_SHELF | ICE_SHELF | Direct mapping |
| 15 | GLACIER | GLACIER | Direct mapping |
| 16 | VOLCANIC | VOLCANIC | Direct mapping |
| 17 | CORAL_REEF | CORAL_REEF | Direct mapping |
| 18 | MANGROVE | MANGROVE | Direct mapping |
| 19 | STEPPE | STEPPE | Direct mapping |
| 20 | SHRUBLAND | SHRUBLAND | Direct mapping |
| 21 | CANYON | CANYON | Direct mapping |
| 22 | ALPINE | ALPINE_TUNDRA | Renamed for clarity |

### VoxelMaterial Enum (Orbis 1.0 → Orbis 2.0)

Orbis 1.0 defines 22 material types with integer values 0-21:

| Orbis 1.0 Value | Orbis 1.0 Name | Orbis 2.0 Mapping | Notes |
|-----------------|----------------|-------------------|-------|
| 0 | AIR | AIR | Direct mapping |
| 1 | WATER | WATER | Direct mapping |
| 2 | SAND | SAND | Direct mapping |
| 3 | DIRT | DIRT | Direct mapping |
| 4 | GRASS | GRASS | Direct mapping |
| 5 | STONE | STONE | Direct mapping |
| 6 | GRANITE | GRANITE | Direct mapping |
| 7 | BASALT | BASALT | Direct mapping |
| 8 | LIMESTONE | LIMESTONE | Direct mapping |
| 9 | CLAY | CLAY | Direct mapping |
| 10 | SNOW | SNOW | Direct mapping |
| 11 | ICE | ICE | Direct mapping |
| 12 | WOOD | WOOD | Direct mapping |
| 13 | LEAVES | LEAVES | Direct mapping |
| 14 | COAL | COAL_ORE | Renamed for consistency |
| 15 | IRON | IRON_ORE | Renamed for consistency |
| 16 | GOLD | GOLD_ORE | Renamed for consistency |
| 17 | OBSIDIAN | OBSIDIAN | Direct mapping |
| 18 | MARBLE | MARBLE | Direct mapping |
| 19 | LAVA | LAVA | Direct mapping |
| 20 | BEDROCK | BEDROCK | Direct mapping |
| 21 | MAGMA | MAGMA | Direct mapping |

### WorldDelta Format Compatibility

#### Orbis 1.0 WorldDelta Structure

```typescript
interface WorldDeltaV1 {
    h?: number;      // Optional height modification
    t?: number;      // Optional temperature modification
    m?: number;      // Optional moisture modification
    s?: SettlementType;  // Optional settlement type
    d?: string;      // Optional description
}
```

#### Orbis 2.0 WorldDelta Structure

```typescript
interface WorldDeltaV2 {
    height?: number;      // Height modification (renamed from 'h')
    temperature?: number; // Temperature modification (renamed from 't')
    moisture?: number;    // Moisture modification (renamed from 'm')
    settlement?: SettlementType;  // Settlement type (renamed from 's')
    description?: string;  // Description (renamed from 'd')
    // Additional fields in Orbis 2.0:
    biomeId?: BiomeTypeId;
    materialId?: VoxelMaterialId;
    timestamp?: AbsTime;
    author?: string;
}
```

### RefinedHexHeader Structure

#### Orbis 1.0 RefinedHexHeader

```typescript
interface RefinedHexHeaderV1 {
    specVersion: string;      // Specification version
    encodingVersion: string;  // Encoding version
    generatorVersion: string; // Generator version
    worldSeed: number;        // World seed (uint64)
    hexId: string;            // Hex identifier
    rasterSize: number;       // Raster size
    subDivN: number;          // Subdivision level
}
```

#### Orbis 2.0 RefinedHexHeader

```typescript
interface RefinedHexHeaderV2 {
    specVersion: string;      // Specification version
    encodingVersion: string;  // Encoding version
    generatorVersion: string; // Generator version
    worldSeed: number;        // World seed (uint64)
    hexId: string;            // Hex identifier
    rasterSize: number;       // Raster size
    subDivN: number;          // Subdivision level
    // Additional fields in Orbis 2.0:
    compressionType?: string;  // Compression algorithm
    checksum?: string;        // Data integrity checksum
    createdAt?: AbsTime;      // Creation timestamp
    modifiedAt?: AbsTime;     // Last modification timestamp
}
```

## Data Migration Strategies

### Strategy 1: Forward Migration (1.0 → 2.0)

When migrating data from Orbis 1.0 to Orbis 2.0:

1. **Biome Type Migration**: Apply the BiomeType enum mapping table
2. **Voxel Material Migration**: Apply the VoxelMaterial enum mapping table
3. **WorldDelta Field Renaming**: Rename abbreviated fields to full names
4. **Header Field Extension**: Add new optional fields with default values
5. **Serialization Format**: Ensure Little Endian byte order is maintained

### Strategy 2: Backward Compatibility (2.0 → 1.0)

When Orbis 2.0 data needs to be consumed by Orbis 1.0:

1. **Biome Type Reverse Mapping**: Apply reverse mapping (may lose information for new biomes)
2. **Voxel Material Reverse Mapping**: Apply reverse mapping (may lose information for new materials)
3. **WorldDelta Field Abbreviation**: Convert full field names to abbreviated form
4. **Header Field Pruning**: Remove fields not present in Orbis 1.0
5. **Validation**: Ensure all values are within Orbis 1.0 ranges

### Strategy 3: Dual-Format Support

For systems that need to support both versions simultaneously:

1. **Version Detection**: Read the `specVersion` field to determine format
2. **Adapter Pattern**: Use version-specific adapters for serialization/deserialization
3. **Canonical Representation**: Maintain an internal canonical format that maps to both versions
4. **Lossless Conversion**: Store version-specific metadata for round-trip conversion

## Coordinate Transformation Utilities

### Hex Coordinate Systems

#### Orbis 1.0 Cube Coordinates

```typescript
interface CubeCoordsV1 {
    q: number;  // X-axis
    r: number;  // Y-axis
    s: number;  // Z-axis (where q + r + s = 0)
}
```

#### Orbis 2.0 Cube Coordinates

```typescript
interface CubeCoordsV2 {
    q: number;  // X-axis
    r: number;  // Y-axis
    s: number;  // Z-axis (where q + r + s = 0)
    // Additional precision fields:
    precision?: number;  // Sub-voxel precision level
}
```

### Conversion Functions

```typescript
/**
 * Convert Orbis 1.0 CubeCoords to Orbis 2.0 format
 */
function cubeCoordsV1ToV2(v1: CubeCoordsV1): CubeCoordsV2 {
    return {
        q: v1.q,
        r: v1.r,
        s: v1.s,
        precision: 0  // Default precision for V1 data
    };
}

/**
 * Convert Orbis 2.0 CubeCoords to Orbis 1.0 format
 * Note: Sub-voxel precision information is lost
 */
function cubeCoordsV2ToV1(v2: CubeCoordsV2): CubeCoordsV1 {
    return {
        q: v2.q,
        r: v2.r,
        s: v2.s
    };
}
```

## Serialization Format Converters

### Little Endian Byte Order

Both Orbis 1.0 and Orbis 2.0 use Little Endian byte order for serialization. This compatibility is maintained across versions.

### Binary Format Structure

#### Orbis 1.0 Binary Format

```
[Header: 64 bytes]
  - specVersion: 8 bytes (UTF-8 string, null-terminated)
  - encodingVersion: 8 bytes (UTF-8 string, null-terminated)
  - generatorVersion: 8 bytes (UTF-8 string, null-terminated)
  - worldSeed: 8 bytes (uint64, Little Endian)
  - hexId: 16 bytes (UTF-8 string, null-terminated)
  - rasterSize: 4 bytes (uint32, Little Endian)
  - subDivN: 4 bytes (uint32, Little Endian)
  - padding: 8 bytes (reserved)

[Delta Array: N * 16 bytes]
  Each delta:
  - h: 4 bytes (float32, Little Endian, optional)
  - t: 4 bytes (float32, Little Endian, optional)
  - m: 4 bytes (float32, Little Endian, optional)
  - s: 2 bytes (uint16, Little Endian, optional)
  - flags: 2 bytes (bitmask indicating which fields are present)
```

#### Orbis 2.0 Binary Format

```
[Header: 96 bytes]
  - specVersion: 8 bytes (UTF-8 string, null-terminated)
  - encodingVersion: 8 bytes (UTF-8 string, null-terminated)
  - generatorVersion: 8 bytes (UTF-8 string, null-terminated)
  - worldSeed: 8 bytes (uint64, Little Endian)
  - hexId: 16 bytes (UTF-8 string, null-terminated)
  - rasterSize: 4 bytes (uint32, Little Endian)
  - subDivN: 4 bytes (uint32, Little Endian)
  - compressionType: 4 bytes (uint32 enum, Little Endian)
  - checksum: 16 bytes (SHA-256 hash, first 16 bytes)
  - padding: 20 bytes (reserved)

[Delta Array: N * 32 bytes]
  Each delta:
  - height: 4 bytes (float32, Little Endian, optional)
  - temperature: 4 bytes (float32, Little Endian, optional)
  - moisture: 4 bytes (float32, Little Endian, optional)
  - biomeId: 4 bytes (uint32, Little Endian, optional)
  - materialId: 4 bytes (uint32, Little Endian, optional)
  - settlement: 2 bytes (uint16, Little Endian, optional)
  - flags: 2 bytes (bitmask indicating which fields are present)
  - timestamp: 8 bytes (uint64, Little Endian, optional)
```

### Conversion Functions

```typescript
/**
 * Convert Orbis 1.0 binary data to Orbis 2.0 format
 */
function convertBinaryV1ToV2(v1Data: ArrayBuffer): ArrayBuffer {
    // Parse V1 header
    const v1Header = parseHeaderV1(v1Data);
    
    // Parse V1 deltas
    const v1Deltas = parseDeltasV1(v1Data);
    
    // Convert to V2 format
    const v2Header: RefinedHexHeaderV2 = {
        specVersion: v1Header.specVersion,
        encodingVersion: v1Header.encodingVersion,
        generatorVersion: v1Header.generatorVersion,
        worldSeed: v1Header.worldSeed,
        hexId: v1Header.hexId,
        rasterSize: v1Header.rasterSize,
        subDivN: v1Header.subDivN,
        compressionType: 0,  // None
        checksum: computeChecksum(v1Data)
    };
    
    const v2Deltas: WorldDeltaV2[] = v1Deltas.map(delta => ({
        height: delta.h,
        temperature: delta.t,
        moisture: delta.m,
        settlement: delta.s,
        description: delta.d
    }));
    
    // Serialize to V2 format
    return serializeV2(v2Header, v2Deltas);
}

/**
 * Convert Orbis 2.0 binary data to Orbis 1.0 format
 * Note: Some information may be lost in the conversion
 */
function convertBinaryV2ToV1(v2Data: ArrayBuffer): ArrayBuffer {
    // Parse V2 header
    const v2Header = parseHeaderV2(v2Data);
    
    // Parse V2 deltas
    const v2Deltas = parseDeltasV2(v2Data);
    
    // Convert to V1 format
    const v1Header: RefinedHexHeaderV1 = {
        specVersion: v2Header.specVersion,
        encodingVersion: v2Header.encodingVersion,
        generatorVersion: v2Header.generatorVersion,
        worldSeed: v2Header.worldSeed,
        hexId: v2Header.hexId,
        rasterSize: v2Header.rasterSize,
        subDivN: v2Header.subDivN
    };
    
    const v1Deltas: WorldDeltaV1[] = v2Deltas.map(delta => ({
        h: delta.height,
        t: delta.temperature,
        m: delta.moisture,
        s: delta.settlement,
        d: delta.description
    }));
    
    // Serialize to V1 format
    return serializeV1(v1Header, v1Deltas);
}
```

## Cross-Platform Compatibility

### Platform-Specific Considerations

#### Endianness

- Both versions use Little Endian for serialization
- On Big Endian platforms, byte swapping is required for all multi-byte values

#### Floating Point Precision

- Orbis 1.0 uses 32-bit floats for delta values
- Orbis 2.0 uses 32-bit floats for delta values (maintained compatibility)
- Both versions expect IEEE 754 floating point format

#### Integer Sizes

| Type | Orbis 1.0 | Orbis 2.0 | Notes |
|------|-----------|-----------|-------|
| uint8 | 1 byte | 1 byte | Compatible |
| uint16 | 2 bytes | 2 bytes | Compatible |
| uint32 | 4 bytes | 4 bytes | Compatible |
| uint64 | 8 bytes | 8 bytes | Compatible |
| int16 | 2 bytes | 2 bytes | Compatible |
| int32 | 4 bytes | 4 bytes | Compatible |

### Platform Testing Matrix

| Platform | Architecture | Endianness | Status |
|----------|--------------|------------|--------|
| Windows x64 | x86_64 | Little Endian | ✓ Supported |
| Windows x86 | x86 | Little Endian | ✓ Supported |
| Linux x64 | x86_64 | Little Endian | ✓ Supported |
| Linux ARM64 | ARM64 | Little Endian | ✓ Supported |
| macOS x64 | x86_64 | Little Endian | ✓ Supported |
| macOS ARM64 | ARM64 | Little Endian | ✓ Supported |
| WebAssembly | Any | Little Endian | ✓ Supported |

## Migration Checklist

### Pre-Migration

- [ ] Backup all existing Orbis 1.0 data
- [ ] Verify Orbis 1.0 data integrity (checksums)
- [ ] Document any custom modifications or extensions
- [ ] Identify any data that uses deprecated or removed features

### Migration Process

- [ ] Run automated conversion script
- [ ] Verify BiomeType enum mappings
- [ ] Verify VoxelMaterial enum mappings
- [ ] Verify WorldDelta field conversions
- [ ] Verify RefinedHexHeader conversions
- [ ] Validate converted data against Orbis 2.0 schema

### Post-Migration

- [ ] Run Orbis 2.0 validation tests
- [ ] Perform spot checks on converted data
- [ ] Verify simulation results match expected behavior
- [ ] Archive original Orbis 1.0 data
- [ ] Update documentation to reflect migration

## Error Handling

### Common Migration Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| `InvalidBiomeType` | Unknown biome ID in source data | Map to default biome or log warning |
| `InvalidMaterialId` | Unknown material ID in source data | Map to default material or log warning |
| `MissingRequiredField` | Required field missing in header | Use default value or reject migration |
| `ChecksumMismatch` | Data corruption detected | Restore from backup and retry |
| `VersionMismatch` | Unexpected version in header | Verify source data format |

### Logging

All migration operations should produce detailed logs including:

- Source file path and version
- Number of records processed
- Number of records with warnings
- Number of records with errors
- Conversion statistics (biome/material distribution)
- Final checksum of converted data

## References

- [Orbis 1.0 Data Contracts](../Orbis%201.0/docs/08-data-contracts.md)
- [Orbis 2.0 Data Types](../docs/specs/00-core-foundation/00-data-types.md)
- [Orbis 1.0 Voxel Fundamentals](../Orbis%201.0/docs/01-voxel-fundamentals.md)
- [Serialization Best Practices](../docs/specs/00-core-foundation/serialization.md)
