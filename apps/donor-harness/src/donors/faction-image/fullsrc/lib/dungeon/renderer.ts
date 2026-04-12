import type { DungeonMap, RenderConfig, ViewState } from './types';

const COLORS = {
  background: '#1a1a2e',
  grid: '#252540',
  wall: '#4a4a6a',
  floor: {
    normal: '#2d2d4a',
    entrance: '#2a3a2a',
    boss: '#3a2a2a',
    treasure: '#3a3a2a',
  },
  corridor: '#2d2d4a',
  door: '#c8a832',
  wallStroke: '#6a6a8a',
  label: '#e0e0e0',
  highlight: 'rgba(255,255,255,0.08)',
};

export function renderDungeon(
  ctx: CanvasRenderingContext2D,
  dungeon: DungeonMap,
  view: ViewState,
  renderConfig: RenderConfig,
  canvasWidth: number,
  canvasHeight: number,
  hoveredRoomId: number | null
): void {
  const { cellSize, showGrid, showLabels, showDoors } = renderConfig;
  const { offsetX, offsetY, zoom } = view;
  const s = cellSize * zoom;

  // Clear
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.save();
  ctx.translate(offsetX, offsetY);

  // Grid
  if (showGrid) {
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= dungeon.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * s, 0);
      ctx.lineTo(x * s, dungeon.height * s);
      ctx.stroke();
    }
    for (let y = 0; y <= dungeon.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * s);
      ctx.lineTo(dungeon.width * s, y * s);
      ctx.stroke();
    }
  }

  // Corridors
  for (const corridor of dungeon.corridors) {
    ctx.fillStyle = COLORS.corridor;
    const hw = Math.floor(corridor.width / 2);
    for (let i = 0; i < corridor.points.length - 1; i++) {
      const a = corridor.points[i];
      const b = corridor.points[i + 1];
      const minX = Math.min(a.x, b.x) - hw;
      const maxX = Math.max(a.x, b.x) + hw;
      const minY = Math.min(a.y, b.y) - hw;
      const maxY = Math.max(a.y, b.y) + hw;
      ctx.fillRect(minX * s, minY * s, (maxX - minX + 1) * s, (maxY - minY + 1) * s);
    }
  }

  // Rooms
  for (const room of dungeon.rooms) {
    const floorColor = COLORS.floor[room.type] || COLORS.floor.normal;

    // Floor
    ctx.fillStyle = floorColor;
    ctx.fillRect(room.x * s, room.y * s, room.width * s, room.height * s);

    // Hover highlight
    if (hoveredRoomId === room.id) {
      ctx.fillStyle = COLORS.highlight;
      ctx.fillRect(room.x * s, room.y * s, room.width * s, room.height * s);
    }

    // Walls
    ctx.strokeStyle = COLORS.wallStroke;
    ctx.lineWidth = 2 * zoom;
    ctx.strokeRect(room.x * s, room.y * s, room.width * s, room.height * s);

    // Doors
    if (showDoors) {
      for (const door of room.doors) {
        ctx.fillStyle = COLORS.door;
        const dx = door.position.x * s;
        const dy = door.position.y * s;
        ctx.fillRect(dx + s * 0.2, dy + s * 0.2, s * 0.6, s * 0.6);
      }
    }

    // Labels
    if (showLabels && room.label) {
      ctx.fillStyle = COLORS.label;
      ctx.font = `${Math.max(10, 12 * zoom)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        room.label,
        (room.x + room.width / 2) * s,
        (room.y + room.height / 2) * s
      );
    }

    // Room number
    if (showLabels && !room.label) {
      ctx.fillStyle = COLORS.label;
      ctx.font = `${Math.max(8, 10 * zoom)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.5;
      ctx.fillText(
        `${room.id}`,
        (room.x + room.width / 2) * s,
        (room.y + room.height / 2) * s
      );
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();
}

export function renderExport(
  dungeon: DungeonMap,
  renderConfig: RenderConfig
): HTMLCanvasElement {
  const { cellSize } = renderConfig;
  const canvas = document.createElement('canvas');
  canvas.width = dungeon.width * cellSize;
  canvas.height = dungeon.height * cellSize;
  const ctx = canvas.getContext('2d')!;

  const view: ViewState = { offsetX: 0, offsetY: 0, zoom: 1 };
  renderDungeon(ctx, dungeon, view, renderConfig, canvas.width, canvas.height, null);

  return canvas;
}
