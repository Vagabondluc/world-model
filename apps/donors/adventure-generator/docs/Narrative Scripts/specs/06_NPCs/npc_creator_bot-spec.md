# Specification: NPC Creator Bot (npc_creator_bot)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The NPC Creator Bot is a comprehensive "Personality & Lore Architect". It features an "Identity Synthesis" studio and a unique "Chat Interface" to test the NPC's voice.

## 2. Component Architecture
### 2.1 Core Panels
- **Identity Synthesis**:
    - Name, Role, Vibe.
- **Matrix**:
    - Binary Personality Toggles (Greedy vs Generous).
    - Physical Features.
- **Lore Generator**:
    - Motivation, Conflict, Quest Hook.
- **Bot Chat**:
    - Type message -> Get in-character response.

## 3. Interaction Logic
- **Role Constraints**:
    - "Master Armorer" role auto-suggests "High Strength" vibe.
- **Real-Time Preview**:
    - "Dossier" sidebar updates as traits are toggled.

## 4. Visual Design
- **Aesthetic**: Note-taking app / Notebook.
- **Chat**: Bubble interface for the Bot test.

## 5. Data Model
```typescript
interface NPCCreatorBot {
  identity: { name: string; role: string; vibe: string };
  traits: { [key: string]: boolean }; // e.g. greedy: true
  lore: { goal: string; hook: string };
  chatHistory: Message[];
}
```
