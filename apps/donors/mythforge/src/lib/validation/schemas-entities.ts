import { z } from 'zod';
import { num, str, strArr, numArr, bool } from './schemas-geo';

export const factionSchema = z.object({
  member_count: num(50),
  influence: str('Regional'),
  resources: str('Moderate'),
  secrecy: num(3),
}).passthrough();

export const guildSchema = z.object({
  member_count: num(100),
  headquarters: str(''),
  specialty: str(''),
  wealth_rating: num(3),
}).passthrough();

export const religionSchema = z.object({
  follower_count: num(0),
  holy_symbol: str(''),
  sacred_sites: num(0),
  orthodoxy: num(5),
}).passthrough();

export const nobleHouseSchema = z.object({
  current_head: str(''),
  territory: str(''),
  military_strength: num(5),
  wealth: str('Affluent'),
}).passthrough();

export const historicalEventSchema = z.object({
  year_occurred: num(0),
  significance: str('Major'),
  casualties: num(0),
  lasting_impact: str(''),
}).passthrough();

export const eraSchema = z.object({
  start_year: num(0),
  end_year: num(0),
  defining_event: str(''),
  technological_level: str('Medieval'),
}).passthrough();

export const cultureSchema = z.object({
  traditionalism_score: num(5),
  belligerence_index: num(3),
  tech_level: num(2),
  trade_openness: num(5),
}).passthrough();

// Biology
export const speciesSchema = z.object({
  avg_lifespan_years: num(80),
  avg_height_cm: num(175),
  population_percentage: num(10),
  base_speed_ft: num(30),
}).passthrough();

export const raceSchema = z.object({
  avg_lifespan_years: num(80),
  avg_height_cm: num(175),
  population_percentage: num(10),
  base_speed_ft: num(30),
}).passthrough();

export const creatureSchema = z.object({
  challenge_rating: num(1),
  xp_value: num(200),
  intelligence_score: num(3),
}).passthrough();

export const faunaSchema = z.object({
  tameability_pct: num(50),
  reproduction_rate: str('Medium'),
  dietary_needs_kcal: num(2000),
}).passthrough();

export const npcSchema = z.object({
  name: str(''),
  npcName: str(''),
  role: str(''),
  archetype: str(''),
  race: str(''),
  class: str(''),
  occupation: str(''),
  tone: str(''),
  mbti: str(''),
  enneagram: str(''),
  hp: num(10),
  ac: num(10),
  level: num(1),
  age: num(25),
  wealth_gold: num(0),
  disposition: str('Neutral'),
  personalityTraits: str(''),
  ideals: str(''),
  bonds: str(''),
  flaws: str(''),
  goals: str(''),
  backstory: str(''),
  physicalDescription: str(''),
  distinguishingMarks: str(''),
  clothing: str(''),
  mannerisms: str(''),
  portraitPrompt: str(''),
  voice: str(''),
  tags: strArr([]),
  categories: strArr([]),
  seed: str(''),
  useTablePicker: bool(false),
  aiContext: str(''),
  arcStage: str(''),
  arcBeats: strArr([]),
  happiness: str(''),
  fear: str(''),
  love: str(''),
}).passthrough();

export const characterSchema = z.object({
  hp: num(20),
  ac: num(15),
  level: num(3),
  age: num(30),
  wealth_gold: num(150),
}).passthrough();

export const historicalFigureSchema = z.object({
  birth_year: num(0),
  death_year: num(0),
  legacy: str(''),
  significance: str('Notable'),
}).passthrough();

// Items
export const artifactSchema = z.object({
  power_level: str('Legendary'),
  attunement_required: z.boolean().optional().default(false),
  curse: str(''),
  origin: str(''),
}).passthrough();

export const itemSchema = z.object({
  weight_lbs: num(1),
  cost_gold: num(10),
  durability_max: num(100),
  magic_level: num(0),
}).passthrough();

export const resourceSchema = z.object({
  market_value_gold: num(5),
  weight_per_unit_kg: num(0.5),
  rarity_index: num(50),
}).passthrough();

export const materialSchema = z.object({
  hardness: num(5),
  rarity: str('Common'),
  crafting_uses: strArr([]),
  weight_per_unit_kg: num(1),
}).passthrough();

export const technologySchema = z.object({
  era_level: num(3),
  complexity: str('Moderate'),
  rarity: str('Common'),
  prerequisites: strArr([]),
}).passthrough();

export const magicSystemSchema = z.object({
  source: str('Arcane'),
  accessibility: str('Rare'),
  risk_level: num(3),
  max_power_level: num(9),
}).passthrough();

export const spellSchema = z.object({
  level: num(1),
  school: str('Evocation'),
  casting_time: str('1 action'),
  range: str('60 ft'),
  components: str('V, S'),
}).passthrough();

export const ruleSchema = z.object({
  category: str('Combat'),
  priority: str('Core'),
  exceptions: strArr([]),
  related_rules: strArr([]),
}).passthrough();

// Narrative
export const campaignSchema = z.object({
  current_date: str('Day 1'),
  session_number: num(1),
  player_count: num(4),
  completion_percentage: num(0),
}).passthrough();

export const adventureSchema = z.object({
  level_range: numArr([1, 5]),
  estimated_duration_hours: num(4),
  difficulty_rating: num(5),
}).passthrough();

export const questSchema = z.object({
  difficulty: str('Medium'),
  rewards_gold: num(100),
  rewards_xp: num(300),
  prerequisites: strArr([]),
}).passthrough();

export const encounterSchema = z.object({
  difficulty: str('Medium'),
  enemy_count: num(3),
  average_cr: num(2),
  environment: str(''),
}).passthrough();

export const sceneSchema = z.object({
  location_id: str(''),
  participants: strArr([]),
  mood: str('Tense'),
  duration_minutes: num(10),
}).passthrough();
export const loreNoteSchema = z.object({
  era_index: num(0),
  secrecy_level: num(1),
  reliability_score: num(80),
}).passthrough();

// Calendar & Session
export const calendarSchema = z.object({
  total_months: num(12),
  days_per_week: num(7),
  days_per_month: num(30),
  intercalary_days_count: num(0),
  epoch_event: z.string().default(''),
}).passthrough();

export const sessionNoteSchema = z.object({
  session_number: num(1),
  date_played: z.string().default(''),
  participants: z.array(z.string()).default([]),
  gm_notes: z.string().default(''),
  xp_awarded: num(0),
}).passthrough();
