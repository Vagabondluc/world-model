
import { Scheduler } from '../core/time/Scheduler';
import { DomainId, DomainMode, AbsTime } from '../core/types';
import { 
  YEAR_US, CLIMATE_QUANTUM_US, TECTONICS_QUANTUM_US, 
  MAGNETOSPHERE_QUANTUM_US, CIVILIZATION_QUANTUM_US 
} from '../core/time/Constants';
import { MagnetosphereDomain } from './physics/Magnetosphere';
import { EnergyBalanceModel } from './climate/EnergyBalanceModel';
import { CarbonCycleDomain } from './climate/CarbonCycle';
import { BiosphereCapacityDomain } from './biosphere/BiosphereCapacity';
import { NeedEngine } from './history/NeedEngine';
import { ABCDHydrology } from './hydrology/ABCDHydrology';
import { RegimeManager } from './civilization/RegimeManager';
import { SimTracer } from './history/EventTracer';
import { LifeEngine } from './life/LifeEngine';
import { TrophicEnergyDomain } from './life/TrophicSystem';
import { RefugiaDomain } from './life/RefugiaDomain';
import { PopulationDynamics } from './life/PopulationDynamics';
import { BestiarySystem } from './life/BestiarySystem';
import { AdaptiveRadiation } from './life/AdaptiveRadiation';
import { TechTreeDomain } from './civilization/TechTree';
import { PressureSystem } from './civilization/PressureSystem';
import { FactionSystem } from './civilization/FactionSystem';
import { NarrativeEngine } from './narrative/NarrativeEngine';
import { MythEngine } from './narrative/MythEngine';
import { EpochManager } from './geology/EpochManager';

// Zustand Stores for UI Sync
import { useSimulationStore } from '../update/zustand/simulationStore';
import { usePlanetaryStore } from '../update/zustand/planetaryStore';
import { useBiosphereStore } from '../update/zustand/biosphereStore';
import { useWorldStore } from '../stores/useWorldStore'; // Need access to config for orbital params

/**
 * SimEngine
 * Central singleton orchestrating the Orbis 2.0 deterministic engine.
 */
class SimEngine {
  public readonly scheduler: Scheduler;
  
  // Domains
  public readonly magnetosphere = new MagnetosphereDomain();
  public readonly climate = new EnergyBalanceModel();
  public readonly carbon = new CarbonCycleDomain();
  public readonly biosphere = new BiosphereCapacityDomain();
  public readonly hydrology = new ABCDHydrology();
  
  // Phase 8 & 9 & 10: Life, Ecology, Speciation
  public readonly life = new LifeEngine();
  public readonly trophic = new TrophicEnergyDomain();
  public readonly refugia = new RefugiaDomain();
  public readonly population = new PopulationDynamics();
  public readonly bestiary = new BestiarySystem();
  public readonly radiation = new AdaptiveRadiation(this.bestiary, this.population);

  // Phase 11: Advanced Civilization
  public readonly tech = new TechTreeDomain();
  public readonly pressure = new PressureSystem();
  public readonly factions = new FactionSystem();

  // Phase 12 & 10: Narrative & Myths
  public readonly narrative = new NarrativeEngine();
  public readonly myths = new MythEngine();

  // Phase 29: Geology
  public readonly epoch = new EpochManager();

  // History/Civ (Legacy + Core)
  public readonly needs = new NeedEngine();
  public readonly regime = new RegimeManager();

  private lastPolarity: number = 1;

