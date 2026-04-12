# UI Explanation: Hivemind Simulation Dashboard (HiveMindConcept)

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


## Component Architecture
- **Node-Based Team Panel:** Displays the 5 simulation roles (PL, VL, NL, GR, RT) as active nodes with "Mood Indicators" that shift based on the project's creative direction.
- **Phased Activity Tracker:** A breadcrumb-style navigation bar that locks/unlocks the Debate, Voting, and Adaptation phases.
- **Sentiment Analysis Matrix:** A table or heat-map showing which features (e.g., "Card Mechanics") are currently generating heat (debate) or light (unification).
- **Consensus Draft Workspace:** A collaborative text area where the AI synthesizes the adapted solution, highlighting which team member's feedback influenced specific lines.

## Interaction Logic
- **Drive-Based Decision Triggers:** The UI simulates the "Turn-ons/offs" by flagging proposals that conflict with a member's core interest (e.g., PL vetoing a cliché).
- **Weighted Voting Engine:** Users can trigger the "Approval/Critique" phase, causing each node to generate a justification for their stance based on the simulation script.
- **Forced Convergence:** A "Next Phase" action that prompts the AI nodes to resolve conflicts through the ADAPTATION logic.

## Visual Design
- **Cyber-Corporate / Strategy Aesthetic:** Modern, clean, and high-tech interface (Blueprint Blue, Neon Cyan, White).
- **Avatar-Driven UX:** Each team member has a distinct icon representing their role (e.g., a gears icon for the Engineer, a book for the Historian).
- **Process-Oriented Layout:** The UI emphasizes the *flow* of logic from individual ideas to a collective consensus.
