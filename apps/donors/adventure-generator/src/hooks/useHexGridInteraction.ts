
import React, { useState, useCallback } from 'react';
import { HexCoordinate, ManagedLocation, InteractionMode } from '../types/location';
// FIX: Changed import to individual function as HexUtils is not exported as a namespace
import { pixelToHex } from '../utils/hexUtils';
import { useLocationStore } from '../stores/locationStore';

interface UseHexGridInteractionProps {
    offsetRef: React.MutableRefObject<{ x: number; y: number }>;
    hexSize: number;
    locations: ManagedLocation[];
    interactionMode: InteractionMode;
    onHexClick: (coordinate: HexCoordinate) => void;
    onLocationSelect: (location: ManagedLocation) => void;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    onInteraction?: () => void; // New callback to trigger renders
}

export const useHexGridInteraction = ({
    offsetRef, hexSize, locations,
    interactionMode, onHexClick, onLocationSelect, canvasRef, onInteraction
}: UseHexGridInteractionProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    
    const revealHex = useLocationStore(s => s.revealHex);
    const hideHex = useLocationStore(s => s.hideHex);
    const paintHexBiome = useLocationStore(s => s.paintHexBiome);
    const selectedPaintBiome = useLocationStore(s => s.selectedPaintBiome);
    const fogToolMode = useLocationStore(s => s.fogToolMode);

    const getHexAtEvent = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const pixelX = event.clientX - rect.left - offsetRef.current.x;
        const pixelY = event.clientY - rect.top - offsetRef.current.y;
        // FIX: Changed usage from HexUtils.pixelToHex to pixelToHex
        return pixelToHex({ x: pixelX, y: pixelY }, hexSize);
    }, [canvasRef, offsetRef, hexSize]);

    const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const hexCoord = getHexAtEvent(event);
        if (!hexCoord) return;
        
        if (interactionMode === 'inspect') {
            const locationAtHex = locations.find(loc => loc.hexCoordinate.q === hexCoord.q && loc.hexCoordinate.r === hexCoord.r);
            if (locationAtHex) onLocationSelect(locationAtHex);
            else onHexClick(hexCoord);
        } else if (interactionMode === 'fog_paint') {
            if (fogToolMode === 'reveal') revealHex(hexCoord);
            else hideHex(hexCoord);
        } else {
            onHexClick(hexCoord);
        }
        
        // Always trigger render on click
        if (onInteraction) onInteraction();

    }, [getHexAtEvent, locations, interactionMode, onHexClick, onLocationSelect, fogToolMode, revealHex, hideHex, onInteraction]);

    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        setLastMousePos({ x: event.clientX, y: event.clientY });
        
        const hexCoord = getHexAtEvent(event);
        if (hexCoord && interactionMode === 'fog_paint') {
             if (fogToolMode === 'reveal') revealHex(hexCoord);
             else hideHex(hexCoord);
             if (onInteraction) onInteraction();
        } else if (hexCoord && interactionMode === 'biome_paint') {
            paintHexBiome(hexCoord, selectedPaintBiome);
            if (onInteraction) onInteraction();
        }

    }, [interactionMode, fogToolMode, revealHex, hideHex, selectedPaintBiome, paintHexBiome, getHexAtEvent, onInteraction]);

    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;

        if (interactionMode === 'inspect' || interactionMode === 'location_place' || interactionMode === 'region_draft') {
             // Pan logic
            const deltaX = event.clientX - lastMousePos.x;
            const deltaY = event.clientY - lastMousePos.y;
            offsetRef.current = { x: offsetRef.current.x + deltaX, y: offsetRef.current.y + deltaY };
            setLastMousePos({ x: event.clientX, y: event.clientY });
            
            // Panning must trigger render
            if (onInteraction) onInteraction();
        } else {
            // Paint logic
            const hexCoord = getHexAtEvent(event);
            if (hexCoord) {
                if (interactionMode === 'fog_paint') {
                    if (fogToolMode === 'reveal') revealHex(hexCoord);
                    else hideHex(hexCoord);
                    if (onInteraction) onInteraction();
                } else if (interactionMode === 'biome_paint') {
                    paintHexBiome(hexCoord, selectedPaintBiome);
                    if (onInteraction) onInteraction();
                }
            }
        }
    }, [isDragging, lastMousePos, interactionMode, fogToolMode, revealHex, hideHex, selectedPaintBiome, paintHexBiome, getHexAtEvent, offsetRef, onInteraction]);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    const getCursor = () => {
        if (interactionMode === 'location_place') return 'crosshair';
        if (interactionMode === 'biome_paint') return 'cell';
        if (interactionMode === 'fog_paint') return 'crosshair';
        if (interactionMode === 'region_draft') return 'copy';
        return isDragging ? 'grabbing' : 'grab';
    };

    return {
        handleCanvasClick,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        getCursor
    };
};
