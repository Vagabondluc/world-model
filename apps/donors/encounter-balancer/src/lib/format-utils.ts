/**
 * Format a number with consistent formatting between server and client
 * to avoid hydration mismatches
 */

// Use a fixed locale for consistent server/client rendering
const LOCALE = 'en-US';

/**
 * Format a number with thousand separators
 * Uses fixed locale to ensure server and client render the same
 */
export function formatNumber(num: number): string {
  return num.toLocaleString(LOCALE);
}

/**
 * Format a number as currency (gold pieces)
 */
export function formatGold(num: number): string {
  return `${num.toLocaleString(LOCALE)} gp`;
}

/**
 * Format a number as XP
 */
export function formatXP(num: number): string {
  return `${num.toLocaleString(LOCALE)} XP`;
}
