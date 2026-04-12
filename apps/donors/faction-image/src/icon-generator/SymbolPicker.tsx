import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BlendMode } from "@/icon-generator/types";
import { useDiscovery } from "@/icon-discovery/DiscoveryContext";
import type { IconKeywordRecord } from "@/icon-discovery/types";

type Props = {
  onSymbolSelect: (symbol: {
    assetId: string;
    assetPath: string;
    sourceHash: string;
    color: string;
    opacity: number;
    blendMode: BlendMode;
    outlineWidth: number;
    outlineColor: string;
    outlinePosition: "inside" | "center" | "outside";
  }) => void;
  currentSymbol?: IconKeywordRecord | null;
};

export function SymbolPicker({ onSymbolSelect, currentSymbol }: Props) {
  const { state: discoveryState, setQuery } = useDiscovery();
  const [query, setLocalQuery] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<IconKeywordRecord | null>(currentSymbol ?? null);
  const [fillColor, setFillColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(1);
  const [blendMode, setBlendMode] = useState<BlendMode>("normal");
  const [outlineWidth, setOutlineWidth] = useState(0);
  const [outlineColor, setOutlineColor] = useState("#000000");
  const [outlinePosition, setOutlinePosition] = useState<"inside" | "center" | "outside">("center");
  const [visibleCount, setVisibleCount] = useState(18); // 6 cols × 3 rows

  const GRID_COLS = 6;
  const visibleIcons = discoveryState.results.slice(0, visibleCount);

  useEffect(() => {
    // Debounce search query
    const timer = setTimeout(() => {
      setQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, setQuery]);

  const handleSelectIcon = (icon: IconKeywordRecord) => {
    setSelectedIcon(icon);
  };

  const handleAddSymbol = () => {
    if (!selectedIcon) return;
    onSymbolSelect({
      assetId: selectedIcon.id,
      assetPath: selectedIcon.assetPath,
      sourceHash: selectedIcon.id, // TODO: compute actual hash
      color: fillColor,
      opacity,
      blendMode,
      outlineWidth,
      outlineColor,
      outlinePosition,
    });
  };

  return (
    <div className="space-y-4 border-b border-border pb-4">
      <div>
        <Label className="text-base font-semibold">Symbol</Label>
        <p className="text-xs text-muted-foreground mb-2">Hero element of the sigil</p>
      </div>

      {/* Search field */}
      <Input
        placeholder="Search 4000+ symbols..."
        value={query}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="text-sm"
      />
      <p className="text-xs text-muted-foreground">
        {discoveryState.loading ? "Searching..." : `${discoveryState.results.length} results`}
      </p>

      {/* Symbol grid (6 cols, scrollable) */}
      <div className="border border-border rounded-md p-2 bg-muted/30">
        <div
          className="gap-2"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {visibleIcons.map((icon) => (
            <button
              key={icon.id}
              type="button"
              onClick={() => handleSelectIcon(icon)}
              className={`relative w-full aspect-square rounded border-2 transition-all flex items-center justify-center bg-white overflow-hidden ${
                selectedIcon?.id === icon.id
                  ? "border-primary shadow-md ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50"
              }`}
              title={icon.id}
            >
              {/* SVG Thumbnail */}
              <svg viewBox="0 0 128 128" className="w-full h-full p-1">
                <rect width="128" height="128" fill="white" />
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="text-[12px] fill-muted-foreground select-none pointer-events-none"
                >
                  {icon.id.split("/").pop()?.slice(0, 10) || "icon"}
                </text>
              </svg>
            </button>
          ))}
        </div>
        {discoveryState.results.length > visibleCount && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => setVisibleCount((n) => n + 18)}
          >
            Load More
          </Button>
        )}
      </div>

      {/* Selected symbol preview + controls */}
      {selectedIcon && (
        <div className="space-y-3 bg-muted/20 p-3 rounded-md border border-border">
          <div>
            <p className="text-sm font-medium">{selectedIcon.id}</p>
            <p className="text-xs text-muted-foreground">{selectedIcon.keywords.slice(0, 3).join(", ")}</p>
          </div>

          {/* Symbol controls */}
          <div className="space-y-2">
            <div>
              <Label className="text-xs">Fill Color</Label>
              <Input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="h-8 p-1 cursor-pointer w-full"
              />
            </div>

            <div>
              <Label className="text-xs">Outline Width: {outlineWidth.toFixed(0)}px</Label>
              <Slider
                min={0}
                max={8}
                step={0.5}
                value={[outlineWidth]}
                onValueChange={([v]) => setOutlineWidth(v)}
              />
            </div>

            {outlineWidth > 0 && (
              <>
                <div>
                  <Label className="text-xs">Outline Color</Label>
                  <Input
                    type="color"
                    value={outlineColor}
                    onChange={(e) => setOutlineColor(e.target.value)}
                    className="h-8 p-1 cursor-pointer w-full"
                  />
                </div>

                <div>
                  <Label className="text-xs">Outline Position</Label>
                  <Select value={outlinePosition} onValueChange={(v) => setOutlinePosition(v as "inside" | "center" | "outside")}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inside">Inside</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="outside">Outside</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div>
              <Label className="text-xs">Opacity: {opacity.toFixed(2)}</Label>
              <Slider
                min={0.1}
                max={1}
                step={0.05}
                value={[opacity]}
                onValueChange={([v]) => setOpacity(v)}
              />
            </div>

            <div>
              <Label className="text-xs">Blend Mode</Label>
              <Select value={blendMode} onValueChange={(v) => setBlendMode(v as BlendMode)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="multiply">Multiply</SelectItem>
                  <SelectItem value="screen">Screen</SelectItem>
                  <SelectItem value="overlay">Overlay</SelectItem>
                  <SelectItem value="lighten">Lighten</SelectItem>
                  <SelectItem value="darken">Darken</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddSymbol} className="w-full h-8 text-sm mt-2">
              Use Symbol
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
