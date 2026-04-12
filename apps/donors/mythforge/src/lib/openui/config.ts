/**
 * OpenUI configuration constants
 */

export const OPENUI_SSE_EVENT_TYPES = ['text', 'component', 'action', 'done', 'error'] as const;

export type OpenUIEventType = typeof OPENUI_SSE_EVENT_TYPES[number];

export const DEFAULT_OPENUI_CONFIG = {
  // Whether to strictly validate component props against registered Zod schemas
  strictValidation: false,
};