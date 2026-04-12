
// A simple pseudorandom number generator using a seed.
// This is not cryptographically secure, but fine for this purpose.
export class SeededRNG {
    private seed: number;

    constructor(seedString: string) {
        this.seed = this.hashCode(seedString);
    }

    private hashCode(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    // Returns a random float between 0 (inclusive) and 1 (exclusive)
    public nextFloat(): number {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
}
