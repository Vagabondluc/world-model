
import { GeneratedAdventure, AdventureOutline } from "../schemas/adventure";
import { Faction } from "../types/faction";
import { Location } from "../types/location";
import { NPC } from "../types/npc";
import { Scene, SceneTypeOption } from "../types/scene";
import { FACTION_CATEGORIES } from '../data/constants';
import { COMBINATION_METHODS, PLOTS, UNIVERSAL_TWISTS } from '../data/plotPatterns';
import { generateId } from "./helpers";

export const processOutlineData = (outlineData: Partial<AdventureOutline>) => {
    const newLocations: Location[] = outlineData.locations?.map((l: Omit<Location, 'id'>) => ({ ...l, id: generateId() })) || [];
    const newFactions: Faction[] = outlineData.factions?.map((f: Omit<Faction, 'id'>) => ({ ...f, id: generateId() })) || [];

    const newScenes: Scene[] = outlineData.scenes?.map((s) => {
        const location = newLocations.find(l => l.name === s.locationName);
        const assignedLocationId = location?.id || (newLocations.length > 0 ? newLocations[Math.floor(Math.random() * newLocations.length)].id : undefined);
        return {
            id: generateId(),
            title: s.title,
            type: s.type,
            challenge: s.challenge,
            locationId: assignedLocationId,
        };
    }) || [];

    const newNpcs: NPC[] = outlineData.npcs?.map((n) => {
        const faction = newFactions.find(f => f.name === n.faction);
        return {
            id: generateId(),
            name: n.name,
            description: n.description,
            type: n.type,
            factionId: faction?.id,
        };
    }) || [];

    return { newScenes, newLocations, newNpcs, newFactions };
};

export const buildSimpleOutlinePrompt = (hook: GeneratedAdventure) => {
    const hookPrompt = hook.type === 'simple'
        ? `Adventure Hook: "${hook.premise}"\nOrigin: ${hook.origin}\nWhy the party is suited: ${hook.positioning}\nStakes: ${hook.stakes}`
        : `Adventure Hook: "${hook.title}"\nSummary: ${hook.hook}\nPlayer Motivation: ${hook.player_buy_in}`;

    return `You are a Dungeons & Dragons adventure designer. Create a comprehensive adventure plan based on the hook below and the campaign context in your system instructions. Return a single JSON object with four top-level keys: 'scenes', 'locations', 'npcs', and 'factions'.

${hookPrompt}

Instructions:
1.  **scenes**: Create an array of 6-8 scene objects. For each, include a 'title', 'type' (Exploration, NPC Interaction, or Combat), 'challenge', and a 'locationName' which MUST match one of the names from your generated 'locations' list.
2.  **locations**: Create an array of 2-4 key location objects. For each, provide a 'name', a brief 'description', and a 'type' ('Battlemap', 'Dungeon', 'Settlement', 'or 'Special Location').
3.  **npcs**: Create an array of 2-4 key NPC objects. For each, provide a 'name', 'description', a 'type' ('Minor', 'Major', 'Antagonist', or 'Creature'), and optionally the 'faction' they belong to (matching a name from the factions list). The 'type' is crucial for later steps.
4.  **factions**: Create an array of 1-3 key faction objects. For each, provide a 'name', their primary 'goal', and a 'category' from the following list: [${FACTION_CATEGORIES.join(', ')}].`;
};

const getCombinationMethodInstruction = (methodValue: string): string => {
    switch (methodValue) {
        case 'doubleUp': 
            return "Use the Primary Plot as the 'hook layer'—what the adventure appears to be initially. Use the Secondary Plot as the 'true adventure'—what it actually becomes. The transition should feel natural.";
        case 'doubleUpPart2': 
            return "Weave both plots simultaneously. One plot should be a physical/location-based challenge, while the other is a personal/emotional one. They should progress together and resolve in a connected way.";
        case 'throwACurve': 
            return "Force the integration of both plots regardless of natural compatibility. The Primary Plot provides the main structure, and the Secondary Plot provides complications or parallel challenges. Be creative in finding connections.";
        default:
            return '';
    }
};

export type FullOutlinePromptParams = {
    primaryPlot: string;
    primaryTwist: string;
    combinationMethod: string;
    secondaryPlot: string;
    secondaryTwist: string;
    sceneCount: number;
    sceneTypes: Record<SceneTypeOption, boolean>;
};

