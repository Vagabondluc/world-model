# Specification: Quick Settlement Architect (Quick_settlement)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Quick Settlement Architect leads with Visual Inspiration (Image-First) to drive narrative. It organizes Governance, Economy, and Customs into tabbed blocks and manages a "Prominent Individuals" table.

## 2. Component Architecture
### 2.1 Core Panels
- **Image Dashboard**:
    - DALL-E Placeholder/Generator.
- **Priority Hook**:
    - "Utmost Priority" text input (e.g. "Floating City").
- **Narrative Tabs**:
    - Domains: Governance, Economy, Customs.
    - Style Badges: [ND] (Narrative Description), [D&T] (Demographics & Tactics).
- **NPC Matrix**:
    - Columns: Name, Role, Desc, Goal.
- **Hook Builder**:
    - Multi-vector adventure prompts (Mystery, Moral, Political).

## 3. Interaction Logic
- **Image Sync**:
    - "Sync Text" button aligns descriptive text with the generated image features.
- **Table Expansion**:
    - Generating "Society" section auto-proposes NPC rows (e.g. a Leader mentioned in text is added to the table).
- **Style Enforcement**:
    - Backend applies specific tone (e.g. "Scientific" for Economy) based on the active tab.

## 4. Visual Design
- **Aesthetic**: Sleek / Split-Screen (Visual vs Data).
- **Coding**: Color-coded NPC roles (Leader=Gold, Villain=Red).

## 5. Data Model
```typescript
interface QuickSettlement {
  imagePrompt: string;
  hook: string;
  demographics: { name: string; pop: number; type: string };
  narrative: { [domain: string]: string }; // Gov, Econ, etc.
  npcs: SettlementNPC[];
  adventureHooks: string[];
}
```