  constructor() {
    this.scheduler = new Scheduler();

    // 1. Planet Physics (Geologic Domain + Magnetosphere + Epochs)
    this.scheduler.registerDomain({
      domain: DomainId.PLANET_PHYSICS,
      quantumUs: MAGNETOSPHERE_QUANTUM_US,
      stepUs: MAGNETOSPHERE_QUANTUM_US,
      mode: DomainMode.Step,
      maxCatchupSteps: 200
    }, this.magnetosphere);

    // 2. Climate (Seasonal/Yearly Domain)
    this.scheduler.registerDomain({
      domain: DomainId.CLIMATE,
      quantumUs: CLIMATE_QUANTUM_US,
      stepUs: YEAR_US / 12n, // Monthly steps for better seasonal resolution
      mode: DomainMode.Step,
      maxCatchupSteps: 240
    }, this.climate);

    // 3. Hydrology (Yearly Domain)
    this.scheduler.registerDomain({
      domain: DomainId.HYDROLOGY,
      quantumUs: YEAR_US,
      stepUs: YEAR_US,
      mode: DomainMode.Step,
      maxCatchupSteps: 500
    }, this.hydrology);

    // 4. Biosphere (Yearly Domain)
    this.scheduler.registerDomain({
      domain: DomainId.BIOSPHERE_CAPACITY,
      quantumUs: YEAR_US,
      stepUs: YEAR_US,
      mode: DomainMode.Step,
      maxCatchupSteps: 500
    }, this.biosphere);

    // Phase 8: Life & Evolution
    this.scheduler.registerDomain({
      domain: DomainId.EVOLUTION_BRANCHING,
      quantumUs: YEAR_US * 100n,
      stepUs: YEAR_US * 100n,
      mode: DomainMode.Step,
      maxCatchupSteps: 50
    }, this.life);

    this.scheduler.registerDomain({
      domain: DomainId.TROPHIC_ENERGY,
      quantumUs: YEAR_US,
      stepUs: YEAR_US,
      mode: DomainMode.Step,
      maxCatchupSteps: 100
    }, this.trophic);

    // Phase 9: Ecology & Population
    this.scheduler.registerDomain({
      domain: DomainId.REFUGIA_COLONIZATION,
      quantumUs: YEAR_US,
      stepUs: YEAR_US,
      mode: DomainMode.Step,
      maxCatchupSteps: 100
    }, this.refugia);

    this.scheduler.registerDomain({
      domain: DomainId.POP_DYNAMICS,
      quantumUs: YEAR_US,
      stepUs: YEAR_US,
      mode: DomainMode.Step,
      maxCatchupSteps: 100
    }, this.population);

    // Phase 11: Advanced Civilization
    this.scheduler.registerDomain({
        domain: DomainId.CIVILIZATION_TECH,
        quantumUs: YEAR_US,
        stepUs: YEAR_US,
        mode: DomainMode.Step,
        maxCatchupSteps: 100
    }, this.tech);

    this.scheduler.registerDomain({
        domain: DomainId.CIVILIZATION_PRESSURE,
        quantumUs: YEAR_US,
        stepUs: YEAR_US,
        mode: DomainMode.Step,
        maxCatchupSteps: 100
    }, this.pressure);

    this.scheduler.registerDomain({
        domain: DomainId.CIVILIZATION_FACTIONS,
        quantumUs: YEAR_US,
        stepUs: YEAR_US,
        mode: DomainMode.Step,
        maxCatchupSteps: 100
    }, this.factions);

    // Phase 12 & 10: Narrative & Myths
    this.scheduler.registerDomain({
        domain: DomainId.NARRATIVE_LOG,
        quantumUs: YEAR_US,
        stepUs: YEAR_US,
        mode: DomainMode.Step,
        maxCatchupSteps: 500
    }, this.narrative);

    // Myths run on same clock as Narrative for now
    this.scheduler.registerDomain({
        domain: DomainId.MYTHOS,
        quantumUs: YEAR_US,
        stepUs: YEAR_US,
        mode: DomainMode.Step,
        maxCatchupSteps: 500
    }, this.myths);

    // Legacy Civ Systems
    this.scheduler.registerDomain({
      domain: DomainId.CIVILIZATION_NEEDS,
      quantumUs: YEAR_US,
      stepUs: YEAR_US,
      mode: DomainMode.Step,
      maxCatchupSteps: 100
    }, this.needs);

    this.scheduler.registerDomain({
      domain: DomainId.CIVILIZATION_BEHAVIOR,
      quantumUs: YEAR_US,
      stepUs: YEAR_US,
      mode: DomainMode.Step,
      maxCatchupSteps: 100
    }, this.regime);
  }

