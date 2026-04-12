import React from 'react';
import { ZodTypeAny } from 'zod';

/**
 * Registered component descriptor used by the OpenUI registry.
 */
export interface RegisteredComponent {
  type: string;
  component: React.ComponentType<object>;
  propSchema: ZodTypeAny;
}

/**
 * Public ComponentRegistry API
 */
export interface ComponentRegistry {
  register<P extends object>(_type: string, _component: React.ComponentType<P>, _propSchema: ZodTypeAny): void;
  get(_type: string): RegisteredComponent | undefined;
  getAll(): RegisteredComponent[];
}

/**
 * Simple in-memory registry implementation.
 */
class ComponentRegistryImpl implements ComponentRegistry {
  private map = new Map<string, RegisteredComponent>();

  register<P extends object>(_type: string, _component: React.ComponentType<P>, _propSchema: ZodTypeAny) {
    const type = _type;
    const component = _component;
    const propSchema = _propSchema;
    if (this.map.has(type)) {
      // allow overwriting in dev; warn so callers are aware
      // eslint-disable-next-line no-console
      console.warn(`[OpenUI][registry] overwriting registration for type: ${type}`);
    }
    this.map.set(type, { type, component: component as React.ComponentType<object>, propSchema });
  }

  get(_type: string) {
    return this.map.get(_type);
  }

  getAll() {
    return Array.from(this.map.values());
  }
}

export const registry: ComponentRegistry = new ComponentRegistryImpl();

export function getComponentRegistry(): ComponentRegistry {
  return registry;
}

export default registry;
