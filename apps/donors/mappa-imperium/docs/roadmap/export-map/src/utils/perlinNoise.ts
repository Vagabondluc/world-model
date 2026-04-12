
/**
 * A lightweight 2D Perlin Noise implementation.
 * Based on the standard improved Perlin noise algorithm.
 */
export class PerlinNoise {
    private permutation: number[] = [];
    private p: number[] = [];

    constructor(seed: number = Math.random()) {
        this.seed(seed);
    }

    public seed(seed: number) {
        this.permutation = new Array(256);
        for (let i = 0; i < 256; i++) {
            this.permutation[i] = i;
        }

        // Shuffle based on seed
        let currentSeed = seed;
        const next = () => {
            currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
            return currentSeed / 4294967296;
        };

        for (let i = 255; i > 0; i--) {
            const j = Math.floor(next() * (i + 1));
            [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
        }

        // Duplicate for overflow
        this.p = new Array(512);
        for (let i = 0; i < 512; i++) {
            this.p[i] = this.permutation[i % 256];
        }
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(t: number, a: number, b: number): number {
        return a + t * (b - a);
    }

    private grad(hash: number, x: number, y: number, z: number): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    // 2D Noise
    public noise(x: number, y: number): number {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const A = this.p[X] + Y;
        const B = this.p[X + 1] + Y;

        return this.lerp(v,
            this.lerp(u,
                this.grad(this.p[A], x, y, 0),
                this.grad(this.p[B], x - 1, y, 0)
            ),
            this.lerp(u,
                this.grad(this.p[A + 1], x, y - 1, 0),
                this.grad(this.p[B + 1], x - 1, y - 1, 0)
            )
        );
    }

    // Octave Noise for more natural terrain
    public octaveNoise(x: number, y: number, octaves: number, persistence: number): number {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;  // Used for normalizing result to 0.0 - 1.0

        for (let i = 0; i < octaves; i++) {
            total += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue;
    }
}
