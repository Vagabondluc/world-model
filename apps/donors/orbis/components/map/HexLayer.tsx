
import React, { useCallback } from 'react';
import * as PixiReact from '@pixi/react';
import * as PIXI from 'pixi.js';
import * as THREE from 'three';
import { HexData, ViewMode, FrontType } from '../../types';
import { getBiomeColor } from '../../utils/materialUtils';
import { sphericalToCartesian2D, MAP_WIDTH, MAP_HEIGHT } from '../../utils/projection';
import { MapProjection } from '../../stores/useUIStore';
import { drawGhostedHex, MAP_PADDING } from './mapRenderUtils';

// Safe destructuring for ESM/CJS interop
const { Graphics } = (PixiReact as any).default || PixiReact;

interface HexLayerProps {
    hexes: HexData[];
    viewMode: ViewMode;
    offsetRadians: number;
    projection: MapProjection;
    centerHex?: THREE.Vector3;
}

export const HexLayer = React.memo(({ 
    hexes, 
    viewMode, 
    offsetRadians, 
    projection,
    centerHex
}: HexLayerProps) => {
  const draw = useCallback((g: PIXI.Graphics) => {
    g.clear();
    
    // Draw Seam Lines only for Equirectangular
    if (projection === 'EQUIRECTANGULAR') {
        g.lineStyle(2, 0x1e293b, 1);
        g.moveTo(0, 0); g.lineTo(0, MAP_HEIGHT);
        g.moveTo(MAP_WIDTH, 0); g.lineTo(MAP_WIDTH, MAP_HEIGHT);
    }

    hexes.forEach(hex => {
      let color = 0xFFFFFF;
      const { height, temperature, moisture } = hex.biomeData;

      if (viewMode === ViewMode.BIOME) {
        color = new PIXI.Color(getBiomeColor(hex.biome).getStyle()).toNumber();
      } else if (viewMode === ViewMode.PLATES) {
        color = new PIXI.Color(hex.plateColor).toNumber();
      } else if (viewMode === ViewMode.ELEVATION) {
        if (height < 0.1) { // Water
           color = new PIXI.Color({ h: 210, s: 80, l: 30 + (height + 1) * 30 }).toNumber();
        } else { // Land
           color = new PIXI.Color({ h: 30, s: 20, l: 20 + height * 80 }).toNumber();
        }
      } else if (viewMode === ViewMode.TEMPERATURE) {
         const tNorm = Math.min(1, Math.max(0, (temperature + 30) / 70));
         color = new PIXI.Color({ h: 240 - tNorm * 240, s: 80, l: 50 }).toNumber();
      } else if (viewMode === ViewMode.RIVERS) {
         if (hex.isRiver) color = 0x60a5fa;
         else {
            const c = new PIXI.Color(getBiomeColor(hex.biome).getStyle());
            color = new PIXI.Color({ r: c.red * 0.2, g: c.green * 0.2, b: c.blue * 0.2 }).toNumber();
         }
      } else if (viewMode === ViewMode.ATMOSPHERE) {
         if (hex.atmosphere) {
            const p = Math.max(0, Math.min(1, (hex.atmosphere.pressure - 0.7) / 0.6));
            let c = new PIXI.Color({ h: 240, s: 80, l: 40 + (1-p) * 40 });
            if (hex.atmosphere.frontType === FrontType.COLD) c = new PIXI.Color(0xef4444);
            else if (hex.atmosphere.frontType === FrontType.WARM) c = new PIXI.Color(0x3b82f6);
            color = c.toNumber();
         }
      } else {
        color = 0x333333;
      }

      // Project vertices
      const verts2D = hex.vertices.map(v => sphericalToCartesian2D(v[0], v[1], v[2], offsetRadians, projection, centerHex));
      drawGhostedHex(g, verts2D, color, true, 0, 1, projection);
    });
  }, [hexes, viewMode, offsetRadians, projection, centerHex]);

  return <Graphics draw={draw} />;
});
