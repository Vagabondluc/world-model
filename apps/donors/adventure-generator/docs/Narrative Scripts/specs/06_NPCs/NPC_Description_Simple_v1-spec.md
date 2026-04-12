# Specification: NPC Description Simple v1 (NPC_Description_Simple_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
This is an ultra-minimal physical description generator. It enforces a strict template format ("Name is a X year old Y...") to produce uniform, copy-paste-ready paragraphs.

## 2. Component Architecture
### 2.1 Core Panels
- **Physical Form**:
    - Fields: Hair (Length/Tex/Color), Eyes, Skin, Body Build.
    - Height: Input cm/ft.
- **Identity**:
    - Name, Age, Race, Profession.
- **Preview Pane**:
    - Real-time template rendering.

## 3. Interaction Logic
- **Height Auto-Calc**:
    - Input CM updates Ft/In automatically.
- **Procedural Generation**:
    - "Generate" button picks random traits based on race norms (e.g., Dwarf height range).
- **Template Enforcement**:
    - Output is always a specific paragraph structure.

## 4. Visual Design
- **Aesthetic**: Simple Form / Utility.
- **Mobile**: Stacks vertically.

## 5. Data Model
```typescript
interface SimpleNPCDesc {
  seed: string;
  identity: { name: string; age: number; race: string; gender: string; profession: string };
  physical: { hair: HairTraits; eyes: string; skin: string; heightCm: number; body: string };
  face: { shape: string; details: string };
  behaviors: string;
}
```
