import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  exportAsJSON,
  exportAsMarkdown,
  exportAsText,
  parseImportedJSON,
  type ExportableEncounter,
} from '@/lib/export-utils';

describe('export-utils', () => {
  const mockEncounter: ExportableEncounter = {
    name: 'Test Encounter',
    location: 'Dense Forest',
    difficulty: 'medium',
    partyLevel: 5,
    playerCount: 4,
    monsters: [
      {
        id: 'monster-1',
        name: 'Goblin',
        cr: '1/4',
        xp: 50,
        size: 'Small',
        type: 'Humanoid',
        count: 6,
      },
    ],
    tacticalElements: [
      {
        id: 'tactical-1',
        name: 'Fallen Log',
        type: 'cover',
        description: 'Provides half cover',
      },
    ],
    rewards: [
      {
        id: 'reward-1',
        type: 'treasure',
        description: 'Gold coins',
        value: 100,
      },
    ],
    notes: 'Test encounter notes',
  };

  describe('exportAsJSON', () => {
    it('should export encounter as valid JSON', () => {
      const json = exportAsJSON(mockEncounter);
      const parsed = JSON.parse(json);
      
      expect(parsed.name).toBe('Test Encounter');
      expect(parsed.monsters).toHaveLength(1);
      expect(parsed.monsters[0].name).toBe('Goblin');
    });

    it('should include all encounter fields', () => {
      const json = exportAsJSON(mockEncounter);
      const parsed = JSON.parse(json);
      
      expect(parsed).toHaveProperty('name');
      expect(parsed).toHaveProperty('location');
      expect(parsed).toHaveProperty('difficulty');
      expect(parsed).toHaveProperty('partyLevel');
      expect(parsed).toHaveProperty('playerCount');
      expect(parsed).toHaveProperty('monsters');
      expect(parsed).toHaveProperty('tacticalElements');
      expect(parsed).toHaveProperty('rewards');
      expect(parsed).toHaveProperty('notes');
    });
  });

  describe('exportAsMarkdown', () => {
    it('should include encounter name as heading', () => {
      const md = exportAsMarkdown(mockEncounter);
      expect(md).toContain('# Test Encounter');
    });

    it('should include monster table', () => {
      const md = exportAsMarkdown(mockEncounter);
      expect(md).toContain('## Monsters');
      expect(md).toContain('| Goblin |');
    });

    it('should include tactical elements', () => {
      const md = exportAsMarkdown(mockEncounter);
      expect(md).toContain('## Tactical Elements');
      expect(md).toContain('Fallen Log');
    });

    it('should include rewards', () => {
      const md = exportAsMarkdown(mockEncounter);
      expect(md).toContain('## Rewards');
      expect(md).toContain('Gold coins');
    });

    it('should include notes', () => {
      const md = exportAsMarkdown(mockEncounter);
      expect(md).toContain('## Notes');
      expect(md).toContain('Test encounter notes');
    });
  });

  describe('exportAsText', () => {
    it('should include encounter name', () => {
      const text = exportAsText(mockEncounter);
      expect(text).toContain('Test Encounter');
    });

    it('should include monsters', () => {
      const text = exportAsText(mockEncounter);
      expect(text).toContain('Goblin');
      expect(text).toContain('MONSTERS');
    });

    it('should use decorative separators', () => {
      const text = exportAsText(mockEncounter);
      expect(text).toContain('═');
      expect(text).toContain('─');
    });
  });

  describe('parseImportedJSON', () => {
    it('should parse valid JSON string', () => {
      const json = JSON.stringify(mockEncounter);
      const result = parseImportedJSON(json);
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Test Encounter');
    });

    it('should return null for invalid JSON', () => {
      const result = parseImportedJSON('not valid json');
      expect(result).toBeNull();
    });

    it('should use default values for missing fields', () => {
      const partial = JSON.stringify({ name: 'Partial Encounter' });
      const result = parseImportedJSON(partial);
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Partial Encounter');
      expect(result?.difficulty).toBe('medium');
      expect(result?.partyLevel).toBe(5);
      expect(result?.playerCount).toBe(4);
      expect(result?.monsters).toEqual([]);
    });
  });
});
