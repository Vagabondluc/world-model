
// Robust Deterministic 3D Noise (Simplex-inspired)
export class PseudoRandom {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const PERM = new Uint8Array(512);
const p = new Uint8Array(256);
for (let i = 0; i < 256; i++) p[i] = i;
// Simple shuffle for perm table
const shuffle = (seed: number) => {
  const rng = new PseudoRandom(seed);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
};

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t: number, a: number, b: number) => a + t * (b - a);
const grad = (hash: number, x: number, y: number, z: number) => {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};

export const noise3D = (x: number, y: number, z: number, seed: number): number => {
  // Ensure table is shuffled for this seed (simple caching strategy could improve this if needed)
  shuffle(seed); 
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = PERM[X] + Y, AA = PERM[A] + Z, AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y, BA = PERM[B] + Z, BB = PERM[B + 1] + Z;

  return lerp(w,
    lerp(v, lerp(u, grad(PERM[AA], x, y, z), grad(PERM[BA], x - 1, y, z)),
            lerp(u, grad(PERM[AB], x, y - 1, z), grad(PERM[BB], x - 1, y - 1, z))),
    lerp(v, lerp(u, grad(PERM[AA + 1], x, y, z - 1), grad(PERM[BA + 1], x - 1, y, z - 1)),
            lerp(u, grad(PERM[AB + 1], x, y - 1, z - 1), grad(PERM[BB + 1], x - 1, y - 1, z - 1)))
  );
};

// Fractal Brownian Motion
export const fbm3D = (x: number, y: number, z: number, octaves: number, persistence: number, lacunarity: number, scale: number, seed: number): number => {
  let total = 0, frequency = scale, amplitude = 1, maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    total += noise3D(x * frequency, y * frequency, z * frequency, seed) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return total / maxValue;
};

// Ridged Noise: Creates sharp peaks (good for mountains) instead of lumps
export const ridgedFbm3D = (x: number, y: number, z: number, octaves: number, persistence: number, lacunarity: number, scale: number, seed: number): number => {
  let total = 0, frequency = scale, amplitude = 1, maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    let n = noise3D(x * frequency, y * frequency, z * frequency, seed);
    n = 1.0 - Math.abs(n); // Invert valleys to peaks
    n = n * n; // Sharpen peaks
    total += n * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return total / maxValue;
};

// Domain Warping: Distorts the coordinate space using noise itself for fluid/organic shapes
export const domainWarp3D = (x: number, y: number, z: number, octaves: number, persistence: number, lacunarity: number, scale: number, seed: number): number => {
  const qx = fbm3D(x + 5.2, y + 1.3, z + 0.8, 2, persistence, lacunarity, scale, seed);
  const qy = fbm3D(x - 2.8, y + 5.2, z + 1.2, 2, persistence, lacunarity, scale, seed + 100);
  const qz = fbm3D(x + 1.4, y - 2.8, z + 5.2, 2, persistence, lacunarity, scale, seed + 200);

  // Use the distorted coordinates to sample the final noise
  // We amplify the distortion (4.0) to create strong swirling effects
  return fbm3D(x + 4.0 * qx, y + 4.0 * qy, z + 4.0 * qz, octaves, persistence, lacunarity, scale, seed + 300);
};
