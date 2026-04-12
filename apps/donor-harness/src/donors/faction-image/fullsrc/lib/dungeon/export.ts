import type { DungeonMap, RenderConfig } from './types';
import { renderExport } from './renderer';

export function exportPNG(dungeon: DungeonMap, renderConfig: RenderConfig, filename = 'dungeon.png'): void {
  const canvas = renderExport(dungeon, renderConfig);
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function exportJSON(dungeon: DungeonMap, filename = 'dungeon.json'): void {
  const json = JSON.stringify(dungeon, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}
