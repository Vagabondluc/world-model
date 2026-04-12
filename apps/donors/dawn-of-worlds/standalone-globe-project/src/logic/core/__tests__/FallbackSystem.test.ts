import { FallbackSystem } from '../FallbackSystem';

describe('FallbackSystem', () => {

    beforeEach(() => {
        FallbackSystem.reset();
    });

    it('webGLContextDate_ShouldFallbackToCanvas2D', () => {
        // Setup: Mock successful WebGL first
        // In JSDOM, canvas.getContext('webgl') usually returns null or mock,
        // so lets see default behavior. JSDOM usually mocks canvas but not full WebGL.

        // Let's explicitly mock `document.createElement` to control context return
        const originalCreateElement = document.createElement.bind(document);

        // Mock 1: WebGL Supported
        vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'canvas') {
                return {
                    getContext: (_contextId: string) => {
                        if (_contextId === 'webgl' || _contextId === 'experimental-webgl') {
                            return {}; // Mock context object
                        }
                        return null;
                    }
                } as unknown as HTMLCanvasElement;
            }
            return originalCreateElement(tagName);
        });

        // Ensure global type exists for check
        (window as any).WebGLRenderingContext = true;

        expect(FallbackSystem.getRecommendedRenderer()).toBe('WEBGL');

        // Setup: Mock WebGL Failure
        vi.restoreAllMocks(); // clear spy
        vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'canvas') {
                return {
                    getContext: (_contextId: string) => null // No context returned
                } as unknown as HTMLCanvasElement;
            }
            return originalCreateElement(tagName);
        });

        // Expect: Fallback to 2D
        expect(FallbackSystem.getRecommendedRenderer()).toBe('CANVAS_2D');
    });

    it('should allow forcing failure manually', () => {
        // Even if mock supports it...
        vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'canvas') {
                return {
                    getContext: (_contextId: string) => ({})
                } as unknown as HTMLCanvasElement;
            }
            return document.createElement(tagName);
        });

        FallbackSystem.forceFail();

        expect(FallbackSystem.getRecommendedRenderer()).toBe('CANVAS_2D');
    });
});
