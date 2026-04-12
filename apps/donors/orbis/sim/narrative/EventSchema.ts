
import { DomainId } from '../../core/types';

interface EventTemplate {
  titleTemplate: string;
  messageTemplate: string;
}

export const EVENT_SCHEMA: Record<string, EventTemplate> = {
  // --- Civilization ---
  'FACTION_SPAWN': {
    titleTemplate: 'Faction Emergence',
    messageTemplate: 'The "{name}" faction ({type}) has formed to demand: {demands}.'
  },
  'TECH_UNLOCK': {
    titleTemplate: 'Scientific Breakthrough',
    messageTemplate: 'Scholars have mastered {name}. This development will reshape {impacts}.'
  },
  'REGIME_CHANGE': {
    titleTemplate: 'Regime Transition',
    messageTemplate: 'The government has transitioned from {old} to {new} due to {reason}.'
  },
  
  // --- Ecology ---
  'SPECIES_EVOLVED': {
    titleTemplate: 'New Species',
    messageTemplate: 'Evolutionary pressures have forged {name}, a {trophic} adapted to {biome}.'
  },
  'EXTINCTION_EVENT': {
    titleTemplate: 'Extinction',
    messageTemplate: 'The {name} has been lost to history due to {cause}.'
  },

  // --- Planetary Physics ---
  'MAGNETIC_REVERSAL': {
    titleTemplate: 'Geomagnetic Reversal',
    messageTemplate: 'Planetary poles have flipped. Navigation systems and migratory birds will be affected.'
  },
  'SHIELD_CRITICAL': {
    titleTemplate: 'Magnetosphere Collapse',
    messageTemplate: 'Planetary shielding is critical. Surface radiation is rising.'
  },

  // --- Climate ---
  'ICE_ADVANCE': {
    titleTemplate: 'Glaciation',
    messageTemplate: 'Global temperatures have dropped. Ice sheets are advancing.'
  },
  'DESERTIFICATION': {
    titleTemplate: 'Desertification',
    messageTemplate: 'Aridity is increasing. Biomes are shifting toward desert.'
  }
};

/**
 * Formats a raw string using a param object.
 * e.g. "Hello {name}" + { name: "World" } -> "Hello World"
 */
export function formatString(template: string, params: Record<string, any>): string {
  return template.replace(/{(\w+)}/g, (match, key) => { 
    return typeof params[key] !== 'undefined' ? String(params[key]) : match;
  });
}
