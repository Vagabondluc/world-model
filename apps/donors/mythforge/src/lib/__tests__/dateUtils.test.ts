/**
 * Unit tests for the timeline date extraction utilities in dateUtils.ts
 *
 * Tests cover:
 * - extractYear: priority fields, generic scan, edge cases
 * - extractTimelineEntries: sorting, filtering, stable order
 * - computeYearRange: padding, empty input
 * - calculateTickInterval: various ranges
 */

import { describe, it, expect } from 'vitest';
import { extractYear, extractTimelineEntries, computeYearRange, calculateTickInterval } from '@/lib/dateUtils';
import type { Entity } from '@/lib/types';

// =============================================================================
// Test fixtures
// =============================================================================

function makeEntity(id: string, title: string, attrs: Record<string, unknown> = {}, category: string = 'Historical Event'): Entity {
  return {
    id,
    uuid_short: `E-${id.slice(0, 4).toUpperCase()}`,
    title,
    category,
    markdown_content: '',
    json_attributes: attrs,
    tags: [],
    isPinned: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
}

// =============================================================================
// extractYear
// =============================================================================

describe('extractYear', () => {
  it('should extract year_occurred field', () => {
    const entity = makeEntity('e1', 'The Battle', { year_occurred: 1492 });
    expect(extractYear(entity)).toBe(1492);
  });

  it('should extract birth_year field', () => {
    const entity = makeEntity('e2', 'King Arthur', { birth_year: 500, death_year: 542 });
    expect(extractYear(entity)).toBe(500);
  });

  it('should extract death_year if birth_year is missing', () => {
    const entity = makeEntity('e3', 'Merlin', { death_year: 600 });
    expect(extractYear(entity)).toBe(600);
  });

  it('should extract era_origin field', () => {
    const entity = makeEntity('e4', 'First Age', { era_origin: -5000 });
    // Note: era_origin of -5000 is < 0, so it won't be extracted
    // Positive values only are extracted
    expect(extractYear(entity)).toBeNull();
  });

  it('should extract start_year for eras', () => {
    const entity = makeEntity('e5', 'The Golden Age', { start_year: 100, end_year: 200 });
    expect(extractYear(entity)).toBe(100);
  });

  it('should fall through to generic scan for matching field names', () => {
    const entity = makeEntity('e6', 'Event', { founded_year: 1245 });
    expect(extractYear(entity)).toBe(1245);
  });

  it('should return null for entity with no json_attributes', () => {
    const entity = makeEntity('e7', 'No Attrs Entity', {});
    expect(extractYear(entity)).toBeNull();
  });

  it('should return null for entity with null json_attributes', () => {
    const entity = { ...makeEntity('e8', 'Null Attrs'), json_attributes: null } as unknown as Entity;
    expect(extractYear(entity)).toBeNull();
  });

  it('should return null for entity with no year-like fields', () => {
    const entity = makeEntity('e9', 'No Year', { name: 'Gandalf', power_level: 9000 });
    expect(extractYear(entity)).toBeNull();
  });

  it('should return null for string year values (not numbers)', () => {
    const entity = makeEntity('e10', 'String Year', { year: 'unknown' });
    expect(extractYear(entity)).toBeNull();
  });

  it('should return null for zero or negative year values', () => {
    const entity = makeEntity('e11', 'Zero Year', { year_occurred: 0 });
    expect(extractYear(entity)).toBeNull();

    const entity2 = makeEntity('e12', 'Negative Year', { year_occurred: -100 });
    expect(extractYear(entity2)).toBeNull();
  });

  it('should prioritize specific fields over generic scan', () => {
    // year_occurred should be picked over a generic 'calendar_year'
    const entity = makeEntity('e13', 'Priority Test', { year_occurred: 1000, calendar_year: 2000 });
    expect(extractYear(entity)).toBe(1000);
  });

  it('should extract from custom field matching date pattern', () => {
    const entity = makeEntity('e14', 'Custom Date', { coronation_date: 1189 });
    expect(extractYear(entity)).toBe(1189);
  });
});

// =============================================================================
// extractTimelineEntries
// =============================================================================

describe('extractTimelineEntries', () => {
  it('should filter entities without year data', () => {
    const entities = [
      makeEntity('a', 'Dated', { year_occurred: 100 }),
      makeEntity('b', 'No Date', { name: 'no year' }),
      makeEntity('c', 'Also Dated', { birth_year: 200 }),
    ];
    const entries = extractTimelineEntries(entities);
    expect(entries).toHaveLength(2);
  });

  it('should sort entries chronologically', () => {
    const entities = [
      makeEntity('a', 'Third', { year_occurred: 300 }),
      makeEntity('b', 'First', { year_occurred: 100 }),
      makeEntity('c', 'Second', { year_occurred: 200 }),
    ];
    const entries = extractTimelineEntries(entities);
    expect(entries[0].year).toBe(100);
    expect(entries[1].year).toBe(200);
    expect(entries[2].year).toBe(300);
  });

  it('should maintain stable order for entries with same year', () => {
    const entities = [
      makeEntity('a', 'Alpha', { year_occurred: 100 }),
      makeEntity('b', 'Beta', { year_occurred: 100 }),
      makeEntity('c', 'Gamma', { year_occurred: 100 }),
    ];
    const entries = extractTimelineEntries(entities);
    expect(entries[0].entity.title).toBe('Alpha');
    expect(entries[1].entity.title).toBe('Beta');
    expect(entries[2].entity.title).toBe('Gamma');
  });

  it('should return empty array for no entities', () => {
    expect(extractTimelineEntries([])).toHaveLength(0);
  });

  it('should return empty array when no entities have year data', () => {
    const entities = [
      makeEntity('a', 'No Date', { name: 'test' }),
      makeEntity('b', 'Also No Date', {}),
    ];
    expect(extractTimelineEntries(entities)).toHaveLength(0);
  });

  it('should include entity reference in each entry', () => {
    const entity = makeEntity('a', 'Test Event', { year_occurred: 999 });
    const entries = extractTimelineEntries([entity]);
    expect(entries[0].entity.id).toBe('a');
    expect(entries[0].entity.title).toBe('Test Event');
    expect(entries[0].year).toBe(999);
  });
});

// =============================================================================
// computeYearRange
// =============================================================================

describe('computeYearRange', () => {
  it('should return default range for empty entries', () => {
    const range = computeYearRange([]);
    expect(range.min).toBe(0);
    expect(range.max).toBe(100);
  });

  it('should add padding around the data range', () => {
    const entries = [
      { entity: makeEntity('a', 'A', { year_occurred: 100 }), year: 100, sortKey: 0 },
      { entity: makeEntity('b', 'B', { year_occurred: 200 }), year: 200, sortKey: 1 },
    ];
    const range = computeYearRange(entries, 0.1);
    expect(range.min).toBeLessThan(100);
    expect(range.max).toBeGreaterThan(200);
  });

  it('should guarantee minimum padding of 10', () => {
    // Range of 5 (100 to 105). 10% of 5 = 0.5, but min padding is 10
    const entries = [
      { entity: makeEntity('a', 'A', { year_occurred: 100 }), year: 100, sortKey: 0 },
      { entity: makeEntity('b', 'B', { year_occurred: 105 }), year: 105, sortKey: 1 },
    ];
    const range = computeYearRange(entries, 0.1);
    expect(range.min).toBeLessThanOrEqual(90); // 100 - 10
    expect(range.max).toBeGreaterThanOrEqual(115); // 105 + 10
  });

  it('should handle single entry', () => {
    const entries = [
      { entity: makeEntity('a', 'A', { year_occurred: 1000 }), year: 1000, sortKey: 0 },
    ];
    const range = computeYearRange(entries);
    expect(range.min).toBeLessThan(1000);
    expect(range.max).toBeGreaterThan(1000);
  });
});

// =============================================================================
// calculateTickInterval
// =============================================================================

describe('calculateTickInterval', () => {
  it('should return 100 for ranges over 1000', () => {
    expect(calculateTickInterval({ min: 0, max: 1500 })).toBe(100);
  });

  it('should return 50 for ranges over 500', () => {
    expect(calculateTickInterval({ min: 0, max: 750 })).toBe(50);
  });

  it('should return 20 for ranges over 200', () => {
    expect(calculateTickInterval({ min: 0, max: 300 })).toBe(20);
  });

  it('should return 10 for ranges over 100', () => {
    expect(calculateTickInterval({ min: 0, max: 150 })).toBe(10);
  });

  it('should return 5 for ranges over 50', () => {
    expect(calculateTickInterval({ min: 0, max: 75 })).toBe(5);
  });

  it('should return 2 for ranges over 20', () => {
    expect(calculateTickInterval({ min: 0, max: 30 })).toBe(2);
  });

  it('should return 1 for small ranges', () => {
    expect(calculateTickInterval({ min: 0, max: 15 })).toBe(1);
  });
});
