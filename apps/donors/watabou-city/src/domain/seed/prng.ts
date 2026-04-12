// @ts-nocheck
/**
 * Deterministic Pseudo-Random Number Generator using Mulberry32.
 */
export class PRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /**
   * Returns a float in [0, 1)
   */
  nextFloat(): number {
    let t = (this.state += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns an integer in [lo, hi)
   */
  nextInt(lo: number, hi: number): number {
    return Math.floor(this.nextFloat() * (hi - lo)) + lo;
  }

  /**
   * Returns true with probability p
   */
  bernoulli(p: number): boolean {
    return this.nextFloat() < p;
  }

  /**
   * Creates a new PRNG derived from the current state and a key.
   */
  fork(key: string | number): PRNG {
    const keyStr = String(key);
    let h = this.state;
    for (let i = 0; i < keyStr.length; i++) {
      h = (Math.imul(31, h) + keyStr.charCodeAt(i)) | 0;
    }
    return new PRNG(h);
  }
}
