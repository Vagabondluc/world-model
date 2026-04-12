import { z } from "zod";

// --- Dials (Input) ---

export interface LootDials {
    partyLevel: number;
    lootValue: 'poor' | 'standard' | 'rich' | 'hoard';
    magicDensity: number; // 0.0 - 1.0
    rarityBias: 'mundane' | 'balanced' | 'high_magic';
    tone: 'gritty' | 'heroic' | 'mythic';
    origin: string;
    sentienceChance: number;
    quirkChance: number;
    cursedChance: number;
    consumableRatio: number;
    storyWeight: number;
    seed?: number;
}

// --- Engine Output (Internal) ---

export interface RawLootItem {
    name: string; // Placeholder (e.g. "Potion")
    type: 'consumable' | 'gear' | 'weapon' | 'armor' | 'magic_item';
    rarity: string;
    magic: boolean;
    origin: string;
    quirks: string[];
    isCursed: boolean;
}

export interface RawLootResult {
    gold: { gp: number; sp: number; cp: number };
    items: RawLootItem[];
    hooks: boolean; // Engine says "yes/no", AI writes the hook
}

// --- Final Output (Public) ---

export const LootSchema = z.object({
    gold: z.object({
        gp: z.number().int().default(0).describe("Gold pieces"),
        sp: z.number().int().default(0).describe("Silver pieces"),
        cp: z.number().int().default(0).describe("Copper pieces"),
    }).describe("Currency found."),
    items: z.array(z.object({
        name: z.string().describe("Evocative name of the item"),
        type: z.string().describe("Type of item (weapon, potion, etc.)"),
        rarity: z.string(),
        magic: z.boolean(),
        description: z.string().optional().describe("Short visual description"),
        quirks: z.array(z.string()).optional().describe("Sensory details or minor magical effects"),
        origin: z.string().optional()
    })).describe("List of items found."),
    hooks: z.array(z.string()).describe("Narrative hooks tied to the loot, if any."),
});

export type Loot = z.infer<typeof LootSchema>;
