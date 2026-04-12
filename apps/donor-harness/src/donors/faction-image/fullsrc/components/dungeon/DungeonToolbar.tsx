import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, Download, FileJson } from 'lucide-react';
import type { DungeonMap, RenderConfig } from '@/lib/dungeon/types';
import { exportPNG, exportJSON } from '@/lib/dungeon/export';

interface DungeonToolbarProps {
  dungeon: DungeonMap | null;
  renderConfig: RenderConfig;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export function DungeonToolbar({
  dungeon,
  renderConfig,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
}: DungeonToolbarProps) {
  return (
    <div className="h-12 border-b border-border bg-card flex items-center px-3 gap-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onZoomOut} title="Zoom out">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground font-mono w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="ghost" size="icon" onClick={onZoomIn} title="Zoom in">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onResetView} title="Reset view">
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1" />

      {dungeon && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-2">
            {dungeon.rooms.length} rooms • {dungeon.corridors.length} corridors
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => exportPNG(dungeon, renderConfig)}
          >
            <Download className="h-3.5 w-3.5" />
            PNG
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => exportJSON(dungeon)}
          >
            <FileJson className="h-3.5 w-3.5" />
            JSON
          </Button>
        </div>
      )}
    </div>
  );
}
