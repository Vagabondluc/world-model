# Comprehensive Tech Tree With Prerequisites (Draft v1)

## Spec Header
- `Version`: `v0-brainstorm`
- `DependsOn`: [`docs/brainstorm/113-canonical-key-registry.md`, `docs/brainstorm/114-threshold-and-reasoncode-registry.md`]
- `Owns`: [`tech prerequisite graph`, `normalized prereq edges`]
- `Writes`: [`tech dependency edges`]

## Canonical Owner
- `CANONICAL_OWNER`: `docs/brainstorm/tech-tree-comprehensive-v1-prereqs.md`
- `STATUS`: `ACTIVE_BRAINSTORM`

This file adds explicit prerequisite links to every normalized node from `tech-tree-comprehensive-v1.md`.

## Notes
1. This is a deterministic draft for implementation bootstrap, not final balance.
2. Prerequisites are constrained to prior levels except explicit special rules.
3. Governance branch includes intentional political-path constraints.

## Catalog

| ID | Level | Era | Name | Category | Prerequisites |
|---|---:|---|---|---|---|
| tech_l01_001 | 1 | Ancient Era | Pottery | civil |  |
| tech_l01_002 | 1 | Ancient Era | Animal Husbandry | civil |  |
| tech_l01_003 | 1 | Ancient Era | Mining | industry |  |
| tech_l01_004 | 1 | Ancient Era | Sailing | civil |  |
| tech_l01_005 | 1 | Ancient Era | Astrology | science |  |
| tech_l01_006 | 1 | Ancient Era | Irrigation | civil |  |
| tech_l01_007 | 1 | Ancient Era | Writing | science |  |
| tech_l01_008 | 1 | Ancient Era | Archery | civil |  |
| tech_l01_009 | 1 | Ancient Era | Masonry | industry |  |
| tech_l01_010 | 1 | Ancient Era | Bronze Working | civil |  |
| tech_l01_011 | 1 | Ancient Era | Wheel | civil |  |
| tech_l02_001 | 2 | Classical Era | Celestial Navigation | civil | tech_l01_001, tech_l01_007 |
| tech_l02_002 | 2 | Classical Era | Currency | industry | tech_l01_003, tech_l01_007 |
| tech_l02_003 | 2 | Classical Era | Horseback Riding | civil | tech_l01_001, tech_l01_007 |
| tech_l02_004 | 2 | Classical Era | Iron Working | civil | tech_l01_001, tech_l01_007 |
| tech_l02_005 | 2 | Classical Era | Shipbuilding | space | tech_l01_007 |
| tech_l02_006 | 2 | Classical Era | Mathematics | science | tech_l01_005, tech_l01_007 |
| tech_l02_007 | 2 | Classical Era | Construction | industry | tech_l01_003, tech_l01_007 |
| tech_l02_008 | 2 | Classical Era | Engineering | military | tech_l01_007 |
| tech_l03_001 | 3 | Medieval Era | Military Tactics | military | tech_l02_008 |
| tech_l03_002 | 3 | Medieval Era | Buttress | civil | tech_l02_001, tech_l02_008 |
| tech_l03_003 | 3 | Medieval Era | Apprenticeship | space | tech_l02_005, tech_l02_008 |
| tech_l03_004 | 3 | Medieval Era | Stirrups | civil | tech_l02_001, tech_l02_008 |
| tech_l03_005 | 3 | Medieval Era | Machinery | civil | tech_l02_001, tech_l02_008 |
| tech_l03_006 | 3 | Medieval Era | Education | civil | tech_l02_001, tech_l02_008 |
| tech_l03_007 | 3 | Medieval Era | Military Engineering | military | tech_l02_008 |
| tech_l03_008 | 3 | Medieval Era | Castles | civil | tech_l02_001, tech_l02_008 |
| tech_l04_001 | 4 | Renaissance Era | Cartography | civil | tech_l03_002, tech_l03_005 |
| tech_l04_002 | 4 | Renaissance Era | Mass Production | industry | tech_l03_005 |
| tech_l04_003 | 4 | Renaissance Era | Banking | industry | tech_l03_005 |
| tech_l04_004 | 4 | Renaissance Era | Gunpowder | civil | tech_l03_002, tech_l03_005 |
| tech_l04_005 | 4 | Renaissance Era | Printing | civil | tech_l03_002, tech_l03_005 |
| tech_l04_006 | 4 | Renaissance Era | Square Rigging | civil | tech_l03_002, tech_l03_005 |
| tech_l04_007 | 4 | Renaissance Era | Astronomy | science | tech_l03_005 |
| tech_l04_008 | 4 | Renaissance Era | Metal Casting | civil | tech_l03_002, tech_l03_005 |
| tech_l04_009 | 4 | Renaissance Era | Siege Tactics | military | tech_l03_001, tech_l03_005 |
| tech_l05_001 | 5 | Industrial Era | Industrialization | industry | tech_l04_002, tech_l04_003 |
| tech_l05_002 | 5 | Industrial Era | Scientific Theory | science | tech_l04_007, tech_l04_003 |
| tech_l05_003 | 5 | Industrial Era | Ballistics | civil | tech_l04_001, tech_l04_003 |
| tech_l05_004 | 5 | Industrial Era | Military Science | civil | tech_l04_001, tech_l04_003 |
| tech_l05_005 | 5 | Industrial Era | Steam Power | civil | tech_l04_001, tech_l04_003 |
| tech_l05_006 | 5 | Industrial Era | Sanitation | industry | tech_l04_002, tech_l04_003 |
| tech_l05_007 | 5 | Industrial Era | Economics | industry | tech_l04_002, tech_l04_003 |
| tech_l05_008 | 5 | Industrial Era | Rifling | civil | tech_l04_001, tech_l04_003 |
| tech_l06_001 | 6 | Modern Era | Flight | space | tech_l05_002 |
| tech_l06_002 | 6 | Modern Era | Replaceable Parts | civil | tech_l05_003, tech_l05_002 |
| tech_l06_003 | 6 | Modern Era | Steel | civil | tech_l05_003, tech_l05_002 |
| tech_l06_004 | 6 | Modern Era | Refining | industry | tech_l05_001, tech_l05_002 |
| tech_l06_005 | 6 | Modern Era | Electricity | civil | tech_l05_003, tech_l05_002 |
| tech_l06_006 | 6 | Modern Era | Radio | civil | tech_l05_003, tech_l05_002 |
| tech_l06_007 | 6 | Modern Era | Chemistry | civil | tech_l05_003, tech_l05_002 |
| tech_l06_008 | 6 | Modern Era | Combustion | civil | tech_l05_003, tech_l05_002 |
| tech_l06_009 | 6 | Modern Era | Nitrogen Fixation | bio | tech_l06_007, tech_l05_001 |
| tech_l06_010 | 6 | Modern Era | Synthetic Fertilizers | bio | tech_l06_009, tech_l05_006 |
| tech_l07_001 | 7 | Atomic Era | Advanced Flight | space | tech_l06_001, tech_l06_005 |
| tech_l07_002 | 7 | Atomic Era | Rocketry | space | tech_l06_001, tech_l06_005 |
| tech_l07_003 | 7 | Atomic Era | Advanced Ballistics | civil | tech_l06_002, tech_l06_005 |
| tech_l07_004 | 7 | Atomic Era | Combined Arms | civil | tech_l06_002, tech_l06_005 |
| tech_l07_005 | 7 | Atomic Era | Plastics | civil | tech_l06_002, tech_l06_005 |
| tech_l07_006 | 7 | Atomic Era | Computers | science | tech_l06_005 |
| tech_l07_007 | 7 | Atomic Era | Nuclear Fission | civil | tech_l06_002, tech_l06_005 |
| tech_l07_008 | 7 | Atomic Era | Synthetic Materials | civil | tech_l06_002, tech_l06_005 |
| tech_l08_001 | 8 | Information Era | Telecommunications | science | tech_l07_006 |
| tech_l08_002 | 8 | Information Era | Satellites | science | tech_l07_006 |
| tech_l08_003 | 8 | Information Era | Guidance Systems | civil | tech_l07_003, tech_l07_006 |
| tech_l08_004 | 8 | Information Era | Lasers | civil | tech_l07_003, tech_l07_006 |
| tech_l08_005 | 8 | Information Era | Composites | civil | tech_l07_003, tech_l07_006 |
| tech_l08_006 | 8 | Information Era | Stealth Technology | civil | tech_l07_003, tech_l07_006 |
| tech_l08_007 | 8 | Information Era | Robotics | science | tech_l07_006 |
| tech_l08_008 | 8 | Information Era | Nuclear Fusion | civil | tech_l07_003, tech_l07_006 |
| tech_l09_001 | 9 | Stellar Era | Colony Base | space | tech_l08_002 |
| tech_l09_002 | 9 | Stellar Era | Nuclear Drive | space | tech_l08_002 |
| tech_l09_003 | 9 | Stellar Era | Nuclear Missile | military | tech_l08_002 |
| tech_l09_004 | 9 | Stellar Era | Electronic Computer | science | tech_l08_001, tech_l08_002 |
| tech_l09_005 | 9 | Stellar Era | Laser Cannon | military | tech_l08_002 |
| tech_l09_006 | 9 | Stellar Era | Star Base | space | tech_l08_002 |
| tech_l09_007 | 9 | Stellar Era | Nuclear Bomb | military | tech_l08_002 |
| tech_l09_008 | 9 | Stellar Era | Standard Fuel Cells | space | tech_l08_002 |
| tech_l09_009 | 9 | Stellar Era | Laser Rifle | military | tech_l08_002 |
| tech_l09_010 | 9 | Stellar Era | Marine Barracks | military | tech_l08_002 |
| tech_l09_011 | 9 | Stellar Era | Extended Fuel Tanks | civil | tech_l08_003, tech_l08_002 |
| tech_l09_012 | 9 | Stellar Era | Space Scanner | space | tech_l08_002 |
| tech_l09_013 | 9 | Stellar Era | Titanium Armor | military | tech_l08_002 |
| tech_l10_001 | 10 | Astro Engineering Era | Anti-Missile Rockets | military | tech_l09_003, tech_l09_006 |
| tech_l10_002 | 10 | Astro Engineering Era | Colony Ship | space | tech_l09_001, tech_l09_006 |
| tech_l10_003 | 10 | Astro Engineering Era | Hydroponic Farm | bio | tech_l09_006 |
| tech_l10_004 | 10 | Astro Engineering Era | Fighter Bays | civil | tech_l09_011, tech_l09_006 |
| tech_l10_005 | 10 | Astro Engineering Era | Freighters | space | tech_l09_001, tech_l09_006 |
| tech_l10_006 | 10 | Astro Engineering Era | Biospheres | civil | tech_l09_011, tech_l09_006 |
| tech_l10_007 | 10 | Astro Engineering Era | Reinforced Hull | civil | tech_l09_011, tech_l09_006 |
| tech_l10_008 | 10 | Astro Engineering Era | Outpost Ship | space | tech_l09_001, tech_l09_006 |
| tech_l11_001 | 11 | Fusion Era | Automated Factories | civil | tech_l10_004, tech_l10_002 |
| tech_l11_002 | 11 | Fusion Era | Space Academy | space | tech_l10_002 |
| tech_l11_003 | 11 | Fusion Era | Research Laboratory | science | tech_l10_002 |
| tech_l11_004 | 11 | Fusion Era | Fusion Beam | civil | tech_l10_004, tech_l10_002 |
| tech_l11_005 | 11 | Fusion Era | Missile Base | military | tech_l10_001, tech_l10_002 |
| tech_l11_006 | 11 | Fusion Era | Optronic Computer | science | tech_l10_002 |
| tech_l11_007 | 11 | Fusion Era | Fusion Rifle | military | tech_l10_001, tech_l10_002 |
| tech_l11_008 | 11 | Fusion Era | Heavy Armor | military | tech_l10_001, tech_l10_002 |
| tech_l11_009 | 11 | Fusion Era | Dauntless Guidance System | civil | tech_l10_004, tech_l10_002 |
| tech_l12_001 | 12 | Sub-Light Speed Era | Battle Pods | military | tech_l11_005, tech_l11_004 |
| tech_l12_002 | 12 | Sub-Light Speed Era | Fusion Drive | space | tech_l11_002, tech_l11_004 |
| tech_l12_003 | 12 | Sub-Light Speed Era | Deuterium Fuel Cells | space | tech_l11_002, tech_l11_004 |
| tech_l12_004 | 12 | Sub-Light Speed Era | Tachyon Communication | science | tech_l11_003, tech_l11_004 |
| tech_l12_005 | 12 | Sub-Light Speed Era | Ship Shield | space | tech_l11_002, tech_l11_004 |
| tech_l12_006 | 12 | Sub-Light Speed Era | Troop Pods | military | tech_l11_005, tech_l11_004 |
| tech_l12_007 | 12 | Sub-Light Speed Era | Fusion Bomb | military | tech_l11_005, tech_l11_004 |
| tech_l12_008 | 12 | Sub-Light Speed Era | Tritanium Armor | military | tech_l11_005, tech_l11_004 |
| tech_l12_009 | 12 | Sub-Light Speed Era | Tachyon Scanner | space | tech_l11_002, tech_l11_004 |
| tech_l12_010 | 12 | Sub-Light Speed Era | Mass Driver | space | tech_l11_002, tech_l11_004 |
| tech_l12_011 | 12 | Sub-Light Speed Era | Survival Pods | military | tech_l11_005, tech_l11_004 |
| tech_l12_012 | 12 | Sub-Light Speed Era | Augmented Engines | civil | tech_l11_001, tech_l11_004 |
| tech_l12_013 | 12 | Sub-Light Speed Era | Battle Scanner | space | tech_l11_002, tech_l11_004 |
| tech_l12_014 | 12 | Sub-Light Speed Era | ECM Jammer | military | tech_l11_005, tech_l11_004 |
| tech_l13_001 | 13 | Genetic Era | Space Port | space | tech_l12_002 |
| tech_l13_002 | 13 | Genetic Era | Neural Scanner | space | tech_l12_002 |
| tech_l13_003 | 13 | Genetic Era | Cloning Center | bio | tech_l12_002 |
| tech_l13_004 | 13 | Genetic Era | Armor Barracks | military | tech_l12_001, tech_l12_002 |
| tech_l13_005 | 13 | Genetic Era | Scout Lab | science | tech_l12_004, tech_l12_002 |
| tech_l13_006 | 13 | Genetic Era | Soil Enrichment | bio | tech_l12_002 |
| tech_l13_007 | 13 | Genetic Era | Fighter Garrison | military | tech_l12_001, tech_l12_002 |
| tech_l13_008 | 13 | Genetic Era | Security Stations | civil | tech_l12_012, tech_l12_002 |
| tech_l13_009 | 13 | Genetic Era | Death Spores | bio | tech_l12_002 |
| tech_l14_001 | 14 | Eco-Engineering Era | Robo Mining Plant | industry | tech_l13_003 |
| tech_l14_002 | 14 | Eco-Engineering Era | Merculite Missile | military | tech_l13_004, tech_l13_003 |
| tech_l14_003 | 14 | Eco-Engineering Era | Xeno Psychology | bio | tech_l13_003 |
| tech_l14_004 | 14 | Eco-Engineering Era | Anti-Grav Harness | civil | tech_l13_008, tech_l13_003 |
| tech_l14_005 | 14 | Eco-Engineering Era | Battle Station | military | tech_l13_004, tech_l13_003 |
| tech_l14_006 | 14 | Eco-Engineering Era | Pollution Processor | industry | tech_l13_003 |
| tech_l14_007 | 14 | Eco-Engineering Era | Alien Control Center | civil | tech_l13_008, tech_l13_003 |
| tech_l14_008 | 14 | Eco-Engineering Era | Inertial Stabilizer | civil | tech_l13_008, tech_l13_003 |
| tech_l14_009 | 14 | Eco-Engineering Era | Powered Armor | military | tech_l13_004, tech_l13_003 |
| tech_l14_010 | 14 | Eco-Engineering Era | Gyro Destabilizer | civil | tech_l13_008, tech_l13_003 |
| tech_l15_001 | 15 | Ion Age | Fast Missile Racks | military | tech_l14_002, tech_l14_001 |
| tech_l15_002 | 15 | Ion Age | Ion Drive | space | tech_l14_001 |
| tech_l15_003 | 15 | Ion Age | Positronic Computer | science | tech_l14_001 |
| tech_l15_004 | 15 | Ion Age | Telepathic Training | civil | tech_l14_004, tech_l14_001 |
| tech_l15_005 | 15 | Ion Age | Neutron Blaster | military | tech_l14_002, tech_l14_001 |
| tech_l15_006 | 15 | Ion Age | Advanced Damage Control | civil | tech_l14_004, tech_l14_001 |
| tech_l15_007 | 15 | Ion Age | Ion Pulse Cannon | military | tech_l14_002, tech_l14_001 |
| tech_l15_008 | 15 | Ion Age | Planetary Supercomputer | science | tech_l14_001 |
| tech_l15_009 | 15 | Ion Age | Microbiotics | bio | tech_l14_003, tech_l14_001 |
| tech_l15_010 | 15 | Ion Age | Neutron Scanner | space | tech_l14_001 |
| tech_l15_011 | 15 | Ion Age | Planetary Radiation Shield | military | tech_l14_002, tech_l14_001 |
| tech_l15_012 | 15 | Ion Age | Assault Shuttle | civil | tech_l14_004, tech_l14_001 |
| tech_l15_013 | 15 | Ion Age | Shield Capacitor | military | tech_l14_002, tech_l14_001 |
| tech_l15_014 | 15 | Ion Age | Holo Simulator | civil | tech_l14_004, tech_l14_001 |
| tech_l15_015 | 15 | Ion Age | Warp Dissipator | military | tech_l14_002, tech_l14_001 |
| tech_l16_001 | 16 | Terraforming Era | Titan Construction | industry | tech_l15_002 |
| tech_l16_002 | 16 | Terraforming Era | Pulson Missile | military | tech_l15_001, tech_l15_002 |
| tech_l16_003 | 16 | Terraforming Era | Planetary Stock-Exchange | governance | tech_l15_002 |
| tech_l16_004 | 16 | Terraforming Era | Terraforming | bio | tech_l15_009, tech_l15_002 |
| tech_l16_005 | 16 | Terraforming Era | Tractor Beam | civil | tech_l15_004, tech_l15_002 |
| tech_l16_006 | 16 | Terraforming Era | Ground Batteries | civil | tech_l15_004, tech_l15_002 |
| tech_l16_007 | 16 | Terraforming Era | Atmospheric Renewer | civil | tech_l15_004, tech_l15_002 |
| tech_l16_008 | 16 | Terraforming Era | Graviton Beam | civil | tech_l15_004, tech_l15_002 |
| tech_l16_009 | 16 | Terraforming Era | Battleoids | military | tech_l15_001, tech_l15_002 |
| tech_l16_010 | 16 | Terraforming Era | Iridium Fuel Cells | space | tech_l15_002 |
| tech_l16_011 | 16 | Terraforming Era | Planetary Gravity Generator | civil | tech_l15_004, tech_l15_002 |
| tech_l17_001 | 17 | Subspace Era | Recyclotron | civil | tech_l16_005, tech_l16_004 |
| tech_l17_002 | 17 | Subspace Era | Emissions Guidance System | civil | tech_l16_005, tech_l16_004 |
| tech_l17_003 | 17 | Subspace Era | Subterranean Farms | civil | tech_l16_005, tech_l16_004 |
| tech_l17_004 | 17 | Subspace Era | Subspace Communication | space | tech_l16_010, tech_l16_004 |
| tech_l17_005 | 17 | Subspace Era | Stealth Field | civil | tech_l16_005, tech_l16_004 |
| tech_l17_006 | 17 | Subspace Era | Automated Repair Unit | industry | tech_l16_001, tech_l16_004 |
| tech_l17_007 | 17 | Subspace Era | Rangemaster Target Unit | civil | tech_l16_005, tech_l16_004 |
| tech_l17_008 | 17 | Subspace Era | Weather Controller | civil | tech_l16_005, tech_l16_004 |
| tech_l17_009 | 17 | Subspace Era | Jump Gate | space | tech_l16_010, tech_l16_004 |
| tech_l17_010 | 17 | Subspace Era | Personal Shield | military | tech_l16_002, tech_l16_004 |
| tech_l17_011 | 17 | Subspace Era | Artificial Planet Construction | industry | tech_l16_001, tech_l16_004 |
| tech_l17_012 | 17 | Subspace Era | Cyber Security Link | science | tech_l16_004 |
| tech_l17_013 | 17 | Subspace Era | Stealth Suit | civil | tech_l16_005, tech_l16_004 |
| tech_l18_001 | 18 | Anti-Matter Age | Robotic Factory | industry | tech_l17_006, tech_l17_009 |
| tech_l18_002 | 18 | Anti-Matter Age | Anti-Matter Drive | space | tech_l17_004, tech_l17_009 |
| tech_l18_003 | 18 | Anti-Matter Age | Nano Disassemblers | civil | tech_l17_001, tech_l17_009 |
| tech_l18_004 | 18 | Anti-Matter Age | Astro University | civil | tech_l17_001, tech_l17_009 |
| tech_l18_005 | 18 | Anti-Matter Age | Phasor | military | tech_l17_010, tech_l17_009 |
| tech_l18_006 | 18 | Anti-Matter Age | Pulsar | civil | tech_l17_001, tech_l17_009 |
| tech_l18_007 | 18 | Anti-Matter Age | Bomber Bays | military | tech_l17_010, tech_l17_009 |
| tech_l18_008 | 18 | Anti-Matter Age | Anti-Matter Torpedo | military | tech_l17_010, tech_l17_009 |
| tech_l18_009 | 18 | Anti-Matter Age | Microlite Construction | industry | tech_l17_006, tech_l17_009 |
| tech_l18_010 | 18 | Anti-Matter Age | Phasor Rifle | military | tech_l17_010, tech_l17_009 |
| tech_l18_011 | 18 | Anti-Matter Age | Warp Field Interdicter | military | tech_l17_010, tech_l17_009 |
| tech_l18_012 | 18 | Anti-Matter Age | Anti-Matter Bomb | military | tech_l17_010, tech_l17_009 |
| tech_l18_013 | 18 | Anti-Matter Age | Zortrium Armor | military | tech_l17_010, tech_l17_009 |
| tech_l18_014 | 18 | Anti-Matter Age | Multi-Phased Shields | military | tech_l17_010, tech_l17_009 |
| tech_l18_015 | 18 | Anti-Matter Age | Lightning Field | civil | tech_l17_001, tech_l17_009 |
| tech_l19_001 | 19 | Quantum Era | Transporters | space | tech_l18_002 |
| tech_l19_002 | 19 | Quantum Era | Cybertronic Computer | science | tech_l18_002 |
| tech_l19_003 | 19 | Quantum Era | Psionics | science | tech_l18_002 |
| tech_l19_004 | 19 | Quantum Era | Food Replicators | civil | tech_l18_003, tech_l18_002 |
| tech_l19_005 | 19 | Quantum Era | Autolab | science | tech_l18_002 |
| tech_l19_006 | 19 | Quantum Era | Heightened Intelligence | civil | tech_l18_003, tech_l18_002 |
| tech_l19_007 | 19 | Quantum Era | Multi-Wave ECM Jammer | military | tech_l18_005, tech_l18_002 |
| tech_l19_008 | 19 | Quantum Era | Structural Analyzer | civil | tech_l18_003, tech_l18_002 |
| tech_l19_009 | 19 | Quantum Era | Gauss Cannon | military | tech_l18_005, tech_l18_002 |
| tech_l20_001 | 20 | Android Era | Deep Core Mine | civil | tech_l19_004, tech_l19_001 |
| tech_l20_002 | 20 | Android Era | High Energy Focus | civil | tech_l19_004, tech_l19_001 |
| tech_l20_003 | 20 | Android Era | Android Farmers | industry | tech_l19_001 |
| tech_l20_004 | 20 | Android Era | Plasma Cannon | military | tech_l19_007, tech_l19_001 |
| tech_l20_005 | 20 | Android Era | Cloaking Device | civil | tech_l19_004, tech_l19_001 |
| tech_l20_006 | 20 | Android Era | Core Waste Dumps | civil | tech_l19_004, tech_l19_001 |
| tech_l20_007 | 20 | Android Era | Energy Absorber | civil | tech_l19_004, tech_l19_001 |
| tech_l20_008 | 20 | Android Era | Android Workers | industry | tech_l19_001 |
| tech_l20_009 | 20 | Android Era | Plasma Rifle | military | tech_l19_007, tech_l19_001 |
| tech_l20_010 | 20 | Android Era | Stasis Field | civil | tech_l19_004, tech_l19_001 |
| tech_l20_011 | 20 | Android Era | Megafluxers | civil | tech_l19_004, tech_l19_001 |
| tech_l20_012 | 20 | Android Era | Android Scientists | civil | tech_l19_004, tech_l19_001 |
| tech_l20_013 | 20 | Android Era | Plasma Web | military | tech_l19_007, tech_l19_001 |
| tech_l20_014 | 20 | Android Era | Hard Shields | military | tech_l19_007, tech_l19_001 |
| tech_l21_001 | 21 | Galactic Governance Era | Proton Torpedo | military | tech_l20_004, tech_l20_005 |
| tech_l21_002 | 21 | Galactic Governance Era | Zeon Missile | military | tech_l20_004, tech_l20_005 |
| tech_l21_003 | 21 | Galactic Governance Era | Confederation | governance | tech_l20_014, tech_l20_012 |
| tech_l21_004 | 21 | Galactic Governance Era | Virtual Reality Network | civil | tech_l20_001, tech_l20_005 |
| tech_l21_005 | 21 | Galactic Governance Era | Bio Terminator | civil | tech_l20_001, tech_l20_005 |
| tech_l21_006 | 21 | Galactic Governance Era | Disruptor Cannon | military | tech_l20_004, tech_l20_005 |
| tech_l21_007 | 21 | Galactic Governance Era | Hyper Drive | space | tech_l20_005 |
| tech_l21_008 | 21 | Galactic Governance Era | Neutronium Armor | military | tech_l20_004, tech_l20_005 |
| tech_l21_009 | 21 | Galactic Governance Era | Imperium | governance | tech_l20_014, tech_l20_012 |
| tech_l21_010 | 21 | Galactic Governance Era | Galactic Cybernet | governance | tech_l20_005 |
| tech_l21_011 | 21 | Galactic Governance Era | Universal Antidote | bio | tech_l20_005 |
| tech_l21_012 | 21 | Galactic Governance Era | Dimensional Portal | civil | tech_l20_001, tech_l20_005 |
| tech_l21_013 | 21 | Galactic Governance Era | Planetary Flux Shield | military | tech_l20_004, tech_l20_005 |
| tech_l21_014 | 21 | Galactic Governance Era | Hyper-X Capacitor | civil | tech_l20_001, tech_l20_005 |
| tech_l21_015 | 21 | Galactic Governance Era | Uridium Fuel Cells | space | tech_l20_005 |
| tech_l21_016 | 21 | Galactic Governance Era | Federation | governance | tech_l20_014, tech_l20_012 |
| tech_l21_017 | 21 | Galactic Governance Era | Wide Area Jammer | military | tech_l20_004, tech_l20_005 |
| tech_l21_018 | 21 | Galactic Governance Era | Galactic Unification | governance | tech_l21_003, tech_l21_009, tech_l21_016 |
| tech_l22_001 | 22 | Hyper-Advanced Era | Star Fortress | space | tech_l21_007 |
| tech_l22_002 | 22 | Hyper-Advanced Era | Galactic Currency Exchange | governance | tech_l21_003, tech_l21_007 |
| tech_l22_003 | 22 | Hyper-Advanced Era | Pleasure Dome | civil | tech_l21_004, tech_l21_007 |
| tech_l22_004 | 22 | Hyper-Advanced Era | Hyperspace Communication | space | tech_l21_007 |
| tech_l22_005 | 22 | Hyper-Advanced Era | Advanced City Planning | industry | tech_l21_007 |
| tech_l22_006 | 22 | Hyper-Advanced Era | Moleculartronic Computer | science | tech_l21_007 |
| tech_l22_007 | 22 | Hyper-Advanced Era | Sensors | science | tech_l21_007 |
| tech_l22_008 | 22 | Hyper-Advanced Era | Heavy Fighters | military | tech_l21_001, tech_l21_007 |
| tech_l22_009 | 22 | Hyper-Advanced Era | Achilles Targeting Unit | civil | tech_l21_004, tech_l21_007 |
| tech_l22_010 | 22 | Hyper-Advanced Era | Mauler Device | military | tech_l21_001, tech_l21_007 |
| tech_l23_001 | 23 | Trans-Dimensional Era | Doom Star Construction | space | tech_l22_001 |
| tech_l23_002 | 23 | Trans-Dimensional Era | Biomorphic Fungi | bio | tech_l22_001 |
| tech_l23_003 | 23 | Trans-Dimensional Era | Displacement Device | civil | tech_l22_003, tech_l22_001 |
| tech_l23_004 | 23 | Trans-Dimensional Era | Artemis System Net | civil | tech_l22_003, tech_l22_001 |
| tech_l23_005 | 23 | Trans-Dimensional Era | Gaia Transformation | bio | tech_l22_001 |
| tech_l23_006 | 23 | Trans-Dimensional Era | Subspace Teleporter | space | tech_l22_001 |
| tech_l23_007 | 23 | Trans-Dimensional Era | Evolutionary Mutation | bio | tech_l22_001 |
| tech_l23_008 | 23 | Trans-Dimensional Era | Inertial Nullifier | civil | tech_l22_003, tech_l22_001 |
| tech_l24_001 | 24 | Reality Warping Era | Interphased Drive | space | tech_l23_001, tech_l23_006 |
| tech_l24_002 | 24 | Reality Warping Era | Thorium Fuel Cells | space | tech_l23_001, tech_l23_006 |
| tech_l24_003 | 24 | Reality Warping Era | Plasma Torpedo | military | tech_l23_006 |
| tech_l24_004 | 24 | Reality Warping Era | Adamantium Armor | military | tech_l23_006 |
| tech_l24_005 | 24 | Reality Warping Era | Neutronium Bomb | military | tech_l23_006 |
| tech_l25_001 | 25 | Time-Space Mastery Era | Time Warp Facilitator | civil | tech_l24_001, tech_l23_003 |
| tech_l25_002 | 25 | Time-Space Mastery Era | Stellar Converter | civil | tech_l23_001, tech_l24_005 |
| tech_l25_003 | 25 | Time-Space Mastery Era | Planetary Barrier Shield | military | tech_l24_003, tech_l24_001 |
| tech_l25_004 | 25 | Time-Space Mastery Era | Star Gate | space | tech_l24_001 |
| tech_l25_005 | 25 | Time-Space Mastery Era | Phasing Cloak | civil | tech_l24_001, tech_l20_005 |


## Unit Policy
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

## Reason Code Integration
- See shared clause in `docs/brainstorm/000-brainstorm-shared-clauses.md`.

