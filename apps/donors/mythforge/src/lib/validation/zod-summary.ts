import { CATEGORY_TEMPLATES } from '@/lib/types';
import * as schemasEntity from './schemas-entities';

// Build a simple human-readable summary of the Zod schemas used by the app.
export function buildZodSummary(): string {
  // Map known schema exports to category names where possible
  const mapping: Record<string, string> = {
    factionSchema: 'Faction',
    guildSchema: 'Guild',
    religionSchema: 'Religion',
    nobleHouseSchema: 'Noble House',
    historicalEventSchema: 'Historical Event',
    eraSchema: 'Era',
    cultureSchema: 'Culture',
    speciesSchema: 'Species',
    raceSchema: 'Race',
    creatureSchema: 'Creature',
    faunaSchema: 'Fauna',
    npcSchema: 'NPC',
    characterSchema: 'Character',
    historicalFigureSchema: 'Historical Figure',
    artifactSchema: 'Artifact',
    itemSchema: 'Item',
    resourceSchema: 'Resource',
    materialSchema: 'Material',
    technologySchema: 'Technology',
    magicSystemSchema: 'Magic System',
    spellSchema: 'Spell',
  };

  const lines: string[] = [];

  for (const [exportName] of Object.entries(schemasEntity as Record<string, unknown>)) {
    const category = mapping[exportName] || exportName;
    lines.push(`- ${category}: ${exportName}`);
  }

  // Also include CATEGORY_TEMPLATES keys for completeness
  lines.push('\nCategory templates:');
  for (const [cat, template] of Object.entries(CATEGORY_TEMPLATES)) {
    lines.push(`- ${cat}: ${JSON.stringify(template)}`);
  }

  return lines.join('\n');
}
