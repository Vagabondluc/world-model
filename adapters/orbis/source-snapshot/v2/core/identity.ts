import xxhash from 'xxhash-wasm';

/**
 * Identity Hash Kernel (Spec 210)
 * Generates an opaque, bit-identical 64-bit ActorId.
 */
export class IdentityKernel {
  private static hasher: any = null;

  /**
   * Initializes the WASM hasher.
   */
  static async init() {
    if (!this.hasher) {
      this.hasher = await xxhash();
    }
  }

  /**
   * Generates a deterministic 64-bit hash from birth metadata.
   * ActorId = hash64(worldSeed, birthHexId, birthTick, populationIndex, salt)
   */
  static generateActorId(
    worldSeed: bigint,
    birthHexId: bigint,
    birthTick: bigint,
    populationIndex: number,
    salt: string
  ): bigint {
    if (!this.hasher) {
      throw new Error('IdentityKernel not initialized. Call init() first.');
    }

    // Concatenate inputs into a stable buffer for hashing
    // Using a string representation for simplicity, but in production 
    // a DataView/Uint8Array is preferred for maximum performance.
    const input = `${worldSeed}:${birthHexId}:${birthTick}:${populationIndex}:${salt}`;
    
    // xxhash64 returns a BigInt string or BigInt depending on version/call
    const hash = this.hasher.h64(input);
    return BigInt(`0x${hash}`);
  }
}
