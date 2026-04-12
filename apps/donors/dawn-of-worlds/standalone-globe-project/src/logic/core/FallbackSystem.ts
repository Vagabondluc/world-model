/**
 * Fallback System
 * Detects WebGL capabilities and provides fallback rendering options.
 */

export class FallbackSystem {
    private static force2D = false;

    /**
     * Checks if WebGL is available and working.
     */
    public static isWebGLAvailable(): boolean {
        if (this.force2D) return false;

        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    /**
     * Simulates a critical graphics failure that forces 2D mode.
     */
    public static forceFail(): void {
        this.force2D = true;
    }

    public static reset(): void {
        this.force2D = false;
    }

    /**
     * Suggests the best available renderer type.
     */
    public static getRecommendedRenderer(): 'WEBGL' | 'CANVAS_2D' {
        if (this.isWebGLAvailable()) {
            return 'WEBGL';
        }
        return 'CANVAS_2D';
    }
}
