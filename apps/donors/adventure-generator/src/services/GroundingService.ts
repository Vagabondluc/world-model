
import { HexCoordinate, MapLayer, Region, BiomeType, ManagedLocation } from '../types/location';
import { hexDistance } from '../utils/hexUtils';

export class GroundingService {

    /**
     * Resolves the effective biome for a specific hex.
     * Priority:
     * 1. Direct Hex Override (Painted on the layer)
     * 2. Region Dominant Biome (If hex falls within a region)
     * 3. null (Void/Empty)
     */
    getEffectiveBiome(hex: HexCoordinate, layer: MapLayer, regions: Record<string, Region>): BiomeType | null {
        const key = `${hex.q},${hex.r}`;

        // 1. Direct Hex Override
        if (layer.data.hexBiomes[key]) {
            return layer.data.hexBiomes[key];
        }

        // 2. Region Lookup
        // We iterate through regions on this layer to find one that contains the hex.
        // Optimization: In a real app, we might want a spatial index, but for now linear scan is fine ~50 regions.
        // NOTE: If multiple regions overlap, the first one found wins (or we could respect Z-index/layer order if regions had that).
        // For now, simple first-match.

        // Filter regions to only those present on this layer
        const layerRegionIds = layer.data.regions;

        for (const regionId of layerRegionIds) {
            const region = regions[regionId];
            if (region && region.hexes) {
                // fast string check for now, assuming hexes in region are stored or can be checked
                const isHexInRegion = region.hexes.some(h => h.q === hex.q && h.r === hex.r);
                if (isHexInRegion && region.dominantBiome) {
                    return region.dominantBiome;
                }
            }
        }

        return null;
    }

    /**
     * Aggregates descriptive tags from the environment at a specific hex.
     * Sources:
     * 1. Locations at this hex (customTags)
     * 2. Regions containing this hex (keyFeatures)
     */
    getTags(hex: HexCoordinate, layer: MapLayer, locations: Record<string, ManagedLocation>, regions: Record<string, Region>): string[] {
        const tags = new Set<string>();

        // 1. Locations
        // Filter locations present on this layer
        const layerLocIds = layer.data.locations;

        for (const locId of layerLocIds) {
            const loc = locations[locId];
            // Check if location exists and is at this hex
            if (loc && loc.hexCoordinate.q === hex.q && loc.hexCoordinate.r === hex.r) {
                if (loc.customTags) {
                    loc.customTags.forEach((t: string) => tags.add(t));
                }
            }
        }

        // 2. Regions
        const layerRegionIds = layer.data.regions;
        for (const regionId of layerRegionIds) {
            const region = regions[regionId];
            if (region && region.hexes) {
                // Simplified hex check (same as getEffectiveBiome)
                const isHexInRegion = region.hexes.some(h => h.q === hex.q && h.r === hex.r);
                if (isHexInRegion && region.keyFeatures) {
                    region.keyFeatures.forEach(f => tags.add(f));
                }
            }
        }

        return Array.from(tags);
    }

    serializeBiome(biome: BiomeType): string {
        const descriptions: Record<string, string> = {
            'arctic': 'Frozen wastelands of eternal ice and snow.',
            'coastal': 'Sandy shores with the sound of crashing waves.',
            'desert': 'Endless shifting sands under a scorching sun.',
            'forest': 'Dense canopy of ancient trees.',
            'grassland': 'Rolling green plains stretching to the horizon.',
            'hill': 'Rolling hills with scattered trees and rocky outcrops.',
            'jungle': 'Dense, humid wilderness with towering trees and exotic wildlife.',
            'mountain': 'Jagged, snow-capped peaks reaching toward the sky.',
            'swamp': 'Festering, mist-shrouded wetlands with treacherous footing.',
            'underdark': 'Subterranean caverns of eternal night.',
            'underwater': 'The depths of the ocean, dark and mysterious.',
            'urban': 'Bustling city streets and crowded markets.',
            'planar': 'A realm beyond the material plane, with alien landscapes.',
            'wasteland': 'Barren, desolate lands scarred by catastrophe.',
            'volcanic': 'Ash-covered lands with rivers of molten lava.',
            'ocean': 'Vast, open waters stretching to the horizon.',
            'lake': 'A body of freshwater, calm and reflective.'
        };
        return descriptions[biome] || biome;
    }

    serializeTags(tags: string[]): string[] {
        const descriptions: Record<string, string> = {
            '#cursed': 'The area is Cursed.',
            '#haunted': 'Ghostly apparitions linger here.',
            '#sacred': 'The ground is consecrated.',
            '#hidden': 'This place is magically concealed.',
            '#ruins': 'Crumbling remnants of an old civilization.',
            '#magic': 'The air hums with raw arcane energy.'
        };

        return tags.map(tag => descriptions[tag] || tag);
    }

    /**
     * Formats the grounding data into a human-readable block for the AI.
     */
    formatGroundingContext(context: {
        biome: BiomeType | null;
        tags: string[];
        landmarks?: ManagedLocation[];
    }): string {
        let lines = ["### WORLD CONTEXT:"];

        if (context.biome) {
            lines.push(`Current Biome: ${this.serializeBiome(context.biome)}`);
        }

        const tagDescriptions = this.serializeTags(context.tags);
        if (tagDescriptions.length > 0) {
            lines.push(`Local Features:`);
            tagDescriptions.forEach(desc => lines.push(`- ${desc}`));
        }

        if (context.landmarks && context.landmarks.length > 0) {
            lines.push(`Nearby Landmarks:`);
            context.landmarks.forEach(loc => {
                lines.push(`- ${loc.name} (${loc.type})`);
            });
        }

        return lines.join('\n');
    }

    /**
     * Identifies significant locations within a certain radius.
     */
    getNearbyLandmarks(
        hex: HexCoordinate,
        locations: Record<string, ManagedLocation>,
        radius: number = 1
    ): ManagedLocation[] {
        return Object.values(locations).filter(loc => {
            const dist = hexDistance(hex, loc.hexCoordinate);
            if (dist === 0 || dist > radius) return false;

            // "Significant" logic from Proposal [T-706]
            const isMajorType = ['Settlement', 'Dungeon', 'Battlemap'].includes(loc.type);
            const isExploredSpecial = loc.type === 'Special Location' && ['mapped', 'explored'].includes(loc.discoveryStatus);

            return isMajorType || isExploredSpecial;
        });
    }

    /**
     * Prepends the grounding block to the base system prompt.
     */
    constructSystemPrompt(basePrompt: string, groundingContext: string): string {
        return `### WORLD CONTEXT:\n${groundingContext}\n\n### INSTRUCTIONS:\n${basePrompt}`;
    }

    /**
     * Ensures the grounding context doesn't exceed a token/character budget.
     * Simple character-based truncation for now as a proxy for tokens.
     */
    truncateContext(text: string, budget: number): string {
        if (text.length <= budget) return text;
        return text.slice(0, budget) + "\n... [Context Truncated]";
    }
}
