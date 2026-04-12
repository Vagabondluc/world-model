import { DEFAULT_DEBUG_HOOK_SETTINGS } from "./layersFeatureFlags";
import type { DebugHookSettings, SidebarSectionKey, UiPreferences } from "./types";

const SECTION_KEYS: SidebarSectionKey[] = ["generate", "style", "properties", "transform", "batchOps", "templates"];

export const UI_PREF_KEYS = {
  scaleLinked: "ui.scaleLinked",
  debugHooks: "ui.debugHooks",
  section: (section: SidebarSectionKey) => `ui.sidebarSections.${section}.collapsed`,
} as const;

export const DEFAULT_UI_PREFERENCES: UiPreferences = {
  sidebarSections: {
    generate: false,
    style: false,
    properties: false,
    transform: false,
    batchOps: false,
    templates: false,
  },
  scaleLinked: false,
  debugHooks: { ...DEFAULT_DEBUG_HOOK_SETTINGS },
};

export function loadUiPreferences(): UiPreferences {
  const sidebarSections = { ...DEFAULT_UI_PREFERENCES.sidebarSections };
  for (const section of SECTION_KEYS) {
    const raw = localStorage.getItem(UI_PREF_KEYS.section(section));
    if (raw === "true" || raw === "false") sidebarSections[section] = raw === "true";
  }
  const scaleLinkedRaw = localStorage.getItem(UI_PREF_KEYS.scaleLinked);
  const scaleLinked = scaleLinkedRaw === "true" ? true : scaleLinkedRaw === "false" ? false : DEFAULT_UI_PREFERENCES.scaleLinked;
  let debugHooks: DebugHookSettings = { ...DEFAULT_UI_PREFERENCES.debugHooks };
  try {
    const raw = localStorage.getItem(UI_PREF_KEYS.debugHooks);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DebugHookSettings>;
      debugHooks = { ...debugHooks, ...parsed };
    }
  } catch {
    // ignore malformed prefs
  }
  return { sidebarSections, scaleLinked, debugHooks };
}

export function persistSidebarSectionCollapsed(section: SidebarSectionKey, collapsed: boolean): void {
  localStorage.setItem(UI_PREF_KEYS.section(section), String(collapsed));
}

export function persistScaleLinked(value: boolean): void {
  localStorage.setItem(UI_PREF_KEYS.scaleLinked, String(value));
}

export function persistDebugHooks(hooks: DebugHookSettings): void {
  localStorage.setItem(UI_PREF_KEYS.debugHooks, JSON.stringify(hooks));
}
