import { describe, it, expect } from 'vitest';
import { AdventureGenerationError, AIServiceError } from '../../../src/utils/errorUtils';

describe('AdventureGenerationError', () => {
  it('constructs with message, context and operation and preserves properties', () => {
    const err = new AdventureGenerationError('generation failed', 'encounter-gen', 'createEncounter');
    expect(err.message).toBe('generation failed');
    expect(err.context).toBe('encounter-gen');
    expect(err.operation).toBe('createEncounter');
    expect(err.name).toBe('AdventureGenerationError');
    expect(err).toBeInstanceOf(AdventureGenerationError);
    expect(err).toBeInstanceOf(Error);
    expect(typeof err.stack).toBe('string');
    expect(err.stack).toContain('AdventureGenerationError');
  });

  it('does not implicitly set a cause when an extra argument is passed (no ErrorOptions forwarded)', () => {
    const cause = new Error('inner');
    // Pass an extra argument; constructor does not forward options to Error, so cause should be undefined
    const err = new (AdventureGenerationError as any)('msg', 'ctx', 'op', { cause });
    expect(err.message).toBe('msg');
    expect(err.context).toBe('ctx');
    expect(err.operation).toBe('op');
    expect((err as any).cause).toBeUndefined();
  });
});

describe('AIServiceError', () => {
  it('constructs with message and model and preserves properties', () => {
    const err = new AIServiceError('ai failed', 'gpt-test');
    expect(err.message).toBe('ai failed');
    expect(err.model).toBe('gpt-test');
    expect(err.name).toBe('AIServiceError');
    expect(err).toBeInstanceOf(AIServiceError);
    expect(err).toBeInstanceOf(Error);
    expect(typeof err.stack).toBe('string');
    expect(err.stack).toContain('AIServiceError');
  });

  it('verifies exact message and model assignment (mutation killer)', () => {
    const err = new AIServiceError('service down', 'gpt-42');
    // exact strings asserted to kill simple mutation changes
    expect(err.message).toBe('service down');
    expect(err.model).toBe('gpt-42');
    expect(err.name).toBe('AIServiceError');
  });
});
