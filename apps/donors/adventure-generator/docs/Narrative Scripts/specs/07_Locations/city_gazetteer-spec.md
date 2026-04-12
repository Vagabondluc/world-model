# Specification: City Gazetteer (city_gazetteer)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The City Gazetteer is a "Master Archive" for urban campaigns. It features a Hierarchical District Navigator, Template-Driven Entry Editors, and a "Live Scenic Interaction" roller.

## 2. Component Architecture
### 2.1 Core Panels
- **District Navigator**:
    - Sidebar list of districts (Citadel, Docks, Slums).
- **Entry Editor**:
    - Structured fields: Landmarks, Services, Adventure Sites.
- **Scenic Roller**:
    - "Check Encounter" button (d6 roller).
    - Context-aware result display.
- **Background Events**:
    - Timeline of "Local News" and "Global Happenings".

## 3. Interaction Logic
- **Context-Aware Encounters**:
    - Rolling in "Docks" pulls from the Docks encounter pool.
- **Archive History**:
    - Tracks changes (e.g. "Inn burned down" added to history).
- **Transit visualizer**:
    - Visualizes connections (e.g. Canal connects Docks <-> Market).

## 4. Visual Design
- **Aesthetic**: Encyclopedic / Wiki / Digital Atlas.
- **Highlights**: Bold "Narrative Keywords" in descriptions.

## 5. Data Model
```typescript
interface CityGazetteer {
  cityName: string;
  districts: DistrictData[];
  globalEvents: EventLine[];
}

interface DistrictData {
  id: string;
  name: string;
  description: string;
  landmarks: string[];
  services: string[];
  encounters: string[]; // Pool of ~20
}
```
