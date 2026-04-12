/**
 * UI Store - UI State Management
 * 
 * This store manages the UI state including selection state, display modes,
 * panel visibility, and camera settings. It uses Zod validation middleware
 * to ensure all state updates are type-safe and valid.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { z } from 'zod';

import {
    UIStateSchema,
    DisplayModeEnum,
    CellIdSchema,
    PlayerIdSchema,
    type UIState,
    type DisplayMode,
    type CellId,
    type PlayerId,
    type PanelVisibility,
    SelectionModeEnum,
    PositiveNumberSchema,
    type SelectionMode,
} from './schemas';
import { zodValidation } from './middleware/zodValidation';

// ============================================================================
// INITIAL STATE
// ============================================================================

const INITIAL_STATE: UIState = {
    selection: {
        selectedCellId: undefined,
        selectedCellIds: [],
        hoveredCellId: undefined,
        selectedPlayerId: undefined,
    },
    displayMode: 'terrain',
    selectionMode: 'SINGLE',
    selectionRadius: 1,
    panels: {
        controlPanel: true,
        cellInfo: false,
        regionStats: false,
        aiController: false,
    },
    camera: {
        zoom: 1,
        rotationX: 0,
        rotationY: 0,
    },
};

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface UIStoreState extends UIState {
    // Selection Actions
    selectCell: (cellId: CellId | undefined) => void;
    selectRegion: (cellIds: CellId[]) => void;
    hoverCell: (cellId: CellId | undefined) => void;
    selectPlayer: (playerId: PlayerId | undefined) => void;
    setSelectionMode: (mode: SelectionMode) => void;
    setSelectionRadius: (radius: number) => void;
    clearSelection: () => void;

    // Display Mode Actions
    setDisplayMode: (mode: DisplayMode) => void;
    cycleDisplayMode: () => void;

    // Panel Actions
    togglePanel: (panel: keyof PanelVisibility) => void;
    setPanelVisibility: (panel: keyof PanelVisibility, visible: boolean) => void;
    showPanel: (panel: keyof PanelVisibility) => void;
    hidePanel: (panel: keyof PanelVisibility) => void;
    toggleAllPanels: () => void;

    // Camera Actions
    setZoom: (zoom: number) => void;
    setRotation: (x: number, y: number) => void;
    resetCamera: () => void;

    // Reset
    resetUI: () => void;
}


// ============================================================================
// DISPLAY MODE ORDER
// ============================================================================

const DISPLAY_MODE_ORDER: DisplayMode[] = [
    'terrain',
    'political',
    'cultural',
    'elevation',
    'temperature',
    'moisture',
    'population',
];

// ============================================================================
// STORE CREATION
// ============================================================================

export const useUIStore = create<UIStoreState>()(
    zodValidation({
        stateSchema: UIStateSchema,
        logErrors: true,
    })(
        immer((set, get) => ({
            ...INITIAL_STATE,

            /**
             * Select a cell
             */
            selectCell: (cellId: CellId | undefined) => {
                if (cellId !== undefined) {
                    CellIdSchema.parse(cellId);
                }

                set((state: any) => {
                    state.selection.selectedCellId = cellId;
                    // In single mode, also update the list
                    state.selection.selectedCellIds = cellId ? [cellId] : [];
                });
            },

            /**
             * Select a region of cells
             */
            selectRegion: (cellIds: CellId[]) => {
                z.array(CellIdSchema).parse(cellIds);

                set((state: any) => {
                    state.selection.selectedCellIds = cellIds;
                    // Primary selection is the first one, or undefined
                    state.selection.selectedCellId = cellIds.length > 0 ? cellIds[0] : undefined;
                });
            },

            /**
             * Set selection mode
             */
            setSelectionMode: (mode: SelectionMode) => {
                SelectionModeEnum.parse(mode);
                set((state: any) => {
                    state.selectionMode = mode;
                    // Clear selection when switching modes to avoid confusion
                    state.selection.selectedCellId = undefined;
                    state.selection.selectedCellIds = [];
                });
            },

            /**
             * Set selection radius
             */
            setSelectionRadius: (radius: number) => {
                PositiveNumberSchema.parse(radius);
                set((state: any) => {
                    state.selectionRadius = radius;
                });
            },

            /**
             * Set the hovered cell
             */
            hoverCell: (cellId: CellId | undefined) => {
                if (cellId !== undefined) {
                    CellIdSchema.parse(cellId);
                }

                set((state: any) => {
                    state.selection.hoveredCellId = cellId;
                });
            },

            /**
             * Select a player
             */
            selectPlayer: (playerId: PlayerId | undefined) => {
                if (playerId !== undefined) {
                    PlayerIdSchema.parse(playerId);
                }

                set((state: any) => {
                    state.selection.selectedPlayerId = playerId;
                });
            },

            /**
             * Clear all selections
             */
            clearSelection: () => {
                set((state: any) => {
                    state.selection.selectedCellId = undefined;
                    state.selection.selectedCellIds = [];
                    state.selection.hoveredCellId = undefined;
                    state.selection.selectedPlayerId = undefined;
                });
            },

            /**
             * Set the display mode
             */
            setDisplayMode: (mode: DisplayMode) => {
                DisplayModeEnum.parse(mode);

                set((state: any) => {
                    state.displayMode = mode;
                });
            },

            /**
             * Cycle to the next display mode
             */
            cycleDisplayMode: () => {
                set((state: any) => {
                    const currentIndex = DISPLAY_MODE_ORDER.indexOf(state.displayMode);
                    const nextIndex = (currentIndex + 1) % DISPLAY_MODE_ORDER.length;
                    state.displayMode = DISPLAY_MODE_ORDER[nextIndex];
                });
            },

            /**
             * Toggle a panel's visibility
             */
            togglePanel: (panel: keyof PanelVisibility) => {
                set((state: any) => {
                    state.panels[panel] = !state.panels[panel];
                });
            },

            /**
             * Set a panel's visibility
             */
            setPanelVisibility: (panel: keyof PanelVisibility, visible: boolean) => {
                set((state: any) => {
                    state.panels[panel] = visible;
                });
            },

            /**
             * Show a panel
             */
            showPanel: (panel: keyof PanelVisibility) => {
                set((state: any) => {
                    state.panels[panel] = true;
                });
            },

            /**
             * Hide a panel
             */
            hidePanel: (panel: keyof PanelVisibility) => {
                set((state: any) => {
                    state.panels[panel] = false;
                });
            },

            /**
             * Toggle all panels on/off
             */
            toggleAllPanels: () => {
                set((state: any) => {
                    const anyVisible = Object.values(state.panels).some((v) => v);
                    Object.keys(state.panels).forEach((key) => {
                        state.panels[key as keyof PanelVisibility] = !anyVisible;
                    });
                });
            },

            /**
             * Set the camera zoom level
             */
            setZoom: (zoom: number) => {
                if (zoom <= 0) return;

                set((state: any) => {
                    state.camera.zoom = zoom;
                });
            },

            /**
             * Set the camera rotation
             */
            setRotation: (x: number, y: number) => {
                set((state: any) => {
                    state.camera.rotationX = x;
                    state.camera.rotationY = y;
                });
            },

            /**
             * Reset the camera to default position
             */
            resetCamera: () => {
                set((state: any) => {
                    state.camera = {
                        zoom: 1,
                        rotationX: 0,
                        rotationY: 0,
                    };
                });
            },

            /**
             * Reset the entire UI state
             */
            resetUI: () => {
                set(INITIAL_STATE);
            },
        }))
    )
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Get the current selection state
 */
