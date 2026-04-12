
# SPEC-013: Enhanced Pantheon (Architect Profiling)

**Feature:** Player Onboarding / Session Setup
**Dependencies:** SPEC-007 (Meta-Game), SPEC-009 (Architecture)
**Status:** Approved for Implementation

## 1. Executive Summary
This spec defines the transformation of the Pantheon setup into an **Architect Profile Builder**, featuring **Divine Avatars**, **Divine Domains**, and an immersive gallery UI.

## 2. Updated Data Model: `PlayerConfig`
```typescript
interface PlayerConfig {
  id: string;
  name: string;
  color: string;
  avatar: string;         // Icon key
  domain: string;         // Domain key (e.g., 'VOID')
  isHuman: boolean;
}
```

## 3. The Domain Gallery (Selection UI)
With 84 distinct domains available, a standard dropdown is unusable. We implement a **Domain Selection Gallery**.

### 3.1 Interaction Flow
1.  **Trigger:** Click the "Domain Sigil" on the Architect Card.
2.  **Overlay:** A full-screen searchable grid modal (`bg-black/90` with `backdrop-blur`).
3.  **Search:** Real-time text filter at the top.
4.  **Categories:** Filter chips for "Elemental", "Abstract", "Civilization", "Conflict".

### 3.2 Domain Cards in Gallery
*   **Visual:** Large icon, Domain Name, and a short "Divine Spark" tooltip on hover.
*   **Selection:** Clicking a card triggers a "Divine Strike" (Flash animation) and closes the modal, updating the Architect Card.

## 4. UI Specification: The Pantheon Chamber
### 4.1 Card-Based Roster
*   **Visual:** 3:4 aspect ratio cards.
*   **Effigy:** Large circular mask for the `avatar`.
*   **Identity:** Bold name input + "Architect of the [Domain]" sub-label.

## 5. Acceptance Criteria
1. [x] Users can search through all 80+ domains by name.
2. [x] Avatar/Color sync is real-time.
3. [x] Validation: "Next" button disabled until all Architects have a Name and Domain.
