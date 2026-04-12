# Specification: Rumor Table Manager (rumors)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Rumor Table Manager is a "d20 Information Matrix" ensuring that rumors are actionable, tracked, and evolved. It manages a grid of rumors with status states (Fresh, Delivered) and context (Source, Focus).

## 2. Component Architecture
### 2.1 Core Panels
- **Master Rumor Grid**:
    - Columns: Roll, Content, Source, Focus, Status.
    - Statuses: Fresh (Green), Delivered (Grey), Verified (Blue).
- **Delivery & Framing**:
    - "Context" Generatory (e.g., Tavern, Letter).
    - Wraps raw data in narration.
- **Evolution Manager**:
    - "Restock" logic for outdated rumors.
    - "Impact Log" showing changes based on PC actions.

## 3. Interaction Logic
- **Restocking**:
    - Suggests new rumors when table gets stale.
- **Actionability Check**:
    - background validation ensuring rumors have a clear lead/location.
- **Cost/DC Integration**:
    - DM can assign a GP cost or DC check to uncover a rumor.

## 4. Visual Design
- **Aesthetic**: Investigator's Ledger / Case-File.
- **Color Coding**: Functional status colors.
- **Icons**: Focus glyphs (Shield=Threat, Scroll=Lore).

## 5. Data Model
```typescript
interface Rumor {
  id: number; // d20 roll
  content: string;
  source: string; // e.g., "Hex 14"
  focus: 'Object' | 'Creature' | 'Situation' | 'Lore';
  status: 'Fresh' | 'Delivered' | 'Verified' | 'Archived';
  cost?: string;
  evolution?: string;
}
```
