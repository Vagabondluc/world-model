# Post-Refinement Critique: The "Intelligence & Immersion" Roadmap

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


This document analyzes the specific risks associated with the **Refined Roadmap** selected for the next session (AI Grounding MVP + Stitch UI), rather than the broad concepts.

## 1. AI Grounding: "Direct Context Injection" (MVP)
**The Plan:** Inject *only* the current hex's immediate metadata (Biome, Vocation, Tags) and "Simple Neighbors" (Radius 1) into the system prompt.

### 🟢 Risk Reduction
*   **Latency:** Eliminating the deep graph traversal reduces the "Grounding Utility" overhead to <50ms.
*   **Token Bloat:** By stripping "Flavor Text" and only sending raw tags/facts, we keep the injected context under ~200 tokens.

### 🟡 Residual Risks
*   **"Tag Hallucination":** The AI might not know what strict game-mechanical tags (e.g., `#dwarven-isolationism-lvl3`) mean unless we provide a "Tag Dictionary."
    *   *Mitigation:* The "Fact Serializer" must expand tags into natural language (e.g., "The locals are extremely hostile to outsiders").
*   **Prompt Weight:** System Prompt instructions ("Be gloomy") might conflict with Fact Injection ("Fact: It is a sunny festival").
    *   *Mitigation:* Use "System Instruction" for tone, but "User Context" for facts.

### ⚖️ Verdict: GREEN
The MVP scope is safe. The main challenge is Prompt Engineering, not Software Engineering.

---

## 2. Stitch UI: "Performance-First Aesthetics"
**The Plan:** Glassmorphism via CSS variables/opacity (avoiding heavy blurs) and selective View Transitions (Zoom only).

### 🟢 Risk Reduction
*   **Frame Budget:** Avoiding `backdrop-filter` on moving elements (panning map) saves significant GPU time.
*   **Browser Compat:** Limiting View Transitions to "page-level" state changes means we can easily fallback to standard React rendering for non-Chromium browsers without breaking functionality.

### 🟡 Residual Risks
*   **Aesthetic Necessity:** **Is this needed?** The user has rightly questioned if "Glassmorphism" adds functional value.
    *   *Risk:* Spending engineering time on a specific "Frost" look that doesn't improve usability.
    *   *Mitigation:* We will implement a clean, high-contrast UI first. The "Glass" effect will be treated as an optional "Skin" or removed entirely if it adds no value.
*   **Animation Jank:** React `useViewTransition` can conflict with strict `useEffect` state updates if not batched correctly.

### ⚖️ Verdict: LIGHT GREEN
Requires a good "Designer's Eye" to pull off the "Fake Glass" look, but the technical risk is managed.

---

## 3. De-Scoped Items (Validation)

### Map Echoes (Manual Copy Only)
*   **Critique:** Smart move. "Manual Clone" is an atomic operation with zero state-sync bugs. It allows users to "diverge" their timelines (e.g., The Shadowfell city was destroyed), which is actually *better* for storytelling than forced syncing.

### Sub-Maps (Removed)
*   **Critique:** Correct decision. This saved us from a 3-month rabbit hole.

---

## 🏁 Final Conclusion
The plan is tight.
1.  **Complexity:** Low/Medium.
2.  **Impact:** High.
3.  **Unknowns:** Prompt tuning (Time sink risk).

**Recommendation:**
Start with **Ticket T-706 (AI Grounding)**. It has the highest potential for "unknown unknowns" (AI behavior), so tackling it first allows us to adjust the implementation plan if the AI isn't cooperating. The UI work (T-710) is deterministic and can be done tired; the AI work cannot.

## Addendum: Multi-Step Pipeline Integration

- Pipeline: Collect Proposal -> Check Link Completeness -> Critique -> Suggest Revisions.
- Critique output must preserve entity links (Link Registry per `docs/specs/persistence.md`) so revisions do not break references.
- Emit link warnings as part of the critique report.
