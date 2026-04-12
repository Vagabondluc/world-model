# Specification: Quick NPC Reference Card (QuickNPC_Creation_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Quick NPC Reference Card is a "Roleplay-First" utility tool. It focuses on a 9-category table where each entry is max 1 sentence, plus a single "Unexpected Detail".

## 2. Component Architecture
### 2.1 Core Panels
- **Snap-Generation Prompt**:
    - Seed input (e.g., "Tiefling Merchant").
- **Constraint Grid**:
    - 9 Rows (Identity, Look, Goal, Traits, Habits...).
    - Enforces brevity.
- **Twist Box**:
    - High-contrast "Unexpected Detail".
- **View Mode**:
    - "Read-Only" card for session use.

## 3. Interaction Logic
- **Brevity Enforcement**:
    - Visual warning if cell content > 150 chars.
- **Twist Roller**:
    - Button to randomize just the "Unexpected Detail".
- **Links**:
    - "Knowledge" entries can link to Location entities.

## 4. Visual Design
- **Aesthetic**: Clean / Modern / Glancable.
- **Layout**: Table-dominant.

## 5. Data Model
```typescript
interface QuickNPC {
  seed: string;
  table: { [category: string]: string }; // Identity, Look, Goal...
  twist: string;
  deepDive: string; // Optional longer text
}
```
