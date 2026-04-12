# Specification: Quick NPC Generator (Quick_NPC)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Quick NPC Generator is a dashboard for fast, tag-based NPC creation. It features AI-assisted "Context" filling and "Tone" selection (Gritty, Whimsical).

## 2. Component Architecture
### 2.1 Core Panels
- **Main Form**:
    - Name, Role (Merchant/Guard), Tone.
    - Tags (e.g., "missing-hand").
    - AI Context (TextArea).
- **Preview Pane**:
    - "Short Desc", "Hook", "Traits" display.
- **Table Picker**:
    - Configurable tables for procedural generation.

## 3. Interaction Logic
- **AI Fill**:
    - Sends Context + Tone to AI service.
- **Conflict Resolution**:
    - "Most recent action wins" policy for AI vs Procedural inputs.

## 4. Visual Design
- **Aesthetic**: Dashboard / Form-heavy.
- **Left Nav**: History timeline.

## 5. Data Model
```typescript
interface QuickNPCGenerator {
  seed: string;
  name: string;
  role: string;
  tone: 'Gritty' | 'Whimsical' | 'Mysterious';
  tags: string[];
  output: { description: string; hook: string; traits: string[] };
}
```
