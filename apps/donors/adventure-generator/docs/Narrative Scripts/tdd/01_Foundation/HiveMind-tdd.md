# TDD Plan: Hivemind Simulation Dashboard

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## 1. Unit Tests

### 1.1 Team Panel Rendering
- **`renders_all_team_nodes`**: Verify that all 5 team members (PL, VL, NL, GR, RT) are rendered.
- **`displays_correct_mood_icons`**: Mock state with different moods and assert correct icon/color rendering.
- **`updates_affinity_bars`**: Pass varying affinity scores and check the width/value of the visualization bars.

### 1.2 Phased Tracker
- **`initial_state_is_debate`**: Assert that the initial active phase is 'Debate'.
- **`locks_future_phases`**: Verify that 'Adaptation' is disabled when in 'Debate' phase.
- **`navigation_updates_phase`**: specific actions (clicking 'Next') update the current phase state.

### 1.3 Proposal Tray
- **`renders_proposal_list`**: Pass a list of dummy proposals and verify they appear in the tray.
- **`displays_veto_status`**: Mark a proposal as 'Vetoed' and check for visual distinction (e.g., strikethrough or red border).

## 2. Integration Tests

### 2.1 The Voting Flow
- **Scenario**: User triggers a vote on Proposal P1.
    1.  **Given**: The simulation is in 'Debate' phase with 3 active proposals.
    2.  **When**: User clicks "Analyze Trends" or "Vote".
    3.  **Then**:
        - Phase advances to 'Voting'.
        - 'Vote Tally' panel becomes visible.
        - Mocked AI responses populate the tally area.

### 2.2 Consensus Generation
- **Scenario**: Resolving conflicts.
    1.  **Given**: P2 has mixed feedback (1 Veto, 2 Approvals).
    2.  **When**: User clicks "Generate Final Concept".
    3.  **Then**:
        - 'Collaborative Output' text area populates.
        - The text contains highlights linked to specific team members (e.g., hovering text shows "Influenced by NL").

## 3. Component mocks
- Mock `lucide-react` icons to avoid rendering issues in test environment.
- Mock the AI response generator (don't make actual LLM calls during tests).
