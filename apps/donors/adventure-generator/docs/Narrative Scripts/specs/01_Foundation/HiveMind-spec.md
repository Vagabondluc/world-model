# Specification: Hivemind Simulation Dashboard

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Overview
The Hivemind Simulation Dashboard is a high-fidelity React component designed to simulate an RPG design team. It visualizes the collaborative process between five distinct AI personas (Innovator, Engineer, Storyteller, Facilitator, Historian) as they vote on, critique, and adapt design proposals.

## 2. Component Architecture
### 2.1 Core Elements
- **Node-Based Team Panel**:
    - Displays 5 simulation roles:
        - **PL**: Innovator
        - **VL**: Engineer
        - **NL**: Storyteller
        - **GR**: Facilitator
        - **RT**: Historian
    - Each node features "Mood Indicators" that visibly shift based on the project's creative direction.
    - **Visual**: Distinct icons for each role (e.g., gears for Engineer, book for Historian).

- **Phased Activity Tracker**:
    - Breadcrumb-style navigation bar.
    - Phases: **Debate** -> **Voting** -> **Adaptation**.
    - Functionality: Locks/unlocks phases based on simulation state.

- **Sentiment Analysis Matrix**:
    - Visual representation (table/heatmap) of feature reception.
    - Tracks "Heat" (debate/conflict) and "Light" (unification/consensus).

- **Consensus Draft Workspace**:
    - Collaborative text area.
    - Synthesizes the final adapted solution.
    - **Annotation**: Highlights which team member's feedback influenced specific lines.

## 3. Interaction Logic
- **Proposal Evaluation**:
    - "Tray of Proposals" lists active items (e.g., P1, P2, P3).
    - **Drive-Based Triggers**: System flags proposals conflicting with a member's core interest (e.g., PL vetoes clichés).

- **Voting Engine**:
    - User triggers "Approval/Critique" phase.
    - Nodes generate justifications/critiques based on their persona script.

- **Forced Convergence**:
    - "Next Phase" action prompts conflict resolution via PROMPT logic.

## 4. Data Structures
### 4.1 Team Member State
```typescript
interface TeamMember {
  id: 'PL' | 'VL' | 'NL' | 'GR' | 'RT';
  role: string;
  mood: 'Excited' | 'Neutral' | 'Bored' | 'Interested' | 'Angry';
  affinityScore: number; // 0-100
}
```

### 4.2 Proposal State
```typescript
interface Proposal {
  id: string;
  title: string;
  status: 'Pending' | 'Approved' | 'Vetoed' | 'Critiqued';
  critiques: Array<{ memberId: string; text: string }>;
}
```

## 5. Visual Design
- **Theme**: Cyber-Corporate / Strategy.
- **Palette**: Blueprint Blue, Neon Cyan, White.
- **Layout**: Process-oriented flow (Left-to-Right or Top-to-Bottom) emphasizing the transition from individual ideas to collective consensus.
