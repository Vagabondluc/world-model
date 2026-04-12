
import { Region } from "../core/types";
import { NameStyle } from "../history/WorldLinguist";
import { BiomeType } from "../../globe/rendering/BiomeColors";

interface CultureWeight {
    style: NameStyle;
    weight: number;
}

export class CultureMap {

    private static readonly BIOME_CULTURES: Partial<Record<BiomeType, CultureWeight[]>> = {
        // Polar / Tundra
        [BiomeType.SNOW]: [
            { style: NameStyle.Inuit, weight: 0.5 },
            { style: NameStyle.Uralic, weight: 0.3 },
            { style: NameStyle.Germanic, weight: 0.2 }
        ],
        [BiomeType.TUNDRA]: [
            { style: NameStyle.Inuit, weight: 0.4 },
            { style: NameStyle.Uralic, weight: 0.4 },
            { style: NameStyle.Germanic, weight: 0.2 }
        ],

        // Boreal / Taiga
        [BiomeType.TAIGA]: [
            { style: NameStyle.Slavic, weight: 0.4 },
            { style: NameStyle.Germanic, weight: 0.3 },
            { style: NameStyle.Celtic, weight: 0.3 }
        ],

        // Temperate
        [BiomeType.FOREST]: [
            { style: NameStyle.English, weight: 0.3 },
            { style: NameStyle.French, weight: 0.3 },
            { style: NameStyle.German, weight: 0.4 }
        ],
        [BiomeType.RAINFOREST]: [
            { style: NameStyle.Celtic, weight: 0.5 },
            { style: NameStyle.English, weight: 0.3 },
            { style: NameStyle.Amerindian, weight: 0.2 }
        ],

        // Grassland / Steppe
        [BiomeType.GRASSLAND]: [
            { style: NameStyle.Turkish, weight: 0.4 },
            { style: NameStyle.Persian, weight: 0.3 },
            { style: NameStyle.Slavic, weight: 0.3 }
        ],
        [BiomeType.SAVANNA]: [
            { style: NameStyle.Greek, weight: 0.4 },
            { style: NameStyle.Italian, weight: 0.3 },
            { style: NameStyle.Spanish, weight: 0.3 }
        ],

        // Arid / Desert
        [BiomeType.DESERT]: [
            { style: NameStyle.Arabic, weight: 0.5 },
            { style: NameStyle.AfroAsiatic, weight: 0.3 },
            { style: NameStyle.Swahili, weight: 0.2 }
        ],

        // Tropical
        [BiomeType.TROPICAL_FOREST]: [
            { style: NameStyle.Nahuatl, weight: 0.4 },
            { style: NameStyle.Yoruba, weight: 0.3 },
            { style: NameStyle.Vietnamese, weight: 0.3 }
        ],
        [BiomeType.HIGHLAND]: [
            { style: NameStyle.Swahili, weight: 0.5 },
            { style: NameStyle.NigerCongo, weight: 0.3 },
            { style: NameStyle.Austronesian, weight: 0.2 }
        ],

        // Mountain / Alpine (High Elevation)
        [BiomeType.MOUNTAIN]: [
            { style: NameStyle.SinoTibetan, weight: 0.4 },
            { style: NameStyle.Hindi, weight: 0.3 },
            { style: NameStyle.Greek, weight: 0.3 }
        ]
    };

    private static readonly FALLBACK_CULTURES: CultureWeight[] = [
        { style: NameStyle.Austronesian, weight: 0.3 },
        { style: NameStyle.Portuguese, weight: 0.3 },
        { style: NameStyle.Maori, weight: 0.4 }
    ];

    public static assignCultures(regions: Region[], worldSeed: string): void {
        for (const region of regions) {
            const culture = this.selectCulture(region.biome, region.center, worldSeed);
            region.cultureId = culture;
            // Console log removed to reduce noise
        }
    }

    private static selectCulture(biomeId: BiomeType, center: [number, number, number], seed: string): NameStyle {
        const weights = this.BIOME_CULTURES[biomeId] || this.FALLBACK_CULTURES;
        const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);

        // Deterministic Randomness
        const hash = this.hashPosition(center, seed);
        let random = (hash % 1000) / 1000 * totalWeight;

        for (const item of weights) {
            random -= item.weight;
            if (random <= 0) {
                return item.style;
            }
        }
        return weights[0].style;
    }

    private static hashPosition(p: [number, number, number], seed: string): number {
        const str = `${seed}-${p[0].toFixed(2)}-${p[1].toFixed(2)}-${p[2].toFixed(2)}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
}
