
import * as PIXI from 'pixi.js';
import { MAP_WIDTH, MAP_HEIGHT } from '../../utils/projection';
import { MapProjection } from '../../stores/useUIStore';

export const MAP_PADDING = 200;

export const drawGhostedHex = (
    g: PIXI.Graphics, 
    verts2D: [number, number][], 
    color: number, 
    fill: boolean, 
    thickness: number,
    alpha: number,
    projection: MapProjection
) => {
    // 1. Detect Seam Crossing
    let crossesSeam = false;
    
    // Seam detection irrelevant for LOCAL projection
    if (projection !== 'LOCAL') {
        for (let i = 0; i < verts2D.length; i++) {
           const curr = verts2D[i];
           const next = verts2D[(i+1) % verts2D.length];
           if (Math.abs(curr[0] - next[0]) > MAP_WIDTH * 0.5) {
               crossesSeam = true;
               break;
           }
        }
    }

    const drawPoly = (points: [number, number][]) => {
        if (fill) {
            g.beginFill(color, alpha);
            g.lineStyle(0); 
        } else {
            g.lineStyle(thickness, color, alpha);
        }
        g.drawPolygon(points.flatMap(p => p));
        if (fill) g.endFill();
    };

    if (!crossesSeam) {
        // Standard draw
        drawPoly(verts2D);
    } else {
        // Seam Handling
        if (projection === 'EQUIRECTANGULAR') {
            // Rectangular wrap: Draw two ghosts
            const leftVerts: [number, number][] = verts2D.map(([x, y]) => {
                return [x > MAP_WIDTH * 0.5 ? x - MAP_WIDTH : x, y];
            });

            const rightVerts: [number, number][] = verts2D.map(([x, y]) => {
                return [x < MAP_WIDTH * 0.5 ? x + MAP_WIDTH : x, y];
            });

            drawPoly(leftVerts);
            drawPoly(rightVerts);

            if (!fill) {
                const leftC = leftVerts.reduce((acc, v) => [acc[0]+v[0], acc[1]+v[1]], [0,0]).map(v => v/leftVerts.length);
                const rightC = rightVerts.reduce((acc, v) => [acc[0]+v[0], acc[1]+v[1]], [0,0]).map(v => v/rightVerts.length);
                g.lineStyle(1, color, 0.2);
                g.moveTo(leftC[0], leftC[1]);
                g.lineTo(rightC[0], rightC[1]);
            }
        } else {
            // Mollweide/Other: CULL the hex to prevent streaks.
            return;
        }
    }
};
