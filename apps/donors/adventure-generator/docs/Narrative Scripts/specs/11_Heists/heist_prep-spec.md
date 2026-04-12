# Specification: Heist Preparation Studio (heist_prep)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Heist Preparation Studio manages the planning phase. It features a "Blueprint Designer" for intel mapping, a "Layered Defense" stack, and specific "Crew Role" assignments.

## 2. Component Architecture
### 2.1 Core Panels
- **Target Dossier**:
    - Objective (e.g. Opal), Magic Defenses, Guard Density.
- **Blueprint Designer**:
    - Visual layout (Zones). Tags: Known/Hidden/Unknown.
- **Defense Stack**:
    - Layers 1-4 (Perimeter -> Vault).
- **Crew Dashboard**:
    - Role assignment (Safecracker, Face, Muscle).
- **Tension Setup**:
    - Baseline triggers (e.g. Alarm = +5).

## 3. Interaction Logic
- **Intel Reveal**:
    - Completing "Recon" activity toggles specific tags from Hidden to Known on the Blueprint.
- **Defense Density**:
    - Higher tiers suggest higher DC ranges for security checks.
- **Role Synergy**:
    - Warns if critical roles (like Safecracker) are missing for the specific target type.

## 4. Visual Design
- **Aesthetic**: Tactical Stealth / Neon Blueprint.
- **Perspective**: Top-Down.

## 5. Data Model
```typescript
interface HeistPrep {
  target: { name: string; tier: number };
  blueprint: ZoneNode[];
  defenses: DefenseLayer[];
  crew: AssignedRole[];
  intel: { [key: string]: 'Hidden' | 'Known' };
}
```
