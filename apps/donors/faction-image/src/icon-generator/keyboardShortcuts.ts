export const KEYBOARD_SHORTCUTS = {
  UNDO: { key: "z", ctrl: true, shift: false },
  REDO: { key: "y", ctrl: true, shift: false },
  DUPLICATE: { key: "d", ctrl: true, shift: true },
  GROUP: { key: "g", ctrl: true, shift: false },
  UNGROUP: { key: "g", ctrl: true, shift: true },
  EXPORT: { key: "e", ctrl: true, shift: false },
  GENERATE: { key: "Enter", ctrl: true, shift: false },
  PREV_LAYER: { key: "[", ctrl: false, shift: false },
  NEXT_LAYER: { key: "]", ctrl: false, shift: false },
  TOGGLE_VISIBLE: { key: "h", ctrl: false, shift: true },
  TOGGLE_LOCK: { key: "l", ctrl: false, shift: true },
  DEBUG: { key: "d", ctrl: false, shift: true },
} as const;

export function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return !!el.closest("[contenteditable='true']");
}

export function keyMatches(
  event: KeyboardEvent,
  binding: { key: string; ctrl?: boolean; shift?: boolean },
): boolean {
  const key = binding.key.length === 1 ? event.key.toLowerCase() === binding.key.toLowerCase() : event.key === binding.key;
  const ctrl = !!binding.ctrl === (event.ctrlKey || event.metaKey);
  const shift = !!binding.shift === event.shiftKey;
  return key && ctrl && shift;
}
