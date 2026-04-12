// =============================================================================
// MythosForge - Custom Category Slice
// =============================================================================

import type { CustomCategoryDef } from '@/lib/types';
import { CATEGORY_TEMPLATES, CATEGORY_GROUPS, CATEGORY_ICONS, buildCustomTemplate } from '@/lib/types';

/**
 * Add a custom category definition to the store.
 */
export function addCustomCategoryAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (_fn: (_state: any) => any) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _get: () => any,
  def: CustomCategoryDef,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set((state: any) => ({
    customCategories: [...state.customCategories, def],
  }));
}

/**
 * Update an existing custom category by ID.
 */
export function updateCustomCategoryAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (_fn: (_state: any) => any) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _get: () => any,
  id: string,
  updates: Partial<CustomCategoryDef>,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set((state: any) => ({
    customCategories: state.customCategories.map((c: CustomCategoryDef) =>
      c.id === id ? { ...c, ...updates } : c,
    ),
  }));
}

/**
 * Remove a custom category by ID.
 */
export function removeCustomCategoryAction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (_fn: (_state: any) => any) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _get: () => any,
  id: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set((state: any) => ({
    customCategories: state.customCategories.filter((c: CustomCategoryDef) => c.id !== id),
  }));
}

/**
 * Get the effective attribute template for a category,
 * checking custom categories first, then built-in templates.
 */
function resolveEffectiveTemplate(
  category: string,
  state: { customCategories: CustomCategoryDef[] },
  seen = new Set<string>(),
): Record<string, unknown> | undefined {
  if (seen.has(category)) return CATEGORY_TEMPLATES[category];
  seen.add(category);

  const customCat = state.customCategories.find((c) => c.name === category);
  if (!customCat) return CATEGORY_TEMPLATES[category];

  const baseTemplate = customCat.baseCategory
    ? customCat.baseCategory === category
      ? CATEGORY_TEMPLATES[category]
      : resolveEffectiveTemplate(customCat.baseCategory, state, seen)
    : undefined;

  return buildCustomTemplate(customCat, baseTemplate ?? {});
}

export function getEffectiveTemplate(
  category: string,
  state: { customCategories: CustomCategoryDef[] },
): Record<string, unknown> | undefined {
  return resolveEffectiveTemplate(category, state);
}

/**
 * Get the effective category groups, merging built-in and custom categories.
 */
export function getEffectiveGroups(
  state: { customCategories: CustomCategoryDef[] },
): Record<string, string[]> {
  const groups: Record<string, string[]> = JSON.parse(JSON.stringify(CATEGORY_GROUPS));
  for (const cat of state.customCategories) {
    if (!groups[cat.group]) {
      groups[cat.group] = [];
    }
    if (!groups[cat.group].includes(cat.name)) {
      groups[cat.group].push(cat.name);
    }
  }
  return groups;
}

/**
 * Get the effective icon for a category,
 * checking custom categories first, then built-in icons.
 */
export function getEffectiveIcon(
  category: string,
  state: { customCategories: CustomCategoryDef[] },
): string {
  const customCat = state.customCategories.find((c) => c.name === category);
  if (customCat) return customCat.icon;
  return CATEGORY_ICONS[category] || 'FileText';
}
