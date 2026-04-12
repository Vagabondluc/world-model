
import { TagId, MathPPM, AbsTime } from '../../core/types';

export interface ActionDef {
  id: string;
  targetNeed: TagId;
  reliefPPM: MathPPM; // Amount this action reduces the need
  costPPM: MathPPM;   // Resource cost proxy
  riskPPM: MathPPM;   // Failure risk
  cooldownTicks: number;
}

export interface DecisionExplain {
  time: AbsTime;
  entityId: string;
  actionId: string;
  dominantNeed: TagId;
  score: number;
  terms: {
    need: number;
    cost: number;
    risk: number;
  };
}

export interface NeedState {
  id: TagId;
  levelPPM: MathPPM;  // 0..1M (Intensity)
  weightPPM: MathPPM; // 0..1M (Priority)
}
