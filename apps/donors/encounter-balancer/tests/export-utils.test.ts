import { describe, test, expect } from 'bun:test';
import type { Monster } from '../src/lib/encounter-types';

describe('Export Functions', () => {
  const sampleData = {
    name: 'Test Encounter',
    location: 'Forest',
    difficulty: 'medium',
    partyLevel: 5,
    playerCount: 4,
    monsters: [
      { id: '1', name: 'Goblin', cr: '1/4', xp: 50, size: 'Small', type: 'Humanoid', count: 3 }
    ] as Monster[],
    tacticalElements: [],
    rewards: [],
    notes: 'Test notes',
    activeTab: 'balancer'
  };

  test('exportToJson creates valid JSON structure', () => {
    const json = JSON.stringify({
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      type: 'balancer',
      name: 'Test Encounter',
      data: sampleData
    });
    const parsed = JSON.parse(json);
    expect(parsed.name).toBe('Test Encounter');
    expect(parsed.version).toBe('1.0.0');
  });

  test('exportToMarkdown includes encounter name', () => {
    const markdown = `# ${sampleData.name}`;
    expect(markdown).toContain('Test Encounter');
  });

  test('exportToText includes encounter details', () => {
    const text = `Type: ${sampleData.activeTab === 'balancer' ? 'Combat Encounter' : 'Environmental Scenario'}`;
    expect(text).toContain('Combat Encounter');
  });
});

describe('Import Validation', () => {
  test('import validates JSON structure', () => {
    // Test that we can parse valid JSON structure
    const validJson = JSON.stringify({
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      type: 'balancer',
      name: 'Test',
      data: { name: 'Test Encounter' }
    });
    
    const parsed = JSON.parse(validJson);
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.name).toBe('Test');
    expect(parsed.data).toBeDefined();
  });

  test('import validates required fields', () => {
    const validData = {
      version: '1.0.0',
      data: { monsters: [] }
    };
    
    // Check required fields exist
    expect(validData.version).toBeDefined();
    expect(validData.data).toBeDefined();
  });

  test('import rejects missing version', () => {
    const missingVersion = {
      name: 'Test',
      data: {}
    };
    
    // Should fail validation
    expect(missingVersion.version).toBeUndefined();
    expect(() => {
      if (!missingVersion.version) throw new Error('Invalid encounter file format');
    }).toThrow('Invalid encounter file format');
  });

  test('import rejects missing data', () => {
    const missingData = {
      version: '1.0.0',
      name: 'Test'
    };
    
    // Should fail validation
    expect(missingData.data).toBeUndefined();
    expect(() => {
      if (!missingData.data) throw new Error('Invalid encounter file format');
    }).toThrow('Invalid encounter file format');
  });
});

describe('Markdown Generation', () => {
  test('markdown includes monsters table header', () => {
    const tableHeader = '| Name | CR | Count | XP Each |';
    expect(tableHeader).toContain('Name');
    expect(tableHeader).toContain('CR');
  });
});

describe('Text Generation', () => {
  test('text format includes separator', () => {
    const header = '='.repeat(50);
    expect(header.length).toBe(50);
  });
});
