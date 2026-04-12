// =============================================================================
// MythosForge - Calendar Event Types & Constants
// =============================================================================

export interface CalendarEvent {
  id: string;
  name: string;
  description: string;
  year: number;       // 0 = every year (recurring)
  month: number;      // 0-based index
  day: number;        // 1-based day of month
  category: CalendarEventCategory;
}

export type CalendarEventCategory =
  | 'festival' | 'religious' | 'military' | 'harvest'
  | 'celestial' | 'political' | 'natural' | 'personal';

export const EVENT_CATEGORIES: Record<CalendarEventCategory, { label: string; color: string; bg: string }> = {
  festival:  { label: 'Festival',     color: 'text-amber-300',    bg: 'bg-amber-500/20 border-amber-500/30' },
  religious: { label: 'Religious',    color: 'text-violet-300',   bg: 'bg-violet-500/20 border-violet-500/30' },
  military:  { label: 'Military',     color: 'text-red-400',      bg: 'bg-red-500/20 border-red-500/30' },
  harvest:   { label: 'Harvest',      color: 'text-emerald-400',  bg: 'bg-emerald-500/20 border-emerald-500/30' },
  celestial: { label: 'Celestial',    color: 'text-cyan-300',     bg: 'bg-cyan-500/20 border-cyan-500/30' },
  political: { label: 'Political',    color: 'text-blue-300',     bg: 'bg-blue-500/20 border-blue-500/30' },
  natural:   { label: 'Natural',      color: 'text-lime-400',     bg: 'bg-lime-500/20 border-lime-500/30' },
  personal:  { label: 'Personal',     color: 'text-pink-300',     bg: 'bg-pink-500/20 border-pink-500/30' },
};

export interface CalendarSeason {
  name: string;
  start_month: number;  // 0-based
  color: string;        // Tailwind bg class
}

export const DEFAULT_SEASONS: CalendarSeason[] = [
  { name: 'Spring', start_month: 2,  color: 'bg-emerald-500/15' },
  { name: 'Summer', start_month: 5,  color: 'bg-amber-500/15' },
  { name: 'Autumn', start_month: 8,  color: 'bg-orange-500/15' },
  { name: 'Winter', start_month: 11, color: 'bg-sky-500/15' },
];

export const EVENT_CATEGORY_KEYS = Object.keys(EVENT_CATEGORIES) as CalendarEventCategory[];

export function generateEventId(): string {
  return `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
