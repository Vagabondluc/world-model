
import { DomainId, MathPPM, TagId } from '../../core/types';
import { mulPPM, divPPM, PPM_ONE } from '../../core/math';
import { ISimDomain } from '../../core/time/types';
import { NeedState, ActionDef, DecisionExplain } from './types';
import { ACTIONS } from './ActionCatalog';
import { hash64 } from '../../core/rng';

/**
 * NeedEngine
 * Deterministic utility engine for entity-level motivations.
 * Implements Spec: 39-deterministic-utility-decision
 */
export class NeedEngine implements ISimDomain {
  public readonly id = DomainId.CIVILIZATION_NEEDS;

  private needs: Map<string, NeedState[]> = new Map();
  private decisionLog: DecisionExplain[] = [];

  /**
   * Evaluates actions for an entity and selects the best one deterministically.
   * Score = (NeedPressure * Relief) - Cost - Risk
   */
  public evaluateDecisions(entityId: string, seed: number): ActionDef | null {
    const entityNeeds = this.needs.get(entityId);
    if (!entityNeeds || entityNeeds.length === 0) return null;

    let bestAction: ActionDef | null = null;
    let bestScore = -Infinity;
    let explain: DecisionExplain | null = null;

    // Filter valid actions based on current needs
    // Optimization: Only check actions that address needs with Pressure > 0
    const relevantActions = ACTIONS.filter(a => {
        const need = entityNeeds.find(n => n.id === a.targetNeed);
        return need && need.levelPPM > 0;
    });

    for (const action of relevantActions) {
      const need = entityNeeds.find(n => n.id === action.targetNeed)!;
      
      // Terms
      // 1. Need Pressure = (Level * Weight) / 1M
      const pressure = mulPPM(need.levelPPM, need.weightPPM);
      
      // 2. Need Term = Pressure * Relief
      const needTerm = mulPPM(pressure, action.reliefPPM);
      
      // 3. Cost Term = CostPPM (Flat for now, could be weighted by scarcity)
      const costTerm = action.costPPM;
      
      // 4. Risk Term = RiskPPM
      const riskTerm = action.riskPPM;

      // Score
      const score = needTerm - costTerm - riskTerm;

      if (score > bestScore) {
        bestScore = score;
        bestAction = action;
        explain = {
            time: 0n, // Filled by caller/tracer if needed
            entityId,
            actionId: action.id,
            dominantNeed: action.targetNeed,
            score,
            terms: { need: needTerm, cost: costTerm, risk: riskTerm }
        };
      } else if (score === bestScore && bestAction) {
        // Deterministic Tie-Break
        // 1. Lower Risk wins
        if (action.riskPPM < bestAction.riskPPM) {
            bestAction = action;
        } 
        // 2. ID Hash wins (Using simple string comparison as proxy for hash stability)
        else if (action.id < bestAction.id) {
            bestAction = action;
        }
      }
    }

    if (explain) {
        // Keep log small
        if (this.decisionLog.length > 50) this.decisionLog.shift();
        this.decisionLog.push(explain);
    }

    return bestAction;
  }

  public step(): void {
    // Needs decay/increase based on environmental pressure
    this.needs.forEach((entityNeeds) => {
      for (const need of entityNeeds) {
        // Natural decay toward satisfaction (placeholder simulation)
        // In full impl, this would be driven by world events
        need.levelPPM = Math.max(0, need.levelPPM - 1000);
      }
    });
  }

  public regenerateTo(): void {
    // Reset to baseline weights
    this.needs.clear();
    this.decisionLog = [];
  }

  public setEntityNeeds(entityId: string, needs: NeedState[]) {
    this.needs.set(entityId, needs);
  }

  public getDecisionLog(): DecisionExplain[] {
      return this.decisionLog;
  }
}
