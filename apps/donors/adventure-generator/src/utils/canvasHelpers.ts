
import { HexCoordinate, ManagedLocation } from '../types/location';

/**
 * Adds a hex path to an existing Path2D object for batch rendering.
 */
export const traceHexPath = (
    path: Path2D,
    center: { x: number; y: number },
    size: number
) => {
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = center.x + size * Math.cos(angle);
        const y = center.y + size * Math.sin(angle);
        if (i === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
    }
    path.closePath();
};

export const drawHex = (
    ctx: CanvasRenderingContext2D,
    center: { x: number; y: number },
    size: number,
    fillColor?: string | CanvasPattern | CanvasGradient,
    strokeColor: string = '#ccc',
    strokeWidth: number = 1
) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = center.x + size * Math.cos(angle);
        const y = center.y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    
    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    
    if (strokeColor && strokeColor !== 'transparent') {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }
};

export const drawCoordinateText = (
    ctx: CanvasRenderingContext2D,
    center: { x: number; y: number },
    coordinate: HexCoordinate,
    hexSize: number,
    textColor: string = '#666'
) => {
    ctx.fillStyle = textColor;
    ctx.font = `${Math.max(8, hexSize / 4)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${coordinate.q},${coordinate.r}`, center.x, center.y);
};

export const drawLocationMarker = (
    ctx: CanvasRenderingContext2D,
    center: { x: number; y: number },
    location: ManagedLocation,
    hexSize: number,
    zoomLevel: number,
    isSelected: boolean = false
) => {
    const markerSize = hexSize * 0.3;
    ctx.beginPath();
    ctx.arc(center.x, center.y, markerSize, 0, 2 * Math.PI);
    let fillColor: string;
    switch (location.discoveryStatus) {
        case 'explored': fillColor = '#4CAF50'; break;
        case 'rumored': fillColor = '#FF9800'; break;
        case 'mapped': fillColor = '#2196F3'; break;
        default: fillColor = '#757575';
    }
    ctx.fillStyle = fillColor;
    ctx.fill();
    if (isSelected) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    ctx.fillStyle = '#fff';
    ctx.font = `${markerSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let icon: string;
    switch (location.type) {
        case 'Settlement': icon = '🏘️'; break;
        case 'Dungeon': icon = '🏰'; break;
        case 'Battlemap': icon = '⚔️'; break;
        default: icon = '📍';
    }
    ctx.fillText(icon, center.x, center.y);
    if (zoomLevel > 0.8) {
        ctx.fillStyle = '#000';
        ctx.font = `${Math.max(10, hexSize / 5)}px sans-serif`;
        ctx.fillText(location.name, center.x, center.y + markerSize + 15);
    }
};
