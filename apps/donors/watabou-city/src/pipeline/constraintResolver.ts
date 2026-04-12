// @ts-nocheck
/**
 * Constraint priority levels for conflict resolution.
 */
export enum ConstraintPriority {
  GEOMETRIC_VALIDITY = 0,      // Highest priority
  GATE_CORE_REACHABILITY = 1,  // Second priority
  SCAFFOLD_ALIGNMENT = 2,      // Third priority
  LOCAL_JITTER = 3             // Lowest priority
}

/**
 * Represents a constraint conflict.
 */
export interface ConstraintConflict {
  type: string;
  severity: number;
  priority?: ConstraintPriority;
}

/**
 * Represents a conflict resolution result.
 */
export interface ConflictResolution {
  winner: string;
  appliedConstraints: string[];
  deferredConstraints: string[];
}

/**
 * Resolves constraint conflicts based on priority hierarchy.
 */
export class ConstraintResolver {
  private priorityOrder: ConstraintPriority[] = [
    ConstraintPriority.GEOMETRIC_VALIDITY,
    ConstraintPriority.GATE_CORE_REACHABILITY,
    ConstraintPriority.SCAFFOLD_ALIGNMENT,
    ConstraintPriority.LOCAL_JITTER
  ];

  /**
   * Gets the priority order for constraints.
   */
  getPriorities(): ConstraintPriority[] {
    return [...this.priorityOrder];
  }

  /**
   * Gets the priority level for a constraint type.
   */
  getPriority(type: string): ConstraintPriority {
    switch (type) {
      case 'geometric_validity':
      case 'boundary_valid':
      case 'gates_valid':
        return ConstraintPriority.GEOMETRIC_VALIDITY;
      case 'gate_core_reachability':
      case 'reachability':
        return ConstraintPriority.GATE_CORE_REACHABILITY;
      case 'scaffold_alignment':
      case 'scaffold_driven':
        return ConstraintPriority.SCAFFOLD_ALIGNMENT;
      case 'local_jitter':
      case 'jitter':
      default:
        return ConstraintPriority.LOCAL_JITTER;
    }
  }

  /**
   * Resolves conflicts based on priority.
   */
  resolveConflicts(conflicts: ConstraintConflict[]): ConflictResolution {
    if (conflicts.length === 0) {
      return { winner: '', appliedConstraints: [], deferredConstraints: [] };
    }

    // Assign priorities to conflicts
    const prioritizedConflicts = conflicts.map(c => ({
      ...c,
      priority: c.priority ?? this.getPriority(c.type)
    }));

    // Sort by priority (lower number = higher priority)
    prioritizedConflicts.sort((a, b) => 
      (a.priority ?? ConstraintPriority.LOCAL_JITTER) - 
      (b.priority ?? ConstraintPriority.LOCAL_JITTER)
    );

    const winner = prioritizedConflicts[0].type;
    const appliedConstraints = prioritizedConflicts
      .filter(c => c.priority === prioritizedConflicts[0].priority)
      .map(c => c.type);
    const deferredConstraints = prioritizedConflicts
      .filter(c => c.priority !== prioritizedConflicts[0].priority)
      .map(c => c.type);

    return {
      winner,
      appliedConstraints,
      deferredConstraints
    };
  }

  /**
   * Checks if a constraint should be applied given current state.
   */
  shouldApplyConstraint(
    type: string,
    satisfiedHigherPriorities: boolean
  ): boolean {
    const priority = this.getPriority(type);
    
    // Local jitter can only apply when higher priorities are satisfied
    if (priority === ConstraintPriority.LOCAL_JITTER) {
      return satisfiedHigherPriorities;
    }
    
    return true;
  }
}
