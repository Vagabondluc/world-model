import { Type } from "@google/genai";
import { z } from "zod";

/**
 * Converts a Zod schema into a Google Gemini API compatible JSON schema.
 * Uses _def.typeName checks instead of instanceof for improved reliability 
 * across different module execution environments.
 * 
 * @param schema The Zod schema to convert.
 * @returns A JSON schema object compatible with Gemini's `responseSchema`.
 */
export const zodToGeminiSchema = (schema: z.ZodTypeAny): unknown => {
    if (!schema) return undefined;

    const typeName = (schema as { _def?: { typeName?: string } })._def?.typeName;

    // Handle Wrappers (Optional, Nullable, Default, Effects)
    if (typeName === 'ZodOptional' || typeName === 'ZodNullable' || typeName === 'ZodDefault') {
        return zodToGeminiSchema((schema as { _def: { innerType: z.ZodTypeAny } })._def.innerType);
    }
    
    if (typeName === 'ZodEffects') {
        return zodToGeminiSchema((schema as { _def: { schema: z.ZodTypeAny } })._def.schema);
    }

    if (typeName === 'ZodObject') {
        const properties: Record<string, unknown> = {};
        const required: string[] = [];
        const shape = (schema as { _def: { shape: () => Record<string, z.ZodTypeAny> } })._def.shape();
        const keys = Object.keys(shape);

        keys.forEach((key) => {
            const fieldSchema = shape[key];
            properties[key] = zodToGeminiSchema(fieldSchema);
            
            const fieldTypeName = (fieldSchema as { _def?: { typeName?: string } })._def?.typeName;
            if (fieldTypeName !== 'ZodOptional' && fieldTypeName !== 'ZodNullable') {
                required.push(key);
            }
        });

        return {
            type: Type.OBJECT,
            properties,
            required: required.length > 0 ? required : undefined,
            propertyOrdering: keys, // Critical for Gemini structured output stability
        };
    }

    if (typeName === 'ZodDiscriminatedUnion') {
        // Gemini prefers simplified objects for unions. 
        // We merge keys to create a superset object schema.
        const properties: Record<string, unknown> = {};
        const options = (schema as { _def: { options: Array<z.ZodObject<Record<string, z.ZodTypeAny>>> } })._def.options;
        
        options.forEach(opt => {
            const shape = opt._def.shape();
            Object.entries(shape).forEach(([key, val]) => {
                if (!properties[key]) properties[key] = zodToGeminiSchema(val as z.ZodTypeAny);
            });
        });

        const mergedKeys = Object.keys(properties);
        return {
            type: Type.OBJECT,
            properties,
            propertyOrdering: mergedKeys,
        };
    }

    if (typeName === 'ZodArray') {
        return {
            type: Type.ARRAY,
            items: zodToGeminiSchema((schema as { _def: { type: z.ZodTypeAny } })._def.type),
        };
    }

    if (typeName === 'ZodString') {
        return { type: Type.STRING };
    }

    if (typeName === 'ZodNumber') {
        const isInt = (schema as { _def: { checks?: Array<{ kind?: string }> } })._def.checks?.some((check) => check.kind === "int");
        return { type: isInt ? Type.INTEGER : Type.NUMBER };
    }

    if (typeName === 'ZodBoolean') {
        return { type: Type.BOOLEAN };
    }

    if (typeName === 'ZodEnum') {
        return {
            type: Type.STRING,
            enum: (schema as { _def: { values: string[] } })._def.values,
        };
    }

    if (typeName === 'ZodRecord') {
        return {
            type: Type.OBJECT,
            additionalProperties: zodToGeminiSchema((schema as { _def: { valueType: z.ZodTypeAny } })._def.valueType)
        };
    }
    
    if (typeName === 'ZodLiteral') {
         const value = (schema as { _def: { value: unknown } })._def.value;
         if (typeof value === 'string') return { type: Type.STRING, enum: [value] };
         if (typeof value === 'number') return { type: Type.NUMBER, enum: [value] };
         if (typeof value === 'boolean') return { type: Type.BOOLEAN };
    }

    // Default Fallback
    console.warn(`[zodToGeminiSchema] Unhandled Zod type "${typeName}", defaulting to OBJECT.`);
    return { type: Type.OBJECT };
};
