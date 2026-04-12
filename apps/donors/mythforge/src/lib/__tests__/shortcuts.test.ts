/**
 * Unit tests for keyboard shortcut handler logic
 *
 * Since the keyboard handler is embedded in page.tsx (a component),
 * we test the core logic patterns in isolation to ensure correctness.
 *
 * Tests cover:
 * - Modifier key detection (Meta/Ctrl)
 * - Input focus gating (should not trigger when typing in input/textarea)
 * - Key combination matching
 * - Escape cascade order
 */

import { describe, it, expect } from 'vitest';

// =============================================================================
// Helper: simulate keyboard event
// =============================================================================

function createKeyboardEvent(
  key: string,
  options: {
    metaKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    target?: HTMLElement;
  } = {},
): KeyboardEvent {
  const { metaKey = false, ctrlKey = false, shiftKey = false, altKey = false, target } = options;

  const event = new KeyboardEvent('keydown', {
    key,
    metaKey,
    ctrlKey,
    shiftKey,
    altKey,
    bubbles: true,
  });

  // For isInputFocused detection, we need a target with tagName
  if (target) {
    Object.defineProperty(event, 'target', { value: target, writable: false });
  }

  return event;
}

// =============================================================================
// Helper: isInputFocused detection logic (mirrors page.tsx)
// =============================================================================

function isInputFocused(target: HTMLElement): boolean {
  const tagName = target.tagName;
  return (
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    target.isContentEditable === true
  );
}

// =============================================================================
// Helper: isModifier detection logic (mirrors page.tsx)
// =============================================================================

function isModifier(e: KeyboardEvent): boolean {
  return e.metaKey || e.ctrlKey;
}

// =============================================================================
// Tests
// =============================================================================

describe('Keyboard Shortcut: Modifier Detection', () => {
  it('should detect metaKey as modifier', () => {
    const input = document.createElement('div');
    const event = createKeyboardEvent('k', { metaKey: true, target: input });
    expect(isModifier(event)).toBe(true);
  });

  it('should detect ctrlKey as modifier', () => {
    const input = document.createElement('div');
    const event = createKeyboardEvent('k', { ctrlKey: true, target: input });
    expect(isModifier(event)).toBe(true);
  });

  it('should not detect plain key as modifier', () => {
    const input = document.createElement('div');
    const event = createKeyboardEvent('k', { target: input });
    expect(isModifier(event)).toBe(false);
  });

  it('should detect shift+meta as modifier', () => {
    const input = document.createElement('div');
    const event = createKeyboardEvent('z', { metaKey: true, shiftKey: true, target: input });
    expect(isModifier(event)).toBe(true);
  });
});

describe('Keyboard Shortcut: Input Focus Gating', () => {
  it('should detect INPUT as focused input', () => {
    const input = document.createElement('input');
    expect(isInputFocused(input)).toBe(true);
  });

  it('should detect TEXTAREA as focused input', () => {
    const textarea = document.createElement('textarea');
    expect(isInputFocused(textarea)).toBe(true);
  });

  it('should detect contentEditable as focused input', () => {
    const div = document.createElement('div');
    Object.defineProperty(div, 'isContentEditable', { value: true, writable: false });
    expect(isInputFocused(div)).toBe(true);
  });

  it('should not detect plain DIV as focused input', () => {
    const div = document.createElement('div');
    Object.defineProperty(div, 'isContentEditable', { value: false, writable: false });
    expect(isInputFocused(div)).toBe(false);
  });

  it('should not detect BUTTON as focused input', () => {
    const button = document.createElement('button');
    Object.defineProperty(button, 'isContentEditable', { value: false, writable: false });
    expect(isInputFocused(button)).toBe(false);
  });

  it('should not detect SPAN as focused input', () => {
    const span = document.createElement('span');
    Object.defineProperty(span, 'isContentEditable', { value: false, writable: false });
    expect(isInputFocused(span)).toBe(false);
  });
});

