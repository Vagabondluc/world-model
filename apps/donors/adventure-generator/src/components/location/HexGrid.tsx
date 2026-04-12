import React, { FC, useRef, useEffect, useState, useCallback } from 'react';
import { css } from '@emotion/css';
import { ManagedLocation, Region, HexCoordinate, InteractionMode, MapLayer, ViewSettings, WorldMap } from '../../types/location';
import { useLocationStore } from '../../stores/locationStore';
import { HexLegend } from './HexLegend';
import { renderMapFrame } from '../../utils/hexGridRenderer';
import { useHexGridInteraction } from '../../hooks/useHexGridInteraction';
import { LayerCache } from '../../utils/map/LayerCache';

interface HexGridProps {
    locations: ManagedLocation[];
    regions: Region[];
    layers: Record<string, MapLayer>;
    layerOrder: string[];
    activeLayerId: string | null;
    viewSettings: ViewSettings;
    selectedLocation: ManagedLocation | null;
    selectedRegion: Partial<Region> | null;
    onHexClick: (coordinate: HexCoordinate) => void;
    onLocationSelect: (location: ManagedLocation) => void;
    interactionMode: InteractionMode;
    draftRegionHexes: HexCoordinate[];
}

const styles = {
    container: css`
        position: relative;
        flex: 1;
        overflow: hidden;
        height: 100%;
        view-transition-name: map-canvas;
    `,
    canvas: css`
        display: block;
        position: absolute;
        top: 0;
        left: 0;
    `,
};