export const buildFullOutlinePrompt = (params: FullOutlinePromptParams) => {
    const { primaryPlot, primaryTwist, combinationMethod, secondaryPlot, secondaryTwist, sceneCount, sceneTypes = {} } = params;
    const selectedSceneTypes = Object.entries(sceneTypes || {}).filter(([, checked]) => checked).map(([type]) => type);

    let locationCount, factionCount, npcCount;
    if (sceneCount <= 6) { [locationCount, factionCount, npcCount] = ["2-3", "2", "3"]; }
    else if (sceneCount <= 10) { [locationCount, factionCount, npcCount] = ["4", "3", "4-5"]; }
    else if (sceneCount <= 13) { [locationCount, factionCount, npcCount] = ["4-5", "4", "5-6"]; }
    else { [locationCount, factionCount, npcCount] = ["5+", "4+", "6+"]; }

    let plotPrompt: string;

    if (!combinationMethod) {
        // --- SINGLE PLOT PROMPT ---
        const plot = PLOTS.find(p => p.name === primaryPlot);
        const plotDetails = plot ? `The user has selected the "${plot.name}" plot pattern. Use it as the primary basis for the adventure. Concept: ${plot.concept}. Conflict: ${plot.conflict}.` : 'The user has not selected a specific plot. Select 1 plot from the provided list that fits the campaign context.';
        
        let twistPrompt: string;
        if (primaryTwist === '__NO_TWIST__') {
            twistPrompt = 'Do NOT add a twist to the plot. Generate the adventure based purely on the selected plot pattern.';
        } else if (primaryTwist === '__RANDOM_TWIST__' || !primaryTwist) {
            twistPrompt = 'Randomly select and apply 1-2 twists from the "Universal Twists" list to add variety.';
        } else {
            twistPrompt = `The user has selected the following twist. It MUST be a central part of the adventure: "${primaryTwist}"`;
        }

        plotPrompt = `**Plot Pattern:** ${plotDetails}\n*   **Twist:** ${twistPrompt}`;

    } else {
        // --- COMBINATION PLOT PROMPT ---
        const primaryPlotDetails = PLOTS.find(p => p.name === primaryPlot);
        const secondaryPlotDetails = PLOTS.find(p => p.name === secondaryPlot);
        const methodInstruction = getCombinationMethodInstruction(combinationMethod);

        plotPrompt = `**Plot Combination Instructions:**
*   **Method:** ${COMBINATION_METHODS.find(m => m.value === combinationMethod)?.name} - ${methodInstruction}
*   **Primary Plot:** "${primaryPlotDetails?.name || primaryPlot}" - ${primaryPlotDetails?.concept || "Select a fitting concept."}
*   **Primary Twist:** ${primaryTwist === '__NO_TWIST__' ? 'None' : primaryTwist === '__RANDOM_TWIST__' ? 'AI-selected random twist' : primaryTwist}
*   **Secondary Plot:** "${secondaryPlotDetails?.name || secondaryPlot}" - ${secondaryPlotDetails?.concept || "Select a fitting concept."}
*   **Secondary Twist:** ${secondaryTwist === '__NO_TWIST__' ? 'None' : secondaryTwist === '__RANDOM_TWIST__' ? 'AI-selected random twist' : secondaryTwist}`;
    }

    return `You are an expert Dungeons & Dragons adventure designer. Create a comprehensive adventure plan based on the user's configuration and the context provided in your system instructions. Return a single JSON object with four top-level keys: 'scenes', 'locations', 'npcs', and 'factions'.

**User Configuration:**
*   **Adventure Length:** Create exactly ${sceneCount} scenes.
*   **Scene Types:** The scenes should be a mix of the following types: ${selectedSceneTypes.join(', ')}.
${plotPrompt}

**Scaling Rules (generate this many of each):**
*   **Locations:** ${locationCount}
*   **Factions:** ${factionCount}
*   **NPCs:** ${npcCount} (NPCs can be of type 'Minor', 'Major', 'Antagonist', or 'Creature')

**Your Task:**
Generate a complete adventure outline following the schema. If using a combination method, ensure all parts are interconnected and consistent, using techniques like shared NPCs, layered revelations, or parallel development.

**Available Plots:**
${PLOTS.map(p => `- ${p.name}: ${p.concept}`).join('\n')}

**Universal Twists:**
${UNIVERSAL_TWISTS.map(t => `- ${t}`).join('\n')}
`;
};
