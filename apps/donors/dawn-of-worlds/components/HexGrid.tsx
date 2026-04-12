import React, { useMemo, useCallback } from 'react';
import { WorldObject } from '../types';
import { useGameStore } from '../store/gameStore';
import { getBaseBiome } from '../logic/biomes';
import { HexCell } from './HexCell';
import VectorGrid from './VectorGrid';
import { getMapDimensions, hexToKey } from '../logic/geometry';
import { selectPlayerColor } from '../logic/selectors';

interface HexGridProps {
  isErrorState: boolean;
}

const HexGrid: React.FC<HexGridProps> = ({ isErrorState }) => {
  const activeSelection = useGameStore(state => state.activeSelection);
  const previewEvent = useGameStore(state => state.previewEvent);
  const setSelection = useGameStore(state => state.setSelection);
  const players = useGameStore(state => state.config?.players);
  const worldCache = useGameStore(state => state.worldCache);
  const config = useGameStore(state => state.config);
  const settings = useGameStore(state => state.settings);
  const mapSize = config?.mapSize || 'STANDARD';

  const dimensions = useMemo(() => getMapDimensions(mapSize), [mapSize]);
  const { cols: GRID_COLS, rows: GRID_ROWS, width: containerWidth, height: containerHeight } = dimensions;
  const TOTAL_HEXES = GRID_ROWS * GRID_COLS;

  const hexToIndex = useMemo(() => {
    const map = new Map<string, { obj: WorldObject, color?: string }>();
    for (const obj of worldCache.values()) {
      const pColor = selectPlayerColor(useGameStore.getState(), obj.createdBy);
      for (const h of obj.hexes) {
        const key = hexToKey(h);
        const existing = map.get(key);
        // Priority for visualization: Catastrophe > Avatar > Order > City > Race > Nation/Border > Climate > Terrain
        const priority = (k?: string) => {
          if (!k) return 0;
          if (['CATASTROPHE'].includes(k)) return 8;
          if (['AVATAR'].includes(k)) return 7;
          if (['ORDER'].includes(k)) return 6;
          if (['SETTLEMENT', 'CITY', 'LANDMARK'].includes(k)) return 5;
          if (['PROJECT'].includes(k)) return 4;
          if (['RACE'].includes(k)) return 3;
          if (['NATION', 'WAR', 'BORDER'].includes(k)) return 2;
          if (['CLIMATE'].includes(k)) return 1;
          return 0; // Terrain/default
        };
        if (!existing || priority(obj.kind) > priority(existing.obj.kind)) {
          map.set(key, { obj, color: pColor });
        }
      }
    }
    return map;
  }, [worldCache, players]);

  const handleHexClick = useCallback((q: number, r: number) => {
    setSelection({ kind: "HEX", hex: { q, r } });
  }, [setSelection]);

  const gridData = useMemo(() => {
    return Array.from({ length: TOTAL_HEXES }).map((_, i) => {
      const row = Math.floor(i / GRID_COLS);
      const col = i % GRID_COLS;
      return { id: `hex-${col}-${row}`, col, row };
    });
  }, [GRID_COLS, TOTAL_HEXES]);

  return (
    <div className="hex-layer relative" style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }} role="grid" aria-label="World Map Grid">
      {gridData.map((data) => {
        const kh = `${data.col},${data.row}`;
        const hexMeta = hexToIndex.get(kh);
        const objAtHex = hexMeta?.obj;
        const isSelected = activeSelection.kind === "HEX" && activeSelection.hex.q === data.col && activeSelection.hex.r === data.row;
        const previewPayload = previewEvent?.type === "WORLD_CREATE" ? (previewEvent as any).payload : null;
        const isGhost = previewPayload?.hexes?.some((h: any) => h.q === data.col && h.r === data.row);

        let renderKind = objAtHex?.kind as string | undefined;
        let renderAttrBiome = objAtHex?.attrs?.biome as string | undefined;
        let renderColor = hexMeta?.color;
        let renderAlignment = objAtHex?.attrs?.alignment as 'GOOD' | 'EVIL' | undefined;

        if (isGhost && previewPayload) {
          renderKind = previewPayload.kind;
          renderAttrBiome = (previewPayload.attrs as any)?.biome as string;
        }

        if (!renderKind) {
          // Cast to any to bypass strict partial match error for now
          renderAttrBiome = getBaseBiome(data.col, data.row, config?.worldGen as any);
        }

        return (
          <HexCell
            key={data.id}
            col={data.col}
            row={data.row}
            kind={renderKind}
            attrBiome={renderAttrBiome}
            isActive={isSelected}
            isGhost={Boolean(isGhost)}
            hasError={isErrorState && isSelected}
            ownerColor={renderColor}
            onHexClick={handleHexClick}
            alignment={renderAlignment}
            usePngTile={settings?.ui.renderPngTiles}
          />
        );
      })}
      <VectorGrid width={containerWidth} height={containerHeight} />
    </div>
  );
};

export default HexGrid;
