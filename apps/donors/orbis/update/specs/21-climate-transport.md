# 🔒 CLIMATE TRANSPORT SPEC v1.0

SpecTier: Contract

## Spec Header
- `Version`: `v1`
- `DependsOn`: `[]`
- `Owns`: `[]`
- `Writes`: `[]`

---

(Deterministic • Gameplay-Grade • Wind + Moisture + Rain Shadow)

This replaces "precipitation curve" with a **cheap but causal** atmosphere model.

---

## 0️⃣ Goals

Must:

* Produce equatorial wet belts, subtropical deserts, temperate variability, polar dryness
* Create **rain shadows** behind mountains
* Be deterministic and fast (O(N))
* Support seasons (tilt) without chaos
* Feed biomes + hydrology inputs

---

## 1️⃣ Inputs

Reads only:

```
Cell graph (neighbors)
Latitude/Longitude or Vec3
Elevation (final or tectonic+impacts baseline)
Sea mask + sea level
Planet params: radius, axialTilt, solarStrength, rotationDir
Optional: oceanHeatInertia scalar
Seed (only for stable noise fields; not RNG)
```

Outputs:

```
TemperatureLayer
MoistureLayer (precip potential)
PrecipitationLayer
WindVectorLayer
Cloudiness(optional)
```

---

## 2️⃣ Base Temperature Model

### 2.1 Insolation by Latitude + Tilt

For each cell at latitude φ (radians):

```
seasonAngle = 2π * seasonT   // seasonT ∈ [0,1)
effectiveLat = φ - axialTilt * cos(seasonAngle) * hemisphereSign
insolation = clamp01( cos(effectiveLat) )
```

(Any monotonic "high at equator, low at poles" function is allowed as long as frozen.)

### 2.2 Distance to sun + strength

```
T_base = solarStrength * insolation
```

### 2.3 Altitude lapse rate

```
T = T_base - lapseRate * max(0, elevation - seaLevel)
```

### 2.4 Ocean thermal buffering (cheap)

If ocean cell:

```
T = mix(T, T_base, oceanHeatInertia)  // damp extremes
```

### 2.5 Small-scale variation (deterministic noise)

Add a precomputed noise field:

```
T += tempNoiseAmplitude * noise(cellId, seedTemp)
```

No runtime RNG.

---

## 3️⃣ Wind Bands (Deterministic Vector Field)

We use 3 bands per hemisphere (Hadley/Ferrel/Polar proxy).

Let `lat01 = abs(φ) / (π/2)`.

Band edges (Locked PPM relative to equator-to-pole distance):

* **Hadley**: 0 - 333,333 PPM (~0°–30°)
* **Ferrel**: 333,333 - 666,667 PPM (~30°–60°)
* **Polar**: 666,667 - 1,000,000 PPM (~60°–90°)

Wind direction (east/west) by band:

* Hadley: trades (east→west)
* Ferrel: westerlies (west→east)
* Polar: easterlies (east→west)

Implementation: create a tangential wind vector on sphere using local east direction.

```
windDirSign = bandSign(lat01) * rotationDir
windVec = eastTangent(cellPos) * windDirSign
windVec *= windStrength(lat01)
```

Add deterministic curl noise for variation:

```
windVec = normalize( windVec + windNoiseAmp * curlNoise(cellPos, seedWind) )
```

---

## 4️⃣ Moisture Sources

Initialize moisture:

```
M0 = 1.0 for ocean cells
M0 = soilMoistureBaseline for land (small, e.g. 0.05)
```

Optional: ice cells reduce evaporation.

---

## 5️⃣ Moisture Advection (Core Transport)

We move moisture along wind.

We do **K** advection steps (locked small integer, e.g. K=12–24).

At each step:

For each cell, push a fraction of moisture to the neighbor most aligned with wind:

```
next = argmax_neighbor dot(normalize(windVec), dirToNeighbor)
transfer = advectRate * M[cell]
M_next += transfer
M[cell] -= transfer
```

Deterministic tie-break: lowest neighbor cellId.

This is fast and stable.

---

## 6️⃣ Orographic Rain & Rain Shadow

When moist air climbs, it rains.

For transport along edge cell→next:

Compute elevation delta:

```
dh = elevation[next] - elevation[cell]
```

If dh > 0:

```
rain = orographicK * dh * M_transfer
M_next -= rain
P[next] += rain
```

If dh <= 0: no forced rain (but see convection).

This automatically creates:

* Wet windward coasts
* Dry leeward interiors

---

## 7️⃣ Convection / Equatorial Uplift (Cheap)

Independent of mountains, warm moist air rains.

For each cell:

```
convection = convK * clamp01(T) * M[cell]
P[cell] += convection
M[cell] -= convection
```

Optionally amplify near equator:

```
convection *= equatorBoost(φ)
```

---

## 8️⃣ Subtropical Desert Belt (Structural Feature)

To produce dry belts around ~25–35°:

After advection + convection, apply a deterministic sink by latitude band:

```
drySink = desertK * desertBandMask(lat01)
M[cell] *= (1 - drySink)
```

This yields classic desert latitudes without hand-painted curves.

---

## 9️⃣ Final Precipitation & Humidity Outputs

Precipitation already accumulated as `P[cell]`.

Normalize:

```
P = normalizeTo01(P)   // via percentile clamp to avoid extreme spikes
humidity = clamp01(M)  // remaining moisture after rain
```

---

## 🔟 Ice & Snow Rules (for water/biomes)

If:

```
T < freezeThreshold
```

Then:

* Ocean becomes ice mask
* Precip becomes snow accumulator (optional)
* Evaporation reduced

This remains deterministic.

---

## 1️⃣1️⃣ Seasons (Optional but Defined)

If seasons enabled:

* Run climate at N seasonal samples (e.g. 4)
* Average outputs:

```
T_mean = avg(T_s)
P_mean = avg(P_s)
T_range = max(T_s) - min(T_s)
```

Biomes can use mean + range.

Hydrology uses P_mean (or wet-season P if you want monsoons later).

---

## 1️⃣2️⃣ Determinism Contract

* No RNG at runtime
* Only seeded noise fields (fixed seed derivation)
* Fixed iteration counts (K steps)
* Stable neighbor ordering with cellId tie-breaks
* Percentile normalization uses deterministic sorting

Given same inputs → identical climate maps.

---

## 1️⃣3️⃣ Complexity

O(N * K) with K small.

Works for 10k–100k cells.

---

## 1️⃣4️⃣ Integration Points

Outputs feed:

* Biome classification (T_mean, P_mean, freeze mask)
* Hydrology precipitation input
* Resource layer (timber, fertility, solar/wind)
* Surface age effects (optional: erosion weighting by precipitation)

## Compliance Vector (v1)
Input:
- deterministic fixture input for this contract under canonical bounds.

Expected:
- deterministic output for identical input and evaluation order.
- no authority drift, no out-of-range values, and stable reason-code behavior where applicable.
