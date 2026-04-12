
import { AbsTime, DomainId } from '../../core/types';
import { TrunkId, TrophicLevel, GenomeModule } from '../../core/species/types';
import { SpeciesTemplate } from '../../core/species/templates';
import { BiomeType } from '../../types';
import { PseudoRandom } from '../../services/noise';
import { generateHexName } from '../../services/terrain/nameGenerator'; // Reusing name gen for now

/**
 * BestiarySystem
 * Manages the registry of all known/evolved species.
 * Generates concrete species from abstract trunks.
 * Follows spec ID: 17-bestiary.
 */
export class BestiarySystem {
  private speciesRegistry = new Map<string, SpeciesTemplate>();
  private speciesByTrunk = new Map<TrunkId, string[]>();

  public registerSpecies(template: SpeciesTemplate) {
    this.speciesRegistry.set(template.id, template);
    
    if (!this.speciesByTrunk.has(template.trunk)) {
      this.speciesByTrunk.set(template.trunk, []);
    }
    this.speciesByTrunk.get(template.trunk)!.push(template.id);
  }

  public getSpecies(id: string): SpeciesTemplate | undefined {
    return this.speciesRegistry.get(id);
  }

  public getAllSpecies(): SpeciesTemplate[] {
    return Array.from(this.speciesRegistry.values());
  }

  /**
   * Procedurally generates a new species from a Trunk root.
   */
  public createFromTrunk(
    trunk: TrunkId, 
    biome: BiomeType, 
    level: TrophicLevel, 
    time: AbsTime,
    seed: number
  ): SpeciesTemplate {
    const rng = new PseudoRandom(seed);
    const id = `sp-${trunk}-${time.toString()}-${Math.floor(rng.next() * 1000)}`;
    
    // Generate Name
    const nameSeed = rng.next() * 10000;
    const name = generateHexName(nameSeed, biome) + (level === TrophicLevel.Producer ? " Flora" : " Fauna");

    // Base Modules
    const modules: GenomeModule[] = [];
    if (level === TrophicLevel.Producer) {
        modules.push(GenomeModule.OxygenicPhotosyn);
        modules.push(GenomeModule.LigninAnalog);
    } else {
        modules.push(GenomeModule.AerobicRespiration);
        modules.push(GenomeModule.NervousToolkit);
        if (level === TrophicLevel.Apex) modules.push(GenomeModule.MineralizedSupport);
    }

    const template: SpeciesTemplate = {
      id,
      name,
      trunk,
      trophicLevel: level,
      modules,
      preferredBiome: biome,
      description: `A ${level === 0 ? 'photosynthetic' : 'heterotrophic'} organism adapted to ${biome.toLowerCase().replace('_', ' ')}.`,
      adaptability: 0.5 + (rng.next() * 0.2),
      aggression: level > 1 ? 0.6 + (rng.next() * 0.4) : 0.1,
      metabolism: 0.5,
      evolutionTick: time
    };

    this.registerSpecies(template);
    return template;
  }
}
