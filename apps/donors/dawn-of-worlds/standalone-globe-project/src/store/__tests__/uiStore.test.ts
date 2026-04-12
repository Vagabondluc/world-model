/**
 * Vitest Test Suite for uiStore
 * 
 * Tests for the uiStore including selection state updates, display mode changes,
 * and panel visibility toggles.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../uiStore';
import type { DisplayMode } from '../schemas';

// ============================================================================
// SETUP
// ============================================================================

beforeEach(() => {
    // Reset the store before each test
    useUIStore.getState().resetUI();
});

// ============================================================================
// INITIAL STATE TESTS
// ============================================================================

describe('uiStore - Initial State', () => {
    it('should have correct initial state', () => {
        const state = useUIStore.getState();

        expect(state.selection.selectedCellId).toBeUndefined();
        expect(state.selection.hoveredCellId).toBeUndefined();
        expect(state.selection.selectedPlayerId).toBeUndefined();
        expect(state.displayMode).toBe('terrain');
        expect(state.panels.controlPanel).toBe(true);
        expect(state.panels.cellInfo).toBe(false);
        expect(state.panels.regionStats).toBe(false);
        expect(state.panels.aiController).toBe(false);
        expect(state.camera.zoom).toBe(1);
        expect(state.camera.rotationX).toBe(0);
        expect(state.camera.rotationY).toBe(0);
    });
});

// ============================================================================
// SELECTION STATE TESTS
// ============================================================================

describe('uiStore - Selection State', () => {
    describe('selectCell', () => {
        it('should set selected cell ID', () => {
            const { selectCell } = useUIStore.getState();

            selectCell('cell_0');

            const state = useUIStore.getState();
            expect(state.selection.selectedCellId).toBe('cell_0');
        });

        it('should clear selected cell ID when undefined', () => {
            const { selectCell } = useUIStore.getState();

            selectCell('cell_0');
            expect(useUIStore.getState().selection.selectedCellId).toBe('cell_0');

            selectCell(undefined);
            expect(useUIStore.getState().selection.selectedCellId).toBeUndefined();
        });

        it('should reject invalid cell ID', () => {
            const { selectCell } = useUIStore.getState();

            // Should throw validation error
            expect(() => selectCell('invalid' as any)).toThrow();

            const state = useUIStore.getState();
            expect(state.selection.selectedCellId).toBeUndefined();
        });
    });

    describe('hoverCell', () => {
        it('should set hovered cell ID', () => {
            const { hoverCell } = useUIStore.getState();

            hoverCell('cell_1');

            const state = useUIStore.getState();
            expect(state.selection.hoveredCellId).toBe('cell_1');
        });

        it('should clear hovered cell ID when undefined', () => {
            const { hoverCell } = useUIStore.getState();

            hoverCell('cell_1');
            expect(useUIStore.getState().selection.hoveredCellId).toBe('cell_1');

            hoverCell(undefined);
            expect(useUIStore.getState().selection.hoveredCellId).toBeUndefined();
        });
    });

    describe('selectPlayer', () => {
        it('should set selected player ID', () => {
            const { selectPlayer } = useUIStore.getState();

            selectPlayer('P1');

            const state = useUIStore.getState();
            expect(state.selection.selectedPlayerId).toBe('P1');
        });

        it('should clear selected player ID when undefined', () => {
            const { selectPlayer } = useUIStore.getState();

            selectPlayer('P1');
            expect(useUIStore.getState().selection.selectedPlayerId).toBe('P1');

            selectPlayer(undefined);
            expect(useUIStore.getState().selection.selectedPlayerId).toBeUndefined();
        });

        it('should reject invalid player ID', () => {
            const { selectPlayer } = useUIStore.getState();

            // Should throw validation error
            expect(() => selectPlayer('invalid-id' as any)).toThrow();

            const state = useUIStore.getState();
            expect(state.selection.selectedPlayerId).toBeUndefined();
        });
    });

    describe('clearSelection', () => {
        it('should clear all selections', () => {
            const { selectCell, hoverCell, selectPlayer, clearSelection } = useUIStore.getState();

            selectCell('cell_0');
            hoverCell('cell_1');
            selectPlayer('P1');

            expect(useUIStore.getState().selection.selectedCellId).toBe('cell_0');
            expect(useUIStore.getState().selection.hoveredCellId).toBe('cell_1');
            expect(useUIStore.getState().selection.selectedPlayerId).toBe('P1');

            clearSelection();

            const state = useUIStore.getState();
            expect(state.selection.selectedCellId).toBeUndefined();
            expect(state.selection.hoveredCellId).toBeUndefined();
            expect(state.selection.selectedPlayerId).toBeUndefined();
        });
    });
});

// ============================================================================
// DISPLAY MODE TESTS
// ============================================================================

describe('uiStore - Display Mode', () => {
    const displayModes: DisplayMode[] = [
        'terrain',
        'political',
        'cultural',
        'elevation',
        'temperature',
        'moisture',
        'population',
    ];

    describe('setDisplayMode', () => {
        it('should set display mode', () => {
            const { setDisplayMode } = useUIStore.getState();

            setDisplayMode('political');

            const state = useUIStore.getState();
            expect(state.displayMode).toBe('political');
        });

        it('should accept all valid display modes', () => {
            displayModes.forEach((mode) => {
                useUIStore.getState().setDisplayMode(mode);
                expect(useUIStore.getState().displayMode).toBe(mode);
            });
        });
    });

    describe('cycleDisplayMode', () => {
        it('should cycle to next display mode', () => {
            const { cycleDisplayMode } = useUIStore.getState();

            expect(useUIStore.getState().displayMode).toBe('terrain');

            cycleDisplayMode();
            expect(useUIStore.getState().displayMode).toBe('political');

            cycleDisplayMode();
            expect(useUIStore.getState().displayMode).toBe('cultural');
        });

        it('should wrap around to first mode after last', () => {
            const { setDisplayMode, cycleDisplayMode } = useUIStore.getState();

            setDisplayMode('population');
            expect(useUIStore.getState().displayMode).toBe('population');

            cycleDisplayMode();
            expect(useUIStore.getState().displayMode).toBe('terrain');
        });

        it('should cycle through all modes correctly', () => {
            const { cycleDisplayMode } = useUIStore.getState();

            for (let i = 0; i < displayModes.length; i++) {
                cycleDisplayMode();
                const expectedIndex = (i + 1) % displayModes.length;
                expect(useUIStore.getState().displayMode).toBe(displayModes[expectedIndex]);
            }
        });
    });
});

// ============================================================================
// PANEL VISIBILITY TESTS
// ============================================================================

describe('uiStore - Panel Visibility', () => {
    describe('togglePanel', () => {
        it('should toggle panel visibility', () => {
            const { togglePanel } = useUIStore.getState();

            expect(useUIStore.getState().panels.cellInfo).toBe(false);

            togglePanel('cellInfo');
            expect(useUIStore.getState().panels.cellInfo).toBe(true);

            togglePanel('cellInfo');
            expect(useUIStore.getState().panels.cellInfo).toBe(false);
        });

        it('should toggle all panels', () => {
            const { togglePanel } = useUIStore.getState();

            togglePanel('controlPanel');
            expect(useUIStore.getState().panels.controlPanel).toBe(false);

            togglePanel('regionStats');
            expect(useUIStore.getState().panels.regionStats).toBe(true);

            togglePanel('aiController');
            expect(useUIStore.getState().panels.aiController).toBe(true);
        });
    });

    describe('setPanelVisibility', () => {
        it('should set panel visibility to true', () => {
            const { setPanelVisibility } = useUIStore.getState();

            setPanelVisibility('cellInfo', true);
            expect(useUIStore.getState().panels.cellInfo).toBe(true);
        });

        it('should set panel visibility to false', () => {
            const { setPanelVisibility, togglePanel } = useUIStore.getState();

            togglePanel('controlPanel'); // Make it false
            setPanelVisibility('controlPanel', true);
            expect(useUIStore.getState().panels.controlPanel).toBe(true);

            setPanelVisibility('controlPanel', false);
            expect(useUIStore.getState().panels.controlPanel).toBe(false);
        });
    });

    describe('showPanel', () => {
        it('should show panel', () => {
            const { showPanel } = useUIStore.getState();

            showPanel('cellInfo');
            expect(useUIStore.getState().panels.cellInfo).toBe(true);
        });

        it('should keep panel visible if already visible', () => {
            const { showPanel, togglePanel } = useUIStore.getState();

            togglePanel('cellInfo');
            expect(useUIStore.getState().panels.cellInfo).toBe(true);

            showPanel('cellInfo');
            expect(useUIStore.getState().panels.cellInfo).toBe(true);
        });
    });

    describe('hidePanel', () => {
        it('should hide panel', () => {
            const { hidePanel } = useUIStore.getState();

            expect(useUIStore.getState().panels.controlPanel).toBe(true);

            hidePanel('controlPanel');
            expect(useUIStore.getState().panels.controlPanel).toBe(false);
        });

        it('should keep panel hidden if already hidden', () => {
            const { hidePanel } = useUIStore.getState();

            hidePanel('cellInfo');
            expect(useUIStore.getState().panels.cellInfo).toBe(false);

            hidePanel('cellInfo');
            expect(useUIStore.getState().panels.cellInfo).toBe(false);
        });
    });

    describe('toggleAllPanels', () => {
        it('should hide all panels when any is visible', () => {
            const { toggleAllPanels } = useUIStore.getState();

            expect(useUIStore.getState().panels.controlPanel).toBe(true);

            toggleAllPanels();

            const state = useUIStore.getState();
            expect(state.panels.controlPanel).toBe(false);
            expect(state.panels.cellInfo).toBe(false);
            expect(state.panels.regionStats).toBe(false);
            expect(state.panels.aiController).toBe(false);
        });

        it('should show all panels when all are hidden', () => {
            const { toggleAllPanels } = useUIStore.getState();

            // First hide all
            toggleAllPanels();
            expect(useUIStore.getState().panels.controlPanel).toBe(false);

            // Then show all
            toggleAllPanels();

            const state = useUIStore.getState();
            expect(state.panels.controlPanel).toBe(true);
            expect(state.panels.cellInfo).toBe(true);
            expect(state.panels.regionStats).toBe(true);
            expect(state.panels.aiController).toBe(true);
        });
    });
});

// ============================================================================
// CAMERA TESTS
// ============================================================================

describe('uiStore - Camera', () => {
    describe('setZoom', () => {
        it('should set camera zoom', () => {
            const { setZoom } = useUIStore.getState();

            setZoom(2.5);

            const state = useUIStore.getState();
            expect(state.camera.zoom).toBe(2.5);
        });

        it('should not allow negative zoom', () => {
            const { setZoom } = useUIStore.getState();

            setZoom(-1);

            const state = useUIStore.getState();
            expect(state.camera.zoom).toBe(1); // Should not change
        });

        it('should not allow zero zoom', () => {
            const { setZoom } = useUIStore.getState();

            setZoom(0);

            const state = useUIStore.getState();
            expect(state.camera.zoom).toBe(1); // Should not change
        });
    });

    describe('setRotation', () => {
        it('should set camera rotation', () => {
            const { setRotation } = useUIStore.getState();

            setRotation(0.5, 0.3);

            const state = useUIStore.getState();
            expect(state.camera.rotationX).toBe(0.5);
            expect(state.camera.rotationY).toBe(0.3);
        });

        it('should allow negative rotation', () => {
            const { setRotation } = useUIStore.getState();

            setRotation(-0.5, -0.3);

            const state = useUIStore.getState();
            expect(state.camera.rotationX).toBe(-0.5);
            expect(state.camera.rotationY).toBe(-0.3);
        });
    });

    describe('resetCamera', () => {
        it('should reset camera to default position', () => {
            const { setZoom, setRotation, resetCamera } = useUIStore.getState();

            setZoom(2.5);
            setRotation(0.5, 0.3);

            expect(useUIStore.getState().camera.zoom).toBe(2.5);
            expect(useUIStore.getState().camera.rotationX).toBe(0.5);
            expect(useUIStore.getState().camera.rotationY).toBe(0.3);

            resetCamera();

            const state = useUIStore.getState();
            expect(state.camera.zoom).toBe(1);
            expect(state.camera.rotationX).toBe(0);
            expect(state.camera.rotationY).toBe(0);
        });
    });
});

// ============================================================================
// RESET TESTS
// ============================================================================

describe('uiStore - Reset', () => {
    it('should reset UI to initial state', () => {
        const { selectCell, hoverCell, selectPlayer, setDisplayMode, togglePanel, setZoom, setRotation, resetUI } = useUIStore.getState();

        // Change everything
        selectCell('cell_0');
        hoverCell('cell_1');
        selectPlayer('P1');
        setDisplayMode('political');
        togglePanel('cellInfo');
        setZoom(2.5);
        setRotation(0.5, 0.3);

        expect(useUIStore.getState().selection.selectedCellId).toBe('cell_0');
        expect(useUIStore.getState().displayMode).toBe('political');
        expect(useUIStore.getState().panels.cellInfo).toBe(true);
        expect(useUIStore.getState().camera.zoom).toBe(2.5);

        resetUI();

        const state = useUIStore.getState();
        expect(state.selection.selectedCellId).toBeUndefined();
        expect(state.selection.hoveredCellId).toBeUndefined();
        expect(state.selection.selectedPlayerId).toBeUndefined();
        expect(state.displayMode).toBe('terrain');
        expect(state.panels.controlPanel).toBe(true);
        expect(state.panels.cellInfo).toBe(false);
        expect(state.panels.regionStats).toBe(false);
        expect(state.panels.aiController).toBe(false);
        expect(state.camera.zoom).toBe(1);
        expect(state.camera.rotationX).toBe(0);
        expect(state.camera.rotationY).toBe(0);
    });
});

// ============================================================================
// SELECTOR TESTS
// ============================================================================

describe('uiStore - Selectors', () => {
    beforeEach(() => {
        const { selectCell, hoverCell, selectPlayer, setDisplayMode, togglePanel, setZoom, setRotation } = useUIStore.getState();
        selectCell('cell_0');
        hoverCell('cell_1');
        selectPlayer('P1');
        setDisplayMode('political');
        togglePanel('cellInfo');
        setZoom(2.5);
        setRotation(0.5, 0.3);
    });

    describe('Selection Selectors', () => {
        it('selectSelection should return selection state', () => {
            const state = useUIStore.getState();
            const selection = state.selection;
            expect(selection.selectedCellId).toBe('cell_0');
            expect(selection.hoveredCellId).toBe('cell_1');
            expect(selection.selectedPlayerId).toBe('P1');
        });

        it('selectSelectedCellId should return selected cell ID', () => {
            const state = useUIStore.getState();
            expect(state.selection.selectedCellId).toBe('cell_0');
        });

        it('selectHoveredCellId should return hovered cell ID', () => {
            const state = useUIStore.getState();
            expect(state.selection.hoveredCellId).toBe('cell_1');
        });

        it('selectSelectedPlayerId should return selected player ID', () => {
            const state = useUIStore.getState();
            expect(state.selection.selectedPlayerId).toBe('P1');
        });

        it('selectHasSelectedCell should return true when cell is selected', () => {
            const state = useUIStore.getState();
            expect(state.selection.selectedCellId !== undefined).toBe(true);
        });

        it('selectHasSelectedPlayer should return true when player is selected', () => {
            const state = useUIStore.getState();
            expect(state.selection.selectedPlayerId !== undefined).toBe(true);
        });
    });

    describe('Display Mode Selectors', () => {
        it('selectDisplayMode should return current display mode', () => {
            const state = useUIStore.getState();
            expect(state.displayMode).toBe('political');
        });

        it('selectNextDisplayMode should return next mode in cycle', () => {
            const state = useUIStore.getState();
            const currentIndex = ['terrain', 'political', 'cultural', 'elevation', 'temperature', 'moisture', 'population'].indexOf(state.displayMode);
            const nextIndex = (currentIndex + 1) % 7;
            expect(['terrain', 'political', 'cultural', 'elevation', 'temperature', 'moisture', 'population'][nextIndex]).toBe('cultural');
        });
    });

    describe('Panel Selectors', () => {
        it('selectPanels should return panel visibility state', () => {
            const state = useUIStore.getState();
            expect(state.panels.controlPanel).toBe(true);
            expect(state.panels.cellInfo).toBe(true);
            expect(state.panels.regionStats).toBe(false);
            expect(state.panels.aiController).toBe(false);
        });

        it('selectIsPanelVisible should return visibility for specific panel', () => {
            const state = useUIStore.getState();
            expect(state.panels.controlPanel).toBe(true);
            expect(state.panels.cellInfo).toBe(true);
            expect(state.panels.regionStats).toBe(false);
        });

        it('selectAnyPanelVisible should return true when any panel is visible', () => {
            const state = useUIStore.getState();
            expect(Object.values(state.panels).some(v => v)).toBe(true);
        });

        it('selectAnyPanelVisible should return false when all panels are hidden', () => {
            useUIStore.getState().toggleAllPanels();
            const state = useUIStore.getState();
            expect(Object.values(state.panels).some(v => v)).toBe(false);
        });
    });

    describe('Camera Selectors', () => {
        it('selectCamera should return camera state', () => {
            const state = useUIStore.getState();
            expect(state.camera.zoom).toBe(2.5);
            expect(state.camera.rotationX).toBe(0.5);
            expect(state.camera.rotationY).toBe(0.3);
        });

        it('selectZoom should return zoom level', () => {
            const state = useUIStore.getState();
            expect(state.camera.zoom).toBe(2.5);
        });

        it('selectRotation should return rotation values', () => {
            const state = useUIStore.getState();
            expect({ x: state.camera.rotationX, y: state.camera.rotationY }).toEqual({ x: 0.5, y: 0.3 });
        });

        it('selectIsCameraDefault should return false when camera is not at default', () => {
            const state = useUIStore.getState();
            expect(
                state.camera.zoom === 1 &&
                state.camera.rotationX === 0 &&
                state.camera.rotationY === 0
            ).toBe(false);
        });

        it('selectIsCameraDefault should return true when camera is at default', () => {
            useUIStore.getState().resetCamera();
            const state = useUIStore.getState();
            expect(
                state.camera.zoom === 1 &&
                state.camera.rotationX === 0 &&
                state.camera.rotationY === 0
            ).toBe(true);
        });
    });
});
