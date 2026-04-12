import { HexCoordinate, BiomeType, ManagedLocation } from '@mi/types';

export interface ImperialSettings {
    playerCount: number;
    tier: 'small' | 'standard' | 'large';
    seed: string;
}

const TIER_K: Record<string, number> = {
    small: 5,
    standard: 8,
    large: 12
};

// 4-player tier (Rhombus n)
const TIER_N: Record<string, number> = {
    small: 10,
    standard: 15,
    large: 20
};

export function generateImperialMap(settings: ImperialSettings) {
    const { playerCount, tier } = settings;

    // Validation
    if (playerCount < 1 || playerCount > 6) {
        throw new Error(`Invalid player count: ${playerCount}. Must be between 1 and 6.`);
    }

    const hexBiomes: Record<string, BiomeType> = {};
    const hexes: HexCoordinate[] = [];
    const regions: any[] = []; // TODO: define Region type properly if needed here

    if (playerCount === 4) {
        const n = TIER_N[tier];
        // Rhombus board
        for (let q = 0; q < n; q++) {
            for (let r = 0; r < n; r++) {
                const hex = { q, r, s: -q - r };
                hexes.push(hex);
                hexBiomes[`${q},${r}`] = 'grassland';
            }
        }

        // Quarters
        const h = n / 2;
        const regionHexes: Record<number, HexCoordinate[]> = { 0: [], 1: [], 2: [], 3: [] };
        hexes.forEach(hex => {
            const idx = (hex.q < h ? 0 : 1) + (hex.r < h ? 0 : 2);
            regionHexes[idx].push(hex);
        });

        Object.keys(regionHexes).forEach((idx: any) => {
            regions.push({
                id: `region-${idx}`,
                name: `Player ${Number(idx) + 1} Territory`,
                hexes: regionHexes[idx]
            });
        });

    } else {
        const k = TIER_K[tier];
        // Hexagon board
        for (let q = -k; q <= k; q++) {
            const r1 = Math.max(-k, -q - k);
            const r2 = Math.min(k, -q + k);
            for (let r = r1; r <= r2; r++) {
                const hex = { q, r, s: -q - r };
                hexes.push(hex);
                hexBiomes[`${q},${r}`] = 'grassland';
            }
        }

        // Partition into sectors
        const regionHexes: Record<number, HexCoordinate[]> = {};
        hexes.forEach(hex => {
            if (hex.q === 0 && hex.r === 0) {
                // Center hex
                if (!regionHexes[0]) regionHexes[0] = [];
                regionHexes[0].push(hex);
                return;
            }

            // Using atan2 to find sector
            const y = Math.sqrt(3) * (hex.r + hex.q / 2);
            const x = 3 / 2 * hex.q;
            let angle = Math.atan2(y, x) * (180 / Math.PI);
            if (angle < 0) angle += 360;

            let sector = Math.floor(angle / 60); // 0-5

            let playerIdx = 0;
            if (playerCount === 6) playerIdx = sector;
            else if (playerCount === 3) playerIdx = Math.floor(sector / 2);
            else if (playerCount === 2) playerIdx = Math.floor(sector / 3);
            else if (playerCount === 1) playerIdx = 0;
            else if (playerCount === 5) {
                // 5P is tricky, use sector 0-4 and 5 goes to neutral or center
                playerIdx = sector === 5 ? -1 : sector;
            }

            if (playerIdx === -1) {
                // Neutral
                return;
            }

            if (!regionHexes[playerIdx]) regionHexes[playerIdx] = [];
            regionHexes[playerIdx].push(hex);
        });

        Object.keys(regionHexes).forEach((idx: any) => {
            regions.push({
                id: `region-${idx}`,
                name: `Player ${Number(idx) + 1} Territory`,
                hexes: regionHexes[idx]
            });
        });
    }

    // Locations array for Capitals
    const locations: ManagedLocation[] = []; // Using any to match return type, but structurally ManagedLocation

    // Seed/Capital Coordinates based on Spec Section 12
    // We calculate these based on k or n
    // Seed/Capital Coordinates based on Spec Section 12
    // We calculate these based on k (radius for Hexagon) or n (side for Rhombus)
    // See docs/roadmap/shared_hex_map_player_board_spec.md for the definitive geometric formulas.
    const playerSeeds: Record<number, HexCoordinate> = {};

    if (playerCount === 4) {
        // Rhombus (n)
        const n = TIER_N[tier];
        const h = n / 2;
        // Spec 12.3: Q1(h/2, h/2), Q2(h+h/2, h/2), ...
        // Note: Spec 12.3 says P1(-2,-1) for standard?
        // Wait, Spec 12.3 is for Hexagon 4P? No, Spec 12.3 is "3 Players".
        // Spec 12.4 is "4 Players"
        // Spec 11.3 Seeds for 4 Players (Rhombus size n)
        // Q1: (h/2, h/2). Q2: (h + h/2, h/2)...
        // But our q,r are 0..n-1.

        // Let's use the explicit formulas from Spec 11.3
        const q1 = Math.floor(h / 2);
        const q2 = Math.floor(h + h / 2);

        playerSeeds[0] = { q: q1, r: q1, s: -q1 - q1 }; // P1
        playerSeeds[1] = { q: q2, r: q1, s: -q2 - q1 }; // P2
        playerSeeds[2] = { q: q2, r: q2, s: -q2 - q2 }; // P3
        playerSeeds[3] = { q: q1, r: q2, s: -q1 - q2 }; // P4

    } else {
        // Hexagon (k)
        const k = TIER_K[tier];
        // Spec 11.2 Ring Seeds
        // P1 starts at (k, 0) for all layouts usually (Sector 0)

        if (playerCount === 1) {
            playerSeeds[0] = { q: 0, r: 0, s: 0 };
        } else if (playerCount === 2) {
            // 12.2: P1(-2,0), P2(2,0) for radius? 
            // Spec 11.2 says for 2 players: P1(0, -k), P2(0, k)
            // Let's stick to 11.2 "Seeds for 2 Players (three sectors each)"
            playerSeeds[0] = { q: 0, r: -k, s: k };
            playerSeeds[1] = { q: 0, r: k, s: -k };
        } else if (playerCount === 3) {
            // 11.2: P1(k,0), P2(0,-k), P3(-k,k)
            playerSeeds[0] = { q: k, r: 0, s: -k };
            playerSeeds[1] = { q: 0, r: -k, s: k };
            playerSeeds[2] = { q: -k, r: k, s: 0 };
        } else if (playerCount === 5) {
            // 11.2: 5 seeds on ring
            playerSeeds[0] = { q: k, r: 0, s: -k };
            playerSeeds[1] = { q: k, r: -k, s: 0 };
            playerSeeds[2] = { q: 0, r: -k, s: k };
            playerSeeds[3] = { q: -k, r: 0, s: k };
            playerSeeds[4] = { q: -k, r: k, s: 0 };
        } else if (playerCount === 6) {
            // 11.2: All 6 corners
            playerSeeds[0] = { q: k, r: 0, s: -k };
            playerSeeds[1] = { q: k, r: -k, s: 0 };
            playerSeeds[2] = { q: 0, r: -k, s: k };
            playerSeeds[3] = { q: -k, r: 0, s: k };
            playerSeeds[4] = { q: -k, r: k, s: 0 };
            playerSeeds[5] = { q: 0, r: k, s: -k };
        }
    }

    // Generate locations
    Object.entries(playerSeeds).forEach(([pIdx, hex]) => {
        const playerNum = Number(pIdx) + 1;
        const regionId = `region-${pIdx}`;
        // Verify hex exists in hexes?
        // It might be outside if board is small? No, k is radius. (k,0) is edge. valid.

        locations.push({
            id: crypto.randomUUID(),
            mapId: 'imperial-map',
            regionId: regionId,
            hexCoordinate: hex,
            biome: hexBiomes[`${hex.q},${hex.r}`] || 'grassland',
            type: 'Settlement',
            name: `Capital of Player ${playerNum}`,
            description: `The seat of power for Player ${playerNum}.`,
            isKnownToPlayers: true,
            discoveryStatus: 'discovered',
            connectedLocations: [],
            loreReferences: [],
            customTags: ['Capital', 'Start'],
            notes: "",
            createdAt: new Date(),
            lastModified: new Date()
        });
    });

    return { hexBiomes, regions, locations };
}
