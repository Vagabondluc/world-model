import type { SchemaDefinition } from './registry';

export interface SchemaConflict {
  field: string;
  left?: unknown;
  right?: unknown;
}

export function detectSchemaConflicts(left: SchemaDefinition, right: SchemaDefinition): SchemaConflict[] {
  const leftFields = new Map((left.fields ?? []).map((field) => [String(field.name ?? ''), field]));
  const rightFields = new Map((right.fields ?? []).map((field) => [String(field.name ?? ''), field]));
  const conflicts: SchemaConflict[] = [];

  for (const [fieldName, leftField] of leftFields.entries()) {
    const rightField = rightFields.get(fieldName);
    if (rightField && JSON.stringify(leftField) !== JSON.stringify(rightField)) {
      conflicts.push({ field: fieldName, left: leftField, right: rightField });
    }
  }

  return conflicts;
}
