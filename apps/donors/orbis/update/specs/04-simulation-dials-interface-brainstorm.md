# Simulation Dials Interface Brainstorm (ASCII Mockups)

Goal: expose all simulation values across multiple operator screens, with clear authority boundaries and safe apply workflows.

Legend:
- `A` = authoritative simulation parameter
- `V` = view/projection-only parameter
- `!` = validity warning

## Global Frame (used by all screens)

```text
+--------------------------------------------------------------------------------------------------+
| ORBIS CONTROL SURFACE | Seed: 9837421 | Mode: gameplay_accelerated | Tick: 1,224,110 | RUNNING |
+----------------------+-----------------------------------------------------------+---------------+
| Domains              | Main Panel                                                | Health/Explain|
|----------------------|-----------------------------------------------------------|---------------|
| > Global Run         |                                                           | VALIDITY      |
|   Time & Scheduler   |                                                           | - CLIMATE OK  |
|   Planet & Orbit     |                                                           | - HYDRO OK    |
|   ...                |                                                           | - EROSION !   |
|                      |                                                           | REASON CODES  |
|                      |                                                           | EV_* / IN_*   |
+----------------------+-----------------------------------------------------------+---------------+
| Staged Changes: [3]  [Preview Impact] [Apply] [Revert] [Save Param Pack] [Run Benchmark]      |
+--------------------------------------------------------------------------------------------------+
```

## 1) Global Run

```text
+------------------------------------- GLOBAL RUN -------------------------------------+
| A Seed..................... [ 9837421 ]  [Re-seed]                                  |
| A Spec Mode................ (o) strict_science  (x) gameplay_accelerated            |
| A Tick Rate................ [====|-----] 4x                                          |
| A Pause / Step............. [Pause] [Step 1] [Step 10] [Step 100]                   |
| A Replay................... [Record ON] [Play] [Scrub: 1223000 -> 1224110]          |
| A Determinism Digest....... 9A7F-CC11-4E2B [Copy]                                   |
|                                                                                      |
| [Load Snapshot] [Save Snapshot] [Reset World] [Open Benchmarks]                     |
+--------------------------------------------------------------------------------------+
```

## 2) Time & Scheduler

```text
+--------------------------------- TIME & SCHEDULER ----------------------------------+
| A Domain Clock Table                                                               |
| +-----------+-----------+-----------+-----------+----------------------------------+ |
| | Domain    | dt        | phase     | mode      | notes                            | |
| | climate   | 1 month   | 10        | Simulate  | seasonal mode                    | |
| | hydrology | 1 year    | 20        | Regen     | ABCD 2-bucket                    | |
| | erosion   | 5 years   | 30        | Regen     | stream power                     | |
| +-----------+-----------+-----------+-----------+----------------------------------+ |
| A Catch-up Budget........ [ 5000 ticks ]                                            |
| A Max Per-Step Delta..... [ 5 K ]                                                   |
| A Phase Ordering.......... [Edit Graph] [Validate DAG]                              |
+--------------------------------------------------------------------------------------+
```

## 3) Planet & Orbit

```text
+---------------------------------- PLANET & ORBIT -----------------------------------+
| A Solar Luminosity........ [===|------] 1.00                                         |
| A Orbital Distance........ [===|------] 1.00 AU                                      |
| A Eccentricity............ [=|--------] 0.0167                                       |
| A Obliquity............... [==|-------] 23.4 deg                                     |
| A Rotation Rate........... [====|-----] 1.00x                                        |
| A Gravity Scalar.......... [===|------] 1.00g                                        |
| A Sea Level Baseline...... [==|-------] 0 m                                          |
| Presets: [Earthlike] [Arid] [Snowball-Prone] [Runaway-Warm]                         |
+--------------------------------------------------------------------------------------+
```

## 4) Magnetosphere

