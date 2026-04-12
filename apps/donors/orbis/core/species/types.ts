
/**
 * Canonical Species & Genome Types
 * Sources: 
 * - docs/update/specs/07-species-modules.md
 * - docs/update/specs/10-life-engine.md
 */

export type SpeciesId = string;

// Spec 10: Lineage Trunks
export enum TrunkId {
  Bacteria = 'Bacteria',
  Archaea = 'Archaea',
  Eukarya_Opisthokonta = 'Eukarya_Opisthokonta',     // Animals + Fungi
  Eukarya_Archaeplastida = 'Eukarya_Archaeplastida',   // Plants + Algae
  Eukarya_SAR = 'Eukarya_SAR',              // Protist megaclade
  Eukarya_Excavata = 'Eukarya_Excavata',         // Flagellates
  Eukarya_Amoebozoa = 'Eukarya_Amoebozoa',        // Amoebas
}

// Spec 07: Genome Modules
export enum GenomeModule {
  CoreTranslation = 'CoreTranslation',
  OxygenicPhotosyn = 'OxygenicPhotosyn',
  AerobicRespiration = 'AerobicRespiration',
  EndosymbiontMito = 'EndosymbiontMito',
  EndosymbiontPlastid = 'EndosymbiontPlastid',
  MulticellToolkit = 'MulticellToolkit',
  NervousToolkit = 'NervousToolkit',
  MycelialToolkit = 'MycelialToolkit',
  LigninAnalog = 'LigninAnalog',
  MineralizedSupport = 'MineralizedSupport',
}

export interface SpeciesGenome {
  speciesId: SpeciesId;
  trunk: TrunkId;
  modules: GenomeModule[];
  trophicLevel: TrophicLevel;
}

// Spec 12: Trophic Levels
export enum TrophicLevel {
  Producer = 0,
  PrimaryConsumer = 1,
  SecondaryConsumer = 2,
  Apex = 3,
  Decomposer = 4
}

// Spec 10: Environmental Gates
export enum OxState {
  Anoxic = 'Anoxic',
  LowO2 = 'LowO2',
  O2Rich = 'O2Rich'
}
