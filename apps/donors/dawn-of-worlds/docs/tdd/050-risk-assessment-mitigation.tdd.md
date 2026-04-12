# TDD-050: Risk Assessment

**Epic:** Risk Assessment
**Spec:** `docs/specs/050-risk-assessment-mitigation.md`

## 1. Stability Tests

### `logic/core/stability.test.ts`

- **Test:** `crashloopDetector_ShouldTriggerSafeMode`
    - **Setup:** Simulate 3 consecutive crashes via localStorage flag.
    - **Expect:** App starts in "Safe Mode" (No 3D Globe).

- **Test:** `memoryMonitor_ShouldWarnAtThreshold`
    - **Setup:** Mock memory usage report > 90% limit.
    - **Expect:** Dispatch 'LOW_MEMORY_WARNING' event. Clears non-essential caches.

## 2. Fallback Tests

- **Test:** `webGLContextDate_ShouldFallbackToCanvas2D`
    - **Setup:** Mock WebGL context creation failure.
    - **Expect:** Renderer switches to 2D Fallback view silently.
