/**
 * World Store - World Simulation State Management
 * 
 * This store manages the world simulation state including cells, cultures,
 * civilizations, and world generation parameters. It uses Zod validation
 * middleware to ensure all state updates are type-safe and valid.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';
import { v4 as uuidv4 } from 'uuid';

// Enable Immer MapSet plugin
enableMapSet();

import {
    WorldStateSchema,
    CellSchema,
    CultureSchema,
    CivilizationSchema,
    WorldGenerationParamsSchema,
    CellIdSchema,
    CultureIdSchema,
    CivilizationIdSchema,
    type WorldState,
    type Cell,
    type Culture,
    type Civilization,
    type WorldGenerationParams,
    type CellId,
    type CultureId,
    type CivilizationId,
    type BiomeType,
} from './schemas';
import { zodValidation } from './middleware/zodValidation';

// ============================================================================
// INITIAL STATE
// ============================================================================

const INITIAL_STATE: WorldState = {
    cells: new Map(),
    cultures: new Map(),
    civilizations: new Map(),
    year: 0,
    generationParams: {
        seed: Date.now(),
        worldSize: 'medium',
        tectonicPlates: 7,
        erosionIterations: 100,
        temperatureVariation: 0.5,
        moistureVariation: 0.5,
    },
};

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface WorldStoreState extends WorldState {
    // World Management
    initializeWorld: (params: WorldGenerationParams) => void;
    resetWorld: () => void;
    advanceYear: () => void;

    // Cell Operations
    addCell: (cell: Cell) => void;
    updateCell: (cellId: CellId, changes: Partial<Cell>) => void;
    removeCell: (cellId: CellId) => void;
    getCell: (cellId: CellId) => Cell | undefined;
    getCellsByBiome: (biome: BiomeType) => Cell[];
    getCellsByOwner: (ownerId: CivilizationId) => Cell[];
    getCellsByCulture: (cultureId: CultureId) => Cell[];

    // Culture Operations
    addCulture: (culture: Culture) => void;
    updateCulture: (cultureId: CultureId, changes: Partial<Culture>) => void;
    removeCulture: (cultureId: CultureId) => void;
    getCulture: (cultureId: CultureId) => Culture | undefined;

    // Civilization Operations
    addCivilization: (civ: Civilization) => void;
    updateCivilization: (civId: CivilizationId, changes: Partial<Civilization>) => void;
    removeCivilization: (civId: CivilizationId) => void;
    getCivilization: (civId: CivilizationId) => Civilization | undefined;
    addCellToCivilization: (civId: CivilizationId, cellId: CellId) => void;
    removeCellFromCivilization: (civId: CivilizationId, cellId: CellId) => void;

    // Territory Management
    transferCell: (cellId: CellId, fromCivId: CivilizationId | undefined, toCivId: CivilizationId) => void;

    // Generation Parameters
    updateGenerationParams: (params: Partial<WorldGenerationParams>) => void;
}

// ============================================================================
// STORE CREATION
// ============================================================================

export const useWorldStore = create<WorldStoreState>()(
    zodValidation({
        stateSchema: WorldStateSchema,
        logErrors: true,
    })(
        immer((set, get) => ({
            ...INITIAL_STATE,

            /**
             * Initialize the world with generation parameters
             */
            initializeWorld: (params) => {
                WorldGenerationParamsSchema.parse(params);

                set((state) => {
                    state.generationParams = params;
                    state.year = 0;
                    state.cells.clear();
                    state.cultures.clear();
                    state.civilizations.clear();
                });
            },

            /**
             * Reset the world to initial state
             */
            resetWorld: () => {
                set(INITIAL_STATE);
            },

            /**
             * Advance the world year
             */
            advanceYear: () => {
                set((state) => {
                    state.year += 1;
                });
            },

            /**
             * Add a new cell to the world
             */
            addCell: (cell) => {
                CellSchema.parse(cell);

                set((state) => {
                    state.cells.set(cell.id, cell);
                });
            },

            /**
             * Update an existing cell
             */
            updateCell: (cellId, changes) => {
                CellIdSchema.parse(cellId);

                set((state) => {
                    const cell = state.cells.get(cellId);
                    if (cell) {
                        Object.assign(cell, changes);
                    }
                });
            },

            /**
             * Remove a cell from the world
             */
            removeCell: (cellId) => {
                CellIdSchema.parse(cellId);

                set((state) => {
                    state.cells.delete(cellId);

                    // Remove from civilizations
                    state.civilizations.forEach((civ) => {
                        civ.controlledCells.delete(cellId);
                    });
                });
            },

            /**
             * Get a cell by ID
             */
            getCell: (cellId) => {
                return get().cells.get(cellId);
            },

            /**
             * Get all cells of a specific biome
             */
            getCellsByBiome: (biome) => {
                return Array.from(get().cells.values()).filter((cell) => cell.biome === biome);
            },

            /**
             * Get all cells owned by a civilization
             */
            getCellsByOwner: (ownerId) => {
                return Array.from(get().cells.values()).filter((cell) => cell.ownerId === ownerId);
            },

            /**
             * Get all cells with a specific culture
             */
            getCellsByCulture: (cultureId) => {
                return Array.from(get().cells.values()).filter((cell) => cell.cultureId === cultureId);
            },

            /**
             * Add a new culture
             */
            addCulture: (culture) => {
                CultureSchema.parse(culture);

                set((state) => {
                    state.cultures.set(culture.id, culture);
                });
            },

            /**
             * Update an existing culture
             */
            updateCulture: (cultureId, changes) => {
                CultureIdSchema.parse(cultureId);

                set((state) => {
                    const culture = state.cultures.get(cultureId);
                    if (culture) {
                        Object.assign(culture, changes);
                    }
                });
            },

            /**
             * Remove a culture
             */
            removeCulture: (cultureId) => {
                CultureIdSchema.parse(cultureId);

                set((state) => {
                    state.cultures.delete(cultureId);

                    // Remove culture reference from cells
                    state.cells.forEach((cell) => {
                        if (cell.cultureId === cultureId) {
                            cell.cultureId = undefined;
                        }
                    });
                });
            },

            /**
             * Get a culture by ID
             */
            getCulture: (cultureId) => {
                return get().cultures.get(cultureId);
            },

            /**
             * Add a new civilization
             */
            addCivilization: (civ) => {
                CivilizationSchema.parse(civ);

                set((state) => {
                    state.civilizations.set(civ.id, civ);
                });
            },

            /**
             * Update an existing civilization
             */
            updateCivilization: (civId, changes) => {
                CivilizationIdSchema.parse(civId);

                set((state) => {
                    const civ = state.civilizations.get(civId);
                    if (civ) {
                        Object.assign(civ, changes);
                    }
                });
            },

            /**
             * Remove a civilization
             */
            removeCivilization: (civId) => {
                CivilizationIdSchema.parse(civId);

                set((state) => {
                    state.civilizations.delete(civId);

                    // Remove civilization ownership from cells
                    state.cells.forEach((cell) => {
                        if (cell.ownerId === civId) {
                            cell.ownerId = undefined;
                        }
                    });
                });
            },

            /**
             * Get a civilization by ID
             */
            getCivilization: (civId) => {
                return get().civilizations.get(civId);
            },

            /**
             * Add a cell to a civilization's territory
             */
            addCellToCivilization: (civId, cellId) => {
                CivilizationIdSchema.parse(civId);
                CellIdSchema.parse(cellId);

                set((state) => {
                    const civ = state.civilizations.get(civId);
                    const cell = state.cells.get(cellId);

                    if (civ && cell) {
                        civ.controlledCells.add(cellId);
                        cell.ownerId = civId;
                    }
                });
            },

            /**
             * Remove a cell from a civilization's territory
             */
            removeCellFromCivilization: (civId, cellId) => {
                CivilizationIdSchema.parse(civId);
                CellIdSchema.parse(cellId);

                set((state) => {
                    const civ = state.civilizations.get(civId);
                    const cell = state.cells.get(cellId);

                    if (civ && cell) {
                        civ.controlledCells.delete(cellId);
                        cell.ownerId = undefined;
                    }
                });
            },

            /**
             * Transfer a cell from one civilization to another
             */
            transferCell: (cellId, fromCivId, toCivId) => {
                CellIdSchema.parse(cellId);
                CivilizationIdSchema.parse(toCivId);

                set((state) => {
                    const cell = state.cells.get(cellId);
                    if (!cell) return;

                    // Remove from previous owner
                    if (fromCivId) {
                        const fromCiv = state.civilizations.get(fromCivId);
                        if (fromCiv) {
                            fromCiv.controlledCells.delete(cellId);
                        }
                    }

                    // Add to new owner
                    const toCiv = state.civilizations.get(toCivId);
                    if (toCiv) {
                        toCiv.controlledCells.add(cellId);
                        cell.ownerId = toCivId;
                    }
                });
            },

            /**
             * Update world generation parameters
             */
            updateGenerationParams: (params) => {
                set((state) => {
                    Object.assign(state.generationParams, params);
                });
            },
        }))
    )
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Get the total number of cells
 */
