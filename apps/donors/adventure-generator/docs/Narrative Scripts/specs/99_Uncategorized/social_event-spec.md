# Specification: Social Hub (social_event)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Social Hub manages "The Grand Soiree" style encounters. It tracks "Guest Lists," "Topics of Conversation," and an "Event Sequence" timeline.

## 2. Component Architecture
### 2.1 Core Panels
- **Zone Monitor**:
    - Main Hall, Balcony, Vault.
- **Guest Grid**:
    - NPCs with Status (Friendly/Wary) and Clues.
- **Event Track**:
    - Sequence (Arrival -> Toast -> Sabotage).
- **Topic Tracker**:
    - Active Gossip (Topic A, B, C).

## 3. Interaction Logic
- **Group Shifting**:
    - Moving an NPC from "Main Hall" to "Balcony" updates their availability.
- **Sequence Trigger**:
    - Completing "The Grand Toast" unlocks "The Sabotaged Lights".
- **Clue Logging**:
    - Marking a Guest Clue as found updates the "Log".

## 4. Visual Design
- **Aesthetic**: Ballroom / Invite List.
- **Organization**: List-heavy for guests and topics.

## 5. Data Model
```typescript
interface SocialEvent {
  guests: SocialGuest[];
  zones: { name: string; capacity: number; occupants: string[] }[];
  timeline: { currentStep: number; events: string[] };
  topics: string[];
}
```
