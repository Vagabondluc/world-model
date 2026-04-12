import { LootDials, RawLootResult, RawLootItem } from '../../schemas/loot';

const RARITY_TABLE = {
    "mundane": ["common", "common", "common", "common", "common", "common", "uncommon"],
    "balanced": ["common", "common", "common", "common", "uncommon", "uncommon", "rare"],
    "high_magic": ["uncommon", "uncommon", "uncommon", "rare", "rare", "very rare", "very rare"],
};

const CONSUMABLES = [
    "Potion of Healing",
    "Potion of Climbing",
    "Potion of Resistance",
    "Scroll of Protection"
];

// Simple Seeded RNG Class
class SeededRNG {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    // Mulberry32
    next(): number {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    randint(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    choice<T>(array: T[]): T {
        return array[Math.floor(this.next() * array.length)];
    }
}

export class LootEngine {
    static generate(dials: LootDials): RawLootResult {
        const rng = new SeededRNG(dials.seed || Date.now());

        // 1. Gold Generation
        const goldBase = {
            "poor": 50,
            "standard": 150,
            "rich": 400,
            "hoard": 1200
        }[dials.lootValue];

        const gold = {
            cp: rng.randint(0, Math.floor(goldBase / 2)),
            sp: rng.randint(0, Math.floor(goldBase / 3)),
            gp: rng.randint(Math.floor(goldBase / 2), goldBase)
        };

        // 2. Item Generation
        const items: RawLootItem[] = [];
        const itemCount = rng.randint(1, 3 + Math.floor(dials.partyLevel / 3));
        const rarityPool = RARITY_TABLE[dials.rarityBias];

        for (let i = 0; i < itemCount; i++) {
            const isMagic = rng.next() < dials.magicDensity;

            // If strictly first level and mundane bias, force common
            let rarity = "common";
            if (isMagic) {
                rarity = rng.choice(rarityPool);
                // Level Cap Safeguard
                if (dials.partyLevel < 3 && (rarity === "rare" || rarity === "very rare")) {
                    rarity = "uncommon";
                }
            }

            const isConsumable = rng.next() < dials.consumableRatio;
            const baseName = isConsumable ? rng.choice(CONSUMABLES) : "Adventuring Gear";

            const item: RawLootItem = {
                name: baseName,
                type: isConsumable ? (baseName.includes("Potion") ? 'consumable' : 'magic_item') : 'gear',
                rarity: rarity,
                magic: isMagic,
                origin: dials.origin,
                quirks: [],
                isCursed: false
            };

            if (rng.next() < dials.quirkChance) {
                item.quirks.push("quirk_marker"); // AI will fill this
            }

            if (rng.next() < dials.cursedChance) {
                item.isCursed = true;
                item.quirks.push("cursed_marker");
            }

            items.push(item);
        }

        // 3. Hook Generation
        const hasHook = rng.next() < dials.storyWeight;

        return {
            gold,
            items,
            hooks: hasHook
        };
    }
}
