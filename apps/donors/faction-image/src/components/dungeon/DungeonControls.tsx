import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dices, Wand2 } from 'lucide-react';
import type { GenerationConfig, RenderConfig } from '@/lib/dungeon/types';

interface DungeonControlsProps {
  config: GenerationConfig;
  renderConfig: RenderConfig;
  seed: number | null;
  onConfigChange: (partial: Partial<GenerationConfig>) => void;
  onRenderConfigChange: (partial: Partial<RenderConfig>) => void;
  onGenerate: () => void;
}

export function DungeonControls({
  config,
  renderConfig,
  seed,
  onConfigChange,
  onRenderConfigChange,
  onGenerate,
}: DungeonControlsProps) {
  return (
    <div className="w-72 border-r border-border bg-card p-4 flex flex-col gap-5 overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-card-foreground mb-1 tracking-tight font-mono">
          ⚔ Dungeon Generator
        </h2>
        <p className="text-xs text-muted-foreground">Configure and generate procedural dungeons</p>
      </div>

      <Button onClick={onGenerate} className="w-full gap-2" size="lg">
        <Wand2 className="h-4 w-4" />
        Generate Dungeon
      </Button>

      {seed !== null && (
        <p className="text-xs text-muted-foreground font-mono">Seed: {seed}</p>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">Map Size</h3>

        <div className="space-y-2">
          <Label className="text-xs">Width: {config.mapWidth}</Label>
          <Slider
            value={[config.mapWidth]}
            onValueChange={([v]) => onConfigChange({ mapWidth: v })}
            min={30}
            max={120}
            step={5}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Height: {config.mapHeight}</Label>
          <Slider
            value={[config.mapHeight]}
            onValueChange={([v]) => onConfigChange({ mapHeight: v })}
            min={30}
            max={120}
            step={5}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">Rooms</h3>

        <div className="space-y-2">
          <Label className="text-xs">Count: {config.roomCount}</Label>
          <Slider
            value={[config.roomCount]}
            onValueChange={([v]) => onConfigChange({ roomCount: v })}
            min={3}
            max={30}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Min Size: {config.roomSizeMin}</Label>
          <Slider
            value={[config.roomSizeMin]}
            onValueChange={([v]) => onConfigChange({ roomSizeMin: v })}
            min={3}
            max={config.roomSizeMax}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Max Size: {config.roomSizeMax}</Label>
          <Slider
            value={[config.roomSizeMax]}
            onValueChange={([v]) => onConfigChange({ roomSizeMax: v })}
            min={config.roomSizeMin}
            max={20}
            step={1}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">Corridors</h3>
        <div className="space-y-2">
          <Label className="text-xs">Width: {config.corridorWidth}</Label>
          <Slider
            value={[config.corridorWidth]}
            onValueChange={([v]) => onConfigChange({ corridorWidth: v })}
            min={1}
            max={4}
            step={1}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">Seed</h3>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Random"
            value={config.seed ?? ''}
            onChange={(e) => onConfigChange({
              seed: e.target.value ? parseInt(e.target.value) : null
            })}
            className="text-xs font-mono"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onConfigChange({ seed: Math.floor(Math.random() * 2147483647) })}
            title="Random seed"
          >
            <Dices className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground">Display</h3>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Grid</Label>
          <Switch
            checked={renderConfig.showGrid}
            onCheckedChange={(v) => onRenderConfigChange({ showGrid: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Labels</Label>
          <Switch
            checked={renderConfig.showLabels}
            onCheckedChange={(v) => onRenderConfigChange({ showLabels: v })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Doors</Label>
          <Switch
            checked={renderConfig.showDoors}
            onCheckedChange={(v) => onRenderConfigChange({ showDoors: v })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Cell Size: {renderConfig.cellSize}px</Label>
          <Slider
            value={[renderConfig.cellSize]}
            onValueChange={([v]) => onRenderConfigChange({ cellSize: v })}
            min={8}
            max={32}
            step={2}
          />
        </div>
      </div>
    </div>
  );
}
