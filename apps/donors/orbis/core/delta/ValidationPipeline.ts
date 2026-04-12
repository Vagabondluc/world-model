
import { WorldDeltaBatchV1, DeltaOpV1 } from './DeltaTypes';
import { FieldRegistry } from '../registry/FieldRegistry';
import { DomainId } from '../types';

export enum DeltaValidationResult {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface DeltaRejectionTrace {
  batchId: string;
  fieldId: number;
  reasonCode: string;
  message: string;
  value: number;
}

/**
 * Validates WorldDeltaBatch objects against the FieldRegistry and Authority rules.
 * Implements the stateless portion of the Validation Pipeline (Spec 59).
 */
export class ValidationPipeline {
  
  /**
   * Runs the validation pipeline on a delta batch.
   * Returns ACCEPTED if all checks pass, otherwise REJECTED with traces.
   */
  public static validate(batch: WorldDeltaBatchV1): { result: DeltaValidationResult, traces: DeltaRejectionTrace[] } {
    const traces: DeltaRejectionTrace[] = [];

    // Optimization: If batch is empty, accept immediately
    if (batch.deltas.length === 0) {
        return { result: DeltaValidationResult.ACCEPTED, traces: [] };
    }

    for (const entityDelta of batch.deltas) {
      for (const change of entityDelta.changes) {
        const fieldMeta = FieldRegistry[change.fieldId];

        // 1. Registry Validation: Field ID must exist
        if (!fieldMeta) {
          traces.push({
            batchId: batch.id,
            fieldId: change.fieldId,
            reasonCode: 'REGISTRY_MISSING',
            message: `Field ID ${change.fieldId} not found in FieldRegistry`,
            value: change.value
          });
          continue; // Cannot perform further checks on unknown field
        }

        // 2. Authority Validation: Source Domain must be Owner
        // Note: In strict mode, we might allow GOD/ADMIN overrides via a flag, 
        // but for simulation consistency, ownership is absolute.
        if (fieldMeta.owner !== batch.sourceDomain) {
          traces.push({
            batchId: batch.id,
            fieldId: change.fieldId,
            reasonCode: 'AUTHORITY_VIOLATION',
            message: `Domain ${batch.sourceDomain} attempted to write Field ${change.fieldId} (Owned by ${fieldMeta.owner})`,
            value: change.value
          });
        }

        // 3. Payload Range Validation (Stateless)
        // Checks if the intrinsic value violates hard constraints (mostly for SET ops)
        if (fieldMeta.constraints) {
          const { min, max } = fieldMeta.constraints;
          
          if (change.op === DeltaOpV1.SET) {
            if (min !== undefined && change.value < min) {
              traces.push({
                batchId: batch.id,
                fieldId: change.fieldId,
                reasonCode: 'BOUNDS_VIOLATION_MIN',
                message: `Value ${change.value} < Min ${min}`,
                value: change.value
              });
            }
            if (max !== undefined && change.value > max) {
               traces.push({
                batchId: batch.id,
                fieldId: change.fieldId,
                reasonCode: 'BOUNDS_VIOLATION_MAX',
                message: `Value ${change.value} > Max ${max}`,
                value: change.value
              });
            }
          }
          // Note: ADD/SUB bounds checking requires stateful "Precheck" (Phase 27.x extension)
        }
      }
    }

    return {
      result: traces.length > 0 ? DeltaValidationResult.REJECTED : DeltaValidationResult.ACCEPTED,
      traces
    };
  }
}
