/**
 * Stability Manager
 * Handles crash loop detection and memory monitoring to prevent repeated failures.
 */

export class StabilityManager {
    private static readonly CRASH_COUNT_KEY = 'app_crash_count';
    private static readonly SAFE_MODE_KEY = 'app_safe_mode';
    private static readonly CRASH_THRESHOLD = 3;
    private static readonly MEMORY_LIMIT_MB = 1000; // Mock limit for non-browser envs

    // Simple event dispatcher pattern
    private listeners: { [key: string]: Array<() => void> } = {};

    constructor() {
        this.checkCrashLoop();
    }

    /**
     * Call this on app startup.
     * Increments crash count. Must be cleared by reportSuccessfulLoad() later.
     */
    private checkCrashLoop(): void {
        const count = parseInt(localStorage.getItem(StabilityManager.CRASH_COUNT_KEY) || '0', 10);

        if (count >= StabilityManager.CRASH_THRESHOLD) {
            console.warn('StabilityManager: Crash loop detected. Enabling Safe Mode.');
            this.setSafeMode(true);
        } else {
            localStorage.setItem(StabilityManager.CRASH_COUNT_KEY, (count + 1).toString());
        }
    }

    /**
     * Call this once the app has successfully loaded (e.g., 10 seconds stable).
     */
    public reportSuccessfulLoad(): void {
        localStorage.setItem(StabilityManager.CRASH_COUNT_KEY, '0');
    }

    public isSafeMode(): boolean {
        return localStorage.getItem(StabilityManager.SAFE_MODE_KEY) === 'true';
    }

    public setSafeMode(enabled: boolean): void {
        localStorage.setItem(StabilityManager.SAFE_MODE_KEY, enabled ? 'true' : 'false');
    }

    /**
     * Monitor memory usage (Mock implementation for now as performance.memory is non-standard)
     */
    public checkMemoryUsage(mockUsageMb?: number): void {
        // In a real browser, we might use (performance as any).memory?.usedJSHeapSize
        const usage = mockUsageMb || 0;

        if (usage > StabilityManager.MEMORY_LIMIT_MB) {
            this.emit('LOW_MEMORY_WARNING');
        }
    }

    public on(event: string, callback: () => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    private emit(event: string): void {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb());
        }
    }

    public reset(): void {
        localStorage.removeItem(StabilityManager.CRASH_COUNT_KEY);
        localStorage.removeItem(StabilityManager.SAFE_MODE_KEY);
    }
}
