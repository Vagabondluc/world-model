import { useRef, useEffect, useCallback } from 'react';
import type { DungeonMap, ViewState, RenderConfig } from '@/lib/dungeon/types';
import { renderDungeon } from '@/lib/dungeon/renderer';

interface DungeonCanvasProps {
  dungeon: DungeonMap | null;
  view: ViewState;
  renderConfig: RenderConfig;
  hoveredRoomId: number | null;
  onViewChange: (view: ViewState) => void;
  onHoverRoom: (id: number | null) => void;
}

export function DungeonCanvas({
  dungeon,
  view,
  renderConfig,
  hoveredRoomId,
  onViewChange,
  onHoverRoom,
}: DungeonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Resize canvas to container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !dungeon) {
      if (ctx) {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#6a6a8a';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Click "Generate" to create a dungeon', canvas.width / 2, canvas.height / 2);
      }
      return;
    }
    renderDungeon(ctx, dungeon, view, renderConfig, canvas.width, canvas.height, hoveredRoomId);
  }, [dungeon, view, renderConfig, hoveredRoomId]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isPanningRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanningRef.current) {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      onViewChange({
        ...view,
        offsetX: view.offsetX + dx,
        offsetY: view.offsetY + dy,
      });
      return;
    }

    // Hover detection
    if (!dungeon) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left - view.offsetX;
    const my = e.clientY - rect.top - view.offsetY;
    const s = renderConfig.cellSize * view.zoom;
    const cellX = Math.floor(mx / s);
    const cellY = Math.floor(my / s);

    let found: number | null = null;
    for (const room of dungeon.rooms) {
      if (cellX >= room.x && cellX < room.x + room.width &&
          cellY >= room.y && cellY < room.y + room.height) {
        found = room.id;
        break;
      }
    }
    onHoverRoom(found);
  }, [dungeon, view, renderConfig, onViewChange, onHoverRoom]);

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  // Zoom with wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.25, Math.min(5, view.zoom * factor));
    onViewChange({ ...view, zoom: newZoom });
  }, [view, onViewChange]);

  return (
    <div ref={containerRef} className="flex-1 overflow-hidden bg-[#1a1a2e] cursor-grab active:cursor-grabbing">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="block w-full h-full"
      />
    </div>
  );
}
