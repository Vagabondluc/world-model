
import { DomainId } from '../types';
import { DomainParameterSchemaV1, ParamValueV1 } from './types';

class ParameterRegistry {
  private schemas = new Map<DomainId, DomainParameterSchemaV1>();
  private values = new Map<string, ParamValueV1>(); // Key: "domainId:paramId"

  /**
   * Registers a domain schema and initializes default values.
   * Throws if domain already registered.
   */
  public registerDomain(schema: DomainParameterSchemaV1) {
    if (this.schemas.has(schema.domainId)) {
      console.warn(`[ParameterRegistry] Domain ${schema.domainId} already registered. Skipping.`);
      return;
    }
    
    this.schemas.set(schema.domainId, schema);
    
    schema.parameters.forEach(p => {
      const key = this.getKey(schema.domainId, p.id);
      this.values.set(key, p.defaultValue);
    });
    
    console.info(`[ParameterRegistry] Registered domain ${schema.domainId} with ${schema.parameters.length} params.`);
  }

  /**
   * Retrieves a parameter value. Throws if not found.
   */
  public get(domainId: DomainId, paramId: string): ParamValueV1 {
    const key = this.getKey(domainId, paramId);
    const val = this.values.get(key);
    if (val === undefined) {
        // Fallback or Error? Ideally error for strictness.
        throw new Error(`Parameter not found: ${key}`);
    }
    return val;
  }

  /**
   * Updates a parameter value with validation against bounds and step.
   */
  public set(domainId: DomainId, paramId: string, value: ParamValueV1) {
    const key = this.getKey(domainId, paramId);
    const schema = this.schemas.get(domainId);
    if (!schema) throw new Error(`Domain not registered: ${domainId}`);
    
    const def = schema.parameters.find(p => p.id === paramId);
    if (!def) throw new Error(`Parameter definition not found: ${key}`);

    let safeValue = value;

    // Validate bounds
    if (safeValue < def.bounds.min || safeValue > def.bounds.max) {
      console.warn(`[ParameterRegistry] Parameter ${key} out of bounds: ${safeValue}. Clamping to [${def.bounds.min}, ${def.bounds.max}].`);
      safeValue = Math.max(def.bounds.min, Math.min(def.bounds.max, safeValue));
    }
    
    // Snap to step
    if (def.bounds.step) {
      const step = def.bounds.step;
      safeValue = Math.round(safeValue / step) * step;
    }

    this.values.set(key, safeValue);
    // TODO: Emit ParamChangeEventV1
  }

  private getKey(domainId: DomainId, paramId: string): string {
    return `${domainId}:${paramId}`;
  }
  
  /**
   * For debugging/inspection
   */
  public getDomainState(domainId: DomainId): Record<string, ParamValueV1> {
      const schema = this.schemas.get(domainId);
      if (!schema) return {};
      
      const state: Record<string, ParamValueV1> = {};
      schema.parameters.forEach(p => {
          state[p.id] = this.get(domainId, p.id);
      });
      return state;
  }
}

export const Registry = new ParameterRegistry();
