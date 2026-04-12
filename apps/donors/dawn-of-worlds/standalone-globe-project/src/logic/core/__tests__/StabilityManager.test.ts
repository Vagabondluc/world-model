import { StabilityManager } from '../StabilityManager';

describe('StabilityManager', () => {
    let stabilityManager: StabilityManager;

    beforeEach(() => {
        // Mock localStorage
        let store: { [key: string]: string } = {};

        const mockStorage = {
            getItem: (key: string) => store[key] || null,
            setItem: (key: string, value: string) => {
                store[key] = value.toString();
            },
            removeItem: (key: string) => {
                delete store[key];
            },
            clear: () => {
                store = {};
            }
        };

        Object.defineProperty(window, 'localStorage', {
            value: mockStorage,
            writable: true
        });

        stabilityManager = new StabilityManager();
        stabilityManager.reset();
    });

    it('crashloopDetector_ShouldTriggerSafeMode', () => {
        // Simulate 3 crashes: Instantiating manager 3 times without reportSuccessfulLoad
        new StabilityManager(); // 1
        new StabilityManager(); // 2

        new StabilityManager(); // 3 (Threshold reached?)
        // logic: initial=0. 1st init -> sets 1. 2nd init -> sets 2. 3rd init -> sets 3.

        const manager4 = new StabilityManager(); // 4 -> Should detect >= 3

        expect(manager4.isSafeMode()).toBe(true);
    });

    it('should reset crash count on successful load', () => {
        const mgr = new StabilityManager(); // sets count to 1
        mgr.reportSuccessfulLoad();

        expect(localStorage.getItem('app_crash_count')).toBe('0');
    });

    it('memoryMonitor_ShouldWarnAtThreshold', () => {
        let warningTriggered = false;
        const mgr = new StabilityManager();

        mgr.on('LOW_MEMORY_WARNING', () => {
            warningTriggered = true;
        });

        // Mock usage 1200MB > 1000MB Limit
        mgr.checkMemoryUsage(1200);

        expect(warningTriggered).toBe(true);
    });
});
