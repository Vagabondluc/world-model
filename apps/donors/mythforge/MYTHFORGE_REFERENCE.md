# MythosForge — Schema & Template Reference

This reference enumerates categories, fields, types, and default values extracted from `src/lib/validation/*` and `src/lib/types/templates.ts`.

Mechanical Sycophant Forms
- Extracted form fields (from `mechanical-sycophant` contracts) are summarized in:
  - [mechanical-sycophant/FORM_FIELDS_SUMMARY.md](mechanical-sycophant/FORM_FIELDS_SUMMARY.md#L1)


Notes on types
- `num(...)` → number (optional, with default)
- `str(...)` → string (optional, with default)
- `bool(...)` → boolean (optional, with default)
- `strArr(...)` → string[] (optional, with default)
- `numArr(...)` → number[] (optional, with default)

Macro & Cosmos

Cosmos
- age_in_years: number — default 0
- known_planes: number — default 0
- magic_density: string — default "Medium"

Plane
- alignment: string — default "Neutral"
- element: string — default ""
- accessibility: string — default "Difficult"

Deity
- divine_rank: number — default 1
- domains: string[] — default []
- worshippers: number — default 0
- alignment: string — default "True Neutral"

Myth
- era_origin: string — default ""
- truthfulness: string — default "Unknown"
- spread: string — default "Local"

Geography

Biome
- temp_avg_celsius: number — default 20
- precipitation_annual_mm: number — default 800
- danger_rating: number — default 3
- resource_abundance: number — default 0.5

Region
- area_sq_km: number — default 0
- population_density: number — default 0
- primary_biome: string — default ""
- political_control: string — default ""

Settlement
- population: number — default 500
- wealth_tier: number — default 2
- guard_count: number — default 10
- crime_rate: number — default 5

City
- population: number — default 10000
- wealth_tier: number — default 3
- guard_count: number — default 200
- crime_rate: number — default 15

Landmark
- elevation_meters: number — default 0
- visibility_range_km: number — default 5
- is_hidden: boolean — default false

Dungeon
- total_rooms: number — default 12
- average_cr: number — default 3
- exploration_time_minutes: number — default 240

Structure
- floors: number — default 1
- condition: string — default "Good"
- owner: string — default ""
- purpose: string — default ""

Society & History

Faction
- member_count: number — default 50
- influence: string — default "Regional"
- resources: string — default "Moderate"
- secrecy: number — default 3

Guild
- member_count: number — default 100
- headquarters: string — default ""
- specialty: string — default ""
- wealth_rating: number — default 3

Religion
- follower_count: number — default 0
- holy_symbol: string — default ""
- sacred_sites: number — default 0
- orthodoxy: number — default 5

Noble House
- current_head: string — default ""
- territory: string — default ""
- military_strength: number — default 5
- wealth: string — default "Affluent"

Historical Event
- year_occurred: number — default 0
- significance: string — default "Major"
- casualties: number — default 0
- lasting_impact: string — default ""

Era
- start_year: number — default 0
- end_year: number — default 0
- defining_event: string — default ""
- technological_level: string — default "Medieval"

Culture
- traditionalism_score: number — default 5
- belligerence_index: number — default 3
- tech_level: number — default 2
- trade_openness: number — default 5

Biology & Entities

Species
- avg_lifespan_years: number — default 80
- avg_height_cm: number — default 175
- population_percentage: number — default 10
- base_speed_ft: number — default 30

Race
- avg_lifespan_years: number — default 80
- avg_height_cm: number — default 175
- population_percentage: number — default 10
- base_speed_ft: number — default 30

Creature
- challenge_rating: number — default 1
- xp_value: number — default 200
- intelligence_score: number — default 3

Fauna
- tameability_pct: number — default 50
- reproduction_rate: string — default "Medium"
- dietary_needs_kcal: number — default 2000

NPC
- hp: number — default 10
- ac: number — default 10
- level: number — default 1
- age: number — default 25
- wealth_gold: number — default 0
- disposition: string — default "Neutral"

Character
- hp: number — default 20
- ac: number — default 15
- level: number — default 3
- age: number — default 30
- wealth_gold: number — default 150

Historical Figure
- birth_year: number — default 0
- death_year: number — default 0
- legacy: string — default ""
- significance: string — default "Notable"

Items & Mechanics

Artifact
- power_level: string — default "Legendary"
- attunement_required: boolean — default false
- curse: string — default ""
- origin: string — default ""

Item
- weight_lbs: number — default 1
- cost_gold: number — default 10
- durability_max: number — default 100
- magic_level: number — default 0

Resource
- market_value_gold: number — default 5
- weight_per_unit_kg: number — default 0.5
- rarity_index: number — default 50

Material
- hardness: number — default 5
- rarity: string — default "Common"
- crafting_uses: string[] — default []
- weight_per_unit_kg: number — default 1

Technology
- era_level: number — default 3
- complexity: string — default "Moderate"
- rarity: string — default "Common"
- prerequisites: string[] — default []

Magic System
- source: string — default "Arcane"
- accessibility: string — default "Rare"
- risk_level: number — default 3
- max_power_level: number — default 9

Spell
- level: number — default 1
- school: string — default "Evocation"
- casting_time: string — default "1 action"
- range: string — default "60 ft"
- components: string — default "V, S"

Rule
- category: string — default "Combat"
- priority: string — default "Core"
- exceptions: string[] — default []
- related_rules: string[] — default []

Narrative

Quest
- difficulty: string — default "Medium"
- rewards_gold: number — default 100
- rewards_xp: number — default 300
- prerequisites: string[] — default []

Encounter
- difficulty: string — default "Medium"
- enemy_count: number — default 3
- average_cr: number — default 2
- environment: string — default ""

Scene
- location_id: string — default ""
- participants: string[] — default []
- mood: string — default "Tense"
- duration_minutes: number — default 10

Calendar
- Template default (from `CATEGORY_TEMPLATES`):
  - current_year: number — default 1
  - months: array — default []
  - weekdays: array — default []
  - design_notes: object — default {}

- Schema (`calendarSchema`) fields (different shape):
  - total_months: number — default 12
  - days_per_week: number — default 7
  - days_per_month: number — default 30
  - intercalary_days_count: number — default 0
  - epoch_event: string — default ''

Session Note
- session_number: number — default 1
- date_played: string — default ''
- participants: string[] — default []
- gm_notes: string — default ''
- xp_awarded: number — default 0

Relationship types
- `RELATIONSHIP_TYPES` (constants): contains relations such as `contains`, `located_in`, `allied_with`, `enemy_of`, `ruler_of`, `member_of`, `created_by`, `owns`, etc.

Usage tips
- Prefer the schema definitions as the source of truth for validation; use `CATEGORY_TEMPLATES` for defaults and UI scaffolding.
- When adding fields, update both the schema and the template default to avoid inconsistent shapes in the UI.
