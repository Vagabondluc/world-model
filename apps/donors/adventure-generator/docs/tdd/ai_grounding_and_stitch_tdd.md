# TDD — AI Grounding & Stitch UI Plan

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04


This document outlines the Test-Driven Development plan for the **AI Grounding Service** (T-706) and **Stitch UI Polish** (T-710).

## 🟢 Part 1: AI Grounding Service (T-706)

### **Testing Philosophy**
The "Grounding" logic is purely deterministic graph traversal and string manipulation. It should be tested in isolation from the actual LLM API to avoid costs and latency. We test the *Prompt Builder*, not the *LLM Output*.

### **1. Unit Tests (Logic Engine)**
*   `tests/unit/grounding/GroundingService.test.ts`

**A. Fact Extraction (The "What")**
- [ ] `getEffectiveBiome(hex)` returns the correct biome, resolving overrides.
- [ ] `getTags(hex)` returns flattened array of tags from Location + Region.
- [ ] `getNearbyLandmarks(hex, radius=1)` returns list of significant locations.
    - [ ] Filters out "empty" hexes.
    - [ ] Filters out "minor" locations (optional).

**B. Text Serialization (The "How")**
- [ ] `serializeBiome(biome)` converts enum to natural language (e.g., `FOREST` -> "You are deep within an ancient forest.").
- [ ] `serializeTags(tags)` expands tag IDs to descriptions (e.g., `#cursed` -> "The air feels heavy with old twisted magic (Cursed).").
- [ ] `formatGroundingContext(context)` assembles the final string block for the System Prompt.

**C. Prompt Injection**
- [ ] `constructSystemPrompt(base, grounding)` correctly inserts the grounding block *before* the instruction block.
- [ ] `truncateContext(text, limit)` ensures the injected context does not exceed token budget (~250 tokens).

### **2. Integration Tests (Store Connection)**
*   `tests/integration/grounding/GroundingStore.test.ts`

- [ ] `useLocationStore` correctly provides data to `GroundingService`.
- [ ] Updates to the Map (e.g., changing a biome) immediately reflect in the `getGroundingContext` output (Reactivity check).

---

## 🔵 Part 2: Stitch UI Polish (T-710)

### **Testing Philosophy**
Visual polish is hard to unit test. We focus on **State Stability** (does the view transition trigger?) and **DOM Structure** (are the correct classes applied?).

### **1. Component Logic Tests (Vitest)**
*   `tests/unit/stitch/ViewTransition.test.ts`

**A. Theme Engine**
- [ ] `useTheme` hook correctly reads `activeLayer` from store.
- [ ] `useTheme` correctly applies `data-theme="shadowfell"` to the document root (or wrapper).
- [ ] Switching themes emits a "theme-change" event (if needed for canvas).

**B. Transition Hooks**
- [ ] `useViewTransition(callback)` executes the callback immediately if `document.startViewTransition` is missing (Explode-proof fallback).
- [ ] `useViewTransition` calls `startViewTransition` when supported.

### **2. Visual/DOM Tests (Component Testing)**
- [ ] **Spatial Anchor:** The `MapCanvas` container has the correct `view-transition-name` attribute when active.
- [ ] **Sidebar:** The Location Sidebar has a stable `id` that persists across re-renders (crucial for React reconciliation during transitions).

---

## 📝 Test Checklist

### **AI Grounding**
- [ ] `GroundingService` - Biome resolution
- [ ] `GroundingService` - Tag expansion
- [ ] `GroundingService` - Token budgeting
- [ ] `PromptBuilder` - Injection logic

### **Stitch UI**
- [ ] `ThemeManager` - Class application
- [ ] `Navigation` - Graceful fallback for View Transitions
