# Specification: Heist Running Dashboard (heist_running)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Heist Running Dashboard tracks the live execution. It focuses on a "Tension HUD" (1-10 scale), "Flashback Bank," and "Dynamic Complications."

## 2. Component Architecture
### 2.1 Core Panels
- **Live HUD**:
    - Tension Bar (Green -> Red).
    - Current Zone stats.
- **Flashback Bank**:
    - Resource tracker (e.g. 2/3 uses).
- **Complication Engine**:
    - Active obstacles (e.g. "Rival Crew").
- **Intervention Console**:
    - Choice Modal: Stealth vs Combat vs Distraction.

## 3. Interaction Logic
- **Tension Escalation**:
    - "Advance Turn" without progress adds +1 Tension.
- **Alert Threshold**:
    - Hitting Tension 8 triggers "High Alert" mode (UI turns red).
- **Flashback Mechanics**:
    - Spending a Flashback Point allows retroactive "Preparation" effects.

## 4. Visual Design
- **Aesthetic**: High-Stakes / Minimalist / Dishonored-style.
- **Feedback**: Color shifts based on Tension level.

## 5. Data Model
```typescript
interface HeistRun {
  tension: number; // 0-10
  flashbacks: number;
  currentZone: string;
  complications: HeistEvent[];
  alertLevel: 'Passive' | 'Suspicious' | 'High Alert';
}
```