```text
+--------------------------------- MAGNETOSPHERE -------------------------------------+
| A Field Strength.......... [==|-------] 0.82                                         |
| A Dynamo Stability........ [===|------] 0.71                                         |
| A Radiation Proxy Curve... [LUT: shield_v1] [Edit]                                  |
| A Atmosphere Coupling..... [toggle] reserved_v2                                     |
|                                                                                      |
| Live: radiationStress01 = 0.23                                                      |
| Explain: 1/sqrt(B) proxy -> stress clamp applied                                    |
+--------------------------------------------------------------------------------------+
```

## 5) Climate Solver

```text
+----------------------------------- CLIMATE ------------------------------------------+
| A Level................... [ L1 | L2 | L3 | L4 ]  (x) L4                            |
| A sigmaTildePPM........... [====|-----] 620000                                       |
| A diffusionDPPM........... [===|------] 600000                                       |
| A alphaIcePPM............. [======|---] 700000                                       |
| A alphaWaterPPM........... [==|-------] 300000                                       |
| A Seasonal Mode........... (x) ON  yearPhasePPM [====|-----]                         |
| A dtPPM................... [=|--------] 12000                                        |
| ! Validity................ STABLE_DELTA_OK                                           |
| [Run 12-month sweep] [Show zonal chart] [Open test vectors]                          |
+--------------------------------------------------------------------------------------+
```

## 6) Hydrology

```text
+---------------------------------- HYDROLOGY ----------------------------------------+
| A soilSaturation_b........ [===|------] 0.65                                         |
| A rechargeRatio_c......... [==|-------] 0.30                                         |
| A baseflowRate_d.......... [=|--------] 0.10                                         |
| A mouthCount.............. [ 256 ]                                                   |
| A riverMinFlowPPM......... [==|-------] 120000                                       |
| A lakeMinFlowPPM.......... [==|-------] 150000                                       |
| A deltaSplitChancePPM..... [=|--------] 80000                                        |
| Live: Soil=0.44  Ground=0.29  Baseflow=0.11                                          |
+--------------------------------------------------------------------------------------+
```

## 7) Erosion & Geomorph

```text
+----------------------------------- EROSION ------------------------------------------+
| A K_RIVER_PPM............. [==|-------] 50000                                        |
| A K_DIFF_PPM.............. [=|--------] 10000                                        |
| A Deposition Rate......... [==|-------] 200000                                       |
| A Lithology tau_c table... [Soft 5k] [Sed 50k] [Met 500k] [Ign 800k] [Edit]         |
| A Slope Threshold......... [=|--------] 5000                                         |
| Live: StreamPower=132000  Excess=82000  Incision=4 cm                                |
+--------------------------------------------------------------------------------------+
```

## 8) Carbon & Geochem

```text
+----------------------------------- CARBON -------------------------------------------+
| A Parameter Pack.......... (o) strict_science  (x) gameplay_accelerated              |
| A kOutgas................. [==|-------] 0.012                                         |
| A kWeath.................. [==|-------] 0.010                                         |
| A Weathering Ea........... [===|------] 38250 J/mol                                  |
| A Jitter Guard............ [x] maxDeltaClamp  [x] smoothing                          |
| Live: co2_ppm=6420  sink=0.008  source=0.011                                          |
+--------------------------------------------------------------------------------------+
```

## 9) Biome System

```text
+------------------------------------ BIOMES ------------------------------------------+
| A Temp/Precip thresholds.. [Open matrix editor]                                      |
| A Hysteresis Margins...... tempMargin [1.5 C]  precipMargin [0.05]                   |
| A Entry/Exit Table........ [per-biome Schmitt table] [Edit]                          |
| A Overrides............... [x] snowball  [x] river corridor                          |
| Live: desert->grassland blocked (margin unmet)                                       |
+--------------------------------------------------------------------------------------+
```

## 10) Ecology & Population

```text
+------------------------------ ECOLOGY & POPULATION ----------------------------------+
| A NPP Benchmarks............ [Open table]                                            |
| A NPP->Biomass Ratio........ [ 2.5x ]                                                |
| A Trophic Efficiency........ P->H 0.1 | H->C 0.1 | C->A 0.1                          |
| A Carrying Capacity Link.... [x] derive K from NPP each epoch                        |
| A Predation Damping......... [==|-------] 0.20                                       |
| A Extinction Threshold....... [ 0.01 for 3 epochs ]                                  |
| Live: K=0.73  P_total=0.68  stress=0.11                                              |
+--------------------------------------------------------------------------------------+
```

