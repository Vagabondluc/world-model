
import { DomainId, MathPPM, AbsTime, TagId } from '../../core/types';
import { ISimDomain } from '../../core/time/types';

export type RegimeId = 
  | 'FRONTIER' 
  | 'STABLE_STATE' 
  | 'MILITARY_HEGEMONY' 
  | 'TECHNOCRACY' 
  | 'COLLAPSE';

/**
 * RegimeManager
 * Deterministic state machine for civilization transitions.
 * Follows spec ID: 81-regime-transition-state-machine.
 */
export class RegimeManager implements ISimDomain {
  public readonly id = DomainId.CIVILIZATION_BEHAVIOR;

  private currentRegime: RegimeId = 'FRONTIER';
  private stabilityPPM: MathPPM = 1_000_000;
  private legitimacyPPM: MathPPM = 800_000;

  // External Pressures
  private inequalityPPM: MathPPM = 0;
  private threatPPM: MathPPM = 0;

  public step(): void {
    // 1. Update Stability
    const decay = (this.inequalityPPM / 10) + (this.threatPPM / 5);
    this.stabilityPPM = Math.max(0, this.stabilityPPM - Math.floor(decay));

    // 2. Transition Logic (Schmitt Trigger Hysteresis)
    // Entry Threshold: Value must cross this to enter the state
    // Exit Threshold: Value must cross this to leave the state (often lower than entry)
    // Prevents rapid flickering.

    switch (this.currentRegime) {
        case 'FRONTIER':
            // Enter STABLE if very stable
            if (this.stabilityPPM > 900_000) this.transitionTo('STABLE_STATE');
            // Collapse if very unstable
            if (this.stabilityPPM < 200_000) this.transitionTo('COLLAPSE');
            break;

        case 'STABLE_STATE':
            // Exit if stability drops significantly below entry
            if (this.stabilityPPM < 600_000) {
                if (this.threatPPM > 700_000) this.transitionTo('MILITARY_HEGEMONY');
                else this.transitionTo('FRONTIER');
            }
            break;

        case 'MILITARY_HEGEMONY':
            // Exit if threat subsides
            if (this.threatPPM < 400_000) this.transitionTo('STABLE_STATE');
            // Collapse if stability fails
            if (this.stabilityPPM < 100_000) this.transitionTo('COLLAPSE');
            break;

        case 'COLLAPSE':
            // Recovery requires high stability (hard to get in collapse)
            if (this.stabilityPPM > 500_000) this.transitionTo('FRONTIER');
            break;
    }
  }

  private transitionTo(next: RegimeId) {
      this.currentRegime = next;
      // Optional: Emit event or log
  }

  public regenerateTo(tNowUs: AbsTime): void {
    this.currentRegime = 'FRONTIER';
    this.stabilityPPM = 1_000_000;
  }

  public getRegime(): RegimeId { return this.currentRegime; }
  public getStability(): number { return this.stabilityPPM / 1_000_000; }
  
  public setPressures(inequality: number, threat: number) {
    this.inequalityPPM = Math.floor(inequality * 1_000_000);
    this.threatPPM = Math.floor(threat * 1_000_000);
  }
}
