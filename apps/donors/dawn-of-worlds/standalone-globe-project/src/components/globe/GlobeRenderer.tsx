import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThreeGlobeRenderer, DisplayMode, SelectionMode } from '../../logic/globe/rendering/threeRenderer';
import { generateIcosphere } from '../../logic/globe';
import { generateHexGrid, getGridStats, GeneratorType } from '../../logic/globe/overlay/hexGrid';
import { useUIStore } from '../../store/uiStore';
import { useCompassStore } from '../../store/compassStore';
import { calculateCompassHeading, calculateMagneticHeading } from '../../logic/globe/utils/compassCalculations';

// Extended props as optional for overrides or backward compatibility if needed, 
// but primarily we rely on store.
interface GlobeRendererProps {
    radius?: number;
    subdivisions?: number;
    cellCount?: number;
    showHexGrid?: boolean;
    generatorType?: GeneratorType;
    seed?: number;
    worldData?: any[];
    onGridStatsUpdate?: (stats: { totalCells: number; hexagons: number; pentagons: number }) => void;
}

export const GlobeRenderer: React.FC<GlobeRendererProps> = (props) => {
    const {
        radius = 1.0,
        subdivisions = 3,
        cellCount = 100,
        showHexGrid = true,
        generatorType = GeneratorType.SIMPLEX,
        seed = 12345,
        worldData,
        onGridStatsUpdate
    } = props;

    // Store State
    const displayMode = useUIStore(state => state.displayMode);
    const selectionMode = useUIStore(state => state.selectionMode);
    const selectionRadius = useUIStore(state => state.selectionRadius);

    // Store Actions
    const hoverCell = useUIStore(state => state.hoverCell);
    const selectCell = useUIStore(state => state.selectCell);
    const selectRegion = useUIStore(state => state.selectRegion);

    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<ThreeGlobeRenderer | null>(null);

    // Map Store DisplayMode to Renderer DisplayMode
    const getRendererDisplayMode = (mode: string): DisplayMode => {
        switch (mode) {
            case 'terrain': return DisplayMode.BIOME;
            case 'elevation': return DisplayMode.ELEVATION;
            case 'temperature': return DisplayMode.TEMPERATURE;
            case 'moisture': return DisplayMode.MOISTURE;
            case 'political': return DisplayMode.CIVILIZATION;
            // Fallback
            default: return DisplayMode.BIOME;
        }
    };

    // Sync Display Mode
    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.setDisplayMode(getRendererDisplayMode(displayMode));
        }
    }, [displayMode]);

    // Sync Selection Config
    useEffect(() => {
        if (rendererRef.current) {
            // rendererRef.current.setSelectionConfig(selectionMode as any, selectionRadius);
            // Ensure selection mode matches renderer expectations if needed, assume string compatibility or map similarly
            rendererRef.current.setSelectionConfig(selectionMode as SelectionMode, selectionRadius);
        }
    }, [selectionMode, selectionRadius]);

    // Sync World Data Updates
    useEffect(() => {
        if (rendererRef.current && worldData) {
            rendererRef.current.updateCellBiomes(worldData);
        }
    }, [worldData]);

    // Initialize Renderer
    useEffect(() => {
        if (!containerRef.current) return;

        // Callback wrappers
        const handleCellHover = (cellId: string | null) => {
            hoverCell(cellId || undefined);
        };

        const handleCellSelect = (cellId: string | null, regionIds?: string[]) => {
            // Logic moved from App.tsx
            if (!cellId) {
                selectCell(undefined); // Clears all
                return;
            }

            // We need to check the current selection mode from the store (captured in closure or ref?)
            // Ideally we use the value from the closure since dependencies will re-create renderer if needed?
            // Actually, re-creating renderer on every mode change is expensive. 
            // Better to let `setSelectionConfig` handle the mode switch in ThreeJS, 
            // and here we just dispatch appropriately based on what we receive.

            // If the renderer passes back regionIds, we use them.
            if (regionIds && regionIds.length > 0) {
                selectRegion(regionIds);
            } else {
                selectCell(cellId);
            }
        };

        // Create renderer
        const renderer = new ThreeGlobeRenderer({
            container: containerRef.current,
            radius,
            subdivisions,
            showHexOverlay: showHexGrid,
            onCellHover: handleCellHover,
            onCellSelect: handleCellSelect
        });

        // Generate and render icosphere
        const sphere = generateIcosphere({ radius, subdivisions, cellCount });
        renderer.createSphere(sphere);

        // Generate and render hex grid
        if (showHexGrid) {
            const hexGrid = generateHexGrid({ cellCount, radius, subdivisions, generatorType, seed });
            const stats = getGridStats(hexGrid);
            console.log('🌍 Hex Grid Generated:', stats);
            onGridStatsUpdate?.(stats);
            renderer.createHexOverlay(hexGrid);
        }

        // Apply initial settings
        renderer.setDisplayMode(getRendererDisplayMode(displayMode));
        renderer.setSelectionConfig(selectionMode as SelectionMode, selectionRadius);
        if (worldData) {
            renderer.updateCellBiomes(worldData);
        }

        renderer.start();
        rendererRef.current = renderer;

        // Compass Update Loop
        let compassFrameId: number;
        let lastCompassUpdate = 0;
        const COMPASS_THROTTLE = 16; // ~60fps

        const updateCompass = (time: number) => {
            compassFrameId = requestAnimationFrame(updateCompass);

            if (time - lastCompassUpdate < COMPASS_THROTTLE) return;

            if (rendererRef.current) {
                const camera = rendererRef.current.getCamera();
                const dummyGlobe = { position: new THREE.Vector3(0, 0, 0) } as THREE.Mesh;

                const heading = calculateCompassHeading(camera, dummyGlobe);

                if (heading !== null) {
                    const { setGeographicHeading, setMagneticHeading, declinationAngle } = useCompassStore.getState();
                    const magneticHeading = calculateMagneticHeading(heading, declinationAngle);

                    // Update store (for any other consumers)
                    setGeographicHeading(heading);
                    setMagneticHeading(magneticHeading);
                }
            }
            lastCompassUpdate = time;
        };
        compassFrameId = requestAnimationFrame(updateCompass);

        // Handle compass click interactions
        const handleCanvasClick = (event: MouseEvent) => {
            if (rendererRef.current && rendererRef.current.compassHitTest(event.clientX, event.clientY)) {
                // Toggle compass display mode
                useCompassStore.getState().toggleDisplayMode();
            }
        };

        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
            canvas.addEventListener('click', handleCanvasClick);
        }

        // Cleanup
        return () => {
            cancelAnimationFrame(compassFrameId);
            if (canvas) {
                canvas.removeEventListener('click', handleCanvasClick);
            }
            renderer.dispose();
            rendererRef.current = null;
        };
        // Re-run if GEN params change. 
        // Note: we do NOT include displayMode/selectionMode here to avoid re-creation.
        // We handle those in separate useEffects.
    }, [radius, subdivisions, cellCount, showHexGrid, generatorType, seed]);

    // Sync compass display mode
    const compassDisplayMode = useCompassStore(state => state.displayMode);
    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.setCompassDisplayMode(compassDisplayMode);
        }
    }, [compassDisplayMode]);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%', minHeight: '400px' }}
        />
    );
};

export default GlobeRenderer;
