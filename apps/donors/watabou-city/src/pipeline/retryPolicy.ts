// @ts-nocheck
/**
 * Computes deterministic seed jumps for retry policy.
 */
export class DeterministicJump {
  private static readonly PRIME = 7919; // Prime number for jump calculation
  
  /**
   * Computes the next seed from the current seed using deterministic jump.
   */
  static compute(currentSeed: number): number {
    return currentSeed + DeterministicJump.PRIME;
  }
}

/**
 * Retry policy for city generation.
 */
export class RetryPolicy {
  private maxRetries: number;
  
  constructor(maxRetries: number = 4) {
    this.maxRetries = maxRetries;
  }
  
  /**
   * Gets the seeds for all possible attempts.
   */
  getAttemptSeeds(initialSeed: number): number[] {
    const seeds = [initialSeed];
    let currentSeed = initialSeed;
    
    for (let i = 0; i < this.maxRetries; i++) {
      currentSeed = DeterministicJump.compute(currentSeed);
      seeds.push(currentSeed);
    }
    
    return seeds;
  }
  
  /**
   * Gets the maximum number of retries.
   */
  getMaxRetries(): number {
    return this.maxRetries;
  }
  
  /**
   * Checks if more retries are available.
   */
  canRetry(currentAttempt: number): boolean {
    return currentAttempt < this.maxRetries;
  }
}