export const HexGrid: FC<HexGridProps> = ({
    locations, regions, layers, layerOrder, activeLayerId, viewSettings,
    selectedLocation, selectedRegion, onHexClick,
    onLocationSelect, interactionMode, draftRegionHexes
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const renderCanvasRef = useRef<HTMLCanvasElement>(null);
    const layerCache = useRef(new LayerCache());

    // Source current map for radius
    const activeMapId = useLocationStore(s => s.activeMapId);
    const allMaps = useLocationStore(s => s.maps) as Record<string, WorldMap>;
    const activeMap = activeMapId ? allMaps[activeMapId] : null;

    // Render Control Ref: Only render if true
    const needsRender = useRef(true);

    const offsetRef = useRef({ x: 400, y: 300 });

    const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
    const [bgImageStatus, setBgImageStatus] = useState<'idle' | 'loading' | 'error'>('idle');

    const revealedHexes = useLocationStore(s => s.getRevealedHexes());
    const hexSize = 30 * viewSettings.zoomLevel;

    // Trigger render on user interaction (pan, zoom, paint)
    const handleInteraction = useCallback(() => {
        needsRender.current = true;
    }, []);

    const { handleCanvasClick, handleMouseDown, handleMouseMove, handleMouseUp, getCursor } = useHexGridInteraction({
        offsetRef, hexSize, locations, interactionMode, onHexClick, onLocationSelect,
        canvasRef: renderCanvasRef as React.RefObject<HTMLCanvasElement>,
        onInteraction: handleInteraction
    });

    // Mark needs render when props change (data updates)
    useEffect(() => {
        needsRender.current = true;
    }, [locations, regions, layers, layerOrder, activeLayerId, viewSettings, selectedLocation, selectedRegion, draftRegionHexes, revealedHexes, interactionMode]);

    // Background Image Loading
    useEffect(() => {
        if (viewSettings.backgroundImage?.url) {
            setBgImageStatus('loading');
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => { setBgImage(img); setBgImageStatus('idle'); needsRender.current = true; };
            img.onerror = () => { setBgImage(null); setBgImageStatus('error'); needsRender.current = true; };
            img.src = viewSettings.backgroundImage.url;
        } else {
            setBgImage(null);
            setBgImageStatus('idle');
            needsRender.current = true;
        }
    }, [viewSettings.backgroundImage?.url]);

    // Canvas Resizing
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            const { width, height } = entry.contentRect;
            if (renderCanvasRef.current) {
                renderCanvasRef.current.width = width;
                renderCanvasRef.current.height = height;
                needsRender.current = true;
            }
            // Center initial offset if this is the first load
            if (offsetRef.current.x === 400 && offsetRef.current.y === 300) {
                offsetRef.current = { x: width / 2, y: height / 2 };
            }
        });
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    // --- High-Performance Render Loop ---

    const renderLoop = useCallback(() => {
        // Optimization: Skip if nothing changed
        if (!needsRender.current) return;

        const canvas = renderCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx || canvas.width === 0) return;

        const offset = offsetRef.current;
        const mapRadius = activeMap?.radius || 15;

        // 0. CRITICAL: Clear the entire canvas to prevent "shadow trails" (ghosting)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Background Image (if any)
        if (bgImage && viewSettings.backgroundImage && bgImageStatus === 'idle') {
            const { scale } = viewSettings.backgroundImage;
            const canvasAspect = canvas.width / canvas.height;
            const imgAspect = bgImage.width / bgImage.height;
            let sx = 0, sy = 0, sWidth = bgImage.width, sHeight = bgImage.height;
            let dx = 0, dy = 0, dWidth = canvas.width, dHeight = canvas.height;

            if (scale === 'fit') {
                if (imgAspect > canvasAspect) { dHeight = canvas.width / imgAspect; dy = (canvas.height - dHeight) / 2; }
                else { dWidth = canvas.height * imgAspect; dx = (canvas.width - dWidth) / 2; }
            } else if (scale === 'cover') {
                if (imgAspect > canvasAspect) { sHeight = bgImage.width / canvasAspect; sy = (bgImage.height - sHeight) / 2; }
                else { sWidth = bgImage.height * canvasAspect; sx = (bgImage.width - sWidth) / 2; }
            }

            ctx.globalAlpha = viewSettings.backgroundImage.opacity;
            ctx.drawImage(bgImage, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            ctx.globalAlpha = 1.0;
        }

        // 2. Build Biome Caches
        const biomeCaches: Record<string, { canvas: HTMLCanvasElement, offset: { x: number, y: number }, zoom: number }> = {};
        layerOrder.forEach(id => {
            const l = layers[id];
            if (l) {
                const cache = layerCache.current.getBiomeCache(l, viewSettings.zoomLevel, mapRadius);
                if (cache) {
                    biomeCaches[id] = cache;
                }
            }
        });

        // 3. Render Map Layers & Entities using View Culling and Caches
        renderMapFrame(
            ctx, offset, hexSize, viewSettings, layers, layerOrder, activeLayerId,
            regions, locations, revealedHexes, draftRegionHexes, selectedRegion, selectedLocation,
            biomeCaches
        );

        // 4. Status text
        if (bgImageStatus !== 'idle' && viewSettings.backgroundImage?.url) {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = '20px sans-serif';
            ctx.fillText(bgImageStatus === 'loading' ? 'Loading background image...' : 'Error loading image.', canvas.width / 2, canvas.height / 2);
            ctx.restore();
        }

        // Mark as rendered
        needsRender.current = false;
    }, [
        bgImage, viewSettings, bgImageStatus, activeLayerId, layers, layerOrder,
        regions, locations, revealedHexes, draftRegionHexes, selectedRegion, selectedLocation, hexSize, activeMap
    ]);

    useEffect(() => {
        let animationFrameId: number;
        const animate = () => {
            renderLoop();
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [renderLoop]);

    return (
        <div ref={containerRef} className={styles.container}>
            <canvas
                ref={renderCanvasRef}
                className={styles.canvas}
                style={{ zIndex: 1, cursor: getCursor() }}
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={(e) => {
                    const zoomChange = e.deltaY > 0 ? -0.1 : 0.1;
                    const newZoom = Math.min(Math.max(viewSettings.zoomLevel + zoomChange, 0.2), 3);
                    useLocationStore.getState().updateViewSettings({ zoomLevel: newZoom });
                    if (handleInteraction) handleInteraction();
                }}
            />
            <HexLegend viewSettings={viewSettings} />
        </div>
    );
};