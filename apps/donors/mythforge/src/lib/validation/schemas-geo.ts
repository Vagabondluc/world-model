// =============================================================================
// MythosForge - Zod Schemas: Cosmos & Geography
// =============================================================================

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Schema Builders
// ---------------------------------------------------------------------------

export const num = (val: number) => z.number().optional().default(val);
export const str = (val: string) => z.string().optional().default(val);
export const bool = (val: boolean) => z.boolean().optional().default(val);
export const strArr = (val: string[]) => z.array(z.string()).optional().default(val);
export const numArr = (val: number[]) => z.array(z.number()).optional().default(val);

// ---------------------------------------------------------------------------
// Macro & Cosmos
// ---------------------------------------------------------------------------

export const cosmosSchema = z.object({
  age_in_years: num(0),
  known_planes: num(0),
  magic_density: str('Medium'),
}).passthrough();

export const planeSchema = z.object({
  alignment: str('Neutral'),
  element: str(''),
  accessibility: str('Difficult'),
}).passthrough();

export const deitySchema = z.object({
  divine_rank: num(1),
  domains: strArr([]),
  worshippers: num(0),
  alignment: str('True Neutral'),
}).passthrough();

export const mythSchema = z.object({
  era_origin: str(''),
  truthfulness: str('Unknown'),
  spread: str('Local'),
}).passthrough();

// ---------------------------------------------------------------------------
// Geography
// ---------------------------------------------------------------------------

export const biomeSchema = z.object({
  temp_avg_celsius: num(20),
  precipitation_annual_mm: num(800),
  danger_rating: num(3),
  resource_abundance: num(0.5),
}).passthrough();

export const regionSchema = z.object({
  area_sq_km: num(0),
  population_density: num(0),
  primary_biome: str(''),
  political_control: str(''),
}).passthrough();

export const settlementSchema = z.object({
  population: num(500),
  wealth_tier: num(2),
  guard_count: num(10),
  crime_rate: num(5),
}).passthrough();

export const citySchema = z.object({
  population: num(10000),
  wealth_tier: num(3),
  guard_count: num(200),
  crime_rate: num(15),
}).passthrough();

export const landmarkSchema = z.object({
  elevation_meters: num(0),
  visibility_range_km: num(5),
  is_hidden: bool(false),
}).passthrough();

export const dungeonSchema = z.object({
  total_rooms: num(12),
  average_cr: num(3),
  exploration_time_minutes: num(240),
}).passthrough();

export const structureSchema = z.object({
  floors: num(1),
  condition: str('Good'),
  owner: str(''),
  purpose: str(''),
}).passthrough();
