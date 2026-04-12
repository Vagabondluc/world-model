/**
 * Simple utility function for demonstrating mutation testing.
 * This function adds two numbers and returns the result.
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Formats a greeting message.
 */
export function formatGreeting(name: string): string {
  return `Hello, ${name}!`;
}

/**
 * Checks if a number is positive.
 */
export function isPositive(value: number): boolean {
  return value > 0;
}
