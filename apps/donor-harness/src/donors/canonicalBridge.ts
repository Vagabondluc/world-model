import { useCanonicalStore, WorldRecord } from '../store/canonicalStore'

// Lightweight canonical bridge helpers used by donor shims/components.
// Provides both hook-based and programmatic access patterns.

export function getCanonicalWorld(): WorldRecord | null {
  // Zustand store api is attached to the hook function returned by `create()`
  // Access current state synchronously
  // @ts-ignore - Store API methods are available on the hook object at runtime
  return (useCanonicalStore as any).getState().world
}

export function setCanonicalWorld(w: WorldRecord) {
  ;(useCanonicalStore as any).getState().setWorld(w)
}

export function clearCanonicalWorld() {
  ;(useCanonicalStore as any).getState().clearWorld()
}

export function subscribeCanonical(cb: (w: WorldRecord | null) => void) {
  // Subscribe to world changes; returns unsubscribe
  // Zustand exposes `subscribe(selector, listener)` on the store API
  // @ts-ignore
  const unsubscribe = (useCanonicalStore as any).subscribe((s: any) => s.world, cb)
  return unsubscribe
}

export function useCanonicalBridge() {
  const world = useCanonicalStore((s) => s.world)
  const setWorld = useCanonicalStore((s) => s.setWorld)
  const clearWorld = useCanonicalStore((s) => s.clearWorld)

  return { world, setWorld, clearWorld, getCanonicalWorld, setCanonicalWorld, clearCanonicalWorld, subscribeCanonical }
}

export default useCanonicalBridge
