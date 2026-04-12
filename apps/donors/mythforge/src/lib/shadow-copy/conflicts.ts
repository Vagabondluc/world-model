import type { ShadowCopyEntity } from './file-format';

export interface ShadowConflict {
  field: keyof ShadowCopyEntity;
  base?: unknown;
  theirs?: unknown;
  ours?: unknown;
}

export function detectConflicts(base: ShadowCopyEntity, theirs: ShadowCopyEntity): ShadowConflict[] {
  const conflicts: ShadowConflict[] = [];
  for (const field of ['title', 'category', 'content'] as const) {
    if (base[field] !== theirs[field]) {
      conflicts.push({ field, base: base[field], theirs: theirs[field] });
    }
  }
  return conflicts;
}

export function resolveConflict(
  base: ShadowCopyEntity,
  theirs: ShadowCopyEntity,
  ours: ShadowCopyEntity,
  strategy: 'base' | 'theirs' | 'ours' = 'ours',
): ShadowCopyEntity {
  switch (strategy) {
    case 'base':
      return { ...base };
    case 'theirs':
      return { ...theirs };
    case 'ours':
    default:
      return { ...ours };
  }
}