export const selectSelection = (state: UIStoreState) => state.selection;

/**
 * Get the selected cell ID
 */
export const selectSelectedCellId = (state: UIStoreState) => state.selection.selectedCellId;

/**
 * Get the selected cell IDs
 */
export const selectSelectedCellIds = (state: UIStoreState) => state.selection.selectedCellIds;

/**
 * Get the current selection mode
 */
export const selectSelectionMode = (state: UIStoreState) => state.selectionMode;

/**
 * Get the current selection radius
 */
export const selectSelectionRadius = (state: UIStoreState) => state.selectionRadius;

/**
 * Get the hovered cell ID
 */
export const selectHoveredCellId = (state: UIStoreState) => state.selection.hoveredCellId;

/**
 * Get the selected player ID
 */
export const selectSelectedPlayerId = (state: UIStoreState) => state.selection.selectedPlayerId;

/**
 * Check if any cell is selected
 */
export const selectHasSelectedCell = (state: UIStoreState): boolean => {
    return state.selection.selectedCellId !== undefined;
};

/**
 * Check if any player is selected
 */
export const selectHasSelectedPlayer = (state: UIStoreState): boolean => {
    return state.selection.selectedPlayerId !== undefined;
};

/**
 * Get the current display mode
 */
export const selectDisplayMode = (state: UIStoreState): DisplayMode => state.displayMode;

/**
 * Get the next display mode in the cycle
 */
export const selectNextDisplayMode = (state: UIStoreState): DisplayMode => {
    const currentIndex = DISPLAY_MODE_ORDER.indexOf(state.displayMode);
    const nextIndex = (currentIndex + 1) % DISPLAY_MODE_ORDER.length;
    return DISPLAY_MODE_ORDER[nextIndex];
};

/**
 * Get panel visibility state
 */
export const selectPanels = (state: UIStoreState) => state.panels;

/**
 * Check if a specific panel is visible
 */
export const selectIsPanelVisible = (panel: keyof PanelVisibility) => (state: UIStoreState): boolean => {
    return state.panels[panel];
};

/**
 * Check if any panel is visible
 */
export const selectAnyPanelVisible = (state: UIStoreState): boolean => {
    return Object.values(state.panels).some((v) => v);
};

/**
 * Get camera state
 */
export const selectCamera = (state: UIStoreState) => state.camera;

/**
 * Get camera zoom level
 */
export const selectZoom = (state: UIStoreState): number => state.camera.zoom;

/**
 * Get camera rotation
 */
export const selectRotation = (state: UIStoreState) => ({
    x: state.camera.rotationX,
    y: state.camera.rotationY,
});

/**
 * Check if camera is at default position
 */
export const selectIsCameraDefault = (state: UIStoreState): boolean => {
    return (
        state.camera.zoom === 1 &&
        state.camera.rotationX === 0 &&
        state.camera.rotationY === 0
    );
};

// ============================================================================
// EXPORTS
// ============================================================================

export type { UIStoreState };
