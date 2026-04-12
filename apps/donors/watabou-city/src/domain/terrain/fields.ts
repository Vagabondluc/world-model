// @ts-nocheck
import { PRNG } from '../seed/prng';

export type NoiseField = (x: number, y: number) => number;

/**
 * Generates a 2D noise field using multiple octaves.
 */
export function createNoiseField(seed: number, octaves: number, persistence: number): NoiseField {
  const rng = new PRNG(seed);
  const seeds = Array.from({ length: octaves }, (_, i) => rng.fork(`octave-${i}`).nextInt(0, 1000000));

  return (x: number, y: number) => {
    let sum = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxAmplitude = 0;

    for (let i = 0; i < octaves; i++) {
      sum += amplitude * noise2D(x * frequency, y * frequency, seeds[i]);
      maxAmplitude += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    // Normalize to [-1, 1] range approximately
    return sum / maxAmplitude;
  };
}

/**
 * Simple 2D Gradient Noise implementation.
 */
function noise2D(x: number, y: number, seed: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const u = fade(xf);
  const v = fade(yf);

  const p = getPermutation(seed);
  
  const aa = p[p[X] + Y];
  const ab = p[p[X] + Y + 1];
  const ba = p[p[X + 1] + Y];
  const bb = p[p[X + 1] + Y + 1];

  const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
  const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);

  return lerp(x1, x2, v);
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

const permutationCache = new Map<number, number[]>();

function getPermutation(seed: number): number[] {
  if (permutationCache.has(seed)) return permutationCache.get(seed)!;
  
  const rng = new PRNG(seed);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = rng.nextInt(0, i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  const fullP = [...p, ...p];
  permutationCache.set(seed, fullP);
  return fullP;
}
