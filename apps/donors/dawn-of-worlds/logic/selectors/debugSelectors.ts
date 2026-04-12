
import { GameState } from '../../types';

export interface DebugGameState {
    resources: {
        power: number;
    };
    era: {
        index: number;
        name: string;
        // progress: number; // Not easily deriveable yet without tech tree state
    };
    world: {
        seed: string; // Not currently in state, placeholder
        objectCount: number;
    };
    units: Array<{
        id: string;
        type: string;
        position: { q: number; r: number };
    }>;
}

export const selectDebugState = (state: GameState): DebugGameState => {
    const activePlayer = state.playerCache[state.activePlayerId];

    // Filter units from world cache
    const units = Array.from(state.worldCache.values())
        .filter(obj => obj.kind === 'UNIT' || obj.kind === 'ARMY') // Assuming 'ARMY' or similar, strict check on kind
        .map(obj => ({
            id: obj.id,
            type: obj.id, // Using ID or name as type for now
            position: obj.hexes[0] || { q: 0, r: 0 }
        }));

    return {
        resources: {
            power: activePlayer?.currentPower || 0
        },
        era: {
            index: state.age,
            name: `Age ${state.age}`,
        },
        world: {
            seed: state.config?.seed || 'unknown',
            objectCount: state.worldCache.size
        },
        units
    };
};
