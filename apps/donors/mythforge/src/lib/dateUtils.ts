/**
 * Date/timeline utility functions for MythosForge.
 * Pure functions for extracting chronological data from entity attributes.
 */

import type { Entity } from './types';

// =============================================================================
// Constants
// =============================================================================

/**
 * Attribute keys that represent dates/years for timeline extraction.
 * Checked in priority order during generic scan.
 */
const DATE_FIELD_PATTERNS = [
  'year', '_year', 'date', '_date', 'start_year', 'end_year',
  'birth_year', 'death_year', 'year_occurred', 'era_origin',
  'age_in_years', 'avg_lifespan_years',
];

/**
 * Single-point-in-time fields checked first (most specific).
 */
const SINGLE_POINT_FIELDS = [
  'year_occurred', 'birth_year', 'death_year', 'era_origin',
  'start_year', 'end_year',
];

// =============================================================================
// Types
// =============================================================================

export interface TimelineEntry {
  entity: Entity;
  year: number;
  sortKey: number;
}

// =============================================================================
// Date Extraction
// =============================================================================

/**
 * Extract a year value from an entity's json_attributes.
 *
 * Priority order:
 * 1. Known single-point fields (year_occurred, birth_year, etc.)
 * 2. Generic scan for any field containing date-related keywords
 * 3. Returns null if no valid year is found
 *
 * @param entity - The entity to extract a year from
 * @returns The extracted year as a number, or null if not found
 */
export function extractYear(entity: Entity): number | null {
  const attrs = entity.json_attributes;
  if (!attrs) return null;

  // Check known single-point fields in priority order
  for (const field of SINGLE_POINT_FIELDS) {
    const val = attrs[field];
    if (typeof val === 'number' && val > 0) return val;
  }

  // Generic scan: find any field matching date patterns
  for (const [key, val] of Object.entries(attrs)) {
    if (typeof val !== 'number' || val <= 0) continue;
    const keyLower = key.toLowerCase();
    if (DATE_FIELD_PATTERNS.some((p) => keyLower.includes(p))) {
      return val;
    }
  }

  return null;
}

/**
 * Extract timeline entries from an array of entities.
 * Filters for entities with valid year data and sorts chronologically.
 *
 * @param entities - Array of entities to scan
 * @returns Sorted array of TimelineEntry objects
 */
export function extractTimelineEntries(entities: Entity[]): TimelineEntry[] {
  const result: TimelineEntry[] = [];
  entities.forEach((entity, index) => {
    const year = extractYear(entity);
    if (year !== null) {
      result.push({ entity, year, sortKey: index });
    }
  });

  // Sort by year, then by original index for stable ordering
  return result.sort((a, b) => a.year - b.year || a.sortKey - b.sortKey);
}

/**
 * Compute the year range with padding for timeline axis rendering.
 *
 * @param entries - Timeline entries (must be sorted by year)
 * @param paddingPercent - Optional padding as a percentage of range (default 0.1)
 * @returns Object with min and max year values
 */
export function computeYearRange(
  entries: TimelineEntry[],
  paddingPercent: number = 0.1,
): { min: number; max: number } {
  if (entries.length === 0) return { min: 0, max: 100 };

  const years = entries.map((e) => e.year);
  const min = Math.min(...years);
  const max = Math.max(...years);

  // Add padding
  const padding = Math.max(10, Math.ceil((max - min) * paddingPercent));
  return { min: min - padding, max: max + padding };
}

/**
 * Calculate the appropriate tick interval for the timeline axis based on the year range.
 *
 * @param yearRange - The min/max year range
 * @returns An interval in years
 */
export function calculateTickInterval(yearRange: { min: number; max: number }): number {
  const range = yearRange.max - yearRange.min;
  if (range > 1000) return 100;
  if (range > 500) return 50;
  if (range > 200) return 20;
  if (range > 100) return 10;
  if (range > 50) return 5;
  if (range > 20) return 2;
  return 1;
}
