export interface RNG {
  next(): number; // [0, 1)
  nextInt(min: number, max: number): number;
  pick<T>(arr: T[]): T;
  shuffle<T>(arr: T[]): T[];
}

export function createRNG(seed: string): RNG {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  // xorshift32 state
  let s = h === 0 ? 1 : h >>> 0;

  function next(): number {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  }

  return {
    next,
    nextInt(min: number, max: number) {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    pick<T>(arr: T[]): T {
      return arr[Math.floor(next() * arr.length)];
    },
    shuffle<T>(arr: T[]): T[] {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  };
}
