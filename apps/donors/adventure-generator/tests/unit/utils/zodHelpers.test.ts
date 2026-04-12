import { z } from 'zod';
import { Type } from '@google/genai';
import { zodToGeminiSchema } from '../../../src/utils/zodHelpers';

describe('zodToGeminiSchema', () => {
  test('converts primitive string to STRING', () => {
    const schema = z.string();
    expect(zodToGeminiSchema(schema)).toEqual({ type: Type.STRING });
  });

  test('converts number to NUMBER and int to INTEGER', () => {
    const num = z.number();
    const integer = z.number().int();
    expect(zodToGeminiSchema(num)).toEqual({ type: Type.NUMBER });
    expect(zodToGeminiSchema(integer)).toEqual({ type: Type.INTEGER });
  });

  test('converts boolean to BOOLEAN', () => {
    const schema = z.boolean();
    expect(zodToGeminiSchema(schema)).toEqual({ type: Type.BOOLEAN });
  });

  test('converts arrays with nested types', () => {
    const schema = z.array(z.string());
    expect(zodToGeminiSchema(schema)).toEqual({ type: Type.ARRAY, items: { type: Type.STRING } });

    const nested = z.array(z.array(z.number().int()));
    expect(zodToGeminiSchema(nested)).toEqual({ type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.INTEGER } } });
  });

  test('converts objects with required and optional properties', () => {
    const schema = z.object({ a: z.string(), b: z.optional(z.number()) });
    const out = zodToGeminiSchema(schema) as any;
    expect(out.type).toBe(Type.OBJECT);
    expect(out.properties).toHaveProperty('a');
    expect(out.properties).toHaveProperty('b');
    // required should only include 'a'
    expect(out.required).toEqual(['a']);
    expect(out.propertyOrdering).toEqual(['a', 'b']);
  });

  test('converts enums to STRING with enum values', () => {
    const schema = z.enum(['x', 'y'] as const);
    expect(zodToGeminiSchema(schema)).toEqual({ type: Type.STRING, enum: ['x', 'y'] });
  });

  test('unwraps wrappers: optional, nullable, default, effects', () => {
    const base = z.string();
    const optional = z.optional(base);
    const nullable = z.string().nullable();
    const withDefault = z.string().default('x');
    const effects = z.preprocess((v) => v, z.string());

    expect(zodToGeminiSchema(optional)).toEqual({ type: Type.STRING });
    expect(zodToGeminiSchema(nullable)).toEqual({ type: Type.STRING });
    expect(zodToGeminiSchema(withDefault)).toEqual({ type: Type.STRING });
    expect(zodToGeminiSchema(effects)).toEqual({ type: Type.STRING });
  });

  test('handles nested objects and recursive structures', () => {
    const child = z.object({ name: z.string(), age: z.number().int() });
    const parent = z.object({ id: z.string(), child: child.optional() });

    const outChild = zodToGeminiSchema(child) as any;
    expect(outChild.type).toBe(Type.OBJECT);
    expect(outChild.required).toEqual(['name', 'age']);

    const outParent = zodToGeminiSchema(parent) as any;
    expect(outParent.type).toBe(Type.OBJECT);
    expect(outParent.properties.child.type).toBe(Type.OBJECT);
    // parent.required should include 'id' but not 'child'
    expect(outParent.required).toEqual(['id']);
  });

  test('discriminated union merges properties', () => {
    const a = z.object({ type: z.literal('a'), a: z.string() });
    const b = z.object({ type: z.literal('b'), b: z.number() });
    const union = z.discriminatedUnion('type', [a, b]);

    const out = zodToGeminiSchema(union) as any;
    expect(out.type).toBe(Type.OBJECT);
    // merged properties should include 'type', 'a', 'b'
    expect(Object.keys(out.properties).sort()).toEqual(['a', 'b', 'type']);
    expect(out.propertyOrdering.sort()).toEqual(['a', 'b', 'type']);
  });

  test('record converts to OBJECT with additionalProperties', () => {
    const rec = z.record(z.string(), z.number());
    const out = zodToGeminiSchema(rec) as any;
    expect(out.type).toBe(Type.OBJECT);
    expect(out.additionalProperties).toEqual({ type: Type.NUMBER });
  });

  test('literal string/number/boolean handling', () => {
    expect(zodToGeminiSchema(z.literal('hello'))).toEqual({ type: Type.STRING, enum: ['hello'] });
    expect(zodToGeminiSchema(z.literal(5))).toEqual({ type: Type.NUMBER, enum: [5] });
    expect(zodToGeminiSchema(z.literal(true))).toEqual({ type: Type.BOOLEAN });
  });

  test('fallback for unknown types returns OBJECT', () => {
    // Create a fake zod-like object with unknown typeName
    const fake: any = { _def: { typeName: 'ZodUnknown' } };
    const out = zodToGeminiSchema(fake as any) as any;
    expect(out).toEqual({ type: Type.OBJECT });
  });

  test('mutation killers: exact type strings and required content', () => {
    const schema = z.object({ a: z.string(), b: z.optional(z.string()) });
    const out = zodToGeminiSchema(schema) as any;
    // ensure exact type value
    expect(out.properties.a.type).toBe(Type.STRING);
    // ensure types are not lowercase strings
    expect(out.properties.a.type).not.toBe('string');
    // required exactly equals ['a']
    expect(out.required).toEqual(['a']);
  });

  test('edge cases: empty object and deep nesting', () => {
    const empty = z.object({});
    const outEmpty = zodToGeminiSchema(empty) as any;
    expect(outEmpty.type).toBe(Type.OBJECT);
    expect(outEmpty.properties).toEqual({});
    expect(outEmpty.required).toBeUndefined();

    const deep = z.object({ l1: z.object({ l2: z.object({ l3: z.string() }) }) });
    const outDeep = zodToGeminiSchema(deep) as any;
    expect(outDeep.properties.l1.properties.l2.properties.l3.type).toBe(Type.STRING);
  });
});
