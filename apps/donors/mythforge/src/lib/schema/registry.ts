export interface SchemaDefinition {
  name: string;
  fields?: Array<Record<string, unknown>>;
}

const registry = new Map<string, SchemaDefinition>();

export function registerSchema(schema: SchemaDefinition): void {
  registry.set(schema.name, schema);
}

export function getSchema(name: string): SchemaDefinition | undefined {
  return registry.get(name);
}

export function getAllSchemas(): SchemaDefinition[] {
  return [...registry.values()];
}