export const selectTotalCells = (state: WorldStoreState): number => {
    return state.cells.size;
};

/**
 * Get all cells as an array
 */
export const selectAllCells = (state: WorldStoreState): Cell[] => {
    return Array.from(state.cells.values());
};

/**
 * Get the total number of cultures
 */
export const selectTotalCultures = (state: WorldStoreState): number => {
    return state.cultures.size;
};

/**
 * Get all cultures as an array
 */
export const selectAllCultures = (state: WorldStoreState): Culture[] => {
    return Array.from(state.cultures.values());
};

/**
 * Get the total number of civilizations
 */
export const selectTotalCivilizations = (state: WorldStoreState): number => {
    return state.civilizations.size;
};

/**
 * Get all civilizations as an array
 */
export const selectAllCivilizations = (state: WorldStoreState): Civilization[] => {
    return Array.from(state.civilizations.values());
};

/**
 * Get the total world population
 */
export const selectTotalPopulation = (state: WorldStoreState): number => {
    return Array.from(state.cells.values()).reduce((sum, cell) => sum + cell.population, 0);
};

/**
 * Get the total controlled territory (number of cells) for a civilization
 */
export const selectCivTerritorySize = (civId: CivilizationId) => (state: WorldStoreState): number => {
    const civ = state.civilizations.get(civId);
    return civ ? civ.controlledCells.size : 0;
};

