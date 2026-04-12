# Specification: 5-Room Dungeon Builder v1 (DungeonDesign_5Room_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The 5-Room Dungeon Builder v1 is a horizonal "5-Pillar" layout tool for rapid dungeon generation. It uses a Seed/Environment setup to quickly populate 5 distinct room cards (Guard, Puzzle, Setback, Climax, Reward).

## 2. Component Architecture
### 2.1 Core Panels
- **Environment Setup**:
    - Top bar: Theme, Difficulty, Seed.
- **5-Pillar Layout**:
    - 5 vertical columns (Room 1-5).
    - Sequential arrows (progress flow).
- **Room Card**:
    - Header (Icon + Role).
    - Type Dropdown (Guard, Trap, etc.).
    - Quick AI Button (Regenerate single room).

## 3. Interaction Logic
- **Bulk Generation**:
    - "Generate All" uses the Master Seed to basic consistent themes across all 5 rooms.
- **Preset Libraries**:
    - Dropdowns pull from specific lists (e.g., "Golems", "Robots") based on Environment.

## 4. Visual Design
- **Gradient Moods**:
    - Room 1: Mystery (Purple).
    - Room 2: Intellect (Blue).
    - Room 3: Suspense (Orange).
    - Room 4: Intensity (Red).
    - Room 5: Revelation (Gold).

## 5. Data Model
```typescript
interface PillarDungeon {
  environment: string;
  seed: number;
  rooms: [Room, Room, Room, Room, Room];
}

interface Room {
  role: 'Entrance' | 'Puzzle' | 'Setback' | 'Climax' | 'Reward';
  type: string;
  content: string;
}
```
