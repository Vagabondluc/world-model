# Settlement — Template & Field Reference

## Container Model

- UUID container: the persistent entity instance that the UI projects.
- Schema binding: explicit and versioned; see `UUID_CONTAINER_ARCHITECTURE.md`.
- Event behavior: append-only history is attached to the UUID.
- Projection: the current UI state is derived from the active binding plus the event log.
- Migration: schema changes require an explicit versioned migration.
- Runtime mapping: native schemas are code-backed; project schemas are file-backed.

Derived from: Narrative Scripts — Quick_settlement.txt

Purpose: Canonical MythosForge `Settlement` template used as the target JSON structure for LLM generation. Fields normalized from Narrative Scripts and Mechanical Sycophant settlement forms.

Canonical Fields
- name: string — Settlement name
- location: string — Short geography / region descriptor
- size: string — e.g., "village", "town", "city", "fortress"
- population: number | null — approximate population
- history: string — narrative history and founding notes
- governance: object | null
  - leader: string | null
  - structure: string | null
  - law_enforcement: string | null
  - political_factions: string[]
- economy: object | null
  - major_industries: string[]
  - trade_hubs: string[]
  - black_market: string | null
- districts: array of { name: string, description: string }
- landmarks: array of { name: string, description: string }
- demographics: array of { group: string, proportion: string | null, notes: string | null }
- notable_families: array of { name: string, influence: string | null, notes: string | null }
- associations: array of { name: string, type: string, description: string }
- prominent_individuals: array of { name: string, role: string, description: string, goal: string }
- everyday_life: string — summary of daily customs and occupations
- challenges: string[] — current threats, disputes, hazards
- adventure_hooks: array of { tag: string, summary: string, detail: string }
- gm_advice: string — concise GM tips for running the settlement
- image_prompt: string — seed prompt for DALL·E / image generation
- tags: string[]
- seed: string | null

Example JSON
```
{
  "name": "Graybridge",
  "location": "lowland river crossing on the Silverfen",
  "size": "town",
  "population": 4200,
  "history": "Founded as a ferry and trading post; expanded after the bridge was built...",
  "governance": {
    "leader": "Magistrate Irelle Voss",
    "structure": "Magistrate and Council",
    "law_enforcement": "Town Watch",
    "political_factions": ["Merchants' Guild", "Riverfolk Council"]
  },
  "economy": {
    "major_industries": ["fishing", "shipwrighting"],
    "trade_hubs": ["river quay", "market square"],
    "black_market": "small network operating from the west docks"
  },
  "districts": [{"name":"Quay","description":"Wharves and warehouses"}],
  "landmarks": [{"name":"Old Stone Bridge","description":"A centuries-old bridge with carved gargoyles"}],
  "demographics": [{"group":"Humans","proportion":"70%","notes":"long-settled"}],
  "notable_families": [{"name":"Voss","influence":"High","notes":"merchant lineage"}],
  "associations": [{"name":"Riverwatch","type":"guild","description":"guards the trade lanes"}],
  "prominent_individuals": [{"name":"Irelle Voss","role":"Magistrate","description":"stern, pragmatic","goal":"secure trade income"}],
  "everyday_life": "Market days dominate; boat maintenance and fishing common trades.",
  "challenges": ["seasonal flooding","smuggling ring"],
  "adventure_hooks": [{"tag":"Mystery","summary":"Strange lights beneath the bridge","detail":"Fishermen report a glowing presence at night."}],
  "gm_advice": "Use floods as pacing device; let merchants introduce quests.",
  "image_prompt": "a misty river town with a stone bridge at dawn, medieval fantasy, detailed architecture",
  "tags": ["river","trading","bridge"],
  "seed": null
}
```

Mapping notes
- Matches sections from `Quick_settlement.txt` (Overview, Geography and Layout, Society and Demographics, Economy and Trade, Governance, Culture, Associations, Prominent Individuals, Everyday Life, Challenges, Hooks, GM Advice).
- Aligns with Mechanical Sycophant forms: `QuickSettlement` / `Quick_Settlement` major fields; normalize variations like `Size and Population` → `size` + `population`.

Validation guidance
- When creating Zod schema, prefer structured objects for `governance`, `economy`, `districts`, and `prominent_individuals` and use `.passthrough()` for forward compatibility.

## Legacy Extraction Snapshot

This snapshot preserves the earlier minimal extraction notes for reference.

Source forms:
- `Quick_settlement.schema.ts` (mechanical-sycophant)

Fields (extracted):
- `settlementName`: string (optional)
- `settlementType`: string
- `population`: string (optional)
- `biome`: string
- `genre`: string (optional)
- `priorityHook`: string (max 500)
- `imagePrompt`: string (optional)
- `prominentNpcs`: array (optional)
- `adventureHooks`: array (optional)

Normalized template:

```json
{
  "name": "",
  "type": "",
  "population": "",
  "biome": "",
  "hooks": [],
  "prominentNpcs": []
}
```

