
import { z } from 'zod';

export const AiRequestEntrySchema = z.object({
    id: z.string().uuid(),
    timestamp: z.date(),
    input: z.string(),
    output: z.string(),
    model: z.string(),
    provider: z.enum(['gemini', 'ollama', 'dummy', 'unknown']).default('unknown'),
    estimatedInputTokens: z.number().default(0),
    estimatedOutputTokens: z.number().default(0),
    cost: z.number().default(0),
    details: z.record(z.any()).optional(),
});

export type AiRequestEntry = z.infer<typeof AiRequestEntrySchema>;
