export interface Open5eMonster {
    slug: string;
    name: string;
    size: string;
    type: string;
    subtype: string;
    group: string | null;
    alignment: string;
    armor_class: number;
    armor_desc: string | null;
    hit_points: number;
    hit_dice: string;
    speed: {
        walk?: number;
        fly?: number;
        swim?: number;
        climb?: number;
        burrow?: number;
        [key: string]: number | undefined;
    };
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    strength_save: number | null;
    dexterity_save: number | null;
    constitution_save: number | null;
    intelligence_save: number | null;
    wisdom_save: number | null;
    charisma_save: number | null;
    perception?: number;
    skills: Record<string, number>;
    damage_vulnerabilities: string | null;
    damage_resistances: string | null;
    damage_immunities: string | null;
    condition_immunities: string | null;
    senses: string;
    languages: string;
    challenge_rating: string;
    cr: number;
    actions: Open5eAction[];
    legendary_actions?: Open5eAction[] | null;
    special_abilities?: Open5eAction[] | null;
    document__slug: string;
    document__title: string;
}

export interface Open5eAction {
    name: string;
    desc: string;
    attack_bonus?: number;
    damage_dice?: string;
    damage_bonus?: number;
}

export interface APIResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export class Open5eService {
    private static BASE_URL = 'https://api.open5e.com';

    static async searchMonsters(query: string, limit: number = 50): Promise<Open5eMonster[]> {
        const response = await fetch(`${this.BASE_URL}/monsters/?search=${encodeURIComponent(query)}&limit=${limit}`);
        if (!response.ok) throw new Error(`Open5e search failed: ${response.statusText}`);
        const data: APIResponse<Open5eMonster> = await response.json();
        return data.results;
    }

    // Kept generic for other use cases if needed, but Monsters is our focus
    static async search<T = unknown>(category: string, query: string): Promise<T[]> {
        const response = await fetch(`${this.BASE_URL}/${category}/?search=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`Open5e search failed: ${response.statusText}`);
        const data: APIResponse<T> = await response.json();
        return data.results;
    }

    static async getMonsterDetails(slug: string): Promise<Open5eMonster> {
        const response = await fetch(`${this.BASE_URL}/monsters/${slug}/`);
        if (!response.ok) throw new Error(`Open5e fetch failed: ${response.statusText}`);
        return await response.json();
    }
}