## 11) Civilization & Behavior

```text
+------------------------------ CIVILIZATION & BEHAVIOR -------------------------------+
| A Settlement Weights........ food 0.4 | water 0.3 | trade 0.2 | resource 0.1         |
| A Movement Costs............ biome mult [Edit]  slope penalty [Edit]                 |
| A Need Weights.............. Energy/Safety/Social/... [Open panel]                   |
| A Utility Coefficients...... action scoring table [Edit]                             |
| Live: top city candidates [#120, #992, #451]                                         |
+--------------------------------------------------------------------------------------+
```

## 12) Projection / View Overlays

```text
+------------------------------ PROJECTION / OVERLAYS ---------------------------------+
| V Stratum Label Strength.... [===|------]                                            |
| V Plane Overlay............. Material | Feywild | Shadowfell                         |
| V Overlay Intensity......... [==|-------]                                            |
|                                                                                      |
| [NON-AUTHORITATIVE PANEL]                                                             |
| This screen cannot mutate climate/hydro/geo state.                                   |
+--------------------------------------------------------------------------------------+
```

## 13) Numerics & Determinism

```text
+------------------------------ NUMERICS & DETERMINISM --------------------------------+
| A Fixed-Point Scales........ PPM=1e6  Temp=mK  Elev=cm                               |
| A Rounding Policy........... divFloor64 / mulPPM32 / clampPPM                        |
| A Saturation Policy......... int32 sat ON  int64 sat ON                               |
| A Cross-Platform Vectors.... [Run climate vectors] [Run erosion vectors]             |
| Result: PASS 42/42                                                               [OK] |
+--------------------------------------------------------------------------------------+
```

## 14) Benchmarks & Scenarios

```text
+------------------------------- BENCHMARKS & SCENARIOS -------------------------------+
| Scenario........... [scenario_snowball_01 v1.0.0]                                    |
| Mode............... [gameplay_accelerated]                                           |
| Time Limit......... [5000 ticks]                                                     |
| [Run] [Run Batch] [Compare Last 3 Runs]                                              |
|--------------------------------------------------------------------------------------|
| Status: FAILED @ tick 2130                                                            |
| fail_code: VOLCANIC_OUTGASSING_TOO_SLOW                                               |
| Metrics: ice_cover=100, co2=8200, temp=248K                                           |
+--------------------------------------------------------------------------------------+
```

## 15) Telemetry & Explainability

```text
+------------------------------ TELEMETRY & EXPLAIN -----------------------------------+
| Stream Filter........ [ONBOARDING|SIM|VALIDITY|BENCHMARK]                            |
|--------------------------------------------------------------------------------------|
| 12:40:03 ONBOARDING_GATE_EVALUATED step=climate_03 pass=false reason=GATE_METRIC... |
| 12:40:12 BENCHMARK_RUN scenario=venus_01 status=FAILED reason=NUMERIC_RUNAWAY       |
| 12:40:15 VALIDITY domain=erosion flag=SATURATED                                       |
|--------------------------------------------------------------------------------------|
| [Export JSONL] [Copy reason codes] [Open source metric]                               |
+--------------------------------------------------------------------------------------+
```

## 16) Save/Load & Parameter Packs

```text
+------------------------------ SAVE/LOAD & PARAM PACKS --------------------------------+
| Snapshots: [autosave_120] [pre_snowball_test] [post_tuning]                           |
| [Load] [Save New] [Diff] [Delete]                                                     |
|--------------------------------------------------------------------------------------|
| Param Packs                                                                           |
| - climate_strict_v1      source=earth      version=1.2                                |
| - climate_gameplay_v3    source=gameplay   version=3.0                                |
| - hydro_abcd_v2          source=fitted     version=2.1                                |
| [Apply Pack] [Clone Pack] [Lock Pack]                                                 |
+--------------------------------------------------------------------------------------+
```

