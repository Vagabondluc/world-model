# Magnetosphere and Dynamo Spec (v1)

## Purpose
Define an optional but deterministic planetary field layer for aurora/radiation/space-weather effects that can couple to climate and habitability.

## Core Principle
Magnetosphere is an emergent field model, not a binary toggle.

## Inputs
- Rotation rate
- Core thermal flux proxy
- Interior composition proxies
- Optional impact genesis multipliers
- External forcing profile (stellar wind phase/intensity)

## Canonical State
```ts
type MagnetosphereState = {
  dipoleAxis: [number, number, number];
  dipoleStrength: number;
  stormIndex: number;      // 0..1
  standoffRadius: number;
  auroraLatDeg: number;
  auroraWidthDeg: number;
};
```

## Sampling Contract
Given `(position, time, state)`, return:
- `auroraIntensity01`
- `radiationIndex01`
- `shieldingIndex01`

Sampling must be deterministic and continuous in time.

## Coupling Rules (Optional)
- Elevated radiation can modulate ecology/habitability tags.
- Aurora intensity can drive visual overlays and event systems.
- Long-term shielding index can influence erosion/climate modifiers.

## Persistence Rule
- Store long-lived field parameters.
- Derive transient weather-like outputs from sampled time functions.

## Cross-Doc Dependencies
- `docs/11-gemini-crosswalk.md`
- `docs/04-multi-scale-lod-model.md`
- `docs/08-data-contracts.md`
