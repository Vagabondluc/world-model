
import { DomainId, AbsTime } from '../../core/types';
import { ISimDomain } from '../../core/time/types';
import { OxState, TrunkId, GenomeModule } from '../../core/species/types';
import { SimTracer } from '../history/EventTracer';

/**
 * LifeEngine
 * Manages the high-level biological state of the planet:
 * - Lineage Trunks (Bacteria, Archaea, Eukarya)
 * - Major Evolutionary Gates (Oxygenation, Eukaryogenesis)
 * Follows spec ID: 10-life-engine.
 */
export class LifeEngine implements ISimDomain {
  public readonly id = DomainId.EVOLUTION_BRANCHING;

  // State
  private oxState: OxState = OxState.Anoxic;
  private activeTrunks: Set<TrunkId> = new Set();
  private unlockedModules: Set<GenomeModule> = new Set();
  
  // Gate Flags
  private hasOxygenationOccurred = false;
  private hasEukaryogenesisOccurred = false;

  // Inputs
  private biosphereCapacity: number = 0;
  private magnetosphereHealth: number = 0;

  public step(): void {
    // 1. LUCA Bootstrap (Single Event)
    // If planet is habitable and sterile, spawn root trunks.
    if (this.activeTrunks.size === 0 && this.biosphereCapacity > 0.1 && this.magnetosphereHealth > 0.2) {
      this.bootstrapLife();
    }

    // 2. Oxygenation Gate
    if (!this.hasOxygenationOccurred && this.activeTrunks.has(TrunkId.Bacteria)) {
      // Chance to evolve Oxygenic Photosynthesis if capacity is high enough
      if (this.biosphereCapacity > 0.3) {
        this.triggerOxygenation();
      }
    }

    // 3. Eukaryogenesis Gate
    if (this.hasOxygenationOccurred && !this.hasEukaryogenesisOccurred) {
      // Needs time and oxygen
      if (this.oxState === OxState.O2Rich && this.biosphereCapacity > 0.5) {
        this.triggerEukaryogenesis();
      }
    }
  }

  private bootstrapLife() {
    this.activeTrunks.add(TrunkId.Bacteria);
    this.activeTrunks.add(TrunkId.Archaea);
    this.unlockedModules.add(GenomeModule.CoreTranslation);
    
    SimTracer.trace({
      time: 0n, // Context dependent
      domain: this.id,
      title: "Abiogenesis",
      message: "First self-replicating prokaryotic cells have emerged. The chain of life begins.",
      severity: 'info'
    });
  }

  private triggerOxygenation() {
    this.hasOxygenationOccurred = true;
    this.oxState = OxState.O2Rich;
    this.unlockedModules.add(GenomeModule.OxygenicPhotosyn);
    this.unlockedModules.add(GenomeModule.AerobicRespiration);

    SimTracer.trace({
      time: 0n,
      domain: this.id,
      title: "Great Oxidation Event",
      message: "Atmospheric oxygen levels are rising due to photosynthetic activity. Energetic metabolism is now possible.",
      severity: 'warning' // Warning because it kills anaerobes
    });
  }

  private triggerEukaryogenesis() {
    this.hasEukaryogenesisOccurred = true;
    this.unlockedModules.add(GenomeModule.EndosymbiontMito);
    this.unlockedModules.add(GenomeModule.EndosymbiontPlastid);
    
    // Unlock complex trunks
    this.activeTrunks.add(TrunkId.Eukarya_Opisthokonta);
    this.activeTrunks.add(TrunkId.Eukarya_Archaeplastida);
    this.activeTrunks.add(TrunkId.Eukarya_SAR);

    SimTracer.trace({
      time: 0n,
      domain: this.id,
      title: "Eukaryogenesis",
      message: "Complex cells with nuclei and organelles have formed. The path to multicellularity is open.",
      severity: 'info'
    });
  }

  public regenerateTo(tNowUs: AbsTime): void {
    // Reset to sterile
    this.activeTrunks.clear();
    this.unlockedModules.clear();
    this.oxState = OxState.Anoxic;
    this.hasOxygenationOccurred = false;
    this.hasEukaryogenesisOccurred = false;
  }

  public setInputs(capacity: number, magHealth: number) {
    this.biosphereCapacity = capacity;
    this.magnetosphereHealth = magHealth;
  }

  public getOxState(): OxState { return this.oxState; }
  public getActiveTrunks(): TrunkId[] { return Array.from(this.activeTrunks); }
}
