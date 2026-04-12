// @ts-nocheck
/**
 * Addendum Resolver Module
 * Handles precedence and conflict resolution between addenda
 */

export interface Conflict {
  topic: string;
  baseRule: { id: string; value: unknown };
  a2Rule: { id: string; value: unknown };
}

export interface ConflictResolution {
  topic: string;
  winner: string;
  appliedValue: unknown;
}

export interface PrecedenceRule {
  addendum: string;
  topic: string;
  priority: number;
}

/**
 * AddendumResolver class handles conflict resolution between different addenda
 */
export class AddendumResolver {
  private precedenceRules: PrecedenceRule[] = [
    { addendum: 'A2', topic: 'river', priority: 100 },
    { addendum: 'A2', topic: 'hydro', priority: 100 },
    { addendum: 'A2', topic: 'bridge', priority: 100 },
    { addendum: 'A1', topic: 'scaffold', priority: 90 },
    { addendum: 'A3', topic: 'local-structure', priority: 80 },
    { addendum: 'A4', topic: 'functional-plausibility', priority: 70 }
  ];
  
  /**
   * Resolves a conflict between rules
   */
  resolveConflict(conflict: Conflict): ConflictResolution {
    // A2 takes precedence for river-related topics
    if (conflict.topic === 'river' || conflict.topic === 'hydro' || conflict.topic === 'bridge') {
      return {
        topic: conflict.topic,
        winner: 'A2',
        appliedValue: conflict.a2Rule.value
      };
    }
    
    // Default to base contract for non-river topics
    return {
      topic: conflict.topic,
      winner: 'base',
      appliedValue: conflict.baseRule.value
    };
  }
  
  /**
   * Gets all precedence rules
   */
  getPrecedenceRules(): PrecedenceRule[] {
    return [...this.precedenceRules];
  }
  
  /**
   * Checks if an addendum has precedence for a topic
   */
  hasAddendumPrecedence(addendum: string, topic: string): boolean {
    const rule = this.precedenceRules.find(
      r => r.addendum === addendum && r.topic === topic
    );
    return rule !== undefined;
  }
}

/**
 * Finds semantic conflicts between base contract and A2 addendum
 */
export function findSemanticConflicts(
  baseContract: { rules: { id: string; topic: string; description: string }[] },
  a2Addendum: { rules: { id: string; topic: string; description: string }[] }
): { topic: string; resolution: string }[] {
  const conflicts: { topic: string; resolution: string }[] = [];
  
  // Find overlapping topics
  const baseTopics = new Set(baseContract.rules.map(r => r.topic));
  const a2Topics = new Set(a2Addendum.rules.map(r => r.topic));
  
  for (const topic of baseTopics) {
    if (a2Topics.has(topic)) {
      // A2 takes precedence for river topics
      const resolution = topic === 'river' ? 'A2' : 'base';
      conflicts.push({ topic, resolution });
    }
  }
  
  return conflicts;
}

/**
 * Resolves a single conflict
 */
export function resolveConflict(conflict: Conflict): ConflictResolution {
  const resolver = new AddendumResolver();
  return resolver.resolveConflict(conflict);
}

/**
 * Gets the river semantics version for a city
 */
export function getRiverSemantics(city: { riverSemantics?: string }): string {
  return city.riverSemantics || 'A2';
}
