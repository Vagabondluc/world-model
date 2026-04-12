# Specification: NPC Template: Identity & Origin (CreateNPC_Alternate_v1)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The "NPC Template: Identity & Origin" is an architect tool for building rounded characters. It emphasizes "Career Origin" logic and "Secret-to-Hook" linking.

## 2. Component Architecture
### 2.1 Core Panels
- **Identity Studio**:
    - Fields: Name, Race, Gender, Preference.
- **Career Origin Editor**:
    - Job (e.g., Cartographer) + Origin Logic (Reason).
- **Physicality Panel**:
    - Skin, Height, Weight, "Descriptor".
- **Hook Console**:
    - Link distinct "Secret" to "Story Hook".
- **Analogy Tool**:
    - "Like Character X" comparison.

## 3. Interaction Logic
- **Descriptive Synthesis**:
    - Changing physical stats auto-suggests a narrative sentence.
- **Job Inventory**:
    - Selecting a job pre-populates the "Gear" field.

## 4. Visual Design
- **Aesthetic**: Tabular Dossier.
- **Focus**: High contrast "Roleplay Snapshot" values.

## 5. Data Model
```typescript
interface NPCTemplateAlt {
  identity: { name: string; race: string; gender: string; preference: string };
  physical: { skin: string; height: string; weight: string; descriptor: string };
  profession: { job: string; origin: string };
  story: { secret: string; hook: string };
  roleplay: { voice: string; analogy: string };
}
```
