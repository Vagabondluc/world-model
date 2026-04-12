import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { isTauri, isBrowser } from '../../../src/utils/envUtils';

describe('envUtils', () => {
  afterEach(() => {
    // clean up global window after each test
    try {
      // @ts-ignore
      delete (global as any).window;
    } catch {
      // ignore
    }
  });

  test('isTauri returns true when window.__TAURI_INTERNALS__ exists', () => {
    // @ts-ignore
    (global as any).window = { __TAURI_INTERNALS__: {} };
    expect(isTauri()).toBe(true);
    expect(isBrowser()).toBe(false);
  });

  test('isTauri returns false when window is undefined', () => {
    // ensure window is not defined
    try {
      // @ts-ignore
      delete (global as any).window;
    } catch {}
    expect(isTauri()).toBe(false);
    expect(isBrowser()).toBe(true);
  });

  test('isTauri returns false when window.__TAURI_INTERNALS__ is null', () => {
    // @ts-ignore
    (global as any).window = { __TAURI_INTERNALS__: null };
    expect(isTauri()).toBe(false);
    expect(isBrowser()).toBe(true);
  });

  test('isTauri returns true when window.__TAURI_INTERNALS__ is empty object', () => {
    // @ts-ignore
    (global as any).window = { __TAURI_INTERNALS__: {} };
    expect(isTauri()).toBe(true);
    expect(isBrowser()).toBe(false);
  });
});
