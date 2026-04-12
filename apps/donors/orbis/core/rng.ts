import { DomainId } from './types';

/**
 * SplitMix64 - A high-quality 64-bit PRNG primitive.
 * Used for deterministic state-independent hashing.
 */
function splitMix64(state: bigint): bigint {
  state = (state + 0x9e3779b97f4a7c15n) & 0xffffffffffffffffn;
  state = ((state ^ (state >> 30n)) * 0xbf58476d1ce4e5b9n) & 0xffffffffffffffffn;
  state = ((state ^ (state >> 27n)) * 0x94d049bb133111ebn) & 0xffffffffffffffffn;
  return (state ^ (state >> 31n)) & 0xffffffffffffffffn;
}

/**
 * Canonical hash64 generator.
 * Produces a deterministic 64-bit digest from simulation context.
 * 
 * R = f(seed, domain, tick, entity, index)
 */
export function hash64(
  worldSeed: bigint,
  domain: DomainId,
  tick: bigint,
  entityId: bigint = 0n,
  index: number = 0
): bigint {
  // Simple combination via XOR and SplitMix mixing
  let combined = worldSeed;
  combined = splitMix64(combined ^ BigInt(domain));
  combined = splitMix64(combined ^ tick);
  combined = splitMix64(combined ^ entityId);
  combined = splitMix64(combined ^ BigInt(index));
  return combined;
}

/**
 * Returns a deterministic float in range [0, 1) from a 64-bit hash.
 */
export function hashToFloat01(hash: bigint): number {
  // Use the top 53 bits for a standard double precision float
  const mantissa = Number(hash >> 11n);
  return mantissa / 9007199254740992; // 2^53
}

/**
 * Returns a deterministic integer in range [0, n) from a 64-bit hash.
 */
export function hashToInt(hash: bigint, n: number): number {
  if (n <= 0) return 0;
  return Number(hash % BigInt(n));
}
