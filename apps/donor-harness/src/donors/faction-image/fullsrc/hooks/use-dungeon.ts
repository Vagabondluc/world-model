import { useState, useCallback } from 'react';
import type { DungeonMap, GenerationConfig, ViewState, RenderConfig } from '@/lib/dungeon/types';
import { DEFAULT_CONFIG, DEFAULT_RENDER_CONFIG } from '@/lib/dungeon/types';
import { generateDungeon } from '@/lib/dungeon/generator';

export function useDungeon() {
  const [config, setConfig] = useState<GenerationConfig>(DEFAULT_CONFIG);
  const [renderConfig, setRenderConfig] = useState<RenderConfig>(DEFAULT_RENDER_CONFIG);
  const [dungeon, setDungeon] = useState<DungeonMap | null>(null);
  const [view, setView] = useState<ViewState>({ offsetX: 40, offsetY: 40, zoom: 1 });
  const [hoveredRoomId, setHoveredRoomId] = useState<number | null>(null);

  const generate = useCallback(() => {
    const d = generateDungeon(config);
    setDungeon(d);
    setView({ offsetX: 40, offsetY: 40, zoom: 1 });
    setHoveredRoomId(null);
  }, [config]);

  const updateConfig = useCallback((partial: Partial<GenerationConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const updateRenderConfig = useCallback((partial: Partial<RenderConfig>) => {
    setRenderConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const zoomIn = useCallback(() => {
    setView(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.25, 5) }));
  }, []);

  const zoomOut = useCallback(() => {
    setView(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.25, 0.25) }));
  }, []);

  const resetView = useCallback(() => {
    setView({ offsetX: 40, offsetY: 40, zoom: 1 });
  }, []);

  return {
    config,
    renderConfig,
    dungeon,
    view,
    hoveredRoomId,
    setView,
    setHoveredRoomId,
    generate,
    updateConfig,
    updateRenderConfig,
    zoomIn,
    zoomOut,
    resetView,
  };
}
