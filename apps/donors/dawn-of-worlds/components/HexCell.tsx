
import React, { useMemo, memo } from 'react';
import { getHexPosition } from '../logic/geometry';
import { getGlowClass, getKindIcon } from '../logic/biomes';
import { getTileUrl, getDeterministicVariant } from '../logic/tileAssets';

interface HexCellProps {
  col: number;
  row: number;
  kind?: string;
  attrBiome?: string;
  hasError?: boolean;
  isActive?: boolean;
  isGhost?: boolean;
  ownerColor?: string;
  onHexClick: (q: number, r: number) => void;
  alignment?: 'GOOD' | 'EVIL';
  usePngTile?: boolean;
}

export const HexCell = memo(({ col, row, kind, attrBiome, hasError, isActive, isGhost, ownerColor, onHexClick, alignment, usePngTile }: HexCellProps) => {
  const style = useMemo(() => {
    const pos = getHexPosition(col, row);
    return { left: `${pos.x}px`, top: `${pos.y}px` };
  }, [col, row]);

  const glowClass = getGlowClass(kind, attrBiome);
  const icon = getKindIcon(kind, attrBiome);

  const tileUrl = useMemo(() => {
    if (!usePngTile || !attrBiome) return null;
    const variant = getDeterministicVariant(col, row);
    return getTileUrl(attrBiome, variant);
  }, [usePngTile, attrBiome, col, row]);

  const alignmentStyle = useMemo(() => {
    if (alignment === 'GOOD') return { boxShadow: 'inset 0 0 20px 5px rgba(251, 191, 36, 0.4), 0 0 15px rgba(251, 191, 36, 0.2)' };
    if (alignment === 'EVIL') return { boxShadow: 'inset 0 0 20px 5px rgba(239, 68, 68, 0.4), 0 0 15px rgba(239, 68, 68, 0.2)' };
    return {};
  }, [alignment]);

  const ariaLabel = useMemo(() => {
    const biome = attrBiome || 'unknown terrain';
    const contents = kind ? `Contains ${kind}` : 'Empty';
    const align = alignment ? `Alignment: ${alignment}` : '';
    return `Hex at column ${col}, row ${row}. ${biome}. ${contents}. ${align}`;
  }, [col, row, kind, attrBiome, alignment]);

  // Determine rendering mode
  const isAvatar = kind === 'AVATAR' || kind === 'ARMY';
  const isOrder = kind === 'ORDER';

  return (
    <div
      className="absolute group hex-wrapper z-10 hover:z-[100] pointer-events-none"
      style={style}
      data-col={col}
      data-row={row}
      role="gridcell"
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onHexClick(col, row);
      }}
    >
      <div
        className={`hex pointer-events-auto transition-all duration-300 ease-out 
          ${!usePngTile ? glowClass : ''} 
          ${hasError ? 'error animate-pulse' : ''} 
          ${isActive ? 'active' : ''}
          ${isGhost ? 'opacity-40 grayscale scale-95' : ''}
        `}
        style={alignmentStyle}
      >
        {/* PNG Tile Background */}
        {tileUrl && (
          <div className="absolute inset-0 z-0 clip-hex">
            <img
              src={tileUrl}
              alt=""
              className="w-full h-full object-cover scale-105"
              style={{ imageRendering: 'pixelated' }}
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}

        <div className="hex-content flex flex-col items-center justify-center relative w-full h-full z-10">

          {/* Layer 1: Avatar Token */}
          {isAvatar && icon ? (
            <div
              className="size-16 rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-20 border-4 transition-transform group-hover:scale-110 group-hover:-translate-y-2"
              style={{
                backgroundColor: '#1a1122',
                borderColor: ownerColor || '#fff',
                boxShadow: `0 0 20px ${ownerColor}44`
              }}
            >
              <span className="material-symbols-outlined text-3xl" style={{ color: ownerColor || '#fff' }}>
                {icon}
              </span>
              {/* Token Shine */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
            </div>
          ) : isOrder && icon ? (
            <div className="relative z-20">
              <span className={`material-symbols-outlined text-5xl drop-shadow-lg ${hasError ? 'text-red-100' : 'text-white'}`} style={ownerColor ? { color: ownerColor } : undefined}>
                {icon}
              </span>
              <div className="absolute -bottom-2 -right-2 bg-black/80 border border-white/20 rounded-full p-1 shadow-lg">
                <span className="material-symbols-outlined text-xs text-primary">verified</span>
              </div>
            </div>
          ) : (
            // Standard Icon
            icon && (
              <span className={`material-symbols-outlined text-4xl opacity-90 drop-shadow-lg transition-all 
                ${hasError ? 'text-red-100' : isGhost ? 'text-primary' : ownerColor ? '' : 'text-white/30'}`}
                style={ownerColor ? { color: ownerColor } : undefined}
                aria-hidden="true"
              >
                {icon}
              </span>
            )
          )}

          {/* Owner Overlay Tint */}
          {ownerColor && !isAvatar && (
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundColor: ownerColor }} aria-hidden="true"></div>
          )}
        </div>
      </div>
    </div>
  );
});

HexCell.displayName = 'HexCell';
