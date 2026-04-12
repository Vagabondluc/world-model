/**
 * Canonical time units in microseconds (uint64).
 */
export const SECOND_US = 1_000_000n;
export const MINUTE_US = 60n * SECOND_US;
export const HOUR_US = 60n * MINUTE_US;
export const DAY_US = 24n * HOUR_US;
export const YEAR_US = 365n * DAY_US;

/**
 * Domain-specific quantums (smallest resolution).
 */
export const CLIMATE_QUANTUM_US = 30n * DAY_US;
export const TECTONICS_QUANTUM_US = 100_000n * YEAR_US;
export const MAGNETOSPHERE_QUANTUM_US = 10_000n * YEAR_US;
export const CIVILIZATION_QUANTUM_US = 1n * YEAR_US;
