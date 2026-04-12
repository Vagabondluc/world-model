
import { useMemo } from 'react';
import { GameState, WorldObject } from '../types';
import { getHexCorners, getNeighbors, hexToKey } from '../logic/geometry';

interface BorderPath {
  path: string;
  color: string;
  fill?: string;
  id: string;
  strokeDasharray?: string;
  strokeWidth: number;
  opacity: number;
}

export function useRegionBorders(
  worldCache: Map<string, WorldObject>,
  players: GameState['config']['players'] = []
) {
  return useMemo(() => {
    const paths: BorderPath[] = [];
    const hexOwner = new Map<string, { obj: WorldObject; color: string }>();

    // 1. Build Index
    for (const obj of worldCache.values()) {
      if (!['NATION', 'REGION'].includes(obj.kind)) continue;

      let color = '#ffffff';
      if (obj.kind === 'NATION') {
        const p = players.find(pl => pl.id === obj.createdBy);
        color = p ? p.color : '#ffffff';
      } else if (obj.kind === 'REGION') {
        color = '#ad92c9'; // Muted purple for regions
      }

      for (const h of obj.hexes) {
        // Priority: NATION > REGION
        const k = hexToKey(h);
        const existing = hexOwner.get(k);
        if (!existing || (existing.obj.kind === 'REGION' && obj.kind === 'NATION')) {
          hexOwner.set(k, { obj, color });
        }
      }
    }

    // 2. Trace Edges
    for (const [key, { obj, color }] of hexOwner.entries()) {
      const [q, r] = key.split(',').map(Number);
      const corners = getHexCorners(q, r);
      const neighbors = getNeighbors(q, r);

      neighbors.forEach((n, i) => {
        const nKey = hexToKey(n);
        const nData = hexOwner.get(nKey);

        // It is a border if:
        // 1. Neighbor is empty OR
        // 2. Neighbor belongs to DIFFERENT object (even if same nation name, if IDs differ it's a border)
        const isInternal = nData && nData.obj.id === obj.id;

        if (!isInternal) {
          const c1 = corners[i];
          const c2 = corners[(i + 1) % 6];

          // Inset logic for conflict zones (Double Line Effect)
          const midX = (corners[0].x + corners[3].x) / 2;
          const midY = (corners[0].y + corners[3].y) / 2;

          const lerp = (v: number, target: number, amt: number) => v + (target - v) * amt;
          const shrink = 0.08; // 8% inset towards center

          const x1 = lerp(c1.x, midX, shrink);
          const y1 = lerp(c1.y, midY, shrink);
          const x2 = lerp(c2.x, midX, shrink);
          const y2 = lerp(c2.y, midY, shrink);

          paths.push({
            id: `${obj.id}-${i}`,
            path: `M ${x1} ${y1} L ${x2} ${y2}`,
            color: color,
            strokeWidth: obj.kind === 'NATION' ? 4 : 2,
            strokeDasharray: obj.kind === 'REGION' ? '4 4' : undefined,
            opacity: obj.kind === 'NATION' ? 1.0 : 0.6
          });
        }
      });
    }

    return paths;
  }, [worldCache, players]);
}
