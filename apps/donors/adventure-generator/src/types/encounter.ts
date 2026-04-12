import { z } from "zod";

import { TacticalItem, TacticalItemSchema, TacticalIconType } from "./narrative-kit";

export { type TacticalItem, TacticalItemSchema, type TacticalIconType };

export const EncounterDataSchema = z.object({
    title: z.string().describe("The title of the encounter"),
    goal: z.string().describe("The primary goal for the players"),
    description: z.string().describe("Sensory description of the scene"),
    envItems: z.array(TacticalItemSchema).describe("List of environmental modifiers"),
    challengeItems: z.array(TacticalItemSchema).describe("List of challenge steps or skill checks"),
    opponentItems: z.array(TacticalItemSchema).describe("List of opponents and their basic details"),
    tacticsItems: z.array(TacticalItemSchema).describe("Tactical behaviors of the opponents"),
    outcomesItems: z.array(TacticalItemSchema).describe("Win/Lose outcomes and plot hooks"),
    xpItems: z.array(TacticalItemSchema).describe("XP rewards breakdown"),
});

export type EncounterData = z.infer<typeof EncounterDataSchema>;

export interface EncounterTactic {
    name: string;
    role: string;
    priority: string;
    behavior: string;
}

export interface EncounterCombatant {
    name: string;
    count: number;
}
