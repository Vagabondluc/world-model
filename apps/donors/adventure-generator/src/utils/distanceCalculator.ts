
import { HexCoordinate, BiomeType } from '../types/location';
import { BIOME_CONFIG } from '../data/constants';
// FIX: Changed import to individual functions as HexUtils is not exported as a namespace
import { hexDistance, roundHex } from './hexUtils';

export interface TravelOptions {
    hexScale?: number; // Miles per hex, default 6
    travelPace?: 'fast' | 'normal' | 'slow'; // default 'normal'
    hoursPerDay?: number; // default 8
}

export interface TravelCalculation {
    days: number;
    distanceMiles: number;
    unweightedDistanceHexes: number;
    weightedHexes: number;
}

export class DistanceCalculator {
    /**
     * Calculates the number of hex steps between two coordinates (Manhattan distance on hex grid)
     */
    static getHexDistance(a: HexCoordinate, b: HexCoordinate): number {
        // FIX: Changed usage from HexUtils.hexDistance to hexDistance
        return hexDistance(a, b);
    }

    /**
     * Generates a line of hexes between two coordinates (Euclidean line projected onto hex grid)
     */
    static getEuclideanLine(a: HexCoordinate, b: HexCoordinate): HexCoordinate[] {
        const dist = this.getHexDistance(a, b);
        if (dist === 0) return [a];
        
        const results: HexCoordinate[] = [];
        for (let i = 0; i <= dist; i++) {
            const t = i / dist;
            const q = a.q * (1 - t) + b.q * t;
            const r = a.r * (1 - t) + b.r * t;
            const s = (a.s || (-a.q - a.r)) * (1 - t) + (b.s || (-b.q - b.r)) * t;
            // FIX: Changed usage from HexUtils.roundHex to roundHex
            results.push(roundHex({ q, r, s }));
        }
        return results;
    }

    /**
     * Calculates the travel "cost" (weighted distance) of a path based on biome multipliers.
     */
    static calculateTravelCost(
        path: HexCoordinate[], 
        hexBiomes: Record<string, BiomeType>
    ): number {
        let totalCost = 0;
        // We iterate from the *second* hex, assuming we start *in* the first one and move *to* the next.
        for (let i = 1; i < path.length; i++) {
            const hex = path[i];
            const key = `${hex.q},${hex.r}`;
            const biome = hexBiomes[key] || 'grassland'; // Default to grassland if undefined
            const cost = BIOME_CONFIG[biome]?.movementCost || 1;
            totalCost += cost;
        }
        return totalCost;
    }

    /**
     * Estimates travel time and distance between two points, accounting for biome difficulty.
     */
    static estimateTravelTime(
        start: HexCoordinate, 
        end: HexCoordinate, 
        hexBiomes: Record<string, BiomeType>,
        options: TravelOptions = {}
    ): TravelCalculation {
        const { hexScale = 6, travelPace = 'normal', hoursPerDay = 8 } = options;
        
        const path = this.getEuclideanLine(start, end);
        const weightedHexes = this.calculateTravelCost(path, hexBiomes);
        const unweightedDistanceHexes = this.getHexDistance(start, end);
        const distanceMiles = unweightedDistanceHexes * hexScale;
        
        // Pace in miles per day (DMG guidelines)
        let milesPerDay = 24;
        if (travelPace === 'fast') milesPerDay = 30;
        if (travelPace === 'slow') milesPerDay = 18;
        
        // Travel Time Calculation
        // Standard: 24 miles/day (normal pace) covers 4 hexes (6 miles each) of normal terrain.
        // Weighted cost multiplies the "effective" distance.
        // Effective Miles = Weighted Hexes * Scale
        
        const weightedMiles = weightedHexes * hexScale;
        
        // If custom hours per day are used (forced march), adjust miles per day linearly
        // Standard day is 8 hours. 
        const adjustedMilesPerDay = milesPerDay * (hoursPerDay / 8);
        
        const days = weightedMiles / adjustedMilesPerDay;

        return { 
            days, 
            distanceMiles, 
            unweightedDistanceHexes,
            weightedHexes 
        };
    }
}
