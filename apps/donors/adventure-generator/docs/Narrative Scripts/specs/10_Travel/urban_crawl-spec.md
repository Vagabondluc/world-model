# Specification: Urban Crawl Navigator (urban_crawl)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Urban Crawl Navigator manages city exploration with "Layers" (themes) and "District Investigations". It tracks "Heat" and "Faction Impact".

## 2. Component Architecture
### 2.1 Core Panels
- **District Hub**:
    - District Selector (e.g. Docks).
    - Layer Toggles: Noir Gangs, Vampire, Heists.
- **Investigation Dashboard**:
    - Actions: General vs Specific Layer.
    - Heat Gauge (0-100%).
- **Event Monitor**:
    - Triggered Events (Automatic on entry).
- **Sensory Engine**:
    - Descriptive text for travel intervals.

## 3. Interaction Logic
- **Layer Weighting**:
    - "Noir Gangs" active = higher chance of Syndicate encounters.
- **Faction Feedback**:
    - Resolving investigations updates "Reputation" scores automatically.
- **District Tracking**:
    - Integration with Gazetteer data (Points of Interest).

## 4. Visual Design
- **Aesthetic**: Noir / Industrial / High-Contrast.
- **Indicators**: Heat Meter (Color scaling Green -> Red).

## 5. Data Model
```typescript
interface UrbanCrawl {
  district: string;
  activeLayers: string[];
  heat: number;
  factions: { [name: string]: number };
  currentEvent: UrbanEvent | null;
}

interface UrbanEvent {
  description: string;
  type: 'Automatic' | 'Investigation';
  layer?: string;
}
```
