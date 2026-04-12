# Make_a_settlement.txt — ASCII Wireframe

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


```
┌─────────────────────────────────────────────────────────────────────────────┐
│ EXTENDED SETTLEMENT GENERATOR                                       [?] [×] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────┐    │
│ │ ○ Procedural (seed-based)    ○ AI-Assisted                           │    │
│ └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ ┌─── Basic Parameters ─────────────────────────────────────────────────┐    │
│ │                                                                       │    │
│ │ Settlement Name: [_______________________________________________]    │    │
│ │                                                                       │    │
│ │ Settlement Type: [Fortified City ▼]                                  │    │
│ │                                                                       │    │
│ │ Civilization Level: [Advanced ▼]                                     │    │
│ │                                                                       │    │
│ │ Seed: [__________] [🎲 Random]                                       │    │
│ │                                                                       │    │
│ └───────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ ┌─── Output Sections (9 total) ────────────────────────────────────────┐    │
│ │ ☑ Population & Demographics                                          │    │
│ │ ☑ History & Origins                                                  │    │
│ │ ☑ Economy & Resources                                                │    │
│ │ ☑ Government & Law                                                   │    │
│ │ ☑ Key Locations                                                      │    │
│ │ ☑ Notable NPCs                                                       │    │
│ │ ☑ Everyday Life (traditions, mores, occupations)                     │    │
│ │ ☑ Challenges & Conflicts (internal disputes, external threats)       │    │
│ │ ☑ Hooks & Adventure Seeds                                            │    │
│ └───────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ ┌─── Everyday Life Details ────────────────────────────────────────────┐    │
│ │ ☑ Include local traditions                                           │    │
│ │ ☑ Include cultural mores                                             │    │
│ │ ☑ Include common occupations                                         │    │
│ │ ☑ Include festivals/holidays                                         │    │
│ │                                                                       │    │
│ │ Depth: ○ Brief  ● Standard  ○ Detailed                               │    │
│ └───────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│ ┌─── Challenges & Conflicts Configuration ─────────────────────────────┐    │
│ │ Internal Disputes:                                                    │    │
│ │   ☑ Political factions    ☑ Social tensions    ☐ Economic struggles  │    │
│ │                                                                       │    │
│ │ External Threats:                                                     │    │
│ │   ☑ Military (specify): [Orc raiders]                                │    │
│ │   ☐ Environmental        ☑ Supernatural                              │    │
│ │                                                                       │    │
│ │ Number of Conflicts: [3] (1-8)                                        │    │
│ └───────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│                [Generate Settlement]  [Clear]  [Export ▼]                    │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ ▼ Settlement Preview                                                         │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │ # STONEWATCH                                                           │  │
│ │                                                                         │  │
│ │ ## Population & Demographics                                           │  │
│ │ Population: 8,500. Primarily human (70%), dwarf (20%), halfling (8%)  │  │
│ │                                                                         │  │
│ │ ## Everyday Life                                                       │  │
│ │ **Traditions**: Weekly market day on Sixthday; bell tower chimes at   │  │
│ │ dawn and dusk mark work hours. Apprentices wear colored sashes.       │  │
│ │                                                                         │  │
│ │ **Cultural Mores**: Direct eye contact required during trade deals;   │  │
│ │ removing one's helmet indoors is sign of respect. Military veterans   │  │
│ │ given priority seating in taverns.                                    │  │
│ │                                                                         │  │
│ │ **Occupations**: Stonecutters (15%), miners (20%), blacksmiths (8%),  │  │
│ │ merchants (12%), soldiers (25%), artisans/other (20%)                 │  │
│ │                                                                         │  │
│ │ ## Challenges & Conflicts                                              │  │
│ │ 1. **Internal: Guild Dispute** — Miners' Guild and Merchants' Guild   │  │
│ │    clash over export pricing of raw ore vs finished goods.            │  │
│ │                                                                         │  │
│ │ 2. **External: Orc Raids** — Monthly raids from Bloodfang clan.       │  │
│ │    City walls hold but farmlands suffer. Bounty on orc chieftain.     │  │
│ │                                                                         │  │
│ │ 3. **Supernatural: Haunted Mine** — Northern silver mine abandoned    │  │
│ │    after workers reported ghostly figures. Production down 30%.       │  │
│ │                                                                         │  │
│ │ [... other sections ...]                                               │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│                [📋 Copy]  [💾 Save to Cards]  [📤 Export MD/JSON]          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

Seed: 5c7b9a2d                              Generated: 2025-01-15 14:28:47
```

## Layout Notes
- Extends Quick_settlement with 2 additional sections: Everyday Life + Challenges/Conflicts
- Everyday Life has sub-toggles (traditions, mores, occupations, festivals) and depth selector
- Challenges/Conflicts has category selectors (internal vs external) with multi-select options
- External threats allow text input for specifics (e.g., "Orc raiders" vs generic "Military")
- Preview shows distinct formatting for Everyday Life (bullet points) and Challenges (numbered list with severity indicators)