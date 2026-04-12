
import React, { useCallback } from 'react';
import * as PixiReact from '@pixi/react';
import * as PIXI from 'pixi.js';
import * as THREE from 'three';
import { HexData } from '../../types';
import { sphericalToCartesian2D } from '../../utils/projection';
import { MapProjection } from '../../stores/useUIStore';
import { drawGhostedHex } from './mapRenderUtils';

// Safe destructuring for ESM/CJS interop
const { Graphics } = (PixiReact as any).default || PixiReact;

interface SelectionLayerProps {
    selectedHexId: string | null;
    hexes: HexData[];
    scale: number;
    offsetRadians: number;
    projection: MapProjection;
    centerHex?: THREE.Vector3;
}

export const SelectionLayer = React.memo(({ 
    selectedHexId, 
    hexes, 
    scale, 
    offsetRadians, 
    projection,
    centerHex 
}: SelectionLayerProps) => {
    const draw = useCallback((g: PIXI.Graphics) => {
        g.clear();
        if (!selectedHexId) return;
        
        const hex = hexes.find(h => h.id === selectedHexId);
        if (!hex) return;

        const verts2D = hex.vertices.map(v => sphericalToCartesian2D(v[0], v[1], v[2], offsetRadians, projection, centerHex));
        drawGhostedHex(g, verts2D, 0xffffff, false, 2 / scale, 1, projection);

    }, [selectedHexId, hexes, scale, offsetRadians, projection, centerHex]);

    return <Graphics draw={draw} />;
});
