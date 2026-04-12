
import { FieldDef } from './types';

export type TypedArray = Float32Array | Int32Array | Uint32Array | Uint8Array;

/**
 * Wraps raw binary data with field metadata and accessors.
 * Provides a type-safe way to handle simulation buffers.
 */
export class FieldState<T extends TypedArray> {
  constructor(
    public readonly def: FieldDef,
    public readonly data: T,
    public readonly count: number
  ) {
    if (data.length !== count * def.components) {
      throw new Error(`FieldState data length mismatch. Expected ${count * def.components}, got ${data.length}`);
    }
  }

  /**
   * Get value at index. For vector fields, specify component.
   */
  public get(index: number, component: number = 0): number {
    return this.data[index * this.def.components + component];
  }

  /**
   * Set value at index.
   */
  public set(index: number, value: number, component: number = 0): void {
    this.data[index * this.def.components + component] = value;
  }
  
  /**
   * Creates a deep copy of the field state.
   */
  public clone(): FieldState<T> {
    // TypedArray .slice() or constructor copy is sufficient
    // @ts-ignore - Constructor polymorphism is hard in TS without messy overloads
    const newData = new this.data.constructor(this.data);
    return new FieldState(this.def, newData, this.count);
  }

  /**
   * Factory to create zeroed state.
   */
  public static create(def: FieldDef, count: number): FieldState<TypedArray> {
    let data: TypedArray;
    const size = count * def.components;
    
    switch (def.dtype) {
      case 'Float32': data = new Float32Array(size); break;
      case 'Int32':   data = new Int32Array(size); break;
      case 'Uint32':  data = new Uint32Array(size); break;
      case 'Uint8':   data = new Uint8Array(size); break;
      default: throw new Error(`Unknown dtype ${def.dtype}`);
    }
    
    return new FieldState(def, data, count);
  }
}
