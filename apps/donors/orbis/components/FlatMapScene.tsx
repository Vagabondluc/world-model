
import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as PixiReact from '@pixi/react';
import * as PIXI from 'pixi.js';
import * as THREE from 'three';
import { HexData, ViewMode, TerraformMode } from '../types';
import { MAP_WIDTH, MAP_HEIGHT, sphericalToCartesian2D, cartesian2DToSphericalVector, findOptimalSeam } from '../utils/projection';
import { useWorldStore } from '../stores/useWorldStore';
import { useUIStore } from '../stores/useUIStore';
import { MAP_PADDING } from './map/mapRenderUtils';
import { HexLayer } from './map/HexLayer';
import { SelectionLayer } from './map/SelectionLayer';

// Safe destructuring for ESM/CJS interop
const { Stage, Container, Graphics } = (PixiReact as any).default || PixiReact;

interface FlatMapSceneProps {
  hexes: HexData[];
  viewMode: ViewMode;
  onSelectHex: (hex: HexData) => void;
  selectedHexId: string | null;
  terraformMode: TerraformMode;
  onApplyBrush: (id: string) => void;
}

export const FlatMapScene: React.FC<FlatMapSceneProps> = ({ 
  hexes, viewMode, onSelectHex, selectedHexId, terraformMode, onApplyBrush 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: MAP_PADDING, y: 0 });
  const [scale, setScale] = useState(0.8);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const stageOptions = useMemo(() => ({ backgroundAlpha: 0, antialias: true }), []);
  const { config } = useWorldStore();
  const { mapProjection } = useUIStore();

  // Region View Logic
  const regionData = useMemo(() => {
    if (mapProjection === 'LOCAL' && selectedHexId) {
        const center = hexes.find(h => h.id === selectedHexId);
        if (center) {
            // Include center + immediate neighbors
            const subset = hexes.filter(h => h.id === selectedHexId || center.neighbors.includes(h.id));
            const centerVec = new THREE.Vector3(...center.center);
            return { subset, centerVec };
        }
    }
    return { subset: hexes, centerVec: undefined };
  }, [hexes, selectedHexId, mapProjection]);

  const seamOffset = useMemo(() => {
    return findOptimalSeam(hexes, config.seaLevel);
  }, [hexes, config.seaLevel]);

  // Reset viewport when switching projections
  useEffect(() => {
    if (mapProjection === 'LOCAL') {
        // Zoom in and center for Local Mode
        setScale(4.0);
        setPosition({ x: 0, y: 0 });
    } else {
        // Default overview
        setScale(0.8);
        setPosition({ x: MAP_PADDING, y: 0 });
    }
  }, [mapProjection]);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
           requestAnimationFrame(() => setDimensions({ width, height }));
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = -e.deltaY * 0.001;
    const minZoom = mapProjection === 'LOCAL' ? 1 : 0.2;
    const maxZoom = mapProjection === 'LOCAL' ? 20 : 10;
    const newScale = Math.min(Math.max(minZoom, scale + zoomFactor), maxZoom);
    setScale(newScale);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      setPosition({ x: position.x + dx, y: position.y + dy });
      setLastPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return; 
    
    // Hit testing for LOCAL mode is simpler (Cartesian distance)
    // Hit testing for Global maps uses Inverse Projection (Sphere)
    
    const stageW = dimensions.width;
    const stageH = dimensions.height;
    
    // Determine Stage Origin based on Mode
    let stageOriginX = 0, stageOriginY = 0;
    
    if (mapProjection === 'LOCAL') {
        // Centered at screen center
        stageOriginX = stageW / 2 + position.x;
        stageOriginY = stageH / 2 + position.y;
    } else {
        // Centered based on map dimensions
        stageOriginX = (stageW - MAP_WIDTH * scale) / 2 + position.x;
        stageOriginY = (stageH - MAP_HEIGHT * scale) / 2 + position.y;
    }

    const mapX = (e.clientX - stageOriginX) / scale;
    const mapY = (e.clientY - stageOriginY) / scale;

    let closestHex: HexData | null = null;

    if (mapProjection === 'LOCAL') {
        // Simple distance check in local plane
        // mapX, mapY are already in the projected space
        let minD = Infinity;
        regionData.subset.forEach(h => {
            const [hx, hy] = sphericalToCartesian2D(h.center[0], h.center[1], h.center[2], 0, 'LOCAL', regionData.centerVec);
            const d = Math.sqrt((mapX - hx)**2 + (mapY - hy)**2);
            // Rough hex radius check (~20-50 units depending on scale, let's just pick nearest)
            if (d < minD) {
                minD = d;
                closestHex = h;
            }
        });
        // Max click radius for safety
        if (minD > 50) closestHex = null;

    } else {
        // Global Map Inverse
        let normalizedX = mapX;
        if (mapProjection === 'EQUIRECTANGULAR') {
          if (normalizedX < 0) normalizedX += MAP_WIDTH;
          if (normalizedX > MAP_WIDTH) normalizedX -= MAP_WIDTH;
        }

        if (normalizedX < 0 || normalizedX > MAP_WIDTH || mapY < 0 || mapY > MAP_HEIGHT) return;

        const targetVec = cartesian2DToSphericalVector(normalizedX, mapY, seamOffset, mapProjection);
        let closestDist = -1.0;
        hexes.forEach(h => {
            const dot = targetVec.x * h.center[0] + targetVec.y * h.center[1] + targetVec.z * h.center[2];
            if (dot > closestDist) {
                closestDist = dot;
                closestHex = h;
            }
        });
    }

    if (closestHex) {
        if (terraformMode === TerraformMode.SELECT) {
            onSelectHex(closestHex);
        } else {
            onApplyBrush((closestHex as HexData).id);
        }
    }
  };

  // Determine container offset
  const containerX = mapProjection === 'LOCAL' 
    ? (dimensions.width / 2) + position.x
    : (dimensions.width - MAP_WIDTH * scale) / 2 + position.x;
    
  const containerY = mapProjection === 'LOCAL'
    ? (dimensions.height / 2) + position.y
    : (dimensions.height - MAP_HEIGHT * scale) / 2 + position.y;

  return (
    <div 
        ref={containerRef}
        className="w-full h-full bg-[#050510] cursor-move overflow-hidden relative"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleClick}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Stage width={dimensions.width} height={dimensions.height} options={stageOptions}>
            <Container 
                x={containerX} 
                y={containerY} 
                scale={scale}
            >
                {/* Background Graphics depend on Projection Type */}
                <Graphics draw={g => {
                    g.clear();
                    if (mapProjection !== 'LOCAL') {
                        g.beginFill(0x0f172a);
                        if (mapProjection === 'EQUIRECTANGULAR') {
                            g.drawRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
                            g.endFill();
                            // Guides
                            g.lineStyle(2, 0x334155, 0.5);
                            g.moveTo(-MAP_PADDING, 0); g.lineTo(MAP_WIDTH + MAP_PADDING, 0);
                            g.moveTo(-MAP_PADDING, MAP_HEIGHT); g.lineTo(MAP_WIDTH + MAP_PADDING, MAP_HEIGHT);
                        } else if (mapProjection === 'MOLLWEIDE') {
                            g.drawEllipse(MAP_WIDTH/2, MAP_HEIGHT/2, MAP_WIDTH/2, MAP_HEIGHT/2);
                            g.endFill();
                        }
                    }
                }} />
                
                <HexLayer 
                    hexes={regionData.subset} 
                    viewMode={viewMode}
                    offsetRadians={seamOffset}
                    projection={mapProjection}
                    centerHex={regionData.centerVec}
                />
                
                <SelectionLayer 
                    selectedHexId={selectedHexId}
                    hexes={regionData.subset}
                    scale={scale}
                    offsetRadians={seamOffset}
                    projection={mapProjection}
                    centerHex={regionData.centerVec}
                />
            </Container>
        </Stage>
      )}
      
      {/* HUD overlay */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700 text-xs font-mono text-slate-400 pointer-events-none flex flex-col items-center">
        <span>{mapProjection === 'LOCAL' ? 'Region Projection' : mapProjection === 'EQUIRECTANGULAR' ? 'Equirectangular' : 'Mollweide'}</span>
        <span className="text-[9px] text-slate-500">
            {mapProjection === 'LOCAL' ? 'Localized Tangent Plane (No Distortion)' : mapProjection === 'EQUIRECTANGULAR' ? 'High distortion at poles' : 'Equal-area, reduced distortion'}
        </span>
      </div>
    </div>
  );
};
