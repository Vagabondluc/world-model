import type { SchemaDefinition } from './registry';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export async function validateAgainstSchemas(entity: Record<string, unknown>, schemas: SchemaDefinition[]): Promise<ValidationResult> {
  const errors: string[] = [];

  for (const schema of schemas) {
    for (const field of schema.fields ?? []) {
      const name = String(field.name ?? '');
      const required = field.required !== false;
      if (required && entity[name] == null) {
        errors.push(`Missing required field: ${name}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
