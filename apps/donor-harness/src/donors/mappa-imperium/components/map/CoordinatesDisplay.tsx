import React from 'react';
import { Point } from '../../hooks/useZoomPan';

interface CoordinatesDisplayProps {
    pan: Point;
    zoom: number;
}

const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({ pan, zoom }) => {
    return (
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="bg-black/50 text-white px-3 py-1.5 rounded-md backdrop-blur-sm text-xs font-mono border border-white/10 shadow-sm">
                <span className="text-stone-400 mr-2">POS:</span>
                <span className="font-bold">{Math.round(pan.x)}, {Math.round(pan.y)}</span>
                <span className="mx-2 text-stone-600">|</span>
                <span className="text-stone-400 mr-2">ZOOM:</span>
                <span className="font-bold">{zoom.toFixed(1)}x</span>
            </div>
        </div>
    );
};

export default CoordinatesDisplay;
