
import { z } from "zod";

export const JobPostSchema = z.object({
    title: z.string().describe("A catchy title for the job posting"),
    summary: z.string().describe("The core description of the task or quest"),
    complications: z.array(z.string()).describe("Potential twists or difficulties"),
    rewards: z.array(z.string()).describe("Payment, loot, or favors offered"),
    tags: z.array(z.string()).optional().describe("Keywords like 'Combat', 'Investigation', 'Undead'"),
});

export type JobPost = z.infer<typeof JobPostSchema>;

// New schemas for Oracle
export const OracleOutcomeSchema = z.object({
    title: z.string().describe("A brief, evocative title for the outcome (e.g., 'A Fragile Alliance', 'The Trap is Sprung')."),
    result: z.string().describe("The immediate result of the action. What happens right now?"),
    consequences: z.array(z.string()).describe("The short and long-term consequences of this outcome. What happens next, or later?"),
});

export const OracleResponseSchema = z.object({
    outcomes: z.array(OracleOutcomeSchema).length(3).describe("An array of exactly three distinct, possible outcomes.")
});

// FIX: Corrected OracleOutcome to be inferred from OracleOutcomeSchema instead of OracleResponseSchema.
export type OracleOutcome = z.infer<typeof OracleOutcomeSchema>;
export type OracleResponse = z.infer<typeof OracleResponseSchema>;