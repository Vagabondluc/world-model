
import React, { useRef, useEffect, useState, useMemo } from 'react';
import HexGrid from './HexGrid';
import BiomeToolbar from './BiomeToolbar';
import ParticleOverlay from './ParticleOverlay';
import { BiomeType } from '../types';
import { useGameStore } from '../store/gameStore';
import { ACTION_REGISTRY } from '../logic/actions';
import { getMapDimensions } from '../logic/geometry';

interface MapViewportProps {
  isErrorState: boolean;
  toggleErrorState: () => void;
  activeExternalAction?: string | null;
}

const MapViewport: React.FC<MapViewportProps> = ({ isErrorState, toggleErrorState, activeExternalAction }) => {
  const state = useGameStore();
  const { setPreview } = state;
  const mapSize = state.config?.mapSize || 'STANDARD';

  const dimensions = useMemo(() => getMapDimensions(mapSize), [mapSize]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [activeBiome, setActiveBiome] = useState<BiomeType | null>(null);
  const [hoveredHex, setHoveredHex] = useState<{ q: number, r: number } | null>(null);

  const isDragging = useRef(false);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startScrollPos = useRef({ left: 0, top: 0 });

  // Handle Biome Painting
  useEffect(() => {
    if (activeBiome && state.activeSelection.kind === 'HEX') {
      const actionDef = ACTION_REGISTRY['A1_ADD_TERRAIN'];
      if (actionDef) {
        const selectionWithBiome = { ...state.activeSelection, biome: activeBiome };
        const ghost = actionDef.buildEvent(state as unknown as any, selectionWithBiome as any);
        setPreview(ghost);
      }
    }
  }, [activeBiome, state.activeSelection, state.age, setPreview]);

  const handleMapHover = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest('.hex-wrapper');
    if (target instanceof HTMLElement) {
      const q = parseInt(target.dataset.col || '0');
      const r = parseInt(target.dataset.row || '0');
      if (hoveredHex?.q !== q || hoveredHex?.r !== r) {
        setHoveredHex({ q, r });
      }
    }
  };

  const handleRecenter = () => {
    if (scrollContainerRef.current) {
      // Center based on map dimensions
      const centerX = (dimensions.width * zoom - scrollContainerRef.current.clientWidth) / 2;
      const centerY = (dimensions.height * zoom - scrollContainerRef.current.clientHeight) / 2;

      scrollContainerRef.current.scrollTo({
        left: Math.max(0, centerX + 200), // +200 for padding
        top: Math.max(0, centerY + 200),
        behavior: 'smooth'
      });
    }
  };

  // Initial Center
  useEffect(() => {
    handleRecenter();
  }, [dimensions, zoom]);

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    startMousePos.current = { x: e.clientX, y: e.clientY };
    if (scrollContainerRef.current) {
      startScrollPos.current = {
        left: scrollContainerRef.current.scrollLeft,
        top: scrollContainerRef.current.scrollTop
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !scrollContainerRef.current) return;
      const dx = e.clientX - startMousePos.current.x;
      const dy = e.clientY - startMousePos.current.y;
      scrollContainerRef.current.scrollLeft = startScrollPos.current.left - dx;
      scrollContainerRef.current.scrollTop = startScrollPos.current.top - dy;
    };

    const handleMouseUp = () => { isDragging.current = false; };

    // Keyboard Navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollContainerRef.current) return;

      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isInput) return;

      const SCROLL_STEP = 100;

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          scrollContainerRef.current.scrollBy({ top: -SCROLL_STEP, behavior: 'smooth' });
          break;
        case 's':
        case 'arrowdown':
          // Check for shortcuts that use 's' (like Ctrl+S)
          if (!e.ctrlKey && !e.metaKey) {
            scrollContainerRef.current.scrollBy({ top: SCROLL_STEP, behavior: 'smooth' });
          }
          break;
        case 'a':
        case 'arrowleft':
          scrollContainerRef.current.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
          break;
        case 'd':
        case 'arrowright':
          scrollContainerRef.current.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
          break;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Padding for the scrolling area to allow panning past edges
  const PAD = 400;

  return (
    <section className="relative flex-1 bg-[#0f0f12] overflow-hidden group select-none">
      {/* Biome Painter Toolbar */}
      {state.age === 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-8 duration-500">
          <BiomeToolbar activeBiome={activeBiome} onSelectBiome={setActiveBiome} />
        </div>
      )}

      {/* Coordinate HUD */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-4 pointer-events-none">
        <div className="bg-bg-input/90 backdrop-blur rounded-lg border border-white/5 px-4 py-2 shadow-2xl flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-0.5">Cursor</span>
            <span className="text-xs font-mono font-medium text-white/80">
              {hoveredHex ? `${hoveredHex.q}, ${hoveredHex.r}` : 'NO SIGNAL'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-0.5">Grid</span>
            <span className="text-xs font-mono font-medium text-white/80">
              {dimensions.cols}x{dimensions.rows}
            </span>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2">
        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="bg-bg-input p-2 rounded-lg border border-white/5 text-text-muted hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
        <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="bg-bg-input p-2 rounded-lg border border-white/5 text-text-muted hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">remove</span>
        </button>
        <button onClick={handleRecenter} className="bg-bg-input p-2 rounded-lg border border-white/5 text-text-muted hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">center_focus_strong</span>
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        onMouseDown={onMouseDown}
        onMouseMove={handleMapHover}
        className="h-full w-full overflow-hidden bg-[#0a0a0c] relative cursor-grab active:cursor-grabbing"
      >
        <div
          className="relative inline-block origin-top-left"
          style={{
            width: `${dimensions.width + PAD * 2}px`,
            height: `${dimensions.height + PAD * 2}px`,
            padding: `${PAD}px`,
            transform: `scale(${zoom})`
          }}
        >
          <div className="pointer-events-auto relative">
            <HexGrid isErrorState={isErrorState} />
            <ParticleOverlay width={dimensions.width} height={dimensions.height} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapViewport;