/**
 * Get all cells controlled by a civilization
 */
export const selectCivCells = (civId: CivilizationId) => (state: WorldStoreState): Cell[] => {
    const civ = state.civilizations.get(civId);
    if (!civ) return [];

    return Array.from(civ.controlledCells)
        .map((cellId) => state.cells.get(cellId))
        .filter((cell): cell is Cell => cell !== undefined);
};

/**
 * Get biome distribution statistics
 */
export const selectBiomeDistribution = (state: WorldStoreState): Record<BiomeType, number> => {
    const distribution: Record<string, number> = {};

    state.cells.forEach((cell) => {
        distribution[cell.biome] = (distribution[cell.biome] || 0) + 1;
    });

    return distribution as Record<BiomeType, number>;
};

/**
 * Get the average development level across all cells
 */
export const selectAverageDevelopment = (state: WorldStoreState): number => {
    const cells = Array.from(state.cells.values());
    if (cells.length === 0) return 0;

    const total = cells.reduce((sum, cell) => sum + cell.development, 0);
    return total / cells.length;
};

/**
 * Check if a cell exists
 */
export const selectCellExists = (cellId: CellId) => (state: WorldStoreState): boolean => {
    return state.cells.has(cellId);
};

/**
 * Check if a culture exists
 */
export const selectCultureExists = (cultureId: CultureId) => (state: WorldStoreState): boolean => {
    return state.cultures.has(cultureId);
};

/**
 * Check if a civilization exists
 */
export const selectCivilizationExists = (civId: CivilizationId) => (state: WorldStoreState): boolean => {
    return state.civilizations.has(civId);
};

// ============================================================================
// EXPORTS
// ============================================================================

export type { WorldStoreState };
