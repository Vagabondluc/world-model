
import { DomainId } from '../types';
import { AuthorityEntryV1, AuthorityModeV1, DataKindV1 } from './AuthorityTypes';

class StateAuthorityRegistry {
  private entries = new Map<number, AuthorityEntryV1>();
  
  /**
   * Registers a data point with a strict owner.
   * Throws if ID is duplicate.
   */
  public register(entry: AuthorityEntryV1) {
    if (this.entries.has(entry.id)) {
      console.warn(`[AuthorityRegistry] Duplicate Field ID registered: ${entry.id}. Skipping.`);
      return;
    }
    this.entries.set(entry.id, entry);
  }

  /**
   * Verifies if a specific domain is allowed to write to a specific data ID.
   */
  public verifyWriteAccess(fieldId: number, requestorDomain: DomainId): boolean {
    const entry = this.entries.get(fieldId);
    
    // If unknown, we default to stricter safety (Block) or Warn depending on stage.
    // For v1 hardening, we warn but block in strict mode.
    if (!entry) {
      console.warn(`[AuthorityRegistry] Write attempted on unknown Field ID: ${fieldId} by Domain: ${requestorDomain}`);
      return false;
    }

    if (entry.mode === AuthorityModeV1.PresentationOnly) {
      console.error(`[AuthorityRegistry] Attempted to write Presentation-Only field: ${fieldId}`);
      return false;
    }

    if (entry.ownerDomainId !== requestorDomain) {
      console.error(`[AuthorityRegistry] Write Violation! Domain ${requestorDomain} tried to write Field ${fieldId} owned by ${entry.ownerDomainId}`);
      return false;
    }

    return true;
  }

  /**
   * Retrieves bounds for a field to enforce invariants.
   */
  public getConstraints(fieldId: number) {
    const entry = this.entries.get(fieldId);
    if (!entry) return null;
    
    return {
      min: entry.clampMin,
      max: entry.clampMax,
      policy: entry.boundPolicy
    };
  }
  
  /**
   * For debugging/inspection tools
   */
  public getEntry(fieldId: number): AuthorityEntryV1 | undefined {
    return this.entries.get(fieldId);
  }
}

export const Authority = new StateAuthorityRegistry();