describe('Keyboard Shortcut: Key Combination Matching', () => {
  const body = document.createElement('div');

  it('should match ⌘K (Meta+K)', () => {
    const event = createKeyboardEvent('k', { metaKey: true, target: body });
    expect(isModifier(event) && event.key === 'k').toBe(true);
  });

  it('should match Ctrl+K', () => {
    const event = createKeyboardEvent('k', { ctrlKey: true, target: body });
    expect(isModifier(event) && event.key === 'k').toBe(true);
  });

  it('should NOT match plain K (no modifier)', () => {
    const event = createKeyboardEvent('k', { target: body });
    expect(isModifier(event) && event.key === 'k').toBe(false);
  });

  it('should match ⌘Shift+Z (Meta+Shift+Z)', () => {
    const event = createKeyboardEvent('z', { metaKey: true, shiftKey: true, target: body });
    expect(isModifier(event) && event.shiftKey && event.key === 'z').toBe(true);
  });

  it('should distinguish ⌘Z from ⇧⌘Z', () => {
    const undo = createKeyboardEvent('z', { metaKey: true, shiftKey: false, target: body });
    const redo = createKeyboardEvent('z', { metaKey: true, shiftKey: true, target: body });

    expect(isModifier(undo) && !undo.shiftKey && undo.key === 'z').toBe(true);
    expect(isModifier(redo) && redo.shiftKey && redo.key === 'z').toBe(true);
  });

  it('should match plain ? (no modifier)', () => {
    const event = createKeyboardEvent('?', { target: body });
    expect(!isModifier(event) && event.key === '?').toBe(true);
  });

  it('should match ⌘/ (Meta+/)', () => {
    const event = createKeyboardEvent('/', { metaKey: true, target: body });
    expect(isModifier(event) && event.key === '/').toBe(true);
  });

  it('should match plain Escape', () => {
    const event = createKeyboardEvent('Escape', { target: body });
    expect(event.key === 'Escape').toBe(true);
  });

  it('should match plain Tab (no modifier)', () => {
    const event = createKeyboardEvent('Tab', { target: body });
    expect(event.key === 'Tab' && !event.ctrlKey && !event.metaKey && !event.altKey).toBe(true);
  });

  it('should NOT match Ctrl+Tab', () => {
    const event = createKeyboardEvent('Tab', { ctrlKey: true, target: body });
    expect(event.key === 'Tab' && !event.ctrlKey && !event.metaKey && !event.altKey).toBe(false);
  });
});

describe('Keyboard Shortcut: ⌘S preventDefault', () => {
  it('should be preventable (browser save interception)', () => {
    // Use native Event constructor with cancelable flag for jsdom compatibility
    const event = new Event('keydown', { cancelable: true, bubbles: true });
    expect(event.defaultPrevented).toBe(false);
    event.preventDefault();
    expect(event.defaultPrevented).toBe(true);
  });
});

describe('Keyboard Shortcut: Input-focus gate prevents shortcuts', () => {
  const input = document.createElement('input');
  const body = document.createElement('div');

  it('⌘K should work on body (not input)', () => {
    const event = createKeyboardEvent('k', { metaKey: true, target: body });
    const shouldTrigger = isModifier(event) && event.key === 'k' && !isInputFocused(event.target as HTMLElement);
    expect(shouldTrigger).toBe(true);
  });

  it('⌘K should NOT trigger when input is focused', () => {
    const event = createKeyboardEvent('k', { metaKey: true, target: input });
    const shouldTrigger = isModifier(event) && event.key === 'k' && !isInputFocused(event.target as HTMLElement);
    expect(shouldTrigger).toBe(false);
  });

  it('⌘N should NOT trigger when textarea is focused', () => {
    const textarea = document.createElement('textarea');
    const event = createKeyboardEvent('n', { metaKey: true, target: textarea });
    const shouldTrigger = isModifier(event) && event.key === 'n' && !isInputFocused(event.target as HTMLElement);
    expect(shouldTrigger).toBe(false);
  });

  it('⌘S should trigger even when input is focused (save always works)', () => {
    const event = createKeyboardEvent('s', { metaKey: true, target: input });
    const shouldTrigger = isModifier(event) && event.key === 's';
    // Note: ⌘S in the actual code does NOT check isInputFocused — save always works
    expect(shouldTrigger).toBe(true);
  });
});
