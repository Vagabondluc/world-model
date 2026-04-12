# Make_a_settlement.txt — UI Explanation & React Component Design

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Overview
Extended settlement generator with 9 sections (Quick_settlement + Everyday Life + Challenges/Conflicts). Emphasizes cultural detail and conflict hooks for campaign integration.

## Component Architecture

### Main Component: `ExtendedSettlementGenerator`
```typescript
interface ExtendedSettlementState {
  mode: 'procedural' | 'ai';
  name: string;
  type: SettlementType;
  civilizationLevel: CivilizationLevel;
  seed: string;
  aiContext: string;
  
  // Output section toggles
  outputSections: Section[];
  
  // Everyday Life configuration
  everydayLife: {
    includeTraditions: boolean;
    includeMores: boolean;
    includeOccupations: boolean;
    includeFestivals: boolean;
    depth: 'brief' | 'standard' | 'detailed';
  };
  
  // Challenges/Conflicts configuration
  conflicts: {
    internal: {
      politicalFactions: boolean;
      socialTensions: boolean;
      economicStruggles: boolean;
    };
    external: {
      military: string; // User-specified threat
      environmental: boolean;
      supernatural: boolean;
    };
    count: number; // 1-8
  };
  
  generatedData: ExtendedSettlementData | null;
  loading: boolean;
}
```

### Child Components
1. **ModeSelector** — Procedural vs AI
2. **BasicSettlementForm** — Name, type, civilization level, seed
3. **SectionChecklist** — 9 output section checkboxes
4. **EverydayLifeConfig** — Sub-toggles + depth selector
5. **ConflictsConfig** — Internal/external category checkboxes + count slider
6. **SettlementPreview** — Markdown preview with formatted sections

## Data Flow

### Procedural Mode

#### Everyday Life Generation
1. **Traditions**
   - Depth = brief: 1-2 sentences
   - Depth = standard: 1 paragraph
   - Depth = detailed: 2-3 paragraphs with specific examples
   - Tables: `local_traditions`, `customs`, `taboos`
   - Examples: market days, coming-of-age rituals, greetings

2. **Cultural Mores**
   - Social norms, values, behavioral expectations
   - Tables: `social_norms`, `values`, `etiquette`
   - Examples: eye contact rules, helmet removal protocol

3. **Common Occupations**
   - Procedural: generate occupation percentages based on settlement type
   - Village: 70% agriculture, 10% crafts, 5% military, 15% other
   - City: 15% agriculture, 30% crafts, 15% military, 20% merchants, 20% other
   - Output: "Stonecutters (15%), miners (20%), blacksmiths (8%)..."

4. **Festivals/Holidays**
   - Generate 2-6 festivals based on civilization level
   - Tables: `seasonal_festivals`, `religious_holidays`, `commemorative_events`
   - Include: name, date/frequency, description, special activities

#### Challenges & Conflicts Generation
1. **Internal Disputes**
   - Political: faction rivalries, succession disputes, corruption
   - Social: class tensions, racial prejudice, generational gaps
   - Economic: resource scarcity, guild disputes, wealth inequality
   - Generate 1-4 internal conflicts based on selected categories

2. **External Threats**
   - Military: user specifies (e.g., "Orc raiders", "Neighboring kingdom")
   - Environmental: natural disasters, resource depletion, plague
   - Supernatural: haunted locations, planar rifts, curses
   - Generate 1-4 external threats

3. **Conflict Output Format**
   ```markdown
   ## Challenges & Conflicts
   1. **Internal: Guild Dispute** — Miners' Guild and Merchants' Guild...
   2. **External: Orc Raids** — Monthly raids from Bloodfang clan...
   3. **Supernatural: Haunted Mine** — Northern silver mine abandoned...
   ```

### AI Mode
- Construct prompt with all enabled sections + configuration
- Example prompt segment:
  ```
  Include Everyday Life section with:
  - Local traditions (detailed depth)
  - Cultural mores
  - Common occupations with percentages
  - 3-4 festivals/holidays
  
  Include Challenges & Conflicts section with:
  - 1 political faction conflict
  - 1 social tension
  - External military threat: Orc raiders
  - 1 supernatural threat
  Total: 4 conflicts
  ```

## Tables (Procedural Mode)

### Everyday Life Tables
- `traditions`: 50+ local customs (market days, rituals, ceremonies)
- `mores`: 40+ social norms (greetings, respect signals, taboos)
- `occupation_templates`: 30+ job categories with default percentages per settlement type
- `festivals`: 30+ celebration templates (seasonal, religious, commemorative)

### Conflict Tables
- `internal_political`: 25+ faction disputes, power struggles
- `internal_social`: 20+ class/race/generational tensions
- `internal_economic`: 15+ resource/trade/guild conflicts
- `external_military`: 30+ enemy factions (orcs, bandits, rival nations)
- `external_environmental`: 20+ natural disasters, plagues, shortages
- `external_supernatural`: 25+ magical threats (curses, hauntings, planar rifts)

## Civilization Level Effects

| Level | Traditions | Festivals | Conflicts | Occupation Diversity |
|-------|----------|-----------|-----------|---------------------|
| Primitive | 1-2 | 1-2 | 1-2 | Low (5 types) |
| Basic | 2-3 | 2-3 | 2-3 | Medium (10 types) |
| Advanced | 3-5 | 4-6 | 3-5 | High (20+ types) |

## Validation Rules
- Settlement type: required
- Civilization level: required
- Everyday Life: at least 1 sub-toggle enabled if section enabled
- Conflicts: at least 1 internal OR external category selected if section enabled
- Conflict count: 1-8
- External military threat: text required if military checkbox selected

## Firestore Schema
```typescript
{
  type: "ExtendedSettlement",
  formData: {
    type: "fortified-city",
    civilizationLevel: "advanced",
    seed: "5c7b9a2d",
    everydayLife: {
      depth: "standard",
      includes: ["traditions", "mores", "occupations", "festivals"]
    },
    conflicts: {
      internal: ["politicalFactions", "socialTensions"],
      external: ["military:Orc raiders", "supernatural"],
      count: 3
    }
  },
  output: {
    name: "Stonewatch",
    population: "8,500",
    // ... standard 6 sections
    everydayLife: {
      traditions: "Weekly market day on Sixthday...",
      mores: "Direct eye contact required during trade...",
      occupations: "Stonecutters (15%), miners (20%)...",
      festivals: ["Spring Planting Festival", "Midsummer's Eve", ...]
    },
    conflicts: [
      {
        type: "internal",
        category: "political",
        title: "Guild Dispute",
        description: "Miners' Guild and Merchants' Guild..."
      },
      // ... 2 more conflicts
    ]
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  connections: []
}
```

## Accessibility
- Everyday Life sub-toggles: fieldset with legend
- Conflict category checkboxes: grouped by type (internal/external)
- Military threat text input: aria-required when checkbox selected
- Preview pane: semantic headings (h2 for sections, h3 for conflicts)

## Export Options
1. **Markdown**: Full settlement document with formatted Everyday Life + Conflicts sections
2. **JSON**: Complete data structure
3. **PDF**: Printable settlement guide (server-side rendering)