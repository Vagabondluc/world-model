import { useState, useRef, useCallback, useEffect } from 'react';

export interface Point {
    x: number;
    y: number;
}

interface UseZoomPanProps {
    minZoom?: number;
    maxZoom?: number;
    initialZoom?: number;
    initialPan?: Point;
}

export function useZoomPan({
    minZoom = 0.1,
    maxZoom = 5,
    initialZoom = 1,
    initialPan = { x: 0, y: 0 }
}: UseZoomPanProps = {}) {
    const [zoom, setZoom] = useState(initialZoom);
    const [pan, setPan] = useState<Point>(initialPan);
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef<Point>({ x: 0, y: 0 });

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = -e.deltaY * 0.001;
        const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));

        // Zoom toward cursor
        // Needs integration with container dims, for now just simple center zoom
        // or simplistic relative zoom. 
        // Typically: 
        // 1. Get mouse pos relative to container
        // 2. newPan = mousePos - (mousePos - oldPan) * (newZoom / oldZoom)
        // Implementing correctly requires bounding rect which might be tricky in pure hook
        // just returning zoom for now, simpler

        setZoom(newZoom);
    }, [zoom, minZoom, maxZoom]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;

        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Global mouse up handling to catch drags outside
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return {
        zoom,
        pan,
        setZoom,
        setPan,
        bindGestures: {
            onWheel: handleWheel,
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseLeave
        }
    };
}
