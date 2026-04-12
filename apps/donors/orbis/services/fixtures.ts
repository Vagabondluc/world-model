
import { TerrainConfig } from '../types';
import { EARTH_PRESET } from './archetypes';

export interface Fixture {
  id: string;
  description: string;
  config: TerrainConfig;
  seed: number;
  expectedHexCount: number;
  metrics?: {
    avgHeight?: number;
    oceanRatio?: number;
  }
}

// Canonical Test Suite for CI/Verification
// Any change to these configs or seeds is a breaking change for determinism.
export const CANONICAL_FIXTURES: Fixture[] = [
  {
    id: 'terra_prime_v1',
    description: 'Standard Earth-like configuration for deterministic regression testing.',
    config: {
      ...EARTH_PRESET,
      unitProfile: 'legacy_index'
    },
    seed: 80085,
    expectedHexCount: 10242, // Subdivisions 5
    metrics: {
      oceanRatio: 0.65 // Approx expectation
    }
  },
  {
    id: 'minimal_test',
    description: 'Low resolution test for fast logic verification.',
    config: {
      ...EARTH_PRESET,
      subdivisions: 1, // 42 hexes
      unitProfile: 'legacy_index'
    },
    seed: 12345,
    expectedHexCount: 42
  },
  {
    id: 'meter_unit_test',
    description: 'Validation fixture for v1_meter profile compliance.',
    config: {
      ...EARTH_PRESET,
      subdivisions: 2, // 162 hexes
      unitProfile: 'v1_meter'
    },
    seed: 99999,
    expectedHexCount: 162
  }
];

export const getFixture = (id: string): Fixture | undefined => 
  CANONICAL_FIXTURES.find(f => f.id === id);