  /**
   * Bridges the 2.0 Simulation into the UI/Main loop.
   */
  public update(dtUs: bigint) {
    // 1. Sync Cross-Domain Inputs before Ticking
    
    // --- Orbital / Seasons ---
    // Read directly from WorldStore to get the configured year length
    const { config } = useWorldStore.getState();
    const yearLengthSec = config.orbital.dayLengthSeconds * config.orbital.yearLengthDays;
    const absTime = this.scheduler.getAbsoluteTime();
    
    // Calculate year phase 0..1
    const absSeconds = Number(absTime / 1_000_000n);
    const yearPhase = (absSeconds % yearLengthSec) / yearLengthSec;
    const yearPhasePPM = Math.floor(yearPhase * 6_283_185); // 0..2PI scaled

    this.climate.setSeason(yearPhasePPM);
    this.climate.setAxialTilt(config.orbital.axialTilt);

    // --- Hydrology <-> Climate Feedback ---
    this.climate.setMeanEvaporation(this.hydrology.getMeanEvaporation());

    // --- Epoch Inputs ---
    const volcanism = this.epoch.getVolcanismMultiplier() * 0.5;
    const solar = this.epoch.getSolarMultiplier(); 
    const equatorialTempC = this.climate.getTemperature(9);
    
    this.carbon.setInputs(
      volcanism, 
      this.hydrology.getMeanRunoff(), 
      equatorialTempC + 273.15,
      1.0, // ice gate
      0.3  // land gate
    );

    const radStress = this.magnetosphere.getRadiationStress();
    const magHealth = this.magnetosphere.getHealth();

    this.biosphere.setInputs(
      equatorialTempC + 273.15,
      this.hydrology.getMeanRunoff(),
      radStress,
      1.0,    // atm
      0.7     // ocean
    );

    // Phase 8: Life Inputs
    const capacityPPM = Math.floor(this.biosphere.getCapacity() * 1_000_000);
    const radStressPPM = Math.floor(radStress * 1_000_000);
    
    this.life.setInputs(this.biosphere.getCapacity(), magHealth);
    this.trophic.setInputs(capacityPPM, radStressPPM);

    // Phase 9: Ecology Inputs
    this.refugia.setInputs(equatorialTempC + 273.15, radStress, this.biosphere.getCapacity());
    
    const energyLevels = [0, 1, 2, 3, 4].map(l => this.trophic.getEnergyAtLevel(l));
    this.population.setInputs(
      this.life.getActiveTrunks(),
      energyLevels,
      this.refugia.getRefugiaScore()
    );

    // Phase 11: Civ Pipeline
    this.pressure.setTechEmissions(this.tech.getEmissions());
    this.factions.setPressures(this.pressure.getState());

    // Sync Regime
    const pState = this.pressure.getState();
    const scarcity = pState.economy.resource_pressure / 1_000_000;
    const threat = pState.population.unrest / 1_000_000;
    this.regime.setPressures(scarcity, threat);

    // Phase 12: Narrative Time
    this.narrative.setTime(absTime);

    // Phase 10: Narrative -> Myth Pipeline
    // Feed new chronicle entries to Myth Engine
    const recentChronicle = this.narrative.getChronicle().slice(0, 5); // Just checking recent
    for (const entry of recentChronicle) {
        // Simple dedupe or check if handled
        // For v1 we assume MythEngine tracks statefulness internally (it does)
        // Ensure inputs to PPM logic are integers
        this.myths.ingestEvent(entry, { crisisPPM: Math.floor(threat * 1_000_000) });
    }

    // 2. Advance Time
    this.scheduler.tick(dtUs);

    // Manual Step for sub-systems sharing domain slots or running on long-ticks
    this.radiation.step();
    
    // Step Epoch (Geology) - Slow tick
    if (dtUs > YEAR_US) {
        this.epoch.step();
    }

    // 3. UI State Sync (Zustand Integration)
    this.syncUIStores();

    // 4. Narrative Signal Checks (Legacy)
    const polarity = this.magnetosphere.getPolarity();
    if (polarity !== this.lastPolarity) {
      SimTracer.emit(DomainId.PLANET_PHYSICS, 'MAGNETIC_REVERSAL', {}, 'warning');
      this.lastPolarity = polarity;
    }

    if (radStress > 0.8) {
      if (absTime % (YEAR_US * 100n) === 0n) { 
        SimTracer.emit(DomainId.PLANET_PHYSICS, 'SHIELD_CRITICAL', {}, 'critical');
      }
    }
  }

  /**
   * Pushes authoritative state to Zustand stores for UI consumption.
   */
  private syncUIStores() {
    // Global Time
    useSimulationStore.getState().setAbsTime(this.scheduler.getAbsoluteTime());

    // Planetary Physics
    usePlanetaryStore.getState().setMagnetosphere(this.magnetosphere.getSchemaState());
    usePlanetaryStore.getState().setCarbon(this.carbon.getSchemaState());

    // Biosphere & Trophic
    // Note: We sync specific aggregates or events as needed.
    // Full sync of species list happens only on change in a real scenario.
  }
}

export const SimSystem = new SimEngine();
