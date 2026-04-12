import { describe, it, expect } from 'vitest';
import { DEFAULT_OPENUI_CONFIG, OPENUI_SSE_EVENT_TYPES } from '@/lib/openui/config';

describe('OpenUI config', () => {
  it('keeps strict validation off by default', () => {
    expect(DEFAULT_OPENUI_CONFIG).toEqual({ strictValidation: false });
  });

  it('exposes the supported SSE event types', () => {
    expect(OPENUI_SSE_EVENT_TYPES).toEqual(['text', 'component', 'action', 'done', 'error']);
  });
});
