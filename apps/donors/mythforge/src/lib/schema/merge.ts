import type { SchemaDefinition } from './registry';

export function mergeSchemas(
  left: SchemaDefinition,
  right: SchemaDefinition,
  strategy: 'prefer-left' | 'prefer-right' = 'prefer-left',
): SchemaDefinition {
  const fields = new Map<string, Record<string, unknown>>();

  for (const field of left.fields ?? []) {
    const name = String(field.name ?? '');
    fields.set(name, { ...field });
  }

  for (const field of right.fields ?? []) {
    const name = String(field.name ?? '');
    if (strategy === 'prefer-right' || !fields.has(name)) {
      fields.set(name, { ...field });
    }
  }

  return {
    ...left,
    fields: [...fields.values()],
  };
}
