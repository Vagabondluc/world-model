# Data Contracts (v1)

## Purpose
Define versioned serialized contracts for refined hex outputs and baked maps.

## Versioning Rules
- `specVersion`: semantic spec version, e.g. `1.0.0`
- `encodingVersion`: binary encoding version, e.g. `1`
- `generatorVersion`: generator build/version string

Readers must reject unsupported `specVersion` major versions.

## TypeScript Contracts

```ts
export type RefinedHexHeader = {
  specVersion: string;       // e.g. "1.0.0"
  encodingVersion: number;   // e.g. 1
  generatorVersion: string;  // build id or semantic version
  worldSeed: number;
  hexId: string;
  rasterSize: number;        // e.g. 64
  subDivN: number;           // sub-hex factor
};
```

```ts
export type BakedMapBundleV1 = {
  header: RefinedHexHeader;
  biomeIndex: Uint8Array;      // len = rasterSize^2, invalid=255
  elevationDeltaF16: Uint16Array; // float16 packed, invalid=NaN
  soilDepthF16: Uint16Array;      // float16 packed, invalid=NaN
  moisture: Uint8Array;        // len = rasterSize^2, invalid=255
  waterMask: Uint8Array;       // len = rasterSize^2
  materialClass?: Uint8Array;  // len = rasterSize^2, invalid=255
};
```

```ts
export type LocalEditDelta = {
  id: string;
  hexId: string;
  timestampUtc: string;
  lifecycle: "ephemeral" | "persistent_local" | "candidate_authority" | "accepted_authority";
  author: string;
  patchType: "height" | "soil" | "water" | "biome" | "material";
  payload: Record<string, unknown>;
};
```

## Compatibility Policy
- Minor version: additive fields only.
- Patch version: no schema shape changes.
- Major version: explicit migration required.
