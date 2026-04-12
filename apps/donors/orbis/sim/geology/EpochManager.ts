
import { DomainId, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { GeologicalEpoch, EPOCH_DEFINITIONS, EpochDefinition } from './types';
import { SimTracer } from '../history/EventTracer';

/**
 * EpochManager
 * Manages deep time transitions and applies global modifiers based on the current geological epoch.
 * Follows spec ID: 29.1-geological-epochs.
 */
export class EpochManager implements ISimDomain {
  public readonly id = DomainId.PLANET_PHYSICS; // Shares domain with Magnetosphere for now, or could be separate

  private currentEpoch: GeologicalEpoch = GeologicalEpoch.HADEAN;
  private timeInEpochMyr: number = 0; // Million Years elapsed in current epoch
  
  // Cached active definition
  private activeDefinition: EpochDefinition = EPOCH_DEFINITIONS[GeologicalEpoch.HADEAN];

  // Transition chain
  private readonly SEQUENCE = [
    GeologicalEpoch.HADEAN,
    GeologicalEpoch.ARCHEAN,
    GeologicalEpoch.PROTEROZOIC,
    GeologicalEpoch.PALEOZOIC,
    GeologicalEpoch.MESOZOIC,
    GeologicalEpoch.CENOZOIC,
    GeologicalEpoch.ANTHROPOCENE
  ];

  public step(): void {
    // This domain steps infrequently (e.g. 100k years or 1 Myr per tick)
    // Assuming the scheduler calls this with a delta corresponding to the TECTONICS quantum.
    // For v1 simulation loop, we increment internal counter. 
    
    // Hardcoded increment for now, ideally derived from Scheduler dt
    const dtMyr = 0.1; 
    
    this.timeInEpochMyr += dtMyr;

    if (this.currentEpoch !== GeologicalEpoch.ANTHROPOCENE) {
        if (this.timeInEpochMyr >= this.activeDefinition.durationMyr) {
            this.advanceEpoch();
        }
    }
  }

  private advanceEpoch() {
    const currentIndex = this.SEQUENCE.indexOf(this.currentEpoch);
    if (currentIndex < this.SEQUENCE.length - 1) {
        const nextEpoch = this.SEQUENCE[currentIndex + 1];
        this.setEpoch(nextEpoch);
    }
  }

  public setEpoch(epoch: GeologicalEpoch) {
    this.currentEpoch = epoch;
    this.activeDefinition = EPOCH_DEFINITIONS[epoch];
    this.timeInEpochMyr = 0;

    SimTracer.trace({
        time: 0n, // Context will fill
        domain: this.id,
        title: "Geological Transition",
        message: `The world enters the ${epoch} Eon. ${this.activeDefinition.description}`,
        severity: 'warning'
    });
  }

  public regenerateTo(tNowUs: AbsTime): void {
      // Determine epoch from absolute time if we had a strict mapping.
      // For now, reset to Hadean.
      this.setEpoch(GeologicalEpoch.HADEAN);
  }

  // Getters for other systems
  public getSolarMultiplier(): number { return this.activeDefinition.solarLuminosity; }
  public getVolcanismMultiplier(): number { return this.activeDefinition.volcanismMultiplier; }
  public getCurrentEpoch(): GeologicalEpoch { return this.currentEpoch; }
}
