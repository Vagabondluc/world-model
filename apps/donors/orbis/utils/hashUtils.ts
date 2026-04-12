
/**
 * FNV-1a non-cryptographic hash for deterministic seeds from strings.
 */
export function stringToSeed(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Derives a stable UUID from world seed and grid index.
 */
export function deriveHexUuid(worldSeed: number, index: number): string {
  return `hx-${worldSeed}-${index.toString(16).padStart(6, '0')}`;
}
