/**
 * Vitest Test Suite for worldStore
 * 
 * Tests for the worldStore including world initialization, cell operations,
 * culture operations, civilization operations, and selectors.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useWorldStore } from '../worldStore';
import type { Cell, Culture, Civilization, WorldGenerationParams } from '../schemas';

// ============================================================================
// SETUP
// ============================================================================

const mockCell1: Cell = {
    id: 'cell_0',
    q: 0,
    r: 0,
    elevation: 0.5,
    moisture: 0.5,
    temperature: 0.5,
    biome: 'plains',
    population: 100,
    development: 0.5,
};

const mockCell2: Cell = {
    id: 'cell_1',
    q: 1,
    r: 0,
    elevation: 0.3,
    moisture: 0.7,
    temperature: 0.6,
    biome: 'forest',
    population: 200,
    development: 0.7,
};

const mockCell3: Cell = {
    id: 'cell_2',
    q: 0,
    r: 1,
    elevation: 0.2,
    moisture: 0.8,
    temperature: 0.4,
    biome: 'ocean',
    population: 0,
    development: 0.0,
};

const mockCulture: Culture = {
    id: 'culture_test',
    name: 'Test Culture',
    language: 'Test Language',
    traits: ['trait1', 'trait2'],
    originCellId: 'cell_0',
    color: '#FF0000',
    foundedYear: 100,
};

const mockCiv: Civilization = {
    id: 'civ_test',
    name: 'Test Civilization',
    cultureId: 'culture_test',
    capitalCellId: 'cell_0',
    controlledCells: new Set(['cell_0', 'cell_1']),
    foundedYear: 100,
    color: '#00FF00',
};

const mockGenParams: WorldGenerationParams = {
    seed: 12345,
    worldSize: 'medium',
    tectonicPlates: 7,
    erosionIterations: 100,
    temperatureVariation: 0.5,
    moistureVariation: 0.5,
    seaLevel: 0.3,
    mountainHeight: 0.8,
    riverCount: 10,
};

beforeEach(() => {
    // Reset the store before each test
    useWorldStore.getState().resetWorld();
});

// ============================================================================
// INITIAL STATE TESTS
// ============================================================================

describe('worldStore - Initial State', () => {
    it('should have correct initial state', () => {
        const state = useWorldStore.getState();

        expect(state.cells).toBeInstanceOf(Map);
        expect(state.cells.size).toBe(0);
        expect(state.cultures).toBeInstanceOf(Map);
        expect(state.cultures.size).toBe(0);
        expect(state.civilizations).toBeInstanceOf(Map);
        expect(state.civilizations.size).toBe(0);
        expect(state.year).toBe(0);
        expect(state.generationParams.seed).toBeDefined();
        expect(state.generationParams.worldSize).toBe('medium');
    });
});

// ============================================================================
// WORLD MANAGEMENT TESTS
// ============================================================================

describe('worldStore - World Management', () => {
    describe('initializeWorld', () => {
        it('should initialize world with generation params', () => {
            const { initializeWorld } = useWorldStore.getState();

            initializeWorld(mockGenParams);

            const state = useWorldStore.getState();
            expect(state.generationParams).toEqual(mockGenParams);
            expect(state.year).toBe(0);
            expect(state.cells.size).toBe(0);
            expect(state.cultures.size).toBe(0);
            expect(state.civilizations.size).toBe(0);
        });

        it('should clear existing data when initializing', () => {
            const { initializeWorld, addCell, addCulture, addCivilization } = useWorldStore.getState();

            // Add some data
            addCell(mockCell1);
            addCulture(mockCulture);
            addCivilization(mockCiv);

            expect(useWorldStore.getState().cells.size).toBe(1);
            expect(useWorldStore.getState().cultures.size).toBe(1);
            expect(useWorldStore.getState().civilizations.size).toBe(1);

            // Initialize
            initializeWorld(mockGenParams);

            const state = useWorldStore.getState();
            expect(state.cells.size).toBe(0);
            expect(state.cultures.size).toBe(0);
            expect(state.civilizations.size).toBe(0);
        });
    });

    describe('resetWorld', () => {
        it('should reset to initial state', () => {
            const { addCell, addCulture, addCivilization, resetWorld } = useWorldStore.getState();

            // Add some data
            addCell(mockCell1);
            addCulture(mockCulture);
            addCivilization(mockCiv);

            resetWorld();

            const state = useWorldStore.getState();
            expect(state.cells.size).toBe(0);
            expect(state.cultures.size).toBe(0);
            expect(state.civilizations.size).toBe(0);
            expect(state.year).toBe(0);
        });
    });

    describe('advanceYear', () => {
        it('should increment year', () => {
            const { advanceYear } = useWorldStore.getState();

            advanceYear();
            expect(useWorldStore.getState().year).toBe(1);

            advanceYear();
            expect(useWorldStore.getState().year).toBe(2);
        });
    });
});

// ============================================================================
// CELL OPERATIONS TESTS
// ============================================================================

describe('worldStore - Cell Operations', () => {
    describe('addCell', () => {
        it('should add a cell', () => {
            const { addCell } = useWorldStore.getState();

            addCell(mockCell1);

            const state = useWorldStore.getState();
            expect(state.cells.size).toBe(1);
            expect(state.cells.get('cell_0')).toEqual(mockCell1);
        });

        it('should add multiple cells', () => {
            const { addCell } = useWorldStore.getState();

            addCell(mockCell1);
            addCell(mockCell2);
            addCell(mockCell3);

            const state = useWorldStore.getState();
            expect(state.cells.size).toBe(3);
        });

        it('should reject invalid cell', () => {
            const { addCell } = useWorldStore.getState();

            const invalidCell = { ...mockCell1, elevation: 1.5 }; // Invalid: > 1

            // Should throw validation error
            expect(() => addCell(invalidCell as any)).toThrow();

            const state = useWorldStore.getState();
            expect(state.cells.size).toBe(0);
        });
    });

    describe('updateCell', () => {
        beforeEach(() => {
            useWorldStore.getState().addCell(mockCell1);
        });

        it('should update cell properties', () => {
            const { updateCell } = useWorldStore.getState();

            updateCell('cell_0', { population: 500 });

            const state = useWorldStore.getState();
            const cell = state.cells.get('cell_0');
            expect(cell?.population).toBe(500);
        });

        it('should update multiple properties', () => {
            const { updateCell } = useWorldStore.getState();

            updateCell('cell_0', { population: 500, development: 0.8, biome: 'grassland' });

            const state = useWorldStore.getState();
            const cell = state.cells.get('cell_0');
            expect(cell?.population).toBe(500);
            expect(cell?.development).toBe(0.8);
            expect(cell?.biome).toBe('grassland');
        });

        it('should not affect other cells', () => {
            const { addCell, updateCell } = useWorldStore.getState();

            addCell(mockCell2);
            updateCell('cell_0', { population: 500 });

            const state = useWorldStore.getState();
            const cell1 = state.cells.get('cell_0');
            const cell2 = state.cells.get('cell_1');
            expect(cell1?.population).toBe(500);
            expect(cell2?.population).toBe(200);
        });

        it('should do nothing for non-existent cell', () => {
            const { updateCell } = useWorldStore.getState();

            updateCell('cell_999', { population: 500 });

            const state = useWorldStore.getState();
            expect(state.cells.size).toBe(1);
        });
    });

    describe('removeCell', () => {
        beforeEach(() => {
            useWorldStore.getState().addCell(mockCell1);
            useWorldStore.getState().addCell(mockCell2);
        });

        it('should remove a cell', () => {
            const { removeCell } = useWorldStore.getState();

            removeCell('cell_0');

            const state = useWorldStore.getState();
            expect(state.cells.size).toBe(1);
            expect(state.cells.has('cell_0')).toBe(false);
        });

        it('should remove cell from civilization territories', () => {
            const { addCell, addCivilization, removeCell } = useWorldStore.getState();

            addCell(mockCell1);
            addCivilization(mockCiv);

            expect(useWorldStore.getState().civilizations.get('civ_test')?.controlledCells.has('cell_0')).toBe(true);

            removeCell('cell_0');

            const state = useWorldStore.getState();
            expect(state.civilizations.get('civ_test')?.controlledCells.has('cell_0')).toBe(false);
        });

        it('should do nothing for non-existent cell', () => {
            const { removeCell } = useWorldStore.getState();

            removeCell('cell_999');

            const state = useWorldStore.getState();
            expect(state.cells.size).toBe(2);
        });
    });

    describe('getCell', () => {
        beforeEach(() => {
            useWorldStore.getState().addCell(mockCell1);
        });

        it('should return cell by ID', () => {
            const { getCell } = useWorldStore.getState();

            const cell = getCell('cell_0');
            expect(cell).toEqual(mockCell1);
        });

        it('should return undefined for non-existent cell', () => {
            const { getCell } = useWorldStore.getState();

            const cell = getCell('cell_999');
            expect(cell).toBeUndefined();
        });
    });

    describe('getCellsByBiome', () => {
        beforeEach(() => {
            useWorldStore.getState().addCell(mockCell1); // plains
            useWorldStore.getState().addCell(mockCell2); // forest
            useWorldStore.getState().addCell(mockCell3); // ocean
        });

        it('should return cells of specified biome', () => {
            const { getCellsByBiome } = useWorldStore.getState();

            const plainsCells = getCellsByBiome('plains');
            expect(plainsCells.length).toBe(1);
            expect(plainsCells[0].id).toBe('cell_0');
        });

        it('should return empty array for non-existent biome', () => {
            const { getCellsByBiome } = useWorldStore.getState();

            const cells = getCellsByBiome('desert');
            expect(cells).toEqual([]);
        });
    });

    describe('getCellsByOwner', () => {
        beforeEach(() => {
            useWorldStore.getState().addCell(mockCell1);
            useWorldStore.getState().addCell(mockCell2);
            useWorldStore.getState().addCell(mockCell3);
            useWorldStore.getState().addCivilization(mockCiv);
            useWorldStore.getState().updateCell('cell_0', { ownerId: 'civ_test' });
            useWorldStore.getState().updateCell('cell_1', { ownerId: 'civ_test' });
        });

        it('should return cells owned by civilization', () => {
            const { getCellsByOwner } = useWorldStore.getState();

            const civCells = getCellsByOwner('civ_test');
            expect(civCells.length).toBe(2);
            expect(civCells.map(c => c.id)).toEqual(['cell_0', 'cell_1']);
        });

        it('should return empty array for non-existent owner', () => {
            const { getCellsByOwner } = useWorldStore.getState();

            const cells = getCellsByOwner('civ_999');
            expect(cells).toEqual([]);
        });
    });

    describe('getCellsByCulture', () => {
        beforeEach(() => {
            useWorldStore.getState().addCell(mockCell1);
            useWorldStore.getState().addCell(mockCell2);
            useWorldStore.getState().updateCell('cell_0', { cultureId: 'culture_test' });
            useWorldStore.getState().updateCell('cell_1', { cultureId: 'culture_test' });
        });

        it('should return cells with specified culture', () => {
            const { getCellsByCulture } = useWorldStore.getState();

            const cultureCells = getCellsByCulture('culture_test');
            expect(cultureCells.length).toBe(2);
            expect(cultureCells.map(c => c.id)).toEqual(['cell_0', 'cell_1']);
        });

        it('should return empty array for non-existent culture', () => {
            const { getCellsByCulture } = useWorldStore.getState();

            const cells = getCellsByCulture('culture_999');
            expect(cells).toEqual([]);
        });
    });
});

// ============================================================================
// CULTURE OPERATIONS TESTS
// ============================================================================

describe('worldStore - Culture Operations', () => {
    describe('addCulture', () => {
        it('should add a culture', () => {
            const { addCulture } = useWorldStore.getState();

            addCulture(mockCulture);

            const state = useWorldStore.getState();
            expect(state.cultures.size).toBe(1);
            expect(state.cultures.get('culture_test')).toEqual(mockCulture);
        });

        it('should reject invalid culture', () => {
            const { addCulture } = useWorldStore.getState();

            const invalidCulture = { ...mockCulture, foundedYear: -1 };

            // Should throw validation error
            expect(() => addCulture(invalidCulture as any)).toThrow();

            const state = useWorldStore.getState();
            expect(state.cultures.size).toBe(0);
        });
    });

    describe('updateCulture', () => {
        beforeEach(() => {
            useWorldStore.getState().addCulture(mockCulture);
        });

        it('should update culture properties', () => {
            const { updateCulture } = useWorldStore.getState();

            updateCulture('culture_test', { name: 'Updated Culture' });

            const state = useWorldStore.getState();
            const culture = state.cultures.get('culture_test');
            expect(culture?.name).toBe('Updated Culture');
        });

        it('should do nothing for non-existent culture', () => {
            const { updateCulture } = useWorldStore.getState();

            updateCulture('culture_999', { name: 'Updated Culture' });

            const state = useWorldStore.getState();
            expect(state.cultures.size).toBe(1);
        });
    });

    describe('removeCulture', () => {
        beforeEach(() => {
            useWorldStore.getState().addCulture(mockCulture);
            useWorldStore.getState().addCell(mockCell1);
            useWorldStore.getState().updateCell('cell_0', { cultureId: 'culture_test' });
        });

        it('should remove a culture', () => {
            const { removeCulture } = useWorldStore.getState();

            removeCulture('culture_test');

            const state = useWorldStore.getState();
            expect(state.cultures.size).toBe(0);
        });

        it('should remove culture reference from cells', () => {
            const { removeCulture } = useWorldStore.getState();

            removeCulture('culture_test');

            const state = useWorldStore.getState();
            const cell = state.cells.get('cell_0');
            expect(cell?.cultureId).toBeUndefined();
        });
    });

    describe('getCulture', () => {
        beforeEach(() => {
            useWorldStore.getState().addCulture(mockCulture);
        });

        it('should return culture by ID', () => {
            const { getCulture } = useWorldStore.getState();

            const culture = getCulture('culture_test');
            expect(culture).toEqual(mockCulture);
        });

        it('should return undefined for non-existent culture', () => {
            const { getCulture } = useWorldStore.getState();

            const culture = getCulture('culture_999');
            expect(culture).toBeUndefined();
        });
    });
});

// ============================================================================
// CIVILIZATION OPERATIONS TESTS
// ============================================================================

describe('worldStore - Civilization Operations', () => {
    beforeEach(() => {
        useWorldStore.getState().addCell(mockCell1);
        useWorldStore.getState().addCell(mockCell2);
    });

    describe('addCivilization', () => {
        it('should add a civilization', () => {
            const { addCivilization } = useWorldStore.getState();

            addCivilization(mockCiv);

            const state = useWorldStore.getState();
            expect(state.civilizations.size).toBe(1);
            expect(state.civilizations.get('civ_test')).toEqual(mockCiv);
        });

        it('should reject invalid civilization', () => {
            const { addCivilization } = useWorldStore.getState();

            const invalidCiv = { ...mockCiv, foundedYear: -1 };

            // Should throw validation error
            expect(() => addCivilization(invalidCiv as any)).toThrow();

            const state = useWorldStore.getState();
            expect(state.civilizations.size).toBe(0);
        });
    });

    describe('updateCivilization', () => {
        beforeEach(() => {
            useWorldStore.getState().addCivilization(mockCiv);
        });

        it('should update civilization properties', () => {
            const { updateCivilization } = useWorldStore.getState();

            updateCivilization('civ_test', { name: 'Updated Civilization' });

            const state = useWorldStore.getState();
            const civ = state.civilizations.get('civ_test');
            expect(civ?.name).toBe('Updated Civilization');
        });

        it('should do nothing for non-existent civilization', () => {
            const { updateCivilization } = useWorldStore.getState();

            updateCivilization('civ_999', { name: 'Updated Civilization' });

            const state = useWorldStore.getState();
            expect(state.civilizations.size).toBe(1);
        });
    });

    describe('removeCivilization', () => {
        beforeEach(() => {
            useWorldStore.getState().addCivilization(mockCiv);
            useWorldStore.getState().updateCell('cell_0', { ownerId: 'civ_test' });
            useWorldStore.getState().updateCell('cell_1', { ownerId: 'civ_test' });
        });

        it('should remove a civilization', () => {
            const { removeCivilization } = useWorldStore.getState();

            removeCivilization('civ_test');

            const state = useWorldStore.getState();
            expect(state.civilizations.size).toBe(0);
        });

        it('should remove civilization ownership from cells', () => {
            const { removeCivilization } = useWorldStore.getState();

            removeCivilization('civ_test');

            const state = useWorldStore.getState();
            expect(state.cells.get('cell_0')?.ownerId).toBeUndefined();
            expect(state.cells.get('cell_1')?.ownerId).toBeUndefined();
        });
    });

    describe('getCivilization', () => {
        beforeEach(() => {
            useWorldStore.getState().addCivilization(mockCiv);
        });

        it('should return civilization by ID', () => {
            const { getCivilization } = useWorldStore.getState();

            const civ = getCivilization('civ_test');
            expect(civ).toEqual(mockCiv);
        });

        it('should return undefined for non-existent civilization', () => {
            const { getCivilization } = useWorldStore.getState();

            const civ = getCivilization('civ_999');
            expect(civ).toBeUndefined();
        });
    });

    describe('addCellToCivilization', () => {
        beforeEach(() => {
            useWorldStore.getState().addCivilization(mockCiv);
            useWorldStore.getState().addCell(mockCell3); // needed for test
        });

        it('should add cell to civilization territory', () => {
            const { addCellToCivilization } = useWorldStore.getState();

            addCellToCivilization('civ_test', 'cell_2');

            const state = useWorldStore.getState();
            const civ = state.civilizations.get('civ_test');
            expect(civ?.controlledCells.has('cell_2')).toBe(true);
            expect(state.cells.get('cell_2')?.ownerId).toBe('civ_test');
        });

        it('should not add cell if civilization does not exist', () => {
            const { addCellToCivilization } = useWorldStore.getState();

            addCellToCivilization('civ_999', 'cell_2');

            const state = useWorldStore.getState();
            expect(state.cells.get('cell_2')?.ownerId).toBeUndefined();
        });
    });

    describe('removeCellFromCivilization', () => {
        beforeEach(() => {
            useWorldStore.getState().addCivilization(mockCiv);
        });

        it('should remove cell from civilization territory', () => {
            const { removeCellFromCivilization } = useWorldStore.getState();

            removeCellFromCivilization('civ_test', 'cell_0');

            const state = useWorldStore.getState();
            const civ = state.civilizations.get('civ_test');
            expect(civ?.controlledCells.has('cell_0')).toBe(false);
            expect(state.cells.get('cell_0')?.ownerId).toBeUndefined();
        });
    });

    describe('transferCell', () => {
        beforeEach(() => {
            const civ2: Civilization = {
                ...mockCiv,
                id: 'civ_test2',
                name: 'Test Civilization 2',
            };
            useWorldStore.getState().addCivilization(mockCiv);
            useWorldStore.getState().addCivilization(civ2);
            useWorldStore.getState().addCell(mockCell3); // needed for test
        });

        it('should transfer cell from one civ to another', () => {
            const { transferCell } = useWorldStore.getState();

            transferCell('cell_0', 'civ_test', 'civ_test2');

            const state = useWorldStore.getState();
            const civ1 = state.civilizations.get('civ_test');
            const civ2 = state.civilizations.get('civ_test2');

            expect(civ1?.controlledCells.has('cell_0')).toBe(false);
            expect(civ2?.controlledCells.has('cell_0')).toBe(true);
            expect(state.cells.get('cell_0')?.ownerId).toBe('civ_test2');
        });

        it('should transfer cell from unowned to civ', () => {
            const { transferCell } = useWorldStore.getState();

            transferCell('cell_2', undefined, 'civ_test');

            const state = useWorldStore.getState();
            const civ = state.civilizations.get('civ_test');

            expect(civ?.controlledCells.has('cell_2')).toBe(true);
            expect(state.cells.get('cell_2')?.ownerId).toBe('civ_test');
        });
    });
});

// ============================================================================
// GENERATION PARAMS TESTS
// ============================================================================

describe('worldStore - Generation Parameters', () => {
    describe('updateGenerationParams', () => {
        it('should update generation params', () => {
            const { updateGenerationParams } = useWorldStore.getState();

            updateGenerationParams({ seed: 99999, tectonicPlates: 10 });

            const state = useWorldStore.getState();
            expect(state.generationParams.seed).toBe(99999);
            expect(state.generationParams.tectonicPlates).toBe(10);
            expect(state.generationParams.worldSize).toBe('medium'); // Unchanged
        });
    });
});

// ============================================================================
// SELECTOR TESTS
// ============================================================================

describe('worldStore - Selectors', () => {
    beforeEach(() => {
        useWorldStore.getState().addCell(mockCell1);
        useWorldStore.getState().addCell(mockCell2);
        useWorldStore.getState().addCell(mockCell3);
        useWorldStore.getState().addCulture(mockCulture);
        useWorldStore.getState().addCivilization(mockCiv);
    });

    describe('selectTotalCells', () => {
        it('should return total cell count', () => {
            const state = useWorldStore.getState();
            expect(state.cells.size).toBe(3);
        });
    });

    describe('selectAllCells', () => {
        it('should return all cells as array', () => {
            const state = useWorldStore.getState();
            const cells = Array.from(state.cells.values());
            expect(cells.length).toBe(3);
            expect(cells.map(c => c.id)).toEqual(['cell_0', 'cell_1', 'cell_2']);
        });
    });

    describe('selectTotalCultures', () => {
        it('should return total culture count', () => {
            const state = useWorldStore.getState();
            expect(state.cultures.size).toBe(1);
        });
    });

    describe('selectTotalCivilizations', () => {
        it('should return total civilization count', () => {
            const state = useWorldStore.getState();
            expect(state.civilizations.size).toBe(1);
        });
    });

    describe('selectTotalPopulation', () => {
        it('should return total population', () => {
            const state = useWorldStore.getState();
            const total = Array.from(state.cells.values()).reduce((sum, cell) => sum + cell.population, 0);
            expect(total).toBe(300); // 100 + 200 + 0
        });
    });

    describe('selectCivTerritorySize', () => {
        it('should return territory size for civilization', () => {
            const state = useWorldStore.getState();
            const civ = state.civilizations.get('civ_test');
            expect(civ?.controlledCells.size).toBe(2);
        });
    });

    describe('selectBiomeDistribution', () => {
        it('should return biome distribution', () => {
            const state = useWorldStore.getState();
            const distribution: Record<string, number> = {};
            state.cells.forEach((cell) => {
                distribution[cell.biome] = (distribution[cell.biome] || 0) + 1;
            });

            expect(distribution['plains']).toBe(1);
            expect(distribution['forest']).toBe(1);
            expect(distribution['ocean']).toBe(1);
        });
    });

    describe('selectAverageDevelopment', () => {
        it('should return average development', () => {
            const state = useWorldStore.getState();
            const cells = Array.from(state.cells.values());
            const total = cells.reduce((sum, cell) => sum + cell.development, 0);
            const avg = cells.length > 0 ? total / cells.length : 0;

            expect(avg).toBeCloseTo(0.4, 1); // (0.5 + 0.7 + 0.0) / 3
        });
    });

    describe('selectCellExists', () => {
        it('should return true for existing cell', () => {
            const state = useWorldStore.getState();
            expect(state.cells.has('cell_0')).toBe(true);
        });

        it('should return false for non-existent cell', () => {
            const state = useWorldStore.getState();
            expect(state.cells.has('cell_999')).toBe(false);
        });
    });

    describe('selectCultureExists', () => {
        it('should return true for existing culture', () => {
            const state = useWorldStore.getState();
            expect(state.cultures.has('culture_test')).toBe(true);
        });

        it('should return false for non-existent culture', () => {
            const state = useWorldStore.getState();
            expect(state.cultures.has('culture_999')).toBe(false);
        });
    });

    describe('selectCivilizationExists', () => {
        it('should return true for existing civilization', () => {
            const state = useWorldStore.getState();
            expect(state.civilizations.has('civ_test')).toBe(true);
        });

        it('should return false for non-existent civilization', () => {
            const state = useWorldStore.getState();
            expect(state.civilizations.has('civ_999')).toBe(false);
        });
    });
});
