
import { AbsTime, DomainId, DomainMode } from '../types';
import { DomainClockSpec, DomainClockState, ISimDomain, SimEvent } from './types';
import { divFloor64 } from '../math';

export class Scheduler {
  private tNowUs: AbsTime = 0n;
  private domainSpecs = new Map<DomainId, DomainClockSpec>();
  private domainStates = new Map<DomainId, DomainClockState>();
  private domainInstances = new Map<DomainId, ISimDomain>();
  private domainModes = new Map<DomainId, DomainMode>(); // Runtime mode overrides
  private eventLog: SimEvent[] = [];

  constructor(startTimeUs: AbsTime = 0n) {
    this.tNowUs = startTimeUs;
  }

  registerDomain(spec: DomainClockSpec, instance: ISimDomain, initialState?: DomainClockState) {
    this.domainSpecs.set(spec.domain, spec);
    this.domainInstances.set(spec.domain, instance);
    this.domainStates.set(spec.domain, initialState ?? { lastStepTimeUs: this.tNowUs });
    this.domainModes.set(spec.domain, spec.mode); // Initialize with default mode
  }

  public setDomainMode(id: DomainId, mode: DomainMode) {
    if (this.domainSpecs.has(id)) {
      this.domainModes.set(id, mode);
    }
  }

  public getDomainMode(id: DomainId): DomainMode {
    return this.domainModes.get(id) ?? DomainMode.Frozen;
  }

  /**
   * Advances the simulation clock by dtUs.
   * Triggers domain steps or regenerations based on spec and overflow policy.
   */
  tick(dtUs: bigint): void {
    if (dtUs <= 0n) return;
    this.tNowUs += dtUs;

    // Process domains in order of DomainId (ascending priority)
    const sortedDomainIds = Array.from(this.domainSpecs.keys()).sort((a, b) => a - b);

    for (const id of sortedDomainIds) {
      this.processDomain(id);
    }
  }

  private processDomain(id: DomainId) {
    const spec = this.domainSpecs.get(id)!;
    const state = this.domainStates.get(id)!;
    const instance = this.domainInstances.get(id)!;
    const currentMode = this.domainModes.get(id)!;

    // 1. Frozen: No-op
    if (currentMode === DomainMode.Frozen) return;

    // 2. Determine effective step size
    // HighRes uses quantumUs, Step uses stepUs
    const effectiveStepUs = currentMode === DomainMode.HighRes ? spec.quantumUs : spec.stepUs;
    
    // Safety check for invalid step size
    if (effectiveStepUs <= 0n) return;

    const lag = this.tNowUs - state.lastStepTimeUs;
    
    // Only run if we have accumulated enough lag for at least one step
    // Exception: Regenerate mode always runs to catch up immediately if configured
    if (lag < effectiveStepUs && currentMode !== DomainMode.Regenerate) return;

    const dueSteps = divFloor64(lag, effectiveStepUs);

    // 3. Policy: Escalation to Regenerate
    // If explicitly in Regenerate mode OR lag is too massive
    if (currentMode === DomainMode.Regenerate || Number(dueSteps) > spec.maxCatchupSteps) {
      // Escalation to regeneration if lag is too large or mode is explicit
      instance.regenerateTo(this.tNowUs);
      state.lastStepTimeUs = this.tNowUs;
    } else {
      // 4. Incremental stepping
      const stepsToRun = Number(dueSteps);
      for (let i = 0; i < stepsToRun; i++) {
        instance.step();
      }
      state.lastStepTimeUs += BigInt(stepsToRun) * effectiveStepUs;
    }
  }

  emitEvent(event: SimEvent) {
    // In v1, we append and assume caller handled sorting if needed, 
    // though the spec suggests a two-phase commit.
    this.eventLog.push(event);
  }

  getAbsoluteTime(): AbsTime {
    return this.tNowUs;
  }

  getDomainState(id: DomainId): DomainClockState | undefined {
    return this.domainStates.get(id);
  }
}
